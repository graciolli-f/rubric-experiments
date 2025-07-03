# Modularity Experiment Results

## Summary
Tested LLM's ability to maintain modularity when making code changes. Found consistent pattern: **LLMs default to system-wide modifications** unless explicitly constrained.

## Codebase used

Simple modular todo app (~100 LOC) with clear module boundaries.

**Key characteristics**: 
- Each module has single responsibility
- Store uses private members (`_todos`, `_nextId`)
- Clean interfaces between modules

```
txt
todo-app/
├── models/
│   └── todo.js          # Todo class with validation
├── storage/
│   └── store.js         # TodoStore with CRUD operations (private _todos Map)
├── views/
│   └── renderer.js      # ConsoleRenderer for display
├── app.js               # Main controller coordinating modules
└── test.js              # Simple test suite
```

## Experiments Conducted

### 1. Intra-module Edit: Add Priority Validation
**Prompt**: "Add priority field validation to the Todo model"
- **Result**: ✅ Success - Modified only todo.js
- **Note**: Simple, well-bounded change handled correctly

### 2. Intra-module Edit: Dynamic Filtering
**Prompt**: "Make the store support filtering todos by any field dynamically"

| Attempt | Instruction | Files Modified | Key Issues |
|---------|-------------|----------------|------------|
| 1 | Basic prompt | 5 (store, app, renderer, test, results.md) | - Created complex query DSL with 12+ operators<br>- Modified renderer to show priority<br>- Turned app.js into test showcase |
| 2 | + "respect modularity" | 4 | - Reduced but still added tests<br>- Still modified renderer |
| 3 | + "only implement requested" | 1 ✅ | - Clean, focused implementation |

### 3. Feature Request: Statistics
**Prompt**: "Add functionality to get statistics about todos"
- **Focus**: Request functionality only to see if it can properly implement modularly
- **Result**: ❌ Added to TodoStore instead of creating separate module
- **Files Modified**: 4 (store, app, renderer, test)
- **Critical Issue**: Modified `add()` method signature (breaking change!)

### 4. Module Request: Stats Module
**Prompt**: "Add a new stats module that counts todos by status"
- **Focus**: Request implementation (vs functionality)
- **Result**: Mixed
 - ✅ Created proper stats/stats.js module
 - ❌ Violated encapsulation in integration:
   ```javascript
   // Accessed private store members:
   this.store._nextId++
   this.store._todos.set(...)
   ```

## Key Findings

1. **Scope Creep is Default**: Simple requests become system-wide changes
2. **Instruction Sensitivity**: Explicit constraints reduce scope (5→4→1 files)
3. **Pattern Mimicry**: Can create modular structure but violates principles
4. **Breaking Changes**: Makes unsafe modifications (changing method signatures)

## Evidence Strength
- **Quantifiable**: File counts, line changes, specific violations
- **Reproducible**: Clear progression with different prompts
- **Critical**: Private member access shows fundamental misunderstanding

## Next Steps
- Write up results emphasizing architectural blindness
- Discuss "understanding principles vs. pattern matching"
- Address the confound of working within Cursor (vs raw LLM call)
- Highlight implications for production code