import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams, RequestOptionsArgs } from '@angular/http';

import { List } from 'immutable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';

import { NumberDict } from './basic';
import { api_url } from './settings';
import * as s from './streamable';
import { BaseObject, BaseType } from './base';
import { Session } from './session';

import { AlbumObject, AlbumType } from './album';
import { CategoryObject, CategoryType } from './category';
import { PlaceObject, PlaceType } from './place';
import { PersonObject, PersonType } from './person';
import { PhotoObject, PhotoType } from './photo';


export class IndexEntry {
    prev_id: number;
    this_i: number;
    next_id: number;
}

function error_to_string(error: any): string {
    if (error.headers && error.headers.get('Content-Type') === 'application/json') {
        const json = error.json();
        console.error('An JSON error occurred', json.detail);
        return json.detail;
    } else {
        console.error('An error occurred', error.toString());
        return error.toString();
    }
}

interface SpudServicePrivate {
    http: Http;
    get_session(): Session;
    get_options(): RequestOptionsArgs;
}

export class ObjectList<GenObject extends BaseObject> {
    private page = 1;
    private prev_id: number = null;
    private objects: List<GenObject> = List<GenObject>();
    private index: NumberDict<IndexEntry> = {};
    private finished = false;
    private loading = false;

    change_source = new Subject<List<GenObject>>();
    change = this.change_source.asObservable();

    constructor(
        private readonly ssp: SpudServicePrivate,
        private readonly type_obj: BaseType<GenObject>,
        private readonly criteria: Map<string, string>,
    ) { };

    private streamable_to_object_list(
            streamable: s.Streamable): void {
        const objects: List<GenObject> = this.objects.asMutable();

        const array: s.Streamable[] = s.streamable_to_array(streamable['results']);
        for (const i of array) {
            const object: GenObject = this.type_obj.object_from_streamable(i, false);
            if (this.index[object.id] != null) {
                // If this is a duplicate photo, skip it.
                continue;
            }

            const object_i = objects.size;
            objects.push(object);

            this.index[object.id] = new IndexEntry();
            this.index[object.id].prev_id = this.prev_id;
            this.index[object.id].this_i = object_i;
            this.index[object.id].next_id = null;
            if (this.prev_id != null) {
                this.index[this.prev_id].next_id = object.id;
            }
            this.prev_id = object.id;
        }

        this.objects = objects.asImmutable();
    }

    get_next_page(): void {
        if (this.loading || this.finished) {
            return;
        }

        this.loading = true;

        const params = new URLSearchParams();

        if (this.criteria != null) {
            this.criteria.forEach((value: string, key: string) => {
                params.set(key, value);
            });
        }
        params.set('page', String(this.page));

        const options: RequestOptionsArgs = this.ssp.get_options();
        options.params = params;

        this.ssp.http.get(api_url + this.type_obj.type_name + '/', options)
            .toPromise()
            .then(response => {
                this.loading = false;
                this.page = this.page + 1;
                const data = response.json();
                this.streamable_to_object_list(data);
                this.change_source.next(this.objects);
                if (!data['next']) {
                    this.finished = true;
                    this.change_source.complete();
                }
            })
            .catch(error => {
                this.loading = false;
                this.change_source.error(error_to_string(error));
            });
    }

    get_index(id: number): IndexEntry {
        return this.index[id];
    }

    get_objects(): List<GenObject> {
        return this.objects;
    }

    on_next_page(): Promise<List<GenObject>> {
        if (this.finished) {
            return Promise.reject('All pages loaded');
        }
        this.get_next_page();
        return this.change.take(1).toPromise();
    }

    get_is_empty(): Promise<boolean> {
        if (this.objects.size === 0 && this.finished) {
            return Promise.resolve(true);
        } else if (this.objects.size > 0) {
            return Promise.resolve(false);
        }
        return this.on_next_page()
            .then(() => this.objects.size === 0)
            .catch(error => error);
    }

    object_changed(object: GenObject): void {
        const index = this.get_index(object.id);
        if (index != null) {
            this.objects = this.objects.set(index.this_i, object);
            this.change_source.next(this.objects);
        }
    }
}

export class BaseService<GenObject extends BaseObject> {
    private change_source = new Subject<GenObject>();
    readonly change = this.change_source.asObservable();

    private delete_source = new Subject<GenObject>();
    readonly delete = this.change_source.asObservable();

    constructor(
        private readonly ssp: SpudServicePrivate,
        private readonly type_obj: BaseType<GenObject>) { };

    get_list(criteria: Map<string, string>): ObjectList<GenObject> {
        const http = this.ssp.http;
        const session = this.ssp.get_session();
        return new ObjectList(this.ssp, this.type_obj, criteria);
    }

    get_object(id: number): Promise<GenObject> {
        const http = this.ssp.http;
        const options = this.ssp.get_options();
        return http.get(api_url + this.type_obj.type_name + '/' + id + '/', options)
            .toPromise()
            .then(response => this.type_obj.object_from_streamable(response.json(), true))
            .catch(error => {
                return Promise.reject(error_to_string(error));
            });
    }

    set_object(object: GenObject): Promise<GenObject> {
        const http = this.ssp.http;
        const options = this.ssp.get_options();
        const streamable: s.Streamable = object.get_streamable();

        this.change_source.next(object);
        return http.put(api_url + this.type_obj.type_name + '/' + object.id + '/', streamable, options)
            .toPromise()
            .then(response => {
                const new_object = this.type_obj.object_from_streamable(response.json(), true);
                this.change_source.next(new_object);
                return new_object;
            })
            .catch(error => {
                return Promise.reject(error_to_string(error));
            });
    }
}

class AllServices {
    albums: BaseService<AlbumObject>;
    categorys: BaseService<CategoryObject>;
    places: BaseService<PlaceObject>;
    persons: BaseService<PersonObject>;
    photos: BaseService<PhotoObject>;

    constructor(private readonly ssp: SpudServicePrivate) {
        this.albums = new BaseService<AlbumObject>(ssp, new AlbumType());
        this.categorys = new BaseService<CategoryObject>(ssp, new CategoryType());
        this.places = new BaseService<PlaceObject>(ssp, new PlaceType());
        this.persons = new BaseService<PersonObject>(ssp, new PersonType());
        this.photos = new BaseService<PhotoObject>(ssp, new PhotoType());
    }
}

@Injectable()
export class SpudService {
    private _session: Session = new Session();
    private session_source = new Subject<Session>();
    session_change = this.session_source.asObservable();

    readonly services: AllServices;

    constructor(private readonly http: Http) {
        const ssp: SpudServicePrivate = {
            http: this.http,
            get_options: () => this.options,
            get_session: () => this.session,
        };
        this.services = new AllServices(ssp);
    };

    get_service<GenObject extends BaseObject>(type_obj: BaseType<GenObject>): BaseService<GenObject> {
        return this.services[type_obj.type_name];
    }

    set session(session: Session) {
        this._session = session;
        this.session_source.next(session);
    }

    get session() {
        return this._session;
    }

    private get options(): RequestOptionsArgs {
        const headers = new Headers({
            'Content-Type': 'application/json',
        });

        if (this._session.token != null) {
            headers.set('Authorization', `Token ${this._session.token}`);
        }
        return {
            'headers': headers
        };
    }

    get_list<GenObject extends BaseObject>(type_obj: BaseType<GenObject>, criteria: Map<string, string>): ObjectList<GenObject> {
        const service = this.get_service(type_obj);
        return service.get_list(criteria);
    }

    get_object<GenObject extends BaseObject>(type_obj: BaseType<GenObject>, id: number): Promise<GenObject> {
        const service = this.get_service(type_obj);
        return service.get_object(id);
    }

    set_object<GenObject extends BaseObject>(type_obj: BaseType<GenObject>, object: GenObject): Promise<GenObject> {
        const service = this.get_service(type_obj);
        return service.set_object(object);
    }

    get_session(): Promise<Session> {
        return this.http.get(api_url + 'session/', this.options)
            .toPromise()
            .then(response => {
                const session: Session = new Session();
                session.set_streamable(response.json());
                this.session = session;
                return session;
            })
            .catch(error => {
                return Promise.reject(error_to_string(error));
            });
    }

    login(username, password): Promise<Session> {
        return this.http.post(api_url + 'session/login/', {username, password}, this.options)
            .toPromise()
            .then(response => {
                const session: Session = new Session();
                session.set_streamable(response.json());
                this.session = session;
                return session;
            })
            .catch(error => {
                return Promise.reject(error_to_string(error));
            });
    }

    logout(): Promise<Session> {
        return this.http.post(api_url + 'session/logout/', {}, this.options)
            .toPromise()
            .then(response => {
                const session: Session = new Session();
                session.set_streamable(response.json());
                this.session = session;
                return session;
             })
            .catch(error => {
                return Promise.reject(error_to_string(error));
            });
    }

}

