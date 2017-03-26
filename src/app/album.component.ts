import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent, BaseDetailComponent } from './base.component'
import { AlbumObject, AlbumType } from './album'

import { SpudService } from './spud.service'

@Component({
    selector: 'album_list',
    templateUrl: './base-list.component.html',
})
export class AlbumListComponent extends BaseListComponent<AlbumObject> {
    title = 'Album';

    constructor(spud_service: SpudService) {
        super(new AlbumType(), spud_service);
    }
}

@Component({
    selector: 'album_detail',
    templateUrl: './base-detail.component.html',
})
export class AlbumDetailComponent extends BaseDetailComponent<AlbumObject> {
    title = 'Album';

    constructor(
            route: ActivatedRoute,
            spud_service: SpudService
            ) {
        super(new AlbumType(), route, spud_service);
    }
}
