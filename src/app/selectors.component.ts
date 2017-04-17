import {
    Component,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    forwardRef,
    Inject,
    Input,
    OnInit,
    OnDestroy,
} from '@angular/core';
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

import { BaseObject, BaseType } from './base';
import { AlbumObject, AlbumType } from './album';
import { PhotoObject, PhotoType } from './photo';
import { SpudService } from './spud.service';

import { List } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

class BaseSelectComponent<GenObject extends BaseObject>
        implements ControlValueAccessor, OnInit, OnDestroy {
    public readonly type_obj: BaseType<GenObject>;

    @Input() multiple = false;
    @Input() criteria: Map<string, string> = new Map();
    private objects: GenObject[];

    private search_text = '';
    private search_terms = new Subject<string>();
    private search_results: List<GenObject>;
    private search_subscription: Subscription;
    private propagateChange = (_: GenObject[]) => {};

    on_blur() {
        this.reset_search();
        this.ref.markForCheck();
    }

    search(term: string): void {
        this.search_terms.next(term);
    }

    reset_search(): void {
        this.search_text = '';
        this.search('');
    }

    constructor(
        @Inject(SpudService) protected readonly spud_service: SpudService,
        @Inject(ChangeDetectorRef) protected readonly ref: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.search_terms
            .debounceTime(300)        // wait 300ms after each keystroke before considering the term
            .distinctUntilChanged()   // ignore if next search term is same as previous
            .switchMap((term): Observable<List<GenObject>> => {

                if (term) {
                    const criteria = new Map<string, string>(this.criteria);
                    criteria.set('q', term);
                    // return the http search observable
                    const list = this.spud_service.get_list(this.type_obj, criteria);
                    list.get_next_page();
                    return list.change.take(1);
                } else {
                    // or the observable of empty heroes if there was no search term
                    return Observable.of(List<GenObject>());
                }
            })
            .catch(error => {
                // TODO: add real error handling
                console.log(error);
                return Observable.of(List<GenObject>());
            })
            .subscribe(list => {
                this.search_results = list;
                this.ref.markForCheck();
            });
    }

    add_item(object: GenObject): void {
        if (!this.multiple) {
            this.objects = [];
        }
        this.objects.push(object);
        this.propagateChange(this.objects);
        this.reset_search();
        this.ref.markForCheck();
    }

    delete_item(index: number): void {
        this.objects.splice(index, 1);
        this.propagateChange(this.objects);
        this.reset_search();
        this.ref.markForCheck();
    }

    writeValue(value: GenObject[]): void {
        this.objects = value;
        this.ref.markForCheck();
    }

    registerOnChange(fn): void {
        this.propagateChange = fn;
    }

    registerOnTouched(): void {
    }

    ngOnDestroy(): void {
        if (this.search_subscription != null) {
            this.search_subscription.unsubscribe();
        }
    }

}

@Component({
    selector: 'album-select',
    templateUrl: './selectors.component.html',
    styleUrls: ['./selectors.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AlbumSelectComponent),
      multi: true,
    }]
})
export class AlbumSelectComponent
        extends BaseSelectComponent<AlbumObject> {
    public readonly type_obj = new AlbumType();
}

@Component({
    selector: 'photo-select',
    templateUrl: './selectors.component.html',
    styleUrls: ['./selectors.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhotoSelectComponent),
      multi: true,
    }]
})
export class PhotoSelectComponent
        extends BaseSelectComponent<PhotoObject> {
    public readonly type_obj = new PhotoType();
}
