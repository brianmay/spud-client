import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent, BaseDetailComponent } from './base.component'
import { PersonObject, PersonType } from './person'

import { SpudService } from './spud.service'

@Component({
    selector: 'person_list',
    templateUrl: './base-list.component.html',
})
export class PersonListComponent extends BaseListComponent<PersonObject> {
    title = 'Person';

    constructor(spud_service: SpudService) {
        super(new PersonType(), spud_service);
    }
}

@Component({
    selector: 'person_detail',
    templateUrl: './base-detail.component.html',
})
export class PersonDetailComponent extends BaseDetailComponent<PersonObject> {
    title = 'Person';

    constructor(
            route: ActivatedRoute,
            spud_service: SpudService
            ) {
        super(new PersonType(), route, spud_service);
    }

    protected get_photo_criteria(object : PersonObject) : Map<string,string> {
        let photo_criteria = new Map<string,string>()
        photo_criteria.set('person', String(object.id))
        photo_criteria.set('person_descendants', String(true))
        return photo_criteria
    }
}
