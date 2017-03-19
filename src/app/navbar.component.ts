import { Component } from '@angular/core';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
    toggler_class : string = "collapse";
    toggler() {
        if (this.toggler_class === "") {
            this.toggler_class = "collapse";
        } else {
            this.toggler_class = "";
        }
    }
}
