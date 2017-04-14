import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { DateTimeZone } from './basic';

@Component({
    selector: 'basic_datetimezone',
    templateUrl: './basic-datetimezone.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicDatetimezoneComponent {
    @Input() datetimezone: DateTimeZone;
}
