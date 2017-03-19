import { Component } from '@angular/core';
import { BaseListComponent } from './base.component'
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
