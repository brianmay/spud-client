import { Component, Input, ViewChild } from '@angular/core';
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
    protected readonly type_obj = new PhotoType();
}

@Component({
    selector: 'photo_detail',
    templateUrl: './base-detail.component.html',
})
export class PhotoDetailComponent extends BaseDetailComponent<PhotoObject> {
    protected readonly type_obj = new PhotoType();

    protected get_photo_criteria(object : PhotoObject) : Map<string,string> {
        return null;
    }
}

@Component({
    selector: 'photo_infobox',
    templateUrl: './photo-infobox.component.html',
})
export class PhotoInfoboxComponent {
    @Input() object : PhotoObject;
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
    @ViewChild('video') video;
    _photo : PhotoObject;
    @Input('photo') set photo(photo:PhotoObject) {
        if (this._photo!==photo && this.video) {
            this.video.nativeElement.load()
        }
        this._photo = photo;
    }
    get photo() : PhotoObject {
        return this._photo;
    }
    private readonly base_url : string = base_url
}

@Component({
    selector: 'photo_large',
    templateUrl: './photo-large.component.html',
})
export class PhotoLargeComponent {
    @ViewChild('video') video;
    _photo : PhotoObject;
    @Input('photo') set photo(photo:PhotoObject) {
        if (this._photo!==photo && this.video) {
            this.video.nativeElement.load()
        }
        this._photo = photo;
    }
    get photo() : PhotoObject {
        return this._photo;
    }
    private readonly base_url : string = base_url
}
