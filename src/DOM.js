import { format, parseISO } from 'date-fns';

export default class DOM {
  constructor(appController) {
    this.app = appController;
    this.projectListEl = document.getElementById('project-list');
    this.todoListEl = document.getElementById('todo-list');
    this.projectTitleEl = document.getElementById('active-project-title');
    
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    document.getElementById('new-project-btn').addEventListener('click', () => {
      const name = prompt('Project Name:');
      if (name) {
        const newProj = this.app.addProject(name);
        this.app.setActiveProject(newProj.id);
        this.render();
      }
    });

    document.getElementById('new-todo-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('title').value;
      const desc = document.getElementById('desc').value;
      const date = document.getElementById('date').value;
      const priority = document.getElementById('priority').value;
      
      this.app.addTodo(title, desc, date, priority, '');
      e.target.reset();
      this.render();
    });
  }

  render() {
    this.renderProjects();
    this.renderTodos();
  }

  renderProjects() {
    this.projectListEl.innerHTML = '';
    this.app.projects.forEach(proj => {
      const li = document.createElement('li');
      li.className = proj.id === this.app.activeProjectId ? 'active' : '';
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';

      const nameSpan = document.createElement('span');
      nameSpan.textContent = proj.name;

      const editBtn = document.createElement('button');
      editBtn.textContent = '✎';
      editBtn.style.border = 'none';
      editBtn.style.background = 'transparent';
      editBtn.style.cursor = 'pointer';

      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const newName = prompt('Rename Project:', proj.name);
        if (newName) {
          this.app.renameProject(proj.id, newName);
          this.render();
        }
      });

      li.appendChild(nameSpan);
      li.appendChild(editBtn);

      li.addEventListener('click', () => {
        this.app.setActiveProject(proj.id);
        this.render();
      });
      
      this.projectListEl.appendChild(li);
    });
  }

  renderTodos() {
    const activeProject = this.app.getActiveProject();
    if (!activeProject) return;
    
    this.projectTitleEl.textContent = activeProject.name;
    this.todoListEl.innerHTML = '';

    activeProject.todos.forEach(todo => {
      const div = document.createElement('div');
      div.className = `todo-item priority-${todo.priority} ${todo.isComplete ? 'completed' : ''}`;
      
      const formattedDate = todo.dueDate ? format(parseISO(todo.dueDate), 'MMM do, yyyy') : 'No Date';

      div.innerHTML = `
        <div class="todo-view">
          <div class="todo-header">
            <input type="checkbox" class="complete-checkbox" ${todo.isComplete ? 'checked' : ''}>
            <strong>${todo.title}</strong>
            <span>${formattedDate}</span>
            <div>
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">X</button>
            </div>
          </div>
          <div class="todo-details" style="display: none;">
            <p>${todo.description || 'No description provided.'}</p>
          </div>
        </div>
        <form class="edit-todo-form" style="display: none; gap: 10px; margin-top: 10px;">
          <input type="text" class="edit-title" value="${todo.title}" required>
          <input type="text" class="edit-desc" value="${todo.description}">
          <input type="date" class="edit-date" value="${todo.dueDate}" required>
          <select class="edit-priority">
            <option value="low" ${todo.priority === 'low' ? 'selected' : ''}>Low</option>
            <option value="medium" ${todo.priority === 'medium' ? 'selected' : ''}>Medium</option>
            <option value="high" ${todo.priority === 'high' ? 'selected' : ''}>High</option>
          </select>
          <button type="submit">Save</button>
          <button type="button" class="cancel-edit-btn">Cancel</button>
        </form>
      `;

      div.querySelector('.complete-checkbox').addEventListener('change', () => {
        this.app.toggleTodoComplete(todo.id);
        this.renderTodos();
      });

      div.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.app.deleteTodo(todo.id);
        this.renderTodos();
      });

      div.querySelector('.todo-header').addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
          const details = div.querySelector('.todo-details');
          details.style.display = details.style.display === 'none' ? 'block' : 'none';
        }
      });

      div.querySelector('.edit-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        div.querySelector('.todo-view').style.display = 'none';
        div.querySelector('.edit-todo-form').style.display = 'flex';
      });

      div.querySelector('.cancel-edit-btn').addEventListener('click', () => {
        div.querySelector('.todo-view').style.display = 'block';
        div.querySelector('.edit-todo-form').style.display = 'none';
      });

      div.querySelector('.edit-todo-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const newTitle = div.querySelector('.edit-title').value;
        const newDesc = div.querySelector('.edit-desc').value;
        const newDate = div.querySelector('.edit-date').value;
        const newPriority = div.querySelector('.edit-priority').value;
        
        this.app.editTodo(todo.id, newTitle, newDesc, newDate, newPriority);
        this.renderTodos();
      });

      this.todoListEl.appendChild(div);
    });
  }
}