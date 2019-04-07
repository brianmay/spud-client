import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnDestroy,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    OnInit,
    ViewChild,
    HostListener,
    Inject,
} from '@angular/core';

import { List } from 'immutable';
import { Subscription } from 'rxjs/Subscription';

import {BaseObject, BaseType} from './base';
import {BaseService, IndexEntry, ObjectList, SpudService} from './spud.service';
import {PhotoObject, PhotoType} from './photo';
import {Permission, Session} from './session';

@Component({
    selector: 'object_link',
    templateUrl: './object-link.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectLinkComponent<GenObject extends BaseObject> {
    @Input() object: GenObject;
}

@Component({
    selector: 'object_array',
    templateUrl: './object-array.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectArrayComponent<GenObject extends BaseObject> {
    @Input() list: Array<GenObject>;
    @Input() sep = ', ';
}

@Component({
    selector: 'object_list_item',
    templateUrl: './object-list-item.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectListItemComponent<GenObject extends BaseObject> {
    @Input() object: GenObject;
    @Input() selected: boolean;

    @Output() selected_change = new EventEmitter();
    @Output() toggled_change = new EventEmitter();
    public click_object(event) {
        if (event.ctrlKey) {
            this.toggled_change.emit(true)
        } else {
            this.selected_change.emit(true);
        }
    }

    @Output() activated_change = new EventEmitter();
    public dblclick_object(event) {
        this.activated_change.emit(true);
    }
}

@Component({
    selector: 'object_list',
    templateUrl: './object-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectListComponent<GenObject extends BaseObject> implements OnDestroy {
    @Input('list') set set_list(list: ObjectList<GenObject>) {
        if (this.list_subscription != null) {
            this.list_subscription.unsubscribe();
        }
        this.list = list;
        this.objects = list.get_objects();
        this.list_finished = false;
        this.list_subscription = this.list.change.subscribe(
            (objects) => {
                this.objects = objects;
                this.ref.markForCheck();
            },
            (error) => {
                this.error = error;
                this.ref.markForCheck();
            },
            () => {
                this.list_finished = true;
                this.ref.markForCheck();
            },
        );
        if (this.objects.size <= 0) {
            this.get_next_page();
        }
    }

    public objects: List<GenObject>;
    private list: ObjectList<GenObject>;
    public list_finished = false;
    private list_subscription: Subscription;
    public error: string;

    constructor(private readonly ref: ChangeDetectorRef) {}

    public get_next_page(): void {
        this.list.get_next_page();
    }

    @Input() selected_objects: Array<GenObject>;
    @Output() selected_objects_change = new EventEmitter();
    public select_object(object: GenObject) {
        this.selected_objects = [object];
        this.selected_objects_change.emit(this.selected_objects);
    }

    public toggle_object(object: GenObject) {
        const index = this.selected_objects.indexOf(object, 0);

        if (index > -1) {
            this.selected_objects.splice(index, 1)
        } else {
            this.selected_objects.push(object)
        }
        this.selected_objects_change.emit(this.selected_objects);
    }

    @Output() activated_object_change = new EventEmitter();
    public activate_object(object: GenObject) {
        this.activated_object_change.emit(object);
    }

    ngOnDestroy(): void {
        if (this.list_subscription != null) {
            this.list_subscription.unsubscribe();
        }
    }
}

@Component({
    selector: 'object_detail',
    templateUrl: './object-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectDetailComponent<GenObject extends BaseObject>
    implements OnInit, OnDestroy {

    private _type_obj: BaseType<GenObject>;
    public get type_obj() : BaseType<GenObject> {
        return this._type_obj;
    }
    @Input("type_obj") public set type_obj(type_obj : BaseType<GenObject>) {
        this._type_obj = type_obj;
        this.ref.markForCheck();
    }

    public photo_type_obj : PhotoType = new PhotoType();

    protected session: Session = new Session();

    protected _service: BaseService<GenObject>;
    protected photo_service: BaseService<PhotoObject>;
    protected get service(): BaseService<GenObject> {
        if (this._service == null) {
            this._service = this.spud_service.get_service(this.type_obj);
            this.change_subscription = this._service.change.subscribe(object => {
                let objects: Array<GenObject> = this.objects;
                for (let i = 0; i < this.objects.length; i++) {
                    if (objects[i].id == object.id) {
                        objects[i] = object;
                        this.ref.markForCheck();
                    }
                }
                this.objects = objects;
                if (this.list != null) {
                    this.list = this.list.object_changed(object);
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

    private session_subscription: Subscription;
    private list_subscription: Subscription;
    private change_subscription: Subscription;
    private delete_subscription: Subscription;

    @Input() show_close: boolean;
    @Output() on_close: EventEmitter<null> = new EventEmitter();

    _objects: Array<GenObject> = [];
    get objects() : Array<GenObject> {
        return this._objects;
    }
    set objects(objects: Array<GenObject>) {
        this._objects = objects;
        if (this._objects.length == 1) {
            this.object = this._objects[0];
        } else {
            this.object = null;
        }
        this.ref.markForCheck();
    }

    private _object: GenObject;
    get object(): GenObject {
        return this._object;
    }
    @Output() object_change = new EventEmitter();
    @Input('object') set object(object: GenObject) {
        console.log('setting', object);
        this.error = null;

        this.child_list_empty = true;
        this.photo_list_empty = true;

        this.child_list = null;
        this.photo_list = null;
        this.selected_photos = [];
        this.activated_photo = null;

        this.reload_lists(object);

        if (object != null && !object.is_full_object) {
            console.log('got partial object, need to load', object);
            this.set_loaded_object(object);
            this.service.get_object(object.id)
                .then(loaded_object => this.set_loaded_object(loaded_object))
                .catch((message: string) => this.handle_error(message));
        } else {
            console.log('got full object, no need to load', object);
            this.set_loaded_object(object);
        }

        if (object != null) {
            this._objects = [object];
        }
    }

    private set_loaded_object(object: GenObject): void {
        console.log('loaded', object);
        if (object != null) {
            if (this.list != null) {
                this.index = this.list.get_index(object.id);
            } else {
                this.index = null;
            }
        }
        this._object = object;
        this.object_change.emit(object);
        this.ref.markForCheck();
    }

    private reload_lists(object: GenObject): void {
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
        } else {
            this.child_list = null;
            this.photo_list = null;
        }
    }

    protected _selected_objects: Array<GenObject> = [];
    get selected_objects(): Array<GenObject> {
        return this._selected_objects;
    }
    set selected_objects(objects: Array<GenObject>) {
        this._selected_objects = objects;
        this.ref.markForCheck();
    }

    protected _activated_object: GenObject = null;
    get activated_object(): GenObject {
        return this._activated_object;
    }
    set activated_object(object: GenObject) {
        this._activated_object = object;
        this.ref.markForCheck();
    }

    protected _selected_photos: Array<PhotoObject> = null;
    get selected_photos(): Array<PhotoObject> {
        return this._selected_photos;
    }
    set selected_photos(photos: Array<PhotoObject>) {
        this._selected_photos = photos;
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
        @Inject(SpudService) protected readonly spud_service: SpudService,
        @Inject(ChangeDetectorRef) protected readonly ref: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.session_subscription = this.spud_service.session_change
            .subscribe(session => {
                if (this.session !== session) {
                    this.reload_lists(this.object)
                }
                this.session = session;
            });
        this.session = this.spud_service.session;
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

    protected get_photo_criteria(object: GenObject): Map<string, string> {
        return this.type_obj.get_photo_criteria(object);
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
        this.ref.markForCheck();
    }

    ngOnDestroy(): void {
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
