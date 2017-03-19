import 'rxjs/add/operator/switchMap';

import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

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
        this.list = this.spud_service.get_list(this.type_obj)
    }

    select_object(object : GenObject) {
        this.selected_object = object;
    }
}

export abstract class BaseDetailComponent<GenObject extends BaseObject>
        implements OnInit {

    private readonly base_url : string = base_url

    abstract title : string;
    @Input('object') set input_object(object: GenObject) {
        this.object = object;
        this.load_object(object.id);
    }

    @Input() list : ObjectList<GenObject>;
    private error : string;
    private object : GenObject;
    private prev_id : number;
    private next_id : number;

    constructor(
        readonly type_obj : BaseType<GenObject>,
        private route: ActivatedRoute,
        private spud_service: SpudService,
    ) {}

    ngOnInit(): void {
        if (this.object != null) {
            return
        }

        this.route.params
            .switchMap((params: Params) => {
                let id : number = params['id'];
                let x : Promise<GenObject> = this.spud_service.get_object(this.type_obj, id)
                return x
            })
            .subscribe(
                object => {
                    this.object = object;
                    this.error = null;
                },
                message => {
                    this.object = null;
                    this.error = message;
                }
            )
    }

    load_object(id : number) {
        console.log("xxxxx", id)
        this.spud_service.get_object(this.type_obj, id)
            .then(
                loaded_object => {
                    this.object = loaded_object;
                    this.error = null;
                    let index = this.list.get_index(loaded_object.id);
                    this.prev_id = index.prev_id;
                    this.next_id = index.next_id;
                    console.log("yyyyy", this.prev_id, this.next_id);
                },
            )
            .catch(
                message => {
                    this.object = null;
                    this.error = message;
                }
            )
    }

    load_prev_object() : void {
        this.load_object(this.prev_id)
    }

    load_next_object() : void {
        if (this.next_id != null) {
            this.load_object(this.next_id)
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
                        this.object = loaded_object;
                        this.error = null;
                        let index = this.list.get_index(loaded_object.id);
                        this.prev_id = index.prev_id;
                        this.next_id = index.next_id;
                        console.log("YYYYY", this.prev_id, this.next_id);
                    },
                )
                .catch((message : string) => {
                    this.error = message;
                })
        }

    }

    more_pages() : boolean {
        if (this.list == null) {
            return false;
        } else if (this.next_id != null) {
            return true;
        } else {
            return !this.list.finished;
        }
    }
}
