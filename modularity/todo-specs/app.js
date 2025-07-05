const TodoStore = require('./storage/store');
const ConsoleRenderer = require('./views/renderer-rux');
const ActivityLogger = require('./tracking/activity-logger');

class TodoApp {
  constructor() {
    this.store = new TodoStore();
    this.renderer = new ConsoleRenderer();
    // Adding ActivityLogger to track recent actions
    // This enables activity logging functionality for the todo application
    this.activityLogger = new ActivityLogger();
  }
  
  run() {
    // Simple demo with activity logging
    // Adding todos and logging each addition action
    const todo1 = this.store.add('Write paper');
    this.activityLogger.logAction('Added', todo1);
    
    const todo2 = this.store.add('Run experiments');
    this.activityLogger.logAction('Added', todo2);
    
    // Adding a completed todo to demonstrate statistics functionality
    // This shows how the completion percentage changes with completed todos
    const completedTodo = this.store.add('Review literature');
    this.activityLogger.logAction('Added', completedTodo);
    
    // Mark as completed and log the toggle action
    // This demonstrates activity tracking for state changes
    completedTodo.toggle();
    this.activityLogger.logAction('Toggled', completedTodo);
    
    // Getting all todos, statistics, and recent activity for display
    // This demonstrates the complete functionality including activity tracking
    const todos = this.store.getAll();
    const statistics = this.store.getStatistics();
    const activities = this.activityLogger.getRecentActivity();
    
    // Rendering todos with statistics and activity log using the new complete display method
    // This provides users with todo list, completion tracking, and recent activity history
    this.renderer.renderComplete(todos, statistics, activities);
  }
}

// Run the app if this file is executed directly
if (require.main === module) {
  new TodoApp().run();
}

module.exports = TodoApp;