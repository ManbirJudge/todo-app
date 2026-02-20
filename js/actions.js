import { db } from "./db.js";
import { dom } from "./dom.js";
import { render } from "./render.js";
import { state } from "./state.js";

function handleErr(err) {
    console.log("[ERROR]", err);
}

function sortTodos(method = null, reRender = false) {
    if (method == null) method = state.todoSortMethod;

    switch (method) {
        case "default": {
            state.todos = state.todos.sort((a, b) => {
                if (a.isCompleted !== b.isCompleted)
                    return a.isCompleted ? 1 : -1;
                else if (!a.isCompleted)  // both incomplete
                    return a.createdAt - b.createdAt;
                else  // both complete
                    return a.completedAt - b.completedAt;
            });
            break;
        }
        case "created": {
            state.todos = state.todos.sort((a, b) => {
                return a.createdAt - b.createdAt;
            });
        }
    }

    if (reRender) render();
}

// ---
export function createNewList() {
    const newListName = prompt("List name:");
    if (newListName === null || newListName === undefined || newListName.trim() === "")
        return;

    db.createList(newListName.trim()).then(newList => {
        state.lists.push(newList);
        render();
    }).catch(err => handleErr(err));
};

export function loadLists() {
    db.getLists().then(lists => {
        state.lists = lists;

        render();
    }).catch(err => handleErr(err));
};

export function selectList(listId) {
    if (state.activeList === listId) return;

    db.getTodos(listId).then(todos => {
        state.activeList = listId;
        state.todos = todos; 
        state.ui.todoDetail.isOpen = false;
        
        sortTodos();
        render();
    }).catch(err => handleErr(err));
};

export function renameList(listId) {
    const list = state.lists.find(l => l.id === listId);
    if (list === undefined) return;

    const newName = window.prompt("New name:");
    if (newName === null || newName.trim() === "") return;

    db.updateList(list, { name: newName.trim() }).then(() => {
        list.name = newName.trim();

        render();
    }).catch(err => handleErr(err));
};

export function askAndDltList(listId) {
    if (listId === -1) return;

    const listToDltName = state.lists.find(l => l.id === listId).name;
    if (window.confirm(`Are you sure you want to delete the list "${listToDltName}"?`)) {
        db.dltList(listId).then(() => {
            state.lists = state.lists.filter(l => l.id !== listId);
            if (listId === state.activeList) {
                state.activeList = -1;
                state.todos = [];
            }

            render();
        }).catch(err => handleErr(err));
    }
};

// ---
export function createNewTodoInCurrentList(title) {
    if (title.trim() === "") return;
    if (state.activeList === -1) return;

    db.createTodo(title.trim(), state.activeList).then(newTodo => {
        state.todos.push(newTodo);

        sortTodos();
        render();
    }).catch(err => { handleErr(err); });
};

export function toggleTodo(todoId) {
    const todo = state.todos.find(t => t.id === todoId);

    const wasComplete = todo.isCompleted;
    const completedAt = wasComplete ? null : Date.now();

    db.updateTodo(todo, { isCompleted: !wasComplete, completedAt }).then(() => {
        todo.isCompleted = !wasComplete;
        todo.completedAt = completedAt;
        
        sortTodos();
        render();
    }).catch(err => handleErr(err));
};

export function dltTodo(todoId) {
    if (state.todos.find(t => t.id === todoId).list !== state.activeList) return;

    db.dltTodo(todoId).then(() => {
        state.todos = state.todos.filter(t => t.id !== todoId);
        if (state.activeTodo === todoId)
            state.ui.todoDetail.isOpen = false;
        
        sortTodos();
        render();
    }).catch(err => { handleErr(err); });
};

// ---
export function openTodoDetail(todoId) {
    state.activeTodo = todoId;
    state.ui.todoDetail.isOpen = true;
    render();
};

export function closeTodoDetail() {
    state.ui.todoDetail.isOpen = false;
    render();
}

export function updateTodoFromDetail() {
    const todo = state.todos.find(t => t.id === state.activeTodo);
    
    const newNote = dom.todoDetailNote.value.trim() !== "" ? dom.todoDetailNote.value.trim() : null;
    
    db.updateTodo(todo, { note: newNote }).then(() => {
        todo.note = newNote;

        render();
    }).catch(err => handleErr(err));
}

// ---
export function openListContextMenu(x, y, listId) {
    state.ui.listContextMenu = {
        isOpen: true,
        x,
        y,
        listId
    };
    if (state.ui.todoContextMenu.isOpen)
        state.ui.todoContextMenu.isOpen = false;

    render();
}

export function openTodoContextMenu(x, y, todoId) {
    state.ui.todoContextMenu = {
        isOpen: true,
        x,
        y,
        todoId
    };
    if (state.ui.listContextMenu.isOpen)
        state.ui.listContextMenu.isOpen = false;

    render();
}

export function closeContextMenus() {
    state.ui.todoContextMenu.isOpen = false;
    state.ui.listContextMenu.isOpen = false;
    render();
};
