import { Streamable } from './streamable'
import { BaseObject, BaseType } from './base'

export class PersonObject extends BaseObject {
    constructor() { super('persons'); }
}

export class PersonType extends BaseType<PersonObject> {
    constructor() { super('persons'); }

    object_from_streamable(streamable : Streamable) : PersonObject {
        let obj = new PersonObject()
        obj.set_streamable(streamable)
        return obj
    }
}
