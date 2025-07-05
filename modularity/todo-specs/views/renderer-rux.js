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

    // Adding method to render activity log
    // This method displays recent todo actions after the statistics
    renderActivityLog(activities) {
      console.log('\n=== ACTIVITY LOG ===');
      if (activities.length === 0) {
        console.log('No recent activity');
        return;
      }
      
      // Display activities in chronological order (most recent first)
      // This shows users what actions were taken and when
      activities.forEach(activity => {
        console.log(`${activity.formattedTime} ${activity.action}: "${activity.todoTitle}"`);
      });
    }

    // Adding method to render both todos and statistics together
    // This method provides a comprehensive view of todos with their statistics
    renderWithStatistics(todos, statistics) {
      this.render(todos);
      this.renderStatistics(statistics);
    }

    // Adding method to render todos, statistics, and activity log together
    // This method provides the complete view including recent activity tracking
    renderComplete(todos, statistics, activities) {
      this.render(todos);
      this.renderStatistics(statistics);
      this.renderActivityLog(activities);
    }
  }
  module.exports = ConsoleRenderer;