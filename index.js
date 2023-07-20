const core = require("@actions/core");
const Ajv = require("ajv");
const ajvKeywords = require("ajv-keywords");
const fs = require("fs");

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
    const jsonFilePath = core.getInput("recipe-file");

    // Read the schema file path from the input
    const schemaFilePath = core.getInput("schema-file");

    // Read the JSON file content
    const recipeData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));

    // Import the JSON schema from the file
    const schema = require(schemaFilePath);

    // Remove the $schema keyword from the schema
    delete schema["$schema"];

    // Fix the schema object to remove unsupported custom keyword "cname"
    delete schema.properties.package.properties.name.cname;

    // Fix the schema object to set the "uniqueItems" keyword to boolean true
    schema.properties.package.properties.platforms.uniqueItems = true;

    validateRecipe(recipeData, schema);
    readRecipe(recipeData);
  } catch (error) {
    core.setFailed(`Action failed with error: ${error}`);
  }
}

main();
module.exports = { main };
