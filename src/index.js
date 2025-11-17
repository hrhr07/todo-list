import "./styles.css";
import { format } from "date-fns";

const projectSection = document.getElementById("projects");
const btnAddProject = document.getElementById("addProject");
const projectList = document.getElementById("project-list");

const taskSection = document.getElementById("tasks");
const projectTitle = document.getElementById("currentProject");

const btnBack = document.getElementById("backbtn");
const addTask = document.getElementById("addTask");

const taskList = document.getElementById("task-list");

const favDialog = document.getElementById("favDialog");
const btnConfirm = document.getElementById("confirmBtn");

const taskForm = document.getElementById("taskForm");

class Task {
  constructor(title, description, rawDate, priority) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;

    this.rawDate = rawDate;

    this.dueDate = format(new Date(rawDate), "dd/MM/yyyy");
    this.priority = priority;
  }
}

class Project {
  constructor(name) {
    this.name = name;
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push(task);
  }
}

let projects = [];
let selectedProjectIndex = null;

const stored = JSON.parse(localStorage.getItem("projects"));

if (stored) {
  projects = stored.map((p) => {
    const project = new Project(p.name);

    project.tasks = p.tasks.map((t) => {
      if (t.rawDate) {
        return new Task(t.title, t.description, t.rawDate, t.priority);
      }

      if (t.dueDate && t.dueDate.includes("/")) {
        const [day, month, year] = t.dueDate.split("/");
        const isoDate = `${year}-${month}-${day}`; // YYYY-MM-DD

        return new Task(t.title, t.description, isoDate, t.priority);
      }

      const today = new Date().toISOString().split("T")[0];
      return new Task(t.title, t.description, today, t.priority);
    });

    return project;
  });
}

function renderProjects() {
  projectList.innerHTML = "";
  projects.forEach((project, index) => {
    const btn = document.createElement("button");
    btn.className = "project-card";
    btn.textContent = project.name;
    btn.addEventListener("click", () => showTasksView(index));
    projectList.appendChild(btn);
  });
}

function renderTasks() {
  taskList.innerHTML = "";
  const project = projects[selectedProjectIndex];
  projectTitle.textContent = `Project: ${project.name}`;

  project.tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <p>Due: ${task.dueDate}</p>
      <p>Priority: ${task.priority}</p>
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;
    taskList.appendChild(li);
  });
}

function showProjectsView() {
  selectedProjectIndex = null;
  projectSection.style.display = "block";
  taskSection.style.display = "none";
  renderProjects();
}

function showTasksView(index) {
  selectedProjectIndex = index;
  projectSection.style.display = "none";
  taskSection.style.display = "block";
  renderTasks();
}

btnAddProject.addEventListener("click", () => {
  const name = prompt("Project Name:");
  if (!name) return;
  const project = new Project(name);
  projects.push(project);
  saveToLocalStorage();
  renderProjects();
});

addTask.addEventListener("click", () => {
  if (selectedProjectIndex === null) {
    alert("Select a project first");
  } else {
    favDialog.showModal();
  }
});

btnConfirm.addEventListener("click", (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const rawDate = document.getElementById("date").value; // YYYY-MM-DD
  const priority = document.getElementById("priority").value;

  const task = new Task(title, description, rawDate, priority);

  projects[selectedProjectIndex].addTask(task);
  saveToLocalStorage();
  renderTasks();

  favDialog.close();
  taskForm.reset();
});

taskList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const index = event.target.dataset.index;
    projects[selectedProjectIndex].tasks.splice(index, 1);
    saveToLocalStorage();
    renderTasks();
  }
});

btnBack.addEventListener("click", showProjectsView);

function saveToLocalStorage() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

if (projects.length === 0) {
  projects.push(new Project("Default"));
  saveToLocalStorage();
}

renderProjects();
