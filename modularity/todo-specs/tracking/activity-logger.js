const Todo = require('../models/todo');

class ActivityLogger {
  constructor() {
    // Initialize private state for tracking activities
    // This stores the last 5 activities as specified in the requirements
    this._activities = [];
    this._maxActivities = 5; // Limit to 5 activities as per requirements
  }
  
  // Method to log an action with todo details and timestamp
  // This method records actions like "Added", "Deleted", "Toggled" with context
  logAction(action, todo, timestamp = new Date()) {
    // Create activity object with all necessary details for display
    // This captures the action type, todo information, and when it happened
    const activity = {
      action: action,
      todoId: todo.id,
      todoTitle: todo.title,
      timestamp: timestamp,
      // Format timestamp for display as [HH:MM AM/PM] format
      // This provides a readable time format for the activity log
      formattedTime: this._formatTimestamp(timestamp)
    };
    
    // Add new activity to the beginning of the array
    // This ensures most recent activities appear first
    this._activities.unshift(activity);
    
    // Keep only the last 5 activities to maintain the limit
    // This prevents unbounded growth of the activity log
    if (this._activities.length > this._maxActivities) {
      this._activities = this._activities.slice(0, this._maxActivities);
    }
  }
  
  // Method to get recent activities, most recent first
  // This returns the activities in the format needed for display
  getRecentActivity() {
    return this._activities.slice(); // Return copy to prevent external modification
  }
  
  // Method to get the current count of stored activities
  // This provides information about how many activities are currently tracked
  getActivityCount() {
    return this._activities.length;
  }
  
  // Private helper method to format timestamp for display
  // This converts Date objects to readable [HH:MM AM/PM] format
  _formatTimestamp(timestamp) {
    const hours = timestamp.getHours();
    const minutes = timestamp.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12; // Convert to 12-hour format
    const displayMinutes = minutes.toString().padStart(2, '0'); // Ensure 2 digits
    return `[${displayHours}:${displayMinutes} ${ampm}]`;
  }
}

module.exports = ActivityLogger; 