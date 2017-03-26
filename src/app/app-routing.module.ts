import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AlbumListComponent, AlbumDetailComponent } from './album.component';
import { CategoryListComponent, CategoryDetailComponent } from './category.component';
import { PersonListComponent, PersonDetailComponent } from './person.component';
import { PlaceListComponent, PlaceDetailComponent } from './place.component';
import { PhotoListComponent, PhotoDetailComponent } from './photo.component';

const routes: Routes = [
    { path: '', redirectTo: '/albums', pathMatch: 'full' },
    { path: 'albums', component: AlbumListComponent },
    { path: 'albums/:id', component: AlbumDetailComponent },
    { path: 'categorys', component: CategoryListComponent },
    { path: 'categorys/:id', component: CategoryDetailComponent },
    { path: 'persons', component: PersonListComponent },
    { path: 'persons/:id', component: PersonDetailComponent },
    { path: 'places', component: PlaceListComponent },
    { path: 'places/:id', component: PlaceDetailComponent },
    { path: 'photos', component: PhotoListComponent },
    { path: 'photos/:id', component: PhotoDetailComponent },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
