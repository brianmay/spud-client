import 'rxjs/add/operator/switchMap';
import { Subscription }   from 'rxjs/Subscription';

import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy, SimpleChange, ViewChild, Inject, HostListener } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { PageScrollService, PageScrollInstance } from 'ng2-page-scroll';

import * as s from './streamable';
import { base_url } from './settings';
import { Session } from './session';
import { BaseObject, BaseType } from './base';
import { PhotoObject, PhotoType } from './photo';
import { SpudService, ObjectList } from './spud.service';

export abstract class BaseListComponent<GenObject extends BaseObject>
        implements OnInit, OnDestroy {

    protected abstract readonly type_obj : BaseType<GenObject>
    protected session : Session = new Session();
    protected criteria : Map<string, string> = null;

    private router_subscription : Subscription;
    private session_subscription : Subscription;

    @Input() title : string;

    private _list : ObjectList<GenObject>;

    @Input() set list(list : ObjectList<GenObject>) {
        if (this._list !== list) {
            this._list = list;
            this.selected_object = null;
        }
    }
    get list() : ObjectList<GenObject> {
        return this._list;
    }
    private selected_object : GenObject;

    constructor(
        @Inject(ActivatedRoute) protected readonly route: ActivatedRoute,
        @Inject(SpudService) protected readonly spud_service: SpudService,
        @Inject(PageScrollService) protected readonly pageScrollService: PageScrollService,
    ) {}

    ngOnInit(): void {
        if (this.list == null) {
            this.router_subscription = this.route.queryParams
                .subscribe((params: Params) => {
                    this.criteria = new Map<string, string>();
                    this.criteria.set('q', params['q']);
                    this.list = this.spud_service.get_list(this.type_obj, this.criteria)
                })

        }

        this.session_subscription = this.spud_service.session_change
            .subscribe(session => {
                if (this.session !== session) {
                    this.list = this.spud_service.get_list(this.type_obj, this.criteria)
                    this.selected_object = null
                }
            });
    }

    private select_object(object : GenObject) : void {
        this.selected_object = object
    }

    ngOnDestroy() : void {
        if (this.router_subscription != null) {
            this.router_subscription.unsubscribe();
        }
        this.session_subscription.unsubscribe();
    }
}

export abstract class BaseDetailComponent<GenObject extends BaseObject>
        implements OnInit, OnChanges, OnDestroy {

    private readonly base_url : string = base_url
    protected abstract readonly type_obj : BaseType<GenObject>
    protected session : Session = new Session();

    private router_subscription : Subscription;
    private session_subscription : Subscription;

    private object : GenObject;
    @Input('object') set input_object(object: GenObject) {
        if (this.object !== object) {
            console.log("got input object", object);
            this.object = object;
        }
    }
    @Output() objectChange = new EventEmitter();

    @Output() object_selected = new EventEmitter();

    @Input() list : ObjectList<GenObject>;
    private error : string;
    private prev_id : number;
    private next_id : number;

    private child_list : ObjectList<GenObject>;
    private photo_list : ObjectList<PhotoObject>;

    @ViewChild('details') details;
    @ViewChild('image') image;
    @ViewChild('children') children;
    @ViewChild('photos') photos;

    private is_fullscreen : boolean = false;
    @HostListener("document:fullscreenchange", ['$event.target']) fullScreen0(target) {
        console.log("meow0", target, target.ownerDocument);
        this.is_fullscreen = target.ownerDocument.fullscreenElement != null;
    }
    @HostListener("document:mozfullscreenchange", ['$event.target']) fullScreen1(target) {
        console.log("meow1", target, target.mozFullScreenElement);
        this.is_fullscreen = target.mozFullScreenElement != null;
    }
    @HostListener("document:webkitfullscreenchange", ['$event.target']) fullScreen2(target) {
        console.log("meow2", target, target.ownerDocument);
        this.is_fullscreen = target.ownerDocument.webkitFullscreenElement != null;
    }
    @HostListener("document:msfullscreenchange", ['$event.target']) fullScreen3(target) {
        console.log("meow3", target, target.ownerDocument);
        this.is_fullscreen = target.ownerDocument.msFullscreenElement != null;
    }

    constructor(
        @Inject(ActivatedRoute) protected readonly route: ActivatedRoute,
        @Inject(SpudService) protected readonly spud_service: SpudService,
        @Inject(PageScrollService) protected readonly pageScrollService: PageScrollService,
    ) {}

    ngOnInit(): void {
        if (this.object == null) {
            this.router_subscription = this.route.params
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

        this.session_subscription = this.spud_service.session_change
            .subscribe(session => {
                if (this.session !== session && this.object != null) {
                    this.load_object(this.object.id)
                }
            });
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (this.object != null && !this.object.is_full_object) {
            console.log("got changes, need to load", this.object);
            this.spud_service.get_object(this.type_obj, this.object.id)
                .then(loaded_object => this.loaded_object(loaded_object))
                .catch((message : string) => this.handle_error(message));
        } else {
            console.log("got changes, no need to load", this.object);
            this.loaded_object(this.object);
        }
    }

    load_object(id : number) {
        console.log("loading with signal", id)
        this.spud_service.get_object(this.type_obj, id)
            .then(loaded_object => this.loaded_object(loaded_object))
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
                    this.object.id = this.next_id;
                    return this.spud_service.get_object(this.type_obj, this.next_id)
                })
                .then(loaded_object => this.loaded_object(loaded_object))
                .catch((message : string) => this.handle_error(message))
        }

    }

    private loaded_object(object : GenObject) : void {
        console.log("loaded", object);
        this.object = object;
        this.error = null;
        if (this.list != null) {
            let index = this.list.get_index(object.id);
            if (index != null) {
                this.prev_id = index.prev_id;
                this.next_id = index.next_id;
            }
        } else {
            this.prev_id = null;
            this.next_id = null;
        }

        let child_criteria = new Map<string,string>();
        child_criteria.set('instance', String(object.id));
        child_criteria.set('mode', 'children');
        this.child_list = this.spud_service.get_list(this.type_obj, child_criteria);

        let photo_criteria : Map<string,string> = this.get_photo_criteria(object);
        if (photo_criteria != null) {
            this.photo_list = this.spud_service.get_list(new PhotoType(), photo_criteria);
        } else {
            this.photo_list = null;
        }

        let pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({document: null, scrollTarget: this.details.nativeElement, pageScrollOffset: 56 });
        this.pageScrollService.start(pageScrollInstance);

        console.log("emit object_selected", object);
        this.object_selected.emit(object);
    }

    private handle_error(message: string): void {
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

    protected abstract get_photo_criteria(object : GenObject) : Map<string,string>;

    private goto_children() : void {
        let pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({document: null, scrollTarget: this.children.nativeElement, pageScrollOffset: 56 });
        this.pageScrollService.start(pageScrollInstance);
    }

    private goto_photos() : void {
        let pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({document: null, scrollTarget: this.photos.nativeElement, pageScrollOffset: 56 });
        this.pageScrollService.start(pageScrollInstance);
    }

    private full_screen() : void {
        let fullscreenDiv = this.image.nativeElement;
        let fullscreenFunc = fullscreenDiv.requestFullscreen;
        if (!fullscreenFunc) {
            ['mozRequestFullScreen',
             'msRequestFullscreen',
             'webkitRequestFullScreen'].forEach(function (req) {
                fullscreenFunc = fullscreenFunc || fullscreenDiv[req];
             });
        }
        fullscreenFunc.call(fullscreenDiv);
    }

    ngOnDestroy() : void {
        if (this.router_subscription != null) {
            this.router_subscription.unsubscribe();
        }
        this.session_subscription.unsubscribe();
    }
}
