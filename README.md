# @locustjs/locator
This library implements `Service Locator pattern` in javascript as a method of dependency injection. `Service Locator pattern` is one of the different ways of implementing IoC (inversion of control) and achieving loose coupling in software development.

# Installation
```
npm install @locustjs/locator
```
# Classes
| Class	| description |
|-------|-------------|
| `LocatorBase` | Base locator abstract class |
| `DefaultLocator`| Default service locator implementation |
| `Locator` | Static service locator class with a default singleton `instance` that is by default an instance of `DefaultLocator` |

## ResolveType enum
```javascript
{
  PerRequest: 0,  // instantiate new instance for each request
  PerApp: 1,      // return a single instance per application (uses localStroage to preserve the instance)
  PerPage: 2,     // return a single instance per page (insiance is created when page loads)
  PerSession: 3   // return single instance per browser session (uses sessionStorage to preserve the instance)
}
```

# LocatorBase API
| Method	| description |
|-------|-------------|
| `register(abstraction, concretion, resolveType = Resolve.PerRequest, state = null)` | Register `concretion` class for `abstraction` class based on `resolveType` and `state`. `concretion` should be a subclass of `abstraction`. |
| `registerFactory(abstraction, factory, resolveType = Resolve.PerRequest, state = null)` | Register an object that is instantiated by `factory` method for `abstraction` based on `resolveType` and `state`. The object returned by `factory` should be an instance of `abstraction` class. |
| `registerInstance(abstraction, instance, resolveType = Resolve.PerRequest, state = null)` | Register `instance` object for `abstraction` based on `resolveType` and `state`. `instance` should be an instance of `abstraction` class. |
| `resolveBy(abstraction, state, ...args)` | Resolve `abstraction` based on given `state`. Passes `args` when instantiating from the `concretion` that is already registered for `abstraction`. |
| `resolve(abstraction, ...args)` | Resolve `abstraction`. Passes `args` when instantiating from the `concretion` that is already registered for `abstraction`. |
| `remove(abstraction, state)` | Remove registration entry for `abstraction` based on the given `state`. |
| `exists(abstraction, state)` | Check whether a registration entry exists for `abstraction` based on then given `state`. |

## Simple example
./src/services/foo/index.js
```javascript
// Foo Service
class FooServiceBase {
  getById(id) {
    throw 'getById() is not implemented'
  }
}
class FooServiceRemote extends FooServiceBase {
  async getById(id) {
    const response = await fetch(`/api/foo/${id}`);
    const foo = await response.json();

    return foo;
  }
}
class FooServiceFake extends FooServiceBase {
  constructor() {
    super();

    this._data = [
      { id: 1, name: 'Foo1'},
      { id: 2, name: 'Foo2'},
      { id: 3, name: 'Foo3'}
    ]
  }
  getById(id) {
    return new Promise(res => setTimeout(() => res(this._data.find(x => x.id == id)), 1000))
  }
}

export { FooServiceBase, FooServiceRemote, FooServiceFake }
```
./src/locator.config.js
```javascript
import Locator from '@locustjs/locator';
import { FooServiceBase, FooServiceRemote, FooServiceFake } from './services/foo';

configureLocator(mode) {
  if (mode.toLowerCase() == 'production') {
    Locator.instance.register(FooServiceBase, FooServiceRemote);
  } else {
    Locator.instance.register(FooServiceBase, FooServiceFake);
  }
}

export default configureLocator;
```
./src/index.js
```javascript
// App startup
import configureLocator from './locator.config.js';

const exec_type = 'development';  // or 'production'

configureLocator(exec_type)
```
./src/app.js
```javascript
// FooService Usage
import Locator from '@locustjs/locator';
import { FooServiceBase } from './services/foo';

// Here, our code is independent of any foo service implementation.
// It relies on an abstract foo service. So, we can easily use a fake
// service to develop our app. Whenever our rest api is developed, we
// can switch to FooServiceRemote. No change is needed to be applied on app.js.

const service = Locator.instance.resolve(FooServiceBase);

const foo = await service.getById(1);

console.log(foo)
```

## React example

index.js
```javascript
import ReactDOM from 'react-dom';
import Locator, { Resolve } from '@locustjs/locator';
import { ColorServiceBase, ColorServiceDefault } from './services/color';
import App from './App';

Locator.instance.register(ColorServiceBase, ColorServiceDefault);

ReactDOM.render(<App />, document.getElementById('root'));
```

App.js
```javascript
import React, { useEffect, useState } from 'react'
import { ColorServiceBase } from './services/color';
import Locator from '@locustjs/locator';

const App = () => {
  const service = useMemo(() => Locator.instance.resolve(ColorServiceBase), []);
  const [colors, setColors] = useState([]);
  useEffect(() => this.service.getColors().then(colors => setColors(colors)), []);

    return (
		<>
			<h3>Colors</h3>
			<ul>
				{colors.map(x => <li>{x}</li>)}
			</ul>
		 </>
    );
}

export default App;
```

/services/color/ColorServiceBase.js
```javascript
class ColorServiceBase {
  constructor() {
    if (this.constructor === ColorServiceBase) {
        throw 'ColorServiceBase is an abstract class. You cannot instantiate from it.'
    }
  }
  getColors() {
    throw 'getColors() is not implemented'
  }
}

export default ColorServiceBase;
```

/services/color/ColorServiceDefault.js
```javascript
import ColorServiceBase from './ColorServiceBase.js';

class ColorServiceDefault extends ColorServiceBase {
  async getColors() {
	  const response = await fetch('/api/colors');
	  const data = await response.json();
	  
	  return data;
  }
}

export default ColorServiceDefault;
```

/services/color/ColorServiceFake.js
```javascript
import ColorServiceBase from './ColorServiceDefault';

class ColorServiceFake extends ColorServiceBase {
  getColors() {
    return new Promise((res, rej) => {
      res([ 'Red', 'Green', 'Blue', 'Yellow', 'White', 'Black', 'Purple' ]);
    });
  }
}

export default ColorServiceFake;
```

/services/color/index.js
```javascript
import ColorServiceBase from './ColorServiceBase.js';
import ColorServiceDefault from './ColorServiceDefault.js';
import ColorServiceFake from './ColorServiceFake.js';

export { ColorServiceBase, ColorServiceDefault, ColorServiceFake }
```

Here, the App component is completely decoupled from its ColorService dependency.
