import { Component, Input } from '@angular/core';

import { BaseListComponent, BaseDetailComponent } from './base.component';
import { PersonObject, PersonType } from './person';

@Component({
    selector: 'person_list',
    templateUrl: './base-list.component.html',
})
export class PersonListComponent extends BaseListComponent<PersonObject> {
    title = 'Person List';
    public readonly type_obj = new PersonType();
}

@Component({
    selector: 'person_detail',
    templateUrl: './base-detail.component.html',
})
export class PersonDetailComponent extends BaseDetailComponent<PersonObject> {
    public readonly type_obj = new PersonType();

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
