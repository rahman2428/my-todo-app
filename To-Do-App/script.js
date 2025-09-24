const STORAGE_KEY = 'simple-todo-v1';
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let filter = 'all';

const form = document.getElementById('todo-form');
const input = document.getElementById('new-todo');
const list = document.getElementById('todo-list');
const filterButtons = Array.from(document.querySelectorAll('.filter'));
const clearBtn = document.getElementById('clear-completed');
const countEl = document.getElementById('count');

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function updateCount() {
  const active = todos.filter(t => !t.completed).length;
  countEl.textContent = `${active} item${active !== 1 ? 's' : ''} left`;
}

function render() {
  list.innerHTML = '';
  const shown = todos.filter(t =>
    filter === 'all' ? true : (filter === 'active' ? !t.completed : t.completed)
  );
  shown.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => {
      todo.completed = checkbox.checked;
      save(); render();
    });

    const text = document.createElement('span');
    text.className = 'todo-text';
    if (todo.completed) text.classList.add('completed');
    text.textContent = todo.text;
    // double-click to edit
    text.addEventListener('dblclick', () => startEdit(todo, li, text));

    const editBtn = document.createElement('button');
    editBtn.className = 'btn edit';
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => startEdit(todo, li, text));

    const delBtn = document.createElement('button');
    delBtn.className = 'btn delete';
    delBtn.type = 'button';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => {
      todos = todos.filter(t => t.id !== todo.id);
      save(); render();
    });

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    list.appendChild(li);
  });

  updateCount();
}

function startEdit(todo, li, textEl) {
  const inputEdit = document.createElement('input');
  inputEdit.className = 'edit-input';
  inputEdit.value = todo.text;
  // Replace text element with input
  li.replaceChild(inputEdit, textEl);
  inputEdit.focus();
  inputEdit.select();

  function finish() {
    const val = inputEdit.value.trim();
    if (val) {
      todo.text = val;
      save();
    }
    render();
  }

  inputEdit.addEventListener('blur', finish);
  inputEdit.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') inputEdit.blur();
    if (e.key === 'Escape') render();
  });
}

/* add todo */
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const txt = input.value.trim();
  if (!txt) return;
  const todo = { id: Date.now().toString() + Math.random().toString(36).slice(2), text: txt, completed: false };
  todos.push(todo);
  save();
  input.value = '';
  render();
});

/* filters */
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.getAttribute('data-filter');
    render();
  });
});

/* clear completed */
clearBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.completed);
  save(); render();
});

/* initial render */
render();
