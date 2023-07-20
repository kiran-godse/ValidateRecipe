const github = require("@actions/github");
const core = require('@actions/core');
const Ajv = require('ajv');
const ajvKeywords = require('ajv-keywords');
const fs = require('fs');

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

async function main(_core, _github){
    try{
        const jsonFilePath = _core.getInput("json-file");
        delete schema['$schema'];
        // Read the JSON file content
        const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
        
     // Read the JSON file path from the input
        const recipeData = _core.getInput("recipe-file");
        

// Fix the schema object to remove unsupported custom keyword "cname"
delete schema.properties.package.properties.name.cname;

// Fix the schema object to set the "uniqueItems" keyword to boolean true
schema.properties.package.properties.platforms.uniqueItems = true;

validateRecipe(recipeData, schema); 
readRecipe(recipeData);


    }catch (error){
        _core.setFailed(`Action failed with error: ${error}`);
    }
}




main(core, github);
module.exports = { main };
