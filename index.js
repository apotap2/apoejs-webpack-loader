var ejs = require('ejs'),
  UglifyJS = require('uglify-js'),
  utils = require('loader-utils'),
  path = require('path'),
  htmlmin = require('html-minifier'),
  merge = require('merge'),
  qs = require('qs');

function getQuery(from) {
  if (typeof from === 'object')
    return from;

  const query = from.substr(1);

  if (!query) {
    return {};
  }

  if (query.substr(0, 1) === '{' && query.substr(-1) === '}') {
    return JSON.parse(query);
  }

  return qs.parse(query);
}

module.exports = function (source) {
  this.cacheable && this.cacheable();
  var query = getQuery(this.query);
  var _options = typeof this.options === 'object' ? this.options['ejs-compiled-loader'] || {} : {};
  _options = typeof utils.getOptions === 'function' ? merge(utils.getOptions(this), _options) : _options;
  var opts = merge(_options, query);

  if (opts.client == undefined) {
    opts.client = true;
  }

  // Skip compile debug for production when running with
  // webpack --optimize-minimize
  if (this.minimize && opts.compileDebug === undefined) {
    opts.compileDebug = false;
  }

  // Use filenames relative to working dir, which should be project root
  opts.filename = path.relative(process.cwd(), this.resourcePath);

  if (opts.htmlmin) {
    source = htmlmin.minify(source, opts['htmlminOptions'] || {});
  }

  var template = ejs.compile(source, opts);
  template.dependencies.forEach(this.dependency.bind(this));

  // Beautify javascript code
  if (this.loaders.length > 1) {
    template = JSON.stringify(template((opts['data'] || {})));
  } else {
    if (!this.minimize && opts.beautify !== false) {
      var ast = UglifyJS.parse(template.toString());
      ast.figure_out_scope();
      template = ast.print_to_string({ beautify: true });
    }
  }
  return 'module.exports = ' + template;
};
