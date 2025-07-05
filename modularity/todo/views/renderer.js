class ConsoleRenderer {
    // Enhanced render method to display todos with completion statistics and activity log
    // This provides users with immediate visibility into their progress, productivity, and recent activity
    render(todos, statistics = null, activityLog = null) {
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
      
      // Display activity log if provided
      // This shows users their recent actions and helps track their productivity
      if (activityLog && activityLog.length > 0) {
        console.log('\n=== ACTIVITY LOG ===');
        activityLog.forEach(activity => {
          console.log(`[${activity.timestamp}] ${activity.action}: "${activity.todoTitle}"`);
        });
      }
    }
  }
  module.exports = ConsoleRenderer;