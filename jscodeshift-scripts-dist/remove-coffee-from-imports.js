'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformer;
/**
 * jscodeshift script that converts the .coffee extension from any import or
 * require statements. Since it should be possible to infer the extension, this
 * makes the imports more flexible to work whether the file being imported is
 * in CoffeeScript or JavaScript.
 *
 * For example, this code:
 *
 * import foo from './foo.coffee'
 * const bar = require('./bar.coffee')
 *
 * becomes this code:
 *
 * import foo from './foo'
 * const bar = require('./bar')
 */
function transformer(file, api) {
  var j = api.jscodeshift;

  var root = j(file.source);
  root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal'
    }
  }).forEach(function (path) {
    var source = path.node.source;
    source.value = stripCoffeeExtension(source.value);
  });
  root.find(j.CallExpression, {
    callee: {
      type: 'Identifier',
      name: 'require'
    },
    arguments: {
      length: 1,
      0: {
        type: 'Literal'
      }
    }
  }).forEach(function (path) {
    var literal = path.node.arguments[0];
    literal.value = stripCoffeeExtension(literal.value);
  });
  return root.toSource();
}

function stripCoffeeExtension(str) {
  if (str.slice(str.length - '.coffee'.length) === '.coffee') {
    return str.slice(0, str.length - '.coffee'.length);
  } else {
    return str;
  }
}