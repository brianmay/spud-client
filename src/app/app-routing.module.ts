import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AlbumType} from './album';
import { CategoryType } from './category';
import { PersonType } from './person';
import { PlaceType } from './place';
import { PhotoType } from './photo';

import { BaseListComponent } from './base.component';
import { AlbumDetailComponent } from './album.component';
import { CategoryDetailComponent } from './category.component';
import { PersonDetailComponent } from './person.component';
import { PlaceDetailComponent } from './place.component';
import { PhotoDetailComponent } from './photo.component';

const routes: Routes = [
    { path: '', redirectTo: '/albums', pathMatch: 'full' },
    { path: 'albums', component: BaseListComponent, data: {'type_obj': new AlbumType()} },
    { path: 'albums/:id', component: AlbumDetailComponent },
    { path: 'categorys', component: BaseListComponent, data: {'type_obj': new CategoryType()} },
    { path: 'categorys/:id', component: CategoryDetailComponent },
    { path: 'persons', component: BaseListComponent, data: {'type_obj': new PersonType()} },
    { path: 'persons/:id', component: PersonDetailComponent },
    { path: 'places', component: BaseListComponent, data: {'type_obj': new PlaceType()} },
    { path: 'places/:id', component: PlaceDetailComponent },
    { path: 'photos', component: BaseListComponent, data: {'type_obj': new PhotoType()} },
    { path: 'photos/:id', component: PhotoDetailComponent },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
