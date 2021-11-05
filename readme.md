# @pineapplemachine/describe

This is a small, simple, zero-dependency library for getting a brief string description of an arbitrary JavaScript value.

The built-in description logic guarantees that strings will not be longer than about 60 characters and will not contain newlines or control characters. This makes the package particularly suitable for generating human-readble descriptions of untrusted data that is safe to output to a log.

## Installation

You can add `@pineapplemachine/describe` to your JavaScript project via NPM:

```
npm install --save @pineapplemachine/describe
```

## Usage

Basic usage:

``` js
const {describe} = require("@pineapplemachine/describe");

console.log(describe(null)); // Prints "null"
console.log(describe(1234.5)); // Prints "the number 1234.5"
console.log(describe({})); // Prints "an empty object"
console.log(describe([0, 1, 2, 3])); // Prints "an array with 4 elements"
```

Intermediate usage, featuring custom value descriptors:

``` js
const {describe, addDescriptor} = require("@pineapplemachine/describe");

// A custom class that we will want a custom description for
class MyClass {
    constructor(n) {
        this.n = n;
    }
}

// Prints "an object instance of \"MyClass\""
console.log(describe(new MyClass(50)));

// Add special logic for describing MyClass instances
addDescriptor((value) => {
    if(value instanceof MyClass) {
        return "MyClass #" + value.n;
    }
    else {
        return undefined;
    }
});

// Prints "MyClass #50"
console.log(describe(new MyClass(50)));
```

Advanced usage, featuring custom value descriptors and instanced Describe logic:

``` js
const {Describe, describe} = require("@pineapplemachine/describe");

// A custom class that we will want a custom description for
class MyClass {
    constructor(n) {
        this.n = n;
    }
}

// Create a new Describe instance instead of using the global default
const myDescriber = new Describe();

// Add special logic for describing MyClass instances
myDescriber.addDescriptor((value) => {
    if(value instanceof MyClass) {
        return "MyClass #" + value.n;
    }
    else {
        return undefined;
    }
});

// Prints "MyClass #50"
console.log(myDescriber.describe(new MyClass(50)));

// Still prints "an object instance of \"MyClass\""
console.log(describe(new MyClass(50)));
```
