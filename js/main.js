import {
    createNewList, loadLists, selectList, renameList, askAndDltList,
    createNewTodoInCurrentList, toggleTodo, dltTodo,
    openTodoDetail, closeTodoDetail, updateTodoFromDetail,
    openListContextMenu, openTodoContextMenu, closeContextMenus
} from "./actions.js";
import { db } from "./db.js";
import { dom } from "./dom.js";
import { state } from "./state.js";

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

dom.newListBtn.addEventListener("click", evt => {
    createNewList();
});

dom.todosList.addEventListener("click", evt => {
    const li = evt.target.closest("li");
    if (!li) return;

    const todoId = parseInt(li.getAttribute("data-id"));

    if (evt.target.closest("i"))
        toggleTodo(todoId);
    else
        openTodoDetail(todoId);
});

dom.todosList.addEventListener("contextmenu", evt => {
    const li = evt.target.closest("li");
    if (!li) return; 

    evt.preventDefault();

    openTodoContextMenu(evt.clientX, evt.clientY, parseInt(li.getAttribute("data-id")));
});

dom.addTodoIn.addEventListener("keypress", evt => {
    const keyCode = evt.keyCode || evt.which;
    if (keyCode === 13)
        createNewTodoInCurrentList(dom.addTodoIn.value);
});

dom.todoContextMenu.addEventListener("click", evt => {
    const cmd = evt.target.closest("li");
    const todoId = state.ui.todoContextMenu.todoId;
    switch (cmd.id) {
        case "toggle-complete-todo": {
            toggleTodo(todoId);
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

dom.dltListBtn.addEventListener("click", evt => {
    askAndDltList(state.activeList);
});

dom.todoDetailCloseBtn.addEventListener("click", evt => {
    closeTodoDetail();
});
dom.todoDetailSaveBtn.addEventListener("click", evt => {
    updateTodoFromDetail();
});
dom.todoDetailDltBtn.addEventListener("click", evt => {
    dltTodo(state.activeTodo);
});

// ---
db.init(() => {
    loadLists();
});
