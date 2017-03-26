import * as s from './streamable'
import { BaseObject, BaseType } from './base'

export class CategoryObject extends BaseObject {
    description : string
    sort_order : string
    sort_name : string
    ascendants : Array<CategoryObject>
    parent : CategoryObject

    constructor() { super('categorys'); }

    set_streamable(streamable : s.Streamable) : void {
        super.set_streamable(streamable)

        this.description = s.get_streamable_string(streamable, 'description')
        this.sort_order = s.get_streamable_string(streamable, 'sort_order')
        this.sort_name = s.get_streamable_string(streamable, 'sort_name')

        let ascendants = s.get_streamable_array(streamable, 'ascendants')
        this.ascendants = []
        for (let i=0; i<ascendants.length; i++) {
            let item = ascendants[i]
            let category = new CategoryObject()
            category.set_streamable(item)
            this.ascendants.push(category)
        }
        if (ascendants.length > 0) {
            let item = ascendants[0]
            this.parent = new CategoryObject()
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
        if (this.parent != null) {
            streamable['parent'] = this.parent.id
        } else {
            streamable['parent'] = null
        }
        return streamable
    }
}

export class CategoryType extends BaseType<CategoryObject> {
    constructor() { super('categorys'); }

    object_from_streamable(streamable : s.Streamable) : CategoryObject {
        let obj = new CategoryObject()
        obj.set_streamable(streamable)
        return obj
    }
}
