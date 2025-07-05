const fs = require('fs');
const path = require('path');

class TodoBackup {
  constructor() {
    // Setting backup path to 'todos-backup.json' in current directory
    // This path is configurable via the private _backupPath property
    this._backupPath = 'todos-backup.json';
  }
  
  // Public method to save backup of todos with timestamp
  // This method creates a backup file with current todos and metadata
  saveBackup(todos) {
    try {
      // Creating backup data structure with timestamp and todos
      // The timestamp helps track when the backup was created
      const backupData = {
        timestamp: new Date().toISOString(),
        backup_created: new Date().toLocaleString(),
        todos: todos.map(todo => ({
          id: todo.id,
          title: todo.title,
          completed: todo.completed,
          priority: todo.priority
        })),
        total_count: todos.length,
        completed_count: todos.filter(todo => todo.completed).length
      };
      
      // Writing backup data to JSON file synchronously
      // Using JSON.stringify with indentation for readable file format
      fs.writeFileSync(this._backupPath, JSON.stringify(backupData, null, 2));
      
    } catch (error) {
      // Catching and re-throwing filesystem errors with context
      // This allows calling code to handle backup failures appropriately
      throw new Error(`Failed to save backup: ${error.message}`);
    }
  }
  
  // Public method to get the backup file path
  // This method returns the current backup file path for external reference
  getBackupPath() {
    return this._backupPath;
  }
}

module.exports = TodoBackup; 