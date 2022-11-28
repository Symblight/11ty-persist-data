import { createStore, createEffect, createEvent } from "effector";
import { IndexedDB } from "./idb";

export const $db = createStore(null);

const setDb = createEvent();

$db.on(setDb, (_, db) => db);

const DB_NAME = "test-db02";
const DB_VERSION = 2;

function initDb(db) {
  console.log("Creating stores");

  if (!db.objectStoreNames.contains("profile")) {
    console.log("Creating a store profile", db.objectStoreNames);
    const postsOS = db.createObjectStore("profile", { keyPath: "id" });
    postsOS.createIndex("id", "id", { unique: true });
  }
}

export const request = new IndexedDB({
  dbName: DB_NAME,
  dbVersion: DB_VERSION,
  onupgradeneeded: (e) => {
    // version change
    // init
    initDb(e.target.result);
  },
  onsuccess: (e) => {
    setDb(e.target.result);
  }
});

request.open()
