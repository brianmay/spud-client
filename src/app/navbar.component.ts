import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
})
export class NavbarComponent {
    private isCollapsed : boolean = true;
    private q : string = '';

    constructor(
        @Inject(ActivatedRoute) protected readonly route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.route.queryParams
            .subscribe((params: Params) => {
                this.q = params['q'];
            })
    }
}
