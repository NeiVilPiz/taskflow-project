// ELEMENTOS DEL DOM

const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");

const done = document.getElementById("done");
const todo = document.getElementById("todo");
const total = document.getElementById("total");

const completeAllBtn = document.getElementById("completeAll");
const clearCompletedBtn = document.getElementById("clearCompleted");

const filterButtons = document.querySelectorAll("[data-filter]");

const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;


// ESTADO DE LA APP

let tasks = [];
let currentFilter = "all";
let searchText = "";



// LOCAL STORAGE

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {

    const stored = localStorage.getItem("tasks");

    if (stored) {
        tasks = JSON.parse(stored);
    } else {
        tasks = [];
    }

}



// CREAR TAREA

function createTaskObject(title) {

    return {
        id: Date.now().toString(),
        title,
        completed: false,
        createdAt: new Date()
    };

}



// FILTRADO

function getFilteredTasks() {

    let filtered = [...tasks];

    if (currentFilter === "pending") {
        filtered = filtered.filter(t => !t.completed);
    }

    if (currentFilter === "completed") {
        filtered = filtered.filter(t => t.completed);
    }

    if (searchText) {

        filtered = filtered.filter(t =>
            t.title.toLowerCase().includes(searchText.toLowerCase())
        );

    }

    return filtered;
}



// RENDER

function renderTasks() {

    list.innerHTML = "";

    const filteredTasks = getFilteredTasks();

    filteredTasks.forEach(task => {

        const li = document.createElement("li");
        li.className = "flex items-center gap-3 border rounded-lg px-3 py-2 dark:border-gray-600";


        // CHECKBOX

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });


        // TEXTO

        const span = document.createElement("span");

        span.textContent = task.title;
        span.className = "flex-1";

        if (task.completed) {
            span.classList.add("line-through", "text-gray-500");
        }


        // EDITAR (doble click)

        span.addEventListener("dblclick", () => {
            editTask(task.id);
        });


        // BOTON ELIMINAR

        const deleteBtn = document.createElement("button");

        deleteBtn.textContent = "✕";
        deleteBtn.className = "text-red-500";

        deleteBtn.addEventListener("click", () => {
            deleteTask(task.id);
        });


        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        list.appendChild(li);

    });

    updateStats();

    saveTasks();

}



// ESTADISTICAS

function updateStats() {

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;

    total.textContent = totalTasks;
    done.textContent = completedTasks;
    todo.textContent = totalTasks - completedTasks;

}



// ACCIONES BASICAS

function addTask(title) {

    const task = createTaskObject(title);

    tasks.push(task);

    renderTasks();

}


function toggleTask(id) {

    const task = tasks.find(t => t.id === id);

    if (task) {
        task.completed = !task.completed;
    }

    renderTasks();

}


function deleteTask(id) {

    tasks = tasks.filter(t => t.id !== id);

    renderTasks();

}



// EDITAR

function editTask(id) {

    const task = tasks.find(t => t.id === id);

    const newTitle = prompt("Editar tarea:", task.title);

    if (newTitle && newTitle.trim()) {

        task.title = newTitle.trim();

        renderTasks();

    }

}



// ACCIONES MASIVAS

function completeAllTasks() {

    tasks.forEach(task => {
        task.completed = true;
    });

    renderTasks();

}


function clearCompletedTasks() {

    tasks = tasks.filter(t => !t.completed);

    renderTasks();

}



// EVENTOS

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const text = input.value.trim();

    if (!text) return;

    addTask(text);

    input.value = "";

});



searchInput.addEventListener("input", function () {

    searchText = searchInput.value;

    renderTasks();

});



filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        currentFilter = button.dataset.filter;

        renderTasks();

    });

});



completeAllBtn.addEventListener("click", completeAllTasks);

clearCompletedBtn.addEventListener("click", clearCompletedTasks);



// DARK MODE

function loadTheme() {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        html.classList.add("dark");
    }

}


function toggleTheme() {

    html.classList.toggle("dark");

    const isDark = html.classList.contains("dark");

    localStorage.setItem("theme", isDark ? "dark" : "light");

}


themeToggle.addEventListener("click", toggleTheme);



// INICIALIZAR APP

loadTasks();

loadTheme();

renderTasks();