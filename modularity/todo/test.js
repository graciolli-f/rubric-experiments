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

console.log('Testing Activity Log Feature...\n');

const store3 = new TodoStore();
const renderer2 = new ConsoleRenderer();

// Add 6 todos to test the 5-action limit
// This verifies that only the last 5 actions are kept in the activity log
store3.add('Task 1');
store3.add('Task 2');
store3.add('Task 3');
store3.add('Task 4');
store3.add('Task 5');
store3.add('Task 6'); // This should push the first action out of the log

// Toggle and delete some todos to test different action types
store3.toggle(2);
store3.delete(1);

// Display the results
const statistics = store3.getStatistics();
const activityLog = store3.getActivityLog();

console.log('Final state after all operations:');
renderer2.render(store3.getAll(), statistics, activityLog);

console.log('\n--- Test Summary ---');
console.log(`Activity log contains ${activityLog.length} actions (should be 5 max)`);
console.log('Actions should show newest first and include Add, Toggle, and Delete operations');