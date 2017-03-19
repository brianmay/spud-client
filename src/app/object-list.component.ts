import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { BaseObject } from './base';

import { ObjectList } from './spud.service';

import { base_url } from './settings';

@Component({
    selector: 'object_list',
    templateUrl: './object-list.component.html',
    styleUrls: ['./object-list.component.css']
})
export class ObjectListComponent<GenObject extends BaseObject> implements OnInit {
    private readonly base_url : string = base_url
    @Input() list : ObjectList<GenObject>;
    @Output() selected_object = new EventEmitter();
    //private objects : Array<GenObject>;
    private finished : boolean = false;
    private error : string

    constructor() {}

    ngOnInit(): void {
        this.get_next_page();
    }

    get_next_page() : void {
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

    select_object(object : GenObject) {
        this.selected_object.emit(object);
    }
}
