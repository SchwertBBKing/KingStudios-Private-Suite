const DB_NAME = "finance-db";
const STORE = "transactions";
const VERSION = 1;

export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllTx() {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
  });
}

export async function saveTx(tx) {
  const db = await openDB();
  const t = db.transaction(STORE, "readwrite");
  t.objectStore(STORE).put(tx);
}

export async function deleteTx(id) {
  const db = await openDB();
  const t = db.transaction(STORE, "readwrite");
  t.objectStore(STORE).delete(id);
}
