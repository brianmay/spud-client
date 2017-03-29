import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';

import { PageScrollService } from 'ng2-page-scroll';

import { BaseListComponent, BaseDetailComponent } from './base.component'
import { PlaceObject, PlaceType } from './place'
import { SpudService } from './spud.service'

@Component({
    selector: 'place_list',
    templateUrl: './base-list.component.html',
})
export class PlaceListComponent extends BaseListComponent<PlaceObject> {
    title = 'Place List';
    protected readonly type_obj = new PlaceType();
}

@Component({
    selector: 'place_detail',
    templateUrl: './base-detail.component.html',
})
export class PlaceDetailComponent extends BaseDetailComponent<PlaceObject> {
    protected readonly type_obj = new PlaceType();

    protected get_photo_criteria(object : PlaceObject) : Map<string,string> {
        let photo_criteria = new Map<string,string>()
        photo_criteria.set('place', String(object.id))
        photo_criteria.set('place_descendants', String(true))
        return photo_criteria
    }
}
