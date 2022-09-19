'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var babelPolyfill = require('babel-polyfill');
var commander = _interopDefault(require('commander'));
var mz_fs = require('mz/fs');
var path = require('path');
var git = _interopDefault(require('simple-git/promise'));
var executable = _interopDefault(require('executable'));
var mz_child_process = require('mz/child_process');
var moment = _interopDefault(require('moment'));
var readline = _interopDefault(require('mz/readline'));
var requireUncached = _interopDefault(require('require-uncached'));
var child_process = require('child_process');
var fsPromise = require('fs-promise');
var zlib = _interopDefault(require('zlib'));
var opn = _interopDefault(require('opn'));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var jsx = function () {
  var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7;
  return function createRawReactElement(type, props, key, children) {
    var defaultProps = type && type.defaultProps;
    var childrenLength = arguments.length - 3;

    if (!props && childrenLength !== 0) {
      props = {};
    }

    if (props && defaultProps) {
      for (var propName in defaultProps) {
        if (props[propName] === void 0) {
          props[propName] = defaultProps[propName];
        }
      }
    } else if (!props) {
      props = defaultProps || {};
    }

    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);

      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 3];
      }

      props.children = childArray;
    }

    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type: type,
      key: key === undefined ? null : '' + key,
      ref: null,
      props: props,
      _owner: null
    };
  };
}();

var asyncIterator = function (iterable) {
  if (typeof Symbol === "function") {
    if (Symbol.asyncIterator) {
      var method = iterable[Symbol.asyncIterator];
      if (method != null) return method.call(iterable);
    }

    if (Symbol.iterator) {
      return iterable[Symbol.iterator]();
    }
  }

  throw new TypeError("Object is not async iterable");
};

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve$$1, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve$$1,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

var asyncGeneratorDelegate = function (inner, awaitWrap) {
  var iter = {},
      waiting = false;

  function pump(key, value) {
    waiting = true;
    value = new Promise(function (resolve$$1) {
      resolve$$1(inner[key](value));
    });
    return {
      done: false,
      value: awaitWrap(value)
    };
  }

  

  if (typeof Symbol === "function" && Symbol.iterator) {
    iter[Symbol.iterator] = function () {
      return this;
    };
  }

  iter.next = function (value) {
    if (waiting) {
      waiting = false;
      return value;
    }

    return pump("next", value);
  };

  if (typeof inner.throw === "function") {
    iter.throw = function (value) {
      if (waiting) {
        waiting = false;
        throw value;
      }

      return pump("throw", value);
    };
  }

  if (typeof inner.return === "function") {
    iter.return = function (value) {
      return pump("return", value);
    };
  }

  return iter;
};

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve$$1, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve$$1(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var defineEnumerableProperties = function (obj, descs) {
  for (var key in descs) {
    var desc = descs[key];
    desc.configurable = desc.enumerable = true;
    if ("value" in desc) desc.writable = true;
    Object.defineProperty(obj, key, desc);
  }

  return obj;
};

var defaults = function (obj, defaults) {
  var keys = Object.getOwnPropertyNames(defaults);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = Object.getOwnPropertyDescriptor(defaults, key);

    if (value && value.configurable && obj[key] === undefined) {
      Object.defineProperty(obj, key, value);
    }
  }

  return obj;
};

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var _instanceof = function (left, right) {
  if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
    return right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
};

var interopRequireDefault = function (obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
};

var interopRequireWildcard = function (obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj.default = obj;
    return newObj;
  }
};

var newArrowCheck = function (innerThis, boundThis) {
  if (innerThis !== boundThis) {
    throw new TypeError("Cannot instantiate an arrow function");
  }
};

var objectDestructuringEmpty = function (obj) {
  if (obj == null) throw new TypeError("Cannot destructure undefined");
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var selfGlobal = typeof global === "undefined" ? self : global;

var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var slicedToArrayLoose = function (arr, i) {
  if (Array.isArray(arr)) {
    return arr;
  } else if (Symbol.iterator in Object(arr)) {
    var _arr = [];

    for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
      _arr.push(_step.value);

      if (i && _arr.length === i) break;
    }

    return _arr;
  } else {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }
};

var taggedTemplateLiteral = function (strings, raw) {
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
};

var taggedTemplateLiteralLoose = function (strings, raw) {
  strings.raw = raw;
  return strings;
};

var temporalRef = function (val, name, undef) {
  if (val === undef) {
    throw new ReferenceError(name + " is not defined - temporal dead zone");
  } else {
    return val;
  }
};

var temporalUndefined = {};

var toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};



var babelHelpers$1 = Object.freeze({
	jsx: jsx,
	asyncIterator: asyncIterator,
	asyncGenerator: asyncGenerator,
	asyncGeneratorDelegate: asyncGeneratorDelegate,
	asyncToGenerator: asyncToGenerator,
	classCallCheck: classCallCheck,
	createClass: createClass,
	defineEnumerableProperties: defineEnumerableProperties,
	defaults: defaults,
	defineProperty: defineProperty,
	get: get,
	inherits: inherits,
	interopRequireDefault: interopRequireDefault,
	interopRequireWildcard: interopRequireWildcard,
	newArrowCheck: newArrowCheck,
	objectDestructuringEmpty: objectDestructuringEmpty,
	objectWithoutProperties: objectWithoutProperties,
	possibleConstructorReturn: possibleConstructorReturn,
	selfGlobal: selfGlobal,
	set: set,
	slicedToArray: slicedToArray,
	slicedToArrayLoose: slicedToArrayLoose,
	taggedTemplateLiteral: taggedTemplateLiteral,
	taggedTemplateLiteralLoose: taggedTemplateLiteralLoose,
	temporalRef: temporalRef,
	temporalUndefined: temporalUndefined,
	toArray: toArray,
	toConsumableArray: toConsumableArray,
	typeof: _typeof,
	extends: _extends,
	instanceof: _instanceof
});

var PREFIX = 'bulk-decaffeinate CLIError: ';

/**
 * Exception class for a nice-looking error.
 *
 * Apparently async/await propagation doesn't preserve the exception, so to work
 * around this, we put a special prefix at the start of CLI errors and format
 * the error without a stack trace if the message starts with that prefix.
 */

var CLIError = function (_Error) {
  inherits(CLIError, _Error);

  function CLIError(message) {
    classCallCheck(this, CLIError);
    return possibleConstructorReturn(this, (CLIError.__proto__ || Object.getPrototypeOf(CLIError)).call(this, PREFIX + message));
  }

  createClass(CLIError, null, [{
    key: 'formatError',
    value: function formatError(e) {
      if (!e) {
        return e;
      }
      if (e.message.startsWith(PREFIX)) {
        return e.message.substring(PREFIX.length);
      } else {
        return e;
      }
    }
  }]);
  return CLIError;
}(Error);

/**
 * Read a list of files from a file and return it. Verify that all files
 * actually exist.
 */
var getFilesFromPathFile$1 = (function getFilesFromPathFile(filePath) {
  var fileContents, lines, resultLines, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, line;

  return regeneratorRuntime.async(function getFilesFromPathFile$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(mz_fs.readFile(filePath));

        case 2:
          fileContents = _context.sent;
          lines = fileContents.toString().split('\n');
          resultLines = [];
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 8;
          _iterator = lines[Symbol.iterator]();

        case 10:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 23;
            break;
          }

          line = _step.value;

          line = line.trim();

          if (!(line.length === 0 || line.startsWith('#'))) {
            _context.next = 15;
            break;
          }

          return _context.abrupt('continue', 20);

        case 15:
          _context.next = 17;
          return regeneratorRuntime.awrap(mz_fs.exists(line));

        case 17:
          if (_context.sent) {
            _context.next = 19;
            break;
          }

          throw new CLIError('The file "' + line + '" did not exist.');

        case 19:
          resultLines.push(line);

        case 20:
          _iteratorNormalCompletion = true;
          _context.next = 10;
          break;

        case 23:
          _context.next = 29;
          break;

        case 25:
          _context.prev = 25;
          _context.t0 = _context['catch'](8);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 29:
          _context.prev = 29;
          _context.prev = 30;

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }

        case 32:
          _context.prev = 32;

          if (!_didIteratorError) {
            _context.next = 35;
            break;
          }

          throw _iteratorError;

        case 35:
          return _context.finish(32);

        case 36:
          return _context.finish(29);

        case 37:
          return _context.abrupt('return', resultLines);

        case 38:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this, [[8, 25, 29, 37], [30,, 32, 36]]);
});

/**
 * Recursively discover any matching files in the current directory, ignoring
 * things like node_modules and .git.
 */
var getFilesUnderPath$1 = (function getFilesUnderPath(dirPath, asyncPathPredicate) {
  var resultFiles, children, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, child, childPath, subdirCoffeeFiles;

  return regeneratorRuntime.async(function getFilesUnderPath$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          resultFiles = [];
          _context.next = 3;
          return regeneratorRuntime.awrap(mz_fs.readdir(dirPath));

        case 3:
          children = _context.sent;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 7;
          _iterator = children[Symbol.iterator]();

        case 9:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 30;
            break;
          }

          child = _step.value;

          if (!['node_modules', '.git'].includes(child)) {
            _context.next = 13;
            break;
          }

          return _context.abrupt('continue', 27);

        case 13:
          childPath = path.resolve(path.join(dirPath, child));
          _context.next = 16;
          return regeneratorRuntime.awrap(mz_fs.stat(childPath));

        case 16:
          if (!_context.sent.isDirectory()) {
            _context.next = 23;
            break;
          }

          _context.next = 19;
          return regeneratorRuntime.awrap(getFilesUnderPath(childPath, asyncPathPredicate));

        case 19:
          subdirCoffeeFiles = _context.sent;

          resultFiles.push.apply(resultFiles, toConsumableArray(subdirCoffeeFiles));
          _context.next = 27;
          break;

        case 23:
          _context.next = 25;
          return regeneratorRuntime.awrap(asyncPathPredicate(childPath));

        case 25:
          if (!_context.sent) {
            _context.next = 27;
            break;
          }

          resultFiles.push(childPath);

        case 27:
          _iteratorNormalCompletion = true;
          _context.next = 9;
          break;

        case 30:
          _context.next = 36;
          break;

        case 32:
          _context.prev = 32;
          _context.t0 = _context['catch'](7);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 36:
          _context.prev = 36;
          _context.prev = 37;

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }

        case 39:
          _context.prev = 39;

          if (!_didIteratorError) {
            _context.next = 42;
            break;
          }

          throw _iteratorError;

        case 42:
          return _context.finish(39);

        case 43:
          return _context.finish(36);

        case 44:
          return _context.abrupt('return', resultFiles);

        case 45:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this, [[7, 32, 36, 44], [37,, 39, 43]]);
});

var getTrackedFiles$1 = (function getTrackedFiles() {
  var stdout;
  return regeneratorRuntime.async(function getTrackedFiles$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(git().raw(['ls-files']));

        case 2:
          stdout = _context.sent;
          return _context.abrupt('return', new Set(stdout.split('\n').map(function (s) {
            return s.trim();
          }).map(function (s) {
            return path.resolve(s);
          })));

        case 4:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
});

var COFFEE_FILE_RECOGNIZER = {
  extensions: ['.coffee', '.litcoffee', '.coffee.md'],
  shebangSuffix: 'coffee'
};

var JS_FILE_RECOGNIZER = {
  extensions: ['.js'],
  shebangSuffix: 'node'
};

function extensionFor(path$$1) {
  if (path$$1.endsWith('.coffee.md')) {
    return '.coffee.md';
  }
  return path.extname(path$$1);
}

function basePathFor(path$$1) {
  var extension = extensionFor(path$$1);
  return path.join(path.dirname(path$$1), path.basename(path$$1, extension));
}

function shouldConvertFile(path$$1, recognizer, trackedFiles) {
  return regeneratorRuntime.async(function shouldConvertFile$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.t0 = !hasRecognizedExtension(path$$1, recognizer);

          if (!_context.t0) {
            _context.next = 5;
            break;
          }

          _context.next = 4;
          return regeneratorRuntime.awrap(isExecutableScript(path$$1, recognizer));

        case 4:
          _context.t0 = !_context.sent;

        case 5:
          if (!_context.t0) {
            _context.next = 7;
            break;
          }

          return _context.abrupt('return', false);

        case 7:
          if (trackedFiles.has(path$$1)) {
            _context.next = 10;
            break;
          }

          console.log('Warning: Skipping ' + path$$1 + ' because the file is not tracked in the git repo.');
          return _context.abrupt('return', false);

        case 10:
          return _context.abrupt('return', true);

        case 11:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
}

function hasRecognizedExtension(path$$1, recognizer) {
  return recognizer.extensions.some(function (ext) {
    return path$$1.endsWith(ext) && !path$$1.endsWith('.original' + ext);
  });
}

function isExecutableScript(path$$1, recognizer) {
  var contents, firstLine;
  return regeneratorRuntime.async(function isExecutableScript$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.t0 = isExtensionless(path$$1);

          if (!_context2.t0) {
            _context2.next = 5;
            break;
          }

          _context2.next = 4;
          return regeneratorRuntime.awrap(executable(path$$1));

        case 4:
          _context2.t0 = _context2.sent;

        case 5:
          if (!_context2.t0) {
            _context2.next = 12;
            break;
          }

          _context2.next = 8;
          return regeneratorRuntime.awrap(mz_fs.readFile(path$$1));

        case 8:
          contents = _context2.sent;
          firstLine = contents.toString().split('\n')[0];

          if (!(firstLine.startsWith('#!') && firstLine.includes(recognizer.shebangSuffix))) {
            _context2.next = 12;
            break;
          }

          return _context2.abrupt('return', true);

        case 12:
          return _context2.abrupt('return', false);

        case 13:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
}

function isExtensionless(path$$1) {
  return extensionFor(path$$1) === '';
}

function backupPathFor(path$$1) {
  var extension = extensionFor(path$$1);
  var basePath = basePathFor(path$$1);
  return basePath + '.original' + extension;
}

/**
 * The resulting path where we should send the given input file. Note that when
 * the input file is an extensionless script, we prefer to keep it extensionless
 * (and decaffeinate handles the shebang line).
 */
function jsPathFor(path$$1, config) {
  if (config.customNames[path$$1]) {
    return config.customNames[path$$1];
  }
  if (isExtensionless(path$$1)) {
    return path$$1;
  } else {
    return basePathFor(path$$1) + '.' + config.outputFileExtension;
  }
}

/**
 * The file generated by decaffeinate for the input file with this name.
 */
function decaffeinateOutPathFor(path$$1) {
  return basePathFor(path$$1) + '.js';
}

function isLiterate(path$$1) {
  return path$$1.endsWith('.litcoffee') || path$$1.endsWith('.coffee.md');
}

/**
 * Get the files that we should process based on the config. "recognizer" should
 * be an object describing the files to auto-recognize, e.g.
 * COFFEE_FILE_RECOGNIZER.
 */
var getFilesToProcess$1 = (function getFilesToProcess(config, recognizer) {
  var filesToProcess;
  return regeneratorRuntime.async(function getFilesToProcess$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(resolveFilesToProcess(config, recognizer));

        case 2:
          filesToProcess = _context.sent;

          filesToProcess = resolveFileFilter(filesToProcess, config);
          _context.next = 6;
          return regeneratorRuntime.awrap(validateFilesToProcess(filesToProcess, config));

        case 6:
          return _context.abrupt('return', filesToProcess);

        case 7:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
});

function resolveFilesToProcess(config, recognizer) {
  var _this = this;

  var filesToProcess, pathFile, searchDirectory, trackedFiles, files, _files, _files2, _files3, _trackedFiles;

  return regeneratorRuntime.async(function resolveFilesToProcess$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          filesToProcess = config.filesToProcess, pathFile = config.pathFile, searchDirectory = config.searchDirectory;

          if (!(!filesToProcess && !pathFile && !searchDirectory)) {
            _context4.next = 8;
            break;
          }

          _context4.next = 4;
          return regeneratorRuntime.awrap(getTrackedFiles$1());

        case 4:
          trackedFiles = _context4.sent;
          _context4.next = 7;
          return regeneratorRuntime.awrap(getFilesUnderPath$1('.', function _callee(path$$1) {
            return regeneratorRuntime.async(function _callee$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(shouldConvertFile(path$$1, recognizer, trackedFiles));

                  case 2:
                    return _context2.abrupt('return', _context2.sent);

                  case 3:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, null, _this);
          }));

        case 7:
          return _context4.abrupt('return', _context4.sent);

        case 8:
          files = [];

          if (filesToProcess) {
            (_files = files).push.apply(_files, toConsumableArray(filesToProcess));
          }

          if (!pathFile) {
            _context4.next = 19;
            break;
          }

          _context4.t0 = (_files2 = files).push;
          _context4.t1 = _files2;
          _context4.t2 = babelHelpers$1;
          _context4.next = 16;
          return regeneratorRuntime.awrap(getFilesFromPathFile$1(pathFile));

        case 16:
          _context4.t3 = _context4.sent;
          _context4.t4 = _context4.t2.toConsumableArray.call(_context4.t2, _context4.t3);

          _context4.t0.apply.call(_context4.t0, _context4.t1, _context4.t4);

        case 19:
          if (!searchDirectory) {
            _context4.next = 31;
            break;
          }

          _context4.next = 22;
          return regeneratorRuntime.awrap(getTrackedFiles$1());

        case 22:
          _trackedFiles = _context4.sent;
          _context4.t5 = (_files3 = files).push;
          _context4.t6 = _files3;
          _context4.t7 = babelHelpers$1;
          _context4.next = 28;
          return regeneratorRuntime.awrap(getFilesUnderPath$1(searchDirectory, function _callee2(path$$1) {
            return regeneratorRuntime.async(function _callee2$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return regeneratorRuntime.awrap(shouldConvertFile(path$$1, recognizer, _trackedFiles));

                  case 2:
                    return _context3.abrupt('return', _context3.sent);

                  case 3:
                  case 'end':
                    return _context3.stop();
                }
              }
            }, null, _this);
          }));

        case 28:
          _context4.t8 = _context4.sent;
          _context4.t9 = _context4.t7.toConsumableArray.call(_context4.t7, _context4.t8);

          _context4.t5.apply.call(_context4.t5, _context4.t6, _context4.t9);

        case 31:
          files = files.map(function (path$$1) {
            return path.resolve(path$$1);
          });
          files = Array.from(new Set(files)).sort();
          return _context4.abrupt('return', files);

        case 34:
        case 'end':
          return _context4.stop();
      }
    }
  }, null, this);
}

function resolveFileFilter(filesToProcess, config) {
  if (!config.fileFilterFn) {
    return filesToProcess;
  }
  return filesToProcess.filter(function (path$$1) {
    return config.fileFilterFn(path$$1);
  });
}

function validateFilesToProcess(filesToProcess, config) {
  var trackedFiles, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, path$$1, jsPath;

  return regeneratorRuntime.async(function validateFilesToProcess$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(getTrackedFiles$1());

        case 2:
          trackedFiles = _context5.sent;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context5.prev = 6;
          _iterator = filesToProcess[Symbol.iterator]();

        case 8:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context5.next = 23;
            break;
          }

          path$$1 = _step.value;

          if (trackedFiles.has(path$$1)) {
            _context5.next = 12;
            break;
          }

          throw new CLIError('The file ' + path$$1 + ' is not tracked in the git repo.');

        case 12:
          jsPath = jsPathFor(path$$1, config);
          _context5.t0 = jsPath !== path$$1;

          if (!_context5.t0) {
            _context5.next = 18;
            break;
          }

          _context5.next = 17;
          return regeneratorRuntime.awrap(mz_fs.exists(jsPath));

        case 17:
          _context5.t0 = _context5.sent;

        case 18:
          if (!_context5.t0) {
            _context5.next = 20;
            break;
          }

          throw new CLIError('The file ' + jsPath + ' already exists.');

        case 20:
          _iteratorNormalCompletion = true;
          _context5.next = 8;
          break;

        case 23:
          _context5.next = 29;
          break;

        case 25:
          _context5.prev = 25;
          _context5.t1 = _context5['catch'](6);
          _didIteratorError = true;
          _iteratorError = _context5.t1;

        case 29:
          _context5.prev = 29;
          _context5.prev = 30;

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }

        case 32:
          _context5.prev = 32;

          if (!_didIteratorError) {
            _context5.next = 35;
            break;
          }

          throw _iteratorError;

        case 35:
          return _context5.finish(32);

        case 36:
          return _context5.finish(29);

        case 37:
        case 'end':
          return _context5.stop();
      }
    }
  }, null, this, [[6, 25, 29, 37], [30,, 32, 36]]);
}

function makeCLIFn(commandByPath) {
  return function _callee(path$$1) {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(mz_child_process.exec(commandByPath(path$$1), { maxBuffer: 5 * 1024 * 1024 }));

          case 3:
            return _context.abrupt('return', { path: path$$1, error: null });

          case 6:
            _context.prev = 6;
            _context.t0 = _context['catch'](0);
            return _context.abrupt('return', { path: path$$1, error: _context.t0.message });

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, null, this, [[0, 6]]);
  };
}

function makeDecaffeinateVerifyFn(config) {
  var decaffeinatePath = config.decaffeinatePath,
      decaffeinateArgs = config.decaffeinateArgs;

  return makeCLIFn(function (path$$1) {
    var literateFlag = isLiterate(path$$1) ? '--literate' : '';
    return decaffeinatePath + ' ' + literateFlag + ' ' + decaffeinateArgs.join(' ') + ' < ' + path$$1;
  });
}

/**
 * Run the given one-argument async function on an array of arguments, keeping a
 * logical worker pool to increase throughput without overloading the system.
 *
 * Results are provided as they come in with the result handler. Results look
 * like {index: 3, result: "Hello"}. This can be used e.g. to update a progress
 * bar.
 *
 * An array of all results is returned at the end.
 */
var runInParallel$1 = (function runInParallel(args, asyncFn, numConcurrentProcesses, resultHandler) {
  var _this = this;

  var results, activePromises, handleResult, _loop, i;

  return regeneratorRuntime.async(function runInParallel$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          results = [];
          activePromises = {};

          handleResult = function handleResult(_ref) {
            var index = _ref.index,
                result = _ref.result;

            results[index] = result;
            delete activePromises[index];
            resultHandler({ index: index, result: result });
          };

          _loop = function _callee2(i) {
            var arg;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    arg = args[i];

                    activePromises[i] = function _callee() {
                      return regeneratorRuntime.async(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              _context.t0 = i;
                              _context.next = 3;
                              return regeneratorRuntime.awrap(asyncFn(arg));

                            case 3:
                              _context.t1 = _context.sent;
                              return _context.abrupt("return", {
                                index: _context.t0,
                                result: _context.t1
                              });

                            case 5:
                            case "end":
                              return _context.stop();
                          }
                        }
                      }, null, this);
                    }();

                    if (!(Object.keys(activePromises).length >= numConcurrentProcesses)) {
                      _context2.next = 8;
                      break;
                    }

                    _context2.t0 = handleResult;
                    _context2.next = 6;
                    return regeneratorRuntime.awrap(Promise.race(Object.values(activePromises)));

                  case 6:
                    _context2.t1 = _context2.sent;
                    (0, _context2.t0)(_context2.t1);

                  case 8:
                  case "end":
                    return _context2.stop();
                }
              }
            }, null, _this);
          };

          i = 0;

        case 5:
          if (!(i < args.length)) {
            _context3.next = 11;
            break;
          }

          _context3.next = 8;
          return regeneratorRuntime.awrap(_loop(i));

        case 8:
          i++;
          _context3.next = 5;
          break;

        case 11:
          if (!(Object.keys(activePromises).length > 0)) {
            _context3.next = 19;
            break;
          }

          _context3.t0 = handleResult;
          _context3.next = 15;
          return regeneratorRuntime.awrap(Promise.race(Object.values(activePromises)));

        case 15:
          _context3.t1 = _context3.sent;
          (0, _context3.t0)(_context3.t1);
          _context3.next = 11;
          break;

        case 19:
          return _context3.abrupt("return", results);

        case 20:
        case "end":
          return _context3.stop();
      }
    }
  }, null, this);
});

function pluralize(num, noun) {
  return num === 1 ? num + " " + noun : num + " " + noun + "s";
}

/**
 * Copied from moment-precise-range, which is MIT-licensed, with minor cleanups
 * to appease ESLint and remove an unused option.
 *
 * https://github.com/codebox/moment-precise-range
 *
 * The original plugin worked by modifying the global moment installation, which
 * caused problems if multiple moment instances were installed, so this should
 * avoid that.
 */

var STRINGS = {
  nodiff: '',
  year: 'year',
  years: 'years',
  month: 'month',
  months: 'months',
  day: 'day',
  days: 'days',
  hour: 'hour',
  hours: 'hours',
  minute: 'minute',
  minutes: 'minutes',
  second: 'second',
  seconds: 'seconds',
  delimiter: ' '
};

function pluralize$1(num, word) {
  return num + ' ' + STRINGS[word + (num === 1 ? '' : 's')];
}

function buildStringFromValues(yDiff, mDiff, dDiff, hourDiff, minDiff, secDiff) {
  var result = [];

  if (yDiff) {
    result.push(pluralize$1(yDiff, 'year'));
  }
  if (mDiff) {
    result.push(pluralize$1(mDiff, 'month'));
  }
  if (dDiff) {
    result.push(pluralize$1(dDiff, 'day'));
  }
  if (hourDiff) {
    result.push(pluralize$1(hourDiff, 'hour'));
  }
  if (minDiff) {
    result.push(pluralize$1(minDiff, 'minute'));
  }
  if (secDiff) {
    result.push(pluralize$1(secDiff, 'second'));
  }

  return result.join(STRINGS.delimiter);
}

function momentPreciseDiff(m1, m2) {
  m1.add(m2.utcOffset() - m1.utcOffset(), 'minutes'); // shift timezone of m1 to m2

  if (m1.isSame(m2)) {
    return STRINGS.nodiff;
  }

  if (m1.isAfter(m2)) {
    var tmp = m1;
    m1 = m2;
    m2 = tmp;
  }

  var yDiff = m2.year() - m1.year();
  var mDiff = m2.month() - m1.month();
  var dDiff = m2.date() - m1.date();
  var hourDiff = m2.hour() - m1.hour();
  var minDiff = m2.minute() - m1.minute();
  var secDiff = m2.second() - m1.second();

  if (secDiff < 0) {
    secDiff = 60 + secDiff;
    minDiff--;
  }
  if (minDiff < 0) {
    minDiff = 60 + minDiff;
    hourDiff--;
  }
  if (hourDiff < 0) {
    hourDiff = 24 + hourDiff;
    dDiff--;
  }
  if (dDiff < 0) {
    var daysInLastFullMonth = moment(m2.year() + '-' + (m2.month() + 1), 'YYYY-MM').subtract(1, 'M').daysInMonth();
    if (daysInLastFullMonth < m1.date()) {
      // 31/01 -> 2/03
      dDiff = daysInLastFullMonth + dDiff + (m1.date() - daysInLastFullMonth);
    } else {
      dDiff = daysInLastFullMonth + dDiff;
    }
    mDiff--;
  }
  if (mDiff < 0) {
    mDiff = 12 + mDiff;
    yDiff--;
  }

  return buildStringFromValues(yDiff, mDiff, dDiff, hourDiff, minDiff, secDiff);
}

/**
 * Run the given command in parallel, showing a progress bar of results.
 *
 * The provided async function should return an object that at least contains
 * a field called "error" that is truthy if there was a problem, but may contain
 * any other fields.
 */
var runWithProgressBar$1 = (function runWithProgressBar(config, description, files, asyncFn) {
  var _ref = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
      runInSeries = _ref.runInSeries,
      allowFailures = _ref.allowFailures;

  var numProcessed, numFailures, numTotal, startTime, numConcurrentProcesses, results, endTime, diffStr;
  return regeneratorRuntime.async(function runWithProgressBar$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          numProcessed = 0;
          numFailures = 0;
          numTotal = files.length;
          startTime = moment();
          numConcurrentProcesses = runInSeries ? 1 : config.numWorkers;

          console.log(description + ' (' + pluralize(numConcurrentProcesses, 'worker') + ')');
          results = void 0;
          _context.prev = 7;
          _context.next = 10;
          return regeneratorRuntime.awrap(runInParallel$1(files, asyncFn, numConcurrentProcesses, function (_ref2) {
            var result = _ref2.result;

            if (result && result.error) {
              if (!allowFailures) {
                throw new CLIError('Error:\n' + result.error);
              }
              numFailures++;
            }
            numProcessed++;
            var errorString = numFailures === 0 ? '' : ' (' + pluralize(numFailures, 'failure') + ' so far)';
            process.stdout.write('\r' + numProcessed + '/' + numTotal + errorString);
          }));

        case 10:
          results = _context.sent;

        case 11:
          _context.prev = 11;

          process.stdout.write('\n');
          endTime = moment();
          diffStr = momentPreciseDiff(startTime, endTime) || '0 seconds';

          console.log('Finished in ' + diffStr + ' (Time: ' + moment().format() + ')');
          return _context.finish(11);

        case 17:
          return _context.abrupt('return', results);

        case 18:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this, [[7,, 11, 17]]);
});

var check$1 = (function check(config) {
  var filesToProcess, decaffeinateResults;
  return regeneratorRuntime.async(function check$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(getFilesToProcess$1(config, COFFEE_FILE_RECOGNIZER));

        case 2:
          filesToProcess = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(runWithProgressBar$1(config, 'Doing a dry run of decaffeinate on ' + pluralize(filesToProcess.length, 'file') + '...', filesToProcess, makeDecaffeinateVerifyFn(config), { allowFailures: true }));

        case 5:
          decaffeinateResults = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(printResults(decaffeinateResults));

        case 8:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
});

function printResults(results) {
  var errorResults, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, result, successPaths;

  return regeneratorRuntime.async(function printResults$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          errorResults = results.filter(function (r) {
            return r.error !== null;
          });

          if (!(errorResults.length === 0)) {
            _context2.next = 6;
            break;
          }

          console.log('All checks succeeded! decaffeinate can convert all ' + pluralize(results.length, 'file') + '.');
          console.log('Run "bulk-decaffeinate convert" to convert the files to JavaScript.');
          _context2.next = 37;
          break;

        case 6:
          console.log(pluralize(errorResults.length, 'file') + ' failed to convert:');
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 10;
          for (_iterator = errorResults[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            result = _step.value;

            console.log(result.path);
          }
          _context2.next = 18;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2['catch'](10);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 18:
          _context2.prev = 18;
          _context2.prev = 19;

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }

        case 21:
          _context2.prev = 21;

          if (!_didIteratorError) {
            _context2.next = 24;
            break;
          }

          throw _iteratorError;

        case 24:
          return _context2.finish(21);

        case 25:
          return _context2.finish(18);

        case 26:
          successPaths = results.filter(function (r) {
            return r.error === null;
          }).map(function (r) {
            return r.path;
          });

          console.log();
          _context2.next = 30;
          return regeneratorRuntime.awrap(mz_fs.writeFile('decaffeinate-errors.log', getVerboseErrors(results)));

        case 30:
          _context2.next = 32;
          return regeneratorRuntime.awrap(mz_fs.writeFile('decaffeinate-results.json', JSON.stringify(results, null, 2)));

        case 32:
          _context2.next = 34;
          return regeneratorRuntime.awrap(mz_fs.writeFile('decaffeinate-successful-files.txt', successPaths.join('\n')));

        case 34:
          console.log('Wrote decaffeinate-errors.log and decaffeinate-results.json with more detailed info.');
          console.log('To open failures in the online repl, run "bulk-decaffeinate view-errors".');
          console.log('To convert the successful files, run "bulk-decaffeinate convert -p decaffeinate-successful-files.txt".');

        case 37:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this, [[10, 14, 18, 26], [19,, 21, 25]]);
}

function getVerboseErrors(results) {
  var errorMessages = [];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = results[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _step2$value = _step2.value,
          path$$1 = _step2$value.path,
          error = _step2$value.error;

      if (error) {
        errorMessages.push('===== ' + path$$1);
        errorMessages.push(getStdout(error));
      }
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

  return errorMessages.join('\n');
}

function getStdout(message) {
  var matchString = '\nstdin: ';
  if (message.indexOf(matchString) !== -1) {
    return message.substring(message.indexOf(matchString) + matchString.length);
  } else {
    return message.substring(message.indexOf('\n') + 1);
  }
}

var clean$1 = (function clean() {
  var filesToDelete, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, path$$1;

  return regeneratorRuntime.async(function clean$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(getFilesUnderPath$1('.', function (p) {
            return path.basename(p).includes('.original');
          }));

        case 2:
          filesToDelete = _context.sent;

          if (!(filesToDelete.length === 0)) {
            _context.next = 6;
            break;
          }

          console.log('No .original files were found.');
          return _context.abrupt('return');

        case 6:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 9;
          _iterator = filesToDelete[Symbol.iterator]();

        case 11:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 19;
            break;
          }

          path$$1 = _step.value;

          console.log('Deleting ' + path$$1);
          _context.next = 16;
          return regeneratorRuntime.awrap(mz_fs.unlink(path$$1));

        case 16:
          _iteratorNormalCompletion = true;
          _context.next = 11;
          break;

        case 19:
          _context.next = 25;
          break;

        case 21:
          _context.prev = 21;
          _context.t0 = _context['catch'](9);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 25:
          _context.prev = 25;
          _context.prev = 26;

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }

        case 28:
          _context.prev = 28;

          if (!_didIteratorError) {
            _context.next = 31;
            break;
          }

          throw _iteratorError;

        case 31:
          return _context.finish(28);

        case 32:
          return _context.finish(25);

        case 33:
          console.log('Done deleting .original files.');

        case 34:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this, [[9, 21, 25, 33], [26,, 28, 32]]);
});

/**
 * Variant of exec that connects stdout, stderr, and stdin, mostly so console
 * output is shown continuously. As with the mz version of exec, this returns a
 * promise that resolves when the shell command finishes.
 */
function execLive(command) {
  return new Promise(function (resolve$$1, reject) {
    var childProcess = child_process.spawn('/bin/sh', ['-c', command], { stdio: 'inherit' });
    childProcess.on('close', function (code) {
      if (code === 0) {
        resolve$$1();
      } else {
        reject();
      }
    });
  });
}

/**
 * Resolve the configuration from a number of sources: any number of config
 * files and CLI options. Then "canonicalize" the config as much as we can.
 */
var resolveConfig$1 = (function resolveConfig(commander$$1) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      needsJscodeshift = _ref.needsJscodeshift,
      needsEslint = _ref.needsEslint;

  var config, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, filename, currentDirFiles, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _filename;

  return regeneratorRuntime.async(function resolveConfig$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          config = {};

          if (!(commander$$1.config && commander$$1.config.length > 0)) {
            _context.next = 23;
            break;
          }

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 5;

          for (_iterator = commander$$1.config[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            filename = _step.value;

            config = applyConfig(filename, config);
          }
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context['catch'](5);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 13:
          _context.prev = 13;
          _context.prev = 14;

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }

        case 16:
          _context.prev = 16;

          if (!_didIteratorError) {
            _context.next = 19;
            break;
          }

          throw _iteratorError;

        case 19:
          return _context.finish(16);

        case 20:
          return _context.finish(13);

        case 21:
          _context.next = 54;
          break;

        case 23:
          _context.next = 25;
          return regeneratorRuntime.awrap(mz_fs.readdir('.'));

        case 25:
          currentDirFiles = _context.sent;

          currentDirFiles.sort();
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context.prev = 30;
          _iterator2 = currentDirFiles[Symbol.iterator]();

        case 32:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context.next = 40;
            break;
          }

          _filename = _step2.value;
          _context.next = 36;
          return regeneratorRuntime.awrap(applyPossibleConfig(_filename, config));

        case 36:
          config = _context.sent;

        case 37:
          _iteratorNormalCompletion2 = true;
          _context.next = 32;
          break;

        case 40:
          _context.next = 46;
          break;

        case 42:
          _context.prev = 42;
          _context.t1 = _context['catch'](30);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t1;

        case 46:
          _context.prev = 46;
          _context.prev = 47;

          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }

        case 49:
          _context.prev = 49;

          if (!_didIteratorError2) {
            _context.next = 52;
            break;
          }

          throw _iteratorError2;

        case 52:
          return _context.finish(49);

        case 53:
          return _context.finish(46);

        case 54:
          config = getCLIParamsConfig(config, commander$$1);
          _context.t2 = resolveDecaffeinateArgs(config);
          _context.t3 = config.filesToProcess;
          _context.t4 = config.pathFile;
          _context.t5 = config.searchDirectory;
          _context.t6 = config.fileFilterFn;
          _context.t7 = resolveCustomNames(config.customNames);
          _context.t8 = config.outputFileExtension || 'js';
          _context.t9 = resolveFixImportsConfig(config);
          _context.t10 = config.jscodeshiftScripts;
          _context.t11 = config.landConfig;
          _context.t12 = config.mochaEnvFilePattern;
          _context.t13 = config.codePrefix;
          _context.t14 = config.landBase;
          _context.t15 = config.numWorkers || 8;
          _context.t16 = config.skipVerify;
          _context.t17 = config.skipEslintFix;
          _context.next = 73;
          return regeneratorRuntime.awrap(resolveDecaffeinatePath(config));

        case 73:
          _context.t18 = _context.sent;

          if (!needsJscodeshift) {
            _context.next = 80;
            break;
          }

          _context.next = 77;
          return regeneratorRuntime.awrap(resolveJscodeshiftPath(config));

        case 77:
          _context.t19 = _context.sent;
          _context.next = 81;
          break;

        case 80:
          _context.t19 = null;

        case 81:
          _context.t20 = _context.t19;

          if (!needsEslint) {
            _context.next = 88;
            break;
          }

          _context.next = 85;
          return regeneratorRuntime.awrap(resolveEslintPath(config));

        case 85:
          _context.t21 = _context.sent;
          _context.next = 89;
          break;

        case 88:
          _context.t21 = null;

        case 89:
          _context.t22 = _context.t21;
          return _context.abrupt('return', {
            decaffeinateArgs: _context.t2,
            filesToProcess: _context.t3,
            pathFile: _context.t4,
            searchDirectory: _context.t5,
            fileFilterFn: _context.t6,
            customNames: _context.t7,
            outputFileExtension: _context.t8,
            fixImportsConfig: _context.t9,
            jscodeshiftScripts: _context.t10,
            landConfig: _context.t11,
            mochaEnvFilePattern: _context.t12,
            codePrefix: _context.t13,
            landBase: _context.t14,
            numWorkers: _context.t15,
            skipVerify: _context.t16,
            skipEslintFix: _context.t17,
            decaffeinatePath: _context.t18,
            jscodeshiftPath: _context.t20,
            eslintPath: _context.t22
          });

        case 91:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this, [[5, 9, 13, 21], [14,, 16, 20], [30, 42, 46, 54], [47,, 49, 53]]);
});

function resolveDecaffeinateArgs(config) {
  var args = config.decaffeinateArgs || [];
  if (config.useJSModules && !args.includes('--use-js-modules')) {
    args.push('--use-js-modules');
  }
  return args;
}

function resolveFixImportsConfig(config) {
  var fixImportsConfig = config.fixImportsConfig;
  if (!fixImportsConfig && config.useJSModules) {
    fixImportsConfig = {
      searchPath: '.'
    };
  }
  return fixImportsConfig;
}

function applyPossibleConfig(filename, config) {
  return regeneratorRuntime.async(function applyPossibleConfig$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.t0 = !filename.startsWith('bulk-decaffeinate');

          if (_context2.t0) {
            _context2.next = 5;
            break;
          }

          _context2.next = 4;
          return regeneratorRuntime.awrap(mz_fs.stat(filename));

        case 4:
          _context2.t0 = _context2.sent.isDirectory();

        case 5:
          if (!_context2.t0) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt('return', config);

        case 7:
          if (!filename.endsWith('.config.js')) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt('return', applyConfig(filename, config));

        case 11:
          return _context2.abrupt('return', config);

        case 12:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
}

function applyConfig(filename, config) {
  var filePath = path.resolve(filename);
  try {
    var newConfig = requireUncached(filePath);
    return Object.assign(config, newConfig);
  } catch (e) {
    throw new CLIError('Error reading file ' + filePath + '. Make sure it is a valid JS file.');
  }
}

/**
 * Fill in a configuration from the CLI arguments.
 */
function getCLIParamsConfig(config, commander$$1) {
  var file = commander$$1.file,
      pathFile = commander$$1.pathFile,
      dir = commander$$1.dir,
      useJsModules = commander$$1.useJsModules,
      landBase = commander$$1.landBase,
      numWorkers = commander$$1.numWorkers,
      skipVerify = commander$$1.skipVerify,
      decaffeinatePath = commander$$1.decaffeinatePath,
      jscodeshiftPath = commander$$1.jscodeshiftPath,
      eslintPath = commander$$1.eslintPath;
  // As a special case, specifying files to process from the CLI should cause
  // any equivalent config file settings to be ignored.

  if (file && file.length > 0 || dir || pathFile) {
    config.filesToProcess = null;
    config.searchDirectory = null;
    config.pathFile = null;
  }

  if (file && file.length > 0) {
    config.filesToProcess = file;
  }
  if (dir) {
    config.searchDirectory = dir;
  }
  if (pathFile) {
    config.pathFile = pathFile;
  }
  if (useJsModules) {
    config.useJSModules = true;
  }
  if (landBase) {
    config.landBase = landBase;
  }
  if (numWorkers) {
    config.numWorkers = numWorkers;
  }
  if (skipVerify) {
    config.skipVerify = true;
  }
  if (decaffeinatePath) {
    config.decaffeinatePath = decaffeinatePath;
  }
  if (jscodeshiftPath) {
    config.jscodeshiftPath = jscodeshiftPath;
  }
  if (eslintPath) {
    config.eslintPath = eslintPath;
  }
  return config;
}

function resolveDecaffeinatePath(config) {
  return regeneratorRuntime.async(function resolveDecaffeinatePath$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!config.decaffeinatePath) {
            _context3.next = 2;
            break;
          }

          return _context3.abrupt('return', config.decaffeinatePath);

        case 2:
          _context3.next = 4;
          return regeneratorRuntime.awrap(resolveBinary('decaffeinate'));

        case 4:
          return _context3.abrupt('return', _context3.sent);

        case 5:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, this);
}

function resolveJscodeshiftPath(config) {
  return regeneratorRuntime.async(function resolveJscodeshiftPath$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!(!config.jscodeshiftScripts && !config.fixImportsConfig && !config.useJSModules)) {
            _context4.next = 2;
            break;
          }

          return _context4.abrupt('return', null);

        case 2:
          if (!config.jscodeshiftPath) {
            _context4.next = 4;
            break;
          }

          return _context4.abrupt('return', config.jscodeshiftPath);

        case 4:
          _context4.next = 6;
          return regeneratorRuntime.awrap(resolveBinary('jscodeshift'));

        case 6:
          return _context4.abrupt('return', _context4.sent);

        case 7:
        case 'end':
          return _context4.stop();
      }
    }
  }, null, this);
}

function resolveEslintPath(config) {
  return regeneratorRuntime.async(function resolveEslintPath$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (!config.skipEslintFix) {
            _context5.next = 2;
            break;
          }

          return _context5.abrupt('return', null);

        case 2:
          if (!config.eslintPath) {
            _context5.next = 4;
            break;
          }

          return _context5.abrupt('return', config.eslintPath);

        case 4:
          _context5.next = 6;
          return regeneratorRuntime.awrap(resolveBinary('eslint'));

        case 6:
          return _context5.abrupt('return', _context5.sent);

        case 7:
        case 'end':
          return _context5.stop();
      }
    }
  }, null, this);
}

/**
 * Determine the shell command that can be used to run the given binary,
 * prompting to globally install it if necessary.
 */
function resolveBinary(binaryName) {
  var nodeModulesPath, rl, answer;
  return regeneratorRuntime.async(function resolveBinary$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          nodeModulesPath = './node_modules/.bin/' + binaryName;
          _context6.next = 3;
          return regeneratorRuntime.awrap(mz_fs.exists(nodeModulesPath));

        case 3:
          if (!_context6.sent) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt('return', nodeModulesPath);

        case 7:
          _context6.prev = 7;
          _context6.next = 10;
          return regeneratorRuntime.awrap(mz_child_process.exec('which ' + binaryName));

        case 10:
          return _context6.abrupt('return', binaryName);

        case 13:
          _context6.prev = 13;
          _context6.t0 = _context6['catch'](7);

          console.log(binaryName + ' binary not found on the PATH or in node_modules.');
          rl = readline.createInterface(process.stdin, process.stdout);
          _context6.next = 19;
          return regeneratorRuntime.awrap(rl.question('Run "npm install -g ' + binaryName + '"? [Y/n] '));

        case 19:
          answer = _context6.sent;

          rl.close();

          if (!answer.toLowerCase().startsWith('n')) {
            _context6.next = 23;
            break;
          }

          throw new CLIError(binaryName + ' must be installed.');

        case 23:
          console.log('Installing ' + binaryName + ' globally...');
          _context6.next = 26;
          return regeneratorRuntime.awrap(execLive('npm install -g ' + binaryName));

        case 26:
          console.log('Successfully installed ' + binaryName + '\n');
          return _context6.abrupt('return', binaryName);

        case 28:
        case 'end':
          return _context6.stop();
      }
    }
  }, null, this, [[7, 13]]);
}

function resolveCustomNames(customNames) {
  var result = {};
  if (customNames) {
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = Object.entries(customNames)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var _step3$value = slicedToArray(_step3.value, 2),
            key = _step3$value[0],
            value = _step3$value[1];

        result[path.resolve(key)] = path.resolve(value);
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
  return result;
}

var prependToFile$1 = (function prependToFile(path$$1, prependText) {
  var contents, lines;
  return regeneratorRuntime.async(function prependToFile$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(fsPromise.readFile(path$$1));

        case 2:
          contents = _context.sent;
          lines = contents.toString().split('\n');

          if (lines[0] && lines[0].startsWith('#!')) {
            contents = lines[0] + '\n' + prependText + lines.slice(1).join('\n');
          } else {
            contents = prependText + contents;
          }
          _context.next = 7;
          return regeneratorRuntime.awrap(fsPromise.writeFile(path$$1, contents));

        case 7:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
});

var prependCodePrefix$1 = (function prependCodePrefix(config, jsFiles, codePrefix) {
  return regeneratorRuntime.async(function prependCodePrefix$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(runWithProgressBar$1(config, 'Adding code prefix to converted files...', jsFiles, function _callee(path$$1) {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(prependToFile$1(path$$1, codePrefix));

                  case 2:
                    return _context.abrupt('return', { error: null });

                  case 3:
                  case 'end':
                    return _context.stop();
                }
              }
            }, null, this);
          }));

        case 2:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
});

var prependMochaEnv$1 = (function prependMochaEnv(config, jsFiles, mochaEnvFilePattern) {
  var regex, testFiles;
  return regeneratorRuntime.async(function prependMochaEnv$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          regex = new RegExp(mochaEnvFilePattern);
          testFiles = jsFiles.filter(function (f) {
            return regex.test(f);
          });
          _context2.next = 4;
          return regeneratorRuntime.awrap(runWithProgressBar$1(config, 'Adding /* eslint-env mocha */ to test files...', testFiles, function _callee(path$$1) {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(prependToFile$1(path$$1, '/* eslint-env mocha */\n'));

                  case 2:
                    return _context.abrupt('return', { error: null });

                  case 3:
                  case 'end':
                    return _context.stop();
                }
              }
            }, null, this);
          }));

        case 4:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
});

var runEslintFix$1 = (function runEslintFix(jsFiles, config, _ref) {
  var isUpdate = _ref.isUpdate;

  var eslintResults, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, result, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, message;

  return regeneratorRuntime.async(function runEslintFix$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(runWithProgressBar$1(config, 'Running eslint --fix on all files...', jsFiles, makeEslintFixFn(config, { isUpdate: isUpdate })));

        case 2:
          eslintResults = _context.sent;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 6;
          _iterator = eslintResults[Symbol.iterator]();

        case 8:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 32;
            break;
          }

          result = _step.value;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context.prev = 13;

          for (_iterator2 = result.messages[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            message = _step2.value;

            console.log(message);
          }
          _context.next = 21;
          break;

        case 17:
          _context.prev = 17;
          _context.t0 = _context['catch'](13);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t0;

        case 21:
          _context.prev = 21;
          _context.prev = 22;

          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }

        case 24:
          _context.prev = 24;

          if (!_didIteratorError2) {
            _context.next = 27;
            break;
          }

          throw _iteratorError2;

        case 27:
          return _context.finish(24);

        case 28:
          return _context.finish(21);

        case 29:
          _iteratorNormalCompletion = true;
          _context.next = 8;
          break;

        case 32:
          _context.next = 38;
          break;

        case 34:
          _context.prev = 34;
          _context.t1 = _context['catch'](6);
          _didIteratorError = true;
          _iteratorError = _context.t1;

        case 38:
          _context.prev = 38;
          _context.prev = 39;

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }

        case 41:
          _context.prev = 41;

          if (!_didIteratorError) {
            _context.next = 44;
            break;
          }

          throw _iteratorError;

        case 44:
          return _context.finish(41);

        case 45:
          return _context.finish(38);

        case 46:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this, [[6, 34, 38, 46], [13, 17, 21, 29], [22,, 24, 28], [39,, 41, 45]]);
});

var HEADER_COMMENT_LINES = {
  todo: '// TODO: This file was created by bulk-decaffeinate.',
  todoUpdated: '// TODO: This file was updated by bulk-decaffeinate.',
  fixIssues: '// Fix any style issues and re-enable lint.',
  sanityCheck: '// Sanity-check the conversion and remove this comment.'
};

function makeEslintFixFn(config, _ref2) {
  var isUpdate = _ref2.isUpdate;

  return function runEslint(path$$1) {
    var messages, _ref3, _ref4, eslintStdout, eslintStderr, ruleIds, eslintOutput;

    return regeneratorRuntime.async(function runEslint$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            messages = [];

            // Ignore the eslint exit code; it gives useful stdout in the same format
            // regardless of the exit code. Also keep a 10MB buffer since sometimes
            // there can be a LOT of lint failures.

            _context2.next = 3;
            return regeneratorRuntime.awrap(mz_child_process.exec(config.eslintPath + ' --fix --format json ' + path$$1 + '; :', { maxBuffer: 10000 * 1024 }));

          case 3:
            _ref3 = _context2.sent;
            _ref4 = slicedToArray(_ref3, 2);
            eslintStdout = _ref4[0];
            eslintStderr = _ref4[1];
            ruleIds = void 0;

            if (!(eslintStdout + eslintStderr).includes("ESLint couldn't find a configuration file")) {
              _context2.next = 13;
              break;
            }

            messages.push('Skipping "eslint --fix" on ' + path$$1 + ' because there was no eslint config file.');
            ruleIds = [];
            _context2.next = 23;
            break;

          case 13:
            eslintOutput = void 0;
            _context2.prev = 14;

            eslintOutput = JSON.parse(eslintStdout);
            _context2.next = 21;
            break;

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2['catch'](14);
            throw new CLIError('Error while running eslint:\n' + eslintStdout + '\n' + eslintStderr);

          case 21:
            ruleIds = eslintOutput[0].messages.map(function (message) {
              return message.ruleId;
            }).filter(function (ruleId) {
              return ruleId;
            });
            ruleIds = Array.from(new Set(ruleIds)).sort();

          case 23:
            if (!isUpdate) {
              _context2.next = 29;
              break;
            }

            if (!(ruleIds.length > 0)) {
              _context2.next = 27;
              break;
            }

            _context2.next = 27;
            return regeneratorRuntime.awrap(prependToFile$1('' + path$$1, HEADER_COMMENT_LINES.todoUpdated + '\n' + HEADER_COMMENT_LINES.fixIssues + '\n'));

          case 27:
            _context2.next = 36;
            break;

          case 29:
            if (!(ruleIds.length > 0)) {
              _context2.next = 34;
              break;
            }

            _context2.next = 32;
            return regeneratorRuntime.awrap(prependToFile$1('' + path$$1, HEADER_COMMENT_LINES.todo + '\n' + HEADER_COMMENT_LINES.fixIssues + '\n'));

          case 32:
            _context2.next = 36;
            break;

          case 34:
            _context2.next = 36;
            return regeneratorRuntime.awrap(prependToFile$1('' + path$$1, HEADER_COMMENT_LINES.todo + '\n' + HEADER_COMMENT_LINES.sanityCheck + '\n'));

          case 36:
            if (!(ruleIds.length > 0)) {
              _context2.next = 39;
              break;
            }

            _context2.next = 39;
            return regeneratorRuntime.awrap(prependToFile$1('' + path$$1, '/* eslint-disable\n' + ruleIds.map(function (ruleId) {
              return '    ' + ruleId + ',';
            }).join('\n') + '\n*/\n'));

          case 39:
            return _context2.abrupt('return', { error: null, messages: messages });

          case 40:
          case 'end':
            return _context2.stop();
        }
      }
    }, null, this, [[14, 18]]);
  };
}

/**
 * Runs the fix-imports step on all specified JS files, and return an array of
 * the files that changed.
 */
var runFixImports$1 = (function runFixImports(jsFiles, config) {
  var _config$fixImportsCon, searchPath, absoluteImportPaths, scriptPath, options, eligibleFixImportsFiles, eligibleRelativePaths, encodedOptions;

  return regeneratorRuntime.async(function runFixImports$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _config$fixImportsCon = config.fixImportsConfig, searchPath = _config$fixImportsCon.searchPath, absoluteImportPaths = _config$fixImportsCon.absoluteImportPaths;

          if (!absoluteImportPaths) {
            absoluteImportPaths = [];
          }
          scriptPath = path.join(__dirname, '../jscodeshift-scripts-dist/fix-imports.js');
          options = {
            convertedFiles: jsFiles.map(function (p) {
              return path.resolve(p);
            }),
            absoluteImportPaths: absoluteImportPaths.map(function (p) {
              return path.resolve(p);
            })
          };
          _context.next = 6;
          return regeneratorRuntime.awrap(getEligibleFixImportsFiles(config, searchPath, jsFiles));

        case 6:
          eligibleFixImportsFiles = _context.sent;

          console.log('Fixing any imports across the whole codebase...');

          if (!(eligibleFixImportsFiles.length > 0)) {
            _context.next = 13;
            break;
          }

          // Note that the args can get really long, so we take reasonable steps to
          // reduce the chance of hitting the system limit on arg length
          // (256K by default on Mac).
          eligibleRelativePaths = eligibleFixImportsFiles.map(function (p) {
            return path.relative('', p);
          });
          encodedOptions = zlib.deflateSync(JSON.stringify(options)).toString('base64');
          _context.next = 13;
          return regeneratorRuntime.awrap(execLive('      ' + config.jscodeshiftPath + ' --parser flow -t ' + scriptPath + '         ' + eligibleRelativePaths.join(' ') + ' --encoded-options=' + encodedOptions));

        case 13:
          return _context.abrupt('return', eligibleFixImportsFiles);

        case 14:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
});

function getEligibleFixImportsFiles(config, searchPath, jsFiles) {
  var jsBasenames, resolvedPaths, allJsFiles;
  return regeneratorRuntime.async(function getEligibleFixImportsFiles$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          jsBasenames = jsFiles.map(function (p) {
            return path.basename(p, '.js');
          });
          resolvedPaths = jsFiles.map(function (p) {
            return path.resolve(p);
          });
          _context3.next = 4;
          return regeneratorRuntime.awrap(getFilesUnderPath$1(searchPath, function (p) {
            return p.endsWith('.js');
          }));

        case 4:
          allJsFiles = _context3.sent;
          _context3.next = 7;
          return regeneratorRuntime.awrap(runWithProgressBar$1(config, 'Searching for files that may need to have updated imports...', allJsFiles, function _callee(p) {
            var resolvedPath, contents, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, jsBasename;

            return regeneratorRuntime.async(function _callee$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    resolvedPath = path.resolve(p);

                    if (!resolvedPaths.includes(resolvedPath)) {
                      _context2.next = 3;
                      break;
                    }

                    return _context2.abrupt('return', { error: null });

                  case 3:
                    _context2.next = 5;
                    return regeneratorRuntime.awrap(fsPromise.readFile(resolvedPath));

                  case 5:
                    contents = _context2.sent.toString();
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    _context2.prev = 9;
                    _iterator = jsBasenames[Symbol.iterator]();

                  case 11:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                      _context2.next = 19;
                      break;
                    }

                    jsBasename = _step.value;

                    if (!contents.includes(jsBasename)) {
                      _context2.next = 16;
                      break;
                    }

                    resolvedPaths.push(resolvedPath);
                    return _context2.abrupt('return', { error: null });

                  case 16:
                    _iteratorNormalCompletion = true;
                    _context2.next = 11;
                    break;

                  case 19:
                    _context2.next = 25;
                    break;

                  case 21:
                    _context2.prev = 21;
                    _context2.t0 = _context2['catch'](9);
                    _didIteratorError = true;
                    _iteratorError = _context2.t0;

                  case 25:
                    _context2.prev = 25;
                    _context2.prev = 26;

                    if (!_iteratorNormalCompletion && _iterator.return) {
                      _iterator.return();
                    }

                  case 28:
                    _context2.prev = 28;

                    if (!_didIteratorError) {
                      _context2.next = 31;
                      break;
                    }

                    throw _iteratorError;

                  case 31:
                    return _context2.finish(28);

                  case 32:
                    return _context2.finish(25);

                  case 33:
                    return _context2.abrupt('return', { error: null });

                  case 34:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, null, this, [[9, 21, 25, 33], [26,, 28, 32]]);
          }));

        case 7:
          return _context3.abrupt('return', resolvedPaths);

        case 8:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, this);
}

var runJscodeshiftScripts$1 = (function runJscodeshiftScripts(jsFiles, config) {
  var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, scriptPath, resolvedPath;

  return regeneratorRuntime.async(function runJscodeshiftScripts$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 3;
          _iterator = config.jscodeshiftScripts[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 14;
            break;
          }

          scriptPath = _step.value;
          resolvedPath = resolveJscodeshiftScriptPath(scriptPath);

          console.log('Running jscodeshift script ' + resolvedPath + '...');
          _context.next = 11;
          return regeneratorRuntime.awrap(execLive(config.jscodeshiftPath + ' --parser flow       -t ' + resolvedPath + ' ' + jsFiles.map(function (p) {
            return path.relative('', p);
          }).join(' ')));

        case 11:
          _iteratorNormalCompletion = true;
          _context.next = 5;
          break;

        case 14:
          _context.next = 20;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context['catch'](3);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 20:
          _context.prev = 20;
          _context.prev = 21;

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }

        case 23:
          _context.prev = 23;

          if (!_didIteratorError) {
            _context.next = 26;
            break;
          }

          throw _iteratorError;

        case 26:
          return _context.finish(23);

        case 27:
          return _context.finish(20);

        case 28:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this, [[3, 16, 20, 28], [21,, 23, 27]]);
});

function resolveJscodeshiftScriptPath(scriptPath) {
  if (['prefer-function-declarations.js', 'remove-coffee-from-imports.js', 'top-level-this-to-exports.js'].includes(scriptPath)) {
    return path.join(__dirname, '../jscodeshift-scripts-dist/' + scriptPath);
  }
  return scriptPath;
}

/**
 * Make an autogenerated commit with the "decaffeinate" author.
 */
var makeCommit$1 = (function makeCommit(commitMessage) {
  var userEmail, author;
  return regeneratorRuntime.async(function makeCommit$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(git().raw(['config', 'user.email']));

        case 2:
          userEmail = _context.sent;
          author = 'decaffeinate <' + userEmail + '>';
          _context.next = 6;
          return regeneratorRuntime.awrap(git().commit(commitMessage, { '--author': author, '--no-verify': null }));

        case 6:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
});

var convert$1 = (function convert(config) {
  var coffeeFiles, movingCoffeeFiles, _config$decaffeinateA, decaffeinateArgs, decaffeinatePath, shortDescription, renameCommitMsg, decaffeinateCommitMsg, jsFiles, thirdCommitModifiedFiles, postProcessCommitMsg;

  return regeneratorRuntime.async(function convert$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(assertGitWorktreeClean());

        case 2:
          _context6.next = 4;
          return regeneratorRuntime.awrap(getFilesToProcess$1(config, COFFEE_FILE_RECOGNIZER));

        case 4:
          coffeeFiles = _context6.sent;

          if (!(coffeeFiles.length === 0)) {
            _context6.next = 8;
            break;
          }

          console.log('There were no CoffeeScript files to convert.');
          return _context6.abrupt('return');

        case 8:
          movingCoffeeFiles = coffeeFiles.filter(function (p) {
            return jsPathFor(p, config) !== p;
          });
          _config$decaffeinateA = config.decaffeinateArgs, decaffeinateArgs = _config$decaffeinateA === undefined ? [] : _config$decaffeinateA, decaffeinatePath = config.decaffeinatePath;

          if (config.skipVerify) {
            _context6.next = 19;
            break;
          }

          _context6.prev = 11;
          _context6.next = 14;
          return regeneratorRuntime.awrap(runWithProgressBar$1(config, 'Verifying that decaffeinate can successfully convert these files...', coffeeFiles, makeDecaffeinateVerifyFn(config)));

        case 14:
          _context6.next = 19;
          break;

        case 16:
          _context6.prev = 16;
          _context6.t0 = _context6['catch'](11);
          throw new CLIError('Some files could not be converted with decaffeinate.\nRe-run with the "check" command for more details.');

        case 19:
          _context6.next = 21;
          return regeneratorRuntime.awrap(runWithProgressBar$1(config, 'Backing up files to .original.coffee...', coffeeFiles, function _callee(coffeePath) {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(fsPromise.copy('' + coffeePath, '' + backupPathFor(coffeePath)));

                  case 2:
                  case 'end':
                    return _context.stop();
                }
              }
            }, null, this);
          }));

        case 21:
          _context6.next = 23;
          return regeneratorRuntime.awrap(runWithProgressBar$1(config, 'Renaming files from .coffee to .' + config.outputFileExtension + '...', movingCoffeeFiles, function _callee2(coffeePath) {
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(fsPromise.move(coffeePath, jsPathFor(coffeePath, config)));

                  case 2:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, null, this);
          }));

        case 23:
          shortDescription = getShortDescription(coffeeFiles);
          renameCommitMsg = 'decaffeinate: Rename ' + shortDescription + ' from .coffee to .' + config.outputFileExtension;

          if (!(movingCoffeeFiles.length > 0)) {
            _context6.next = 33;
            break;
          }

          console.log('Generating the first commit: "' + renameCommitMsg + '"...');
          _context6.next = 29;
          return regeneratorRuntime.awrap(git().rm(movingCoffeeFiles));

        case 29:
          _context6.next = 31;
          return regeneratorRuntime.awrap(git().raw(['add', '-f'].concat(toConsumableArray(movingCoffeeFiles.map(function (p) {
            return jsPathFor(p, config);
          })))));

        case 31:
          _context6.next = 33;
          return regeneratorRuntime.awrap(makeCommit$1(renameCommitMsg));

        case 33:
          _context6.next = 35;
          return regeneratorRuntime.awrap(runWithProgressBar$1(config, 'Moving files back...', movingCoffeeFiles, function _callee3(coffeePath) {
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return regeneratorRuntime.awrap(fsPromise.move(jsPathFor(coffeePath, config), coffeePath));

                  case 2:
                  case 'end':
                    return _context3.stop();
                }
              }
            }, null, this);
          }));

        case 35:
          _context6.next = 37;
          return regeneratorRuntime.awrap(runWithProgressBar$1(config, 'Running decaffeinate on all files...', coffeeFiles, makeCLIFn(function (path$$1) {
            return decaffeinatePath + ' ' + decaffeinateArgs.join(' ') + ' ' + path$$1;
          })));

        case 37:
          _context6.next = 39;
          return regeneratorRuntime.awrap(runWithProgressBar$1(config, 'Deleting old files...', coffeeFiles, function _callee4(coffeePath) {
            return regeneratorRuntime.async(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return regeneratorRuntime.awrap(fsPromise.unlink(coffeePath));

                  case 2:
                  case 'end':
                    return _context4.stop();
                }
              }
            }, null, this);
          }));

        case 39:
          _context6.next = 41;
          return regeneratorRuntime.awrap(runWithProgressBar$1(config, 'Setting proper extension for all files...', coffeeFiles, function _callee5(coffeePath) {
            var decaffeinateOutPath, jsPath;
            return regeneratorRuntime.async(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    decaffeinateOutPath = decaffeinateOutPathFor(coffeePath);
                    jsPath = jsPathFor(coffeePath, config);

                    if (!(decaffeinateOutPath !== jsPath)) {
                      _context5.next = 5;
                      break;
                    }

                    _context5.next = 5;
                    return regeneratorRuntime.awrap(fsPromise.move(decaffeinateOutPath, jsPath));

                  case 5:
                  case 'end':
                    return _context5.stop();
                }
              }
            }, null, this);
          }));

        case 41:
          decaffeinateCommitMsg = 'decaffeinate: Convert ' + shortDescription + ' to JS';

          console.log('Generating the second commit: ' + decaffeinateCommitMsg + '...');
          jsFiles = coffeeFiles.map(function (f) {
            return jsPathFor(f, config);
          });
          _context6.next = 46;
          return regeneratorRuntime.awrap(git().raw(['add', '-f'].concat(toConsumableArray(jsFiles))));

        case 46:
          _context6.next = 48;
          return regeneratorRuntime.awrap(makeCommit$1(decaffeinateCommitMsg));

        case 48:
          if (!config.jscodeshiftScripts) {
            _context6.next = 51;
            break;
          }

          _context6.next = 51;
          return regeneratorRuntime.awrap(runJscodeshiftScripts$1(jsFiles, config));

        case 51:
          if (!config.mochaEnvFilePattern) {
            _context6.next = 54;
            break;
          }

          _context6.next = 54;
          return regeneratorRuntime.awrap(prependMochaEnv$1(config, jsFiles, config.mochaEnvFilePattern));

        case 54:
          thirdCommitModifiedFiles = jsFiles.slice();

          if (!config.fixImportsConfig) {
            _context6.next = 59;
            break;
          }

          _context6.next = 58;
          return regeneratorRuntime.awrap(runFixImports$1(jsFiles, config));

        case 58:
          thirdCommitModifiedFiles = _context6.sent;

        case 59:
          if (config.skipEslintFix) {
            _context6.next = 62;
            break;
          }

          _context6.next = 62;
          return regeneratorRuntime.awrap(runEslintFix$1(jsFiles, config, { isUpdate: false }));

        case 62:
          if (!config.codePrefix) {
            _context6.next = 65;
            break;
          }

          _context6.next = 65;
          return regeneratorRuntime.awrap(prependCodePrefix$1(config, jsFiles, config.codePrefix));

        case 65:
          postProcessCommitMsg = 'decaffeinate: Run post-processing cleanups on ' + shortDescription;

          console.log('Generating the third commit: ' + postProcessCommitMsg + '...');
          _context6.next = 69;
          return regeneratorRuntime.awrap(git().raw(['add', '-f'].concat(toConsumableArray(thirdCommitModifiedFiles))));

        case 69:
          _context6.next = 71;
          return regeneratorRuntime.awrap(makeCommit$1(postProcessCommitMsg));

        case 71:

          console.log('Successfully ran decaffeinate on ' + pluralize(coffeeFiles.length, 'file') + '.');
          console.log('You should now fix lint issues in any affected files.');
          console.log('All CoffeeScript files were backed up as .original.coffee files that you can use for comparison.');
          console.log('You can run "bulk-decaffeinate clean" to remove those files.');
          console.log('To allow git to properly track file history, you should NOT squash the generated commits together.');

        case 76:
        case 'end':
          return _context6.stop();
      }
    }
  }, null, this, [[11, 16]]);
});

function assertGitWorktreeClean() {
  var status;
  return regeneratorRuntime.async(function assertGitWorktreeClean$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(git().status());

        case 2:
          status = _context7.sent;

          if (!(status.files.length > status.not_added.length)) {
            _context7.next = 7;
            break;
          }

          throw new CLIError('You have modifications to your git worktree.\nPlease revert or commit them before running convert.');

        case 7:
          if (status.not_added.length > 0) {
            console.log('Warning: the following untracked files are present in your repository:\n' + status.not_added.join('\n') + '\nProceeding anyway.\n');
          }

        case 8:
        case 'end':
          return _context7.stop();
      }
    }
  }, null, this);
}

function getShortDescription(coffeeFiles) {
  var firstFile = path.basename(coffeeFiles[0]);
  if (coffeeFiles.length === 1) {
    return firstFile;
  } else {
    return firstFile + ' and ' + pluralize(coffeeFiles.length - 1, 'other file');
  }
}

/**
 * The land option "packages" a set of commits into a single merge commit that
 * can be pushed. Splitting the decaffeinate work up into different commits
 * allows git to properly track file history when a file is changed from
 * CoffeeScript to JavaScript.
 *
 * A typical use case is that the merge commit will include 4 commits: the three
 * auto-generated decaffeinate commits and a follow-up commit to fix lint
 * errors. Unlike the auto-generated decaffeinate commits, the merge commit is
 * created with the default author name.
 */
var land$1 = (function land(config) {
  var remote, upstreamBranch, phabricatorAware, remoteBranch, commits, differentialRevisionLine, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, commit, status, message, cherryPickHeadCommit, mergeMessage;

  return regeneratorRuntime.async(function land$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          remote = config.landConfig && config.landConfig.remote;
          upstreamBranch = config.landConfig && config.landConfig.upstreamBranch;
          phabricatorAware = config.landConfig && config.landConfig.phabricatorAware;

          if (!remote) {
            console.log('No remote was specified. Defaulting to origin.');
            remote = 'origin';
          }
          if (!upstreamBranch) {
            console.log('No upstreamBranch was specified. Defaulting to master.');
            upstreamBranch = 'master';
          }
          remoteBranch = remote + '/' + upstreamBranch;

          console.log('Running fetch for ' + remote + '.');
          _context.next = 9;
          return regeneratorRuntime.awrap(git().fetch([remote]));

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap(getCommits(config));

        case 11:
          commits = _context.sent;

          console.log('Found ' + commits.length + ' commits to use.');

          if (!phabricatorAware) {
            _context.next = 19;
            break;
          }

          _context.next = 16;
          return regeneratorRuntime.awrap(getDifferentialRevisionLine(commits));

        case 16:
          _context.t0 = _context.sent;
          _context.next = 20;
          break;

        case 19:
          _context.t0 = null;

        case 20:
          differentialRevisionLine = _context.t0;
          _context.next = 23;
          return regeneratorRuntime.awrap(git().checkout(remoteBranch));

        case 23:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 26;
          _iterator = commits[Symbol.iterator]();

        case 28:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 49;
            break;
          }

          commit = _step.value;

          console.log('Cherry-picking "' + commit.message + '"');
          _context.next = 33;
          return regeneratorRuntime.awrap(git().raw(['cherry-pick', commit.hash]));

        case 33:
          _context.next = 35;
          return regeneratorRuntime.awrap(git().status());

        case 35:
          status = _context.sent;

          if (!(status.conflicted.length > 0)) {
            _context.next = 38;
            break;
          }

          throw new CLIError('The cherry pick had conflicts.\nPlease rebase your changes and retry "bulk-decaffeinate land"');

        case 38:
          _context.next = 40;
          return regeneratorRuntime.awrap(getCommitMessage(commit.hash));

        case 40:
          message = _context.sent;

          if (!phabricatorAware) {
            _context.next = 46;
            break;
          }

          if (message.includes('Differential Revision')) {
            _context.next = 46;
            break;
          }

          message += '\n\n' + differentialRevisionLine;
          _context.next = 46;
          return regeneratorRuntime.awrap(git().commit(message, ['--amend']));

        case 46:
          _iteratorNormalCompletion = true;
          _context.next = 28;
          break;

        case 49:
          _context.next = 55;
          break;

        case 51:
          _context.prev = 51;
          _context.t1 = _context['catch'](26);
          _didIteratorError = true;
          _iteratorError = _context.t1;

        case 55:
          _context.prev = 55;
          _context.prev = 56;

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }

        case 58:
          _context.prev = 58;

          if (!_didIteratorError) {
            _context.next = 61;
            break;
          }

          throw _iteratorError;

        case 61:
          return _context.finish(58);

        case 62:
          return _context.finish(55);

        case 63:

          console.log('Creating merge commit on ' + remoteBranch);
          _context.next = 66;
          return regeneratorRuntime.awrap(git().revparse(['HEAD']));

        case 66:
          cherryPickHeadCommit = _context.sent.trim();
          _context.next = 69;
          return regeneratorRuntime.awrap(git().checkout(remoteBranch));

        case 69:
          mergeMessage = 'Merge decaffeinate changes into ' + remoteBranch;

          if (phabricatorAware) {
            mergeMessage += '\n\n' + differentialRevisionLine;
          }
          _context.next = 73;
          return regeneratorRuntime.awrap(git().mergeFromTo(cherryPickHeadCommit, 'HEAD', ['--no-ff']));

        case 73:
          _context.next = 75;
          return regeneratorRuntime.awrap(git().commit(mergeMessage, ['--amend']));

        case 75:
          if (!phabricatorAware) {
            _context.next = 79;
            break;
          }

          console.log('Pulling commit message from Phabricator.');
          _context.next = 79;
          return regeneratorRuntime.awrap(mz_child_process.exec('arc amend'));

        case 79:
          console.log('');
          console.log('Done. Please verify that the git history looks right.');
          console.log('You can push your changes with a command like this:');
          console.log('git push ' + remote + ' HEAD:' + upstreamBranch);
          console.log('If you get a conflict, you should re-run "bulk-decaffeinate land".');

        case 84:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this, [[26, 51, 55, 63], [56,, 58, 62]]);
});

function getCommits(config) {
  var explicitBase, allCommits, commits, hasSeenDecaffeinateCommit, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, commit, isDecaffeinateCommit;

  return regeneratorRuntime.async(function getCommits$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          explicitBase = null;

          if (!config.landBase) {
            _context2.next = 5;
            break;
          }

          _context2.next = 4;
          return regeneratorRuntime.awrap(git().revparse([config.landBase]));

        case 4:
          explicitBase = _context2.sent.trim();

        case 5:
          allCommits = void 0;
          _context2.prev = 6;
          _context2.next = 9;
          return regeneratorRuntime.awrap(git().log({ from: 'HEAD', to: 'HEAD~20' }));

        case 9:
          allCommits = _context2.sent.all;
          _context2.next = 17;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2['catch'](6);
          _context2.next = 16;
          return regeneratorRuntime.awrap(git().log({ from: 'HEAD' }));

        case 16:
          allCommits = _context2.sent.all;

        case 17:
          commits = [];
          hasSeenDecaffeinateCommit = false;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context2.prev = 22;
          _iterator2 = allCommits[Symbol.iterator]();

        case 24:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context2.next = 39;
            break;
          }

          commit = _step2.value;
          isDecaffeinateCommit = commit.author_name === 'decaffeinate';

          if (!(explicitBase !== null)) {
            _context2.next = 32;
            break;
          }

          if (!(explicitBase === commit.hash)) {
            _context2.next = 30;
            break;
          }

          return _context2.abrupt('return', commits);

        case 30:
          _context2.next = 34;
          break;

        case 32:
          if (!(hasSeenDecaffeinateCommit && !isDecaffeinateCommit)) {
            _context2.next = 34;
            break;
          }

          return _context2.abrupt('return', commits);

        case 34:
          if (!hasSeenDecaffeinateCommit && isDecaffeinateCommit) {
            hasSeenDecaffeinateCommit = true;
          }
          commits.unshift(commit);

        case 36:
          _iteratorNormalCompletion2 = true;
          _context2.next = 24;
          break;

        case 39:
          _context2.next = 45;
          break;

        case 41:
          _context2.prev = 41;
          _context2.t1 = _context2['catch'](22);
          _didIteratorError2 = true;
          _iteratorError2 = _context2.t1;

        case 45:
          _context2.prev = 45;
          _context2.prev = 46;

          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }

        case 48:
          _context2.prev = 48;

          if (!_didIteratorError2) {
            _context2.next = 51;
            break;
          }

          throw _iteratorError2;

        case 51:
          return _context2.finish(48);

        case 52:
          return _context2.finish(45);

        case 53:
          throw new CLIError('Searched 20 commits without finding a set of commits to use. Make sure you have\ncommits with the "decaffeinate" author in your recent git history, and that the\nfirst of those commits is the first commit that you would like to land.');

        case 54:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this, [[6, 12], [22, 41, 45, 53], [46,, 48, 52]]);
}

function getDifferentialRevisionLine(commits) {
  var resultLine, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, commit, commitMessage, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, line;

  return regeneratorRuntime.async(function getDifferentialRevisionLine$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          resultLine = null;
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context3.prev = 4;
          _iterator3 = commits[Symbol.iterator]();

        case 6:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            _context3.next = 44;
            break;
          }

          commit = _step3.value;
          _context3.next = 10;
          return regeneratorRuntime.awrap(getCommitMessage(commit.hash));

        case 10:
          commitMessage = _context3.sent;
          _iteratorNormalCompletion4 = true;
          _didIteratorError4 = false;
          _iteratorError4 = undefined;
          _context3.prev = 14;
          _iterator4 = commitMessage.split('\n')[Symbol.iterator]();

        case 16:
          if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
            _context3.next = 27;
            break;
          }

          line = _step4.value;

          if (!line.startsWith('Differential Revision')) {
            _context3.next = 24;
            break;
          }

          if (!(resultLine === null || resultLine === line)) {
            _context3.next = 23;
            break;
          }

          resultLine = line;
          _context3.next = 24;
          break;

        case 23:
          throw new CLIError('Found multiple different "Differential Revision" lines in the matched commits.\nPlease set your git HEAD so that only one Phabricator code review is included.');

        case 24:
          _iteratorNormalCompletion4 = true;
          _context3.next = 16;
          break;

        case 27:
          _context3.next = 33;
          break;

        case 29:
          _context3.prev = 29;
          _context3.t0 = _context3['catch'](14);
          _didIteratorError4 = true;
          _iteratorError4 = _context3.t0;

        case 33:
          _context3.prev = 33;
          _context3.prev = 34;

          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }

        case 36:
          _context3.prev = 36;

          if (!_didIteratorError4) {
            _context3.next = 39;
            break;
          }

          throw _iteratorError4;

        case 39:
          return _context3.finish(36);

        case 40:
          return _context3.finish(33);

        case 41:
          _iteratorNormalCompletion3 = true;
          _context3.next = 6;
          break;

        case 44:
          _context3.next = 50;
          break;

        case 46:
          _context3.prev = 46;
          _context3.t1 = _context3['catch'](4);
          _didIteratorError3 = true;
          _iteratorError3 = _context3.t1;

        case 50:
          _context3.prev = 50;
          _context3.prev = 51;

          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }

        case 53:
          _context3.prev = 53;

          if (!_didIteratorError3) {
            _context3.next = 56;
            break;
          }

          throw _iteratorError3;

        case 56:
          return _context3.finish(53);

        case 57:
          return _context3.finish(50);

        case 58:
          if (!(resultLine === null)) {
            _context3.next = 60;
            break;
          }

          throw new CLIError('\nExpected to find a "Differential Revision" line in at least one commit.');

        case 60:
          return _context3.abrupt('return', resultLine);

        case 61:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, this, [[4, 46, 50, 58], [14, 29, 33, 41], [34,, 36, 40], [51,, 53, 57]]);
}

function getCommitMessage(commitHash) {
  return regeneratorRuntime.async(function getCommitMessage$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(git().show(['-s', '--format=%B', commitHash]));

        case 2:
          return _context4.abrupt('return', _context4.sent);

        case 3:
        case 'end':
          return _context4.stop();
      }
    }
  }, null, this);
}

var removeAutogeneratedHeader$1 = (function removeAutogeneratedHeader(config, jsFiles) {
  return regeneratorRuntime.async(function removeAutogeneratedHeader$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(runWithProgressBar$1(config, 'Removing any existing autogenerated headers...', jsFiles, removeHeadersFromFile));

        case 2:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
});

function removeHeadersFromFile(path$$1) {
  var contents, newContents;
  return regeneratorRuntime.async(function removeHeadersFromFile$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(fsPromise.readFile(path$$1));

        case 2:
          contents = _context2.sent;
          newContents = removeHeadersFromCode(contents);

          if (!(newContents !== contents)) {
            _context2.next = 7;
            break;
          }

          _context2.next = 7;
          return regeneratorRuntime.awrap(fsPromise.writeFile(path$$1, newContents));

        case 7:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
}

function removeHeadersFromCode(code) {
  var lines = code.toString().split('\n');

  var resultLines = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    // Remove lines exactly matching a line we auto-generate.
    if (Object.values(HEADER_COMMENT_LINES).includes(line)) {
      continue;
    }

    // Remove regions of lines exactly matching our eslint-disable format.
    if (line === '/* eslint-disable') {
      var j = i + 1;
      var foundMatch = false;
      while (j < lines.length) {
        if (lines[j] === '*/') {
          foundMatch = true;
          break;
        }
        if (!lines[j].startsWith('    ') || !lines[j].endsWith(',')) {
          break;
        }
        j++;
      }
      if (foundMatch) {
        // Skip forward to j, the "*/" line, so the next considered line will be
        // the one after.
        i = j;
        continue;
      }
    }

    // Everything else gets added to the file.
    resultLines.push(line);
  }
  return resultLines.join('\n');
}

var modernizeJS$1 = (function modernizeJS(config) {
  var _config$decaffeinateA, decaffeinateArgs, decaffeinatePath, jsFiles;

  return regeneratorRuntime.async(function modernizeJS$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _config$decaffeinateA = config.decaffeinateArgs, decaffeinateArgs = _config$decaffeinateA === undefined ? [] : _config$decaffeinateA, decaffeinatePath = config.decaffeinatePath;
          _context.next = 3;
          return regeneratorRuntime.awrap(getFilesToProcess$1(config, JS_FILE_RECOGNIZER));

        case 3:
          jsFiles = _context.sent;

          if (!(jsFiles.length === 0)) {
            _context.next = 7;
            break;
          }

          console.log('There were no JavaScript files to convert.');
          return _context.abrupt('return');

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(removeAutogeneratedHeader$1(config, jsFiles));

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap(runWithProgressBar$1(config, 'Running decaffeinate --modernize-js on all files...', jsFiles, makeCLIFn(function (path$$1) {
            return decaffeinatePath + ' --modernize-js ' + decaffeinateArgs.join(' ') + ' ' + path$$1;
          })));

        case 11:
          if (!config.jscodeshiftScripts) {
            _context.next = 14;
            break;
          }

          _context.next = 14;
          return regeneratorRuntime.awrap(runJscodeshiftScripts$1(jsFiles, config));

        case 14:
          if (!config.fixImportsConfig) {
            _context.next = 17;
            break;
          }

          _context.next = 17;
          return regeneratorRuntime.awrap(runFixImports$1(jsFiles, config));

        case 17:
          if (config.skipEslintFix) {
            _context.next = 20;
            break;
          }

          _context.next = 20;
          return regeneratorRuntime.awrap(runEslintFix$1(jsFiles, config, { isUpdate: true }));

        case 20:

          console.log('Successfully modernized ' + pluralize(jsFiles.length, 'file') + '.');
          console.log('You should now fix lint issues in any affected files.');

        case 22:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
});

var viewErrors$1 = (function viewErrors() {
  var resultsJson, results, filesToOpen, rl, answer, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, path$$1;

  return regeneratorRuntime.async(function viewErrors$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(mz_fs.exists('decaffeinate-results.json'));

        case 2:
          if (_context.sent) {
            _context.next = 5;
            break;
          }

          console.log('decaffeinate-results.json file not found. Please run the "check" command first.');
          return _context.abrupt('return');

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap(mz_fs.readFile('decaffeinate-results.json'));

        case 7:
          resultsJson = _context.sent;
          results = JSON.parse(resultsJson);
          filesToOpen = results.filter(function (r) {
            return r.error !== null;
          }).map(function (r) {
            return r.path;
          });

          if (!(filesToOpen.length === 0)) {
            _context.next = 13;
            break;
          }

          console.log('No failures were found!');
          return _context.abrupt('return');

        case 13:
          if (!(filesToOpen.length > 10)) {
            _context.next = 21;
            break;
          }

          rl = readline.createInterface(process.stdin, process.stdout);
          _context.next = 17;
          return regeneratorRuntime.awrap(rl.question('This will open ' + filesToOpen.length + ' browser tabs. Do you want to proceed? [y/N] '));

        case 17:
          answer = _context.sent;

          rl.close();

          if (answer.toLowerCase().startsWith('y')) {
            _context.next = 21;
            break;
          }

          return _context.abrupt('return');

        case 21:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 24;
          _iterator = filesToOpen[Symbol.iterator]();

        case 26:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 33;
            break;
          }

          path$$1 = _step.value;
          _context.next = 30;
          return regeneratorRuntime.awrap(openInRepl(path$$1));

        case 30:
          _iteratorNormalCompletion = true;
          _context.next = 26;
          break;

        case 33:
          _context.next = 39;
          break;

        case 35:
          _context.prev = 35;
          _context.t0 = _context['catch'](24);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 39:
          _context.prev = 39;
          _context.prev = 40;

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }

        case 42:
          _context.prev = 42;

          if (!_didIteratorError) {
            _context.next = 45;
            break;
          }

          throw _iteratorError;

        case 45:
          return _context.finish(42);

        case 46:
          return _context.finish(39);

        case 47:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this, [[24, 35, 39, 47], [40,, 42, 46]]);
});

function openInRepl(path$$1) {
  var fileContents, encodedFile, url;
  return regeneratorRuntime.async(function openInRepl$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(mz_fs.readFile(path$$1));

        case 2:
          fileContents = _context2.sent;
          encodedFile = encodeURIComponent(fileContents);
          url = 'http://decaffeinate-project.org/repl/#?evaluate=false&stage=full&code=' + encodedFile;
          _context2.next = 7;
          return regeneratorRuntime.awrap(opn(url, { wait: false }));

        case 7:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
}

var cli = function () {
  var command = null;
  commander.arguments('<command>').description('Run decaffeinate on a set of files.\n\n  Commands:\n    check: Try decaffeinate on the specified files and generate a report of which files can be\n           converted. By default, all .coffee files in the current directory are used.\n    convert: Run decaffeinate on the specified files and generate git commits for the transition.\n    view-errors: Open failures from the most recent run in an online repl.\n    clean: Delete all files ending with .original.coffee in the current working directory or any\n           of its subdirectories.\n    land: Create a merge commit with all commits generated by bulk-decaffeinate.').action(function (commandArg) {
    return command = commandArg;
  }).option('-c, --config [path]', 'The config file to use. This arg may be specified multiple\n                              times. If unspecified, files like bulk-decaffeinate.config.js will\n                              be discovered and used.', function (arg, args) {
    args.push(arg);return args;
  }, []).option('-f, --file [path]', 'An absolute or relative path to decaffeinate. This arg may be\n                              specified multiple times.', function (arg, args) {
    args.push(arg);return args;
  }, []).option('-p, --path-file [path]', 'A file containing the paths of .coffee files to decaffeinate, one\n                              path per line. Paths can be either absolute or relative to the\n                              current working directory.').option('-d, --dir [path]', 'A directory containing files to decaffeinate. All .coffee files in\n                              any subdirectory of this directory are considered for decaffeinate.').option('--use-js-modules', 'If specified, decaffeinate will convert the code to use import/export\n                              syntax and a follow-up fix-imports step will correct any imports\n                              across the codebase.').option('--land-base [revision]', 'The git revision to use as the base commit when running the "land"\n                              command. If none is specified, bulk-decaffeinate tries to use the\n                              first auto-generated commit in recent history.').option('--num-workers [number]', 'The number of workers to use for parallel operations.').option('--skip-verify', 'If specified, skips the initial verification step when running the\n                              "convert" command.').option('--decaffeinate-path [path]', 'The path to the decaffeinate binary. If none is specified, it will\n                              be automatically discovered from node_modules and then from the\n                              PATH.').option('--jscodeshift-path [path]', 'The path to the jscodeshift binary. If none is specified, it will be\n                              automatically discovered from node_modules and then from the PATH.').option('--eslint-path [path]', 'The path to the eslint binary. If none is specified, it will be\n                              automatically discovered from node_modules and then from the PATH.').option('--allow-invalid-constructors', 'Deprecated; decaffeinate now allows invalid constructors by default.').parse(process.argv);

  runCommand(command);
};

function runCommand(command) {
  var config, _config, _config2, _config3;

  return regeneratorRuntime.async(function runCommand$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;

          if (!(command === 'check')) {
            _context.next = 9;
            break;
          }

          _context.next = 4;
          return regeneratorRuntime.awrap(resolveConfig$1(commander));

        case 4:
          config = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(check$1(config));

        case 7:
          _context.next = 44;
          break;

        case 9:
          if (!(command === 'convert')) {
            _context.next = 17;
            break;
          }

          _context.next = 12;
          return regeneratorRuntime.awrap(resolveConfig$1(commander, { needsJscodeshift: true, needsEslint: true }));

        case 12:
          _config = _context.sent;
          _context.next = 15;
          return regeneratorRuntime.awrap(convert$1(_config));

        case 15:
          _context.next = 44;
          break;

        case 17:
          if (!(command === 'modernize-js')) {
            _context.next = 25;
            break;
          }

          _context.next = 20;
          return regeneratorRuntime.awrap(resolveConfig$1(commander, { needsJscodeshift: true, needsEslint: true }));

        case 20:
          _config2 = _context.sent;
          _context.next = 23;
          return regeneratorRuntime.awrap(modernizeJS$1(_config2));

        case 23:
          _context.next = 44;
          break;

        case 25:
          if (!(command === 'view-errors')) {
            _context.next = 30;
            break;
          }

          _context.next = 28;
          return regeneratorRuntime.awrap(viewErrors$1());

        case 28:
          _context.next = 44;
          break;

        case 30:
          if (!(command === 'clean')) {
            _context.next = 35;
            break;
          }

          _context.next = 33;
          return regeneratorRuntime.awrap(clean$1());

        case 33:
          _context.next = 44;
          break;

        case 35:
          if (!(command === 'land')) {
            _context.next = 43;
            break;
          }

          _context.next = 38;
          return regeneratorRuntime.awrap(resolveConfig$1(commander));

        case 38:
          _config3 = _context.sent;
          _context.next = 41;
          return regeneratorRuntime.awrap(land$1(_config3));

        case 41:
          _context.next = 44;
          break;

        case 43:
          commander.outputHelp();

        case 44:
          _context.next = 50;
          break;

        case 46:
          _context.prev = 46;
          _context.t0 = _context['catch'](0);

          process.exitCode = 1;
          console.error(CLIError.formatError(_context.t0));

        case 50:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this, [[0, 46]]);
}

module.exports = cli;
//# sourceMappingURL=bulk-decaffeinate.js.map
