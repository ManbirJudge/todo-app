/**
 * @typedef {Object} Todo
 * @property {number} id
 * @property {string} title 
 * @property {string | null} note
 * @property {number} createdAt
 * @property {number | null} dueAt
 * @property {boolean} isCompleted
 * @property {number} list
 * @property {number[]} subTodos
 * @property {number} isImportant
 *
 * @property {number} completedAt
 */

/**
 * @typedef {Object} List
 * @property {number} id
 * @property {string} name
 */

class DB {
    db = null;
    initialized = false;

    init(onInit) {
        let req = indexedDB.open("TodoDB", 3);

        req.onerror = function(evt) {
            console.log(`[ERROR][DB] ${evt.target.error?.message}`);
        };

        req.onsuccess = evt => {
            this.db = evt.target.result;
            this.initialized = true;
            console.log("[_INFO][DB] Initialized.");
            if (onInit) onInit();
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
                todosStore.createIndex("by_isImportant", "isImportant", { unique: false });
            }
        };
    }
    
    createList(name) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction("lists", "readwrite");
            const store = tx.objectStore("lists");

            const req = store.add({ name });
            
            let newList;
            req.onsuccess = evt => {
                newList = {
                    id: evt.target.result,
                    name
                };
            }

            tx.oncomplete = () => resolve(newList);
            tx.onerror = evt => reject(evt.target.error);
            tx.onabort = evt => reject(evt.target.error);
        });
    }

    createTodo(title, list) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction("todos", "readwrite");
            const store = tx.objectStore("todos");

            const todo = {
                title,
                note: null,
                createdAt: Date.now(),
                dueAt: null,
                isCompleted: false,
                list,
                subTodos: [],
                completedAt: null,
                isImportant: 0
            };
            const req = store.add(todo);
            
            let newTodo;
            req.onsuccess = evt => {
                newTodo = {
                    ...todo,
                    id: evt.target.result
                };
            };

            tx.oncomplete = () => resolve(newTodo);
            tx.onerror = evt => reject(evt.target.error);
            tx.onabort = evt => reject(evt.target.error);
        });
    }

    getLists() {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction("lists", "readonly");
            const store = tx.objectStore("lists");

            const req = store.getAll();
            
            let lists;
            req.onsuccess = evt => {
                lists = evt.target.result;
            };

            tx.oncomplete = () => resolve(lists);
            tx.onerror = evt => reject(evt.target.error);
            tx.onabort = evt => reject(evt.target.error);
        });
    }

    getTodos(list) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction("todos", "readonly");
            const store = tx.objectStore("todos");
            const idx = store.index("by_list");

            const req = idx.getAll(list);

            let todos;
            req.onsuccess = evt => {
                todos = evt.target.result;
            };

            tx.oncomplete = () => resolve(todos);
            tx.onerror = evt => reject(evt.target.error);
            tx.onabort = evt => reject(evt.target.error);
        });
    }

    getImportantTodos() {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction("todos", "readonly");
            const store = tx.objectStore("todos");
            const idx = store.index("by_isImportant");

            const req = idx.getAll(1);

            let todos;
            req.onsuccess = evt => {
                todos = evt.target.result;
            };

            tx.oncomplete = () => resolve(todos);
            tx.onerror = evt => reject(evt.target.error);
            tx.onabort = evt => reject(evt.target.error);
        });
    }

    updateList(list, updates) {  // TODO: verify that updates contain valid fields
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction("lists", "readwrite");
            const store = tx.objectStore("lists");
            
            store.put({ ...list, ...updates });

            tx.oncomplete = () => resolve();
            tx.onerror = evt => reject(evt.target.error);
            tx.onabort = evt => reject(evt.target.error);
        });
    }

    updateTodo(todo, updates) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction("todos", "readwrite");
            const store = tx.objectStore("todos");
            
            store.put({ ...todo, ...updates });

            tx.oncomplete = () => resolve();
            tx.onerror = evt => reject(evt.target.error);
            tx.onabort = evt => reject(evt.target.error);
        });
    }

    dltTodo(todoId) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction("todos", "readwrite");
            const store = tx.objectStore("todos");

            store.delete(todoId);

            tx.oncomplete = () => resolve();
            tx.onerror = evt => reject(evt.target.error);
            tx.onabort = evt => reject(evt.target.error);
        });
    }

    dltList(listId) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(["lists", "todos"], "readwrite");
            const listStore = tx.objectStore("lists");
            const todoStore = tx.objectStore("todos");
            const idx = todoStore.index("by_list");

            listStore.delete(listId);

            const range = window.IDBKeyRange.only(listId);
            idx.openCursor(range).onsuccess = evt => {
                const cur = evt.target.result;
                if (cur) {
                    cur.delete();
                    cur.continue();
                }
            };

            tx.oncomplete = () => resolve();
            tx.onerror = evt => reject(evt.target.error);
            tx.onabort = evt => reject(evt.target.error);
        });
    }
}

export const db = new DB();
