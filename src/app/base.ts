import * as s from './streamable'

// We can't do this as it creates an import loop.
// import { PhotoObject } from './photo'


// Hack as we can't import PhotoObject directly into this module.
export interface PhotoInterface {
    id : number
    title : string
};

type photo_constructor = (streamable: s.Streamable) => PhotoInterface;

var photo_constructor : photo_constructor;

export function set_photo_constructor(pc : photo_constructor) : void {
    photo_constructor = pc;
}


export class BaseObject {
    id : number
    title : string
    cover_photo : PhotoInterface
    private full_object : boolean

    constructor(readonly type_name : string, readonly type_verbose : string) {}

    set_streamable(streamable : s.Streamable, full_object : boolean) {
        this.full_object = full_object
        this.id = s.get_streamable_number(streamable, "id")
        this.title = s.get_streamable_string(streamable, "title")

        let streamable_cover_photo = s.get_streamable_item(streamable, 'cover_photo')
        if (streamable_cover_photo != null) {
            this.cover_photo = photo_constructor(streamable_cover_photo)
        }
    }

    get_streamable() : s.Streamable {
        let streamable : s.Streamable = {}
        streamable['id'] = this.id
        streamable['title'] = this.title
        if (this.cover_photo != null) {
            streamable['cover_photo_pk'] = this.cover_photo.id
        }
        return streamable
    }

    is_full_object() : boolean {
        return this.full_object
    }
}

export abstract class BaseType<GenObject extends BaseObject> {
    constructor(readonly type_name : string) {}
    abstract object_from_streamable(streamable : s.Streamable, full_object : boolean) : GenObject;
}
