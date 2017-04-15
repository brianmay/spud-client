import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import * as moment from 'moment';

import { DateTimeZone } from './basic';


@Component({
    selector: 'basic_datetimezone',
    templateUrl: './basic-datetimezone.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicDatetimezoneComponent {
    @Input() set datetimezone(datetimezone: DateTimeZone) {
        if (datetimezone != null) {
            let revised: moment.Moment;
            revised = datetimezone[0];
            revised.utcOffset(datetimezone[1]);
            this.display = revised.format('dddd, MMMM Do YYYY, h:mm:ss a ZZ');
        } else {
            this.display = 'N/A';
        }
    }
    display: string;
}
