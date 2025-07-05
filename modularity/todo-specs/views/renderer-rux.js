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

    // Adding method to render activity log
    // This displays the recent actions performed on todos
    renderActivityLog(activityLog) {
      console.log('\n=== ACTIVITY LOG ===');
      const recentActions = activityLog.getRecentActions();
      
      if (recentActions.length === 0) {
        console.log('No recent activity');
        return;
      }
      
      // Display each action using the pre-formatted display text
      // This shows the actions in chronological order (most recent first)
      recentActions.forEach(action => {
        console.log(action.displayText);
      });
    }

    // Adding method to render complete view with todos, statistics, and activity log
    // This provides the full comprehensive view requested in the feature requirements
    renderComplete(todos, statistics, activityLog) {
      this.render(todos);
      this.renderStatistics(statistics);
      this.renderActivityLog(activityLog);
    }
  }
  module.exports = ConsoleRenderer;