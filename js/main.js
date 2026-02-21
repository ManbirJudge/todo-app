import {
    createNewList, loadLists, selectList, renameList, askAndDltList,
    createNewTodoInCurrentList, toggleTodo, toggleTodoImportance, dltTodo,
    openTodoDetail, closeTodoDetail, updateTodoFromDetail,
    openListContextMenu, openTodoContextMenu, closeContextMenus,
    closeSidebar, openSidebar
} from "./actions.js";
import { db } from "./db.js";
import { dom } from "./dom.js";
import { state } from "./state.js";

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/js/sw.js");
}

// TODO: group/organize event listeners related to similar tasks

document.addEventListener("click", evt => {
    closeContextMenus();
});

dom.listsList.addEventListener("click", evt => {
    const li = evt.target.closest("li");
    if (!li) return;

    selectList(parseInt(li.getAttribute("data-id")));
});

dom.listsList.addEventListener("contextmenu", evt => {
    const li = evt.target.closest("li");
    if (!li) return;

    evt.preventDefault();

    openListContextMenu(evt.clientX, evt.clientY, parseInt(li.getAttribute("data-id"))); 
});

dom.specialListsList.addEventListener("click", evt => {
    const li = evt.target.closest("li");
    if (!li) return;

    selectList(li.getAttribute("data-id"));
});

dom.sidebar.newListBtn.addEventListener("click", evt => {
    createNewList();
});

dom.todosList.addEventListener("click", evt => {
    const li = evt.target.closest("li");
    if (!li) return;

    const todoId = parseInt(li.getAttribute("data-id"));
    
    const btn = evt.target.closest("button");

    if (btn) {
        if (btn.classList.contains("toggle-complete-btn")) {
            toggleTodo(todoId);
        } else if (btn.classList.contains("toggle-imp-btn")) {
            toggleTodoImportance(todoId);
        }
    }
    else openTodoDetail(todoId);
});

dom.todosList.addEventListener("contextmenu", evt => {
    const li = evt.target.closest("li");
    if (!li) return; 

    evt.preventDefault();

    openTodoContextMenu(evt.clientX, evt.clientY, parseInt(li.getAttribute("data-id")));
});

dom.content.addTodoIn.addEventListener("keypress", evt => {
    const keyCode = evt.keyCode || evt.which;
    if (keyCode === 13)
        createNewTodoInCurrentList(dom.content.addTodoIn.value);
});

dom.todoContextMenu.addEventListener("click", evt => {
    const cmd = evt.target.closest("li");
    const todoId = state.ui.todoContextMenu.todoId;
    switch (cmd.id) {
        case "toggle-complete-todo": {
            toggleTodo(todoId);
            break;
        }
        case "toggle-imp-todo": {
            toggleTodoImportance(todoId);
            break;
        }
        case "dlt-task": {
            dltTodo(todoId);
            break;
        }
    }
});

dom.listContextMenu.addEventListener("click", evt => {
    const listId = state.ui.listContextMenu.listId;

    const cmd = evt.target.closest("li");
    switch (cmd.id) {
        case "rename-list": {
            renameList(listId);
            break;
        }
        case "dlt-list": {
            askAndDltList(listId);
            break;
        }
    }
});

dom.content.dltListBtn.addEventListener("click", evt => {
    askAndDltList(state.activeList);
});

dom.todoDetail.closeBtn.addEventListener("click", evt => {
    closeTodoDetail();
});

dom.todoDetail.saveBtn.addEventListener("click", evt => {
    updateTodoFromDetail();
});

dom.todoDetail.dltBtn.addEventListener("click", evt => {
    dltTodo(state.activeTodo);
});

dom.todoDetail.completedI.addEventListener("click", evt => {
    toggleTodo(state.activeTodo);
});

dom.todoDetail.impI.addEventListener("click", evt => {
    toggleTodoImportance(state.activeTodo);
});

dom.content.sidebarHamburgerBtn.addEventListener("click", evt => {
    openSidebar(true);
});

dom.sidebar.closeBtn.addEventListener("click", evt => {
    closeSidebar(true);
});

// ---
db.init(() => {
    loadLists();
});
