// test.js - Just run with node test.js
const Todo = require('./models/todo');
const TodoStore = require('./storage/store');
const ConsoleRenderer = require('./views/renderer');

console.log('Running tests...');

// Test 1: Todo validation
try {
 new Todo(1, ''); // Should throw
 console.log('❌ Test 1 failed');
} catch {
 console.log('✅ Test 1 passed');
}

// Test 2: Store operations
const store = new TodoStore();
const todo = store.add('Test');
console.log(store.get(todo.id) ? '✅ Test 2 passed' : '❌ Test 2 failed');

// Test 3: Todo toggle functionality
const todo2 = new Todo(2, 'Test toggle', false);
todo2.toggle();
console.log(todo2.completed === true ? '✅ Test 3 passed' : '❌ Test 3 failed');

// Test 4: Store delete operation
const store2 = new TodoStore();
const todo3 = store2.add('To delete');
const id = todo3.id;
store2.delete(id);
console.log(store2.get(id) === undefined ? '✅ Test 4 passed' : '❌ Test 4 failed');

// Test 5: Renderer doesn't crash with empty/multiple todos
try {
 const renderer = new ConsoleRenderer();
 renderer.render([]); // Empty array
 renderer.render(store.getAll()); // Multiple todos
 console.log('✅ Test 5 passed');
} catch (e) {
 console.log('❌ Test 5 failed:', e.message);
}

console.log('\nTests complete!');