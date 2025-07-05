const Todo = require('../models/todo'); // Add this import!
const fs = require('fs'); // Adding filesystem support for backup functionality

class TodoStore {
  constructor() {
    this._todos = new Map(); // Private!
    this._nextId = 1;
  }
  
  add(title) {
    const todo = new Todo(this._nextId++, title);
    this._todos.set(todo.id, todo);
    // Trigger backup after adding new todo to maintain backup consistency
    this.createBackup();
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
    const result = this._todos.delete(id);
    // Trigger backup after successful deletion to maintain backup consistency
    if (result) {
      this.createBackup();
    }
    return result;
  }

  // Adding backup functionality to save todos to backup file with timestamp
  // This method creates a backup of all todos whenever changes occur
  createBackup() {
    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        todos: this.getAll().map(todo => ({
          id: todo.id,
          title: todo.title,
          completed: todo.completed,
          priority: todo.priority
        }))
      };
      
      // Save backup to todos-backup.json in current directory
      // Using synchronous write to ensure backup is completed before continuing
      fs.writeFileSync('todos-backup.json', JSON.stringify(backupData, null, 2));
    } catch (error) {
      // Silently handle backup errors to avoid disrupting main functionality
      // In a production environment, this might log to an error service
      console.warn('Backup creation failed:', error.message);
    }
  }
}

module.exports = TodoStore;