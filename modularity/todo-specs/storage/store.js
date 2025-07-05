const Todo = require('../models/todo'); // Add this import!
const ActivityLog = require('./activity-log'); // Import ActivityLog for tracking actions

class TodoStore {
  constructor() {
    this._todos = new Map(); // Private!
    this._nextId = 1;
    
    // Initialize activity log to track todo actions
    // This enables the activity logging feature as specified in the requirements
    this._activityLog = new ActivityLog();
  }
  
  add(title) {
    const todo = new Todo(this._nextId++, title);
    this._todos.set(todo.id, todo);
    
    // Log the add action to the activity log
    // This tracks when todos are added for the activity logging feature
    this._activityLog.logAction('add', todo.id, todo.title);
    
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
    // Get the todo before deletion to log its title
    // This is necessary because we need the title for the activity log
    const todo = this._todos.get(id);
    const deleted = this._todos.delete(id);
    
    // Log the delete action if the todo existed and was successfully deleted
    // This tracks when todos are deleted for the activity logging feature
    if (deleted && todo) {
      this._activityLog.logAction('delete', id, todo.title);
    }
    
    return deleted;
  }
  
  // Adding toggle method to TodoStore to track toggle actions
  // This method ensures the activity log captures when todos are toggled
  toggle(id) {
    const todo = this._todos.get(id);
    if (todo) {
      todo.toggle();
      // Log the toggle action after the todo is toggled
      // This tracks when todos are toggled for the activity logging feature
      this._activityLog.logAction('toggle', id, todo.title);
      return true;
    }
    return false;
  }
  
  // Adding method to get the activity log instance
  // This allows other modules to access recent actions for display
  getActivityLog() {
    return this._activityLog;
  }
}

module.exports = TodoStore;