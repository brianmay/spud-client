import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageScrollService } from 'ng2-page-scroll';

import { BaseListComponent, BaseDetailComponent } from './base.component'
import { PersonObject, PersonType } from './person'
import { SpudService } from './spud.service'

@Component({
    selector: 'person_list',
    templateUrl: './base-list.component.html',
})
export class PersonListComponent extends BaseListComponent<PersonObject> {
    title = 'Person List';
    protected readonly type_obj = new PersonType();
}

@Component({
    selector: 'person_detail',
    templateUrl: './base-detail.component.html',
})
export class PersonDetailComponent extends BaseDetailComponent<PersonObject> {
    protected readonly type_obj = new PersonType();

    protected get_photo_criteria(object : PersonObject) : Map<string,string> {
        let photo_criteria = new Map<string,string>()
        photo_criteria.set('person', String(object.id))
        photo_criteria.set('person_descendants', String(true))
        return photo_criteria
    }
}
