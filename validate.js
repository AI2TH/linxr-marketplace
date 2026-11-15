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

// Host ports that Linxr itself forwards from the phone into the VM
// (VmManager.portForwards in AI2TH/Linxr). SSH and the VM API can never be
// used by a recipe. The other defaults may only be declared with the same
// mapping Linxr already sets up, so a recipe cannot claim a phone port that
// actually leads to a different service (see AI2TH/Linxr#31).
const ALWAYS_RESERVED_HOST_PORTS = new Map([
  [2222, 'SSH'],
  [7081, 'Linxr VM API'],
]);
const DEFAULT_FORWARDS = new Map([
  // host port -> guest port Linxr forwards it to
  [5900, 5900],   // Virtual Desktop VNC
  [6080, 6080],   // Virtual Desktop noVNC
  [8088, 80],     // HTTP (phone 8088 -> VM 80)
  [11434, 11434], // Ollama
]);

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
        return;
      }
      if (ALWAYS_RESERVED_HOST_PORTS.has(p.host)) {
        console.error(`❌ ${prefix} port definition #${pIdx + 1} uses host port ${p.host}, which is reserved for ${ALWAYS_RESERVED_HOST_PORTS.get(p.host)} by Linxr`);
        hasErrors = true;
      } else if (DEFAULT_FORWARDS.has(p.host) && p.container !== DEFAULT_FORWARDS.get(p.host)) {
        console.error(`❌ ${prefix} port definition #${pIdx + 1} maps host port ${p.host} to ${p.container}, but Linxr already forwards host ${p.host} to VM port ${DEFAULT_FORWARDS.get(p.host)}; pick a free host port`);
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
