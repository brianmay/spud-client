import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseObject } from './base';

import { ObjectList } from './spud.service';

@Component({
    selector: 'object_list',
    templateUrl: './object-list.component.html',
})
export class ObjectListComponent<GenObject extends BaseObject> {
    @Input('list') set set_list(list: ObjectList<GenObject>) {
        this.list = list;
        this.get_next_page();
    }
    @Input() selected_object: GenObject;
    @Output() selected_objectChange = new EventEmitter();
    // private objects: Array<GenObject>;

    public list: ObjectList<GenObject>;
    public error: string;

    constructor() {}

    public get_next_page(): void {
        //noinspection JSUnusedLocalSymbols
        this.list.get_next_page()
            .then((objects: Array<GenObject>) => {
                this.error = null;
            })
            .catch((message: string) => {
                this.error = message;
            });
    }

    public select_object(object: GenObject) {
        this.selected_object = object;
        this.selected_objectChange.emit(object);
    }
}
