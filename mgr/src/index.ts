import express from "express";
import cors from "cors";
import { UserManager, WardenManager } from "@wxn0brp/gate-warden";
import { ACLRule, Role, User } from "@wxn0brp/gate-warden/dist/types/system.js";
import { Valthera } from "@wxn0brp/db";

const app = express();
const port = process.env.PORT || 3000;
const db = new Valthera("test.db");
const wardenMgr = new WardenManager(db);
const userManager = new UserManager(db);

app.use(cors());
app.use(express.json());
app.use(express.static("./public"));

const endpoints = {
    get: {
        roles: async () => db.find<Role>("roles", {}),
        users: async () => db.find<User<any>>("users", {}),
        acl: async () => db.find<ACLRule>("acl_rules", {}),
    },
    post: {
        role: async (data: Role) => wardenMgr.addRole(data),
        user: async (data: User<any>) => userManager.createUser(data),
        acl: async (data: ACLRule) => wardenMgr.addACLRule(data),
    },
    delete: {
        role: async (id: string) => wardenMgr.removeRole(id),
        user: async (id: string) => userManager.deleteUser(id),
        acl: async (entityId: string) => wardenMgr.removeACLRule(entityId),
    },
    put: {
        role: async (id: string, data: Role) => wardenMgr.updateRole(id, data),
        user: async (id: string, data: User<any>) => userManager.updateUser(id, data),
        acl: async (entityId: string, data: ACLRule) => wardenMgr.updateACLRule(entityId, data),
    }
} as const;

const handleRequest = async (
    req,
    res,
    method: keyof typeof endpoints,
    type: string,
    paramName = "id"
) => {
    try {
        const data = req.method === "GET" ? req.query : req.body;
        const param = req.params[paramName];
        console.log(`[DEBUG] ${method.toUpperCase()} ${type}:`, param || data);

        const result = param ? await endpoints[method][type](param, data) : await endpoints[method][type](data);
        console.log(`[DEBUG] ${method.toUpperCase()} ${type} result:`, result);

        res.json({
            src: `${method} ${type}`,
            result
        });
    } catch (error) {
        console.error(`[DEBUG] Error ${method} ${type}:`, error);
        res.status(500).json({ error: error.message });
    }
};

app.get("/api/get/:type", (req, res) => handleRequest(req, res, "get", req.params.type));
app.post("/api/add/:type", (req, res) => handleRequest(req, res, "post", req.params.type));
app.delete("/api/delete/:type/:id", (req, res) => handleRequest(req, res, "delete", req.params.type));
app.put("/api/edit/:type/:id", (req, res) => handleRequest(req, res, "put", req.params.type));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

