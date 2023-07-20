const core = require('@actions/core');
const fs = require('fs');
const Ajv = require('ajv');
const ajvKeywords = require('ajv-keywords');

async function main() {
  try {
    // Read the JSON file path from the input
    const jsonFilePath = core.getInput('json-file');
    const schemaFilePath = core.getInput('schema-file');

    // Read the JSON file content
    const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');

    // Read the schema file content
    const schemaContent = fs.readFileSync(schemaFilePath, 'utf8');

    // Parse JSON content into an object
    const jsonData = JSON.parse(jsonContent);

    // Parse JSON schema content into an object
    const jsonSchema = JSON.parse(schemaContent);

    // Validate the JSON data against the schema
    const isValid = validateRecipe(jsonData, jsonSchema);

    // Set the JSON content as an output
    core.setOutput('json', jsonContent);

    // Set the validation status as an output
    core.setOutput('isValid', isValid);
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

function validateRecipe(data, schema) {
  const ajv = new Ajv.default({ allErrors: true });
  ajvKeywords(ajv, ['regexp']);
  const validate = ajv.compile(schema);
  const isValid = validate(data);

  if (isValid) {
    console.log('Recipe is valid!');
    return true;
  } else {
    console.log('Recipe is invalid:', validate.errors);
    return false;
  }
}

function readRecipe(data) {
  console.log('Substrate data:', data.substrate);
}

// Read the JSON file content
const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
const recipeData = JSON.parse(jsonContent);

// Remove the $schema keyword from the schema
//const schema //put it main function
// Read the JSON file path from the input
const jsonFilePath = _core.getInput("json-file");
= require('./.schema/recipe.json');
delete schema['$schema'];

// Fix the schema object to remove unsupported custom keyword "cname"
delete schema.properties.package.properties.name.cname;

// Fix the schema object to set the "uniqueItems" keyword to boolean true
schema.properties.package.properties.platforms.uniqueItems = true;

validateRecipe(recipeData, schema); //proper variable names required
readRecipe(recipeData);
//call main function kar
module.exports = { validateRecipe, readRecipe };
