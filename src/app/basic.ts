import * as moment from 'moment';

export class NumberDict<T> {
    [key: number]: T;
}

export class StringDict<T> {
    [key: string]: T;
}

export class DateTimeZone {
    0: moment.Moment;
    1: number;
}
