import { Id, ValtheraCompatible } from "@wxn0brp/db-core";
import { User } from "./types/system";
import { collections } from "./const";

export class UserManager<A = any> {
	constructor(private db: ValtheraCompatible) {}

	/**
	 * Creates a new user
	 * @param userData User data (_id is required)
	 */
	async createUser(userData: {
		_id: Id;
		roles?: Id[];
		attrib?: A;
	}): Promise<User<A>> {
		const newUser: User = {
			_id: userData._id,
			roles: userData.roles || [],
			attrib: userData.attrib || ({} as A),
		};
		return await this.db.c<User<A>>(collections.users).add(newUser, false);
	}

	/**
	 * Retrieves a user by _id
	 * @param user_id User _id
	 * @returns User or null if it doesn't exist
	 */
	async getUser(user_id: Id): Promise<User<A> | null> {
		return this.db.c<User<A>>(collections.users).findOne({
			_id: user_id,
		});
	}

	/**
	 * Updates a user's data
	 * @param user_id User _id
	 * @param updates Object with fields to update
	 * @returns Whether the update was successful
	 */
	async updateUser(user_id: Id, updates: Partial<User<A>>): Promise<boolean> {
		const existingUser = await this.getUser(user_id);
		if (!existingUser) return false;
		const updatedUser = {
			...existingUser,
			...updates,
		};
		await this.db.c(collections.users).update(
			{
				_id: user_id,
			},
			updatedUser,
		);
		return true;
	}

	/**
	 * Deletes a user
	 * @param user_id User _id
	 */
	async deleteUser(user_id: Id): Promise<void> {
		await this.db.c(collections.users).removeOne({
			_id: user_id,
		});
	}

	/**
	 * Adds a role to a user
	 * @param user_id User _id
	 * @param role_id Role _id
	 * @returns Whether the update was successful
	 */
	async addRoleToUser(user_id: Id, role_id: Id): Promise<boolean> {
		const user = await this.getUser(user_id);
		if (!user) return false;
		if (!user.roles.includes(role_id)) {
			user.roles.push(role_id);
			await this.db.c(collections.users).update(
				{
					_id: user_id,
				},
				user,
			);
		}
		return true;
	}

	/**
	 * Removes a role from a user
	 * @param user_id User _id
	 * @param role_id Role _id
	 * @returns Whether the update was successful
	 */
	async removeRoleFromUser(user_id: Id, role_id: Id): Promise<boolean> {
		const user = await this.getUser(user_id);
		if (!user) return false;
		const index = user.roles.indexOf(role_id);
		if (index !== -1) {
			user.roles.splice(index, 1);
			await this.db.c(collections.users).update(
				{
					_id: user_id,
				},
				user,
			);
		}
		return true;
	}

	/**
	 * Updates a user's attributes
	 * @param user_id User _id
	 * @param attributes New attributes to merge
	 * @returns Whether the update was successful
	 */
	async updateAttributes(
		user_id: Id,
		attributes: Partial<A>,
	): Promise<boolean> {
		const user = await this.getUser(user_id);
		if (!user) return false;
		user.attrib = {
			...user.attrib,
			...attributes,
		};
		await this.db.c(collections.users).update(
			{
				_id: user_id,
			},
			user,
		);
		return true;
	}
}
