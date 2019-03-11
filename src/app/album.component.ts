import {
    Component,
    Input,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    OnChanges,
    ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { cloneDeep } from 'lodash';
import * as moment from 'moment';

import { AlbumObject, AlbumType } from './album';
import { PhotoObject } from './photo';
import { BaseService, SpudService } from './spud.service';
import { Permission } from './session';
import { array_to_single, single_to_array } from './utils';

@Component({
    selector: 'album_infobox',
    templateUrl: './album-infobox.component.html',
    styleUrls: ['./base-infobox.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumInfoboxComponent implements OnChanges {
    @Input() object: AlbumObject;
    @Input() permission: Permission;

    edit = false;
    form_group: FormGroup;
    popup_error: string;

    private service: BaseService<AlbumObject>;

    @ViewChild('error_element') error_element;

    constructor(
            private readonly spud_service: SpudService,
            private readonly fb: FormBuilder,
            private readonly ref: ChangeDetectorRef,
    ) {
        this.create_form();
        this.service = spud_service.get_service(new AlbumType());
    }

    private create_form(): void {
        this.form_group = this.fb.group({
            title: ['', Validators.required ],
            description: null,
            cover_photo: null,
            revised: ['', Validators.pattern('^([0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}) [+-]?[0-9]{4}$')],
            sort_name: '',
            sort_order: '',
            parent: null,
        });
        this.form_group.valueChanges.subscribe(() => this.ref.markForCheck());
    }

    ngOnChanges() {
        let revised_str: string;
        if (this.object.revised != null) {
            let revised: moment.Moment;
            revised = this.object.revised[0];
            revised.utcOffset(this.object.revised[1]);
            revised_str = revised.format('YYYY-MM-DD hh:mm:ss ZZ');
        }
        this.form_group.reset({
            title: this.object.title,
            description: this.object.description,
            cover_photo: single_to_array(this.object.cover_photo),
            revised: revised_str,
            sort_name: this.object.sort_name,
            sort_order: this.object.sort_order,
            parent: single_to_array(this.object.parent),
        });
    }

    submit(): void {
        const new_object: AlbumObject = cloneDeep(this.object);
        new_object.title = this.form_group.value.title;
        new_object.description = this.form_group.value.description;
        new_object.cover_photo = array_to_single<PhotoObject>(this.form_group.value.cover_photo);
        new_object.sort_name = this.form_group.value.sort_name;
        new_object.sort_order = this.form_group.value.sort_order;
        if (this.form_group.value.revised) {
            const revised = moment.parseZone(this.form_group.value.revised, 'YYYY-MM-DD hh:mm:ss ZZ');
            const offset = revised.utcOffset();
            new_object.revised = [revised.utc(), offset];
        } else {
            new_object.revised = null;
        }
        new_object.parent = array_to_single<AlbumObject>(this.form_group.value.parent);
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
        photo_criteria.set('album', String(this.object.id));
        photo_criteria.set('album_descendants', String(true));
        return photo_criteria;
    }

    private open_error(error: string): void {
        this.popup_error = error;
        this.error_element.show();
        this.ref.markForCheck();
    }
}
