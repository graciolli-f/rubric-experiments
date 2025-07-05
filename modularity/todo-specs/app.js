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
    
    // Adding a completed todo to demonstrate statistics and activity tracking functionality
    // This shows how the completion percentage changes and how activities are logged
    const completedTodoId = this.store.add('Review literature').id;
    this.store.toggle(completedTodoId); // Mark as completed using store's toggle method for activity tracking
    
    // Getting all todos, statistics, and activities for display
    // This demonstrates the new comprehensive functionality including activity tracking
    const todos = this.store.getAll();
    const statistics = this.store.getStatistics();
    const activities = this.store.getActivities();
    
    // Rendering todos with statistics and activity log using the new complete display method
    // This provides users with todos, completion tracking, and recent activity history
    this.renderer.renderComplete(todos, statistics, activities);
  }
}

// Run the app if this file is executed directly
if (require.main === module) {
  new TodoApp().run();
}

module.exports = TodoApp;