import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs/Subscription';

import {
    OnInit,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    OnDestroy,
    SimpleChange,
    ViewChild,
    Inject,
    HostListener
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { List } from 'immutable';
import { PageScrollService, PageScrollInstance } from 'ng2-page-scroll';

import { Session } from './session';
import { BaseObject, BaseType } from './base';
import { PhotoObject, PhotoType } from './photo';
import { SpudService, ObjectList } from './spud.service';

export abstract class BaseListComponent<GenObject extends BaseObject>
        implements OnInit, OnDestroy {

    public readonly type_obj: BaseType<GenObject>;
    protected session: Session = new Session();
    protected criteria: Map<string, string> = null;

    private router_subscription: Subscription;
    private session_subscription: Subscription;

    @Input() title: string;

    private _list: ObjectList<GenObject>;

    @Input() set list(list: ObjectList<GenObject>) {
        if (this._list !== list) {
            this._list = list;
            this.selected_object = null;
        }
    }
    get list(): ObjectList<GenObject> {
        return this._list;
    }
    public selected_object: GenObject;

    constructor(
        @Inject(ActivatedRoute) protected readonly route: ActivatedRoute,
        @Inject(SpudService) protected readonly spud_service: SpudService,
//        @Inject(PageScrollService) protected readonly page_scroll_service: PageScrollService,
    ) {}

    ngOnInit(): void {
        if (this.list == null) {
            this.router_subscription = this.route.queryParams
                .subscribe((params: Params) => {
                    this.criteria = new Map<string, string>();
                    this.criteria.set('q', params['q']);
                    this.list = this.spud_service.get_list(this.type_obj, this.criteria);
                });

        }

        this.session_subscription = this.spud_service.session_change
            .subscribe(session => {
                if (this.session !== session) {
                    this.list = this.spud_service.get_list(this.type_obj, this.criteria);
                    this.selected_object = null;
                }
            });
    };

    public select_object(object: GenObject): void {
        this.selected_object = object;
    }

    ngOnDestroy(): void {
        if (this.router_subscription != null) {
            this.router_subscription.unsubscribe();
        }
        this.session_subscription.unsubscribe();
    };
}

export abstract class BaseDetailComponent<GenObject extends BaseObject>
        implements OnInit, OnChanges, OnDestroy {

    public abstract readonly type_obj: BaseType<GenObject>;
    protected session: Session = new Session();

    private router_subscription: Subscription;
    private session_subscription: Subscription;

    private object: GenObject;
    //noinspection JSUnusedGlobalSymbols
    @Input('object') set input_object(object: GenObject) {
        if (this.object !== object) {
            console.log('got input object', object);
            this.object = object;
        }
    }

    @Output() object_selected = new EventEmitter();

    @Input() list: ObjectList<GenObject>;
    private error: string;

    private child_list: ObjectList<GenObject>;
    private photo_list: ObjectList<PhotoObject>;

    @ViewChild('details') details;
    @ViewChild('image') image;
    @ViewChild('children') children;
    @ViewChild('photos') photos;

    private is_fullscreen = false;
    @HostListener('document:fullscreenchange', ['$event.target']) fullScreen0(target) {
        console.log('meow0', target, target.ownerDocument);
        this.is_fullscreen = target.ownerDocument.fullscreenElement != null;
    }
    @HostListener('document:mozfullscreenchange', ['$event.target']) fullScreen1(target) {
        console.log('meow1', target, target.mozFullScreenElement);
        this.is_fullscreen = target.mozFullScreenElement != null;
    }
    @HostListener('document:webkitfullscreenchange', ['$event.target']) fullScreen2(target) {
        console.log('meow2', target, target.ownerDocument);
        this.is_fullscreen = target.ownerDocument.webkitFullscreenElement != null;
    }
    @HostListener('document:msfullscreenchange', ['$event.target']) fullScreen3(target) {
        console.log('meow3', target, target.ownerDocument);
        this.is_fullscreen = target.ownerDocument.msFullscreenElement != null;
    }

    constructor(
        @Inject(ActivatedRoute) protected readonly route: ActivatedRoute,
        @Inject(SpudService) protected readonly spud_service: SpudService,
        @Inject(PageScrollService) protected readonly page_scroll_service: PageScrollService,
    ) {}

    ngOnInit(): void {
        if (this.object == null) {
            this.router_subscription = this.route.params
                .switchMap((params: Params): Promise<GenObject> => {
                    const id: number = params['id'];
                    return this.spud_service.get_object(this.type_obj, id);
                })
                .subscribe(
                    loaded_object => this.loaded_object(loaded_object),
                    message => this.handle_error(message),
                );
        }

        this.session_subscription = this.spud_service.session_change
            .subscribe(session => {
                if (this.session !== session && this.object != null) {
                    this.load_object(this.object.id);
                }
            });
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (this.object != null && !this.object.is_full_object) {
            console.log('got changes, need to load', this.object);
            this.spud_service.get_object(this.type_obj, this.object.id)
                .then(loaded_object => this.loaded_object(loaded_object))
                .catch((message: string) => this.handle_error(message));
        } else {
            console.log('got changes, no need to load', this.object);
            this.loaded_object(this.object);
        }
    }

    load_object(id: number) {
        console.log('loading with signal', id);
        this.spud_service.get_object(this.type_obj, id)
            .then(loaded_object => this.loaded_object(loaded_object))
            .catch((message: string) => this.handle_error(message));
    }

    load_prev_object(): void {
        const index = this.list.get_index(this.object.id);
        if (index != null && index.prev_id != null) {
            this.load_object(index.prev_id);
        }
    }

    load_next_object(): void {
        const index = this.list.get_index(this.object.id);
        if (index != null && index.next_id != null) {
            this.load_object(index.next_id);
        } else {
            this.list.get_next_page()
                .then((objects: List<GenObject>) : Promise<GenObject> => {
                    const index2 = this.list.get_index(this.object.id);
                    if (index2 != null && index2.next_id != null) {
                        return this.spud_service.get_object(this.type_obj, index2.next_id);
                    } else {
                        return Promise.reject('Cannot find index of next item');
                    }
                })
                .then(loaded_object => this.loaded_object(loaded_object))
                .catch((message: string) => this.handle_error(message));
        }

    }

    private loaded_object(object: GenObject): void {
        console.log('loaded', object);
        this.object = object;
        this.error = null;

        const child_criteria = new Map<string, string>();
        child_criteria.set('instance', String(object.id));
        child_criteria.set('mode', 'children');
        this.child_list = this.spud_service.get_list(this.type_obj, child_criteria);

        const photo_criteria: Map<string, string> = this.get_photo_criteria(object);
        if (photo_criteria != null) {
            this.photo_list = this.spud_service.get_list(new PhotoType(), photo_criteria);
        } else {
            this.photo_list = null;
        }

        const pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({
          document: null, scrollTarget: this.details.nativeElement, pageScrollOffset: 56 });
        this.page_scroll_service.start(pageScrollInstance);

        console.log('emit object_selected', object);
        this.object_selected.emit(object);
    }

    private handle_error(message: string): void {
        this.object = null;
        this.error = message;
    }

    public has_prev_page(): boolean {
        if (this.list == null) {
            return false;
        }
        const index = this.list.get_index(this.object.id);
        if (index != null) {
            return !!index.prev_id;
        } else {
            return false;
        }
    }

    public has_next_page(): boolean {
        if (this.list == null) {
            return false;
        }
        const index = this.list.get_index(this.object.id);
        if (index.next_id != null) {
            return true;
        } else {
            return !this.list.finished;
        }
    }

    protected abstract get_photo_criteria(object: GenObject): Map<string, string>;

    protected goto_children(): void {
        const pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({
          document: null, scrollTarget: this.children.nativeElement, pageScrollOffset: 56 });
        this.page_scroll_service.start(pageScrollInstance);
    }

    protected goto_photos(): void {
        const pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({
          document: null, scrollTarget: this.photos.nativeElement, pageScrollOffset: 56 });
        this.page_scroll_service.start(pageScrollInstance);
    }

    protected full_screen(): void {
        const fullscreenDiv = this.image.nativeElement;
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

    ngOnDestroy(): void {
        if (this.router_subscription != null) {
            this.router_subscription.unsubscribe();
        }
        this.session_subscription.unsubscribe();
    }
}
