import { DateTimeZone, StringDict } from './basic_types';
import * as moment from 'moment';

type BaseStreamableType = string|boolean|number;
export type Streamable = StreamableObject|BaseStreamableType|Array<StreamableObject|BaseStreamableType>;

class StreamableObject {
    [ index : string ] : Streamable;
}

export function streamable_to_number(value : Streamable) : number {
    if (typeof value === "string") {
        return parseInt(value, 10);
    } else if (typeof value === "number") {
        return value;
    } else {
        return null;
    }
}

export function streamable_to_string(value : Streamable) : string {
    if (typeof value === "string") {
        return value;
    } else if (typeof value === "number") {
        return value + "";
    } else if (typeof value === "boolean") {
        return value + "";
    } else {
        return null;
    }
}

export function streamable_to_boolean(value : Streamable) : boolean {
    if (typeof value === "string") {
        if (value.toLowerCase()=="true") {
            return true;
        } else if (value.toLowerCase()=="false") {
            return false;
        } else {
            return null;
        }
    } else if (typeof value === "number") {
        return (value)?true:false;
    } else if (typeof value === "boolean") {
        return value;
    } else {
        return null;
    }
}

export function streamable_to_datetimezone(value : Streamable, offset : number) : DateTimeZone {
    if (typeof value === "string") {
        return [
            moment.utc(value),
            offset,
        ];
    } else {
        return null;
    }
}

//export function streamable_to_number_array(value : Streamable) : Array<number> {
//    if (typeof value === "string") {
//        let str_array : Array<string> = value.split(",")
//        return $.map(str_array, (item : string) => { return parseInt(item, 10); })
//    } else {
//        return null
//    }
//}

export function streamable_to_array(value : Streamable) : Array<Streamable> {
    if (value instanceof Array) {
        return value;
    } else {
        return [];
    }
}

export function streamable_to_string_array(value : Streamable) : StringDict<Streamable> {
    if (value instanceof Object) {
        return value as StringDict<Streamable>
    } else {
        return {}
    }
}

//export function streamable_to_object(value : Streamable) : StreamableObject {
//    if (value instanceof Object) {
//        return value as StreamableObject;
//    } else {
//        return null;
//    }
//}

export function get_streamable_item(streamable : Streamable, key : string) : Streamable {
    if (streamable == null) {
        return null;
    }
    return streamable[key];
}

export function get_streamable_number(streamable : Streamable, key : string) : number {
    let value = get_streamable_item(streamable, key);
    return streamable_to_number(value);
}

export function get_streamable_string(streamable : Streamable, key : string) : string {
    let value = get_streamable_item(streamable, key);
    return streamable_to_string(value);
}

export function get_streamable_boolean(streamable : Streamable, key : string) : boolean {
    let value = get_streamable_item(streamable, key);
    return streamable_to_boolean(value);
}

export function get_streamable_datetimezone(streamable : Streamable, key : string, offset : number) : DateTimeZone {
    let value = get_streamable_item(streamable, key);
    return streamable_to_datetimezone(value, offset);
}

//export function get_streamable_number_array(streamable : Streamable, key : string) : Array<number> {
//    let value = get_streamable_item(streamable, key);
//    return streamable_to_number_array(value);
//}

export function get_streamable_array(streamable : Streamable, key : string) : Array<Streamable> {
    let value = get_streamable_item(streamable, key);
    return streamable_to_array(value);
}

export function get_streamable_string_array(streamable : Streamable, key : string) : StringDict<Streamable> {
    let value = get_streamable_item(streamable, key);
    return streamable_to_string_array(value);
}

//export function get_streamable_object(streamable : Streamable, key : string) : StreamableObject {
//    let value = get_streamable_item(streamable, key);
//    return streamable_to_object(value);
//}

export function datetimezone_datetime_to_streamable(value : DateTimeZone) : string {
    if (value != null) {
        return value[0].toISOString()
    } else {
        return null
    }
}

export function datetimezone_offset_to_streamable(value : DateTimeZone) : number {
    if (value != null) {
        return value[1]
    } else {
        return null
    }
}
