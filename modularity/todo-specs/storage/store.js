const Todo = require('../models/todo'); // Add this import!

class TodoStore {
  constructor() {
    this._todos = new Map(); // Private!
    this._nextId = 1;
  }
  
  add(title) {
    const todo = new Todo(this._nextId++, title);
    this._todos.set(todo.id, todo);
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
    return this._todos.delete(id);
  }
}

module.exports = TodoStore;