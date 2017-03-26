import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageScrollService } from 'ng2-page-scroll';

import { BaseListComponent, BaseDetailComponent } from './base.component'
import { base_url } from './settings';
import { PhotoObject, PhotoType } from './photo'
import { SpudService } from './spud.service'

@Component({
    selector: 'photo_list',
    templateUrl: './base-list.component.html',
})
export class PhotoListComponent extends BaseListComponent<PhotoObject> {
    title = 'Photo List';

    constructor(
            spud_service: SpudService,
            page_scroll_service: PageScrollService,
            ) {
        super(new PhotoType(), spud_service, page_scroll_service);
    }
}

@Component({
    selector: 'photo_detail',
    templateUrl: './base-detail.component.html',
})
export class PhotoDetailComponent extends BaseDetailComponent<PhotoObject> {
    constructor(
            route: ActivatedRoute,
            spud_service: SpudService,
            page_scroll_service: PageScrollService,
            ) {
        super(new PhotoType(), route, spud_service, page_scroll_service);
    }

    protected get_photo_criteria(object : PhotoObject) : Map<string,string> {
        return null;
    }
}

@Component({
    selector: 'photo_thumb',
    templateUrl: './photo-thumb.component.html',
})
export class PhotoThumbComponent {
    @Input() photo : PhotoObject;
    private readonly base_url : string = base_url
}

@Component({
    selector: 'photo_mid',
    templateUrl: './photo-mid.component.html',
})
export class PhotoMidComponent {
    @Input() photo : PhotoObject;
    private readonly base_url : string = base_url
}
