/**
 * @typedef {Object} Todo
 * @property {number} id
 * @property {title} string
 * @property {string | null} desc
 * @property {number} createdAt
 * @property {number | null} dueAt
 * @property {boolean} completed
 * @property {number} list
 * @property {list[]} subTodos
 */

/**
 * @typedef {Object} List
 * @property {number} id
 * @property {string} name
 */

class DB {
    db = null;
    initialized = false

    constructor() {
        let req = indexedDB.open("TodoDB", 3);
        req.onerror = function(evt) {
            console.log(`[ERROR][DB] ${evt.target.error?.message}`);
        };
        req.onsuccess = evt => {
            this.db = evt.target.result;
            this.initialized = true;
            console.log("[_INFO][DB] Initialized.");
        };
        req.onupgradeneeded = function(evt) {
            const db = evt.target.result; 
            if (!db.objectStoreNames.contains("lists")) {
                db.createObjectStore("lists", {
                    keyPath: "id",
                    autoIncrement: true
                });
            }
            if (!db.objectStoreNames.contains("todos")) {
                const todosStore = db.createObjectStore("todos", {
                    keyPath: "id",
                    autoIncrement: true
                });
                todosStore.createIndex("by_list", "list", { unique: false });
            }
        };
    }
    
    createList(name) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction("lists", "readwrite");
            const store = tx.objectStore("lists");
            const req = store.add({ name });

            req.onsuccess = evt => {
                resolve({
                    id: evt.target.result,
                    name
                });
            }

            req.onerror = evt => {
                reqect(evt.target.error);
            }
        });
    }

    createTodo(title, list) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction("todos", "readwrite");
            const store = tx.objectStore("todos");
            const req = store.add({ title, list });

            req.onsuccess = evt => {
                resolve({
                    id: evt.target.result,
                    title,
                    list
                });
            }

            req.onerror = evt => {
                reqect(evt.target.error);
            }
        });
    }

    getLists() {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction("lists", "readonly");
            const store = tx.objectStore("lists");
            const req = store.getAll();

            req.onsuccess = evt => {
                resolve(evt.target.result);
            };

            req.onerror = evt => {
                reject(evt.target.error);
            }
        });
    }

    getTodods(list) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction("todos", "readonly");
            const store = tx.objectStore("todos");
            const idx = store.index("by_list");
            const req = index.getAll(list);

            req.onsuccess = evt => {
                resolve(evt.target.result);
            };

            req.onerror = evt => {
                reject(evt.target.error);
            }
        });
    }
}
