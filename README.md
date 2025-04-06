# Gate Warden

Gate Warden is a lightweight access control library that supports ACL, RBAC, and ABAC models. It is designed to manage and enforce permissions for users and entities in a flexible and extensible way.

## Features

- **ACL (Access Control List):** Define permissions for specific users on specific entities.
- **RBAC (Role-Based Access Control):** Assign roles to users and define permissions for roles on entities.
- **ABAC (Attribute-Based Access Control):** Use dynamic conditions based on user and entity attributes to determine access.

## Installation

Install the library using npm or yarn:

```bash
yarn add github:wxn0brp/gate-warden#dist
```

## Usage

### GateWarden

The `GateWarden` class is the main entry point for checking access permissions.

```typescript
import { GateWarden } from "@wxn0brp/gate-warden";
import { Valthera } from "@wxn0brp/db";

const wardenString = new GateWarden("dir");
// or
const wardenDB = new GateWarden(new Valthera("dir"));

const hasAccess = await warden.hasAccess("userId", "entityId", 0b001);
console.log(`Access granted: ${hasAccess}`);
```

### UserManager

The `UserManager` class provides methods to manage users.

```typescript
import { UserManager } from "@wxn0brp/gate-warden";

const userManager = new UserManager(db);

// Create a new user
await userManager.createUser({ _id: "userId", roles: ["roleId"] });

// Update user attributes
await userManager.updateAttributes("userId", { key: "value" });
```

### WardenManager

The `WardenManager` class provides methods to manage roles and rules.

```typescript
import { WardenManager } from "@wxn0brp/gate-warden";

const wardenManager = new WardenManager(db);

// Add a new role
await wardenManager.addRole({ _id: "roleId", name: "Admin" });

// Add an ACL rule
await wardenManager.addACLRule("entityId", 0b001, "userId");

// Add an ABAC rule
await wardenManager.addABACRule("entityId", 0b001, (user, entity) => user.attrib.isAdmin);
```

## Debug Logging

Set the `debugLog` level in `GateWarden` to enable debug messages:
- `0`: No logs
- `1`: Basic logs
- `2`: Detailed logs

## Project Structure

- **src/warden.ts:** Core access control logic.
- **src/user.ts:** User management.
- **src/mgr.ts:** Role and rule management.
- **src/types/system.ts:** Type definitions for roles, rules, and users.
- **src/log.ts:** Logging utilities.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
