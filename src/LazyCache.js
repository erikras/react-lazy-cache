import getParamNames from './getParamNames';
import intersects from './intersects';
import deepEqual from 'deep-equal';

export default function lazyCache(component, calculators) {
  const allProps = [];
  const cache = {};
  const api = {};
  const uncache = changedProp => {
    Object.keys(cache).forEach(key => {
      if(~cache[key].props.indexOf(changedProp)) {
        delete cache[key].value;
        uncache(key);
      }
    });
  };

  Object.keys(calculators).forEach(key => {
    const calculate = calculators[key];
    const props = getParamNames(calculate);
    props.forEach(param => {
      if (!~allProps.indexOf(param)) {
        allProps.push(param);
      }
    });
    cache[key] = {props};
    Object.defineProperty(api, key, {
      get: () => {
        const cached = cache[key];
        if (cached && cached.value !== undefined) {
          return cached.value;
        }
        const params = props.map(prop => component.props[prop] || api[prop]);
        const value = calculate(...params);
        cache[key] = {props, value};
        return value;
      }
    });
  });
  api.componentWillReceiveProps = nextProps => {
    const diffProps = [];
    allProps.forEach(prop => {
      if (!deepEqual(component.props[prop], nextProps[prop])) {
        diffProps.push(prop);
      }
    });
    diffProps.forEach(uncache);
  };
  return api;
}
