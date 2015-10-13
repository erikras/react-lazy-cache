export default function intersects(array1, array2) {
  return !!(array1 && array2 && array1.some(item => ~array2.indexOf(item)));
}
