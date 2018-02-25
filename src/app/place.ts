import * as s from './streamable';
import { BaseObject, BaseType } from './base';

export class PlaceObject extends BaseObject {
    address: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
    url: string;
    urldesc: string;
    notes: string;
    ascendants: Array<PlaceObject>;
    parent: PlaceObject;

    constructor() { super('places', 'Place'); }

    set_streamable(streamable: s.Streamable, full_object: boolean) {
        super.set_streamable(streamable, full_object);

        this.address = s.get_streamable_string(streamable, 'address');
        this.address2 = s.get_streamable_string(streamable, 'address2');
        this.city = s.get_streamable_string(streamable, 'city');
        this.state = s.get_streamable_string(streamable, 'state');
        this.country = s.get_streamable_string(streamable, 'country');
        this.postcode = s.get_streamable_string(streamable, 'postcode');
        this.url = s.get_streamable_string(streamable, 'url');
        this.urldesc = s.get_streamable_string(streamable, 'urldesc');
        this.notes = s.get_streamable_string(streamable, 'notes');

        const ascendants = s.get_streamable_array(streamable, 'ascendants');
        this.ascendants = [];
        for (let i = 0; i < ascendants.length; i++) {
            const item = ascendants[i];
            const place = new PlaceObject();
            place.set_streamable(item, false);
            this.ascendants.push(place);
        }
        if (ascendants.length > 0) {
            const item = ascendants[0];
            this.parent = new PlaceObject();
            this.parent.set_streamable(item, false);
        } else {
            this.parent = null;
        }
    }

    get_streamable(): s.Streamable {
        const streamable: s.Streamable = super.get_streamable();
        streamable['address'] = this.address;
        streamable['address2'] = this.address2;
        streamable['city'] = this.city;
        streamable['state'] = this.state;
        streamable['country'] = this.country;
        streamable['postcode'] = this.postcode;
        streamable['url'] = this.url;
        streamable['urldesc'] = this.urldesc;
        streamable['notes'] = this.notes;
        if (this.parent != null) {
            streamable['parent'] = this.parent.id;
        } else {
            streamable['parent'] = null;
        }
        return streamable;
    }
}

export class PlaceType extends BaseType<PlaceObject> {
    constructor() { super('places', 'Place'); }

    object_from_streamable(streamable: s.Streamable, full_object: boolean): PlaceObject {
        const obj = new PlaceObject();
        obj.set_streamable(streamable, full_object);
        return obj;
    }

    new_object(parent: PlaceObject): PlaceObject {
        const obj = new PlaceObject();
        obj.title = 'New place';
        obj.parent = parent;
        return obj;
    }
}
