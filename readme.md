# @pineapplemachine/describe

This is a small, simple, permissively-licensed and zero-dependency library for getting a brief string description of an arbitrary JavaScript value.

The default built-in description logic guarantees that strings will not be longer than 60 characters and will not contain newlines or control characters. This makes the package particularly suitable for generating human-readable descriptions of untrusted data that is safe to output to a log.

## Installation

You can add `@pineapplemachine/describe` to your JavaScript project via NPM:

```
npm install --save @pineapplemachine/describe
```

## Usage

The simplest usage of this package is to import the default `describe` function and invoke it with the value that should be described.

**Basic usage:**

``` js
const {describe} = require("@pineapplemachine/describe");

console.log(describe(null)); // Prints "null"
console.log(describe(1234.5)); // Prints "the number 1234.5"
console.log(describe({})); // Prints "an empty object"
console.log(describe([0, 1, 2, 3])); // Prints "an array with 4 elements"
```

The package also supports overriding description behavior via the `addDescriptor` function. Descriptor functions take precedence over default built-in logic, and descriptors added first take precedence over descriptors added last. When a descriptor function returns a non-empty string for an input value, that string will be produced by the `describe` function instead of its default output. When a descriptor function returns any falsey value, evaluation continues to remaining descriptor functions and then to the default description logic.

**Intermediate usage, featuring custom value descriptors:**

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

The package also provides a `Describe` class for instanced behavior. This means that custom descriptor functions may be added to a specific instance and applied only to uses of that instance's `describe` method, without changing the behavior of the global default `describe` function or any other `Describe` instances.

**Advanced usage, featuring custom value descriptors and instanced Describe logic:**

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
