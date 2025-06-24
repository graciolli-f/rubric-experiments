import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * SearchableSelect Component
 * 
 * A comprehensive searchable select component following select.rux specifications
 * with full accessibility support, keyboard navigation, and progressive enhancement.
 * 
 * Features:
 * - Native select fallback for accessibility
 * - ARIA compliant with proper roles and attributes
 * - Keyboard navigation (Arrow keys, Enter, Escape, etc.)
 * - Search functionality with debouncing
 * - Rich option content support (avatars, descriptions)
 * - Focus management and screen reader announcements
 * - Form integration with hidden input
 */
const SearchableSelect = ({
  name,
  id,
  label,
  placeholder = "Search options...",
  searchPlaceholder = "Type to search...",
  noResultsText = "No options found",
  helpText,
  required = false,
  disabled = false,
  invalid = false,
  errorMessage,
  options = [],
  value,
  onChange,
  onSearch,
  searchDebounceMs = 300,
  className = '',
  testId,
  ...props
}) => {
  // Generate unique IDs for accessibility
  const baseId = id || `searchable-select-${Math.random().toString(36).substr(2, 9)}`;
  const triggerId = `${baseId}-trigger`;
  const dropdownId = `${baseId}-dropdown`;
  const searchId = `${baseId}-search`;
  const helpId = helpText ? `${baseId}-help` : undefined;
  const errorId = errorMessage ? `${baseId}-error` : undefined;

  // Component state following spec requirements
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1);
  const [selectedOption, setSelectedOption] = useState(
    options.find(opt => opt.value === value) || null
  );

  // Refs for DOM manipulation and focus management
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Filter options based on search query with debouncing as per spec
  const filterOptions = useCallback((query) => {
    if (!query.trim()) {
      setFilteredOptions(options);
      return;
    }

    // Case-insensitive fuzzy matching as required by spec
    const normalizedQuery = query.toLowerCase().trim();
    const filtered = options.filter(option => {
      const searchText = `${option.label} ${option.description || ''}`.toLowerCase();
      return searchText.includes(normalizedQuery);
    });

    setFilteredOptions(filtered);
    setFocusedOptionIndex(-1); // Reset focus when filtering

    // Call external search handler if provided
    if (onSearch) {
      onSearch(query, filtered);
    }
  }, [options, onSearch]);

  // Debounced search handler as required by spec
  const handleSearch = useCallback((query) => {
    // Clear previous timeout for debouncing
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounced search implementation
    searchTimeoutRef.current = setTimeout(() => {
      filterOptions(query);
    }, searchDebounceMs);
  }, [filterOptions, searchDebounceMs]);

  // Update filtered options when options change
  useEffect(() => {
    filterOptions(searchQuery);
  }, [options, filterOptions, searchQuery]);

  // Update selected option when value prop changes
  useEffect(() => {
    const newSelected = options.find(opt => opt.value === value) || null;
    setSelectedOption(newSelected);
  }, [value, options]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Open dropdown with proper focus management
  const openDropdown = useCallback(() => {
    if (disabled) return;
    
    setIsOpen(true);
    
    // Focus search input when dropdown opens as per spec
    setTimeout(() => {
      if (searchRef.current) {
        searchRef.current.focus();
      }
    }, 100);
  }, [disabled]);

  // Close dropdown with focus return as required by spec
  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
    setFilteredOptions(options);
    setFocusedOptionIndex(-1);
    
    // Return focus to trigger as per accessibility spec
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [options]);

  // Toggle dropdown state
  const toggleDropdown = useCallback(() => {
    isOpen ? closeDropdown() : openDropdown();
  }, [isOpen, openDropdown, closeDropdown]);

  // Select option and update state
  const selectOption = useCallback((option) => {
    setSelectedOption(option);
    closeDropdown();
    
    // Call onChange callback for form integration
    if (onChange) {
      onChange(option);
    }
  }, [onChange, closeDropdown]);

  // Keyboard navigation handler implementing comprehensive spec requirements
  const handleKeyDown = useCallback((e) => {
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
        
      default:
        // Type-ahead functionality as per spec
        if (e.key.length === 1 && isOpen) {
          const char = e.key.toLowerCase();
          const startIndex = focusedOptionIndex >= 0 ? focusedOptionIndex + 1 : 0;
          
          for (let i = 0; i < filteredOptions.length; i++) {
            const index = (startIndex + i) % filteredOptions.length;
            const option = filteredOptions[index];
            if (option.label.toLowerCase().startsWith(char)) {
              setFocusedOptionIndex(index);
              break;
            }
          }
        }
        break;
    }
  }, [isOpen, focusedOptionIndex, filteredOptions, openDropdown, closeDropdown, selectOption]);

  // Handle search input changes
  const handleSearchChange = useCallback((e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  }, [handleSearch]);

  // Clear search input
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    filterOptions('');
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, [filterOptions]);

  // Handle clicks outside component to close dropdown
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
  }, [isOpen, closeDropdown]);

  // Generate ARIA describedby attribute
  const ariaDescribedBy = [helpId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div 
      className={`select select--searchable ${invalid ? 'select--invalid' : ''} ${disabled ? 'select--disabled' : ''} ${className}`}
      data-testid={testId}
    >
      {/* Native select fallback for accessibility and progressive enhancement */}
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

      {/* Custom select trigger button with comprehensive ARIA attributes */}
      <button
        ref={triggerRef}
        type="button"
        className="select__trigger"
        id={triggerId}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={dropdownId}
        aria-describedby={ariaDescribedBy}
        aria-invalid={invalid}
        disabled={disabled}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        data-testid="select-trigger"
        {...props}
      >
        <span className={`select__value ${!selectedOption ? 'select__value--placeholder' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        {/* Search icon for searchable select */}
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
            id={searchId}
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

        {/* Options container with rich content support */}
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
              {/* Rich option content with avatar support */}
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

        {/* No results state with proper ARIA live region */}
        {filteredOptions.length === 0 && searchQuery && (
          <div 
            className="select__no-results" 
            role="status" 
            aria-live="polite"
          >
            {noResultsText}
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

      {/* Help text with proper association */}
      {helpText && (
        <div id={helpId} className="select__help">
          {helpText}
        </div>
      )}

      {/* Error message with proper ARIA live region */}
      {errorMessage && (
        <div id={errorId} className="select__error" role="alert" aria-live="polite">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

// PropTypes for type checking (optional but recommended)
SearchableSelect.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  noResultsText: PropTypes.string,
  helpText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  invalid: PropTypes.bool,
  errorMessage: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
    avatar: PropTypes.string,
    avatarColor: PropTypes.string
  })).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  searchDebounceMs: PropTypes.number,
  className: PropTypes.string,
  testId: PropTypes.string
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
  },
  // ... more options
];

function MyComponent() {
  const [selectedUser, setSelectedUser] = useState('');

  const handleUserSelect = (option) => {
    setSelectedUser(option?.value || '');
    console.log('Selected user:', option);
  };

  return (
    <SearchableSelect
      name="assignee"
      label="Assign to User"
      placeholder="Search users..."
      searchPlaceholder="Type to search users..."
      helpText="Search and select a user to assign this task"
      options={userOptions}
      value={selectedUser}
      onChange={handleUserSelect}
      required
      testId="select-users"
    />
  );
}
*/ 