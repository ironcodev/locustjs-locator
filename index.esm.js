import { isArray, isFunction, isEmpty, isSubClassOf, isSomeObject, isObject, isNumeric, isNullOrUndefined } from '@locustjs/base'
import { throwIfInstantiateAbstract, throwNotImplementedException } from '@locustjs/exception';
import { Enum } from '@locustjs/enum';

const Resolve = Enum.define({
    PerRequest: 0,  // new instance for each request
    PerApp: 1,      // single instance per app (uses localStorage)
    PerPage: 2,     // single instance per page load
    PerSession: 3   // single instance per browser session (uses sessionStorage)
}, 'Resolve');

class LocatorBase {
    constructor() {
        throwIfInstantiateAbstract(LocatorBase, this);
    }
    serialize(instance) {
        const result = JSON.stringify(instance);

        return result;
    }
    deserialize(raw) {
        const result = JSON.parse(raw);

        return result;
    }
    register(abstraction, concretion, resolveType = Resolve.PerRequest, state = null) {
        throwNotImplementedException('register');
    }
    registerFactory(abstraction, factory, resolveType = Resolve.PerRequest, state = null) {
        throwNotImplementedException('registerFactory');
    }
    registerInstance(abstraction, instance, resolveType = Resolve.PerRequest, state = null) {
        throwNotImplementedException('registerInstance');
    }
    resolveBy(abstraction, state, ...args) {
        throwNotImplementedException('resolveBy');
    }
    resolve(abstraction, ...args) {
        throwNotImplementedException('resolve');
    }
    remove(abstraction, state = null) {
        throwNotImplementedException('remove');
    }
    exists(abstraction, state = null) {
        throwNotImplementedException('exists');
    }
    indexOf(abstraction, state = null) {
        throwNotImplementedException('indexOf');
    }
    getLocalStorage() {
        throwNotImplementedException('getLocalStorage');
    }
    setLocalStorage(storage) {
        throwNotImplementedException('setLocalStorage');
    }
    getSessionStorage() {
        throwNotImplementedException('getSessionStorage');
    }
    setSessionStorage(storage) {
        throwNotImplementedException('setSessionStorage');
    }
    get length() {
        throwNotImplementedException('length');
    }
}

class DefaultStorage {
    constructor() {
        this._data = {};
    }
    getItem(key) {
        return (this._data[key] || '').toString();
    }
    setItem(key, value) {
        this._data[key] = (value || '').toString();
    }
    removeItem(key) {
        delete this._data[key];
    }
    get length() {
        return Object.keys(this._data).length;
    }
    clear() {
        this._data = {}
    }
}

class DefaultLocator extends LocatorBase {
    constructor(config) {
        super();

        this.config = Object.assign({
            throwOnRegisterExistingAbstractions: false,
            logger: {
                log: (...args) => console.log(...args)
            }
        }, config);
        this.__entries = [];
        this.__localStorage = (typeof window !== 'undefined' && window.localStorage) || new DefaultStorage();
        this.__sessionStorage = (typeof window !== 'undefined' && window.sessionStorage) || new DefaultStorage();
        this.id = this.constructor.name;
    }
    getLocalStorage() {
        return this.__localStorage;
    }
    setLocalStorage(storage) {
        this.__localStorage = storage;
    }
    getSessionStorage() {
        return this.__sessionStorage;
    }
    setSessionStorage(storage) {
        this.__sessionStorage = storage;
    }
    get length() {
        return this.__entries.length;
    }
    _danger(...args) {
        if (isSomeObject(this.config.logger)) {
            if (isFunction(this.config.logger.danger)) {
                this.config.logger.danger(...args)
            } else if (isFunction(this.config.logger.log)) {
                this.config.logger.log(...args)
            }
        }
    }
    _debug(...args) {
        if (isSomeObject(this.config.logger)) {
            if (isFunction(this.config.logger.debug)) {
                this.config.logger.debug(...args)
            } else if (isFunction(this.config.logger.log)) {
                this.config.logger.log(...args)
            }
        }
    }
    _registrationExistence(abstraction, concretion, factory, instance, resolveType = Resolve.PerRequest, state = null) {
        let result = false;
        let errorMessage;

        if (!isFunction(factory) && isEmpty(instance)) {
            result = this.__entries.find(e => e.abstraction == abstraction &&
                e.concretion == concretion &&
                e.resolveType == resolveType &&
                e.state == state);

            if (result) {
                errorMessage = `registration entry for abstraction '${abstraction.name}' and state '${state}' already exists.`;
            }
        } else if (isFunction(factory)) {
            result = this.__entries.find(e => e.abstraction == abstraction &&
                e.factory == factory &&
                e.resolveType == resolveType &&
                e.state == state);

            if (result) {
                errorMessage = `registration entry for abstraction '${abstraction.name}' based on specified factory and state '${state}' already exists.`;
            }
        } else if (!isEmpty(instance)) {
            result = this.__entries.find(e => e.abstraction == abstraction &&
                e.instance == instance &&
                e.resolveType == resolveType &&
                e.state == state);

            if (result) {
                errorMessage = `registration entry for abstraction '${abstraction.name}' based on specified instance and state '${state}' already exists.`;
            }
        }

        if (result) {
            if (this.config.throwOnRegisterExistingAbstractions) {
                throw errorMessage
            } else {
                this._danger(errorMessage);
            }
        }

        return result;
    }
    _log(...args) {
        if (isSomeObject(this.config.logger)) {
            if (isFunction(this.config.logger.log)) {
                this.config.logger.log(...args)
            }
        }
    }
    _validateAbstraction(abstraction) {
        if (!isFunction(abstraction)) {
            throw `Expected class or constructor function for the abstraction.`
        }

        if (abstraction.name.length == 0) {
            throw 'abstraction cannot be anonymous. It must have a name.'
        }

        return abstraction;
    }
    _validateConcretion(concretion, abstraction) {
        if (isNullOrUndefined(concretion)) {
            concretion = abstraction;
        }

        if (!isFunction(concretion)) {
            throw `Invalid concretion (class or constructor function expected).`
        }

        if (!isSubClassOf(concretion, abstraction)) {
            throw 'Concretion must be a subclass of abstraction.'
        }

        return concretion;
    }
    _validateInstance(abstraction, instance) {
        let result = instance;

        if (isEmpty(instance)) {
            throw `no instance specified.`
        }

        result = isFunction(instance) ? instance(this) : instance;

        if (!(result instanceof abstraction)) {
            throw 'instance must be a subclass of abstraction.'
        }

        return result;
    }
    _validateFactory(factory) {
        if (!isFunction(factory)) {
            throw 'Invalid factory. Factory must be a function'
        }

        return factory;
    }
    _validateResolveType(resolveType) {
        return Resolve.getNumber(resolveType, Resolve.PerRequest);
    }
    _executeFactory(entry) {
        let result;

        try {
            result = entry.factory(this);
        } catch (e) {
            this._danger(e);

            throw `${entry.abstraction.name}: factory execution failed.`;
        }

        if (isEmpty(result)) {
            throw `${entry.abstraction.name}: factory returned nothing.`;
        }

        if (!(result instanceof entry.abstraction)) {
            throw `factory returned incorrect type. expected ${entry.abstraction.name} object.`
        }

        return result;
    }
    _getStorageName(abstraction) {
        return this.id + '.' + abstraction.name
    }
    _getStoredInstance(entry, storage, ...args) {
        let result;

        try {
            const key = this._getStorageName(entry.abstraction);
            const raw = storage.getItem(key);

            if (raw) {
                result = this.deserialize(raw);

                if (result) {
                    const temp = this._createInstance(entry, ...args);

                    Object.setPrototypeOf(result, Object.getPrototypeOf(temp));
                }
            }
        } catch (e) {
            this._danger(e);
        }

        return result;
    }
    _setStoredInstance(entry, storage, instance) {
        const key = this._getStorageName(entry.abstraction);
        const raw = this.serialize(instance);

        storage.setItem(key, raw);
    }
    _getDependencyArgs(abstraction, args) {
        let result = args[0][abstraction];

        if (isEmpty(result)) {
            result = [];
        } else {
            if (!isArray(result)) {
                if (isObject(result) && isArray(result.args)) {
                    result = result.args;
                } else {
                    result = [result]
                }
            }
        }

        return result;
    }
    _getDependencyState(abstraction, args) {
        let result = null;
        let dependencyConfig = args[0][abstraction];

        if (isObject(dependencyConfig)) {
            result = dependencyConfig.state;
        }

        return result;
    }
    _createInstance(entry, ...args) {
        let result;
        const hasDependencyArgs = args.length == 1 && isObject(args[0]) && isArray(args[0].args);
        let declaredDependencies = []
        let current = entry.abstraction;

        while (current) {
            if (isArray(current.dependencies)) {
                declaredDependencies = current.dependencies;
                break;
            }

            current = Object.getPrototypeOf(current);
        }

        if (declaredDependencies.length) {
            const dependencies = [];

            for (let dependencyAbstract of declaredDependencies) {
                let _dependencyConcrete;
                let _dependencyArgs = [];
                let _dependencyState = null;
                let _dependencyAbstract;

                do {
                    if (isArray(dependencyAbstract)) {
                        if (dependencyAbstract.length) {
                            _dependencyAbstract = dependencyAbstract[0];

                            if (hasDependencyArgs) {
                                _dependencyArgs = this._getDependencyArgs(_dependencyAbstract, args);
                                _dependencyState = this._getDependencyState(_dependencyAbstract, args);
                            }

                            if (_dependencyState == null) {
                                _dependencyState = dependencyAbstract.length > 1 ? dependencyAbstract[1] : null;
                            }

                            _dependencyArgs = [...dependencyAbstract.slice(2), ..._dependencyArgs]
                        }

                        break;
                    }

                    if (isObject(dependencyAbstract)) {
                        _dependencyAbstract = dependencyAbstract.dependency;

                        if (hasDependencyArgs) {
                            _dependencyArgs = this._getDependencyArgs(_dependencyAbstract, args);
                            _dependencyState = this._getDependencyState(_dependencyAbstract, args);
                        }

                        if (_dependencyState == null) {
                            _dependencyState = dependencyAbstract.state
                        }

                        if (isArray(dependencyAbstract.args)) {
                            _dependencyArgs = [...dependencyAbstract.args, ..._dependencyArgs]
                        } else {
                            _dependencyArgs = [...[dependencyAbstract.args], ..._dependencyArgs]
                        }

                        break;
                    }

                    _dependencyAbstract = dependencyAbstract;

                    if (hasDependencyArgs) {
                        _dependencyArgs = this._getDependencyArgs(dependencyAbstract, args);
                        _dependencyState = this._getDependencyState(_dependencyAbstract, args);
                    }
                } while (false);

                if (isFunction(_dependencyAbstract)) {
                    _dependencyConcrete = this.resolveBy(_dependencyAbstract, _dependencyState, ..._dependencyArgs);

                    dependencies.push(_dependencyConcrete);
                }
            }

            let _args;

            if (hasDependencyArgs) {
                _args = [...dependencies, ...args[0].args];
            } else {
                _args = [...dependencies, ...args];
            }

            result = new entry.concretion(..._args);
        } else {
            result = new entry.concretion(...args);
        }

        return result;
    }
    _getInstance(entry, ...args) {
        let result;

        if (!isEmpty(entry.instance)) {
            result = entry.instance;
        } else if (isFunction(entry.factory)) {
            result = this._executeFactory(entry);
        } else {
            result = this._createInstance(entry, ...args);
        }

        return result;
    }
    register(abstraction, concretion, resolveType = Resolve.PerRequest, state = null) {
        abstraction = this._validateAbstraction(abstraction);
        concretion = this._validateConcretion(concretion, abstraction);
        resolveType = this._validateResolveType(resolveType);

        if (!this._registrationExistence(abstraction, concretion, null, null, resolveType, state)) {
            this.__entries.push({ abstraction, concretion, resolveType, state });

            return this.__entries.length - 1;
        }

        return -1;
    }
    registerFactory(abstraction, factory, resolveType = Resolve.PerRequest, state = null) {
        abstraction = this._validateAbstraction(abstraction);
        factory = this._validateFactory(factory);
        resolveType = this._validateResolveType(resolveType);

        if (!this._registrationExistence(abstraction, null, factory, null, resolveType, state)) {
            this.__entries.push({ abstraction, factory, resolveType, state });

            return this.__entries.length - 1;
        }

        return -1;
    }
    registerInstance(abstraction, instance, resolveType = Resolve.PerRequest, state = null) {
        abstraction = this._validateAbstraction(abstraction);
        instance = this._validateInstance(abstraction, instance);
        resolveType = this._validateResolveType(resolveType);

        if (!this._registrationExistence(abstraction, null, null, instance, resolveType, state)) {
            this.__entries.push({ abstraction, instance, resolveType, state });

            return this.__entries.length - 1;
        }

        return -1;
    }
    getConfig(abstraction, state = null) {
        const result = this.__entries.find(e => e.abstraction === abstraction && e.state == state);

        return { ...result };
    }
    resolveBy(abstraction, state, ...args) {
        let result, storage;

        if (arguments.length == 0 || isEmpty(abstraction)) {
            throw `Please specify abstraction`;
        } else {
            const entry = this.getConfig(abstraction, state);

            if (isEmpty(entry)) {
                throw `no registration found for ${abstraction.name || 'anonymous'}`;
            }

            switch (entry.resolveType) {
                case Resolve.PerRequest:
                    result = this._getInstance(entry, ...args);

                    break;
                case Resolve.PerPage:
                    result = this._getInstance(entry, ...args);

                    this.__entries[abstraction].instance = result;

                    break;
                case Resolve.PerSession:
                    storage = this.getSessionStorage();

                    result = this._getStoredInstance(entry, storage, ...args);

                    if (isEmpty(result)) {
                        result = this._getInstance(entry, ...args);

                        this._setStoredInstance(entry, storage, result);
                    }

                    break;
                case Resolve.PerApp:
                    storage = this.getLocalStorage();

                    result = this._getStoredInstance(entry, storage, ...args);

                    if (isEmpty(result)) {
                        result = this._getInstance(entry, ...args);

                        this._setStoredInstance(entry, storage, result);
                    }

                    break;
            }
        }

        return result;
    }
    resolve(abstraction, ...args) {
        return this.resolveBy(abstraction, null, ...args)
    }
    indexOf(abstraction, state = null) {
        const result = this.__entries.findIndex(e => e.abstraction === abstraction && e.state == state);

        return result;
    }
    remove(abstraction, state = null) {
        let result = false;

        if (isNumeric(abstraction)) {
            const index = parseInt(abstraction);

            if (index >= 0 && index < this.__entries.length) {
                this.__entries.splice(index, 1);

                result = true;
            }
        } else {
            const index = this.indexOf(abstraction, state);

            if (index >= 0) {
                this.__entries.splice(index, 1);

                result = true;
            }
        }

        return result;
    }
    exists(abstraction, state = null) {
        const index = this.indexOf(abstraction, state);

        return index >= 0;
    }
}

let __locator_instance = new DefaultLocator();

class Locator {
    static get instance() {
        return __locator_instance;
    }
    static set instance(value) {
        if (isEmpty(value)) {
            throw `no object given to be set as current locator.`
        } else if (!isFunction(value.constructor)) {
            throw `locator must have a constructor`
        } else if (!isSubClassOf(value.constructor, LocatorBase)) {
            throw `locator must be a subclass of LocatorBase`
        }

        __locator_instance = value;
    }
}

export default Locator;
export { LocatorBase, DefaultLocator, DefaultStorage, Resolve }