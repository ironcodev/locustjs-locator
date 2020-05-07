"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Resolve = exports.DefaultLocator = exports.LocatorBase = exports.default = void 0;

var _locustjsBase = require("locustjs-base");

var _locustjsExtensionsObject = require("locustjs-extensions-object");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Resolve = _locustjsBase.Enum.define({
  PerRequest: 0,
  // new instance for each request
  PerApp: 1,
  // single instance per app (uses localStroage)
  PerPage: 2,
  // single instance per page load
  PerSession: 3 // single instance per browser session (uses sessionStorage)

}, 'Resolve');

exports.Resolve = Resolve;

var LocatorBase = /*#__PURE__*/function () {
  function LocatorBase() {
    _classCallCheck(this, LocatorBase);

    if (this.constructor === LocatorBase) {
      throw 'LocatorBase is abstract. You cannot instantiate from it.';
    }
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
      (0, _locustjsBase.NotImplementedException)('register()');
    }
  }, {
    key: "registerFactory",
    value: function registerFactory(abstraction, factory) {
      var resolveType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Resolve.PerRequest;
      var state = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      (0, _locustjsBase.NotImplementedException)('registerFactory()');
    }
  }, {
    key: "registerInstance",
    value: function registerInstance(abstraction, instance) {
      var resolveType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Resolve.PerRequest;
      var state = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      (0, _locustjsBase.NotImplementedException)('registerInstance()');
    }
  }, {
    key: "resolveBy",
    value: function resolveBy(abstraction, state) {
      (0, _locustjsBase.NotImplementedException)('resolveBy()');
    }
  }, {
    key: "resolve",
    value: function resolve(abstraction) {
      (0, _locustjsBase.NotImplementedException)('resolve()');
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
      return this._data[key];
    }
  }, {
    key: "setItem",
    value: function setItem(key, value) {
      this._data[key] = value;
    }
  }]);

  return DefaultStorage;
}();

var DefaultLocator = /*#__PURE__*/function (_LocatorBase) {
  _inherits(DefaultLocator, _LocatorBase);

  var _super = _createSuper(DefaultLocator);

  function DefaultLocator() {
    var _this;

    _classCallCheck(this, DefaultLocator);

    _this = _super.call(this);
    _this.__entries = [];
    _this.__localStorage = window && window.localStorage || new DefaultStorage();
    _this.__sessionStorage = window && window.sessionStorage || new DefaultStorage();
    return _this;
  }

  _createClass(DefaultLocator, [{
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

      if (!(0, _locustjsExtensionsObject.isSubClassOf)(concretion, abstraction)) {
        throw 'Concretion must be a subclass of abstraction.';
      }

      return concretion;
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
        console.error(e);
        throw "".concat(entry.abstraction.name, ": factory execution failed.");
      }

      if ((0, _locustjsBase.isEmpty)(result)) {
        throw "".concat(entry.abstraction.name, ": factory returned nothing.");
      }

      if (!_instanceof(result, entry.abstraction)) {
        throw "factory returned incorrect type. expected ".concat(entry.abstraction.name, " object.");
      }

      return result;
    }
  }, {
    key: "_getStoredInstance",
    value: function _getStoredInstance(entry, storage) {
      try {
        var raw = storage.getItem(entry.abstraction.name);
        var instance = this.deserialize(raw);
        instance.__proto__ = new entry.abstraction().__proto__;
        return instance;
      } catch (e) {
        return undefined;
      }
    }
  }, {
    key: "_setStoredInstance",
    value: function _setStoredInstance(entry, storage, instance) {
      var raw = this.serialize(instance);
      storage.setItem(entry.abstraction.name, raw);
    }
  }, {
    key: "_createInstance",
    value: function _createInstance(entry, args) {
      var result = _construct(entry.concretion, _toConsumableArray(args));

      return result;
    }
  }, {
    key: "_getInstance",
    value: function _getInstance(entry, args) {
      var result;

      if (!(0, _locustjsBase.isEmpty)(entry.instance)) {
        result = entry.instance;
      } else if ((0, _locustjsBase.isFunction)(entry.factory)) {
        result = this._executeFactory(entry);
      } else {
        result = this._createInstance(entry, args);
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

      var exists = this.__entries.find(function (e) {
        return e.abstraction == abstraction && e.concretion == concretion && e.resolveType == resolveType && e.state == state;
      });

      if (exists) {
        throw "registration entry already exists";
      }

      this.__entries.push({
        abstraction: abstraction,
        concretion: concretion,
        resolveType: resolveType,
        state: state
      });
    }
  }, {
    key: "registerFactory",
    value: function registerFactory(abstraction, factory) {
      var resolveType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Resolve.PerRequest;
      var state = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      abstraction = this._validateAbstraction(abstraction);
      factory = this._validateFactory(factory);
      resolveType = this._validateResolveType(resolveType);

      var exists = this.__entries.find(function (e) {
        return e.abstraction == abstraction && e.factory == factory && e.resolveType == resolveType && e.state == state;
      });

      if (exists) {
        throw "registration entry already exists";
      }

      this.__entries.push({
        abstraction: abstraction,
        factory: factory,
        resolveType: resolveType,
        state: state
      });
    }
  }, {
    key: "registerInstance",
    value: function registerInstance(abstraction, instance) {
      var resolveType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Resolve.PerRequest;
      var state = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      abstraction = this._validateAbstraction(abstraction);
      resolveType = this._validateResolveType(resolveType);

      var exists = this.__entries.find(function (e) {
        return e.abstraction == abstraction && e.instance == instance && e.resolveType == resolveType && e.state == state;
      });

      if (exists) {
        throw "registration entry already exists";
      }

      this.__entries.push({
        abstraction: abstraction,
        instance: instance,
        resolveType: resolveType,
        state: state
      });
    }
  }, {
    key: "getConfig",
    value: function getConfig(abstraction) {
      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var result = this.__entries.find(function (e) {
        return e.abstraction === abstraction && e.state === state;
      });

      return { ...result
      };
    }
  }, {
    key: "resolveBy",
    value: function resolveBy(abstraction, state) {
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
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
            result = this._getInstance(entry, args);
            break;

          case Resolve.PerPage:
            result = this._getInstance(entry, args);
            this.__entries[abstraction].instance = result;
            break;

          case Resolve.PerSession:
            storage = this.__sessionStorage;
            result = this._getStoredInstance(entry, storage);

            if ((0, _locustjsBase.isEmpty)(result)) {
              result = this._getInstance(entry, args);

              this._setStoredInstance(entry, storage, result);
            }

            break;

          case Resolve.PerApp:
            storage = this.__localStorage;
            result = this._getStoredInstance(entry, storage);

            if ((0, _locustjsBase.isEmpty)(result)) {
              result = this._getInstance(entry, args);

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
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return this.resolveBy.apply(this, [abstraction, null].concat(args));
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
      } else if (value.constructor) {
        throw "locator must have a constructor";
      } else if (!(0, _locustjsExtensionsObject.isSubClassOf)(value.constructor, LocatorBase)) {
        throw "locator must be a subclass of LocatorBase";
      }

      __locator_instance = value;
    }
  }]);

  return Locator;
}();

var _default = Locator;
exports.default = _default;