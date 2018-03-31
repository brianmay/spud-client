import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {LocalStorageModule} from 'angular-2-local-storage';
import {Ng2DatetimePickerModule} from 'ng2-datetime-picker';

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

import {
    AlbumSelectComponent,
    PhotoSelectComponent,
} from './selectors.component';

import { ErrorComponent } from './error.component';

import {SpudService} from './spud.service';

import {AppRoutingModule} from './app-routing.module';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';

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
        AlbumSelectComponent,
        CategoryListComponent,
        CategoryDetailComponent,
        CategoryInfoboxComponent,
        ErrorComponent,
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
        PhotoSelectComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        NgbModule.forRoot(),
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        AppRoutingModule,
        LocalStorageModule.withConfig({
            prefix: 'spud',
            storageType: 'localStorage'
        }),
        ReactiveFormsModule,
        Ng2DatetimePickerModule,
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
