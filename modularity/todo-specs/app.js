const TodoStore = require('./storage/store');
const ConsoleRenderer = require('./views/renderer');
const TodoBackup = require('./storage/backup');

class TodoApp {
  constructor() {
    this.store = new TodoStore();
    this.renderer = new ConsoleRenderer();
    // Adding backup instance to handle automatic todo backups
    // This will save todos to JSON file whenever they are modified
    this.backup = new TodoBackup();
  }
  
  // Adding wrapper method for adding todos with automatic backup
  // This ensures backup is created every time a todo is added
  addTodo(title) {
    const todo = this.store.add(title);
    // Saving backup after adding todo to ensure data persistence
    this.backup.saveBackup(this.store.getAll());
    return todo;
  }
  
  // Adding wrapper method for deleting todos with automatic backup
  // This ensures backup is created every time a todo is deleted
  deleteTodo(id) {
    const deleted = this.store.delete(id);
    if (deleted) {
      // Saving backup after successful deletion to maintain data consistency
      this.backup.saveBackup(this.store.getAll());
    }
    return deleted;
  }
  
  // Adding wrapper method for toggling todos with automatic backup
  // This ensures backup is created every time a todo's completion status changes
  toggleTodo(id) {
    const todo = this.store.get(id);
    if (todo) {
      todo.toggle();
      // Saving backup after toggling todo to preserve completion state changes
      this.backup.saveBackup(this.store.getAll());
      return true;
    }
    return false;
  }
  
  run() {
    // Simple demo using the new wrapper methods that include backup functionality
    this.addTodo('Write paper');
    this.addTodo('Run experiments');
    
    // Adding a completed todo to demonstrate statistics functionality
    // This shows how the completion percentage changes with completed todos
    const completedTodo = this.addTodo('Review literature');
    // Using the wrapper method that includes backup functionality
    this.toggleTodo(completedTodo.id); // Mark as completed
    
    // Getting all todos and statistics for display
    // This demonstrates the new statistics functionality
    const todos = this.store.getAll();
    const statistics = this.store.getStatistics();
    
    // Rendering todos with statistics using the new comprehensive display method
    // This provides users with both todo list and completion tracking
    this.renderer.renderWithStatistics(todos, statistics);
  }
}

// Run the app if this file is executed directly
if (require.main === module) {
  new TodoApp().run();
}

module.exports = TodoApp;