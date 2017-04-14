import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnDestroy,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';

import { List } from 'immutable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { BaseObject } from './base';
import { ObjectList } from './spud.service';

@Component({
    selector: 'object_list',
    templateUrl: './object-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectListComponent<GenObject extends BaseObject> implements OnDestroy {
    @Input('list') set set_list(list: ObjectList<GenObject>) {
        if (this.list_subscription != null) {
            this.list_subscription.unsubscribe();
        }
        this.list = list;
        this.list_finished = false;
        this.list_subscription = this.list.new_page.subscribe(
            (objects) => {
                this.objects = objects;
                this.ref.markForCheck();
            },
            (error) => {
                this.error = error;
                this.ref.markForCheck();
            },
            () => {
                this.list_finished = true;
                this.ref.markForCheck();
            },
        );
        this.get_next_page();
    }
    @Input() selected_object: GenObject;
    @Output() selected_objectChange = new EventEmitter();

    public objects: List<GenObject>;
    private list: ObjectList<GenObject>;
    public list_finished = false;
    private list_subscription: Subscription;
    public error: string;

    constructor(private readonly ref: ChangeDetectorRef) {}

    public get_next_page(): void {
        this.list.get_next_page();
    }

    public select_object(object: GenObject) {
        this.selected_object = object;
        this.selected_objectChange.emit(object);
    }

    ngOnDestroy(): void {
        if (this.list_subscription != null) {
            this.list_subscription.unsubscribe();
        }
    }
}
