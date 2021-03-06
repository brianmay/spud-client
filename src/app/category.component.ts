import {Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, OnChanges} from '@angular/core';

import { cloneDeep } from 'lodash';
import { CategoryObject, CategoryType } from './category';
import {BaseService, SpudService} from './spud.service';
import {PhotoObject} from './photo';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Permission} from './session';
import { array_to_single, single_to_array } from './utils';

@Component({
    selector: 'category_infobox',
    templateUrl: './category-infobox.component.html',
    styleUrls: ['./base-infobox.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryInfoboxComponent implements OnChanges {
    @Input() object: CategoryObject;
    @Input() permission: Permission;

    edit = false;
    form_group: FormGroup;
    popup_error: string;

    private service: BaseService<CategoryObject>;

    @ViewChild('error_element') error_element;

    constructor(
            private readonly spud_service: SpudService,
            private readonly fb: FormBuilder,
            private readonly ref: ChangeDetectorRef,
    ) {
        this.create_form();
        this.service = spud_service.get_service(new CategoryType());
    }

    private create_form(): void {
        this.form_group = this.fb.group({
            title: ['', Validators.required ],
            description: null,
            cover_photo: null,
            sort_name: '',
            sort_order: '',
            parent: null,
        });
        this.form_group.valueChanges.subscribe(() => this.ref.markForCheck());
    }

    ngOnChanges() {
        this.form_group.reset({
            title: this.object.title,
            description: this.object.description,
            cover_photo: single_to_array(this.object.cover_photo),
            sort_name: this.object.sort_name,
            sort_order: this.object.sort_order,
            parent: single_to_array(this.object.parent),
        });
    }

    submit(): void {
        const new_object: CategoryObject = cloneDeep(this.object);
        new_object.title = this.form_group.value.title;
        new_object.description = this.form_group.value.description;
        new_object.cover_photo = array_to_single<PhotoObject>(this.form_group.value.cover_photo);
        new_object.sort_name = this.form_group.value.sort_name;
        new_object.sort_order = this.form_group.value.sort_order;
        new_object.parent = array_to_single<CategoryObject>(this.form_group.value.parent);
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
        photo_criteria.set('category', String(this.object.id));
        photo_criteria.set('category_descendants', String(true));
        return photo_criteria;
    }

    private open_error(error: string): void {
        this.popup_error = error;
        this.error_element.show();
        this.ref.markForCheck();
    }
}
