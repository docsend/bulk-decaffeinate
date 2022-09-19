'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (fileInfo, api, options) {
  var decodedOptions = JSON.parse(_zlib2.default.inflateSync(Buffer.from(options['encoded-options'], 'base64')).toString());
  var convertedFiles = decodedOptions.convertedFiles,
      absoluteImportPaths = decodedOptions.absoluteImportPaths;

  var j = api.jscodeshift;
  var thisFilePath = (0, _path.resolve)(fileInfo.path);
  var root = j(fileInfo.source);

  function convertFile() {
    if (includes(convertedFiles, thisFilePath)) {
      return fixImportsForConvertedFile();
    } else {
      return fixImportsForOtherFile();
    }
  }

  /**
   * This file was just converted to JS, so ANY import has the potential to be
   * invalid.
   */
  function fixImportsForConvertedFile() {
    return root.find(j.ImportDeclaration).replaceWith(fixImportAtPath).toSource();
  }

  /**
   * This file was not just converted to JS, but could potentially import files
   * that were. Correct any of those imports.
   */
  function fixImportsForOtherFile() {
    return root.find(j.ImportDeclaration).filter(function (path) {
      var importPath = resolveImportPath(thisFilePath, path.node.source.value);
      return includes(convertedFiles, importPath);
    }).replaceWith(fixImportAtPath).toSource();
  }

  /**
   * Top-level import-fixing code. We get all relevant information about the
   * names being imported and the names exported by the other file, and then
   * produce a set of changes on the import statement, including possibly some
   * destructure operations after the import.
   */
  function fixImportAtPath(path) {
    var importPath = path.node.source.value;
    var resolvedPath = resolveImportPath(thisFilePath, importPath);
    if (resolvedPath === null) {
      return path.node;
    }
    var exportsInfo = getExportsInformation(resolvedPath);
    // If we didn't see anything on the other side, it might not even be a JS
    // module, so just leave this import as-is.
    if (!exportsInfo.hasDefaultExport && exportsInfo.namedExports.length === 0) {
      return path.node;
    }
    var specifierIndex = getSpecifierIndex(path);
    var memberAccesses = findAllMemberAccesses(specifierIndex);
    var importManifest = getImportManifest(exportsInfo, memberAccesses);

    // If any sort of property is accessed from the default import, we need it.
    // Also, the default import might be something like a function where we
    // imported it and the other module has a default export.
    var needsDefaultImport = importManifest.defaultImportDirectAccesses.length > 0 || importManifest.defaultImportObjectAccesses.length > 0 || exportsInfo.hasDefaultExport && specifierIndex.defaultImport !== null;

    // If there are object-style accesses of named imports
    // (e.g. MyModule.myExport), then handle those with a star import. If we
    // also have direct usages of named exports (e.g. myOtherExport), we'll need
    // to destructure them from the * import later, but we try to avoid that
    // when possible. Also, if a default or star import originally existed, that
    // name needs to stay bound somehow, so we make sure to include it as a star
    // import if the other module didn't have a default export.
    var needsStarImport = importManifest.namedImportObjectAccesses.length > 0 || !needsDefaultImport && (specifierIndex.defaultImport !== null || specifierIndex.starImport !== null);

    var _resolveImportObjectN = resolveImportObjectNames(specifierIndex, needsDefaultImport, needsStarImport, exportsInfo.hasDefaultExport, importPath),
        defaultImportName = _resolveImportObjectN.defaultImportName,
        starImportName = _resolveImportObjectN.starImportName;

    path.node.specifiers = createImportSpecifiers(defaultImportName, starImportName, specifierIndex, importManifest);

    renameObjectAccesses(defaultImportName, starImportName, importManifest);

    if (importManifest.defaultImportDirectAccesses.length > 0) {
      insertImportDestructure(path, importManifest.defaultImportDirectAccesses, specifierIndex, defaultImportName);
    }
    // If we don't have a star import, named imports were done in the import statement.
    // Otherwise, we need to destructure from the star import to get direct names from it.
    if (starImportName !== null && importManifest.namedImportDirectAccesses.length > 0) {
      insertImportDestructure(path, importManifest.namedImportDirectAccesses, specifierIndex, starImportName);
    }
    return path.node;
  }

  /**
   * Turn an import string into an absolute path to a JS file.
   */
  function resolveImportPath(importingFilePath, importPath) {
    if (!importPath.endsWith('.js')) {
      importPath += '.js';
    }
    if (importPath.startsWith('.')) {
      var currentDir = (0, _path.dirname)(importingFilePath);
      var relativePath = (0, _path.resolve)(currentDir, importPath);
      if ((0, _fs.existsSync)(relativePath)) {
        return relativePath;
      }
    } else {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = absoluteImportPaths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var absoluteImportPath = _step.value;

          var absolutePath = (0, _path.resolve)(absoluteImportPath, importPath);
          if ((0, _fs.existsSync)(absolutePath)) {
            return absolutePath;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
    return null;
  }

  /**
   * Determine the names of all exports provided by a module and whether or not
   * it has a default export.
   */
  function getExportsInformation(filePath) {
    var source = (0, _fs.readFileSync)(filePath).toString();
    var otherRoot = j(source);

    var hasDefaultExport = false;
    var namedExports = [];
    otherRoot.find(j.ExportNamedDeclaration).forEach(function (p) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = p.node.specifiers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var specifier = _step2.value;

          namedExports.push(specifier.exported.name);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      if (p.node.declaration) {
        if (p.node.declaration.declarations) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = p.node.declaration.declarations[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var declaration = _step3.value;

              namedExports.push(declaration.id.name);
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }
        if (p.node.declaration.id) {
          namedExports.push(p.node.declaration.id.name);
        }
      }
    });

    otherRoot.find(j.ExportDefaultDeclaration).forEach(function () {
      hasDefaultExport = true;
    });

    otherRoot.find(j.ExportAllDeclaration).forEach(function (p) {
      var otherFilePath = resolveImportPath(filePath, p.node.source.value);
      if (otherFilePath === null) {
        return;
      }
      var otherFileExports = getExportsInformation(otherFilePath);
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = otherFileExports.namedExports[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var namedExport = _step4.value;

          namedExports.push(namedExport);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    });
    return { hasDefaultExport: hasDefaultExport, namedExports: namedExports };
  }

  /**
   * Return an object that makes it more convenient to look up import specifiers
   * rather than having to loop through the array.
   */
  function getSpecifierIndex(path) {
    var defaultImport = null;
    var starImport = null;
    var namedImportsByImportedName = new Map();
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = path.node.specifiers[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var specifier = _step5.value;

        if (specifier.type === 'ImportDefaultSpecifier') {
          defaultImport = specifier;
        } else if (specifier.type === 'ImportNamespaceSpecifier') {
          starImport = specifier;
        } else if (specifier.type === 'ImportSpecifier') {
          namedImportsByImportedName.set(specifier.imported.name, specifier);
        }
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }

    return {
      defaultImport: defaultImport,
      starImport: starImport,
      namedImportsByImportedName: namedImportsByImportedName
    };
  }

  /**
   * Figure out what values are accessed from this import, including attributes
   * pulled off of the default or star imports.
   */
  function findAllMemberAccesses(specifierIndex) {
    var defaultImportAccesses = [];
    var starImportAccesses = [];
    var directAccesses = [];
    if (specifierIndex.defaultImport !== null) {
      var name = specifierIndex.defaultImport.local.name;
      defaultImportAccesses.push.apply(defaultImportAccesses, _toConsumableArray(getMemberAccessesForName(name)));
    }
    if (specifierIndex.starImport !== null) {
      var _name = specifierIndex.starImport.local.name;
      starImportAccesses.push.apply(starImportAccesses, _toConsumableArray(getMemberAccessesForName(_name)));
    }
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = specifierIndex.namedImportsByImportedName.values()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var specifier = _step6.value;

        directAccesses.push(specifier.imported.name);
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6.return) {
          _iterator6.return();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }

    return {
      defaultImportAccesses: defaultImportAccesses,
      starImportAccesses: starImportAccesses,
      directAccesses: directAccesses
    };
  }

  /**
   * Given a name, find all cases in the code where a field is accessed from
   * that name. For example, if objectName is Foo and the code contains Foo.a,
   * Foo.b, and Foo.c, return the set {'a', 'b', 'c'}.
   */
  function getMemberAccessesForName(objectName) {
    var membersAccessed = new Set();
    root.find(j.MemberExpression, {
      object: {
        name: objectName
      }
    }).forEach(function (path) {
      if (path.node.property.type === 'Identifier') {
        membersAccessed.add(path.node.property.name);
      }
    });
    return membersAccessed;
  }

  /**
   * Figure out what types of imports are needed in the resulting code based on
   * what names are actually used and what names are exported by the other
   * module.
   */
  function getImportManifest(exportsInfo, memberAccesses) {
    var defaultImportDirectAccesses = [];
    var defaultImportObjectAccesses = [];
    var namedImportDirectAccesses = [];
    var namedImportObjectAccesses = [];

    var exportedNames = new Set(exportsInfo.namedExports);
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
      for (var _iterator7 = memberAccesses.defaultImportAccesses[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
        var name = _step7.value;

        if (exportedNames.has(name)) {
          namedImportObjectAccesses.push(name);
        } else {
          defaultImportObjectAccesses.push(name);
        }
      }
    } catch (err) {
      _didIteratorError7 = true;
      _iteratorError7 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion7 && _iterator7.return) {
          _iterator7.return();
        }
      } finally {
        if (_didIteratorError7) {
          throw _iteratorError7;
        }
      }
    }

    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
      for (var _iterator8 = memberAccesses.starImportAccesses[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
        var _name2 = _step8.value;

        if (exportedNames.has(_name2)) {
          namedImportObjectAccesses.push(_name2);
        } else {
          defaultImportObjectAccesses.push(_name2);
        }
      }
    } catch (err) {
      _didIteratorError8 = true;
      _iteratorError8 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion8 && _iterator8.return) {
          _iterator8.return();
        }
      } finally {
        if (_didIteratorError8) {
          throw _iteratorError8;
        }
      }
    }

    var _iteratorNormalCompletion9 = true;
    var _didIteratorError9 = false;
    var _iteratorError9 = undefined;

    try {
      for (var _iterator9 = memberAccesses.directAccesses[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
        var _name3 = _step9.value;

        if (exportedNames.has(_name3)) {
          namedImportDirectAccesses.push(_name3);
        } else {
          defaultImportDirectAccesses.push(_name3);
        }
      }
    } catch (err) {
      _didIteratorError9 = true;
      _iteratorError9 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion9 && _iterator9.return) {
          _iterator9.return();
        }
      } finally {
        if (_didIteratorError9) {
          throw _iteratorError9;
        }
      }
    }

    return {
      defaultImportDirectAccesses: defaultImportDirectAccesses,
      defaultImportObjectAccesses: defaultImportObjectAccesses,
      namedImportDirectAccesses: namedImportDirectAccesses,
      namedImportObjectAccesses: namedImportObjectAccesses
    };
  }

  /**
   * Figure out what names to use for the default import and the import *
   * values, based on the existing names (if any) and which ones we actually
   * need.
   */
  function resolveImportObjectNames(specifierIndex, needsDefaultImport, needsStarImport, hasDefaultExport, importPath) {
    var existingDefaultImportName = specifierIndex.defaultImport && specifierIndex.defaultImport.local.name;
    var existingStarImportName = specifierIndex.starImport && specifierIndex.starImport.local.name;

    var defaultImportName = null;
    var starImportName = null;

    if ((!needsDefaultImport || existingDefaultImportName !== null) && (!needsStarImport || existingStarImportName !== null)) {
      // If we already have all the names we need, then no name-generation required!
      // Just use them.
      if (needsDefaultImport) {
        defaultImportName = existingDefaultImportName;
      }
      if (needsStarImport) {
        starImportName = existingStarImportName;
      }
    } else if (needsDefaultImport && hasDefaultExport && existingDefaultImportName !== null) {
      // If we potentially use the default import for anything other than object
      // accesses, then we prefer to keep the name as-is, so special-case that.
      defaultImportName = existingDefaultImportName;
      if (needsStarImport) {
        starImportName = findFreeName(defaultImportName + 'Exports');
      }
    } else if (needsDefaultImport) {
      // Otherwise, we need to fill in at least one name and there aren't any
      // specific constraints that we have to follow. Give the default import
      // naming priority. If we also need a star import, give it a name based
      // on our default name.
      if (existingDefaultImportName !== null) {
        defaultImportName = existingDefaultImportName;
      } else if (existingStarImportName !== null && !needsStarImport) {
        defaultImportName = existingStarImportName;
      } else if (existingStarImportName !== null && needsStarImport) {
        defaultImportName = findFreeName(existingStarImportName + 'Default');
      } else {
        defaultImportName = findFreeName(inferNameFromImportPath(importPath));
      }
      if (needsStarImport) {
        if (existingStarImportName !== null) {
          starImportName = existingStarImportName;
        } else {
          starImportName = findFreeName(defaultImportName + 'Exports');
        }
      }
    } else if (needsStarImport) {
      // Otherwise, we might need a star import name but no default import name.
      // Try using the existing name or stealing from the default name if
      // possible. If not, come up with a new name from the path.
      if (existingStarImportName !== null) {
        starImportName = existingStarImportName;
      } else if (existingDefaultImportName !== null) {
        starImportName = existingDefaultImportName;
      } else {
        starImportName = findFreeName(inferNameFromImportPath(importPath));
      }
    }

    return { defaultImportName: defaultImportName, starImportName: starImportName };
  }

  /**
   * Guess a nice capitalized camelCase name from a filename on an import. For
   * example, './util/dashed-name' becomes 'DashedName'.
   */
  function inferNameFromImportPath(importPath) {
    var lastSlashIndex = importPath.lastIndexOf('/');
    var filename = importPath;
    if (lastSlashIndex > -1) {
      filename = filename.substr(lastSlashIndex + 1);
    }
    if (filename.endsWith('.js')) {
      filename = filename.substr(0, filename.length - 3);
    }
    return camelCaseName(filename);
  }

  /**
   * Convert the given string to a capitalized camelCase name.
   *
   * Somewhat based on this discussion:
   * http://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
   */
  function camelCaseName(name) {
    return name.replace(/(^|[ \-_])(.)/g, function (match) {
      return match.toUpperCase();
    }).replace(/[ \-_]/g, '');
  }

  /**
   * Find a variable name that is unused in the code to avoid name clashes with
   * existing names.
   */
  function findFreeName(desiredName) {
    if (!isNameTaken(desiredName)) {
      return desiredName;
    }
    for (var i = 1; i < 5000; i++) {
      var name = '' + desiredName + i;
      if (!isNameTaken(name)) {
        return name;
      }
    }
    throw new Error('Could not find a suitable name.');
  }

  function isNameTaken(desiredName) {
    return root.find(j.Identifier, { name: desiredName }).size() > 0;
  }

  /**
   * Create the direct contents of the import statement. This may include a
   * default import, a star import, and/or a list of named imports. Note that
   * we are now allowed to have both a star import and named imports, so if we
   * need both, we do a star import and will destructure it later.
   */
  function createImportSpecifiers(defaultImportName, starImportName, specifierIndex, importManifest) {
    var specifiers = [];
    if (defaultImportName) {
      if (specifierIndex.defaultImport !== null) {
        specifiers.push(specifierIndex.defaultImport);
      } else {
        specifiers.push(j.importDefaultSpecifier(j.identifier(defaultImportName)));
      }
    }
    if (starImportName) {
      if (specifierIndex.starImport !== null) {
        specifiers.push(specifierIndex.starImport);
      } else {
        specifiers.push(j.importNamespaceSpecifier(j.identifier(starImportName)));
      }
    }
    // If we don't have a star import, named imports can go directly in the
    // import statement. Otherwise we'll need to destructure them from the star
    // import later.
    if (!starImportName) {
      var _iteratorNormalCompletion10 = true;
      var _didIteratorError10 = false;
      var _iteratorError10 = undefined;

      try {
        for (var _iterator10 = importManifest.namedImportDirectAccesses[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
          var importName = _step10.value;

          specifiers.push(specifierIndex.namedImportsByImportedName.get(importName));
        }
      } catch (err) {
        _didIteratorError10 = true;
        _iteratorError10 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion10 && _iterator10.return) {
            _iterator10.return();
          }
        } finally {
          if (_didIteratorError10) {
            throw _iteratorError10;
          }
        }
      }
    }
    return specifiers;
  }

  /**
   * Do a rename operation to handle object-style accesses. For example, if we
   * have the import line `import Foo, * as FooExports from './Foo';` and a line
   * in the code is `Foo.bar`, but `bar` is a named export on the foo module, we
   * need to rename the reference in the code to `FooExports.bar`.
   */
  function renameObjectAccesses(defaultImportName, starImportName, importManifest) {
    var defaultImportProperties = new Set(importManifest.defaultImportObjectAccesses);
    var starImportProperties = new Set(importManifest.namedImportObjectAccesses);
    root.find(j.MemberExpression).replaceWith(function (path) {
      var _path$node = path.node,
          object = _path$node.object,
          property = _path$node.property;

      if (object.type !== 'Identifier' || object.name !== defaultImportName && object.name !== starImportName || property.type !== 'Identifier') {
        return path.node;
      }
      if (defaultImportProperties.has(property.name)) {
        object.name = defaultImportName;
      }
      if (starImportProperties.has(property.name)) {
        object.name = starImportName;
      }
      return path.node;
    });
  }

  /**
   * Create a destructure statement after the import statement. This is a way
   * to simulate named imports for default imports and star imports.
   */
  function insertImportDestructure(path, importNames, specifierIndex, fullImportName) {
    var destructureFields = importNames.map(function (importName) {
      var specifier = specifierIndex.namedImportsByImportedName.get(importName);
      return {
        accessName: specifier.imported.name,
        boundName: specifier.local.name
      };
    });
    path.insertAfter(makeDestructureStatement(destructureFields, fullImportName));
  }

  function makeDestructureStatement(destructureFields, objName) {
    var properties = destructureFields.map(function (_ref) {
      var accessName = _ref.accessName,
          boundName = _ref.boundName;

      var property = j.property('init', j.identifier(accessName), j.identifier(boundName));
      if (accessName === boundName) {
        property.shorthand = true;
      }
      return property;
    });
    return j.variableDeclaration('const', [j.variableDeclarator(j.objectPattern(properties), j.identifier(objName))]);
  }

  return convertFile();
};

var _fs = require('fs');

var _path = require('path');

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                     * Script that fixes import styles to properly match the export style of the
                                                                                                                                                                                                     * file being imported. Since decaffeinate doesn't do whole-codebase analysis,
                                                                                                                                                                                                     * we need to do this as a follow-up step.
                                                                                                                                                                                                     *
                                                                                                                                                                                                     * Note that this conversion runs on ALL project files (or, at least, any files
                                                                                                                                                                                                     * that could import a converted file). In general, it can handle any import
                                                                                                                                                                                                     * statement, read the exports of the file being imported, and adjust the import
                                                                                                                                                                                                     * usage to properly use the named/default exports as necessary.
                                                                                                                                                                                                     *
                                                                                                                                                                                                     * See the test examples starting with "fix-imports" for lots of examples.
                                                                                                                                                                                                     *
                                                                                                                                                                                                     * The script is quite thorough and mostly correct, but it can fail in the case
                                                                                                                                                                                                     * of variable shadowing, dynamic usages of a default import or an import *
                                                                                                                                                                                                     * object, or code that depends on the "live binding" behavior of imports, and
                                                                                                                                                                                                     * likely other subtle cases.
                                                                                                                                                                                                     *
                                                                                                                                                                                                     * See https://github.com/decaffeinate/decaffeinate/issues/402 for some more
                                                                                                                                                                                                     * details on why decaffeinate can't solve this itself.
                                                                                                                                                                                                     */


/**
 * Little helper since we don't have Array.prototype.includes.
 */
function includes(arr, elem) {
  return arr.indexOf(elem) > -1;
}