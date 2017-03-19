import { Component } from '@angular/core';
import { BaseListComponent } from './base.component'
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
