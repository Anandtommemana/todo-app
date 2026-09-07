export default class Todo {
  constructor(id, title, description, dueDate, priority, notes = '') {
    this.id = id || Date.now().toString();
    this.title = title;
    this.description = description;
    this.dueDate = dueDate; 
    this.priority = priority; // 'low', 'medium', 'high'
    this.notes = notes;
    this.isComplete = false;
  }

  toggleComplete() {
    this.isComplete = !this.isComplete;
  }

  update(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
  }
}