import { Component, Input } from '@angular/core';

import { DateTimeZone } from './basic';
import { BaseObject } from './base';

@Component({
    selector: 'basic_datetimezone',
    templateUrl: './basic-datetimezone.component.html',
})
export class BasicDatetimezoneComponent {
    @Input() datetimezone : DateTimeZone;
}
