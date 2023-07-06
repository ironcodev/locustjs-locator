# locustjs-locator
This library implements Service Locator pattern in javascript. Service Locator pattern is one of the ways of implementing IoC (inversion of control) and loose coupling.

# Installation
```
npm install locustjs-locator
```
# Classes
| Class	| description |
|-------|-------------|
| `LocatorBase` | Base locator abstract class |
| `DefaultLocator`| Default service locator implementation |
| `Locator` | Static service locator class with a default singleton `Instance` that is by default an instance of `DefaultLocator` |

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
import Locator from 'locustjs-locator';
import { FooServiceBase, FooServiceRemote, FooServiceFake } from './services/foo';

configureLocator(mode) {
  if (mode.toLowerCase() == 'production') {
    Locator.Instance.register(FooServiceBase, FooServiceRemote);
  } else {
    Locator.Instance.register(FooServiceBase, FooServiceFake);
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
import Locator from 'locustjs-locator';
import { FooServiceBase } from './services/foo';

// Here, our code is independent of any foo service implementation.
// It relies on an abstract foo service. So, we can easily use a fake
// service to develop our app. Whenever our rest api is developed, we
// can switch to FooServiceRemote. No change is needed to be applied on app.js.

const service = Locator.Instance.resolve(FooServiceBase);

const foo = await service.getById(1);

console.log(foo)
```

## React example

index.js
```javascript
import ReactDOM from 'react-dom';
import Locator, { Resolve } from 'locustjs-locator';
import ColorServiceBase from './services/color/base.js';
import ColorServiceDefault from './services/color/default.js';
import App from './App';

Locator.Instance.register(ColorServiceBase, ColorServiceDefault);

ReactDOM.render(<App />, document.getElementById('root'));
```

App.js
```javascript
import React, { Component } from 'react'
import ColorServiceBase from './services/color/base.js';
import Locator from 'locustjs-locator';

class App extends Component {
  constructor() {
    super();
    
    this.service = Locator.Instance.resolve(ColorServiceBase);
    this.state = {
      colors: []
    }
  }
  async componentDidMount() {
    const colors = await this.service.getColors();
    
    this.setState({ colors });
  }
  render() {
    return (
		<React.Fragment>
			<h3>Colors</h3>
			<ul>
				{this.state.colors.map(x => <li>{x}</li>)}
			</ul>
		 </React.Fragment>
    );
  }
}

export default App;
```

/services/color/base.js
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

/services/color/default.js
```javascript
import ColorServiceBase from './base.js';

class ColorServiceDefault extends ColorServiceBase {
  async getColors() {
	  const response = await fetch('/api/colors');
	  const data = await response.json();
	  
	  return data;
  }
}

export default ColorServiceDefault;
```

/services/color/fake.js
```javascript
import ColorServiceBase from './base.js';

class ColorServiceFake extends ColorServiceBase {
  getColors() {
    return new Promise((res, rej) => {
      res([ 'Red', 'Green', 'Blue', 'Yellow', 'White', 'Black', 'Purple' ]);
    });
  }
}

export default ColorServiceFake;
```

Here, the App component is completely decoupled from its ColorService dependency.
