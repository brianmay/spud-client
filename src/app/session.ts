import * as s from './streamable';

export class Session {
    logged_in = false;
    token: string;
    first_name: string;
    last_name: string;

    set_streamable(streamable: s.Streamable) {
        const user = s.get_streamable_item(streamable, 'user');
        if (user != null) {
            this.logged_in = true;
            this.token = s.get_streamable_string(streamable, 'token');
            this.first_name = s.get_streamable_string(user, 'first_name');
            this.last_name = s.get_streamable_string(user, 'last_name');
        } else {
            this.logged_in = false;
            this.token = null;
            this.first_name = null;
            this.last_name = null;
        }
    }

    get full_name(): string {
        if (this.logged_in) {
            return `${this.first_name} ${this.last_name}`;
        } else {
            return 'Anonymous';
        }
    }
}
