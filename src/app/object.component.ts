import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseObject } from './base';

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
