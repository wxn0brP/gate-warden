import { collections } from "./const.js";
export class UserManager {
    db;
    constructor(db) {
        this.db = db;
    }
    /**
     * Creates a new user
     * @param userData User data (_id is required)
     */
    async createUser(userData) {
        const newUser = {
            _id: userData._id,
            roles: userData.roles || [],
            attrib: userData.attrib || {},
        };
        return await this.db.add(collections.users, newUser, false);
    }
    /**
     * Retrieves a user by _id
     * @param user_id User _id
     * @returns User or null if it doesn't exist
     */
    async getUser(user_id) {
        return this.db.findOne(collections.users, { _id: user_id });
    }
    /**
     * Updates a user's data
     * @param user_id User _id
     * @param updates Object with fields to update
     */
    async updateUser(user_id, updates) {
        const existingUser = await this.getUser(user_id);
        if (!existingUser)
            throw new Error("User not found");
        const updatedUser = { ...existingUser, ...updates };
        await this.db.update(collections.users, { _id: user_id }, updatedUser);
    }
    /**
     * Deletes a user
     * @param user_id User _id
     */
    async deleteUser(user_id) {
        await this.db.removeOne(collections.users, { _id: user_id });
    }
    /**
     * Adds a role to a user
     * @param user_id User _id
     * @param role_id Role _id
     */
    async addRoleToUser(user_id, role_id) {
        const user = await this.getUser(user_id);
        if (!user)
            throw new Error("User not found");
        if (!user.roles.includes(role_id)) {
            user.roles.push(role_id);
            await this.db.update(collections.users, { _id: user_id }, user);
        }
    }
    /**
     * Removes a role from a user
     * @param user_id User _id
     * @param role_id Role _id
     */
    async removeRoleFromUser(user_id, role_id) {
        const user = await this.getUser(user_id);
        if (!user)
            throw new Error("User not found");
        const index = user.roles.indexOf(role_id);
        if (index !== -1) {
            user.roles.splice(index, 1);
            await this.db.update(collections.users, { _id: user_id }, user);
        }
    }
    /**
     * Updates a user's attributes
     * @param user_id User _id
     * @param attributes New attributes to merge
     */
    async updateAttributes(user_id, attributes) {
        const user = await this.getUser(user_id);
        if (!user)
            throw new Error("User not found");
        user.attrib = { ...user.attrib, ...attributes };
        await this.db.update(collections.users, { _id: user_id }, user);
    }
}
