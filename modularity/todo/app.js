const TodoStore = require('./storage/store');
const ConsoleRenderer = require('./views/renderer');

class TodoApp {
  constructor() {
    this.store = new TodoStore();
    this.renderer = new ConsoleRenderer();
  }
  
  run() {
    // Simple demo
    this.store.add('Write paper');
    this.store.add('Run experiments');
    
    // Enhanced demo: mark one todo as completed to demonstrate statistics
    // This shows how completion statistics change based on todo status
    // Using store's toggle method to ensure activity is tracked
    this.store.toggle(1);
    
    // Get statistics and activity log, then render todos with all information
    // This provides users with immediate feedback on their progress and recent activity
    const statistics = this.store.getStatistics();
    const activityLog = this.store.getActivityLog();
    this.renderer.render(this.store.getAll(), statistics, activityLog);
  }
}

// Run the app if this file is executed directly
if (require.main === module) {
  new TodoApp().run();
}

module.exports = TodoApp;