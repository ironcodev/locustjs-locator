import { DefaultLocator, DefaultStorage, Resolve } from '../index.esm.js';
import {
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
    BazServiceConcrete6,
    GrandParent,
    Parent,
    Child,
    Dep1,
    Dep2,
    Dep3,
    GrandChild
} from './SampleServices.esm.js';

// this IIF is able to test a locator thoroughly.
// if a new locator is developed, in order to test it
// we just need to add a factory config argument.

(function (...locatorFactoryConfigs) {
    for (let locatorFactoryConfig of locatorFactoryConfigs) {
        describe('Testing ' + locatorFactoryConfig.name, () => {
            // --------------------- register -------------------

            test('register(): register a base class by a non-child class', () => {
                expect(() => {
                    const locator = locatorFactoryConfig.factory();

                    locator.register(FooServiceAbstract, FooServiceConcreteIndependent);
                }).toThrow()
            });

            test('register(): register a base class by a child class', () => {
                const locator = locatorFactoryConfig.factory();

                locator.register(FooServiceAbstract, FooServiceConcrete);

                const exists = locator.exists(FooServiceAbstract);

                expect(exists).toBe(true);
            });

            test('remove(): removing a none-existing entry', () => {
                const locator = locatorFactoryConfig.factory();
                const result = locator.remove(FooServiceAbstract);

                expect(result).toBe(false);
            });

            // --------------------- remove -------------------

            test('remove(): removing an existing entry by its abstraction', () => {
                const locator = locatorFactoryConfig.factory();

                locator.register(FooServiceAbstract, FooServiceConcrete);

                const result = locator.remove(FooServiceAbstract);

                const exists = locator.exists(FooServiceAbstract);

                expect(result).toBe(true);
                expect(exists).toBe(false);
            });

            test('remove(): removing an existing entry by its index', () => {
                const locator = locatorFactoryConfig.factory();

                const index = locator.register(FooServiceAbstract, FooServiceConcrete);

                const result = locator.remove(index);

                const exists = locator.exists(FooServiceAbstract);

                expect(result).toBe(true);
                expect(exists).toBe(false);
            });

            // --------------------- indexOf -------------------

            test('indexOf(): returns index of a registration entry', () => {
                const locator = locatorFactoryConfig.factory();

                const r1 = locator.register(FooServiceAbstract, FooServiceConcrete);
                const r2 = locator.register(FooServiceAbstract, FooServiceConcrete, Resolve.PerRequest, 1);

                const index1 = locator.indexOf(FooServiceAbstract);
                const index2 = locator.indexOf(FooServiceAbstract, 1);

                expect(r1).toBe(0);
                expect(r2).toBe(1);
                expect(index1).toBe(0);
                expect(index2).toBe(1);
            });

            // --------------------- args for constructor -------------------

            test('resolve(A, ...args): args should be passed to dependency', () => {
                const locator = locatorFactoryConfig.factory();

                locator.register(FooServiceAbstract, FooServiceConcrete);

                const x = locator.resolve(FooServiceAbstract, 'F1', 10);

                expect(x).toBeDefined();
                expect(x.code).toBe('F1');
                expect(x.size).toBe(10);
            });

            // --------------------- state -------------------

            test('register(A, B, any, state): should resolve based on state', () => {
                const locator = locatorFactoryConfig.factory();

                locator.register(FooServiceAbstract, FooServiceConcrete, Resolve.PerRequest, 1);

                const x = locator.resolve(FooServiceAbstract);

                expect(x).toBeFalsy();
            });

            test('register(A, B, any, state): should resolve based on state', () => {
                const locator = locatorFactoryConfig.factory();

                locator.register(FooServiceAbstract, FooServiceConcrete, Resolve.PerRequest, 1);

                const x = locator.resolveBy(FooServiceAbstract, 1);

                expect(x).toBeTruthy();
            });

            test('register(A, B, any, state): should be able to register same abstraction with various states', () => {
                const locator = locatorFactoryConfig.factory();

                locator.register(FooServiceAbstract, FooServiceConcrete, Resolve.PerRequest, 1);
                locator.register(FooServiceAbstract, FooServiceConcrete, Resolve.PerRequest, 2);
                locator.register(FooServiceAbstract, FooServiceConcrete, Resolve.PerRequest, 3);

                const x1 = locator.resolveBy(FooServiceAbstract, 1);
                const x2 = locator.resolveBy(FooServiceAbstract, 2);
                const x3 = locator.resolveBy(FooServiceAbstract, 3);

                expect(locator.length).toBe(3);
                expect(x1).toBeTruthy();
                expect(x2).toBeTruthy();
                expect(x3).toBeTruthy();
            });

            // --------------------- state and args for constructor -------------------

            test('register(A, B, any, state, args): should resolve based on state and args should be passed to its constructor', () => {
                const locator = locatorFactoryConfig.factory();

                locator.register(FooServiceAbstract, FooServiceConcrete, Resolve.PerRequest, 1);

                const x = locator.resolveBy(FooServiceAbstract, 1, 'F1', 10);

                expect(x).toBeDefined();
                expect(x.code).toBe('F1');
                expect(x.size).toBe(10);
            });

            // --------------------- register/resolve -------------------

            test('register(A, B): resolve() should return different objects', () => {
                const locator = locatorFactoryConfig.factory();

                locator.register(FooServiceAbstract, FooServiceConcrete);

                const f1 = locator.resolve(FooServiceAbstract);
                const f2 = locator.resolve(FooServiceAbstract);

                expect(f1 == f2).toBe(false);
            });

            // --------------------- registerInstance -------------------

            test('registerInstance(A, B): resolve() should return same objects <INSTANCE>', () => {
                const locator = locatorFactoryConfig.factory();

                locator.registerInstance(FooServiceAbstract, new FooServiceConcrete());

                const f1 = locator.resolve(FooServiceAbstract);
                const f2 = locator.resolve(FooServiceAbstract);

                expect(f1 == f2).toBe(true);
            });

            test('registerInstance(A, B): resolve() should return same objects <FUNCTION>', () => {
                const locator = locatorFactoryConfig.factory();

                locator.registerInstance(FooServiceAbstract, () => new FooServiceConcrete());

                const f1 = locator.resolve(FooServiceAbstract);
                const f2 = locator.resolve(FooServiceAbstract);

                expect(f1 == f2).toBe(true);
            });

            // --------------------- registerFactory -------------------

            test('registerFactory(A, B)', () => {
                const locator = locatorFactoryConfig.factory();

                locator.registerFactory(FooServiceAbstract, () => new FooServiceConcrete());

                const f = locator.resolve(FooServiceAbstract);

                expect(f).toBeDefined();
            });

            test('registerFactory(A, B)', () => {
                const locator = locatorFactoryConfig.factory();

                locator.registerFactory(FooServiceAbstract, () => new FooServiceConcrete(), Resolve.PerRequest, 1);

                const f = locator.resolve(FooServiceAbstract);

                expect(f).toBeFalsy();
            });

            test('registerFactory(A, B)', () => {
                const locator = locatorFactoryConfig.factory();

                locator.registerFactory(FooServiceAbstract, () => new FooServiceConcrete(), Resolve.PerRequest, 1);

                const f = locator.resolveBy(FooServiceAbstract, 1);

                expect(f).toBeDefined();
            });

            // --------------------- register(A, B, Resolve.PerApp): singleton (localStorage) -------------------

            test('register(A, B, Resolve.PerApp): should store one object in storage', () => {
                const locator = locatorFactoryConfig.factory();

                locator.register(FooServiceAbstract, FooServiceConcrete, Resolve.PerApp);

                const f1 = locator.resolve(FooServiceAbstract, 10, 20);
                const f2 = locator.resolve(FooServiceAbstract);

                expect(locator.getLocalStorage().length == 1).toBe(true);
                expect(f1).toBeDefined();
                expect(f2).toBeDefined();
                expect(f1.code).toBe(f2.code);
                expect(f1.size).toBe(f2.size);
            });

            test('register(A, B, Resolve.PerApp): should store one object in storage', () => {
                const locator1 = locatorFactoryConfig.factory();

                locator1.register(FooServiceAbstract, FooServiceConcrete, Resolve.PerApp);

                const locator2 = locatorFactoryConfig.factory();

                locator2.setLocalStorage(locator1.getLocalStorage());

                locator2.register(FooServiceAbstract, FooServiceConcrete, Resolve.PerApp);

                const f1 = locator1.resolve(FooServiceAbstract, 10, 20);
                const f2 = locator2.resolve(FooServiceAbstract);

                expect(locator2.getLocalStorage().length == 1).toBe(true);
                expect(f1).toBeDefined();
                expect(f2).toBeDefined();
                expect(f1.code).toBe(f2.code);
                expect(f1.size).toBe(f2.size);
            });

            // --------------------- register(A, B, Resolve.PerSession): singleton (sessionStorage) -------------------

            test('register(A, B, Resolve.PerSession): should store one object in storage', () => {
                const locator = locatorFactoryConfig.factory();

                locator.register(FooServiceAbstract, FooServiceConcrete, Resolve.PerSession);

                const f1 = locator.resolve(FooServiceAbstract, 10, 20);
                const f2 = locator.resolve(FooServiceAbstract);

                expect(locator.getSessionStorage().length == 1).toBe(true);
                expect(f1).toBeDefined();
                expect(f2).toBeDefined();
                expect(f1.code).toBe(f2.code);
                expect(f1.size).toBe(f2.size);
            });

            test('register(A, B, Resolve.PerSession): should store one object in storage', () => {
                const locator1 = locatorFactoryConfig.factory();

                locator1.register(FooServiceAbstract, FooServiceConcrete, Resolve.PerSession);

                const locator2 = locatorFactoryConfig.factory();

                locator2.setSessionStorage(locator1.getSessionStorage());

                locator2.register(FooServiceAbstract, FooServiceConcrete, Resolve.PerSession);

                const f1 = locator1.resolve(FooServiceAbstract, 10, 20);
                const f2 = locator2.resolve(FooServiceAbstract);

                expect(locator2.getSessionStorage().length == 1).toBe(true);
                expect(f1).toBeDefined();
                expect(f2).toBeDefined();
                expect(f1.code).toBe(f2.code);
                expect(f1.size).toBe(f2.size);
            });

            // --------------------- register(A, B, Resolve.PerPage): singleton (per page) -------------------

            test('register(A, B, Resolve.PerApp): resolve() should store one object in storage', () => {
                const storage = new DefaultStorage();

                const f1 = (function () {
                    const locator = locatorFactoryConfig.factory();

                    locator.setLocalStorage(storage);
                    locator.register(FooServiceAbstract, FooServiceConcrete, Resolve.PerApp);

                    const f = locator.resolve(FooServiceAbstract, 10, 20);
                    return f;
                })();

                const f2 = (function () {
                    const locator = locatorFactoryConfig.factory();

                    locator.setLocalStorage(storage);
                    locator.register(FooServiceAbstract, FooServiceConcrete, Resolve.PerApp);

                    const f = locator.resolve(FooServiceAbstract);
                    return f;
                })();

                expect(f1).toBeDefined();
                expect(f2).toBeDefined();
                expect(f1.code).toBe(f2.code);
                expect(f1.size).toBe(f2.size);
            });

            // --------------------- resolve(A, B): dependencies should be resolved automatically -------------------

            test('register(A, B): dependencies should be resolved automatically <ex.1>', () => {
                const locator = locatorFactoryConfig.factory();

                locator.register(FooServiceAbstract, FooServiceConcrete);
                locator.register(BarServiceAbstract, BarServiceConcrete);
                locator.register(BazServiceAbstract1, BazServiceConcrete1);

                const x = locator.resolve(BazServiceAbstract1);

                expect(x).toBeDefined();
                expect(x.fooService).toBeDefined();
                expect(x.barService).toBeDefined();
            });

            test('register(A, B): dependencies should be resolved automatically <ex.2>', () => {
                const locator = locatorFactoryConfig.factory();

                locator.register(FooServiceAbstract, FooServiceConcrete);
                locator.register(BarServiceAbstract, BarServiceConcrete, Resolve.PerRequest, 1);
                locator.register(BazServiceAbstract2, BazServiceConcrete2);

                const x = locator.resolve(BazServiceAbstract2);

                expect(x).toBeDefined();
                expect(x.fooService).toBeDefined();
                expect(x.barService).toBeDefined();
            });

            test('register(A, B): dependencies should be resolved automatically <ex.3>', () => {
                const locator = locatorFactoryConfig.factory();

                locator.register(FooServiceAbstract, FooServiceConcrete);
                locator.register(BarServiceAbstract, BarServiceConcrete);
                locator.register(BazServiceAbstract3, BazServiceConcrete3);

                const x = locator.resolve(BazServiceAbstract3);

                expect(x).toBeDefined();
                expect(x.fooService).toBeDefined();
                expect(x.fooService.code).toBe(10);
                expect(x.fooService.size).toBe(20);
                expect(x.barService).toBeDefined();
                expect(x.barService.name).toBe('B1');
            });

            test('register(A, B): dependencies should be resolved automatically <ex.4>', () => {
                const locator = locatorFactoryConfig.factory();

                locator.register(FooServiceAbstract, FooServiceConcrete, Resolve.PerRequest, 1);
                locator.register(BarServiceAbstract, BarServiceConcrete, Resolve.PerRequest, 2);
                locator.register(BazServiceAbstract4, BazServiceConcrete4);

                const x = locator.resolve(BazServiceAbstract4);

                expect(x).toBeDefined();
                expect(x.fooService).toBeDefined();
                expect(x.fooService.code).toBe(10);
                expect(x.fooService.size).toBe(20);
                expect(x.barService).toBeDefined();
                expect(x.barService.name).toBe('B1');
            });

            test('register(A, B): dependencies should be resolved automatically <ex.5>', () => {
                const locator = locatorFactoryConfig.factory();

                locator.register(FooServiceAbstract, FooServiceConcrete, Resolve.PerRequest, 2);
                locator.register(BarServiceAbstract, BarServiceConcrete, Resolve.PerRequest);
                locator.register(BazServiceAbstract5, BazServiceConcrete5);

                const x = locator.resolve(BazServiceAbstract5, {
                    args: ['baz-title'],
                    [FooServiceAbstract]: [20, 30],
                    [BarServiceAbstract]: ['bar-name']
                });

                expect(x).toBeDefined();
                expect(x.title).toBe('baz-title');
                expect(x.fooService).toBeDefined();
                expect(x.fooService.code).toBe(10);
                expect(x.fooService.size).toBe(20);
                expect(x.fooService.num).toBe(30);
                expect(x.barService).toBeDefined();
                expect(x.barService.name).toBe('bar-name');
            });

            test('register(A, B): dependencies should be resolved automatically <ex.6>', () => {
                const locator = locatorFactoryConfig.factory();

                locator.register(FooServiceAbstract, FooServiceConcrete, Resolve.PerRequest, 2);
                locator.register(BarServiceAbstract, BarServiceConcrete, Resolve.PerRequest);
                locator.register(BazServiceAbstract6, BazServiceConcrete6);

                const x = locator.resolve(BazServiceAbstract6, {
                    args: ['baz-title'],
                    [FooServiceAbstract]: { state: 2, args: [10, 20, 30] },
                    [BarServiceAbstract]: ['bar-name']
                });

                expect(x).toBeDefined();
                expect(x.title).toBe('baz-title');
                expect(x.fooService).toBeDefined();
                expect(x.fooService.code).toBe(10);
                expect(x.fooService.size).toBe(20);
                expect(x.fooService.num).toBe(30);
                expect(x.barService).toBeDefined();
                expect(x.barService.name).toBe('bar-name');
            });

            test('register(A, B): dependencies should be detected through inheritance chain and should be resolved automatically <ex.7>', () => {
                const locator = locatorFactoryConfig.factory();

                locator.register(Child, GrandChild);
                locator.register(Dep1);
                locator.register(Dep2);
                locator.register(Dep3);
                
                const x = locator.resolve(Child);

                expect(x).toBeDefined();
                expect(x.dep1).toBeDefined();
                expect(x.dep1 instanceof Dep1).toBeTruthy();
                expect(x.dep2).toBeDefined();
                expect(x.dep2 instanceof Dep2).toBeTruthy();
                expect(x.dep3).toBeDefined();
                expect(x.dep3 instanceof Dep3).toBeTruthy();
            });
        });
    }
})({    // factory config item to test DefaultLocator class
    name: 'DefaultLocator',
    factory: function () {
        return new DefaultLocator();
    }
});

