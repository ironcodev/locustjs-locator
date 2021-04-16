"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Resolve = exports.DefaultStorage = exports.DefaultLocator = exports.LocatorBase = exports["default"] = void 0;

var _locustjsBase = require("locustjs-base");

var _locustjsException = require("locustjs-exception");

var _locustjsEnum = _interopRequireDefault(require("locustjs-enum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Resolve = _locustjsEnum["default"].define({
  PerRequest: 0,
  // new instance for each request
  PerApp: 1,
  // single instance per app (uses localStorage)
  PerPage: 2,
  // single instance per page load
  PerSession: 3 // single instance per browser session (uses sessionStorage)

}, 'Resolve');

exports.Resolve = Resolve;

var LocatorBase = /*#__PURE__*/function () {
  function LocatorBase() {
    _classCallCheck(this, LocatorBase);

    (0, _locustjsException.throwIfInstantiateAbstract)(LocatorBase, this);
  }

  _createClass(LocatorBase, [{
    key: "serialize",
    value: function serialize(instance) {
      var result = JSON.stringify(instance);
      return result;
    }
  }, {
    key: "deserialize",
    value: function deserialize(raw) {
      var result = JSON.parse(raw);
      return result;
    }
  }, {
    key: "register",
    value: function register(abstraction, concretion) {
      var resolveType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Resolve.PerRequest;
      var state = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      (0, _locustjsException.throwNotImplementedException)('register');
    }
  }, {
    key: "registerFactory",
    value: function registerFactory(abstraction, factory) {
      var resolveType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Resolve.PerRequest;
      var state = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      (0, _locustjsException.throwNotImplementedException)('registerFactory');
    }
  }, {
    key: "registerInstance",
    value: function registerInstance(abstraction, instance) {
      var resolveType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Resolve.PerRequest;
      var state = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      (0, _locustjsException.throwNotImplementedException)('registerInstance');
    }
  }, {
    key: "resolveBy",
    value: function resolveBy(abstraction, state) {
      (0, _locustjsException.throwNotImplementedException)('resolveBy');
    }
  }, {
    key: "resolve",
    value: function resolve(abstraction) {
      (0, _locustjsException.throwNotImplementedException)('resolve');
    }
  }, {
    key: "remove",
    value: function remove(abstraction) {
      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      (0, _locustjsException.throwNotImplementedException)('remove');
    }
  }, {
    key: "exists",
    value: function exists(abstraction) {
      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      (0, _locustjsException.throwNotImplementedException)('exists');
    }
  }, {
    key: "getLocalStorage",
    value: function getLocalStorage() {
      (0, _locustjsException.throwNotImplementedException)('getLocalStorage');
    }
  }, {
    key: "setLocalStorage",
    value: function setLocalStorage(storage) {
      (0, _locustjsException.throwNotImplementedException)('setLocalStorage');
    }
  }, {
    key: "getSessionStorage",
    value: function getSessionStorage() {
      (0, _locustjsException.throwNotImplementedException)('getSessionStorage');
    }
  }, {
    key: "setSessionStorage",
    value: function setSessionStorage(storage) {
      (0, _locustjsException.throwNotImplementedException)('setSessionStorage');
    }
  }, {
    key: "length",
    get: function get() {
      (0, _locustjsException.throwNotImplementedException)('length');
    }
  }]);

  return LocatorBase;
}();

exports.LocatorBase = LocatorBase;

var DefaultStorage = /*#__PURE__*/function () {
  function DefaultStorage() {
    _classCallCheck(this, DefaultStorage);

    this._data = {};
  }

  _createClass(DefaultStorage, [{
    key: "getItem",
    value: function getItem(key) {
      return (this._data[key] || '').toString();
    }
  }, {
    key: "setItem",
    value: function setItem(key, value) {
      this._data[key] = (value || '').toString();
    }
  }, {
    key: "removeItem",
    value: function removeItem(key) {
      delete this._data[key];
    }
  }, {
    key: "length",
    get: function get() {
      return Object.keys(this._data).length;
    }
  }, {
    key: "clear",
    value: function clear() {
      this._data = {};
    }
  }]);

  return DefaultStorage;
}();

exports.DefaultStorage = DefaultStorage;

var DefaultLocator = /*#__PURE__*/function (_LocatorBase) {
  _inherits(DefaultLocator, _LocatorBase);

  var _super = _createSuper(DefaultLocator);

  function DefaultLocator(config) {
    var _this;

    _classCallCheck(this, DefaultLocator);

    _this = _super.call(this);
    _this.config = Object.assign({
      throwOnRegisterExistingAbstractions: false,
      logger: {
        log: function log() {
          var _console;

          return (_console = console).log.apply(_console, arguments);
        }
      }
    }, config);
    _this.__entries = [];
    _this.__localStorage = typeof window !== 'undefined' && window.localStorage || new DefaultStorage();
    _this.__sessionStorage = typeof window !== 'undefined' && window.sessionStorage || new DefaultStorage();
    _this.id = _this.constructor.name;
    return _this;
  }

  _createClass(DefaultLocator, [{
    key: "getLocalStorage",
    value: function getLocalStorage() {
      return this.__localStorage;
    }
  }, {
    key: "setLocalStorage",
    value: function setLocalStorage(storage) {
      this.__localStorage = storage;
    }
  }, {
    key: "getSessionStorage",
    value: function getSessionStorage() {
      return this.__sessionStorage;
    }
  }, {
    key: "setSessionStorage",
    value: function setSessionStorage(storage) {
      this.__sessionStorage = storage;
    }
  }, {
    key: "length",
    get: function get() {
      return this.__entries.length;
    }
  }, {
    key: "_danger",
    value: function _danger() {
      if ((0, _locustjsBase.isSomeObject)(this.config.logger)) {
        if ((0, _locustjsBase.isFunction)(this.config.logger.danger)) {
          var _this$config$logger;

          (_this$config$logger = this.config.logger).danger.apply(_this$config$logger, arguments);
        } else if ((0, _locustjsBase.isFunction)(this.config.logger.log)) {
          var _this$config$logger2;

          (_this$config$logger2 = this.config.logger).log.apply(_this$config$logger2, arguments);
        }
      }
    }
  }, {
    key: "_debug",
    value: function _debug() {
      if ((0, _locustjsBase.isSomeObject)(this.config.logger)) {
        if ((0, _locustjsBase.isFunction)(this.config.logger.debug)) {
          var _this$config$logger3;

          (_this$config$logger3 = this.config.logger).debug.apply(_this$config$logger3, arguments);
        } else if ((0, _locustjsBase.isFunction)(this.config.logger.log)) {
          var _this$config$logger4;

          (_this$config$logger4 = this.config.logger).log.apply(_this$config$logger4, arguments);
        }
      }
    }
  }, {
    key: "_registrationExistence",
    value: function _registrationExistence(abstraction, concretion, factory, instance) {
      var resolveType = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : Resolve.PerRequest;
      var state = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
      var result = false;
      var errorMessage;

      if (!(0, _locustjsBase.isFunction)(factory) && (0, _locustjsBase.isEmpty)(instance)) {
        result = this.__entries.find(function (e) {
          return e.abstraction == abstraction && e.concretion == concretion && e.resolveType == resolveType && e.state == state;
        });

        if (result) {
          errorMessage = "registration entry for abstraction '".concat(abstraction.name, "' and state '").concat(state, "' already exists.");
        }
      } else if ((0, _locustjsBase.isFunction)(factory)) {
        result = this.__entries.find(function (e) {
          return e.abstraction == abstraction && e.factory == factory && e.resolveType == resolveType && e.state == state;
        });

        if (result) {
          errorMessage = "registration entry for abstraction '".concat(abstraction.name, "' based on specified factory and state '").concat(state, "' already exists.");
        }
      } else if (!(0, _locustjsBase.isEmpty)(instance)) {
        result = this.__entries.find(function (e) {
          return e.abstraction == abstraction && e.instance == instance && e.resolveType == resolveType && e.state == state;
        });

        if (result) {
          errorMessage = "registration entry for abstraction '".concat(abstraction.name, "' based on specified instance and state '").concat(state, "' already exists.");
        }
      }

      if (result) {
        if (this.config.throwOnRegisterExistingAbstractions) {
          throw errorMessage;
        } else {
          this._danger(errorMessage);
        }
      }

      return result;
    }
  }, {
    key: "_log",
    value: function _log() {
      if ((0, _locustjsBase.isSomeObject)(this.config.logger)) {
        if ((0, _locustjsBase.isFunction)(this.config.logger.log)) {
          var _this$config$logger5;

          (_this$config$logger5 = this.config.logger).log.apply(_this$config$logger5, arguments);
        }
      }
    }
  }, {
    key: "_validateAbstraction",
    value: function _validateAbstraction(abstraction) {
      if (!(0, _locustjsBase.isFunction)(abstraction)) {
        throw "Expected class or constructor function for the abstraction.";
      }

      if (abstraction.name.length == 0) {
        throw 'abstraction cannot be anonymous. It must have a name.';
      }

      return abstraction;
    }
  }, {
    key: "_validateConcretion",
    value: function _validateConcretion(concretion, abstraction) {
      if (!(0, _locustjsBase.isFunction)(concretion)) {
        throw "Invalid concretion (class or constructor function expected).";
      }

      if (!(0, _locustjsBase.isSubClassOf)(concretion, abstraction)) {
        throw 'Concretion must be a subclass of abstraction.';
      }

      return concretion;
    }
  }, {
    key: "_validateInstance",
    value: function _validateInstance(abstraction, instance) {
      var result = instance;

      if ((0, _locustjsBase.isEmpty)(instance)) {
        throw "no instance specified.";
      }

      result = (0, _locustjsBase.isFunction)(instance) ? instance(this) : instance;

      if (!(result instanceof abstraction)) {
        throw 'instance must be a subclass of abstraction.';
      }

      return result;
    }
  }, {
    key: "_validateFactory",
    value: function _validateFactory(factory) {
      if (!(0, _locustjsBase.isFunction)(factory)) {
        throw 'Invalid factory. Factory must be a function';
      }

      return factory;
    }
  }, {
    key: "_validateResolveType",
    value: function _validateResolveType(resolveType) {
      return Resolve.getNumber(resolveType, Resolve.PerRequest);
    }
  }, {
    key: "_executeFactory",
    value: function _executeFactory(entry) {
      var result;

      try {
        result = entry.factory(this);
      } catch (e) {
        this._danger(e);

        throw "".concat(entry.abstraction.name, ": factory execution failed.");
      }

      if ((0, _locustjsBase.isEmpty)(result)) {
        throw "".concat(entry.abstraction.name, ": factory returned nothing.");
      }

      if (!(result instanceof entry.abstraction)) {
        throw "factory returned incorrect type. expected ".concat(entry.abstraction.name, " object.");
      }

      return result;
    }
  }, {
    key: "_getStorageName",
    value: function _getStorageName(abstraction) {
      return this.id + '.' + abstraction.name;
    }
  }, {
    key: "_getStoredInstance",
    value: function _getStoredInstance(entry, storage) {
      var result;

      try {
        var key = this._getStorageName(entry.abstraction);

        var raw = storage.getItem(key);

        if (raw) {
          result = this.deserialize(raw);

          if (result) {
            for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
              args[_key - 2] = arguments[_key];
            }

            var temp = this._createInstance.apply(this, [entry].concat(args));

            Object.setPrototypeOf(result, Object.getPrototypeOf(temp));
          }
        }
      } catch (e) {
        this._danger(e);
      }

      return result;
    }
  }, {
    key: "_setStoredInstance",
    value: function _setStoredInstance(entry, storage, instance) {
      var key = this._getStorageName(entry.abstraction);

      var raw = this.serialize(instance);
      storage.setItem(key, raw);
    }
  }, {
    key: "_createInstance",
    value: function _createInstance(entry) {
      var result;

      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      if ((0, _locustjsBase.isArray)(entry.abstraction.dependencies)) {
        var dependencies = [];

        var _iterator = _createForOfIteratorHelper(entry.abstraction.dependencies),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var dependencyAbstract = _step.value;
            var dependencyConcrete = void 0;

            do {
              if ((0, _locustjsBase.isArray)(dependencyAbstract)) {
                if (dependencyAbstract.length) {
                  var dependencyState = dependencyAbstract.length > 1 ? dependencyAbstract[1] : null;
                  var dependencyArgs = dependencyAbstract.slice(2);
                  dependencyConcrete = this.resolveBy.apply(this, [dependencyAbstract[0], dependencyState].concat(_toConsumableArray(dependencyArgs)));
                }

                break;
              }

              if ((0, _locustjsBase.isObject)(dependencyAbstract)) {
                if (dependencyAbstract.state == null) {
                  if ((0, _locustjsBase.isArray)(dependencyAbstract.args)) {
                    dependencyConcrete = this.resolve.apply(this, [dependencyAbstract.dependency].concat(_toConsumableArray(dependencyAbstract.args)));
                  } else {
                    dependencyConcrete = this.resolve(dependencyAbstract.dependency);
                  }
                } else {
                  if ((0, _locustjsBase.isArray)(dependencyAbstract.args)) {
                    dependencyConcrete = this.resolveBy.apply(this, [dependencyAbstract.dependency, dependencyAbstract.state].concat(_toConsumableArray(dependencyAbstract.args)));
                  } else {
                    dependencyConcrete = this.resolveBy(dependencyAbstract.dependency, dependencyAbstract.state);
                  }
                }

                break;
              }

              dependencyConcrete = this.resolve(dependencyAbstract);
            } while (false);

            dependencies.push(dependencyConcrete);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        var _args = [].concat(dependencies, args);

        result = _construct(entry.concretion, _toConsumableArray(_args));
      } else {
        result = _construct(entry.concretion, args);
      }

      return result;
    }
  }, {
    key: "_getInstance",
    value: function _getInstance(entry) {
      var result;

      if (!(0, _locustjsBase.isEmpty)(entry.instance)) {
        result = entry.instance;
      } else if ((0, _locustjsBase.isFunction)(entry.factory)) {
        result = this._executeFactory(entry);
      } else {
        for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          args[_key3 - 1] = arguments[_key3];
        }

        result = this._createInstance.apply(this, [entry].concat(args));
      }

      return result;
    }
  }, {
    key: "register",
    value: function register(abstraction, concretion) {
      var resolveType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Resolve.PerRequest;
      var state = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      abstraction = this._validateAbstraction(abstraction);
      concretion = this._validateConcretion(concretion, abstraction);
      resolveType = this._validateResolveType(resolveType);

      if (!this._registrationExistence(abstraction, concretion, null, null, resolveType, state)) {
        this.__entries.push({
          abstraction: abstraction,
          concretion: concretion,
          resolveType: resolveType,
          state: state
        });
      }
    }
  }, {
    key: "registerFactory",
    value: function registerFactory(abstraction, factory) {
      var resolveType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Resolve.PerRequest;
      var state = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      abstraction = this._validateAbstraction(abstraction);
      factory = this._validateFactory(factory);
      resolveType = this._validateResolveType(resolveType);

      if (!this._registrationExistence(abstraction, null, factory, null, resolveType, state)) {
        this.__entries.push({
          abstraction: abstraction,
          factory: factory,
          resolveType: resolveType,
          state: state
        });
      }
    }
  }, {
    key: "registerInstance",
    value: function registerInstance(abstraction, instance) {
      var resolveType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Resolve.PerRequest;
      var state = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      abstraction = this._validateAbstraction(abstraction);
      instance = this._validateInstance(abstraction, instance);
      resolveType = this._validateResolveType(resolveType);

      if (!this._registrationExistence(abstraction, null, null, instance, resolveType, state)) {
        this.__entries.push({
          abstraction: abstraction,
          instance: instance,
          resolveType: resolveType,
          state: state
        });
      }
    }
  }, {
    key: "getConfig",
    value: function getConfig(abstraction) {
      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var result = this.__entries.find(function (e) {
        return e.abstraction === abstraction && e.state == state;
      });

      return _objectSpread({}, result);
    }
  }, {
    key: "resolveBy",
    value: function resolveBy(abstraction, state) {
      for (var _len4 = arguments.length, args = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
        args[_key4 - 2] = arguments[_key4];
      }

      var result, storage;

      if (arguments.length == 0 || (0, _locustjsBase.isEmpty)(abstraction)) {
        throw "Please specify abstraction";
      } else {
        var entry = this.getConfig(abstraction, state);

        if ((0, _locustjsBase.isEmpty)(entry)) {
          throw "no registration found for ".concat(abstraction.name || 'anonymous');
        }

        switch (entry.resolveType) {
          case Resolve.PerRequest:
            result = this._getInstance.apply(this, [entry].concat(args));
            break;

          case Resolve.PerPage:
            result = this._getInstance.apply(this, [entry].concat(args));
            this.__entries[abstraction].instance = result;
            break;

          case Resolve.PerSession:
            storage = this.getSessionStorage();
            result = this._getStoredInstance.apply(this, [entry, storage].concat(args));

            if ((0, _locustjsBase.isEmpty)(result)) {
              result = this._getInstance.apply(this, [entry].concat(args));

              this._setStoredInstance(entry, storage, result);
            }

            break;

          case Resolve.PerApp:
            storage = this.getLocalStorage();
            result = this._getStoredInstance.apply(this, [entry, storage].concat(args));

            if ((0, _locustjsBase.isEmpty)(result)) {
              result = this._getInstance.apply(this, [entry].concat(args));

              this._setStoredInstance(entry, storage, result);
            }

            break;
        }
      }

      return result;
    }
  }, {
    key: "resolve",
    value: function resolve(abstraction) {
      for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        args[_key5 - 1] = arguments[_key5];
      }

      return this.resolveBy.apply(this, [abstraction, null].concat(args));
    }
  }, {
    key: "remove",
    value: function remove(abstraction) {
      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var index = this.__entries.findIndex(function (e) {
        return e.abstraction === abstraction && e.state == state;
      });

      if (index >= 0) {
        this.__entries.splice(index, 1);

        return true;
      }

      return false;
    }
  }, {
    key: "exists",
    value: function exists(abstraction) {
      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var index = this.__entries.findIndex(function (e) {
        return e.abstraction === abstraction && e.state == state;
      });

      return index >= 0;
    }
  }]);

  return DefaultLocator;
}(LocatorBase);

exports.DefaultLocator = DefaultLocator;

var __locator_instance = new DefaultLocator();

var Locator = /*#__PURE__*/function () {
  function Locator() {
    _classCallCheck(this, Locator);
  }

  _createClass(Locator, null, [{
    key: "Instance",
    get: function get() {
      return __locator_instance;
    },
    set: function set(value) {
      if ((0, _locustjsBase.isEmpty)(value)) {
        throw "no object given to be set as current locator.";
      } else if (!(0, _locustjsBase.isFunction)(value.constructor)) {
        throw "locator must have a constructor";
      } else if (!(0, _locustjsBase.isSubClassOf)(value.constructor, LocatorBase)) {
        throw "locator must be a subclass of LocatorBase";
      }

      __locator_instance = value;
    }
  }]);

  return Locator;
}();

var _default = Locator;
exports["default"] = _default;
