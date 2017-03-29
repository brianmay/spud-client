import * as s from './streamable'
import { DateTimeZone } from './basic'
import { BaseObject, BaseType } from './base'

export class AlbumObject extends BaseObject {
    revised : DateTimeZone
    description : string
    sort_order : string
    sort_name : string
    ascendants : Array<AlbumObject>
    parent : AlbumObject

    constructor() { super('albums'); }

    set_streamable(streamable : s.Streamable) {
        super.set_streamable(streamable)

        this.description = s.get_streamable_string(streamable, 'description')
        this.sort_order = s.get_streamable_string(streamable, 'sort_order')
        this.sort_name = s.get_streamable_string(streamable, 'sort_name')
        let utc_offset : number = s.get_streamable_number(streamable, 'revised_utc_offset')
        this.revised = s.get_streamable_datetimezone(streamable, 'revised', utc_offset)

        let ascendants = s.get_streamable_array(streamable, 'ascendants')
        this.ascendants = []
        for (let i=0; i<ascendants.length; i++) {
            let item = ascendants[i]
            let album = new AlbumObject()
            album.set_streamable(item)
            this.ascendants.push(album)
        }
        if (ascendants.length > 0) {
            let item = ascendants[0]
            this.parent = new AlbumObject()
            this.parent.set_streamable(item)
        } else {
            this.parent = null
        }
    }

    get_streamable() : s.Streamable {
        let streamable : s.Streamable = super.get_streamable()
        streamable['description'] = this.description
        streamable['sort_order'] = this.sort_order
        streamable['sort_name'] = this.sort_name
        streamable['revised_utc_offset'] = s.datetimezone_offset_to_streamable(this.revised)
        streamable['revised'] = s.datetimezone_datetime_to_streamable(this.revised)
        if (this.parent != null) {
            streamable['parent'] = this.parent.id
        } else {
            streamable['parent'] = null
        }
        return streamable
    }
}

export class AlbumType extends BaseType<AlbumObject> {
    constructor() { super('albums'); }

    object_from_streamable(streamable : s.Streamable) : AlbumObject {
        let obj = new AlbumObject()
        obj.set_streamable(streamable)
        return obj
    }
}
