// planner.js - Academic Planner: add, complete, delete tasks (saved in localStorage)

const STORAGE_KEY = "academicPlannerTasks";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const taskError = document.getElementById("taskError");
const taskListEl = document.getElementById("taskList");
const totalEl = document.getElementById("totalCount");
const doneEl = document.getElementById("doneCount");
const pendingEl = document.getElementById("pendingCount");

// Array of task objects: { id, text, due, completed }
let tasks = loadTasks();

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (e) {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    /* storage unavailable - tasks just won't persist */
  }
}

function addTask(text, due) {
  tasks.push({
    id: Date.now(),
    text: text,
    due: due,
    completed: false,
  });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(function (t) {
    return t.id === id ? { ...t, completed: !t.completed } : t;
  });
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(function (t) {
    return t.id !== id;
  });
  saveTasks();
  renderTasks();
}

function updateStats() {
  const done = tasks.filter(function (t) { return t.completed; }).length;
  totalEl.textContent = tasks.length;
  doneEl.textContent = done;
  pendingEl.textContent = tasks.length - done;
}

function renderTasks() {
  taskListEl.innerHTML = "";

  if (tasks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-msg";
    empty.textContent = "No tasks yet. Add your first academic task above!";
    taskListEl.appendChild(empty);
    updateStats();
    return;
  }

  tasks.forEach(function (task) {
    const li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task as completed");
    checkbox.addEventListener("change", function () { toggleTask(task.id); });

    const info = document.createElement("div");
    info.className = "task-text";
    const title = document.createElement("div");
    title.textContent = task.text; // textContent prevents HTML injection
    info.appendChild(title);
    if (task.due) {
      const date = document.createElement("div");
      date.className = "task-date";
      date.textContent = "Due: " + task.due;
      info.appendChild(date);
    }

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.type = "button";
    del.textContent = "Delete";
    del.addEventListener("click", function () { deleteTask(task.id); });

    li.appendChild(checkbox);
    li.appendChild(info);
    li.appendChild(del);
    taskListEl.appendChild(li);
  });

  updateStats();
}

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const text = taskInput.value.trim();

  if (text === "") {
    taskError.textContent = "Please enter a task before adding.";
    taskInput.classList.add("invalid");
    return;
  }

  taskError.textContent = "";
  taskInput.classList.remove("invalid");
  addTask(text, dateInput.value);
  taskForm.reset();
  taskInput.focus();
});

renderTasks();
