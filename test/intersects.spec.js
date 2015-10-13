import expect from 'expect';
import intersects from '../src/intersects';

describe('intersects', () => {
  it('return false when one array is null', () => {
    expect(intersects(['a', 'b', 'c'], null)).toBe(false);
    expect(intersects(null, ['dog', 'baz', 'cat'])).toBe(false);
    expect(intersects(null, null)).toBe(false);
    expect(intersects()).toBe(false);
  });

  it('return true when intersects', () => {
    expect(intersects(['a', 'b', 'c'], ['d', 'e', 'c'])).toBe(true);
    expect(intersects(['foo', 'bar', 'baz'], ['dog', 'baz', 'cat'])).toBe(true);
    expect(intersects([1, 2, 3, 4], [7, 6, 5, 4])).toBe(true);
  });

  it('return false when not intersects', () => {
    expect(intersects(['a', 'b', 'c'], ['d', 'e', 'f'])).toBe(false);
    expect(intersects(['foo', 'bar', 'baz'], ['dog', 'pig', 'cat'])).toBe(false);
    expect(intersects([1, 2, 3, 4], [7, 6, 5])).toBe(false);
  });
});
