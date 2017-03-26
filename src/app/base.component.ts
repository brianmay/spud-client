import 'rxjs/add/operator/switchMap';

import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import * as s from './streamable';
import { base_url } from './settings';
import { BaseObject, BaseType } from './base';
import { SpudService, ObjectList } from './spud.service';

export abstract class BaseListComponent<GenObject extends BaseObject>
        implements OnInit {

    abstract title : string;
    private list : ObjectList<GenObject>;
    private selected_object : GenObject;

    constructor(
        readonly type_obj : BaseType<GenObject>,
        private spud_service: SpudService,
    ) {}

    ngOnInit(): void {
        this.list = this.spud_service.get_list(this.type_obj, null)
    }

    private select_object(object : GenObject) {
        this.selected_object = object
    }
}

export abstract class BaseDetailComponent<GenObject extends BaseObject>
        implements OnInit, OnChanges {

    private readonly base_url : string = base_url

    abstract title : string;

    private object_id : number;
    @Input('object_id') set input_object_id(object_id: number) {
        if (this.object_id !== object_id) {
            console.log("got input id", object_id);
            this.object_id = object_id;
            this.object = null;
        }
    }

    private object : GenObject;
    @Input('object') set input_object(object: GenObject) {
        if (this.object == null || this.object.id !== object.id) {
            console.log("got input object", object);
            this.object_id = object.id;
            this.object = object;
        }
    }
    @Output() objectChange = new EventEmitter();

    @Input() list : ObjectList<GenObject>;
    private error : string;
    private prev_id : number;
    private next_id : number;

    private child_list : ObjectList<GenObject>;

    constructor(
        readonly type_obj : BaseType<GenObject>,
        private route: ActivatedRoute,
        private spud_service: SpudService,
    ) {}

    ngOnInit(): void {
        if (this.object_id != null) {
            return
        }

        this.route.params
            .switchMap((params: Params) => {
                let id : number = params['id'];
                let x : Promise<GenObject> = this.spud_service.get_object(this.type_obj, id);
                return x;
            })
            .subscribe(
                loaded_object => this.loaded_object(loaded_object),
                message => this.handle_error(message),
            )
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (this.object == null) {
            console.log("got changes, need to load", this.object_id);
            this.spud_service.get_object(this.type_obj, this.object_id)
                .then(loaded_object => this.loaded_object(loaded_object))
                .catch((message : string) => this.handle_error(message));
        } else {
            console.log("got changes, no need to load", this.object.id);
            this.loaded_object(this.object);
        }
    }

    load_object(id : number) {
        console.log("loading with signal", id)
        this.spud_service.get_object(this.type_obj, id)
            .then(loaded_object => {
                this.loaded_object(loaded_object);
                console.log("emit(1)", loaded_object.id);
                this.objectChange.emit(loaded_object);
            })
            .catch((message : string) => this.handle_error(message))
    }

    load_prev_object() : void {
        this.load_object(this.prev_id);
    }

    load_next_object() : void {
        if (this.next_id != null) {
            this.load_object(this.next_id);
        } else {
            this.list.get_next_page()
                .then((objects : Array<GenObject>) => {
                    let index = this.list.get_index(this.object.id);
                    this.prev_id = index.prev_id;
                    this.next_id = index.next_id;
                    return this.spud_service.get_object(this.type_obj, this.next_id)
                })
                .then(
                    loaded_object => {
                        this.loaded_object(loaded_object);
                        console.log("emit(2)", loaded_object.id);
                        this.objectChange.emit(loaded_object);
                    },
                )
                .catch((message : string) => this.handle_error(message))
        }

    }

    private loaded_object(object : GenObject) : void {
        console.log("loaded", object.id);
        this.object = object;
        this.error = null;
        if (this.list != null) {
            let index = this.list.get_index(object.id);
            this.prev_id = index.prev_id;
            this.next_id = index.next_id;
        } else {
            this.prev_id = null;
            this.next_id = null;
        }

        this.child_list = this.spud_service.get_list(this.type_obj, {
            instance: object.id,
            mode: 'children'
        })
    }

    private handle_error(message: string): void {
        this.object_id = null;
        this.object = null;
        this.error = message;
    }

    private more_pages() : boolean {
        if (this.list == null) {
            return false;
        } else if (this.next_id != null) {
            return true;
        } else {
            return !this.list.finished;
        }
    }
}
