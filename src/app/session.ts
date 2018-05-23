import * as s from './streamable';

export class Permission {
    can_create: boolean;
    can_change: boolean;
    can_delete: boolean;
}

export class Session {
    logged_in = false;
    token: string;
    first_name: string;
    last_name: string;
    permissions: Map<string, Permission>;

    set_streamable(streamable: s.Streamable) {
        this.permissions = new Map<string, Permission>();

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

        const permissions = s.get_streamable_string_array(streamable, 'perms');
        for (const obj_type in permissions) {
            if (permissions.hasOwnProperty(obj_type)) {
                const obj_type_permissions = permissions[obj_type];
                const permission = new Permission();
                permission.can_create = s.get_streamable_boolean(obj_type_permissions, 'can_create');
                permission.can_change = s.get_streamable_boolean(obj_type_permissions, 'can_change');
                permission.can_delete = s.get_streamable_boolean(obj_type_permissions, 'can_delete');
                this.permissions.set(obj_type, permission);
            }
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
