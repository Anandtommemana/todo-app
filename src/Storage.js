import Project from './Project.js';
import Todo from './Todo.js';

export default class Storage {
  static save(projects) {
    localStorage.setItem('todoApp', JSON.stringify(projects));
  }

  static load() {
    const data = localStorage.getItem('todoApp');
    if (!data) return null;

    const parsed = JSON.parse(data);
    return parsed.map(pData => {
      const project = new Project(pData.id, pData.name);
      project.todos = pData.todos.map(tData => {
        const todo = new Todo(
          tData.id, tData.title, tData.description, 
          tData.dueDate, tData.priority, tData.notes
        );
        todo.isComplete = tData.isComplete;
        return todo;
      });
      return project;
    });
  }
}