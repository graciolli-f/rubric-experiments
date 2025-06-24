import React, { useState } from 'react';
import SearchableSelect from './SearchableSelect';

/**
 * Example usage of SearchableSelect component
 * Demonstrates various configurations and data structures
 */

// Sample user data matching the HTML demo structure
const userOptions = [
  {
    value: 'alice',
    label: 'Alice Johnson',
    description: 'alice@company.com',
    avatar: 'AJ',
    avatarColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    value: 'bob',
    label: 'Bob Smith',
    description: 'bob@company.com',
    avatar: 'BS',
    avatarColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    value: 'carol',
    label: 'Carol Davis',
    description: 'carol@company.com',
    avatar: 'CD',
    avatarColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    value: 'david',
    label: 'David Wilson',
    description: 'david@company.com',
    avatar: 'DW',
    avatarColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
];

// Sample project data without avatars
const projectOptions = [
  {
    value: 'website-redesign',
    label: 'Website Redesign',
    description: 'Complete overhaul of company website'
  },
  {
    value: 'mobile-app',
    label: 'Mobile App Development',
    description: 'iOS and Android application'
  },
  {
    value: 'api-integration',
    label: 'API Integration',
    description: 'Third-party service integration'
  },
  {
    value: 'database-migration',
    label: 'Database Migration',
    description: 'Move to cloud infrastructure'
  }
];

const SearchableSelectExample = () => {
  // State for different select instances
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedUserWithValidation, setSelectedUserWithValidation] = useState('');
  
  // Validation state
  const [showValidationError, setShowValidationError] = useState(false);

  // Handle user selection
  const handleUserSelect = (option) => {
    setSelectedUser(option?.value || '');
    console.log('Selected user:', option);
  };

  // Handle project selection
  const handleProjectSelect = (option) => {
    setSelectedProject(option?.value || '');
    console.log('Selected project:', option);
  };

  // Handle user selection with validation
  const handleValidatedUserSelect = (option) => {
    setSelectedUserWithValidation(option?.value || '');
    setShowValidationError(false); // Clear error when user selects
    console.log('Selected user (validated):', option);
  };

  // Trigger validation
  const validateForm = () => {
    if (!selectedUserWithValidation) {
      setShowValidationError(true);
    } else {
      setShowValidationError(false);
      alert('Form is valid!');
    }
  };

  // Custom search handler (optional)
  const handleSearch = (query, filteredOptions) => {
    console.log(`Searching for: "${query}", found ${filteredOptions.length} results`);
  };

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1>SearchableSelect Component Examples</h1>
      
      <div style={{ marginBottom: '3rem' }}>
        <h2>Basic User Selection</h2>
        <p>Select a user to assign a task. Includes rich content with avatars and descriptions.</p>
        
        <SearchableSelect
          name="assignee"
          label="Assign to User"
          placeholder="Search users..."
          searchPlaceholder="Type to search users..."
          helpText="Search and select a user to assign this task"
          options={userOptions}
          value={selectedUser}
          onChange={handleUserSelect}
          onSearch={handleSearch}
          testId="select-users"
        />
        
        {selectedUser && (
          <p style={{ marginTop: '1rem', color: '#666' }}>
            Selected: {userOptions.find(u => u.value === selectedUser)?.label}
          </p>
        )}
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2>Project Selection (No Avatars)</h2>
        <p>Simple text-based options without avatar content.</p>
        
        <SearchableSelect
          name="project"
          label="Select Project"
          placeholder="Choose a project..."
          searchPlaceholder="Search projects..."
          helpText="Select the project this task belongs to"
          options={projectOptions}
          value={selectedProject}
          onChange={handleProjectSelect}
          testId="select-projects"
        />
        
        {selectedProject && (
          <p style={{ marginTop: '1rem', color: '#666' }}>
            Selected: {projectOptions.find(p => p.value === selectedProject)?.label}
          </p>
        )}
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2>Required Field with Validation</h2>
        <p>Demonstrates form validation and error states.</p>
        
        <SearchableSelect
          name="required-user"
          label="Assignee"
          placeholder="Select user..."
          searchPlaceholder="Search for user..."
          helpText="This field is required"
          options={userOptions}
          value={selectedUserWithValidation}
          onChange={handleValidatedUserSelect}
          required
          invalid={showValidationError}
          errorMessage={showValidationError ? "Please select a user" : undefined}
          testId="select-required-user"
        />
        
        <button 
          onClick={validateForm}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          Validate Form
        </button>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2>Disabled State</h2>
        <p>Shows how the component behaves when disabled.</p>
        
        <SearchableSelect
          name="disabled-select"
          label="Disabled Select"
          placeholder="Cannot interact..."
          options={userOptions}
          value=""
          onChange={() => {}}
          disabled
          helpText="This select is disabled"
          testId="select-disabled"
        />
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2>Current Selection Values</h2>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '1rem', 
          borderRadius: '0.375rem',
          fontSize: '0.875rem'
        }}>
          {JSON.stringify({
            selectedUser,
            selectedProject,
            selectedUserWithValidation,
            showValidationError
          }, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2>Accessibility Features</h2>
        <ul style={{ lineHeight: '1.6' }}>
          <li><strong>Keyboard Navigation:</strong> Use Arrow keys to navigate, Enter to select, Escape to close</li>
          <li><strong>Screen Reader Support:</strong> Proper ARIA attributes and announcements</li>
          <li><strong>Focus Management:</strong> Focus moves to search input when opened, returns to trigger when closed</li>
          <li><strong>Search:</strong> Real-time filtering as you type</li>
          <li><strong>Form Integration:</strong> Hidden input updates automatically for form submission</li>
        </ul>
      </div>
    </div>
  );
};

export default SearchableSelectExample; 