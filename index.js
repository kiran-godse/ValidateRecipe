const core = require('@actions/core');
const fs = require('fs');
const Ajv = require('ajv');
const ajvKeywords = require('ajv-keywords/keywords/regexp'); // Update the import statement

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
    core.setOutput('isValid', isValid.toString()); // Convert boolean to string for output
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

function validateRecipe(data, schema) {
  const ajv = new Ajv.default({ allErrors: true });
  ajvKeywords(ajv); // Call the imported function directly
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

main();
