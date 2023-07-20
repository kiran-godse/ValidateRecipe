const core = require("@actions/core");
const fs = require("fs");
const Ajv = require("ajv");
const ajvKeywords = require("ajv-keywords");

// Load the JSON schema from the file
const schemaFilePath = core.getInput("schema-file");
const schema = require(schemaFilePath);

function validateRecipe(data, schema) {
  const ajv = new Ajv.default({ allErrors: true });
  ajvKeywords(ajv, ["regexp"]);
  const validate = ajv.compile(schema);
  const isValid = validate(data);

  if (isValid) {
    console.log("Recipe is valid!");
    return true;
  } else {
    console.log("Recipe is invalid:", validate.errors);
    return false;
  }
}

function readRecipe(data) {
  console.log("Substrate data:", data.substrate);
}

async function main() {
  try {
    // Read the JSON file path from the input
    const jsonFilePath = core.getInput("json-file");

    // Read the JSON file content
    const jsonData = fs.readFileSync(jsonFilePath, "utf8");
    const recipeData = JSON.parse(jsonData);

    // Validate the recipe data against the schema
    const isValid = validateRecipe(recipeData, schema);

    if (isValid) {
      // Read the recipe data if it is valid
      readRecipe(recipeData);
    } else {
      // Set the action as failed if the recipe is invalid
      core.setFailed("Recipe is invalid.");
    }
  } catch (error) {
    core.setFailed(`Action failed with error: ${error}`);
  }
}

main();
