import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {Ng2PageScrollModule} from 'ng2-page-scroll';
import {LocalStorageModule} from 'angular-2-local-storage';

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
    AlbumListComponent,
    AlbumDetailComponent,
    AlbumInfoboxComponent
} from './album.component';
import {
    CategoryListComponent,
    CategoryDetailComponent,
    CategoryInfoboxComponent
} from './category.component';
import {
    PersonListComponent,
    PersonDetailComponent,
    PersonInfoboxComponent
} from './person.component';
import {
    PlaceListComponent,
    PlaceDetailComponent,
    PlaceInfoboxComponent
} from './place.component';
import {
    PhotoListComponent,
    PhotoDetailComponent,
    PhotoInfoboxComponent,
    PhotoThumbComponent,
    PhotoMidComponent,
    PhotoLargeComponent
} from './photo.component';

import {SpudService} from './spud.service';

import {AppRoutingModule} from './app-routing.module';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        BasicDatetimezoneComponent,
        ObjectLinkComponent,
        ObjectArrayComponent,
        ObjectListComponent,
        ObjectListItemComponent,
        AlbumListComponent,
        AlbumDetailComponent,
        AlbumInfoboxComponent,
        CategoryListComponent,
        CategoryDetailComponent,
        CategoryInfoboxComponent,
        PlaceListComponent,
        PlaceDetailComponent,
        PlaceInfoboxComponent,
        PersonListComponent,
        PersonDetailComponent,
        PersonInfoboxComponent,
        PhotoListComponent,
        PhotoDetailComponent,
        PhotoInfoboxComponent,
        PhotoThumbComponent,
        PhotoMidComponent,
        PhotoLargeComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        NgbModule.forRoot(),
        AppRoutingModule,
        Ng2PageScrollModule.forRoot(),
        LocalStorageModule.withConfig({
            prefix: 'spud',
            storageType: 'localStorage'
        }),
        ReactiveFormsModule,
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
