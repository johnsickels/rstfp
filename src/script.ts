import * as path from "path";
import * as fs from "fs";
import {
  templateLiteralize,
  envVariablize,
  commentize,
  camelize,
  bracketize,
} from "./utils/izers";

// Find Runscope imports
const directoryPath = path.join(__dirname, "../imports");
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
  const data = JSON.parse(rawdata.toString());
  // console.log(data);
  // console.log(typeof data);
  // Loop through each suite the imported object
  for (let i = 0; i < data.length; i++) {
    const suite = data[i];

    // boilerplate
    let fileBody = "import { Flagpole } from 'flagpole';\n";
    fileBody += "import * as env from '../../env';\n\n";
    fileBody += `const suite = Flagpole.suite('${suite.name}');\n\n`;

    // scenario
    for (let j = 0; j < suite.steps.length; j++) {
      const step = suite.steps[j];

      fileBody += `suite\n\t.json('${step.note}')\n\t`;

      // auth
      if (step.headers && step.headers.hasOwnProperty("Authorization")) {
        const token = envVariablize(
          step.headers.Authorization[0].split(" ")[1]
        );
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
            ? `.$${bracketize(rsAssertion.property)})`
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
            case "empty":
              fpAssertion += ".not.exists()";
              break;
            case "is_greater_than":
              fpAssertion += ".greaterThan";
              break;
            case "is_less_than":
              fpAssertion += ".lessThan";
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
          fileBody += `// ${commentize(script)}\n`;
        });
      }

      fileBody += "\n\t});\n\n";
    }

    //   const note = step.note ? camelize(step.note) : `noName${i}`;
    const suiteName = camelize(suite.name);
    //   const flagpoleSuiteName = `${runscopeName}/${note}`;
    const parentDir = "./tests/src/";
    // const dir = `${parentDir + runscopeName}/`;
    const fileName = `${parentDir + suiteName}.ts`;

    //   if (!fs.existsSync(dir)) {
    //     fs.mkdirSync(dir);
    //   }

    // Export new flagpole suite
    fs.writeFileSync(fileName, fileBody);

    // Write it to flagpole.json
    const flagpoleConfig = fs.readFileSync(`./flagpole.json`);
    const flagpoleConfigObject = JSON.parse(flagpoleConfig.toString());

    flagpoleConfigObject.suites[suiteName] = {
      id: "",
      name: suiteName,
      tags: [],
    };

    fs.writeFileSync("flagpole.json", JSON.stringify(flagpoleConfigObject));
    console.log(`Successfully imported: ${suiteName}`);
  }
}
