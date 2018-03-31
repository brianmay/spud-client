import { Component, Input, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BaseListComponent, BaseDetailComponent } from './base.component';
import { PersonObject, PersonType } from './person';
import { SpudService } from './spud.service';

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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonInfoboxComponent {
    @Input() object: PersonObject;
}
