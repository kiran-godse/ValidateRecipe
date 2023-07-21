const core = require('@actions/core');
const fs = require('fs');
const Ajv = require('ajv');
const ajvKeywords = require('ajv-keywords');

const ajv = new Ajv.default({ allErrors: true, allowUnionTypes: true });
ajvKeywords(ajv, ['regexp']);

async function main(_core) {
  try {
    // Read the JSON file path from the input
    const jsonFilePath = _core.getInput('json-file');
    const schemaFilePath = _core.getInput('schema-file');

    // Read the JSON file content
    const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');

    // Read the schema file content
    const schemaContent = fs.readFileSync(schemaFilePath, 'utf8');

    // Parse JSON content into an object
    const jsonData = JSON.parse(jsonContent);

    // Parse JSON schema content into an object
    const jsonSchema = JSON.parse(schemaContent);
    delete jsonSchema['$schema']; // Remove $schema property from the schema

    // Validate the JSON data against the schema
    const isValid = validateRecipe(jsonData, jsonSchema);

    // Set the JSON content as an output
    _core.setOutput('json', jsonContent);

    // Set the validation status as an output
    _core.setOutput('isValid', isValid.toString()); // Convert boolean to string for output

    // If the recipe is valid, read and process the data
    if (isValid) {
      readRecipe(jsonData);
    }
  } catch (error) {
    _core.setFailed(`Action failed with error: ${error.message}`);
  }
}

function validateRecipe(data, schema) {
  try {
    const validate = ajv.compile(schema);
    const isValid = validate(data);

    if (isValid) {
      console.log('Recipe is valid!');
      return true;
    } else {
      console.log('Recipe is invalid:', validate.errors);
      return false;
    }
  } catch (error) {
    console.log('Error occurred during validation:', error.message);
    return false;
  }
}

function readRecipe(data) {
  const isValid = validateRecipe(data);
  if (isValid) {
    console.log('Substrate data:', data.substrate);
  }
}

main(core);
module.exports = { main };
