import { Id, DataBase as Valthera } from "@wxn0brp/db";
import { User } from "./types/system";

class UserManager<A> {
    private db: Valthera;

    constructor(valthera: string | Valthera) {
        this.db = typeof valthera === "string" ? new Valthera(valthera) : valthera;
    }

    /**
     * Creates a new user
     * @param userData User data (ID is required)
     */
    async createUser(userData: { id: Id; roles?: Id[]; attrib?: A }): Promise<void> {
        const newUser: User<A> = {
            id: userData.id,
            roles: userData.roles || [],
            attrib: userData.attrib || {} as A,
        };
        await this.db.add("users", newUser, false);
    }

    /**
     * Retrieves a user by ID
     * @param userId User ID
     * @returns User or null if it doesn't exist
     */
    async getUser(userId: Id): Promise<User<A> | null> {
        return this.db.findOne<User<A>>("users", { id: userId });
    }

    /**
     * Updates a user's data
     * @param userId User ID
     * @param updates Object with fields to update
     */
    async updateUser(userId: Id, updates: Partial<User<A>>): Promise<void> {
        const existingUser = await this.getUser(userId);
        if (!existingUser) throw new Error("User not found");
        const updatedUser = { ...existingUser, ...updates };
        await this.db.update("users", { id: userId }, updatedUser);
    }

    /**
     * Deletes a user
     * @param userId User ID
     */
    async deleteUser(userId: Id): Promise<void> {
        await this.db.removeOne("users", { id: userId });
    }

    /**
     * Adds a role to a user
     * @param userId User ID
     * @param roleId Role ID
     */
    async addRoleToUser(userId: Id, roleId: Id): Promise<void> {
        const user = await this.getUser(userId);
        if (!user) throw new Error("User not found");
        if (!user.roles.includes(roleId)) {
            user.roles.push(roleId);
            await this.db.update("users", { id: userId }, user);
        }
    }

    /**
     * Removes a role from a user
     * @param userId User ID
     * @param roleId Role ID
     */
    async removeRoleFromUser(userId: Id, roleId: Id): Promise<void> {
        const user = await this.getUser(userId);
        if (!user) throw new Error("User not found");
        const index = user.roles.indexOf(roleId);
        if (index !== -1) {
            user.roles.splice(index, 1);
            await this.db.update("users", { id: userId }, user);
        }
    }

    /**
     * Updates a user's attributes
     * @param userId User ID
     * @param attributes New attributes to merge
     */
    async updateAttributes(userId: Id, attributes: Partial<A>): Promise<void> {
        const user = await this.getUser(userId);
        if (!user) throw new Error("User not found");
        user.attrib = { ...user.attrib, ...attributes };
        await this.db.update("users", { id: userId }, user);
    }
}

export default UserManager;
