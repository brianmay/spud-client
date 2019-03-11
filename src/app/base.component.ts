import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs/Subscription';

import {
    OnInit,
    Input,
    OnDestroy,
    ViewChild,
    Inject,
    HostListener,
    ChangeDetectorRef,
    Output,
    EventEmitter, Component, ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Permission, Session } from './session';
import { BaseObject, BaseType } from './base';
import { PhotoObject, PhotoType } from './photo';
import { SpudService, ObjectList, IndexEntry, BaseService } from './spud.service';

@Component({
    selector: 'base_list',
    templateUrl: './base-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseListComponent<GenObject extends BaseObject>
        implements OnInit, OnDestroy {

    private _type_obj: BaseType<GenObject>;
    public get type_obj() : BaseType<GenObject> {
        return this._type_obj;
    }
    protected criteria: Map<string, string> = null;

    protected _service: BaseService<GenObject>;
    protected get service(): BaseService<GenObject> {
        if (this._service == null) {
            this._service = this.spud_service.get_service(this.type_obj);
        }
        return this._service;
    }

    private data_subscription: Subscription;
    private router_subscription: Subscription;

    @Input() title: string;
    @Input() list: ObjectList<GenObject>;

    constructor(
        @Inject(ActivatedRoute) protected readonly route: ActivatedRoute,
        @Inject(SpudService) protected readonly spud_service: SpudService,
        @Inject(ChangeDetectorRef) protected readonly ref: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        if (this.list == null) {
            this.data_subscription = this.route.data
                .subscribe((params: Params) => {
                    this._type_obj = params["type_obj"];
                });
            this.router_subscription = this.route.queryParams
                .subscribe((params: Params) => {
                    this.criteria = new Map<string, string>();
                    this.criteria.set('q', params['q']);
                    this.list = this.service.get_list(this.criteria);
                    this.ref.markForCheck();
                });
        }
    };

    ngOnDestroy(): void {
        if (this.data_subscription != null) {
            this.data_subscription.unsubscribe();
        }
        if (this.router_subscription != null) {
            this.router_subscription.unsubscribe();
        }
    };

}

export abstract class BaseDetailComponent<GenObject extends BaseObject>
        implements OnInit, OnDestroy {

    public abstract readonly type_obj: BaseType<GenObject>;
    protected session: Session = new Session();

    protected _service: BaseService<GenObject>;
    protected photo_service: BaseService<PhotoObject>;
    protected get service(): BaseService<GenObject> {
        if (this._service == null) {
            this._service = this.spud_service.get_service(this.type_obj);
            this.change_subscription = this._service.change.subscribe(object => {
               if (this.object != null && this.object.id === object.id) {
                   this.object = object;
                   this.ref.markForCheck();
               }
               if (this.list != null) {
                   this.list.object_changed(object);
                   this.ref.markForCheck();
               }
            });
            this.delete_subscription = this._service.delete.subscribe(object => {
               if (this.object != null && this.object.id === object.id) {
                   this.object = null;
                   this.ref.markForCheck();
               }
               if (this.list != null) {
                   this.list.object_deleted(object);
                   this.ref.markForCheck();
               }
            });
        }
        if (this.photo_service == null) {
            this.photo_service = this.spud_service.get_service(new PhotoType());
        }
        return this._service;
    }

    private router_subscription: Subscription;
    private session_subscription: Subscription;
    private list_subscription: Subscription;
    private change_subscription: Subscription;
    private delete_subscription: Subscription;

    @Input() show_close: boolean;
    @Output() on_close: EventEmitter<null> = new EventEmitter();

    private _object: GenObject;
    get object(): GenObject {
        return this._object;
    }
    @Output() object_change = new EventEmitter();
    @Input('object') set object(object: GenObject) {
        console.log('loaded', object);
        this._object = object;
        this.error = null;

        this.child_list_empty = true;
        this.photo_list_empty = true;

        this.child_list = null;
        this.photo_list = null;
        this.selected_photo = null;
        this.activated_photo = null;

        if (object != null) {
            const child_criteria = new Map<string, string>();
            child_criteria.set('instance', String(object.id));
            child_criteria.set('mode', 'children');

            this.child_list = this.service.get_list(child_criteria);
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
            }

            if (this.list != null) {
                this.index = this.list.get_index(object.id);
            } else {
                this.index = null;
            }
        }

        this.object_change.emit(object);
        this.ref.markForCheck();
    }

    protected _selected_photo: PhotoObject = null;
    get selected_photo(): PhotoObject {
        return this._selected_photo;
    }
    set selected_photo(photo: PhotoObject) {
        this._selected_photo = photo;
        this.ref.markForCheck();
    }

    protected _activated_photo: PhotoObject = null;
    get activated_photo(): PhotoObject {
        return this._activated_photo;
    }
    set activated_photo(photo: PhotoObject) {
        this._activated_photo = photo;
        this.ref.markForCheck();
    }

    private _list: ObjectList<GenObject>;
    @Input('list') set list(list: ObjectList<GenObject>) {
        if (this.list_subscription != null) {
            this.list_subscription.unsubscribe();
        }
        this._list = list;
        if (this.object != null) {
            this.index = list.get_index(this.object.id);
        } else {
            this.index = null;
        }
        this.index_complete = false;
        this.error = null;
        this.list_subscription = list.change.subscribe(
            (objects) => {
                if (this.object != null) {
                    this.index = list.get_index(this.object.id);
                } else {
                    this.index = null;
                }
                this.ref.markForCheck();
            },
            (error) => this.handle_error(error),
            () => {
                this.index_complete = true;
                this.ref.markForCheck();
            }
        );
    }
    get list() {
        return this._list;
    }

    public index: IndexEntry;
    private index_complete = false;
    public error: string;
    public popup_error: string;

    private child_list: ObjectList<GenObject>;
    private photo_list: ObjectList<PhotoObject>;

    public child_list_empty = true;
    public photo_list_empty = true;

    @ViewChild('image') image;
    @ViewChild('error_element') error_element;

    private is_fullscreen = false;
    @HostListener('document:fullscreenchange', ['$event.target']) fullScreen0(target) {
        this.is_fullscreen = target.ownerDocument.fullscreenElement != null;
        this.ref.markForCheck();
    }
    @HostListener('document:mozfullscreenchange', ['$event.target']) fullScreen1(target) {
        this.is_fullscreen = target.mozFullScreenElement != null;
        this.ref.markForCheck();
    }
    @HostListener('document:webkitfullscreenchange', ['$event.target']) fullScreen2(target) {
        this.is_fullscreen = target.ownerDocument.webkitFullscreenElement != null;
        this.ref.markForCheck();
    }
    @HostListener('document:msfullscreenchange', ['$event.target']) fullScreen3(target) {
        this.is_fullscreen = target.ownerDocument.msFullscreenElement != null;
        this.ref.markForCheck();
    }

    constructor(
        @Inject(ActivatedRoute) protected readonly route: ActivatedRoute,
        @Inject(SpudService) protected readonly spud_service: SpudService,
        @Inject(ChangeDetectorRef) protected readonly ref: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        if (this.list == null && this.object == null) {
            this.router_subscription = this.route.params
                .switchMap((params: Params): Promise<GenObject> => {
                    const id: number = params['id'];
                    return this.service.get_object(id);
                })
                .subscribe(
                    loaded_object => this.object = loaded_object,
                    message => this.handle_error(message),
                );
        }

        this.session_subscription = this.spud_service.session_change
            .subscribe(session => {
                if (this.session !== session && this.object != null) {
                    this.load_object(this.object.id);
                }
                // FIXME: reload list here
                this.session = session;
            });
        this.session = this.spud_service.session;
    }

    select_object(object: GenObject): void {
        this.object = object;
        if (object != null && !object.is_full_object) {
            console.log('got changes, need to load', object);
            this.service.get_object(object.id)
                .then(loaded_object => this.object = loaded_object)
                .catch((message: string) => this.handle_error(message));
        } else {
            console.log('got changes, no need to load', object);
        }
    }

    load_object(id: number) {
        console.log('loading with signal', id);
        this.service.get_object(id)
            .then(loaded_object => this.object = loaded_object)
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
                        return this.service.get_object(this.index.next_id);
                    }
                })
                .then(loaded_object => this.object = loaded_object)
                .catch((message: string) => this.handle_error(message));
        }
    }

    private handle_error(message: string): void {
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
        this.ref.markForCheck();
    }

    ngOnDestroy(): void {
        if (this.router_subscription != null) {
            this.router_subscription.unsubscribe();
        }
        if (this.session_subscription) {
            this.session_subscription.unsubscribe();
        }
        if (this.list_subscription != null) {
            this.list_subscription.unsubscribe();
        }
        if (this.change_subscription != null) {
            this.change_subscription.unsubscribe();
        }
        if (this.delete_subscription != null) {
            this.delete_subscription.unsubscribe();
        }
    }

    get permission(): Permission {
        if (this.session.permissions == null) {
            return new Permission();
        }
        return this.session.permissions.get(this.type_obj.type_name);
    }

    create_object(): void {
        const new_object: GenObject = this.type_obj.new_object(this.object);
        this.service.create_object(new_object)
            .then(object => {
                this.object = object;
                this.ref.markForCheck();
            })
            .catch(error => {
                this.open_error(error);
                this.ref.markForCheck();
            });
    }

    delete_object(): void {
        this.service.delete_object(this.object)
            .catch(error => {
                this.open_error(error);
                this.ref.markForCheck();
            });
    }

    private open_error(error: string): void {
        this.popup_error = error;
        this.error_element.show();
        this.ref.markForCheck();
    }
}
