const { throwIfInstantiateAbstract, throwNotImplementedException } = require('locustjs-exception');

class ColorServiceBase {
    constructor() {
        throwIfInstantiateAbstract(ColorServiceBase, this)
    }
    getById(id) {
        throwNotImplementedException('getById()')
    }
    getByName(name) {
        throwNotImplementedException('getByName()')
    }
    getAll() {
        throwNotImplementedException('getAll()')
    }
    save(color) {
        throwNotImplementedException('save()')
    }
    deleteById(id) {
        throwNotImplementedException('deleteById()')
    }
    deleteByName(name) {
        throwNotImplementedException('deleteByName()')
    }
}

module.exports = ColorServiceBase;