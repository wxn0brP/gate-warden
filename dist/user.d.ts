import { Id, Valthera } from "@wxn0brp/db";
import { User } from "./types/system.js";
declare class UserManager<A = any> {
    private db;
    constructor(valthera: string | Valthera);
    /**
     * Creates a new user
     * @param userData User data (_id is required)
     */
    createUser(userData: {
        _id: Id;
        roles?: Id[];
        attrib?: A;
    }): Promise<User<A>>;
    /**
     * Retrieves a user by _id
     * @param user_id User _id
     * @returns User or null if it doesn't exist
     */
    getUser(user_id: Id): Promise<User<A> | null>;
    /**
     * Updates a user's data
     * @param user_id User _id
     * @param updates Object with fields to update
     */
    updateUser(user_id: Id, updates: Partial<User<A>>): Promise<void>;
    /**
     * Deletes a user
     * @param user_id User _id
     */
    deleteUser(user_id: Id): Promise<void>;
    /**
     * Adds a role to a user
     * @param user_id User _id
     * @param role_id Role _id
     */
    addRoleToUser(user_id: Id, role_id: Id): Promise<void>;
    /**
     * Removes a role from a user
     * @param user_id User _id
     * @param role_id Role _id
     */
    removeRoleFromUser(user_id: Id, role_id: Id): Promise<void>;
    /**
     * Updates a user's attributes
     * @param user_id User _id
     * @param attributes New attributes to merge
     */
    updateAttributes(user_id: Id, attributes: Partial<A>): Promise<void>;
}
export default UserManager;
//# sourceMappingURL=user.d.ts.map