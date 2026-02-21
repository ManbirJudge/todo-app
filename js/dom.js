export const dom = {
    listsList: document.getElementById("lists-list"),
    todosList: document.getElementById("todos-list"),
    specialListsList: document.getElementById("special-lists"),
    sidebar: {
        container: document.querySelector(".side-bar"),
        closeBtn: document.getElementById("side-bar--close-btn"),
        newListBtn: document.getElementById("side-bar--new-list-btn")
    },
    content: {
        sidebarHamburgerBtn: document.getElementById("sidebar-hamburger-btn"),
        listTitle: document.getElementById("list-title"),
        dltListBtn: document.getElementById("list-dlt-btn"),
        addTodoIn: document.getElementById("add-todo")
    },
    todoDetail: {
        container: document.getElementById("todo-detail"),
        closeBtn: document.getElementById("todo-detail--close-btn"),
        saveBtn: document.getElementById("todo-detail--save-btn"),
        completedI: document.getElementById("todo-detail--completed"),
        impI: document.getElementById("todo-detail--imp"),
        nameIn: document.getElementById("todo-detail--name"),
        createdP: document.getElementById("todo-detail--created"),
        dltBtn: document.getElementById("todo-detail--dlt-btn"),
        noteTxt: document.getElementById("todo-detail--note")
    },
    todoContextMenu: document.getElementById("todo-context-menu"),
    listContextMenu: document.getElementById("list-context-menu")
};
