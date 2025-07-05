const Todo = require('../models/todo'); // Add this import!

class TodoStore {
  constructor() {
    this._todos = new Map(); // Private!
    this._nextId = 1;
    // Adding activity log to track the last 5 actions
    // This array will store action objects with type, todo title, and timestamp
    this._activityLog = [];
  }
  
  // Adding private method to log activities
  // This method manages the activity log by adding new entries and maintaining the 5-item limit
  _logActivity(actionType, todoTitle) {
    const activity = {
      type: actionType,
      todoTitle: todoTitle,
      timestamp: new Date()
    };
    
    // Add new activity to the beginning of the array
    this._activityLog.unshift(activity);
    
    // Keep only the last 5 activities
    if (this._activityLog.length > 5) {
      this._activityLog.pop();
    }
  }
  
  // Adding public method to get the activity log
  // This method returns a copy of the activity log for rendering
  getActivityLog() {
    return [...this._activityLog];
  }
  
  add(title) {
    const todo = new Todo(this._nextId++, title);
    this._todos.set(todo.id, todo);
    
    // Log the add activity with the todo title
    this._logActivity('Added', title);
    
    return todo;
  }
  
  get(id) {
    return this._todos.get(id);
  }
  
  getAll() {
    return Array.from(this._todos.values());
  }

  // Adding method to get total count of todos
  // This method returns the total number of todos in the store
  getTotalCount() {
    return this._todos.size;
  }

  // Adding method to get count of completed todos
  // This method counts only todos where completed is true
  getCompletedCount() {
    return Array.from(this._todos.values()).filter(todo => todo.completed).length;
  }

  // Adding method to calculate completion percentage
  // This method returns the percentage of completed todos (0-100)
  getCompletionPercentage() {
    const total = this.getTotalCount();
    if (total === 0) {
      // Return 0% when no todos exist to avoid division by zero
      return 0;
    }
    const completed = this.getCompletedCount();
    // Calculate percentage and round to 1 decimal place for cleaner display
    return Math.round((completed / total) * 100 * 10) / 10;
  }

  // Adding method to get all statistics in one call
  // This method returns an object with all statistics for efficient access
  getStatistics() {
    const total = this.getTotalCount();
    const completed = this.getCompletedCount();
    const percentage = this.getCompletionPercentage();
    
    return {
      total,
      completed,
      percentage
    };
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
    // Get the todo before deleting to log its title
    const todo = this._todos.get(id);
    const deleted = this._todos.delete(id);
    
    // Log the delete activity if the todo was found and deleted
    if (deleted && todo) {
      this._logActivity('Deleted', todo.title);
    }
    
    return deleted;
  }
  
  // Adding toggle method to handle toggling with activity logging
  // This method toggles a todo by ID and logs the activity
  toggle(id) {
    const todo = this._todos.get(id);
    if (todo) {
      todo.toggle();
      // Log the toggle activity with the todo title
      this._logActivity('Toggled', todo.title);
      return true;
    }
    return false;
  }
}

module.exports = TodoStore;