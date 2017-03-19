import { Component } from '@angular/core';
import { BaseListComponent } from './base.component'
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
