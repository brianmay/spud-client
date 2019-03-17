import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs/Subscription';

import {
    OnInit,
    Input,
    OnDestroy,
    Inject,
    ChangeDetectorRef,
    Component,
    ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Session } from './session';
import { BaseObject, BaseType } from './base';
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

@Component({
    selector: 'base_detail',
    templateUrl: './base-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseDetailComponent<GenObject extends BaseObject>
        implements OnInit, OnDestroy {

    private _type_obj: BaseType<GenObject>;
    public get type_obj() : BaseType<GenObject> {
        return this._type_obj;
    }
    @Input("type_obj") public set type_obj(type_obj : BaseType<GenObject>) {
        this._type_obj = type_obj;
        this.ref.markForCheck();
    }

    protected session: Session = new Session();

    protected _service: BaseService<GenObject>;
    protected get service(): BaseService<GenObject> {
        if (this._service == null) {
            this._service = this.spud_service.get_service(this.type_obj);
        }
        return this._service;
    }

    private data_subscription: Subscription;
    private router_subscription: Subscription;
    private session_subscription: Subscription;

    private _object: GenObject;
    get object(): GenObject {
        return this._object;
    }
    set object(object: GenObject) {
        this._object = object;
        this.ref.markForCheck();
    }

    public index: IndexEntry;

    public error: string;

    private handle_error(message: string): void {
        this.error = message;
        this.ref.markForCheck();
    }

    constructor(
        @Inject(ActivatedRoute) protected readonly route: ActivatedRoute,
        @Inject(SpudService) protected readonly spud_service: SpudService,
        @Inject(ChangeDetectorRef) protected readonly ref: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.data_subscription = this.route.data
            .subscribe((params: Params) => {
                this._type_obj = params["type_obj"];
            });
        this.router_subscription = this.route.params
            .switchMap((params: Params): Promise<GenObject> => {
                const id: number = params['id'];
                return this.service.get_object(id);
            })
            .subscribe(
                loaded_object => this.object = loaded_object,
                message => this.handle_error(message),
            );

        this.session_subscription = this.spud_service.session_change
            .subscribe(session => {
                if (this.session !== session && this.object != null) {
                    this.load_object(this.object.id);
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

    ngOnDestroy(): void {
        if (this.data_subscription != null) {
            this.data_subscription.unsubscribe();
        }
        if (this.router_subscription != null) {
            this.router_subscription.unsubscribe();
        }
        if (this.session_subscription) {
            this.session_subscription.unsubscribe();
        }
    }
}
