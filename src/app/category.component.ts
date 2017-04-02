import { Component, Input } from '@angular/core';

import { BaseListComponent, BaseDetailComponent } from './base.component';
import { CategoryObject, CategoryType } from './category';

@Component({
    selector: 'category_list',
    templateUrl: './base-list.component.html',
})
export class CategoryListComponent extends BaseListComponent<CategoryObject> {
    title = 'Category List';
    public readonly type_obj = new CategoryType();
}

@Component({
    selector: 'category_detail',
    templateUrl: './base-detail.component.html',
})
export class CategoryDetailComponent extends BaseDetailComponent<CategoryObject> {
    public readonly type_obj = new CategoryType();

    protected get_photo_criteria(object: CategoryObject): Map<string, string> {
        const photo_criteria = new Map<string, string>();
        photo_criteria.set('category', String(object.id));
        photo_criteria.set('category_descendants', String(true));
        return photo_criteria;
    }
}

@Component({
    selector: 'category_infobox',
    templateUrl: './category-infobox.component.html',
})
export class CategoryInfoboxComponent {
    @Input() object: CategoryObject;
}
