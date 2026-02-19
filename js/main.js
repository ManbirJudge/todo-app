const listTitle = document.getElementById("list-title");
const listsList = document.getElementById("lists-list");
const todosList = document.getElementById("todos-list");
const newListBtn = document.getElementById("side-bar--new-list-btn");
const addTodoIn = document.getElementById("add-todo");
const dltListBtn = document.getElementById("list-dlt-btn");
const todoContextMenu = document.getElementById("todo-context-menu");

let state = {
    activeList: -1,
    lists: [],
    todos: [],
    ui: {
        todoContextMenu: {
            isOpen: false,
            x: -1,
            y: -1,
            todoId: -1
        }
    }
};

const db = new DB();

// --- utils
function handleErr(err) {
    console.log("[ERROR][Main]", err);
}

// --- rendering
function listComponent(list) {
    return `<li data-id="${list.id}">${list.name}</li>`;
}

function todoComponent(todo) {
    return `<li data-id="${todo.id}"><button><i class="${todo.isCompleted ? "fa-solid fa-circle-check" : "fa-regular fa-circle"}"></i></button>${todo.title}</li>`;
}

function renderLists() {
    listsList.innerHTML = state.lists.map(l => listComponent(l)).join("");
}

function renderList() {
    listTitle.textContent = state.lists.find(l => l.id === state.activeList)?.name;
    todosList.innerHTML = state.todos.map(t => todoComponent(t)).join("");
    addTodoIn.value = "";
}

function renderTodoContextMenu() {
    if (state.ui.todoContextMenu.isOpen) {
        todoContextMenu.classList.add("open");
        todoContextMenu.style.top = `${state.ui.todoContextMenu.y}px`;
        todoContextMenu.style.left = `${state.ui.todoContextMenu.x}px`;
    } else {
        todoContextMenu.classList.remove("open");
    }
}

// --- event listeners
document.addEventListener("click", evt => {
    if (state.ui.todoContextMenu.isOpen) {
        state.ui.todoContextMenu.isOpen = false;
        renderTodoContextMenu();
    }
});

listsList.addEventListener("click", evt => {
    if (evt.target.tagName === "LI") {
        const listId = parseInt(evt.target.getAttribute("data-id"));
        if (state.activeList === listId) return;
        db.getTodos(listId).then(todos => {
            state.activeList = listId;
            state.todos = todos; 
            renderList();
        }).catch(err => { handleErr(err); });
    }
});

newListBtn.addEventListener("click", evt => {
    const newListName = prompt("List name:");

    if (newListName !== null && newListName !== undefined && newListName.trim() !== "") {
        db.createList(newListName.trim()).then(newList => {
            state.lists.push(newList);
            renderLists();
        }).catch(err => { handleErr(err); });
    }
});

todosList.addEventListener("click", evt => {
    if (evt.target.tagName === "I") {
        const todoId = parseInt(evt.target.parentElement.parentElement.getAttribute("data-id"));
        const todo = state.todos.find(t => t.id === todoId);
        const wasComplete = todo.isCompleted;
        db.updateTodo(todo, { isCompleted: !wasComplete }).then(() => {
            todo.isCompleted = !wasComplete;
            renderList(); 
        }).catch(err => { handleErr(err); });
    }
});

todosList.addEventListener("contextmenu", evt => {
    if (evt.target.tagName === "LI") {
        evt.preventDefault();
        state.ui.todoContextMenu = {
            isOpen: true,
            x: evt.clientX,
            y: evt.clientY,
            todoId: parseInt(evt.target.getAttribute("data-id"))
        };
        renderTodoContextMenu();
    }
});

addTodoIn.addEventListener("keypress", evt => {
    const keyCode = evt.keyCode || evt.which;
    if (keyCode === 13) {
        if (state.activeList !== -1) {
            db.createTodo(addTodoIn.value, state.activeList).then(newTodo => {
                state.todos.push(newTodo);
                renderList();
            }).catch(err => { handleErr(err); });
        }
    }
});

todoContextMenu.addEventListener("click", evt => {
    const cmd = evt.target.closest("li");
    switch (cmd.id) {
        case "dlt-task": {
            const todoIdToDlt = state.ui.todoContextMenu.todoId;
            db.dltTodo(todoIdToDlt).then(() => {
                state.todos = state.todos.filter(t => t.id !== todoIdToDlt);
                renderList();
            }).catch(err => { handleErr(err); });
            break;
        }
    }
});

dltListBtn.addEventListener("click", evt => {
    if (state.activeList === -1) return;

    const listIdToDlt = state.activeList;
    db.dltList(listIdToDlt).then(() => {
        state.activeList = -1;
        state.todos = [];
        state.lists = state.lists.filter(l => l.id !== listIdToDlt);
        renderLists();
        renderList();
    }).catch(err => handleErr(err));
});

// ---
db.init(() => {
    db.getLists().then(lists => {
        state.lists = lists; 
        renderLists();
    }).catch(err => { handleErr(err); });
});
