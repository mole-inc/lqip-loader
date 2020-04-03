var loaderUtils = require("loader-utils");
var lqip = require("@mole-inc/lqip");

module.exports = function (contentBuffer) {
  this.cacheable && this.cacheable();
  var callback = this.async();

  var content = contentBuffer.toString("utf8");
  // image file path
  var path = this.resourcePath;

  // user options
  var config = loaderUtils.getOptions(this);
  var forceJimp = "forceJimp" in config ? !!config.forceJimp : false;
  var width = "width" in config ? config.width : 20;

  var contentIsUrlExport = /^(module.exports =|export default) "data:(.*)base64,(.*)/.test(
    content
  );
  var contentIsFileExport = /^(module.exports =|export default) (.*)/.test(
    content
  );
  var source = "";

  if (contentIsUrlExport) {
    source = content.match(/^(module.exports =|export default) (.*)/)[2];
  } else {
    if (!contentIsFileExport) {
      var fileLoader = require("file-loader");
      content = fileLoader.call(this, contentBuffer);
    }
    source = content.match(/^(module.exports =|export default) (.*);/)[2];
  }

  lqip(path, { forceJimp, width })
    .then((result) => {
      var sizes = {
        originalWidth: result.metadata.originalWidth,
        originalHeight: result.metadata.originalHeight,
        width: result.metadata.width,
        height: result.metadata.height,
      };
      var result =
        'module.exports = { "src": ' +
        source +
        ', "preSrc": ' +
        JSON.stringify(result.metadata.dataURIBase64) +
        ', "sizes": ' +
        JSON.stringify(sizes) +
        " };";
      // the output will be sent to webpack!
      callback(null, result);
    })
    .catch((error) => {
      console.error(error);
      callback(error, null);
    });
};

module.exports.raw = true;
