import { NumberDict } from './basic';
import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { api_url } from './settings';
import * as s from './streamable';
import { BaseObject, BaseType } from './base';


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
        private http: Http,
        readonly type_obj : BaseType<GenObject>,
        readonly criteria : Map<string,string>,
    ) { };

    private streamable_to_object_list(
            streamable : s.Streamable) : GenObject[] {
        if (!streamable['next']) {
            this.finished = true;
        }

        let results : GenObject[] = [];
        let array : s.Streamable[] = s.streamable_to_array(streamable['results']);
        for (let i of array) {
            let object : GenObject = this.type_obj.object_from_streamable(i, true);
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

        return this.http.get(api_url + this.type_obj.type_name + "/", { search: params })
            .toPromise()
            .then(response => {
                this.page = this.page + 1;
                return this.streamable_to_object_list(response.json());
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
      console.error('An error occurred', error); // for demo purposes only
      return Promise.reject(error.message || error);
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

    private headers = new Headers({
        'Content-Type': 'application/json',
        'Accept-Charset': 'UTF-8'
    });

    constructor(private http: Http) { };

    get_list<GenObject extends BaseObject>(type_obj : BaseType<GenObject>, criteria : Map<string,string>): ObjectList<GenObject> {
        return new ObjectList(this.http, type_obj, criteria)
    }

    get_object<GenObject extends BaseObject>(type_obj : BaseType<GenObject>, id : number): Promise<GenObject> {
        return this.http.get(api_url + type_obj.type_name + "/" + id + "/")
            .toPromise()
            .then(response => type_obj.object_from_streamable(response.json(), true))
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
      console.error('An error occurred', error); // for demo purposes only
      return Promise.reject(error.message || error);
    }
}

