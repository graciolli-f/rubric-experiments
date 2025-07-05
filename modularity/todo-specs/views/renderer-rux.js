class ConsoleRenderer {
    render(todos) {
      console.log('\n=== TODOS ===');
      todos.forEach(todo => {
        const status = todo.completed ? '[✓]' : '[ ]';
        console.log(`${status} ${todo.id}: ${todo.title}`);
      });
    }

    // Adding method to render completion statistics
    // This method displays total todos, completed todos, and completion percentage
    renderStatistics(statistics) {
      console.log('\n=== COMPLETION STATISTICS ===');
      console.log(`Total todos: ${statistics.total}`);
      console.log(`Completed todos: ${statistics.completed}`);
      console.log(`Completion percentage: ${statistics.percentage}%`);
    }

    // Adding method to render both todos and statistics together
    // This method provides a comprehensive view of todos with their statistics
    renderWithStatistics(todos, statistics) {
      this.render(todos);
      this.renderStatistics(statistics);
    }
  }
  module.exports = ConsoleRenderer;