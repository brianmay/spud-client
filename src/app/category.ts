import { Streamable } from './streamable'
import { BaseObject, BaseType } from './base'

export class CategoryObject extends BaseObject {
    constructor() { super('categorys'); }
}

export class CategoryType extends BaseType<CategoryObject> {
    constructor() { super('categorys'); }

    object_from_streamable(streamable : Streamable) : CategoryObject {
        let obj = new CategoryObject()
        obj.set_streamable(streamable)
        return obj
    }
}
