class Todo {
    constructor(id, title, completed = false, priority = 'medium') {
      if (!title || title.trim() === '') {
        throw new Error('Title is required');
      }
      
      // Validate priority field - must be 'low', 'medium', or 'high'
      // This validation ensures data integrity and prevents invalid priority values
      const validPriorities = ['low', 'medium', 'high'];
      if (!validPriorities.includes(priority)) {
        throw new Error(`Priority must be one of: ${validPriorities.join(', ')}. Received: ${priority}`);
      }
      
      this.id = id;
      this.title = title;
      this.completed = completed;
      // Adding priority field to store the validated priority value
      this.priority = priority;
    }
    
    toggle() {
      this.completed = !this.completed;
    }
  }
  
  module.exports = Todo;