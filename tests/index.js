import { DefaultLocator, Resolve } from '../index.esm.js';
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
    BazServiceConcrete6
} from './SampleServices';

const locator = new DefaultLocator();

locator.register(FooServiceAbstract, FooServiceConcrete, Resolve.PerRequest, 2);
locator.register(BarServiceAbstract, BarServiceConcrete, Resolve.PerRequest);
locator.register(BazServiceAbstract5, BazServiceConcrete5);

const x = locator.resolve(BazServiceAbstract5, {
    args: ['baz-title'],
    [FooServiceAbstract]: [20, 30],
    [BarServiceAbstract]: ['bar-name']
});

console.log(x);