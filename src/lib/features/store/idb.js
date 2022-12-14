const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

export class IndexedDB {
  constructor(params = {}) {
    const {
      dbName,
      dbVersion = 1,
      onupgradeneeded = null,
      onsuccess = null,
      onerror = null,
    } = params;
    this.db = null;
    this.dbName = dbName;
    this.dbVersion = dbVersion;
    this.onupgradeneededCallback = onupgradeneeded;
    this.onsuccessCallback = onsuccess;
    this.onerrorCallback = onerror;

    if (!indexedDB) {
      throw Error("This browser doesn't support IndexedDB");
    }
  }

  open() {
    return new Promise((resolve, reject) => {
      const dbOpen = indexedDB.open(this.dbName, this.dbVersion);

      if (this.onupgradeneededCallback) {
        dbOpen.onupgradeneeded = (e) => {
          console.log("onupgradeneeded");
          this.db = dbOpen.result;
          this.onupgradeneededCallback(e);
          resolve(dbOpen.result, e);
        };
      }

      dbOpen.onsuccess = (e) => {
        console.log("onsuccess");
        this.db = dbOpen.result;
        this.onsuccessCallback?.(e);
        resolve(dbOpen.result, e);
      };

      dbOpen.onerror = (e) => {
        this.onerrorCallback?.(e);
        reject(dbOpen.error, e);
      };
    });
  }

  close() {}

  get connection() {
    return this.db;
  }

  set({ store, key, value }) {
    if (!this.db) {
      throw Error("not found db instance");
    }
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(store, "readwrite");
      const objectStore = transaction.objectStore(store);

      objectStore.put(value, key);

      transaction.oncomplete = (e) => {
        resolve(e);
      };

      transaction.onerror = (e) => {
        reject(transaction.error, e);
      };
    });
  }

  get({ store, key }) {
    if (!this.db) {
      throw Error("not found db instance");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(store, "readonly");
      const objectStore = transaction.objectStore(store);
      const request = objectStore.get(key);

      request.onsuccess = (e) => {
        resolve(request.result, e);
      };

      request.onerror = (e) => {
        reject(request.error, e);
      };
    });
  }

  remove({ store, key }) {
    if (!this.db) {
      throw Error("not found db instance");
    }
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(store, "readwrite");
      const objectStore = transaction.objectStore(store);

      objectStore.delete(key);

      transaction.oncomplete = (e) => {
        resolve(e);
      };

      transaction.onerror = (e) => {
        reject(transaction.error, e);
      };
    });
  }

  removeStore(store) {
    if (!this.db) {
      throw Error("not found db instance");
    }
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(store, "readwrite");
      const objectStore = transaction.objectStore(store);

      objectStore.clear();

      transaction.oncomplete = (e) => {
        resolve(e);
      };

      transaction.onerror = (e) => {
        reject(transaction.error, e);
      };
    });
  }
}
