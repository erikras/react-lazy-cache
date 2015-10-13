import expect from 'expect';
import LazyCache from '../src/LazyCache';

describe('LazyCache', () => {
  it('should call on get', () => {
    let calls = 0;
    const instance = new LazyCache({
      props: {
        a: 4,
        b: 5
      }
    }, {
      calc: (a, b) => {
        calls++;
        return a + b;
      }
    });

    expect(calls).toBe(0);
    expect(instance.get('calc')).toBe(9);
    expect(calls).toBe(1);
    expect(instance.get('calc')).toBe(9);
    expect(calls).toBe(1);
  });

  it('should reset on prop change', () => {
    let calls = 0;
    const instance = new LazyCache({
      props: {
        a: 4,
        b: 5
      }
    }, {
      calc: (a, b) => {
        calls++;
        return a + b;
      }
    });

    expect(calls).toBe(0);
    expect(instance.get('calc')).toBe(9);
    expect(calls).toBe(1);
    expect(instance.get('calc')).toBe(9);
    expect(calls).toBe(1);
    instance.componentWillReceiveProps({a: 3, b: 5});
    expect(instance.get('calc')).toBe(9);
    expect(calls).toBe(2);
    expect(instance.get('calc')).toBe(9);
    expect(calls).toBe(2);
  });

  it('should not reset on prop not changed', () => {
    let calls = 0;
    const instance = new LazyCache({
      props: {
        a: 4,
        b: 5
      }
    }, {
      calc: (a, b) => {
        calls++;
        return a + b;
      }
    });

    expect(calls).toBe(0);
    expect(instance.get('calc')).toBe(9);
    expect(calls).toBe(1);
    expect(instance.get('calc')).toBe(9);
    expect(calls).toBe(1);
    instance.componentWillReceiveProps({a: 4, b: 5});
    expect(instance.get('calc')).toBe(9);
    expect(calls).toBe(1);
    expect(instance.get('calc')).toBe(9);
    expect(calls).toBe(1);
  });


  it('should not reset on unrelated prop change', () => {
    let calls = 0;
    const instance = new LazyCache({
      props: {
        a: 4,
        b: 5,
        c: 6
      }
    }, {
      calc: (a, b) => {
        calls++;
        return a + b;
      }
    });

    expect(calls).toBe(0);
    expect(instance.get('calc')).toBe(9);
    expect(calls).toBe(1);
    expect(instance.get('calc')).toBe(9);
    expect(calls).toBe(1);
    instance.componentWillReceiveProps({a: 4, b: 5, c: 7});
    expect(instance.get('calc')).toBe(9);
    expect(calls).toBe(1);
    expect(instance.get('calc')).toBe(9);
    expect(calls).toBe(1);
  });
});
