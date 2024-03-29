var _ = require('./underscore');

exports.config = require("./cloudinary/config");
exports.utils = require("./cloudinary/utils");
exports.uploader = require("./cloudinary/uploader");
exports.url = function(public_id, options) {
  options = _.extend({}, options);
  return exports.utils.url(public_id, options);    
};    
exports.image = function(source, options) {
  options = options || {};
  source = exports.utils.url(source, options);
  if ("html_width" in options) options["width"] = exports.utils.option_consume(options, "html_width");
  if ("html_height" in options) options["height"] = exports.utils.option_consume(options, "html_height");
  return "<img src='" + source + "' " + exports.utils.html_attrs(options) + "/>";
};
exports.CF_SHARED_CDN = exports.utils.CF_SHARED_CDN;
exports.AKAMAI_SHARED_CDN = exports.utils.AKAMAI_SHARED_CDN;
exports.SHARED_CDN = exports.utils.SHARED_CDN;
