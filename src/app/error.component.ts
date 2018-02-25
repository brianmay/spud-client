import {
    Component,
    Input,
    ChangeDetectionStrategy,
    ViewChild,
} from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'popup-error',
    templateUrl: './error.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
    @Input() public title = 'Error';

    @ViewChild('error_template') error_template;

    constructor(
        private readonly modal_service: NgbModal,
    ) {}

    show(): void {
        this.modal_service.open(this.error_template);
    }
}
