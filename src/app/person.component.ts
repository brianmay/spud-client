import { Component, Input, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageScrollService } from 'ng2-page-scroll';

import { BaseListComponent, BaseDetailComponent } from './base.component';
import { PersonObject, PersonType } from './person';
import { SpudService } from './spud.service';

@Component({
    selector: 'person_list',
    templateUrl: './base-list.component.html',
})
export class PersonListComponent extends BaseListComponent<PersonObject> {
    title = 'Person List';
    public readonly type_obj = new PersonType();

    constructor(
        @Inject(ActivatedRoute) route: ActivatedRoute,
        @Inject(SpudService) spud_service: SpudService,
    ) {
        super(route, spud_service);
    }
}

@Component({
    selector: 'person_detail',
    templateUrl: './base-detail.component.html',
})
export class PersonDetailComponent extends BaseDetailComponent<PersonObject> {
    public readonly type_obj = new PersonType();

    constructor(
        @Inject(ActivatedRoute) route: ActivatedRoute,
        @Inject(SpudService) spud_service: SpudService,
        @Inject(PageScrollService) page_scroll_service: PageScrollService,
    ) {
        super(route, spud_service, page_scroll_service);
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
})
export class PersonInfoboxComponent {
    @Input() object: PersonObject;
}
