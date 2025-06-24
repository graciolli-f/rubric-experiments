import React, { useState, useEffect, useRef } from 'react';

/**
 * SearchableSelect Component - Following select.rux specifications
 * 
 * Features:
 * - Native select fallback for accessibility  
 * - ARIA compliant with proper roles and attributes
 * - Keyboard navigation support
 * - Search functionality with filtering
 * - Rich option content (avatars, descriptions)
 * - Form integration with hidden input
 */
const SearchableSelect = ({
  name,
  id,
  label,
  placeholder = "Search options...", 
  searchPlaceholder = "Type to search...",
  helpText,
  options = [],
  value,
  onChange,
  className = '',
  testId,
  required = false,
  disabled = false,
  ...props
}) => {
  // Generate unique IDs for accessibility
  const baseId = id || `searchable-select-${Math.random().toString(36).substr(2, 9)}`;
  const triggerId = `${baseId}-trigger`;
  const dropdownId = `${baseId}-dropdown`;
  const helpId = helpText ? `${baseId}-help` : undefined;

  // Component state
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1);

  // Refs for DOM manipulation and focus management
  const triggerRef = useRef(null);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Find selected option
  const selectedOption = options.find(opt => opt.value === value);

  // Filter options based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredOptions(options);
      return;
    }

    const normalizedQuery = searchQuery.toLowerCase().trim();
    const filtered = options.filter(option => {
      const searchText = `${option.label} ${option.description || ''}`.toLowerCase();
      return searchText.includes(normalizedQuery);
    });

    setFilteredOptions(filtered);
    setFocusedOptionIndex(-1);
  }, [searchQuery, options]);

  // Open dropdown with focus management
  const openDropdown = () => {
    if (disabled) return;
    setIsOpen(true);
    // Focus search input when dropdown opens
    setTimeout(() => {
      if (searchRef.current) {
        searchRef.current.focus();
      }
    }, 100);
  };

  // Close dropdown with focus return
  const closeDropdown = () => {
    setIsOpen(false);
    setSearchQuery('');
    setFilteredOptions(options);
    setFocusedOptionIndex(-1);
    // Return focus to trigger
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  };

  // Toggle dropdown state
  const toggleDropdown = () => {
    isOpen ? closeDropdown() : openDropdown();
  };

  // Select option and update state
  const selectOption = (option) => {
    closeDropdown();
    if (onChange) {
      onChange(option);
    }
  };

  // Keyboard navigation handler
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          openDropdown();
        } else if (focusedOptionIndex >= 0) {
          selectOption(filteredOptions[focusedOptionIndex]);
        }
        break;
        
      case 'Escape':
        if (isOpen) {
          e.preventDefault();
          closeDropdown();
        }
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          openDropdown();
        } else {
          const nextIndex = focusedOptionIndex < filteredOptions.length - 1 
            ? focusedOptionIndex + 1 
            : 0;
          setFocusedOptionIndex(nextIndex);
        }
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          const prevIndex = focusedOptionIndex > 0 
            ? focusedOptionIndex - 1 
            : filteredOptions.length - 1;
          setFocusedOptionIndex(prevIndex);
        }
        break;
        
      case 'Home':
        if (isOpen) {
          e.preventDefault();
          setFocusedOptionIndex(0);
        }
        break;
        
      case 'End':
        if (isOpen) {
          e.preventDefault();
          setFocusedOptionIndex(filteredOptions.length - 1);
        }
        break;
    }
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear search input
  const clearSearch = () => {
    setSearchQuery('');
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  // Handle clicks outside component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          triggerRef.current && !triggerRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div 
      className={`select select--searchable ${className}`}
      data-testid={testId}
    >
      {/* Native select fallback for accessibility */}
      <select 
        className="select__native sr-only" 
        name={name}
        id={`${baseId}-native`}
        required={required}
        disabled={disabled}
        value={selectedOption?.value || ''}
        onChange={() => {}} // Controlled by custom component
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Label with proper association */}
      <label htmlFor={triggerId} className="select__label">
        {label}
        {required && <span className="required" aria-label="required">*</span>}
      </label>

      {/* Custom select trigger button */}
      <button
        ref={triggerRef}
        type="button"
        className="select__trigger"
        id={triggerId}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={dropdownId}
        aria-describedby={helpId}
        disabled={disabled}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        data-testid="select-trigger"
        {...props}
      >
        <span className={`select__value ${!selectedOption ? 'select__value--placeholder' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        {/* Search icon */}
        <svg className="select__arrow" aria-hidden="true" width="20" height="20" viewBox="0 0 20 20">
          <path 
            fill="currentColor" 
            fillRule="evenodd" 
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown with search functionality */}
      <div
        ref={dropdownRef}
        className="select__dropdown"
        id={dropdownId}
        role="listbox"
        aria-hidden={!isOpen}
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        {/* Search input with clear button */}
        <div className="select__search-wrapper">
          <input
            ref={searchRef}
            type="text"
            className="select__search"
            placeholder={searchPlaceholder}
            aria-label="Search options"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            data-testid="select-search"
          />
          
          {searchQuery && (
            <button
              type="button"
              className="select__search-clear"
              aria-label="Clear search"
              onClick={clearSearch}
            >
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 20 20">
                <path 
                  fill="currentColor" 
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Options container */}
        <div className="select__options" role="group" aria-label="Options">
          {filteredOptions.map((option, index) => (
            <div
              key={option.value}
              className={`select__option ${
                focusedOptionIndex === index ? 'select__option--focused' : ''
              } ${
                selectedOption?.value === option.value ? 'select__option--selected' : ''
              }`}
              role="option"
              aria-selected={selectedOption?.value === option.value}
              data-value={option.value}
              onClick={() => selectOption(option)}
              onMouseEnter={() => setFocusedOptionIndex(index)}
            >
              {/* Avatar support */}
              {option.avatar && (
                <div 
                  className="select__option-avatar"
                  style={{
                    background: option.avatarColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    marginRight: 'var(--space-sm)'
                  }}
                >
                  {option.avatar}
                </div>
              )}
              
              <div className="select__option-content">
                <div className="select__option-name">{option.label}</div>
                {option.description && (
                  <div className="select__option-email">{option.description}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No results state */}
        {filteredOptions.length === 0 && searchQuery && (
          <div 
            className="select__no-results" 
            role="status" 
            aria-live="polite"
          >
            No options found matching your search
          </div>
        )}
      </div>

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={name}
        className="select__input"
        value={selectedOption?.value || ''}
      />

      {/* Help text */}
      {helpText && (
        <div id={helpId} className="select__help">
          {helpText}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;

// Example usage:
/*
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
  }
];

function App() {
  const [selectedUser, setSelectedUser] = useState('');

  return (
    <SearchableSelect
      name="assignee"
      label="Assign to User"
      placeholder="Search users..."
      searchPlaceholder="Type to search users..."
      helpText="Search and select a user to assign this task"
      options={userOptions}
      value={selectedUser}
      onChange={(option) => setSelectedUser(option?.value || '')}
      required
      testId="select-users"
    />
  );
}
*/ 