import { Component, Input } from '@angular/core';

import { BaseListComponent, BaseDetailComponent } from './base.component';
import { AlbumObject, AlbumType } from './album';

@Component({
    selector: 'album_list',
    templateUrl: './base-list.component.html',
})
export class AlbumListComponent extends BaseListComponent<AlbumObject> {
    title = 'Album List';
    public readonly type_obj = new AlbumType();
}

@Component({
    selector: 'album_detail',
    templateUrl: './base-detail.component.html',
})
export class AlbumDetailComponent extends BaseDetailComponent<AlbumObject> {
    public readonly type_obj = new AlbumType();

    protected get_photo_criteria(object: AlbumObject): Map<string, string> {
        const photo_criteria = new Map<string, string>();
        photo_criteria.set('album', String(object.id));
        photo_criteria.set('album_descendants', String(true));
        return photo_criteria;
    }
}

@Component({
    selector: 'album_infobox',
    templateUrl: './album-infobox.component.html',
})
export class AlbumInfoboxComponent {
    @Input() object: AlbumObject;
}
