const core = require('@actions/core');
const fs = require('fs');
const Ajv = require('ajv');

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

    // Validate the JSON data against the schema
    const isValid = validateRecipe(jsonData, jsonSchema);

    // Set the JSON content as an output
    _core.setOutput('json', jsonContent);

    // Set the validation status as an output
    _core.setOutput('isValid', isValid.toString()); // Convert boolean to string for output
  } catch (error) {
    _core.setFailed(`Action failed with error: ${error.message}`);
  }
}

function validateRecipe(data, schema) {
  try {
    const ajv = new Ajv.default({ allErrors: true, keywords: ['regexp'] }); // Use built-in support for 'regexp' keyword
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

main(core);
module.exports = { main };
