import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AlbumListComponent, AlbumDetailComponent } from './album.component';
import { CategoryListComponent } from './category.component';
import { PlaceListComponent } from './place.component';
import { PersonListComponent } from './person.component';

const routes: Routes = [
    { path: '', redirectTo: '/albums', pathMatch: 'full' },
    { path: 'albums', component: AlbumListComponent },
    { path: 'albums/:id', component: AlbumDetailComponent },
    { path: 'categorys', component: CategoryListComponent },
    { path: 'places', component: PlaceListComponent },
    { path: 'persons', component: PersonListComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
