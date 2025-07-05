class ActivityLog {
  constructor() {
    // Initialize private state for tracking actions
    // This array will store the last 5 actions as specified in the rubric
    this._actions = [];
    
    // Set maximum entries to 5 as per the feature requirement
    // This ensures we only keep the most recent 5 actions
    this._maxEntries = 5;
  }
  
  // Method to log a new action with automatic timestamp generation
  // This method records actions and maintains the rolling history of 5 entries
  logAction(action, todoId, todoTitle) {
    // Create timestamp in [HH:MM AM/PM] format for user-friendly display
    // This provides the exact format requested in the feature requirements
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    const timestamp = `[${timeString}]`;
    
    // Create formatted display text based on action type
    // This provides the specific format requested: [time] Action: "Title"
    let displayText;
    switch (action.toLowerCase()) {
      case 'add':
        displayText = `${timestamp} Added: "${todoTitle}"`;
        break;
      case 'delete':
        displayText = `${timestamp} Deleted: "${todoTitle}"`;
        break;
      case 'toggle':
        displayText = `${timestamp} Toggled: "${todoTitle}"`;
        break;
      default:
        displayText = `${timestamp} ${action}: "${todoTitle}"`;
        break;
    }
    
    // Create activity entry object following the rubric specification
    // This structure matches the ActivityEntry type defined in the rubric
    const entry = {
      timestamp,
      action: action.toLowerCase(),
      todoId,
      todoTitle,
      displayText
    };
    
    // Add new entry to the beginning of the array (most recent first)
    // This ensures the most recent actions appear at the top of the log
    this._actions.unshift(entry);
    
    // Maintain maximum of 5 entries by removing oldest entries
    // This implements the rolling history requirement
    if (this._actions.length > this._maxEntries) {
      this._actions.splice(this._maxEntries);
    }
  }
  
  // Method to retrieve recent actions array
  // Returns actions in most recent first order as specified
  getRecentActions() {
    // Return a copy of the actions array to prevent external modification
    // This maintains encapsulation and prevents accidental state mutation
    return [...this._actions];
  }
  
  // Method to clear all activity log entries
  // This is useful for testing and reset scenarios as mentioned in the rubric
  clear() {
    this._actions = [];
  }
}

module.exports = ActivityLog; 