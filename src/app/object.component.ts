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
import { Subscription } from 'rxjs/Subscription';

import { BaseObject } from './base';
import { ObjectList } from './spud.service';

@Component({
    selector: 'object_link',
    templateUrl: './object-link.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectLinkComponent<GenObject extends BaseObject> {
    @Input() object: GenObject;
}

@Component({
    selector: 'object_array',
    templateUrl: './object-array.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectArrayComponent<GenObject extends BaseObject> {
    @Input() list: Array<GenObject>;
    @Input() sep = ', ';
}

@Component({
    selector: 'object_list_item',
    templateUrl: './object-list-item.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectListItemComponent<GenObject extends BaseObject> {
    @Input() object: GenObject;
    @Input() selected: boolean;

    @Output() selected_change = new EventEmitter();
    public select_object() {
        this.selected_change.emit(true);
    }

    @Output() activated_change = new EventEmitter();
    public activate_object() {
        this.activated_change.emit(true);
    }
}

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
        this.objects = list.get_objects();
        this.list_finished = false;
        this.list_subscription = this.list.change.subscribe(
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
        if (this.objects.size <= 0) {
            this.get_next_page();
        }
    }

    public objects: List<GenObject>;
    private list: ObjectList<GenObject>;
    public list_finished = false;
    private list_subscription: Subscription;
    public error: string;

    constructor(private readonly ref: ChangeDetectorRef) {}

    public get_next_page(): void {
        this.list.get_next_page();
    }

    @Input() selected_object: GenObject;
    @Output() selected_object_change = new EventEmitter();
    public select_object(object: GenObject) {
        this.selected_object = object;
        this.selected_object_change.emit(object);
    }

    @Output() activated_object_change = new EventEmitter();
    public activate_object(object: GenObject) {
        this.activated_object_change.emit(object);
    }

    ngOnDestroy(): void {
        if (this.list_subscription != null) {
            this.list_subscription.unsubscribe();
        }
    }
}
