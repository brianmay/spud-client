import { Component, Input, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges } from '@angular/core';
import { cloneDeep } from 'lodash';

import { base_url } from './settings';
import { PhotoObject, PhotoType } from './photo';
import { SpudService, BaseService } from './spud.service';
import { Permission } from './session';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as s from './streamable';


@Component({
    selector: 'photo_infobox',
    templateUrl: './photo-infobox.component.html',
    styleUrls: ['./base-infobox.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoInfoboxComponent implements OnChanges {
    @Input() object: PhotoObject;
    @Input() permission: Permission;

    edit = false;
    form_group: FormGroup;
    popup_error: string;

    private service: BaseService<PhotoObject>;

    @ViewChild('error_element') error_element;

    constructor(
            private readonly spud_service: SpudService,
            private readonly fb: FormBuilder,
            private readonly ref: ChangeDetectorRef,
    ) {
        this.create_form();
        this.service = spud_service.get_service(new PhotoType());
    }

    private create_form(): void {
        this.form_group = this.fb.group({
            title: ['', Validators.required ],
            description: null,
        });
        this.form_group.valueChanges.subscribe(() => this.ref.markForCheck());
    }

    ngOnChanges() {
        this.form_group.reset({
            title: this.object.title,
            description: this.object.description,
        });
    }

    submit(): void {
        const new_object: PhotoObject = cloneDeep(this.object);
        new_object.title = this.form_group.value.title;
        new_object.description = this.form_group.value.description;
        this.service.set_object(new_object)
            .then(object => {
                this.edit = false;
                this.ref.markForCheck();
            })
            .catch(error => {
                console.log(error);
                this.open_error(error);
            });
    }
    cancel(): void {
        this.ngOnChanges();
        this.edit = false;
    }
    revert(): void {
        this.ngOnChanges();
    }
    get_cover_photo_criteria(): Map<string, string> {
        const photo_criteria = new Map<string, string>();
        photo_criteria.set('photo', String(this.object.id));
        photo_criteria.set('photo_descendants', String(true));
        return photo_criteria;
    }

    private open_error(error: string): void {
        this.popup_error = error;
        this.error_element.show();
        this.ref.markForCheck();
    }
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


@Component({
    selector: 'photo_bulk',
    templateUrl: './photo-bulk.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoBulkComponent {
    @Input() objects: Array<PhotoObject>;
    @Input() permission: Permission;

    form_group: FormGroup;
    popup_error: string;

    @ViewChild('error_element') error_element;

    private service: BaseService<PhotoObject>;

    constructor(
        private readonly spud_service: SpudService,
        private readonly fb: FormBuilder,
        private readonly ref: ChangeDetectorRef,
    ) {
        this.create_form();
        this.service = spud_service.get_service(new PhotoType());
    }

    private create_form(): void {
        this.form_group = this.fb.group({
            title: null,
            description: null,
        });
        this.form_group.valueChanges.subscribe(() => this.ref.markForCheck());
    }

    submit(): void {
        const values: s.Streamable = {};

        if (this.form_group.value.title) {
            values['title'] = this.form_group.value.title;
        }

        if (this.form_group.value.description) {
            values.description = this.form_group.value.description;
        }

        this.service.bulk_update(this.objects, values)
            .then(object => {
                this.ref.markForCheck();
            })
            .catch(error => {
                console.log(error);
                this.open_error(error);
            });
    }

    revert(): void {
        this.form_group.reset({
            title: "",
            description: "",
        });
    }

    private open_error(error: string): void {
        this.popup_error = error;
        this.error_element.show();
        this.ref.markForCheck();
    }

}
