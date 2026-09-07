export default class Project {
  constructor(id, name) {
    this.id = id || Date.now().toString();
    this.name = name;
    this.todos = [];
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  deleteTodo(todoId) {
    this.todos = this.todos.filter(t => t.id !== todoId);
  }

  getTodo(todoId) {
    return this.todos.find(t => t.id === todoId);
  }
}