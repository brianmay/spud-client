import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams, RequestOptionsArgs } from '@angular/http';

import { Subject }    from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';

import { NumberDict } from './basic';
import { api_url } from './settings';
import * as s from './streamable';
import { BaseObject, BaseType } from './base';
import { Session } from './session';


class IndexEntry {
    prev_id : number;
    next_id : number;
}

export class ObjectList<GenObject extends BaseObject> {
    private page : number = 1;
    private prev_id : number = null;
    private objects : GenObject[] = [];
    private index : NumberDict<IndexEntry> = {};
    finished : boolean = false;
    empty : boolean = true;

    constructor(
        private readonly http: Http,
        private _session : Session,
        private readonly type_obj : BaseType<GenObject>,
        private readonly criteria : Map<string,string>,
    ) { };

    private get options() : RequestOptionsArgs {
        let headers = new Headers({
            'Content-Type': 'application/json',
        });

        if (this._session.token != null) {
            headers.set('Authorization', `Token ${this._session.token}`)
        };

        return {
            'headers': headers
        };
    }


    private streamable_to_object_list(
            streamable : s.Streamable) : GenObject[] {
        if (!streamable['next']) {
            this.finished = true;
        }

        let results : GenObject[] = [];
        let array : s.Streamable[] = s.streamable_to_array(streamable['results']);
        for (let i of array) {
            let object : GenObject = this.type_obj.object_from_streamable(i, false);
            if (this.index[object.id] != null) {
                // If this is a duplicate photo, skip it.
                continue
            }

            results.push(object);
            this.objects.push(object);

            this.index[object.id] = new IndexEntry();
            this.index[object.id].prev_id = this.prev_id;
            this.index[object.id].next_id = null;
            if (this.prev_id != null) {
                this.index[this.prev_id].next_id = object.id
            }
            this.prev_id = object.id
            this.empty = false
        }
        return results;
    }

    get_next_page(): Promise<GenObject[]> {
        let params = new URLSearchParams();

        if (this.criteria != null) {
            this.criteria.forEach((value: string, key: string) => {
                params.set(key, value);
            });
        }
        params.set('page', String(this.page));

        let options : RequestOptionsArgs = this.options;
        options.search = params
;
        return this.http.get(api_url + this.type_obj.type_name + "/", options)
            .toPromise()
            .then(response => {
                this.page = this.page + 1;
                return this.streamable_to_object_list(response.json());
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        let json = error.json();
        if (json.detail) {
            console.error('An JSON error occurred', json.detail);
            return Promise.reject(json.detail);
        } else {
            console.error('An error occurred', error.toString());
            return Promise.reject(error.toString())
        }
    }

    get_index(id : number) : IndexEntry {
        return this.index[id];
    }

    get_objects() : GenObject[] {
        return this.objects
    }
}

@Injectable()
export class SpudService {
    private _session : Session = new Session();


    constructor(private http: Http) { };

    set session(session: Session) {
        this._session = session;
        this.session_source.next(session)
    }

    get session() {
        return this._session;
    }
    private session_source = new Subject<Session>();
    session_change = this.session_source.asObservable();

    private get options() : RequestOptionsArgs {
        let headers = new Headers({
            'Content-Type': 'application/json',
        });

        if (this._session.token != null) {
            headers.set('Authorization', `Token ${this._session.token}`)
        };

        return {
            'headers': headers
        };
    }

    get_list<GenObject extends BaseObject>(type_obj : BaseType<GenObject>, criteria : Map<string,string>): ObjectList<GenObject> {
        return new ObjectList(this.http, this._session, type_obj, criteria)
    }

    get_object<GenObject extends BaseObject>(type_obj : BaseType<GenObject>, id : number): Promise<GenObject> {
        return this.http.get(api_url + type_obj.type_name + "/" + id + "/", this.options)
            .toPromise()
            .then(response => type_obj.object_from_streamable(response.json(), true))
            .catch(this.handleError);
    }

    get_session() : Promise<Session> {
        return this.http.get(api_url + "session/", this.options)
            .toPromise()
            .then(response => {
                let session : Session = new Session();
                session.set_streamable(response.json());
                this.session = session;
                console.log(response);
                return session;
             })
            .catch(this.handleError);
    }

    login(username, password) : Promise<Session> {
        return this.http.post(api_url + "session/login/", {username, password}, this.options)
            .toPromise()
            .then(response => {
                let session : Session = new Session();
                session.set_streamable(response.json());
                this.session = session;
                console.log(response);
                return session;
             })
            .catch(this.handleError);
    }

    logout() : Promise<Session> {
        return this.http.post(api_url + "session/logout/", {}, this.options)
            .toPromise()
            .then(response => {
                let session : Session = new Session();
                session.set_streamable(response.json());
                this.session = session;
                console.log(response);
                return session;
             })
            .catch(this.handleError);
    }


    private handleError(error: any): Promise<any> {
        let json = error.json();
        if (json.detail) {
            console.error('An JSON error occurred', json.detail);
            return Promise.reject(json.detail);
        } else {
            console.error('An error occurred', error.toString());
            return Promise.reject(error.toString())
        }
    }
}

