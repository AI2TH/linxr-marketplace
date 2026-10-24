#!/usr/bin/env node

/**
 * Validation script for Linxr Marketplace Recipes.
 * Ensures recipes.json conforms to the schema and has no duplicate IDs or invalid configurations.
 */

const fs = require('fs');
const path = require('path');

const recipesPath = path.join(__dirname, 'recipes.json');
const schemaPath = path.join(__dirname, 'schema.json');

if (!fs.existsSync(recipesPath)) {
  console.error('❌ recipes.json not found!');
  process.exit(1);
}

let recipes;
try {
  recipes = JSON.parse(fs.readFileSync(recipesPath, 'utf8'));
} catch (err) {
  console.error('❌ Failed to parse recipes.json as valid JSON:');
  console.error(err.message);
  process.exit(1);
}

if (!Array.isArray(recipes)) {
  console.error('❌ recipes.json must be a top-level JSON array.');
  process.exit(1);
}

const ids = new Set();
let hasErrors = false;

recipes.forEach((item, index) => {
  const prefix = `Recipe #${index + 1} (${item.id || 'unnamed'}):`;

  if (!item.id || typeof item.id !== 'string') {
    console.error(`❌ ${prefix} missing or invalid "id"`);
    hasErrors = true;
  } else if (ids.has(item.id)) {
    console.error(`❌ ${prefix} duplicate id "${item.id}" detected`);
    hasErrors = true;
  } else {
    ids.add(item.id);
  }

  if (!item.name || typeof item.name !== 'string') {
    console.error(`❌ ${prefix} missing or invalid "name"`);
    hasErrors = true;
  }

  if (!item.category || typeof item.category !== 'string') {
    console.error(`❌ ${prefix} missing or invalid "category"`);
    hasErrors = true;
  }

  if (!['docker', 'script'].includes(item.type)) {
    console.error(`❌ ${prefix} "type" must be either "docker" or "script"`);
    hasErrors = true;
  }

  if (item.type === 'docker' && (!item.image || typeof item.image !== 'string')) {
    console.error(`❌ ${prefix} "image" is required for docker recipes`);
    hasErrors = true;
  }

  if (item.type === 'script' && (!item.script || typeof item.script !== 'string')) {
    console.error(`❌ ${prefix} "script" is required for script recipes`);
    hasErrors = true;
  }

  if (item.ports && Array.isArray(item.ports)) {
    item.ports.forEach((p, pIdx) => {
      if (typeof p.host !== 'number' || typeof p.container !== 'number') {
        console.error(`❌ ${prefix} port definition #${pIdx + 1} must specify numeric host and container ports`);
        hasErrors = true;
      }
    });
  }
});

if (hasErrors) {
  console.error('\n❌ Recipe validation failed! Please fix the errors listed above.');
  process.exit(1);
}

console.log(`✅ Successfully validated ${recipes.length} marketplace recipes! Zero schema errors.`);
process.exit(0);
