const ColorServiceBase = require('./ColorServiceBase');

class ColorServiceDefault extends ColorServiceBase {
    constructor(colors) {
        super();

        this.data = colors || [];
    }
    getById(id) {
        return this.data.find(x => x.id == id)
    }
    getByName(name) {
        return this.data.find(x => x.name == name)
    }
    getAll() {
        return this.data;
    }
    save(color) {
        if (color.id) {
            const c = this.getById(color.id);

            if (c) {
                c.name = color.name;
            } else {
                this.data.push(color);
            }
        } else {
            const max = Math.max(this.data.map(x => x.id));

            color.id = max + 1;

            this.data.push(color);
        }
    }
    deleteById(id) {
        let result = false;
        const index = this.data.findIndex(x => x.id == id);

        if (index >= 0) {
            this.data = this.data.filter((x, i) => i != index);

            result = true;
        }

        return result;
    }
    deleteByName(name) {
        let result = false;
        const index = this.data.findIndex(x => x.name == name);

        if (index >= 0) {
            this.data = this.data.filter((x, i) => i != index);

            result = true;
        }

        return result;
    }
}

module.exports = ColorServiceDefault;
