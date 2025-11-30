## Architecture

Gate Warden implements a hybrid access control system combining ACL, RBAC, and ABAC models, storing data in a document-based structure using the `@wxn0brp/db-core` interface.

### Database Collections and Data Structures

#### Users (`users` collection)
- **Data structure**: `User<A>` object
  - `_id`: User identifier
  - `roles`: Array of role IDs assigned to the user
  - `attrib`: Object containing user attributes of type A

#### Roles (`roles` collection)
- **Data structure**: `Role` object
  - `_id`: Role identifier
  - `name`: Role name

#### ACL Rules (access control per entity: `acl/{entityId}` collections)
- **Data structure**: `ACLRule` object
  - `p`: Permission flags (bitmask)
  - `uid` (optional): Specific user ID for the rule
     + If not provided, the rule applies to all users

#### RBAC Rules (role-permissions per role: `role/{roleId}` collections)
- **Data structure**: `RoleEntity` object
  - `_id`: Entity ID
  - `p`: Permission flags (bitmask)

#### ABAC Rules (attribute-based control per entity: `abac/{entityId}` collections)
- **Data structure**: `ABACRule` object
  - `flag`: Permission flag this rule applies to
  - `condition`: Object defining the attribute conditions that must be met

### Access Control Flow
When checking access permissions, Gate Warden evaluates in the following order:
1. ACL check: Direct permissions for the specific user on the entity
2. RBAC check: Permissions granted through the user's roles
3. ABAC check: Attribute-based rules that apply to the user

The first check that grants access (returns true/1) determines the access result.