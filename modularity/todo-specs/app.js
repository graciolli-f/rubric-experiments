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
    
    // Adding a completed todo to demonstrate statistics functionality
    // This shows how the completion percentage changes with completed todos
    const completedTodo = this.store.add('Review literature');
    completedTodo.toggle(); // Mark as completed
    
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