import { Streamable } from './streamable'
import { BaseObject, BaseType } from './base'

export class PlaceObject extends BaseObject {
    constructor() { super('places'); }
}

export class PlaceType extends BaseType<PlaceObject> {
    constructor() { super('places'); }

    object_from_streamable(streamable : Streamable) : PlaceObject {
        let obj = new PlaceObject()
        obj.set_streamable(streamable)
        return obj
    }
}
