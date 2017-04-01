import { Component, Inject, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { Subscription }   from 'rxjs/Subscription';
import { LocalStorageService } from 'angular-2-local-storage';

import { Session } from './session';
import { SpudService } from './spud.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
})
export class NavbarComponent {
    private isCollapsed : boolean = true;
    private q : string = '';
    private session : Session = new Session;
    private unauth_username : string;
    private unauth_password : string;
    private error : string;

    private router_subscription : Subscription;
    private session_subscription : Subscription;

    @ViewChild('error_template') error_template;

    constructor(
        @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
        @Inject(NgbModal) private modalService: NgbModal,
        @Inject(SpudService) private spud_service: SpudService,
        @Inject(LocalStorageService) private local_storage_service: LocalStorageService
    ) {}

    ngOnInit(): void {
        this.router_subscription = this.route.queryParams
            .subscribe((params: Params) => {
                this.q = params['q'];
            });
        this.session_subscription = this.spud_service.session_change
            .subscribe(session => {
                this.session = session;
                this.local_storage_service.set('token', session.token);
            });

        this.session = this.spud_service.session;
        let token : string = this.local_storage_service.get<string>('token');
        if (token != null) {
            this.session.token = token;
            this.spud_service.get_session()
                .catch((error : string) => {
                    this.open_error(error);
                    this.session.token = null;
                });
        }
    }

    private open_error(error : string) : void {
        this.error = error;
        this.modalService.open(this.error_template).result.then(result => {
            }, reason => {
            });
    }

    private login(template) : void {
        this.modalService.open(template).result.then(result => {
                let promise = this.spud_service.login(this.unauth_username, this.unauth_password);
                this.unauth_password=null;
                return promise;
            }, reason => {
                this.unauth_password=null;
                this.error="Login Failed: "+reason;
            })
            .catch((error : string) => this.open_error(error));
    }

    private logout() : void {
        this.spud_service.logout()
            .catch((error : string) => this.open_error(error));
    }

    private check_session() : void {
        this.spud_service.get_session()
            .catch((error : string) => this.open_error(error));
    }

    ngOnDestroy() : void {
        this.router_subscription.unsubscribe();
        this.session_subscription.unsubscribe();
    }
}
