import { Component, Input, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageScrollService } from 'ng2-page-scroll';

import { BaseListComponent, BaseDetailComponent } from './base.component';
import { CategoryObject, CategoryType } from './category';
import { SpudService } from './spud.service';

@Component({
    selector: 'category_list',
    templateUrl: './base-list.component.html',
})
export class CategoryListComponent extends BaseListComponent<CategoryObject> {
    title = 'Category List';
    public readonly type_obj = new CategoryType();

    constructor(
        @Inject(ActivatedRoute) route: ActivatedRoute,
        @Inject(SpudService) spud_service: SpudService,
    ) {
        super(route, spud_service);
    }
}

@Component({
    selector: 'category_detail',
    templateUrl: './base-detail.component.html',
})
export class CategoryDetailComponent extends BaseDetailComponent<CategoryObject> {
    public readonly type_obj = new CategoryType();

    constructor(
        @Inject(ActivatedRoute) route: ActivatedRoute,
        @Inject(SpudService) spud_service: SpudService,
        @Inject(PageScrollService) page_scroll_service: PageScrollService,
    ) {
        super(route, spud_service, page_scroll_service);
    }

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
