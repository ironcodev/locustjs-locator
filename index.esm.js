import { Enum, isFunction, isEmpty, isSubClassOf, NotImplementedException } from 'locustjs-base'

const Resolve = Enum.define({
    PerRequest: 0,  // new instance for each request
    PerApp: 1,      // single instance per app (uses localStroage)
    PerPage: 2,     // single instance per page load
    PerSession: 3   // single instance per browser session (uses sessionStorage)
}, 'Resolve');

class LocatorBase {
    constructor() {
        if (this.constructor === LocatorBase) {
            throw 'LocatorBase is abstract. You cannot instantiate from it.'
        }
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
        NotImplementedException('register()')
    }
    registerFactory(abstraction, factory, resolveType = Resolve.PerRequest, state = null) {
        NotImplementedException('registerFactory()')
    }
    registerInstance(abstraction, instance, resolveType = Resolve.PerRequest, state = null) {
        NotImplementedException('registerInstance()')
    }
    resolveBy(abstraction, state, ...args) {
        NotImplementedException('resolveBy()')
    }
    resolve(abstraction, ...args) {
        NotImplementedException('resolve()')
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
    constructor() {
        super();

        this.__entries = [];
		this.__localStorage = (typeof window !== 'undefined' && window.localStorage) || new DefaultStorage();
		this.__sessionStorage = (typeof window !== 'undefined' && window.sessionStorage) || new DefaultStorage();
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
            console.error(e);

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

        const exists = this.__entries.find(e => e.abstraction == abstraction &&
                                                e.concretion == concretion &&
                                                e.resolveType == resolveType &&
                                                e.state == state);

        if (exists) {
            throw `registration entry already exists`
        }

        this.__entries.push({ abstraction, concretion, resolveType, state });
    }
    registerFactory(abstraction, factory, resolveType = Resolve.PerRequest, state = null) {
        abstraction = this._validateAbstraction(abstraction);
        factory = this._validateFactory(factory);
        resolveType = this._validateResolveType(resolveType);

        const exists = this.__entries.find(e => e.abstraction == abstraction &&
                                                e.factory == factory &&
                                                e.resolveType == resolveType &&
                                                e.state == state);

        if (exists) {
            throw `registration entry already exists`
        }

        this.__entries.push({ abstraction, factory, resolveType, state });
    }
    registerInstance(abstraction, instance, resolveType = Resolve.PerRequest, state = null) {
        abstraction = this._validateAbstraction(abstraction);
        resolveType = this._validateResolveType(resolveType);

        const exists = this.__entries.find(e => e.abstraction == abstraction &&
                                                e.instance == instance &&
                                                e.resolveType == resolveType &&
                                                e.state == state);

        if (exists) {
            throw `registration entry already exists`
        }

        this.__entries.push({ abstraction, instance, resolveType, state });
    }
	getConfig(abstraction, state = null) {
		const result = this.__entries.find(e => e.abstraction === abstraction && e.state === state);
		
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
}

let __locator_instance = new DefaultLocator();

class Locator {
    static get Instance() {
        return __locator_instance;
    }
    static set Instance(value) {
        if (isEmpty(value)) {
			throw `no object given to be set as current locator.`
		} else if (value.constructor) {
			throw `locator must have a constructor`
		} else if (!isSubClassOf(value.constructor, LocatorBase)) {
            throw `locator must be a subclass of LocatorBase`
        }

        __locator_instance = value;
    }
}

export default Locator;
export { LocatorBase, DefaultLocator, Resolve }