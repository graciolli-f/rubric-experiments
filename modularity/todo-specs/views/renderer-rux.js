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

    // Adding method to render the activity log
    // This method displays the last 5 activities with formatted timestamps
    renderActivityLog(activityLog) {
      console.log('\n=== ACTIVITY LOG ===');
      
      if (activityLog.length === 0) {
        console.log('No recent activities');
        return;
      }
      
      activityLog.forEach(activity => {
        // Format timestamp to show time in HH:MM AM/PM format
        const time = activity.timestamp.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        });
        
        console.log(`[${time}] ${activity.type}: "${activity.todoTitle}"`);
      });
    }

    // Adding method to render todos, statistics, and activity log together
    // This method provides a comprehensive view with todos, statistics, and recent activity
    renderWithStatisticsAndActivity(todos, statistics, activityLog) {
      this.render(todos);
      this.renderStatistics(statistics);
      this.renderActivityLog(activityLog);
    }
  }
  module.exports = ConsoleRenderer;