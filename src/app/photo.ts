import { DateTimeZone, StringDict } from './basic';
import * as s from './streamable';
import { BaseObject, BaseType, PhotoInterface } from './base';
import { set_photo_constructor } from './base';

import { AlbumObject, AlbumType } from './album';
import { CategoryObject, CategoryType } from './category';
import { PersonObject, PersonType } from './person';
import { PlaceObject, PlaceType } from './place';

function streamable_to_object<GenObject extends BaseObject>(streamable: s.Streamable, obj_type: BaseType<GenObject>): GenObject {
    return obj_type.object_from_streamable(streamable, false);
}

class PhotoThumb {
    width: number;
    height: number;
    url: string;
    mime_type: string;
}

class PhotoVideo {
    width: number;
    height: number;
    url: string;
    mime_type: string;
}

export class PhotoObject extends BaseObject implements PhotoInterface {
    action: string;
    datetime: DateTimeZone;
    description: string;
    camera_make: string;
    camera_model: string;
    flash_used: string;
    focal_length: string;
    exposure: string;
    aperture: string;
    iso_equiv: string;
    metering_mode: string;
    level: string;

    albums: Array<AlbumObject>;
    categorys: Array<CategoryObject>;
    persons: Array<PersonObject>;
    photographer: PersonObject;
    place: PlaceObject;

    orig_url: string;
    thumbs: StringDict<PhotoThumb>;
    videos: StringDict<Array<PhotoVideo>>;

    public static initialize(): void {
        set_photo_constructor((streamable: s.Streamable): PhotoInterface => {
            const obj = new PhotoObject();
            obj.set_streamable(streamable, false);
            return obj;
        });
    }

    constructor() { super('photos', 'Photo'); }

    set_streamable(streamable: s.Streamable, full_object: boolean) {
        super.set_streamable(streamable, full_object);

        this.cover_photo = this;

        this.action = s.get_streamable_string(streamable, 'action');
        const utc_offset: number = s.get_streamable_number(streamable, 'utc_offset');
        this.datetime = s.get_streamable_datetimezone(streamable, 'datetime', utc_offset);
        this.description = s.get_streamable_string(streamable, 'description');
        this.camera_make = s.get_streamable_string(streamable, 'camera_make');
        this.camera_model = s.get_streamable_string(streamable, 'camera_model');
        this.flash_used = s.get_streamable_string(streamable, 'flash_used');
        this.focal_length = s.get_streamable_string(streamable, 'focal_length');
        this.exposure = s.get_streamable_string(streamable, 'exposure');
        this.aperture = s.get_streamable_string(streamable, 'aperture');
        this.iso_equiv = s.get_streamable_string(streamable, 'iso_equiv');
        this.metering_mode = s.get_streamable_string(streamable, 'metering_mode');
        this.orig_url = s.get_streamable_string(streamable, 'orig_url');
        this.level = s.get_streamable_string(streamable, 'level');

        const streamable_albums = s.get_streamable_array(streamable, 'albums');
        this.albums = [];
        for (let i = 0; i < streamable_albums.length; i++) {
            const item = streamable_to_object(streamable_albums[i], new AlbumType());
            this.albums.push(item);
        }

        const streamable_categorys = s.get_streamable_array(streamable, 'categorys');
        this.categorys = [];
        for (let i = 0; i < streamable_categorys.length; i++) {
            const item = streamable_to_object(streamable_categorys[i], new CategoryType());
            this.categorys.push(item);
        }

        const streamable_persons = s.get_streamable_array(streamable, 'persons');
        this.persons = [];
        for (let i = 0; i < streamable_persons.length; i++) {
            const item = streamable_to_object(streamable_persons[i], new PersonType());
            this.persons.push(item);
        }

        const streamable_photographer = s.get_streamable_item(streamable, 'photographer');
        if (streamable_photographer != null) {
            this.photographer = streamable_to_object(streamable_photographer, new PersonType());
        }

        const streamable_place = s.get_streamable_item(streamable, 'place');
        if (streamable_place != null) {
            this.place = streamable_to_object(streamable_place, new PlaceType());
        }

        const streamable_thumbs = s.get_streamable_string_array(streamable, 'thumbs');
        this.thumbs = {};
        for (const size in streamable_thumbs) {
            if (streamable_thumbs.hasOwnProperty(size)) {
                const item = streamable_thumbs[size];

                const streamable_array = s.streamable_to_array(item);
                // For now we only care about first thumb for given size.
                if (streamable_array.length > 0) {
                    const sthumb: s.Streamable = streamable_array[0];

                    const thumb: PhotoThumb = new PhotoThumb();
                    thumb.width = s.get_streamable_number(sthumb, 'width');
                    thumb.height = s.get_streamable_number(sthumb, 'height');
                    thumb.url = s.get_streamable_string(sthumb, 'url');
                    thumb.mime_type = s.get_streamable_string(sthumb, 'mime_type');

                    this.thumbs[size] = thumb;
                }
            }
        }

        const streamable_videos = s.get_streamable_string_array(streamable, 'videos');
        this.videos = {};
        for (const size in streamable_videos) {
            if (streamable_videos.hasOwnProperty(size)) {
                const item = streamable_videos[size];

                this.videos[size] = [];
                const streamable_array = s.streamable_to_array(item);
                for (let i = 0; i < streamable_array.length; i++) {
                    const svideo: s.Streamable = streamable_array[i];

                    const video: PhotoVideo = new PhotoVideo();
                    video.width = s.get_streamable_number(svideo, 'width');
                    video.height = s.get_streamable_number(svideo, 'height');
                    video.url = s.get_streamable_string(svideo, 'url');
                    video.mime_type = s.get_streamable_string(svideo, 'mime_type');

                    this.videos[size].push(video);
                }
            }
        }
    }

    get_streamable(): s.Streamable {
        const streamable: s.Streamable = super.get_streamable();

        streamable['action'] = this.action;
        streamable['utc_offset'] = s.datetimezone_offset_to_streamable(this.datetime);
        streamable['datetime'] = s.datetimezone_datetime_to_streamable(this.datetime);
        streamable['description'] = this.description;
        streamable['camera_make'] = this.camera_make;
        streamable['camera_model'] = this.camera_model;
        streamable['flash_used'] = this.flash_used;
        streamable['focal_length'] = this.focal_length;
        streamable['exposure'] = this.exposure;
        streamable['aperture'] = this.aperture;
        streamable['iso_equiv'] = this.iso_equiv;
        streamable['metering_mode'] = this.metering_mode;
        streamable['level'] = this.level;

        const streamable_albums: s.Streamable = [];
        for (let i = 0; i < this.albums.length; i++) {
            streamable_albums.push(this.albums[i].id);
        }
        streamable['albums_pk'] = streamable_albums;

        const streamable_categorys: s.Streamable = [];
        for (let i = 0; i < this.categorys.length; i++) {
            streamable_categorys.push(this.categorys[i].id);
        }
        streamable['categorys_pk'] = streamable_categorys;

        const streamable_persons: s.Streamable = [];
        for (let i = 0; i < this.persons.length; i++) {
            streamable_persons.push(this.persons[i].id);
        }
        streamable['persons_pk'] = streamable_persons;

        streamable['photographer_pk'] = null;
        if (this.photographer != null) {
            streamable['photographer_pk'] = this.photographer.id;
        }

        streamable['place_pk'] = null;
        if (this.place != null) {
            streamable['place_pk'] = this.place.id;
        }

        return streamable;
    }
}

export class PhotoType extends BaseType<PhotoObject> {
    constructor() { super('photos', 'Photo'); }

    object_from_streamable(streamable: s.Streamable, full_object: boolean): PhotoObject {
        const obj = new PhotoObject();
        obj.set_streamable(streamable, full_object);
        return obj;
    }

    new_object(parent: PhotoObject): PhotoObject {
        const obj = new PhotoObject();
        obj.title = 'New photo';
        return obj;
    }

    get_photo_criteria(object: PhotoObject): Map<string, string> {
        return null;
    }
}
