import { Component, Input } from '@angular/core';
import { BaseObject } from './base';

@Component({
    selector: 'object_link',
    templateUrl: './object-link.component.html',
})
export class ObjectLinkComponent<GenObject extends BaseObject> {
    @Input() object : GenObject;
}
