import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent, BaseDetailComponent } from './base.component'
import { PersonObject, PersonType } from './person'

import { SpudService } from './spud.service'

@Component({
    selector: 'person_list',
    templateUrl: './base-list.component.html',
    styleUrls: ['./base-list.component.css']
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
    styleUrls: ['./base-detail.component.css']
})
export class PersonDetailComponent extends BaseDetailComponent<PersonObject> {
    title = 'Person';

    constructor(
            route: ActivatedRoute,
            spud_service: SpudService
            ) {
        super(new PersonType(), route, spud_service);
    }
}
