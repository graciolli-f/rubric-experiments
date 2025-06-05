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
- `.rubric/` directory (specification files)

### Sample Results

The experiment includes 5 iterations of each approach:
- `prompt_only/product_card-1` through `product_card-5`
- `prompt_rubric/product_card-1` through `product_card-5`

## Key Differences Observed
- [ ] TODO

## Contributing

### Adding New Test Cases

1. Create new directories following the naming convention:
   - `prompt_only/[component]-N/`
   - `prompt_rubric/[component]-N/`

2. For rubric-based tests, ensure `.rubric/` directory contains:
   - `base.rux` - Global specifications
   - `[component].rux` - Component-specific rules
   - `system-design.rux` - System-level guidelines
   - `rubric.rux` - General rubric instructions file

### Testing Different Components

To extend this experiment to other components:

1. Create new rubric files for the component type
2. Update prompts to reference the new rubric files
3. Keep AI prompt consistent across approaches
4. Generate comparable outputs using both approaches
5. Document differences in component-specific README files

### Evaluation Criteria

When analyzing generated components, consider:

- **Code Quality**: Structure, maintainability, and conventions
- **Accessibility**: WCAG compliance and screen reader support
- **Performance**: Load times, optimization techniques
- **Security**: Input validation and XSS prevention
- **Consistency**: Adherence to design system and patterns

## Future Work

- [ ] TODO

## License

This experiment is for research purposes. Individual generated components may vary in licensing requirements.
