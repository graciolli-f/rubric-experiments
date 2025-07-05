class ConsoleRenderer {
    // Enhanced render method to display todos with completion statistics
    // This provides users with immediate visibility into their progress and productivity
    render(todos, statistics = null) {
      console.log('\n=== TODOS ===');
      todos.forEach(todo => {
        const status = todo.completed ? '[✓]' : '[ ]';
        console.log(`${status} ${todo.id}: ${todo.title}`);
      });
      
      // Display statistics if provided
      // This gives users a quick overview of their completion progress
      if (statistics) {
        console.log('\n=== STATISTICS ===');
        console.log(`Total Todos: ${statistics.totalTodos}`);
        console.log(`Completed Todos: ${statistics.completedTodos}`);
        console.log(`Completion Percentage: ${statistics.completionPercentage}%`);
      }
    }
  }
  module.exports = ConsoleRenderer;