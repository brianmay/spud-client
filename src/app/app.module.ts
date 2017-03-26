import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar.component';

import { ObjectListComponent } from './object-list.component';

import { AlbumListComponent, AlbumDetailComponent } from './album.component';
import { CategoryListComponent, CategoryDetailComponent } from './category.component';
import { PersonListComponent, PersonDetailComponent } from './person.component';
import { PlaceListComponent, PlaceDetailComponent } from './place.component';
import { PhotoListComponent, PhotoDetailComponent, PhotoThumbComponent, PhotoMidComponent } from './photo.component';

import { SpudService } from './spud.service';

import { AppRoutingModule } from './app-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [
      AppComponent,
      NavbarComponent,
      ObjectListComponent,
      AlbumListComponent,
      AlbumDetailComponent,
      CategoryListComponent,
      CategoryDetailComponent,
      PlaceListComponent,
      PlaceDetailComponent,
      PersonListComponent,
      PersonDetailComponent,
      PhotoListComponent,
      PhotoDetailComponent,
      PhotoThumbComponent,
      PhotoMidComponent,
    ],
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      NgbModule.forRoot(),
      AppRoutingModule
    ],
    providers: [
        SpudService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
