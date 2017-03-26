import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseObject } from './base';

import { ObjectList } from './spud.service';

@Component({
    selector: 'object_list',
    templateUrl: './object-list.component.html',
})
export class ObjectListComponent<GenObject extends BaseObject> {
    @Input('list') set set_list(list : ObjectList<GenObject>) {
        this.list = list;
        this.get_next_page();
    }
    @Input() selected_object : GenObject;
    @Output() selected_objectChange = new EventEmitter();
    //private objects : Array<GenObject>;

    private list : ObjectList<GenObject>;
    private finished : boolean = false;
    private error : string

    constructor() {}

    private get_next_page() : void {
        this.list.get_next_page()
            .then((objects : Array<GenObject>) => {
                // this.objects = this.list.get_objects()
                if (this.list.finished) {
                    this.finished = true;
                }
                this.error = null;
            })
            .catch((message : string) => {
                this.error = message;
            })
    }

    private select_object(object : GenObject) {
        this.selected_object = object
        this.selected_objectChange.emit(object);
    }
}
