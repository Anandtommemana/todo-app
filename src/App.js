import Project from './Project.js';
import Todo from './Todo.js';
import Storage from './Storage.js';

export default class AppController {
  constructor() {
    this.projects = Storage.load() || [new Project('default', 'Default Project')];
    this.activeProjectId = this.projects[0].id;
  }

  save() {
    Storage.save(this.projects);
  }

  addProject(name) {
    const project = new Project(null, name);
    this.projects.push(project);
    this.save();
    return project;
  }

  renameProject(projectId, newName) {
    const project = this.projects.find(p => p.id === projectId);
    if (project && newName) {
      project.name = newName;
      this.save();
    }
  }

  getActiveProject() {
    return this.projects.find(p => p.id === this.activeProjectId);
  }

  setActiveProject(id) {
    this.activeProjectId = id;
  }

  addTodo(title, desc, date, priority, notes) {
    const todo = new Todo(null, title, desc, date, priority, notes);
    this.getActiveProject().addTodo(todo);
    this.save();
  }

  deleteTodo(todoId) {
    this.getActiveProject().deleteTodo(todoId);
    this.save();
  }

  toggleTodoComplete(todoId) {
    const todo = this.getActiveProject().getTodo(todoId);
    if (todo) {
      todo.toggleComplete();
      this.save();
    }
  }

  editTodo(todoId, title, desc, date, priority) {
    const todo = this.getActiveProject().getTodo(todoId);
    if (todo) {
      todo.update(title, desc, date, priority);
      this.save();
    }
  }
}