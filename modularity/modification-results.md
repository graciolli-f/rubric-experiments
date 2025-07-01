# Modification Results

## Definitions

Modular 
- Component encapsulation: Each component manages its own state and lifecycle
- Event-driven communication: Components communicate through callbacks rather than direct dependencies
- Design System Integration: CSS follows consistent methodology and patterns
- Separation of concerns: Each component handles specific responsibilities

Monolithic 
- Centralized state management: All application state lives in one place with direct manipulation
- Direct function passing: Components receive pre-built functions rather than emitting events
- Computed properties: Data transformations happen inline at render time
- Simple Component Structure: Components are pure presentational functions with minimal logic

Stack:
- Cursor
- Clause-4-Sonnet
- Minimal cursor rules: 
```
- do not make any changes that are not directly related to or necessary for implementing feature or improvement being requested
- do not make UI/UX changes that are not directly necessary for the feature implementation or modification being requested
- do not remove comments from exsiting code
- for every change you make, add a comment within the code explaining the change and the rationale behind the change (why is this change necessary? why is this change safe to make?)
- do not make unecessary improvements to the code
- assume that if a line of code exists, it's necessary and functional
- do look for potential optimizations, but do not automatically implement them
```

## Feature Addition

### Summary: 
Asked LLM to implement real-time search functionality with debouncing state managment. Goal was to see how each would handle state management within their levels of component isolation. 

### Result: 
Both produced working search functionality in one shot with no errors. 

- Modular: 8 files modified, +627/-4 lines, created new SearchBar component
- Monolithic: 1 file modified, +206/-11 lines, inline implementation 

### Impressions:
Feature addition with monolithic was significantly faster and used fewer tokens. Functional parity. 

## Refactoring

### Summary:
Asked LLM to convert the vanilla HTML/CSS/JS codebase to React. 
Prompt: "Convert this blog dashboard to a React application using functional components and hooks. Use proper React patterns for state management, event handling, and component composition. "

### Results: 
- LLM maintained architectural philosophy

**Monolithic → React**
Approach: "Lift and shift" - moved existing functions directly into React components with minimal restructuring.
Pattern:

Global functions → App component methods
HTML sections → Simple presentational components
Direct prop passing preserved original data flow

Result: 
- Clean, straightforward conversion that maintained the original simplicity
- No errors; one-shot functional conversion


**Modular → React**
Approach: "Re-architect" - attempted to preserve complex patterns and add React-specific optimizations.
Pattern:

Class components → Functional components with extensive hooks
Event systems → Callback coordination with circular dependency issues
Added performance patterns (useMemo, useCallback, refs) not in original

Result: 
- Over-engineered conversion that amplified existing complexity and introduced new React-specific complications
- Introduced a bug that required debugging. The debugging was difficult, requiring increasingly specific prompts (5 total) for the LLM to correctly pinpoint and fix the error 

### Impressions:
- Monolithic had faster conversion 
- Monolithic came out ahead in terms of functionality and bugs
- Short term, it seems the LLM handles less complexity more effectively, but long-term, the monolithic codebase architecture would not scale well 


## SUMMARY
*This experiment has obvious limitations and is by no means comprehensive so results should be taken lightly.*  

It is not a given that modularity itself is inherently helpful for LLMs. However, it's difficult to parse whether the LLM struggled with the increased **complexity** that came as a result of modularity, or the modular architecture itself. 

Anectodally, from watching the LLM "rationalize" and plan, it seemed to struggle with maintaining a working "map" of all the separate pieces in the modular codebase. During the React conversion it often introduced bugs to the modular codebase before realizing the errors and providing fixes. The monolithic codebase did not have bugs introduced in the conversion process. 

Since modularity in codebases is generally a better practice, especially when considering scaling and team collaboration, it would be useful to figure out a system that would assist the LLM in better handling of modularity (or more precisely, the increased complexity that comes with a modular codebase).

## FUTURE EXPERIMENTS
- Test different models
- More edits; increasingly complex edits (it's possible that we did not reach a high enough level of complexity to see a positive effect of modularity)
- Start with existing, highly complex codebases
- Test deletions and integrations
