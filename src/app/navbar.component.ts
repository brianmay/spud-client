import { Component, Inject, ViewChild, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Subscription } from 'rxjs/Subscription';
import { LocalStorageService } from 'angular-2-local-storage';

import { Session } from './session';
import { SpudService } from './spud.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit, OnDestroy {
    public is_collapsed = true;
    public q = '';
    public session: Session = new Session;
    public unauth_username: string;
    public unauth_password: string;
    public error: string;

    private router_subscription: Subscription;
    private session_subscription: Subscription;

    @ViewChild('error_element') error_element;

    constructor(
        @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
        @Inject(NgbModal) private modal_service: NgbModal,
        @Inject(SpudService) private spud_service: SpudService,
        @Inject(LocalStorageService) private local_storage_service: LocalStorageService,
        @Inject(ChangeDetectorRef) protected readonly ref: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.router_subscription = this.route.queryParams
            .subscribe((params: Params) => {
                this.q = params['q'];
                this.ref.markForCheck();
            });
        this.session_subscription = this.spud_service.session_change
            .subscribe(session => {
                this.session = session;
                this.local_storage_service.set('token', session.token);
                this.ref.markForCheck();
            });

        this.session = this.spud_service.session;
        const token: string = this.local_storage_service.get<string>('token');
        if (token != null) {
            this.session.token = token;
            this.spud_service.get_session()
                .catch((error: string) => {
                    this.open_error(error);
                    this.session.token = null;
                    this.ref.markForCheck();
                });
        }
    }

    private open_error(error: string): void {
        this.error = error;
        this.error_element.show();
        this.ref.markForCheck();
    }

    public login(template): void {
        this.modal_service.open(template).result.then(result => {
                const promise = this.spud_service.login(this.unauth_username, this.unauth_password);
                this.unauth_password = null;
                return promise;
            }, reason => {
                this.unauth_password = null;
            })
            .catch((error: string) => this.open_error(error));
    }

    public logout(): void {
        this.spud_service.logout()
            .catch((error: string) => this.open_error(error));
    }

    public check_session(): void {
        this.spud_service.get_session()
            .catch((error: string) => this.open_error(error));
    }

    ngOnDestroy(): void {
        this.router_subscription.unsubscribe();
        this.session_subscription.unsubscribe();
    }
}
