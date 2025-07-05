## Rubric Syntax Guide

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