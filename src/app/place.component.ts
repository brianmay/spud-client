import { Component, Input, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageScrollService } from 'ng2-page-scroll';

import { BaseListComponent, BaseDetailComponent } from './base.component';
import { PlaceObject, PlaceType } from './place';
import { SpudService } from './spud.service';

@Component({
    selector: 'place_list',
    templateUrl: './base-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceListComponent extends BaseListComponent<PlaceObject> {
    title = 'Place List';
    public readonly type_obj = new PlaceType();

    constructor(
        @Inject(ActivatedRoute) route: ActivatedRoute,
        @Inject(SpudService) spud_service: SpudService,
        @Inject(ChangeDetectorRef) ref: ChangeDetectorRef,
    ) {
        super(route, spud_service, ref);
    }
}

@Component({
    selector: 'place_detail',
    templateUrl: './base-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceDetailComponent extends BaseDetailComponent<PlaceObject> {
    public readonly type_obj = new PlaceType();

    constructor(
        @Inject(ActivatedRoute) route: ActivatedRoute,
        @Inject(SpudService) spud_service: SpudService,
        @Inject(PageScrollService) page_scroll_service: PageScrollService,
        @Inject(ChangeDetectorRef) ref: ChangeDetectorRef,
    ) {
        super(route, spud_service, page_scroll_service, ref);
    }

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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceInfoboxComponent {
    @Input() object: PlaceObject;
}
