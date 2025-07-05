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

