import { Component, Input } from '@angular/core';

import { BaseListComponent, BaseDetailComponent } from './base.component';
import { PlaceObject, PlaceType } from './place';

@Component({
    selector: 'place_list',
    templateUrl: './base-list.component.html',
})
export class PlaceListComponent extends BaseListComponent<PlaceObject> {
    title = 'Place List';
    public readonly type_obj = new PlaceType();
}

@Component({
    selector: 'place_detail',
    templateUrl: './base-detail.component.html',
})
export class PlaceDetailComponent extends BaseDetailComponent<PlaceObject> {
    public readonly type_obj = new PlaceType();

    protected get_photo_criteria(object: PlaceObject): Map<string, string> {
        const photo_criteria = new Map<string, string>();
        photo_criteria.set('place', String(object.id));
        photo_criteria.set('place_descendants', String(true));
        return photo_criteria;
    }
}

@Component({
    selector: 'place_infobox',
    templateUrl: './place-infobox.component.html',
})
export class PlaceInfoboxComponent {
    @Input() object: PlaceObject;
}
