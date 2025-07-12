import { Id, ValtheraCompatible } from "@wxn0brp/db-core";
import { User } from "./types/system";

class UserManager<A = any> {
    constructor(private db: ValtheraCompatible) { }

    /**
     * Creates a new user
     * @param userData User data (_id is required)
     */
    async createUser(userData: { _id: Id; roles?: Id[]; attrib?: A }): Promise<User<A>> {
        const newUser: User = {
            _id: userData._id,
            roles: userData.roles || [],
            attrib: userData.attrib || {} as A,
        };
        return await this.db.add("users", newUser, false);
    }

    /**
     * Retrieves a user by _id
     * @param user_id User _id
     * @returns User or null if it doesn't exist
     */
    async getUser(user_id: Id): Promise<User<A> | null> {
        return this.db.findOne("users", { _id: user_id });
    }

    /**
     * Updates a user's data
     * @param user_id User _id
     * @param updates Object with fields to update
     */
    async updateUser(user_id: Id, updates: Partial<User<A>>): Promise<void> {
        const existingUser = await this.getUser(user_id);
        if (!existingUser) throw new Error("User not found");
        const updatedUser = { ...existingUser, ...updates };
        await this.db.update("users", { _id: user_id }, updatedUser);
    }

    /**
     * Deletes a user
     * @param user_id User _id
     */
    async deleteUser(user_id: Id): Promise<void> {
        await this.db.removeOne("users", { _id: user_id });
    }

    /**
     * Adds a role to a user
     * @param user_id User _id
     * @param role_id Role _id
     */
    async addRoleToUser(user_id: Id, role_id: Id): Promise<void> {
        const user = await this.getUser(user_id);
        if (!user) throw new Error("User not found");
        if (!user.roles.includes(role_id)) {
            user.roles.push(role_id);
            await this.db.update("users", { _id: user_id }, user);
        }
    }

    /**
     * Removes a role from a user
     * @param user_id User _id
     * @param role_id Role _id
     */
    async removeRoleFromUser(user_id: Id, role_id: Id): Promise<void> {
        const user = await this.getUser(user_id);
        if (!user) throw new Error("User not found");
        const index = user.roles.indexOf(role_id);
        if (index !== -1) {
            user.roles.splice(index, 1);
            await this.db.update("users", { _id: user_id }, user);
        }
    }

    /**
     * Updates a user's attributes
     * @param user_id User _id
     * @param attributes New attributes to merge
     */
    async updateAttributes(user_id: Id, attributes: Partial<A>): Promise<void> {
        const user = await this.getUser(user_id);
        if (!user) throw new Error("User not found");
        user.attrib = { ...user.attrib, ...attributes };
        await this.db.update("users", { _id: user_id }, user);
    }
}

export default UserManager;
