import { Component, Input } from '@angular/core';

import { DateTimeZone } from './basic';

@Component({
    selector: 'basic_datetimezone',
    templateUrl: './basic-datetimezone.component.html',
})
export class BasicDatetimezoneComponent {
    @Input() datetimezone: DateTimeZone;
}
