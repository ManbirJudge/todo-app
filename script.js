const todoTxtIn = document.getElementById("todo-txt-in");
const addBtn = document.getElementById("todo-add-btn");
const todoFilter = document.getElementById("todo-filter");
const todoList = document.getElementById("todo-list");

document.addEventListener("DOMContentLoaded", () => {
    getLocalTodos().forEach(addTodoToList);
});

addBtn.addEventListener("click", evt => {
    evt.preventDefault();

    const todoTxt = todoTxtIn.value.trim();
    if (todoTxt === "") return;

    saveTodoLocally(todoTxt);
    addTodoToList({
        text: todoTxt,
        completed: false
    })

    todoTxtIn.value = "";
});

todoFilter.addEventListener("click", evt => {
    todoList.childNodes.forEach(todo => {
        console.log(todo);
        switch(evt.target.value) {
            case "all":
                todo.style.display = "flex";
                break;
            case "completed":
                todo.style.display = todo.classList.contains("completed") ? "flex" : "none";
                break;
            case "uncompleted":
                todo.style.display = todo.classList.contains("completed") ? "none" : "flex";
                break;
        };
    });
});

todoList.addEventListener("click", evt => {
    const ele = evt.target;

    if (ele.classList.contains("delete-btn")) {
        const todoEle = ele.parentElement;
        
        dltLocalTodo(todoEle.childNodes[0].innerText);

        todoEle.classList.add("fall");
        todoEle.addEventListener("transitionend", function() {
            todoEle.remove();
        });
    };

    if (ele.classList.contains("complete-btn")) {
        const todoEle = ele.parentElement;

        updateLocalTodo(todoEle.childNodes[0].innerText, todoEle.classList.contains("completed"));
        todoEle.classList.toggle("completed");
    };
});

function addTodoToList(todo) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    if (todo.completed) todoDiv.classList.add("completed");

    const todoItem = document.createElement("li");
    todoItem.innerText = todo.text;
    todoItem.classList.add("todo-txt");
    todoDiv.appendChild(todoItem);

    const completedButton = document.createElement("button");
    completedButton.innerHTML = `<i class="fas fa-check"></i>`;
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    const deleteTodoButton = document.createElement("button");
    deleteTodoButton.innerHTML = `<i class="fas fa-trash-alt"></i>`;
    deleteTodoButton.classList.add("delete-btn");
    todoDiv.appendChild(deleteTodoButton);

    todoList.appendChild(todoDiv);
}

// local storage
function getLocalTodos() {
    const stored = localStorage.getItem("todos");
    return stored ? JSON.parse(stored) : [];
}

function saveTodoLocally(todo) {
    let todos = getLocalTodos();

    todos.push({
        text: todo,
        completed: false
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function dltLocalTodo(todoTxt) {
    console.log(todoTxt);
    let todos = getLocalTodos();

    let todoI = -1;
    for (let i in todos) {
        if (todos[i].text == todoTxt) {
            todoI = i;
            break;
        }
    }

    if (todoI != -1) {
        todos.splice(todoI, 1);
        localStorage.setItem("todos", JSON.stringify(todos));
    }
}

function updateLocalTodo(todoTxt, completed) {
    let todos = getLocalTodos();
    
    for (var i in todos) {
        if (todos[i].text === todoTxt)  {
            todos[i].completed = completed;
            break;
        }
    }

    localStorage.setItem("todos", JSON.stringify(todos));
}