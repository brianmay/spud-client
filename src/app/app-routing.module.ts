import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AlbumType} from './album';
import { CategoryType } from './category';
import { PersonType } from './person';
import { PlaceType } from './place';
import { PhotoType } from './photo';

import { BaseListComponent } from './base.component';
import { BaseDetailComponent } from './base.component';

const routes: Routes = [
    { path: '', redirectTo: '/albums', pathMatch: 'full' },
    { path: 'albums', component: BaseListComponent, data: {'type_obj': new AlbumType()} },
    { path: 'albums/:id', component: BaseDetailComponent, data: {'type_obj': new AlbumType()}  },
    { path: 'categorys', component: BaseListComponent, data: {'type_obj': new CategoryType()} },
    { path: 'categorys/:id', component: BaseDetailComponent, data: {'type_obj': new AlbumType()}  },
    { path: 'persons', component: BaseListComponent, data: {'type_obj': new PersonType()} },
    { path: 'persons/:id', component: BaseDetailComponent, data: {'type_obj': new AlbumType()}  },
    { path: 'places', component: BaseListComponent, data: {'type_obj': new PlaceType()} },
    { path: 'places/:id', component: BaseDetailComponent, data: {'type_obj': new AlbumType()}  },
    { path: 'photos', component: BaseListComponent, data: {'type_obj': new PhotoType()} },
    { path: 'photos/:id', component: BaseDetailComponent, data: {'type_obj': new AlbumType()}  },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
