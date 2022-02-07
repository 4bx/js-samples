const path = require("path");
const prettier = require("prettier");

module.exports = function (content, outputPath) {
  if (!content) {
    return content;
  }

  const ext = path.extname(outputPath);
  switch (ext) {
    case ".md":
      return prettier.format(content, { parser: "markdown" });
    case ".html":
      return prettier.format(content, { parser: "html" });
    case ".js": // done as part of an earlier step
    default:
      return content;
  }
};
