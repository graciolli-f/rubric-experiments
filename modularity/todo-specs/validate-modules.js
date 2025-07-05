const fs = require('fs');

class ModuleValidator {
  constructor() {
    this.map = JSON.parse(fs.readFileSync('module-map.json', 'utf8'));
    this.violations = [];
  }

  validate() {
    console.log('\n🔍 Validating module architecture...\n');
    
    // Check each module against patterns
    for (const [moduleName, module] of Object.entries(this.map.modules)) {
      this.validateModule(moduleName, module);
    }
    
    // Check circular dependencies
    this.checkCircularDependencies();
    
    // Report results
    if (this.violations.length === 0) {
      console.log('✅ All module constraints passed!\n');
    } else {
      console.error(`❌ Found ${this.violations.length} constraint violations:\n`);
      this.violations.forEach((v, i) => {
        console.error(`${i + 1}. ${v}`);
      });
      console.error('\n');
      process.exit(1); // Fail the build
    }
  }

  validateModule(name, module) {
    // Find matching pattern
    for (const [pattern, constraints] of Object.entries(this.map.constraints.module_patterns)) {
      if (new RegExp(pattern).test(name)) {
        // Check export count
        if (module.exports.length > constraints.max_exports) {
          this.violations.push(
            `⚠️  ${name}: Too many exports (${module.exports.length}/${constraints.max_exports}). ` +
            `Consider extracting to separate module.`
          );
        }
        
        // Check forbidden exports
        module.exports.forEach(exp => {
          constraints.forbidden_exports?.forEach(forbidden => {
            if (new RegExp(forbidden).test(exp)) {
              this.violations.push(
                `🚫 ${name}: Forbidden export '${exp}' for ${constraints.responsibility} module. ` +
                `Create a separate ${this.suggestModuleType(exp)} module.`
              );
            }
          });
        });
        
        // Check forbidden imports
        module.imports.forEach(imp => {
          constraints.forbidden_imports?.forEach(forbidden => {
            if (forbidden === '*' && module.imports.length > 0) {
              this.violations.push(
                `🚫 ${name}: Models should not import other modules.`
              );
            } else if (new RegExp(forbidden).test(imp)) {
              this.violations.push(
                `🚫 ${name}: Forbidden import '${imp}' for ${constraints.responsibility} module.`
              );
            }
          });
        });
      }
    }
  }

  checkCircularDependencies() {
    for (const [moduleA, detailsA] of Object.entries(this.map.modules)) {
      detailsA.imports.forEach(moduleB => {
        const detailsB = this.map.modules[moduleB];
        if (detailsB && detailsB.imports.includes(moduleA)) {
          this.violations.push(
            `🔄 Circular dependency detected: ${moduleA} ⟷ ${moduleB}`
          );
        }
      });
    }
  }

  suggestModuleType(exportName) {
    for (const [pattern, suggestion] of Object.entries(this.map.module_suggestions)) {
      if (new RegExp(pattern).test(exportName)) {
        return suggestion;
      }
    }
    return 'specialized';
  }
}

// Run validation
new ModuleValidator().validate();