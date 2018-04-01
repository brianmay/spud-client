import { Component, Input, Inject, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash';

import { BaseListComponent, BaseDetailComponent } from './base.component';
import { PersonObject, PersonType } from './person';
import { SpudService, BaseService } from './spud.service';
import { Permission } from './session';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { single_to_array, array_to_single } from './utils';
import { PhotoObject } from './photo';
import { PlaceObject } from './place';

@Component({
    selector: 'person_list',
    templateUrl: './base-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonListComponent extends BaseListComponent<PersonObject> {
    title = 'Person List';
    public readonly type_obj = new PersonType();

    constructor(
        @Inject(ActivatedRoute) route: ActivatedRoute,
        @Inject(SpudService) spud_service: SpudService,
        @Inject(ChangeDetectorRef) ref: ChangeDetectorRef,
    ) {
        super(route, spud_service, ref);
    }
}

@Component({
    selector: 'person_detail',
    templateUrl: './base-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonDetailComponent extends BaseDetailComponent<PersonObject> {
    public readonly type_obj = new PersonType();

    constructor(
        @Inject(ActivatedRoute) route: ActivatedRoute,
        @Inject(SpudService) spud_service: SpudService,
        @Inject(ChangeDetectorRef) ref: ChangeDetectorRef,
    ) {
        super(route, spud_service, ref);
    }

    protected get_photo_criteria(object: PersonObject): Map<string, string> {
        const photo_criteria = new Map<string, string>();
        photo_criteria.set('person', String(object.id));
        photo_criteria.set('person_descendants', String(false));
        return photo_criteria;
    }
}

@Component({
    selector: 'person_infobox',
    templateUrl: './person-infobox.component.html',
    styleUrls: ['./base-infobox.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonInfoboxComponent implements OnChanges {
    @Input() object: PersonObject;
    @Input() permission: Permission;

    edit = false;
    form_group: FormGroup;
    popup_error: string;

    private service: BaseService<PersonObject>;

    @ViewChild('error_element') error_element;

    constructor(
            private readonly spud_service: SpudService,
            private readonly fb: FormBuilder,
            private readonly ref: ChangeDetectorRef,
    ) {
        this.create_form();
        this.service = spud_service.get_service(new PersonType());
    }

    private create_form(): void {
        this.form_group = this.fb.group({
            first_name: ['', Validators.required ],
            middle_name: null,
            last_name: null,
            called: null,
            sex: null,
            email: null,
            dob: ['', Validators.pattern('^([0-9]{4}-[0-9]{2}-[0-9]{2})$')],
            dod: ['', Validators.pattern('^([0-9]{4}-[0-9]{2}-[0-9]{2})$')],
            notes: null,
            mother: null,
            father: null,
            spouse: null,
            work: null,
            home: null,
            cover_photo: null,
        });
        this.form_group.valueChanges.subscribe(() => this.ref.markForCheck());
    }

    ngOnChanges() {
        this.form_group.reset({
            first_name: this.object.first_name,
            middle_name: this.object.middle_name,
            last_name: this.object.last_name,
            called: this.object.called,
            sex: this.object.sex,
            email: this.object.email,
            dob: this.object.dob,
            dod: this.object.dod,
            notes: this.object.notes,
            mother: single_to_array(this.object.mother),
            father: single_to_array(this.object.father),
            spouse: single_to_array(this.object.spouse),
            work: single_to_array(this.object.work),
            home: single_to_array(this.object.home),
            cover_photo: single_to_array(this.object.cover_photo),
        });
    }

    submit(): void {
        const new_object: PersonObject = cloneDeep(this.object);
        new_object.first_name = this.form_group.value.first_name;
        new_object.middle_name = this.form_group.value.middle_name;
        new_object.last_name = this.form_group.value.last_name;
        new_object.called = this.form_group.value.called;
        new_object.sex = this.form_group.value.sex;
        new_object.email = this.form_group.value.email;
        if (this.form_group.value.dob) {
            new_object.dob = this.form_group.value.dob;
        } else {
            new_object.dob = null;
        }
        if (this.form_group.value.dod) {
            new_object.dod = this.form_group.value.dod;
        } else {
            new_object.dod = null;
        }
        new_object.notes = this.form_group.value.notes;
        new_object.mother = array_to_single<PersonObject>(this.form_group.value.mother);
        new_object.father = array_to_single<PersonObject>(this.form_group.value.father);
        new_object.spouse = array_to_single<PersonObject>(this.form_group.value.spouse);
        new_object.work = array_to_single<PlaceObject>(this.form_group.value.work);
        new_object.home = array_to_single<PlaceObject>(this.form_group.value.home);
        new_object.cover_photo = array_to_single<PhotoObject>(this.form_group.value.cover_photo);
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
        photo_criteria.set('person', String(this.object.id));
        photo_criteria.set('person_descendants', String(false));
        return photo_criteria;
    }

    private open_error(error: string): void {
        this.popup_error = error;
        this.error_element.show();
        this.ref.markForCheck();
    }
}
