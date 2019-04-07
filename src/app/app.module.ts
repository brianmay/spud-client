import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {LocalStorageModule} from 'angular-2-local-storage';
import {Ng2DatetimePickerModule} from 'ng2-datetime-picker';
import {MarkdownModule} from 'ngx-markdown';

import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar.component';

import {BasicDatetimezoneComponent} from './basic.component';
import {
    ObjectArrayComponent,
    ObjectLinkComponent,
    ObjectListComponent,
    ObjectListItemComponent,
    ObjectDetailComponent,
} from './object.component';

import {
    BaseListComponent,
    BaseDetailComponent,
} from './base.component';

import {
    AlbumInfoboxComponent
} from './album.component';
import {
    CategoryInfoboxComponent
} from './category.component';
import {
    PersonInfoboxComponent
} from './person.component';
import {
    PlaceInfoboxComponent
} from './place.component';
import {
    PhotoInfoboxComponent,
    PhotoBulkComponent,
    PhotoThumbComponent,
    PhotoMidComponent,
    PhotoLargeComponent
} from './photo.component';

import {
    AlbumSelectComponent,
    CategorySelectComponent,
    PersonSelectComponent,
    PlaceSelectComponent,
    PhotoSelectComponent,
} from './selectors.component';

import { ErrorComponent } from './error.component';

import {SpudService} from './spud.service';

import {AppRoutingModule} from './app-routing.module';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        BasicDatetimezoneComponent,
        ObjectLinkComponent,
        ObjectArrayComponent,
        ObjectListComponent,
        ObjectListItemComponent,
        ObjectDetailComponent,
        BaseListComponent,
        BaseDetailComponent,
        AlbumInfoboxComponent,
        AlbumSelectComponent,
        CategoryInfoboxComponent,
        CategorySelectComponent,
        ErrorComponent,
        PersonInfoboxComponent,
        PersonSelectComponent,
        PlaceInfoboxComponent,
        PlaceSelectComponent,
        PhotoInfoboxComponent,
        PhotoBulkComponent,
        PhotoThumbComponent,
        PhotoMidComponent,
        PhotoLargeComponent,
        PhotoSelectComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        NgbModule.forRoot(),
        BsDropdownModule.forRoot(),
        AppRoutingModule,
        LocalStorageModule.forRoot({
            prefix: 'spud',
            storageType: 'localStorage'
        }),
        ReactiveFormsModule,
        Ng2DatetimePickerModule,
        MarkdownModule.forRoot(),
    ],
    providers: [
        SpudService,
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
