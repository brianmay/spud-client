import {Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, OnChanges} from '@angular/core';

import { cloneDeep } from 'lodash';
import { PlaceObject, PlaceType } from './place';
import {BaseService, SpudService} from './spud.service';
import {PhotoObject} from './photo';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {array_to_single, single_to_array} from './utils';
import {Permission} from './session';

@Component({
    selector: 'place_infobox',
    templateUrl: './place-infobox.component.html',
    styleUrls: ['./base-infobox.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceInfoboxComponent implements OnChanges {
    @Input() object: PlaceObject;
    @Input() permission: Permission;

    edit = false;
    form_group: FormGroup;
    popup_error: string;

    private service: BaseService<PlaceObject>;

    @ViewChild('error_element') error_element;

    constructor(
            private readonly spud_service: SpudService,
            private readonly fb: FormBuilder,
            private readonly ref: ChangeDetectorRef,
    ) {
        this.create_form();
        this.service = spud_service.get_service(new PlaceType());
    }

    private create_form(): void {
        this.form_group = this.fb.group({
            title: ['', Validators.required ],
            description: null,
            parent: null,
            cover_photo: null,
            address: null,
            address2: null,
            city: null,
            state: null,
            country: null,
            postcode: null,
            url: null,
            urldesc: null,
            notes: null,
        });
        this.form_group.valueChanges.subscribe(() => this.ref.markForCheck());
    }

    ngOnChanges() {
        this.form_group.reset({
            title: this.object.title,
            description: this.object.description,
            parent: single_to_array(this.object.parent),
            cover_photo: single_to_array(this.object.cover_photo),
            address: this.object.address,
            address2: this.object.address2,
            city: this.object.city,
            state: this.object.state,
            country: this.object.country,
            postcode: this.object.postcode,
            url: this.object.url,
            urldesc: this.object.urldesc,
            notes: this.object.notes,
        });
    }

    submit(): void {
        const new_object: PlaceObject = cloneDeep(this.object);
        new_object.title = this.form_group.value.title;
        new_object.description = this.form_group.value.description;
        new_object.parent = array_to_single<PlaceObject>(this.form_group.value.parent);
        new_object.cover_photo = array_to_single<PhotoObject>(this.form_group.value.cover_photo);
        new_object.address = this.form_group.value.address;
        new_object.address2 = this.form_group.value.address2;
        new_object.city = this.form_group.value.city;
        new_object.state = this.form_group.value.state;
        new_object.country = this.form_group.value.country;
        new_object.postcode = this.form_group.value.postcode;
        new_object.url = this.form_group.value.url;
        new_object.urldesc = this.form_group.value.urldesc;
        new_object.notes = this.form_group.value.notes;
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
        photo_criteria.set('place', String(this.object.id));
        photo_criteria.set('place_descendants', String(true));
        return photo_criteria;
    }

    private open_error(error: string): void {
        this.popup_error = error;
        this.error_element.show();
        this.ref.markForCheck();
    }
}
