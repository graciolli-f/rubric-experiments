const Todo = require('../models/todo'); // Add this import!

class TodoStore {
  constructor() {
    this._todos = new Map(); // Private!
    this._nextId = 1;
    // Adding activity log to track last 5 actions with timestamps
    // This enables users to see recent changes to their todos
    this._activityLog = [];
  }
  
  // Method to add activity to the log
  // This method maintains a maximum of 5 activities and adds timestamps
  _addActivity(action, todoTitle) {
    const timestamp = new Date();
    const timeString = timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const activity = {
      action,
      todoTitle,
      timestamp: timeString
    };
    
    // Add to beginning of array to maintain chronological order (newest first)
    this._activityLog.unshift(activity);
    
    // Keep only the last 5 activities
    // This prevents memory growth and maintains focus on recent activities
    if (this._activityLog.length > 5) {
      this._activityLog.pop();
    }
  }
  
  // Method to get the activity log
  // This allows external access to the activity history for display
  getActivityLog() {
    return [...this._activityLog]; // Return a copy to prevent external modification
  }
  
  add(title) {
    const todo = new Todo(this._nextId++, title);
    this._todos.set(todo.id, todo);
    // Track the add action in the activity log
    this._addActivity('Added', title);
    return todo;
  }
  
  get(id) {
    return this._todos.get(id);
  }
  
  getAll() {
    return Array.from(this._todos.values());
  }
  
  // Adding dynamic filtering capability to support filtering todos by any field
  // This method allows flexible filtering by field name and value with optional exact matching
  filter(fieldName, value, exactMatch = true) {
    if (!fieldName) {
      throw new Error('Field name is required for filtering');
    }
    
    return Array.from(this._todos.values()).filter(todo => {
      // Check if the field exists on the todo object
      // This validation ensures we only filter on valid todo properties
      if (!(fieldName in todo)) {
        return false;
      }
      
      const fieldValue = todo[fieldName];
      
      if (exactMatch) {
        // Exact matching for precise filtering (useful for boolean, numeric, or exact string matches)
        return fieldValue === value;
      } else {
        // Partial matching for flexible text search (case-insensitive substring matching)
        // This is particularly useful for searching within title fields
        return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
      }
    });
  }
  
  delete(id) {
    const todo = this._todos.get(id);
    if (todo) {
      // Track the delete action in the activity log before deletion
      this._addActivity('Deleted', todo.title);
    }
    return this._todos.delete(id);
  }

  // Method to handle toggle operations and track them
  // This method provides a central way to toggle todos and record the activity
  toggle(id) {
    const todo = this._todos.get(id);
    if (todo) {
      todo.toggle();
      // Track the toggle action in the activity log
      this._addActivity('Toggled', todo.title);
      return true;
    }
    return false;
  }

  // Adding statistics methods to track todo completion metrics
  // These methods provide insights into overall progress and productivity
  getStatistics() {
    const allTodos = this.getAll();
    const totalTodos = allTodos.length;
    // Count completed todos by filtering for completed=true
    const completedTodos = allTodos.filter(todo => todo.completed).length;
    
    // Calculate completion percentage, handling edge case of no todos
    // This prevents division by zero and provides meaningful statistics
    const completionPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
    
    return {
      totalTodos,
      completedTodos,
      completionPercentage
    };
  }

  // Helper method to get total count of todos
  // This method provides a quick way to get total count without full statistics
  getTotalCount() {
    return this._todos.size;
  }

  // Helper method to get count of completed todos
  // This method allows quick access to completed todo count for specific use cases
  getCompletedCount() {
    return this.getAll().filter(todo => todo.completed).length;
  }
}

module.exports = TodoStore;