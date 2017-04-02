import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { PhotoObject } from './app/photo';
PhotoObject.initialize();

if (environment.production) {
  enableProdMode();
}

//noinspection JSIgnoredPromiseFromCall
platformBrowserDynamic().bootstrapModule(AppModule);
