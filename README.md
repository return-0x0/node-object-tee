This package provides T-object functional.

### Usage Example

```javascript
function legacy(pair) {
    return [pair[0] + 4, pair[1] * 5];
}

const value = tee(13)
    .map(first => Math.floor(first / 10), second => second % 10)
    .do((first, second) => legacy(first, second))
    .swap()
    .reduce((first, second) => first / second);
console.log(value); // prints '3'
```

### Tee Injection

```javascript
let obj = {a: 13, tee: 34};
console.log(injectTee(obj)); // prints '{ a: 13 }' // `tee` property was re-defined

let injected = injectTee(obj, true);
injected.tee();
console.log(injected); // prints `{}` // `obj` is prototype of `injected`
console.log(Object.getPrototypeOf(injected)); // prints { a: 13, tee: 34 }
```