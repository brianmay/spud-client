import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent, BaseDetailComponent } from './base.component'
import { PlaceObject, PlaceType } from './place'

import { SpudService } from './spud.service'

@Component({
    selector: 'place_list',
    templateUrl: './base-list.component.html',
})
export class PlaceListComponent extends BaseListComponent<PlaceObject> {
    title = 'Place';

    constructor(spud_service: SpudService) {
        super(new PlaceType(), spud_service);
    }
}

@Component({
    selector: 'place_detail',
    templateUrl: './base-detail.component.html',
})
export class PlaceDetailComponent extends BaseDetailComponent<PlaceObject> {
    title = 'Place';

    constructor(
            route: ActivatedRoute,
            spud_service: SpudService
            ) {
        super(new PlaceType(), route, spud_service);
    }
}
