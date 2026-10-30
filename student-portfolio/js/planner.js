// planner.js - Academic Planner: add, complete, delete, filter tasks (saved in localStorage)

const STORAGE_KEY = "academicPlannerTasks";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const taskError = document.getElementById("taskError");
const taskListEl = document.getElementById("taskList");
const totalEl = document.getElementById("totalCount");
const doneEl = document.getElementById("doneCount");
const pendingEl = document.getElementById("pendingCount");
const overdueEl = document.getElementById("overdueCount");
const progressBar = document.getElementById("progressBar");
const clearDoneBtn = document.getElementById("clearDone");
const filterChips = document.querySelectorAll(".chip");

// Array of task objects: { id, text, due, completed }
let tasks = loadTasks();
let filter = "all";

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

function todayISO() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + m + "-" + day;
}

function isOverdue(task) {
  return !task.completed && task.due && task.due < todayISO();
}

function addTask(text, due) {
  tasks.push({ id: Date.now(), text: text, due: due, completed: false });
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
  tasks = tasks.filter(function (t) { return t.id !== id; });
  saveTasks();
  renderTasks();
}

function updateStats() {
  const done = tasks.filter(function (t) { return t.completed; }).length;
  totalEl.textContent = tasks.length;
  doneEl.textContent = done;
  pendingEl.textContent = tasks.length - done;
  overdueEl.textContent = tasks.filter(isOverdue).length;
  progressBar.style.width = (tasks.length ? Math.round((done / tasks.length) * 100) : 0) + "%";
  clearDoneBtn.disabled = done === 0;
}

function visibleTasks() {
  return tasks
    .filter(function (t) {
      if (filter === "pending") return !t.completed;
      if (filter === "done") return t.completed;
      return true;
    })
    .sort(function (a, b) {
      // Earliest due date first; tasks without a date go last
      if (!a.due && !b.due) return 0;
      if (!a.due) return 1;
      if (!b.due) return -1;
      return a.due.localeCompare(b.due);
    });
}

function renderTasks() {
  taskListEl.innerHTML = "";
  const list = visibleTasks();

  if (list.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-msg";
    empty.textContent = tasks.length === 0
      ? "No tasks yet. Add your first task above."
      : "Nothing in this view. Try another filter.";
    taskListEl.appendChild(empty);
    updateStats();
    return;
  }

  list.forEach(function (task) {
    const li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "") + (isOverdue(task) ? " overdue" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark \"" + task.text + "\" as completed");
    checkbox.addEventListener("change", function () { toggleTask(task.id); });

    const info = document.createElement("div");
    info.className = "task-text";
    const title = document.createElement("div");
    title.className = "task-title";
    title.textContent = task.text; // textContent prevents HTML injection
    info.appendChild(title);
    if (task.due) {
      const date = document.createElement("div");
      date.className = "task-date";
      date.textContent = (isOverdue(task) ? "Overdue: " : "Due: ") + task.due;
      info.appendChild(date);
    }

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.type = "button";
    del.textContent = "Delete";
    del.setAttribute("aria-label", "Delete \"" + task.text + "\"");
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
    taskError.textContent = "Enter a task description before adding.";
    taskInput.classList.add("invalid");
    taskInput.focus();
    return;
  }

  taskError.textContent = "";
  taskInput.classList.remove("invalid");
  addTask(text, dateInput.value);
  taskForm.reset();
  taskInput.focus();
});

filterChips.forEach(function (chip) {
  chip.addEventListener("click", function () {
    filter = chip.dataset.filter;
    filterChips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip); });
    renderTasks();
  });
});

clearDoneBtn.addEventListener("click", function () {
  tasks = tasks.filter(function (t) { return !t.completed; });
  saveTasks();
  renderTasks();
});

renderTasks();
