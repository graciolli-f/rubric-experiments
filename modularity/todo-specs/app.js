const TodoStore = require('./storage/store');
const ConsoleRenderer = require('./views/renderer-rux');

class TodoApp {
  constructor() {
    this.store = new TodoStore();
    this.renderer = new ConsoleRenderer();
  }
  
  run() {
    // Simple demo
    this.store.add('Write paper');
    this.store.add('Run experiments');
    
    // Adding a completed todo to demonstrate statistics functionality
    // This shows how the completion percentage changes with completed todos
    const completedTodo = this.store.add('Review literature');
    
    // Using the store's toggle method instead of directly calling todo.toggle()
    // This ensures the activity log captures the toggle action properly
    this.store.toggle(completedTodo.id);
    
    // Add another todo and then delete it to demonstrate activity logging
    // This showcases the different types of actions that are tracked
    const tempTodo = this.store.add('Temporary task');
    this.store.delete(tempTodo.id);
    
    // Getting all todos, statistics, and activity log for display
    // This demonstrates the new activity logging functionality
    const todos = this.store.getAll();
    const statistics = this.store.getStatistics();
    const activityLog = this.store.getActivityLog();
    
    // Rendering complete view with todos, statistics, and activity log
    // This provides users with comprehensive view including recent activity
    this.renderer.renderComplete(todos, statistics, activityLog);
  }
}

// Run the app if this file is executed directly
if (require.main === module) {
  new TodoApp().run();
}

module.exports = TodoApp;