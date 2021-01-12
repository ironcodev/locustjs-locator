import { isFunction, isEmpty, isSubClassOf, isSomeObject } from 'locustjs-base'
import { throwIfInstantiateAbstract, throwNotImplementedException } from 'locustjs-exception';
import Enum from 'locustjs-enum';

const Resolve = Enum.define({
    PerRequest: 0,  // new instance for each request
    PerApp: 1,      // single instance per app (uses localStroage)
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
}

class DefaultStorage {
    constructor() {
        this._data = {};
    }
    getItem(key) {
        return this._data[key];
    }
    setItem(key, value) {
        this._data[key] = value;
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
    
            if (exists) {
                const errorMessage = `registration entry for abstraction '${abstraction.name}' based on specified instance and state '${state}' already exists.`;
    
                if (this.config.throwOnRegisterExistingAbstractions) {
                    throw errorMessage
                } else {
                    this._danger(errorMessage);
                }
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
        if (!isFunction(concretion)) {
            throw `Invalid concretion (class or constructor function expected).`
        }

        if (!isSubClassOf(concretion, abstraction)) {
            throw 'Concretion must be a subclass of abstraction.'
        }

        return concretion;
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
    _getStoredInstance(entry, storage) {
        try {
            const raw = storage.getItem(entry.abstraction.name);
            const instance = this.deserialize(raw);

            instance.__proto__ = new entry.abstraction().__proto__;

            return instance;
        } catch (e) {
            return undefined;
        }
    }
    _setStoredInstance(entry, storage, instance) {
        const raw = this.serialize(instance);

        storage.setItem(entry.abstraction.name, raw);
    }
    _createInstance(entry, args) {
        const result = new entry.concretion(...args);

        return result;
    }
    _getInstance(entry, args) {
        let result;

        if (!isEmpty(entry.instance)) {
            result = entry.instance;
        } else if (isFunction(entry.factory)) {
            result = this._executeFactory(entry);
        } else {
            result = this._createInstance(entry, args);
        }

        return result;
    }
    register(abstraction, concretion, resolveType = Resolve.PerRequest, state = null) {
        abstraction = this._validateAbstraction(abstraction);
        concretion = this._validateConcretion(concretion, abstraction);
        resolveType = this._validateResolveType(resolveType);

        if (!this._registrationExistence(abstraction, concretion, null, null, resolveType, state)) {
            this.__entries.push({ abstraction, concretion, resolveType, state });
        }
    }
    registerFactory(abstraction, factory, resolveType = Resolve.PerRequest, state = null) {
        abstraction = this._validateAbstraction(abstraction);
        factory = this._validateFactory(factory);
        resolveType = this._validateResolveType(resolveType);

        if (!this._registrationExistence(abstraction, null, factory, null, resolveType, state)) {
            this.__entries.push({ abstraction, factory, resolveType, state });
        }
    }
    registerInstance(abstraction, instance, resolveType = Resolve.PerRequest, state = null) {
        abstraction = this._validateAbstraction(abstraction);
        resolveType = this._validateResolveType(resolveType);

        if (!this._registrationExistence(abstraction, null, null, instance, resolveType, state)) {
            this.__entries.push({ abstraction, instance, resolveType, state });
        }
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
                    result = this._getInstance(entry, args);

                    break;
                case Resolve.PerPage:
                    result = this._getInstance(entry, args);

                    this.__entries[abstraction].instance = result;

                    break;
                case Resolve.PerSession:
                    storage = this.__sessionStorage;

                    result = this._getStoredInstance(entry, storage);

                    if (isEmpty(result)) {
                        result = this._getInstance(entry, args);

                        this._setStoredInstance(entry, storage, result);
                    }

                    break;
                case Resolve.PerApp:
                    storage = this.__localStorage;

                    result = this._getStoredInstance(entry, storage);

                    if (isEmpty(result)) {
                        result = this._getInstance(entry, args);

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
    remove(abstraction, state = null) {
        const index = this.__entries.findIndex(e => e.abstraction === abstraction && e.state == state);

        if (index >= 0) {
            this.__entries.splice(index, 1);
        }
    }
    exists(abstraction, state = null) {
        const index = this.__entries.findIndex(e => e.abstraction === abstraction && e.state == state);

        return index >= 0;
    }
}

let __locator_instance = new DefaultLocator();

class Locator {
    static get Instance() {
        return __locator_instance;
    }
    static set Instance(value) {
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
export { LocatorBase, DefaultLocator, Resolve }