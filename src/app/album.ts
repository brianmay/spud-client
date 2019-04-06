import * as s from './streamable';
import { DateTimeZone } from './basic';
import { BaseObject, BaseType } from './base';

export class AlbumObject extends BaseObject {
    revised: DateTimeZone;
    sort_order: string;
    sort_name: string;
    ascendants: Array<AlbumObject>;
    parent: AlbumObject;

    constructor() { super('albums', 'Album'); }

    set_streamable(streamable: s.Streamable, full_object: boolean) {
        super.set_streamable(streamable, full_object);

        this.description = s.get_streamable_string(streamable, 'description');
        this.sort_order = s.get_streamable_string(streamable, 'sort_order');
        this.sort_name = s.get_streamable_string(streamable, 'sort_name');
        const utc_offset: number = s.get_streamable_number(streamable, 'revised_utc_offset');
        this.revised = s.get_streamable_datetimezone(streamable, 'revised', utc_offset);

        const ascendants = s.get_streamable_array(streamable, 'ascendants');
        this.ascendants = [];
        for (let i = 0; i < ascendants.length; i++) {
            const item = ascendants[i];
            const album = new AlbumObject();
            album.set_streamable(item, false);
            this.ascendants.push(album);
        }
        if (ascendants.length > 0) {
            const item = ascendants[0];
            this.parent = new AlbumObject();
            this.parent.set_streamable(item, false);
        } else {
            this.parent = null;
        }
    }

    get_streamable(): s.Streamable {
        const streamable: s.Streamable = super.get_streamable();
        streamable['description'] = this.description;
        streamable['sort_order'] = this.sort_order;
        streamable['sort_name'] = this.sort_name;
        streamable['revised_utc_offset'] = s.datetimezone_offset_to_streamable(this.revised);
        streamable['revised'] = s.datetimezone_datetime_to_streamable(this.revised);
        if (this.parent != null) {
            streamable['parent'] = this.parent.id;
        } else {
            streamable['parent'] = null;
        }
        return streamable;
    }
}

export class AlbumType extends BaseType<AlbumObject> {
    constructor() { super('albums', 'Album'); }

    object_from_streamable(streamable: s.Streamable, full_object: boolean): AlbumObject {
        const obj = new AlbumObject();
        obj.set_streamable(streamable, full_object);
        return obj;
    }

    new_object(parent: AlbumObject): AlbumObject {
        const obj = new AlbumObject();
        obj.title = 'New album';
        obj.parent = parent;
        return obj;
    }

    get_photo_criteria(object: AlbumObject): Map<string, string> {
        const photo_criteria = new Map<string, string>();
        photo_criteria.set('album', String(object.id));
        photo_criteria.set('album_descendants', String(true));
        return photo_criteria;
    }
}
