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
    HostListener,
    ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { PageScrollService, PageScrollInstance } from 'ng2-page-scroll';

import { Session } from './session';
import { BaseObject, BaseType } from './base';
import { PhotoObject, PhotoType } from './photo';
import { SpudService, ObjectList, IndexEntry } from './spud.service';

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
        @Inject(ChangeDetectorRef) protected readonly ref: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        if (this.list == null) {
            this.router_subscription = this.route.queryParams
                .subscribe((params: Params) => {
                    this.criteria = new Map<string, string>();
                    this.criteria.set('q', params['q']);
                    this.list = this.spud_service.get_list(this.type_obj, this.criteria);
                    this.ref.markForCheck();
                });

        }

        this.session_subscription = this.spud_service.session_change
            .subscribe(session => {
                if (this.session !== session) {
                    this.list = this.spud_service.get_list(this.type_obj, this.criteria);
                    this.selected_object = null;
                    this.ref.markForCheck();
                }
            });
    };

    public select_object(object: GenObject): void {
        this.selected_object = object;
        this.ref.markForCheck();
    }

    ngOnDestroy(): void {
        if (this.router_subscription != null) {
            this.router_subscription.unsubscribe();
        }
        if (this.session_subscription != null) {
            this.session_subscription.unsubscribe();
        }
    };
}

export abstract class BaseDetailComponent<GenObject extends BaseObject>
        implements OnInit, OnChanges, OnDestroy {

    public abstract readonly type_obj: BaseType<GenObject>;
    protected session: Session = new Session();

    private router_subscription: Subscription;
    private session_subscription: Subscription;
    private list_subscription: Subscription;

    private object: GenObject;
    //noinspection JSUnusedGlobalSymbols
    @Input('object') set input_object(object: GenObject) {
        if (this.object !== object) {
            console.log('got input object', object);
            this.object = object;
        }
    }

    @Output() object_selected = new EventEmitter();

    @Input('list') set set_list(list: ObjectList<GenObject>) {
        if (this.list_subscription != null) {
            this.list_subscription.unsubscribe();
        }
        this.list = list;
        this.index = null;
        this.index_complete = false;
        this.error = null;
        this.list_subscription = this.list.new_page.subscribe(
            (objects) => {
                this.index = this.list.get_index(this.object.id);
                this.ref.markForCheck();
            },
            (error) => this.handle_error(error),
            () => {
                this.index_complete = true;
                this.ref.markForCheck();
            }
        );
    }

    private list: ObjectList<GenObject>;
    public index: IndexEntry;
    private index_complete = false;
    private error: string;

    private child_list: ObjectList<GenObject>;
    private photo_list: ObjectList<PhotoObject>;

    public child_list_empty = true;
    public photo_list_empty = true;

    @ViewChild('details') details;
    @ViewChild('image') image;
    @ViewChild('children') children;
    @ViewChild('photos') photos;

    private is_fullscreen = false;
    @HostListener('document:fullscreenchange', ['$event.target']) fullScreen0(target) {
        console.log('meow0', target, target.ownerDocument);
        this.is_fullscreen = target.ownerDocument.fullscreenElement != null;
        this.ref.markForCheck();
    }
    @HostListener('document:mozfullscreenchange', ['$event.target']) fullScreen1(target) {
        console.log('meow1', target, target.mozFullScreenElement);
        this.is_fullscreen = target.mozFullScreenElement != null;
        this.ref.markForCheck();
    }
    @HostListener('document:webkitfullscreenchange', ['$event.target']) fullScreen2(target) {
        console.log('meow2', target, target.ownerDocument);
        this.is_fullscreen = target.ownerDocument.webkitFullscreenElement != null;
        this.ref.markForCheck();
    }
    @HostListener('document:msfullscreenchange', ['$event.target']) fullScreen3(target) {
        console.log('meow3', target, target.ownerDocument);
        this.is_fullscreen = target.ownerDocument.msFullscreenElement != null;
        this.ref.markForCheck();
    }

    constructor(
        @Inject(ActivatedRoute) protected readonly route: ActivatedRoute,
        @Inject(SpudService) protected readonly spud_service: SpudService,
        @Inject(PageScrollService) protected readonly page_scroll_service: PageScrollService,
        @Inject(ChangeDetectorRef) protected readonly ref: ChangeDetectorRef,
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
        const index = this.index;
        if (index != null && index.prev_id != null) {
            this.load_object(index.prev_id);
        }
    }

    load_next_object(): void {
        const index = this.index;
        if (index != null && index.next_id != null) {
            this.load_object(index.next_id);
        } else if (!this.index_complete) {
            this.list.on_next_page()
                .then(() => {
                    this.index = this.list.get_index(this.object.id);
                    this.ref.markForCheck();
                    if (this.index != null && this.index.next_id != null) {
                        return this.spud_service.get_object(
                            this.type_obj, this.index.next_id);
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

        this.child_list_empty = true;
        this.photo_list_empty = true;

        const child_criteria = new Map<string, string>();
        child_criteria.set('instance', String(object.id));
        child_criteria.set('mode', 'children');

        this.child_list = this.spud_service.get_list(this.type_obj, child_criteria);
        this.child_list.get_is_empty()
            .then(empty => {
                this.child_list_empty = empty;
                this.ref.markForCheck();
            })
            .catch(error => {
                this.child_list_empty = false;
                this.ref.markForCheck();
            });

        const photo_criteria: Map<string, string> = this.get_photo_criteria(object);
        if (photo_criteria != null) {
            this.photo_list = this.spud_service.get_list(new PhotoType(), photo_criteria);
            this.photo_list.get_is_empty()
                .then(empty => {
                    this.photo_list_empty = empty;
                    this.ref.markForCheck();
                })
                .catch(error => {
                    this.photo_list_empty = false;
                    this.ref.markForCheck();
                });
        } else {
            this.photo_list = null;
        }

        const pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({
          document: null, scrollTarget: this.details.nativeElement, pageScrollOffset: 56 });
        this.page_scroll_service.start(pageScrollInstance);

        console.log('emit object_selected', object);
        this.object_selected.emit(object);

        if (this.list != null) {
            this.index = this.list.get_index(object.id);
        } else {
            this.index = null;
        }
        this.ref.markForCheck();
    }

    private handle_error(message: string): void {
        this.object = null;
        this.error = message;
        this.ref.markForCheck();
    }

    public has_prev_page(): boolean {
        if (this.list == null) {
            return false;
        }
        const index = this.index;
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
        const index = this.index;
        if (index != null && index.next_id != null) {
            return true;
        } else {
            return !this.index_complete;
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
        this.ref.markForCheck()
    }

    ngOnDestroy(): void {
        if (this.router_subscription != null) {
            this.router_subscription.unsubscribe();
        }
        this.session_subscription.unsubscribe();
        if (this.list_subscription != null) {
            this.list_subscription.unsubscribe();
        }
    }
}
