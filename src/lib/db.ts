import PouchDb from "pouchdb-browser";

export const db = new PouchDb("projects");

const remoteDb = new PouchDb("http://localhost:3000/projects", {
  fetch: (url, opts: any = {}) => {
    opts.headers.set("Authorization", `Bearer admin`);
    return PouchDb.fetch(url, opts);
  },
});

db.sync(remoteDb, { live: true, retry: true });
