import { PocketbaseCrud, usePocketBase } from "@chapelure/api/pocketbase.ts";
import { type BaseSystemFields, Collections } from "@common/types.g";

export class AuthService<TUser extends BaseSystemFields> extends PocketbaseCrud<TUser> {

    constructor() {
        super(Collections.Users);
    }

    async register(email: string, password: string, passwordConfirm: string): Promise<TUser | null> {
        await this.collection.create<TUser>({ email: email, password: password, passwordConfirm: passwordConfirm });
        // TODO : send email verification
        // collection.requestVerification(email);
        const result = await this.collection.authWithPassword<TUser>(email, password);
        return result?.record;
    }

    async login(email: string, password: string): Promise<TUser | null> {

        const result = await this.collection.authWithPassword<TUser>(email, password);
        return result?.record;
    }

    async refresh(): Promise<TUser | null> {

        const result = await this.collection.authRefresh<TUser>();
        return result?.record;
    }

    logout() {
        const { pb } = usePocketBase();
        pb.authStore.clear();
    }
}

export const auth = new AuthService();