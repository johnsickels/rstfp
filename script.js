const path = require("path");
const fs = require("fs");
// const env = require("./env");

// Find Runscope imports
const directoryPath = path.join(__dirname, "imports");
fs.readdir(directoryPath, (err, files) => {
  // ignore hidden files (.DS_Store)
  files = files.filter((file) => !/(^|\/)\.[^\/\.]/g.test(file));
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  files.forEach((file) => {
    generateFlagpoleSuite(file);
  });
});

// Main function
function generateFlagpoleSuite(runscopeJSON) {
  const rawdata = fs.readFileSync(`./imports/${runscopeJSON}`);
  // console.log(rawdata);
  const data = JSON.parse(rawdata);
  // console.log(data.name);

  // Change {{variable}} to ${variable}
  function templateLiteralize(variable) {
    if (typeof variable === "string") {
      return variable
        .replace("{{staging-url}}", "")
        .replace(/{{/g, "${env.")
        .replace(/}}/g, "}")
        .replace(/"/g, "`");
    }
    return variable;
  }

  function envVariablize(str) {
    // remove quotes
    // console.log(str);
    if (!str.includes("{{")) return `"${str}"`;

    str = str
      .replace(/"{{/g, "env.")
      .replace(/}}"/g, "")
      .replace(/{{/g, "env.")
      .replace(/}}/g, "");
    // variablize {{}}
    // console.log(str);
    return str;
  }

  // Change "\n" to "\n //""
  function commentify(str) {
    return str.replace(/\n/g, "\n\t\t //");
  }

  // Change "Standard GET Request to /events/eventId - limit testing" to "standardGetRequestToEventsEventid"
  function toCamelCase(note) {
    // console.log(note);
    const camel = note
      .trim() //might need polyfill if you need to support older browsers
      .toLowerCase() //lower case everything
      .replace(
        /([^A-Z0-9]+)(.)/gi, //match multiple non-letter/numbers followed by any character
        function (match) {
          return arguments[2].toUpperCase(); //3rd index is the character we need to transform uppercase
        }
      );
    // console.log(camel);
    return camel;
  }

  // Loop through the each steps the imported object
  for (i = 0; i < data.steps.length; i++) {
    const step = data.steps[i];

    // boilerplate
    let fileBody = "import { Flagpole } from 'flagpole';\n";
    fileBody += "import * as env from '../../../env';\n\n";
    fileBody +=
      "const suite = Flagpole.suite('This suite was generated from the RSTFPG');\n\n";
    fileBody += `suite\n\t.json('${step.note}')\n\t`;

    // auth
    if (step.headers && step.headers.hasOwnProperty("Authorization")) {
      const token = envVariablize(step.headers.Authorization[0].split(" ")[1]);
      // console.log(token);
      fileBody += `.setBearerToken(${token})\n\t`;
    }

    // setJsonBody
    if (step.body) {
      let jsonBody = step.body.includes("{{")
        ? envVariablize(step.body)
        : step.body;

      fileBody += `.setJsonBody(${jsonBody})\n\t`;
    }
    // open
    if (step.url) {
      step.url = templateLiteralize(step.url);
    }
    fileBody += `.open(\`${step.method} ${step.url}\`)\n\t`;

    // next
    fileBody += ".next((context)=>{\n\t\t";

    // Loop through each assertion in each step
    if (step.assertions) {
      step.assertions.forEach((rsAssertion) => {
        let fpAssertion = "context.assert";

        // source
        switch (rsAssertion.source) {
          case "response_status":
            fpAssertion += "(context.response.statusCode";
            break;
          case "response_json":
            fpAssertion += "(context.response.jsonBody";
            break;
          default:
            fpAssertion += `(${rsAssertion.source}`;
        }

        // property
        fpAssertion += rsAssertion.property
          ? `.$.${rsAssertion.property})`
          : ")";

        // comparison
        switch (rsAssertion.comparison) {
          case "equal_number":
            fpAssertion += ".equals";
            break;
          case "equal":
            fpAssertion += ".equals";
            break;
          case "not_equal":
            fpAssertion += ".not.equals";
            break;
          case "not_empty":
            fpAssertion += ".exists()";
            break;
          case "is_a_number":
            fpAssertion += ".type.equals('number')";
            break;
          default:
            fpAssertion += `.${rsAssertion.comparison}`;
        }

        // value
        switch (typeof rsAssertion.value) {
          case "number":
            fpAssertion += `(${rsAssertion.value});`;
            break;
          case "object":
            fpAssertion += ";";
            break;
          case "string":
            fpAssertion += `(${envVariablize(rsAssertion.value)});`;
            break;
          default:
            fpAssertion += `(${rsAssertion.value});`;
        }

        fileBody += `${fpAssertion}\n\t\t`;
      });
    }

    // scripts
    if (step.scripts && step.scripts.length) {
      fileBody += "\n\t\t// TO DO:\n\t\t";
      step.scripts.forEach((script) => {
        fileBody += `// ${commentify(script)}\n`;
      });
    }

    fileBody += "\n\t})";

    // Make directory with node
    // const parentDir = "./tests/src/";
    // const dir = parentDir + toCamelCase(data.name);
    // const fileName = step.note ? toCamelCase(step.note) : `noName${i}`;
    // // console.log(dir);
    // if (!fs.existsSync(dir)) {
    //   // console.log("Making dir...");
    //   fs.mkdirSync(dir);
    // }

    // // Add dir name to fileName
    // let fileNameWithDir = `${dir}/${fileName}`;
    // // fileNameWithDir += step.note ? toCamelCase(step.note) : `noName${i}`;
    // // console.log(`Making file name: ${fileName}`);
    // const fileNameExtension = `${fileNameWithDir}.ts`;

    const note = step.note ? toCamelCase(step.note) : `noName${i}`;
    const runscopeName = toCamelCase(data.name);
    const flagpoleSuiteName = `${runscopeName}/${note}`;
    const parentDir = "./tests/src/";
    const dir = `${parentDir + runscopeName}/`;
    const fileName = `${parentDir + flagpoleSuiteName}.ts`;

    if (!fs.existsSync(dir)) {
      // console.log("Making dir...");
      fs.mkdirSync(dir);
    }

    // Export new flagpole suite
    // console.log("Writing file...");
    fs.writeFileSync(fileName, fileBody);

    // write it to flagpole.json
    const flagpoleConfig = fs.readFileSync(`./flagpole.json`);
    const flagpoleConfigObject = JSON.parse(flagpoleConfig);

    flagpoleConfigObject.suites[flagpoleSuiteName] = {
      id: "",
      name: flagpoleSuiteName,
      tags: [],
    };

    fs.writeFileSync("flagpole.json", JSON.stringify(flagpoleConfigObject));
  }
  console.log(`Successfully imported: ${data.name}`);
}
