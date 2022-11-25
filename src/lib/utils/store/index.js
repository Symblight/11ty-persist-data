if (!("indexedDB" in window)) {
  console.log("This browser doesn't support IndexedDB");
  //  return;
}

export async function createDBStore() {
  return await indexedDB.open("test-db1", function (upgradeDb) {
    console.log("Creating a new object store.");
    if (!upgradeDb.objectStoreNames.contains('posts')) {
        const postsOS = upgradeDb.createObjectStore('posts', { keyPath: 'id' });
        postsOS.createIndex('id', 'id', { unique: true });
    }
  });
}
