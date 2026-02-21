import { dom } from "./dom.js";
import { state } from "./state.js";

function listComponent(list) {
    return `<li data-id="${list.id}">${list.name}</li>`;
}

function todoComponent(todo) {
    return `<li data-id="${todo.id}">
        <button class="toggle-complete-btn">
            <i class="${todo.isCompleted ? "fa-solid fa-circle-check" : "fa-regular fa-circle"}"></i>
        </button>
        <div>
            <span>${todo.title}</span>
            ${todo.note ? `<span class="todo-info"><i class="fa-solid fa-note-sticky"></i> Has note<span>` : ""}
        </div>
        <div class="spacer"></div>
        <button class="toggle-imp-btn">
            <i class="${todo.isImportant ? "fa-solid" : "fa-regular"} fa-star"></i>
        </button>
    </li>`;
}

function renderLists() {
    dom.listsList.innerHTML = state.lists.map(l => listComponent(l)).join("");
}

function renderList() {
    dom.content.listTitle.textContent = state.activeList === "important" ? "Imporant" : state.lists.find(l => l.id === state.activeList)?.name;
    dom.todosList.innerHTML = state.todos.map(t => todoComponent(t)).join("");
    dom.content.addTodoIn.value = "";
}

function renderTodoContextMenu() {
    if (state.ui.todoContextMenu.isOpen) {
        const _todo = state.todos.find(t => t.id === state.ui.todoContextMenu.todoId);

        const _ = dom.todoContextMenu.querySelector("#toggle-complete-todo");
        if (_todo.isCompleted) {
            _.innerHTML = `<i class="fa-regular fa-circle"></i>Mark as uncomplete`;
        } else {
            _.innerHTML = `<i class="fa-regular fa-circle-check"></i>Mark as completed`;
        }

        const __ = dom.todoContextMenu.querySelector("#toggle-imp-todo");
        if (_todo.isImportant) {
            __.innerHTML = `<i class="fa-regular fa-circle-xmark"></i>Remove importance`;
        } else {
            __.innerHTML = `<i class="fa-regular fa-star"></i>Mark as important`;
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
        dom.todoDetail.container.classList.add("open");
        
        const activeTodo = state.todos.find(t => t.id === state.activeTodo);
        
        if (activeTodo.isCompleted) {
            dom.todoDetail.completedI.classList.remove("fa-regular", "fa-circle");
            dom.todoDetail.completedI.classList.add("fa-solid", "fa-circle-check");
        } else {
            dom.todoDetail.completedI.classList.add("fa-regular", "fa-circle");
            dom.todoDetail.completedI.classList.remove("fa-solid", "fa-circle-check");
        }

        if (activeTodo.isImportant) {
            dom.todoDetail.impI.classList.remove("fa-regular");
            dom.todoDetail.impI.classList.add("fa-solid");
        } else {
            dom.todoDetail.impI.classList.add("fa-regular");
            dom.todoDetail.impI.classList.remove("fa-solid");
        }

        dom.todoDetail.nameIn.value = activeTodo.title;
        dom.todoDetail.noteTxt.value = activeTodo.note ? activeTodo.note : "";

        const createdDate = new Date(activeTodo.createdAt);
        const createdDateStr = createdDate.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        });
        dom.todoDetail.createdP.textContent = `Created on ${createdDateStr}`;
    } else {
        dom.todoDetail.container.classList.remove("open");
    }
}

function renderSidebar() {
    if (state.ui.isSidebarOpen)
        dom.sidebar.container.classList.add("open");
    else
        dom.sidebar.container.classList.remove("open");
}

export function render() {
    renderSidebar();
    renderLists();
    renderList();
    renderListContextMenu();
    renderTodoContextMenu();
    renderTodoDetail();
};

export { renderSidebar };
