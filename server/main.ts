import express from "express";
import fs from "fs";
import PouchDbNode from "pouchdb-node";
import cors from "cors";
import { hashPassword, verifyPassword } from "./utils";
import { z } from "zod";
import { ulid } from "ulidx";
import pouchDbFind from "pouchdb-find";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pouchDbExpress = require("express-pouchdb");

const dbPath = process.cwd() + "/storage/";
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

const PouchDb = PouchDbNode.plugin(pouchDbFind).defaults({ prefix: dbPath });

const pouchMiddleware = pouchDbExpress(PouchDb, { mode: "minimumForPouchDB" });
const app = express();
const db = {
  users: new PouchDb<User>("users"),
};

app.use(
  cors({
    credentials: true,
    origin(_origin, callback) {
      callback(null, true);
    },
  })
);
app.use(express.json());

const userSchema = z.object({
  _id: z.string(),
  username: z.string().min(3),
  password: z.string().min(3),
  name: z.string().min(3),
});

type User = z.infer<typeof userSchema>;

db.users.info().then(async (info) => {
  if (!info.doc_count) {
    await db.users.createIndex({
      index: { fields: ["username"] },
    });

    const data = {
      _id: ulid().toLowerCase(),
      username: "admin",
      password: await hashPassword("admin"),
      name: "Admin",
    };

    await db.users.put(data);
    console.log("Admin created", data);
  }
});

async function getUserByUsername(username: string) {
  const result = await db.users.find({ selector: { username } });
  return result.docs[0];
}

app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);

    if (!user || !verifyPassword(password, user.password)) {
      throw new Error("Invalid username or password");
    }

    return res.json({ user });
  } catch (error) {
    return res.json({ error }).status(400);
  }
});

app.use("/", async (req, res) => {
  let user: User | null;

  try {
    const authToken = req.headers.authorization?.split(" ")[1];
    if (!authToken) {
      throw new Error("No auth token provided");
    }

    user = await getUserByUsername(authToken);
    if (!user) {
      throw new Error("User not found");
    }
  } catch (err) {
    return res
      .status(401)
      .json({ message: (err as Error).message || "Unauthorized" });
  }

  // Rewrite database name for each user
  req.url = `/${user._id}__${req.url.substring(1)}`;
  pouchMiddleware(req, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port http://localhost:${PORT}`);
});
