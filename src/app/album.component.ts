import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageScrollService } from 'ng2-page-scroll';

import { BaseListComponent, BaseDetailComponent } from './base.component'
import { AlbumObject, AlbumType } from './album'
import { SpudService } from './spud.service'

@Component({
    selector: 'album_list',
    templateUrl: './base-list.component.html',
})
export class AlbumListComponent extends BaseListComponent<AlbumObject> {
    title = 'Album List';

    constructor(
            spud_service: SpudService,
            page_scroll_service: PageScrollService,
            ) {
        super(new AlbumType(), spud_service, page_scroll_service);
    }
}

@Component({
    selector: 'album_detail',
    templateUrl: './base-detail.component.html',
})
export class AlbumDetailComponent extends BaseDetailComponent<AlbumObject> {
    constructor(
            route: ActivatedRoute,
            spud_service: SpudService,
            page_scroll_service: PageScrollService,
            ) {
        super(new AlbumType(), route, spud_service, page_scroll_service);
    }

    protected get_photo_criteria(object : AlbumObject) : Map<string,string> {
        let photo_criteria = new Map<string,string>()
        photo_criteria.set('album', String(object.id))
        photo_criteria.set('album_descendants', String(true))
        return photo_criteria
    }
}
