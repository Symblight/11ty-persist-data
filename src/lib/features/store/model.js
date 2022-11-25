import { createStore, createEffect, createEvent } from "effector";
import { IndexedDB } from "./idb";

export const $db = createStore(null);

const setDb = createEvent();

$db.on(setDb, (_, db) => db);

const DB_NAME = "test-db01";
const DB_VERSION = 1;

function initDb(db) {
  console.log("Creating stores");

  if (!db.objectStoreNames.contains("profile")) {
    console.log("Creating a store profile");
    const postsOS = db.createObjectStore("profile", { keyPath: "id" });
    postsOS.createIndex("id", "id", { unique: true });
  }
}

export const request = new IndexedDB({
  dbName: DB_NAME,
  dbVersion: DB_VERSION,
  onupgradeneededCallback: (db) => {
    initDb(db);
    setDb(request);
  },
});

request.open().then((db) => {
  initDb(db);
  setDb(request);
});
