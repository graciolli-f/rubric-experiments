## Rubric Syntax Guide

*Modularity Principles to Follow*
When designing solutions, evaluate your architecture against these principles:
- **Single Responsibility**: Can you describe each module's purpose in one sentence?
- **Low Coupling**: If you delete a module, how many others break?
- **High Cohesion**: Do all parts of a module work toward the same goal?
- **Dependency Direction**: Do dependencies flow in one direction (high-level → low-level)?

Before integrating modules, ask: "Is module A orchestrating module B, or are they truly independent collaborators?"

*Important: How Rubric should be used*
Rubric files (.rux extensions) are strict, immutable constraints to follow. They are not guidelines to be altered. You do not have the power to alter these constraints, and should never modify rux files. Instead, craft your solution to work within the bounds of the constraints specified.

*When constraints cannot be satisfied within existing modules*, create new modules with their own .rux specifications rather than overloading existing modules with additional responsibilities. Each module should maintain a single, clear purpose as defined in its .rux file.

### dependency-map.json

Use this file to map the architectural structure of the existing code base. Follow its patterns and rules. Update the "modules" based on your changes. Do not update the "rules." 

### How to Read Rubric Specifications

```rubric
public methodName(param: type) -> ReturnType   # Public method
private _variableName: Type                     # Private state
deny category.*                                 # Forbidden operations
@ "Natural language explanation"                # AI guidance
```

### Type Notation
- `string`, `number`, `boolean` - Basic types
- `Todo` - Custom types
- `Type?` - Nullable (can be null)
- `Type[]` - Array
- `Map<K,V>` - Key-value map

### Example Module Spec
```rubric
module TodoStore {
  @ "Manages todo storage"
  
  interface {
    public add(title: string) -> Todo
    public get(id: number) -> Todo?
    public getAll() -> Todo[]
  }
  
  state {
    private _todos: Map<number, Todo>
    private _nextId: number
  }
  
  constraints {
    deny io.console.*    @ "No console.log in storage"
    deny io.network.*    @ "No network calls"
  }
}
```

### What This Means
- **interface**: Methods other modules can call
- **state**: Private data only this module can access
- **constraints**: Operations this module cannot perform
- **@**: Natural language hints for clarity