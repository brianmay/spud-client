import { Component } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
    beforeEach(async(() => {
      //noinspection JSIgnoredPromiseFromCall
        TestBed.configureTestingModule({
        declarations: [
          AppComponent,
          MockNavbarComponent,
          MockRouterOutletComponent
        ],
      }).compileComponents();
    }));

    it('should create the app', async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    }));

    it(`should have as title 'Spud Client'`, async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app.title).toEqual('Spud Client');
    }));
});

@Component({
    selector: 'app-navbar',
    template: '',
})
export class MockNavbarComponent {
}

@Component({
    selector: 'router-outlet',
    template: '',
})
export class MockRouterOutletComponent {
}
