export let state = {
    activeList: -1,
    activeTodo: -1,
    lists: [],
    todos: [],
    ui: {
        todoContextMenu: {
            isOpen: false,
            x: -1,
            y: -1,
            todoId: -1
        },
        listContextMenu: {
            isOpen: false,
            x: -1,
            y: -1,
            listId: -1
        },
        todoDetail: {
            isOpen: false
        }
    }
};
