import { Component, Input, Inject, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageScrollService } from 'ng2-page-scroll';

import { BaseListComponent, BaseDetailComponent } from './base.component';
import { base_url } from './settings';
import { PhotoObject, PhotoType } from './photo';
import { SpudService } from './spud.service';

@Component({
    selector: 'photo_list',
    templateUrl: './base-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoListComponent extends BaseListComponent<PhotoObject> {
    title = 'Photo List';
    public readonly type_obj = new PhotoType();

    constructor(
        @Inject(ActivatedRoute) route: ActivatedRoute,
        @Inject(SpudService) spud_service: SpudService,
        @Inject(ChangeDetectorRef) ref: ChangeDetectorRef,
    ) {
        super(route, spud_service, ref);
    }
}

@Component({
    selector: 'photo_detail',
    templateUrl: './base-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoDetailComponent extends BaseDetailComponent<PhotoObject> {
    public readonly type_obj = new PhotoType();

    constructor(
        @Inject(ActivatedRoute) route: ActivatedRoute,
        @Inject(SpudService) spud_service: SpudService,
        @Inject(PageScrollService) page_scroll_service: PageScrollService,
        @Inject(ChangeDetectorRef) ref: ChangeDetectorRef,
    ) {
        super(route, spud_service, page_scroll_service, ref);
    }

    protected get_photo_criteria(object: PhotoObject): Map<string, string> {
        return null;
    }
}

@Component({
    selector: 'photo_infobox',
    templateUrl: './photo-infobox.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoInfoboxComponent {
    @Input() object: PhotoObject;
}

@Component({
    selector: 'photo_thumb',
    templateUrl: './photo-thumb.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoThumbComponent {
    @Input() photo: PhotoObject;
    private readonly base_url: string = base_url;
}

@Component({
    selector: 'photo_mid',
    templateUrl: './photo-mid.component.html',
})
export class PhotoMidComponent {
    @ViewChild('video') video;
    _photo: PhotoObject;
    @Input('photo') set photo(photo: PhotoObject) {
        if (this._photo !== photo && this.video) {
            this.video.nativeElement.load();
        }
        this._photo = photo;
    }
    get photo(): PhotoObject {
        return this._photo;
    }
    readonly base_url: string = base_url;
}

@Component({
    selector: 'photo_large',
    templateUrl: './photo-large.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoLargeComponent {
    @ViewChild('video') video;
    _photo: PhotoObject;
    @Input('photo') set photo(photo: PhotoObject) {
        if (this._photo !== photo && this.video) {
            this.video.nativeElement.load();
        }
        this._photo = photo;
    }
    get photo(): PhotoObject {
        return this._photo;
    }
    readonly base_url: string = base_url;
}
