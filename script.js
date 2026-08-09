const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const dateLabel = document.getElementById("date-label");

const today = new Date().toISOString().slice(0, 10);
const storageKey = `daily-tasks-${today}`;

dateLabel.textContent = `Tasks for ${today}`;

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function renderTasks() {
  const tasks = loadTasks();
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const item = document.createElement("li");

    const text = document.createElement("span");
    text.className = `task-text${task.completed ? " completed" : ""}`;
    text.textContent = task.text;

    const actions = document.createElement("div");
    actions.className = "actions";

    const completeButton = document.createElement("button");
    completeButton.className = "complete-btn";
    completeButton.textContent = task.completed ? "Undo" : "Done";
    completeButton.addEventListener("click", () => {
      const updated = loadTasks();
      updated[index].completed = !updated[index].completed;
      saveTasks(updated);
      renderTasks();
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      const updated = loadTasks();
      updated.splice(index, 1);
      saveTasks(updated);
      renderTasks();
    });

    actions.append(completeButton, deleteButton);
    item.append(text, actions);
    list.append(item);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) {
    return;
  }

  const tasks = loadTasks();
  tasks.push({ text, completed: false });
  saveTasks(tasks);
  input.value = "";
  input.focus();
  renderTasks();
});

renderTasks();
