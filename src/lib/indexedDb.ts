const DB_NAME = "jobtrackdb";
const DB_VERSION = 1;

let cachedDb: IDBDatabase | null = null;

export interface DbUser {
  id: number;
  username: string;

  salt: Uint8Array;

  passwordVerifier: Uint8Array;
  verifierIv: Uint8Array;

  createdAt: string;
  updatedAt: string;
}

export interface DbApplication {
  id: number;
  userId: number;
  iv: Uint8Array;
  ciphertext: Uint8Array;
  createdAt: string;
  updatedAt: string; 
}

function promisifyRequest<T = any>(req: IDBRequest): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result as T);
    req.onerror = () => reject(req.error);
  });
}

function waitForTransaction(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export function openDatabase(): Promise<IDBDatabase> {
  if (cachedDb) return Promise.resolve(cachedDb);

  const req = indexedDB.open(DB_NAME, DB_VERSION);

  return new Promise((resolve, reject) => {
    req.onupgradeneeded = () => {
      const db = req.result;

      if (!db.objectStoreNames.contains("users")) {
        const userStore = db.createObjectStore("users", { keyPath: "id", autoIncrement: true });
        userStore.createIndex("username", "username", { unique: true });
      }

      if (!db.objectStoreNames.contains("applications")) {
        const appStore = db.createObjectStore("applications", { keyPath: "id", autoIncrement: true });
        appStore.createIndex("userId", "userId", { unique: false });
      }
    };

    req.onsuccess = () => {
      const db = req.result;
      cachedDb = db;

      db.onversionchange = () => {
        try {
          db.close();
        } finally {
          cachedDb = null;
        }
      };

      if (typeof window !== "undefined") {
        const handler = () => {
          try { db.close(); } catch (e) { /* ignore */ }
          cachedDb = null;
        };
        window.addEventListener("beforeunload", handler, { passive: true });
      }

      resolve(db);
    };

    req.onerror = () => reject(req.error);
  });
}

async function getStore<T = any>(storeName: string, mode: IDBTransactionMode = "readonly") {
  const db = await openDatabase();
  const tx = db.transaction(storeName, mode);
  const store = tx.objectStore(storeName);
  return { db, tx, store } as { db: IDBDatabase; tx: IDBTransaction; store: IDBObjectStore };
}

export async function addUser(user: Omit<DbUser, "id" | "createdAt" | "updatedAt">): Promise<number> {
  const now = new Date().toISOString();
  const { tx, store } = await getStore<DbUser>("users", "readwrite");
  const req = store.add({ ...user, createdAt: now, updatedAt: now });
  const id = await promisifyRequest<number>(req);
  await waitForTransaction(tx);
  return id;
}

export async function getUserById(id: number): Promise<DbUser | undefined> {
  const { tx, store } = await getStore<DbUser>("users", "readonly");
  const req = store.get(id);
  const result = await promisifyRequest<DbUser | undefined>(req);
  await waitForTransaction(tx);
  return result;
}

export async function getUserByUsername(username: string): Promise<DbUser | undefined> {
  const { tx, store } = await getStore<DbUser>("users", "readonly");
  const index = store.index("username");
  const req = index.get(username);
  const result = await promisifyRequest<DbUser | undefined>(req);
  await waitForTransaction(tx);
  return result;
}

export async function insertApplication(app: Omit<DbApplication, "id"| "createdAt" | "updatedAt">): Promise<number> {
  const now = new Date().toISOString();
  const { tx, store } = await getStore<DbApplication>("applications", "readwrite");
  const req = store.add({ ...app, createdAt: now, updatedAt: now });
  const id = await promisifyRequest<number>(req);
  await waitForTransaction(tx);
  return id;
}

export async function getApplicationsByUser(userId: number): Promise<DbApplication[]> {
  const { tx, store } = await getStore<DbApplication>("applications", "readonly");
  const index = store.index("userId");
  const req = index.getAll(userId);
  const result = await promisifyRequest<DbApplication[]>(req);
  await waitForTransaction(tx);
  return result || [];
}

export async function updateApplication(app: DbApplication): Promise<void> {
  if (!app.id) throw new Error("Application must have an id to update");
  const now = new Date().toISOString();
  const { tx, store } = await getStore<DbApplication>("applications", "readwrite");
  const req = store.put({ ...app, updatedAt: now });
  await promisifyRequest(req);
  await waitForTransaction(tx);
}

export async function deleteApplication(id: number): Promise<void> {
  const { tx, store } = await getStore<DbApplication>("applications", "readwrite");
  const req = store.delete(id);
  await promisifyRequest(req);
  await waitForTransaction(tx);
}

export async function clearDatabase(): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(Array.from(db.objectStoreNames), "readwrite");
  for (const name of Array.from(db.objectStoreNames)) {
    tx.objectStore(name).clear();
  }
  await waitForTransaction(tx);
}