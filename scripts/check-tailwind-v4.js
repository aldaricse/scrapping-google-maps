#!/usr/bin/env node

/**
 * Tailwind CSS v4 Compatibility Checker
 * 
 * This script helps verify that the migration to Tailwind v4 is working correctly
 * by checking common patterns and potential issues.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Tailwind CSS v4 Migration Compatibility Check\n');

// Check if package.json has correct Tailwind version
function checkPackageJson() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const tailwindVersion = packageJson.devDependencies?.tailwindcss || packageJson.dependencies?.tailwindcss;
    
    if (tailwindVersion?.startsWith('^4.0') || tailwindVersion?.startsWith('4.0')) {
      console.log('✅ package.json: Tailwind CSS v4.0 detected');
      return true;
    } else {
      console.log('❌ package.json: Tailwind CSS v4.0 not found');
      console.log(`   Found: ${tailwindVersion || 'none'}`);
      return false;
    }
  } catch (error) {
    console.log('❌ package.json: Could not read file');
    return false;
  }
}

// Check if globals.css uses the new @import syntax
function checkGlobalsCss() {
  try {
    const globalsCss = fs.readFileSync('styles/globals.css', 'utf8');
    
    if (globalsCss.includes('@import "tailwindcss"')) {
      console.log('✅ styles/globals.css: Using new @import syntax');
    } else {
      console.log('❌ styles/globals.css: Missing @import "tailwindcss"');
      return false;
    }
    
    if (globalsCss.includes('@theme')) {
      console.log('✅ styles/globals.css: Using @theme directive');
    } else {
      console.log('❌ styles/globals.css: Missing @theme directive');
      return false;
    }
    
    if (globalsCss.includes('@tailwind base') || globalsCss.includes('@tailwind components') || globalsCss.includes('@tailwind utilities')) {
      console.log('⚠️ styles/globals.css: Old @tailwind directives found - should be removed');
      return false;
    }
    
    return true;
  } catch (error) {
    console.log('❌ styles/globals.css: Could not read file');
    return false;
  }
}

// Check tailwind.config.ts is simplified
function checkTailwindConfig() {
  try {
    const configContent = fs.readFileSync('tailwind.config.ts', 'utf8');
    
    if (configContent.includes('extend:') && configContent.includes('colors:')) {
      console.log('⚠️ tailwind.config.ts: Still contains theme configuration - should be moved to CSS');
      return false;
    } else {
      console.log('✅ tailwind.config.ts: Simplified configuration detected');
      return true;
    }
  } catch (error) {
    console.log('❌ tailwind.config.ts: Could not read file');
    return false;
  }
}

// Run all checks
function runCompatibilityCheck() {
  const checks = [
    checkPackageJson(),
    checkGlobalsCss(),
    checkTailwindConfig()
  ];
  
  const passedChecks = checks.filter(Boolean).length;
  const totalChecks = checks.length;
  
  console.log(`\n📊 Results: ${passedChecks}/${totalChecks} checks passed`);
  
  if (passedChecks === totalChecks) {
    console.log('🎉 All compatibility checks passed! Ready for testing.');
    console.log('📋 Next: Deploy to Vercel preview and run comprehensive tests.');
  } else {
    console.log('⚠️ Some checks failed. Please review the issues above.');
    console.log('💡 Tip: Make sure you are using Tailwind CSS v4.0.0 stable.');
  }
  
  return passedChecks === totalChecks;
}

// Main execution
if (require.main === module) {
  const success = runCompatibilityCheck();
  process.exit(success ? 0 : 1);
}

module.exports = { runCompatibilityCheck };
