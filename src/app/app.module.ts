import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {LocalStorageModule} from 'angular-2-local-storage';
import {Ng2DatetimePickerModule} from 'ng2-datetime-picker';
import {NgxMdModule} from 'ngx-md';

import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar.component';

import {BasicDatetimezoneComponent} from './basic.component';
import {
    ObjectArrayComponent,
    ObjectLinkComponent,
    ObjectListComponent,
    ObjectListItemComponent,
} from './object.component';

import {
    BaseListComponent,
} from './base.component';

import {
    AlbumDetailComponent,
    AlbumInfoboxComponent
} from './album.component';
import {
    CategoryDetailComponent,
    CategoryInfoboxComponent
} from './category.component';
import {
    PersonDetailComponent,
    PersonInfoboxComponent
} from './person.component';
import {
    PlaceDetailComponent,
    PlaceInfoboxComponent
} from './place.component';
import {
    PhotoDetailComponent,
    PhotoInfoboxComponent,
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
        BaseListComponent,
        AlbumDetailComponent,
        AlbumInfoboxComponent,
        AlbumSelectComponent,
        CategoryDetailComponent,
        CategoryInfoboxComponent,
        CategorySelectComponent,
        ErrorComponent,
        PersonDetailComponent,
        PersonInfoboxComponent,
        PersonSelectComponent,
        PlaceDetailComponent,
        PlaceInfoboxComponent,
        PlaceSelectComponent,
        PhotoDetailComponent,
        PhotoInfoboxComponent,
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
        NgxMdModule.forRoot(),
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
