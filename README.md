# AI UI Component Generation: Rubric DSL Experiment

This repository contains an experiment comparing AI-generated components using two different approaches:
1. **Prompt-Only**: Standard natural language prompts without additional guidance
2. **Prompt + Rubric DSL**: Enhanced prompts using rubric specification files

## Experiment Overview

The goal is to evaluate whether providing AI models with structured rubric files (`.rux` format) leads to better component generation compared to relying solely on natural language descriptions.

### Methodology

Both approaches generate the same component: a vanilla HTML/CSS/JavaScript product card with image, description, and button functionality.

#### Approach 1: Prompt-Only
**Prompt Used:**
```
Create a vanilla html/css/js (3 separate files) product card with image, description, and button. Use accessibility, perfomance, and security best practices.
```

#### Approach 2: Prompt + Rubric DSL
**Prompt Used:**
```
Create a vanilla html/css/js (3 separate files) product card with image, description, and button. use /.rubric/*
```

### Rubric DSL Structure

The rubric files define comprehensive specifications for component generation:

- **`base.rux`**: Global specifications covering:
  - Design token usage
  - Accessibility requirements (WCAG AA compliance)
  - Performance optimizations
  - Security best practices
  - Code style conventions
  - Responsive design patterns

- **`system-design.rux`**: System-level specifications including:
  - Component architecture patterns
  - State management approaches
  - Event handling strategies
  - Integration guidelines
  - Testing requirements
  - Documentation standards

- **`card.rux`**: Component-specific specifications including:
  - Structural requirements for card components
  - Product card variant specifications
  - Interactive states and behaviors
  - Creative enhancement suggestions

## Generated Outputs

### File Structure Comparison

**Prompt-Only generates:**
- `index.html`
- `styles.css` 
- `script.js`
- `README.md` (sometimes)

**Prompt + Rubric generates:**
- `index.html` (sometimes named `product_card.html`)
- `styles.css`
- `script.js`
- `tokens.css` (design system tokens)

### Sample Results

The experiment includes 5 iterations of each approach:
- `prompt_only/product_card-1` through `product_card-5`
- `prompt_rubric/product_card-1` through `product_card-5`

# Key Differences Observed

## 1. Code Architecture & Organization

### Prompt-Only Approach:
- Uses descriptive but inconsistent naming (`.product-card`, `.add-to-cart-btn`)
- Hardcoded CSS values (`border-radius: 16px`, `color: #333`)
- Functional, straightforward organization
- 3 focused files per component

### Prompt+Rubric Approach:
- Strict BEM methodology (`.card`, `.card--product`, `.card__media`)
- Comprehensive design token system (`var(--border-radius-lg)`, `var(--color-text-primary)`)
- Systematic, enterprise-level architecture
- 6+ files including design system tokens

## 2. Accessibility Implementation

### Prompt-Only:
- Basic accessibility features with functional comments
- Standard ARIA attributes and semantic HTML
- Practical screen reader support

### Prompt+Rubric:
- More comprehensive accessibility with explicit compliance tracking
- Systematic ARIA implementation with rubric references
- Detailed accessibility documentation in comments
- Examples: `<!-- RUX REQUIRED: meaningful alt text for images -->`

## 3. CSS Approach

### Prompt-Only Example:
```css
.product-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    max-width: 400px;
    width: 100%;
    /* Performance: Use transform for transitions instead of changing layout properties */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    /* Accessibility: Ensure card is focusable and has proper focus indication */
    position: relative;
}
```

### Prompt+Rubric Example:
```css
/* Card component - Required by: card.rux > Card > Structure */
.card {
  /* Required by: base.rux > CodeStyle > CSS > use BEM methodology */
  /* Required by: card.rux > Visual > rounded corners using var(--radius-md) */
  border-radius: var(--border-radius-lg);
  /* Required by: card.rux > Visual > subtle shadow using var(--shadow-sm) */
  box-shadow: var(--shadow-md);
  /* Required by: base.rux > GlobalSpecs > UseDesignTokens > no hardcoded colors */
  background-color: var(--color-background);
  /* Required by: card.rux > Visual > smooth transitions on interaction */
  transition: var(--transition-base);
  overflow: hidden;
  position: relative;
  /* Required by: base.rux > Performance > minimize cumulative layout shift */
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 0 auto;
}

/* Product card variant */
.card--product {
  /* Enhanced styling for product cards */
  border: var(--border-width-thin) solid var(--color-secondary-200);
}
```

## 4. Design System Integration

### Prompt-Only:
- No systematic design tokens
- Component-specific styling solutions
- Direct, readable CSS values

### Prompt+Rubric:
- Comprehensive token system with 200+ design tokens
- Systematic color scales, spacing, typography
- Reusable design foundations across components

## 5. Documentation & Comments

### Prompt-Only:
- Functional comments explaining purpose
- Standard code documentation
- Focus on implementation details

### Prompt+Rubric:
- Compliance tracking comments (`<!-- RUX COMPLIANCE: -->`)
- Rubric requirement references
- Explicit specification adherence documentation

## 6. Performance Characteristics

### Prompt-Only:
- Lighter CSS bundles (200-300 lines)
- Focused, minimal code generation
- Faster initial load for simple components

### Prompt+Rubric:
- Larger CSS bundles (500+ lines including tokens)
- More comprehensive but potentially unused code
- Better for large-scale applications

## 7. Creative vs. Systematic Trade-offs

### Prompt-Only Strengths:
- More visual creativity and variety
- Flexible, component-specific solutions
- Faster iteration and development

### Prompt+Rubric Strengths:
- Systematic consistency across components
- Enterprise-level maintainability
- Better long-term scalability

# Contributing

We welcome contributions to this experiment! This is a research project exploring AI-assisted development patterns, and community input helps improve our understanding of rubric-based component generation.

## Ways to Contribute

### **Experiment Expansion**
- Add new component types to test rubric effectiveness across different UI patterns
- Test with different AI models (Claude, GPT-4, etc.) to compare consistency
- Create variations of existing rubric files to test specification approaches

### **Data Analysis**
- Analyze generated code for quantitative differences (bundle size, complexity, accessibility scores)
- Document qualitative observations about code readability and maintainability
- Create automated tools for measuring rubric compliance

### **Tooling & Infrastructure**
- Improve the `.rux` rubric format with better syntax and features
- Create validation tools for rubric compliance checking
- Build automated testing frameworks for generated components

### **Documentation**
- Write analysis reports comparing specific aspects (performance, accessibility, etc.)
- Create guides for writing effective rubric specifications
- Document best practices discovered through experimentation

## Adding New Test Cases

1. Create new directories following the naming convention:
   - `prompt_only/[component]-N/`
   - `prompt_rubric/[component]-N/`

2. For rubric-based tests, ensure `.rubric/` directory contains:
   - `base.rux` - Global specifications
   - `[component].rux` - Component-specific rules
   - `system-design.rux` - System-level guidelines
   - `rubric.rux` - General rubric instructions file

## Testing Different Components

To extend this experiment to other components:

1. Create new rubric files for the component type
2. Update prompts to reference the new rubric files
3. Keep AI prompt consistent across approaches
4. Generate comparable outputs using both approaches
5. Document differences in component-specific README files

## Evaluation Criteria

When analyzing generated components, consider:

- **Code Quality**: Structure, maintainability, and conventions
- **Accessibility**: WCAG compliance and screen reader support
- **Performance**: Load times, optimization techniques
- **Security**: Input validation and XSS prevention
- **Consistency**: Adherence to design system and patterns

# Future Work

## Planned Experiments
- [ ] **Multi-Component Analysis**: Test rubric effectiveness/consistency across different component types (forms, navigation, data tables)
- [ ] **Modification Impact**: Evaluate how user-led modificatons affect rubric adherence and component quality 
- [ ] **Iterative Refinement**: Study how rubric specifications can be improved based on generated output analysis
- [ ] **Framework Adaptation**: Extend rubrics to React, Vue, and other framework-specific generation
- [ ] **Performance Benchmarking**: Quantitative analysis of bundle sizes, load times, code gen times, and runtime performance


## Development Roadmap
- [ ] **Grow Component Library**: Add more components to the experiment (forms, navigation, data tables)
- [ ] **Enhance Rubric DSL**: Improve `.rux` format with more detailed specifications
- [ ] **VS Code Integration**: Create VS Code language extension for .rux files for easier rubric syntax management and readability
- [ ] **CSS-methodology Agnostic**: Allow user to choose preferred CSS methodology (BEM, OOCSS, SMACSS) in rubric files
- [ ] **Configurable Rubric Parameters**: Allow users to specify which rubric aspects to enforce (e.g., accessibility, performance) and which conventions to use

## Research Questions
- [ ] **Optimal Rubric Granularity**: What level of specification detail produces the best results?
- [ ] **Validation**: How can we automatically validate generated components against rubric specifications?
- [ ] **User Experience**: How do developers perceive the usability of rubric-based generation vs. prompt-only?
- [ ] **Component Reusability**: Can AI-generated components be reused effectively across different projects with varying requirements?
- [ ] **Rubric Learning**: Can AI models be trained to generate better rubrics from successful component patterns?

## Technical Improvements
- [ ] **Dynamic Rubric Generation**: AI-assisted creation of rubrics from existing design systems
- [ ] **Component Composition**: Multi-component generation with shared design systems
- [ ] **Accessibility Auditing**: Automated accessibility compliance verification
- [ ] **Performance Monitoring**: Integration with Lighthouse and other performance tools

# License

MIT 

# Author
Created and maintained by [Fernanda Graciolli](https://github.com/graciolli-f) as part of the [Midspiral](https://midspiral.com) initiative to explore how to make programming with AI more robust, scalable, and maintainable.
