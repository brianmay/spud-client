import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent, BaseDetailComponent } from './base.component'

import { base_url } from './settings';
import { PhotoObject, PhotoType } from './photo'

import { SpudService } from './spud.service'

@Component({
    selector: 'photo_list',
    templateUrl: './base-list.component.html',
    styleUrls: ['./base-list.component.css']
})
export class PhotoListComponent extends BaseListComponent<PhotoObject> {
    title = 'Photo';

    constructor(spud_service: SpudService) {
        super(new PhotoType(), spud_service);
    }
}

@Component({
    selector: 'photo_detail',
    templateUrl: './base-detail.component.html',
    styleUrls: ['./base-detail.component.css']
})
export class PhotoDetailComponent extends BaseDetailComponent<PhotoObject> {
    title = 'Photo';

    constructor(
            route: ActivatedRoute,
            spud_service: SpudService
            ) {
        super(new PhotoType(), route, spud_service);
    }
}

@Component({
    selector: 'photo_thumb',
    templateUrl: './photo-thumb.component.html',
    styleUrls: ['./photo-thumb.component.css']
})
export class PhotoThumbComponent {
    @Input() photo : PhotoObject;
    private readonly base_url : string = base_url
}
