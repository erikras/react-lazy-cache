#react-lazy-cache

[![NPM Version](https://img.shields.io/npm/v/react-lazy-cache.svg?style=flat-square)](https://www.npmjs
.com/package/react-lazy-cache) 
[![NPM Downloads](https://img.shields.io/npm/dm/react-lazy-cache.svg?style=flat-square)](https://www.npmjs.com/package/react-lazy-cache)
[![Build Status](https://img.shields.io/travis/erikras/react-lazy-cache/master.svg?style=flat-square)](https://travis-ci.org/erikras/react-lazy-cache)

`react-lazy-cache` is a utility to memoize values calculated from props to a React component.

## Installation

```
npm install --save react-lazy-cache
```

## Why?

Ideally, in a React component, you would calculate values that depend on your props inputs every time the component 
is rendered. However, in practice, sometimes these values, either for computational or memory reasons, are better off
cached. When you cache them, however, you need to be constantly watching your props to know if you need to 
invalidate your cache and recalculate those values. _That_ is what `react-lazy-cache` does for you.

## Usage

`react-lazy-cache` could not be simpler to use. You simply need to give it a map of calculations, and let it know 
when your component will receive new props.

```javascript
import React, {Component, PropTypes} from 'react';
import lazyCache from 'react-lazy-cache';

export default class Arithmetic extends Component {
  static propTypes = {
    a: PropTypes.number.isRequired,
    b: PropTypes.number.isRequired
  }
  
  componentWillMount() {
    // create cache
    this.cache = lazyCache(this, {
      sum: (a, b) => a + b,
      difference: (a, b) => a - b,
      product: (a, b) => a * b,
      quotient: (a, b) => a / b
    });
  }
  
  componentWillReceiveProps(nextProps) {
    this.cache.componentWillReceiveProps(nextProps);
  }
  
  render() {
    const {sum, difference, product, quotient} = this.cache;
    return (<div>
      <div>Sum: {sum}</div>
      <div>Difference: {difference}</div>
      <div>Product: {product}</div>
      <div>Quotient: {quotient}</div>
    </div>);
  }
}
```

Two things to notice about the above example:

### Lazy

The values do not get calculated until the properties on the `cache` object get referenced in render(). 
That's why it's "lazy". They will not be calculated again unless one of the props that the calculation depends on
changes.

### Parameter Injection
 
"_But how does it know which prop to use??_", you ask? `react-lazy-cache` detects the names of the props by the 
parameter names to the calculation functions.

## Conclusion

That's all you need to know! Go forth and intelligently cache your calculated values!
