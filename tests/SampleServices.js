class FooServiceAbstract {
    constructor(code, size, num) {
        this.code = code;
        this.size = size;
        this.num = num;
    }
}
class FooServiceConcreteIndependent { }
class FooServiceConcrete extends FooServiceAbstract {
    constructor(...args) {
        super(...args);
    }
}
// ---------------------------------------------------
class BarServiceAbstract {
    constructor(name) {
        this.name = name;
    }
}
class BarServiceConcrete extends BarServiceAbstract {
    constructor(name) {
        super(name);
    }
}
// ---------------------------------------------------
class BazServiceAbstract1 {
    constructor(fooService, barService) {
        this.fooService = fooService;
        this.barService = barService;
    }
}
BazServiceAbstract1.dependencies = [
    FooServiceAbstract,
    BarServiceAbstract
];
class BazServiceConcrete1 extends BazServiceAbstract1 { }
// ---------------------------------------------------
class BazServiceAbstract2 {
    constructor(fooService, barService) {
        this.fooService = fooService;
        this.barService = barService;
    }
}
BazServiceAbstract2.dependencies = [
    FooServiceAbstract,
    [BarServiceAbstract, 1]
];
class BazServiceConcrete2 extends BazServiceAbstract2 { }
// ---------------------------------------------------
class BazServiceAbstract3 {
    constructor(fooService, barService) {
        this.fooService = fooService;
        this.barService = barService;
    }
}
BazServiceAbstract3.dependencies = [
    [FooServiceAbstract, null, 10, 20],
    [BarServiceAbstract, null, 'B1']
];
class BazServiceConcrete3 extends BazServiceAbstract3 { }
// ---------------------------------------------------
class BazServiceAbstract4 {
    constructor(fooService, barService) {
        this.fooService = fooService;
        this.barService = barService;
    }
}
BazServiceAbstract4.dependencies = [
    [FooServiceAbstract, 1, 10, 20],
    {
        dependency: BarServiceAbstract,
        state: 2,
        args: ['B1']
    }
];
class BazServiceConcrete4 extends BazServiceAbstract4 { }
// ---------------------------------------------------
class BazServiceAbstract5 {
    constructor(fooService, barService, title, desc) {
        this.fooService = fooService;
        this.barService = barService;
        this.title = title;
        this.desc = desc;
    }
}
BazServiceAbstract5.dependencies = [
    {
        dependency: FooServiceAbstract,
        state: 2,
        args: [10]
    },
    BarServiceAbstract
];
class BazServiceConcrete5 extends BazServiceAbstract5 { }
// ---------------------------------------------------
class BazServiceAbstract6 {
    constructor(fooService, barService, title, desc) {
        this.fooService = fooService;
        this.barService = barService;
        this.title = title;
        this.desc = desc;
    }
}
BazServiceAbstract6.dependencies = [
    FooServiceAbstract,
    BarServiceAbstract
];
class BazServiceConcrete6 extends BazServiceAbstract6 { }

export {
    FooServiceAbstract,
    FooServiceConcreteIndependent,
    FooServiceConcrete,
    BarServiceAbstract,
    BarServiceConcrete,
    BazServiceAbstract1,
    BazServiceConcrete1,
    BazServiceAbstract2,
    BazServiceConcrete2,
    BazServiceAbstract3,
    BazServiceConcrete3,
    BazServiceAbstract4,
    BazServiceConcrete4,
    BazServiceAbstract5,
    BazServiceConcrete5,
    BazServiceAbstract6,
    BazServiceConcrete6
}