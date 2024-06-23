/* eslint-disable react-refresh/only-export-components */
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "@/hooks/useAuth";
import { API_BASEURL } from "@/lib/api";
import { databaseSchema, onDatabaseInit } from "@/lib/db";
import { InferCreateSchema } from "@/lib/utils";
import PouchDb from "pouchdb-browser";
import pouchDbFind from "pouchdb-find";

// Enable PouchDB Find
PouchDb.plugin(pouchDbFind);

export type DatabaseSchema = typeof databaseSchema;

export type Databases = {
  [key in keyof DatabaseSchema]: PouchDB.Database<
    InferCreateSchema<DatabaseSchema[key]>
  > & {
    remoteDb?: PouchDB.Database;
  };
};

const DatabaseContext = createContext<{
  db: Databases;
  clearAll: () => Promise<void>;
} | null>(null);

function initDatabase() {
  const db: Record<string, PouchDB.Database> = {};
  for (const key in databaseSchema) {
    const instance = new PouchDb(key);
    db[key] = instance;
    instance.setMaxListeners(100);
  }
  return db as Databases;
}

async function clearDatabases(db: Databases) {
  for (const key in db) {
    const instance = db[key as keyof Databases];
    await instance.destroy();

    const { remoteDb } = instance;
    remoteDb?.close().catch(() => {});
  }
}

export const DatabaseProvider = ({ children }: PropsWithChildren) => {
  const auth = useAuth();
  const [db, setDb] = useState<Databases>(initDatabase());

  useEffect(() => {
    if (!auth.isLoggedIn) {
      return;
    }

    const cleanFuncs: (() => void)[] = [];

    // setup remote syncronization
    for (const dbName in db) {
      const instance = db[dbName as keyof Databases];

      instance.remoteDb = new PouchDb(`${API_BASEURL}/db/${dbName}`, {
        fetch: (url, opts: any = {}) => {
          opts.headers.set("Authorization", `Bearer ${auth.token}`);
          return PouchDb.fetch(url, opts);
        },
      });

      const sync = instance.sync(instance.remoteDb, {
        live: true,
        retry: true,
      });

      cleanFuncs.push(() => {
        try {
          sync.cancel();
          instance.remoteDb?.close();
        } catch (err) {}
      });
    }

    return () => {
      for (const clean of cleanFuncs) {
        clean();
      }
    };
  }, [db, auth]);

  useEffect(() => {
    onDatabaseInit(db);
  }, [db]);

  const clearAll = async () => {
    await clearDatabases(db);
    setDb(initDatabase());
  };

  return (
    <DatabaseContext.Provider value={{ db, clearAll }} children={children} />
  );
};

export function useDbContext() {
  const ctx = useContext(DatabaseContext);
  if (!ctx) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return ctx;
}

export function useDatabase() {
  const { db } = useDbContext();
  return db;
}
