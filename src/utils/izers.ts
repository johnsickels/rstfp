export const templateLiteralize = (variable) => {
  if (typeof variable === "string") {
    return variable
      .replace("{{staging-url}}", "")
      .replace(/{{/g, "${env.")
      .replace(/}}/g, "}")
      .replace(/"/g, "`");
  }
  return variable;
};

export const envVariablize = (str) => {
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
};

export const commentize = (str) => {
  return str.replace(/\n/g, "\n\t\t //");
};

export const camelize = (note) => {
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
};

export const bracketize = (str) => {
  function cb(acc, string) {
    return acc + `["${string}"]`;
  }
  return str.split(".").reduce(cb, "");
};
