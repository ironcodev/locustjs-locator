# locustjs-locator
This library implements Service Locator pattern in javascript. Service Locator pattern is one of the ways of implementing IoC (inversion of control) and loose coupling.

# Installation
```
npm install locustjs-locator
```

## simple example in react

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
    return Promise((res, rej) => {
      res([ 'Red', 'Green', 'Blue', 'Yellow', 'White', 'Black', 'Purple' ]);
    });
  }
}

export default ColorServiceFake;
```

Here, the App component is completely decoupled from its ColorService dependency.
