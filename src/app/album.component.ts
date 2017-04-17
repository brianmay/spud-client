import { Component, Input, Inject, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { cloneDeep } from 'lodash';
import { PageScrollService } from 'ng2-page-scroll';
import * as moment from 'moment';

import { BaseListComponent, BaseDetailComponent } from './base.component';
import { AlbumObject, AlbumType } from './album';
import { BaseService, SpudService } from './spud.service';
import { Permission } from './session';


@Component({
    selector: 'album_list',
    templateUrl: './base-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumListComponent extends BaseListComponent<AlbumObject> {
    title = 'Album List';
    public readonly type_obj = new AlbumType();

    constructor(
        @Inject(ActivatedRoute) route: ActivatedRoute,
        @Inject(SpudService) spud_service: SpudService,
        @Inject(ChangeDetectorRef) ref: ChangeDetectorRef,
    ) {
        super(route, spud_service, ref);
    }
}

@Component({
    selector: 'album_detail',
    templateUrl: './base-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumDetailComponent extends BaseDetailComponent<AlbumObject> {
    public readonly type_obj = new AlbumType();

    constructor(
        @Inject(ActivatedRoute) route: ActivatedRoute,
        @Inject(SpudService) spud_service: SpudService,
        @Inject(PageScrollService) page_scroll_service: PageScrollService,
        @Inject(ChangeDetectorRef) ref: ChangeDetectorRef,
    ) {
        super(route, spud_service, page_scroll_service, ref);
    }

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
    styleUrls: ['./base-infobox.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumInfoboxComponent implements OnChanges {
    @Input() object: AlbumObject;
    @Input() permission: Permission;

    edit = false;
    form_group: FormGroup;

    private service: BaseService<AlbumObject>;

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
            revised: revised_str,
            sort_name: this.object.sort_name,
            sort_order: this.object.sort_order,
            parent: [this.object.parent],
        });
    }

    submit(): void {
        const new_object: AlbumObject = cloneDeep(this.object);
        new_object.title = this.form_group.value.title;
        new_object.sort_name = this.form_group.value.sort_name;
        new_object.sort_order = this.form_group.value.sort_order;
        if (this.form_group.value.revised) {
            const revised = moment.parseZone(this.form_group.value.revised, 'YYYY-MM-DD hh:mm:ss ZZ');
            const offset = revised.utcOffset();
            new_object.revised = [revised.utc(), offset];
        } else {
            new_object.revised = null;
        }
        if (this.form_group.value.parent.length > 0) {
            new_object.parent = this.form_group.value.parent[0];
        } else {
            new_object.parent = null;
        }
        this.service.set_object(new_object);
        this.edit = false;
    }
    cancel(): void {
        this.ngOnChanges();
        this.edit = false;
    }
    revert(): void {
        this.ngOnChanges();
    }
}
