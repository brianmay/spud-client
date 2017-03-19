import { Component } from '@angular/core';
import { BaseListComponent } from './base.component'
import { PlaceObject, PlaceType } from './place'

import { SpudService } from './spud.service'

@Component({
    selector: 'place_list',
    templateUrl: './base-list.component.html',
    styleUrls: ['./base-list.component.css']
})
export class PlaceListComponent extends BaseListComponent<PlaceObject> {
    title = 'Place';

    constructor(spud_service: SpudService) {
        super(new PlaceType(), spud_service);
    }
}
