import { dom } from "./dom.js";
import { state } from "./state.js";

function listComponent(list) {
    return `<li data-id="${list.id}">${list.name}</li>`;
}

function todoComponent(todo) {
    return `<li data-id="${todo.id}"><button><i class="${todo.isCompleted ? "fa-solid fa-circle-check" : "fa-regular fa-circle"}"></i></button><div><span>${todo.title}</span>${todo.note ? `<span class="todo-info"><i class="fa-solid fa-note-sticky"></i> Has note<span>` : ""}<div></li>`;
}

function renderLists() {
    dom.listsList.innerHTML = state.lists.map(l => listComponent(l)).join("");
}

function renderList() {
    dom.listTitle.textContent = state.lists.find(l => l.id === state.activeList)?.name;
    dom.todosList.innerHTML = state.todos.map(t => todoComponent(t)).join("");
    dom.addTodoIn.value = "";
}

function renderTodoContextMenu() {
    if (state.ui.todoContextMenu.isOpen) {
        const _ = dom.todoContextMenu.querySelector("#toggle-complete-todo");
        if (state.todos.find(t => t.id === state.ui.todoContextMenu.todoId).isCompleted) {
            _.innerHTML = `<i class="fa-regular fa-circle"></i>Mark as uncomplete`;
        } else {
            _.innerHTML = `<i class="fa-regular fa-circle-check"></i>Mark as completed`;
        }

        dom.todoContextMenu.classList.add("open");
        dom.todoContextMenu.style.top = `${state.ui.todoContextMenu.y}px`;
        dom.todoContextMenu.style.left = `${state.ui.todoContextMenu.x}px`;
    } else {
        dom.todoContextMenu.classList.remove("open");
    }
}

function renderListContextMenu() {
    if (state.ui.listContextMenu.isOpen) {
        dom.listContextMenu.classList.add("open");
        dom.listContextMenu.style.top = `${state.ui.listContextMenu.y}px`;
        dom.listContextMenu.style.left = `${state.ui.listContextMenu.x}px`;
    } else {
        dom.listContextMenu.classList.remove("open");
    }
}

function renderTodoDetail() {
    if (state.ui.todoDetail.isOpen) {
        dom.todoDetail.classList.add("open");
        
        const activeTodo = state.todos.find(t => t.id === state.activeTodo);
        
        if (activeTodo.isCompleted) {
            dom.todoDetailCompleted.classList.remove("fa-regular", "fa-circle");
            dom.todoDetailCompleted.classList.add("fa-solid", "fa-circle-check");
        } else {
            dom.todoDetailCompleted.classList.add("fa-regular", "fa-circle");
            dom.todoDetailCompleted.classList.remove("fa-solid", "fa-circle-check");
        }

        dom.todoDetailName.textContent = activeTodo.title;
        dom.todoDetailNote.value = activeTodo.note ? activeTodo.note : "";

        const createdDate = new Date(activeTodo.createdAt);
        const createdDateStr = createdDate.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        });
        dom.todoDetailCreated.textContent = `Created on ${createdDateStr}`;
    } else {
        dom.todoDetail.classList.remove("open");
    }
}

export function render() {
    renderLists();
    renderList();
    renderListContextMenu();
    renderTodoContextMenu();
    renderTodoDetail();
}
