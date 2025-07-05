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
    // Using store.toggle() instead of directly calling todo.toggle() to ensure activity logging
    // This ensures all toggle actions are tracked in the activity log
    this.store.toggle(completedTodo.id);
    
    // Getting all todos, statistics, and activity log for display
    // This demonstrates the new activity log functionality alongside existing features
    const todos = this.store.getAll();
    const statistics = this.store.getStatistics();
    const activityLog = this.store.getActivityLog();
    
    // Rendering todos with statistics and activity log using the new comprehensive display method
    // This provides users with todos, completion tracking, and recent activity history
    this.renderer.renderWithStatisticsAndActivity(todos, statistics, activityLog);
  }
}

// Run the app if this file is executed directly
if (require.main === module) {
  new TodoApp().run();
}

module.exports = TodoApp;