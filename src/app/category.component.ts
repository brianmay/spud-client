import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent, BaseDetailComponent } from './base.component'
import { CategoryObject, CategoryType } from './category'

import { SpudService } from './spud.service'

@Component({
    selector: 'category_list',
    templateUrl: './base-list.component.html',
    styleUrls: ['./base-list.component.css']
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
    styleUrls: ['./base-detail.component.css']
})
export class CategoryDetailComponent extends BaseDetailComponent<CategoryObject> {
    title = 'Category';

    constructor(
            route: ActivatedRoute,
            spud_service: SpudService
            ) {
        super(new CategoryType(), route, spud_service);
    }
}
