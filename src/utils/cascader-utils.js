export function cascaderValue(arr) {
  if (arr === null || arr === undefined) {
    return null;
  }
  if (Object.prototype.toString.call(arr) === '[object Array]') {
    if (arr.length > 0) {
      return arr[arr.length - 1];
    }else{
      return null;
    }
  }else{
    return arr;
  }
}
