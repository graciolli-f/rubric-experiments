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
    // Using store.toggle() instead of todo.toggle() to ensure backup is created
    // This ensures backup functionality works correctly when todos are toggled
    this.store.toggle(1); // Mark first todo as completed
    
    // Get statistics and render todos with completion metrics
    // This provides users with immediate feedback on their progress
    const statistics = this.store.getStatistics();
    this.renderer.render(this.store.getAll(), statistics);
  }
}

// Run the app if this file is executed directly
if (require.main === module) {
  new TodoApp().run();
}

module.exports = TodoApp;