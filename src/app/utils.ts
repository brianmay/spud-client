import { cloneDeep } from 'lodash';

export function single_to_array<GenType> (item: GenType): GenType[] {
    if (item) {
        return [item];
    } else {
        return [];
    }
}

export function array_to_single<GenType> (array: GenType[]): GenType {
    if (array.length > 0) {
        return array[0];
    } else {
        return null;
    }
}
