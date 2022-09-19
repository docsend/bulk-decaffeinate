"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = transformer;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * jscodeshift script that converts functions to use function declaration style
 * in common cases. For example, this code:
 *
 * let f = function() {
 *   return 3;
 * }
 *
 * becomes this code:
 *
 * function f() {
 *   return 3;
 * }
 *
 * Note that this happens whether the declaration is "var", "let", or "const".
 */
function transformer(file, api) {
  var j = api.jscodeshift;

  return j(file.source).find(j.VariableDeclaration).filter(function (path) {
    if (path.node.declarations.length !== 1) {
      return false;
    }

    var _path$node$declaratio = _slicedToArray(path.node.declarations, 1),
        declaration = _path$node$declaratio[0];

    if (j.FunctionExpression.check(declaration.init)) {
      return declaration.init.id === null;
    }

    if (j.ArrowFunctionExpression.check(declaration.init)) {
      return j.Program.check(path.parent.node);
    }

    return false;
  }).replaceWith(function (path) {
    var _path$node$declaratio2 = _slicedToArray(path.node.declarations, 1),
        declaration = _path$node$declaratio2[0];

    var body = void 0;
    if (j.BlockStatement.check(declaration.init.body)) {
      body = declaration.init.body;
    } else {
      var comments = declaration.init.body.comments;
      body = j.blockStatement([j.returnStatement(declaration.init.body)]);
      // Work around a bug in jscodeshift/recast where the comment, including
      // its newline, can be placed between the return and the expression,
      // causing ASI to treat it as an empty return followed by an expression
      // statement.
      declaration.init.body.comments = [];
      body.body[0].comments = comments;
    }
    var resultNode = j.functionDeclaration(declaration.id, declaration.init.params, body, declaration.init.generator, declaration.init.expression);
    resultNode.comments = [].concat(_toConsumableArray(path.node.comments || []), _toConsumableArray(declaration.comments || []), _toConsumableArray(declaration.init.comments || []));
    return resultNode;
  }).toSource();
}