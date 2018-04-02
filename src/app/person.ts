import * as s from './streamable';
import { PlaceObject } from './place';
import { BaseObject, BaseType } from './base';

export class PersonObject extends BaseObject {
    first_name: string;
    middle_name: string;
    last_name: string;
    called: string;
    description: string;
    sex: string;
    email: string;
    dob: string;
    dod: string;
    notes: string;
    work: PlaceObject;
    home: PlaceObject;
    mother: PersonObject;
    father: PersonObject;
    spouse: PersonObject;
    grandparents: Array<PersonObject>;
    uncles_aunts: Array<PersonObject>;
    parents: Array<PersonObject>;
    siblings: Array<PersonObject>;
    cousins: Array<PersonObject>;
    children: Array<PersonObject>;
    nephews_nieces: Array<PersonObject>;
    grandchildren: Array<PersonObject>;

    constructor() { super('persons', 'Person'); }

    set_streamable(streamable: s.Streamable, full_object: boolean) {
        super.set_streamable(streamable, full_object);

        this.first_name = s.get_streamable_string(streamable, 'first_name');
        this.middle_name = s.get_streamable_string(streamable, 'middle_name');
        this.last_name = s.get_streamable_string(streamable, 'last_name');
        this.description = s.get_streamable_string(streamable, 'description');
        this.called = s.get_streamable_string(streamable, 'called');
        this.sex = s.get_streamable_string(streamable, 'sex');
        this.email = s.get_streamable_string(streamable, 'email');
        this.dob = s.get_streamable_string(streamable, 'dob');
        this.dod = s.get_streamable_string(streamable, 'dod');
        this.notes = s.get_streamable_string(streamable, 'notes');

        const streamable_work = s.get_streamable_item(streamable, 'work');
        if (streamable_work != null) {
            this.work = new PlaceObject();
            this.work.set_streamable(streamable_work, false);
        } else {
            this.work = null;
        }

        const streamable_home = s.get_streamable_item(streamable, 'home');
        if (streamable_home != null) {
            this.home = new PlaceObject();
            this.home.set_streamable(streamable_home, false);
        } else {
            this.home = null;
        }

        const streamable_mother = s.get_streamable_item(streamable, 'mother');
        if (streamable_mother != null) {
            this.mother = new PersonObject();
            this.mother.set_streamable(streamable_mother, false);
        } else {
            this.mother = null;
        }

        const streamable_father = s.get_streamable_item(streamable, 'father');
        if (streamable_father != null) {
            this.father = new PersonObject();
            this.father.set_streamable(streamable_father, false);
        } else {
            this.father = null;
        }

        const streamable_spouse = s.get_streamable_item(streamable, 'spouse');
        if (streamable_spouse != null) {
            this.spouse = new PersonObject();
            this.spouse.set_streamable(streamable_spouse, false);
        } else {
            this.spouse = null;
        }

        const streamable_grandparents = s.get_streamable_array(streamable, 'grandparents');
        this.grandparents = [];
        for (let i = 0; i < streamable_grandparents.length; i++) {
            const item = streamable_grandparents[i];
            const person = new PersonObject();
            person.set_streamable(item, false);
            this.grandparents.push(person);
        }

        const streamable_uncles_aunts = s.get_streamable_array(streamable, 'uncles_aunts');
        this.uncles_aunts = [];
        for (let i = 0; i < streamable_uncles_aunts.length; i++) {
            const item = streamable_uncles_aunts[i];
            const person = new PersonObject();
            person.set_streamable(item, false);
            this.uncles_aunts.push(person);
        }

        const streamable_parents = s.get_streamable_array(streamable, 'parents');
        this.parents = [];
        for (let i = 0; i < streamable_parents.length; i++) {
            const item = streamable_parents[i];
            const person = new PersonObject();
            person.set_streamable(item, false);
            this.parents.push(person);
        }

        const streamable_siblings = s.get_streamable_array(streamable, 'siblings');
        this.siblings = [];
        for (let i = 0; i < streamable_siblings.length; i++) {
            const item = streamable_siblings[i];
            const person = new PersonObject();
            person.set_streamable(item, false);
            this.siblings.push(person);
        }

        const streamable_cousins = s.get_streamable_array(streamable, 'cousins');
        this.cousins = [];
        for (let i = 0; i < streamable_cousins.length; i++) {
            const item = streamable_cousins[i];
            const person = new PersonObject();
            person.set_streamable(item, false);
            this.cousins.push(person);
        }

        const streamable_children = s.get_streamable_array(streamable, 'children');
        this.children = [];
        for (let i = 0; i < streamable_children.length; i++) {
            const item = streamable_children[i];
            const person = new PersonObject();
            person.set_streamable(item, false);
            this.children.push(person);
        }

        const streamable_nephews_nieces = s.get_streamable_array(streamable, 'nephews_nieces');
        this.nephews_nieces = [];
        for (let i = 0; i < streamable_nephews_nieces.length; i++) {
            const item = streamable_nephews_nieces[i];
            const person = new PersonObject();
            person.set_streamable(item, false);
            this.nephews_nieces.push(person);
        }

        const streamable_grandchildren = s.get_streamable_array(streamable, 'grandchildren');
        this.grandchildren = [];
        for (let i = 0; i < streamable_grandchildren.length; i++) {
            const item = streamable_grandchildren[i];
            const person = new PersonObject();
            person.set_streamable(item, false);
            this.grandchildren.push(person);
        }
    }

    get_streamable(): s.Streamable {
        const streamable: s.Streamable = super.get_streamable();
        streamable['first_name'] = this.first_name;
        streamable['middle_name'] = this.middle_name;
        streamable['last_name'] = this.last_name;
        streamable['called'] = this.called;
        streamable['description'] = this.description;
        streamable['sex'] = this.sex;
        streamable['email'] = this.email;
        streamable['dob'] = this.dob;
        streamable['dod'] = this.dod;
        streamable['notes'] = this.notes;

        if (this.work != null) {
            streamable['work_pk'] = this.work.id;
        } else {
            streamable['work_pk'] = null;
        }

        if (this.home != null) {
            streamable['home_pk'] = this.home.id;
        } else {
            streamable['home_pk'] = null;
        }

        if (this.mother != null) {
            streamable['mother_pk'] = this.mother.id;
        } else {
            streamable['mother_pk'] = null;
        }

        if (this.father != null) {
            streamable['father_pk'] = this.father.id;
        } else {
            streamable['father_pk'] = null;
        }

        if (this.spouse != null) {
            streamable['spouse_pk'] = this.spouse.id;
        } else {
            streamable['spouse_pk'] = null;
        }

        return streamable;
    }
}

export class PersonType extends BaseType<PersonObject> {
    constructor() { super('persons', 'Person'); }

    object_from_streamable(streamable: s.Streamable, full_object: boolean): PersonObject {
        const obj = new PersonObject();
        obj.set_streamable(streamable, full_object);
        return obj;
    }

    new_object(parent: PersonObject): PersonObject {
        const obj = new PersonObject();
        obj.title = 'New person';
        if (obj.sex === '1') {
            obj.father = parent;
        }
        if (obj.sex === '2') {
            obj.mother = parent;
        }
        return obj;
    }
}
