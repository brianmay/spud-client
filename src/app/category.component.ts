import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent, BaseDetailComponent } from './base.component'
import { CategoryObject, CategoryType } from './category'

import { SpudService } from './spud.service'

@Component({
    selector: 'category_list',
    templateUrl: './base-list.component.html',
})
export class CategoryListComponent extends BaseListComponent<CategoryObject> {
    title = 'Category';

    constructor(spud_service: SpudService) {
        super(new CategoryType(), spud_service);
    }
}

@Component({
    selector: 'category_detail',
    templateUrl: './base-detail.component.html',
})
export class CategoryDetailComponent extends BaseDetailComponent<CategoryObject> {
    title = 'Category';

    constructor(
            route: ActivatedRoute,
            spud_service: SpudService
            ) {
        super(new CategoryType(), route, spud_service);
    }

    protected get_photo_criteria(object : CategoryObject) : Map<string,string> {
        let photo_criteria = new Map<string,string>()
        photo_criteria.set('category', String(object.id))
        photo_criteria.set('category_descendants', String(true))
        return photo_criteria
    }
}
