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

    // Adding method to render activity log showing recent actions
    // This method displays the last 5 actions with timestamps and todo information
    renderActivityLog(activities) {
      console.log('\n=== ACTIVITY LOG ===');
      if (activities.length === 0) {
        console.log('No recent activities.');
        return;
      }
      
      activities.forEach(activity => {
        // Format timestamp to show time in HH:MM AM/PM format
        const timeString = activity.timestamp.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
        console.log(`[${timeString}] ${activity.action}: "${activity.todoTitle}"`);
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