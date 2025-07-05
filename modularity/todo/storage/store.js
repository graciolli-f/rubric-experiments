const Todo = require('../models/todo'); // Add this import!
const fs = require('fs'); // Adding fs module for file operations to support backup functionality
const path = require('path'); // Adding path module for file path operations

class TodoStore {
  constructor() {
    this._todos = new Map(); // Private!
    this._nextId = 1;
  }
  
  // Private method to create backup file with timestamp
  // This method handles the automatic backup creation whenever todos are modified
  _createBackup() {
    try {
      const backupData = {
        timestamp: new Date().toISOString(), // Adding timestamp to track when backup was created
        todos: this.getAll() // Including all current todos in the backup
      };
      
      const backupPath = path.join(process.cwd(), 'todos-backup.json');
      // Writing backup file synchronously to ensure data is saved before method returns
      // This ensures backup is created immediately after todo operations
      fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
    } catch (error) {
      // Logging backup errors without throwing to prevent disrupting main todo operations
      // This ensures that backup failures don't break the core todo functionality
      console.error('Failed to create backup:', error.message);
    }
  }
  
  add(title) {
    const todo = new Todo(this._nextId++, title);
    this._todos.set(todo.id, todo);
    // Creating backup automatically after adding a new todo
    // This ensures backup is updated whenever the todo list changes
    this._createBackup();
    return todo;
  }
  
  get(id) {
    return this._todos.get(id);
  }
  
  getAll() {
    return Array.from(this._todos.values());
  }
  
  // Adding toggle method to TodoStore to centralize backup logic
  // This method handles both toggling the todo and creating backup automatically
  toggle(id) {
    const todo = this.get(id);
    if (todo) {
      todo.toggle();
      // Creating backup automatically after toggling todo completion status
      // This ensures backup reflects the current state after status changes
      this._createBackup();
      return todo;
    }
    return null;
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
    const deleted = this._todos.delete(id);
    // Creating backup automatically after deleting a todo
    // This ensures backup is updated whenever todos are removed
    if (deleted) {
      this._createBackup();
    }
    return deleted;
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