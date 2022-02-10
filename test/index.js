const {describe, addDescriptor, Describe} = require("../src/index");

let assertDescriptionTotalCount = 0;
let assertDescriptionErrorsCount = 0;

function assertDescription(expected, value, desc) {
    assertDescriptionTotalCount++;
    try {
        const actual = (desc || describe)(value);
        if(actual === expected) {
            console.log("OK:", actual);
            if(actual.length > 60) {
                console.log("ERROR: Description exceeds 60 characters.");
                assertDescriptionErrorsCount++;
            }
        }
        else {
            console.error("ERROR!");
            console.error("Expected:", expected);
            console.error("Actual:", actual);
            assertDescriptionErrorsCount++;
        }
    }
    catch(error) {
        console.error("ERROR!");
        console.error(error);
        assertDescriptionErrorsCount++;
    }
}

class TestClass {
    constructor(n) {
        this.n = n;
    }
}

class TestDescriptorClass {
    constructor(n) {
        this.n = n;
    }
}

class VeryLongClassNameToVerifyTruncationBehavior {
    constructor(n) {
        this.n = n;
    }
}

class BadArray extends Array {
    get length() {throw new Error("!");}
    get [Symbol.iterator]() {throw new Error("!");}
}

class BadSet extends Set {
    get size() {throw new Error("!");}
    get [Symbol.iterator]() {throw new Error("!");}
}

class BadMap extends Map {
    get size() {throw new Error("!");}
    get [Symbol.iterator]() {throw new Error("!");}
}

const badProperty = {get: () => {throw new Error("!");}};

const badArrayInstance = [0, 1, 2, 3];
try {Object.defineProperty(badArrayInstance, "length", badProperty);} catch {}
Object.defineProperty(badArrayInstance, "constructor", badProperty);
Object.defineProperty(badArrayInstance, Symbol.iterator, badProperty);

const badSetInstance = new Set();
Object.defineProperty(badSetInstance, "size", badProperty);
Object.defineProperty(badSetInstance, "constructor", badProperty);
Object.defineProperty(badSetInstance, Symbol.iterator, badProperty);

const badMapInstance = new Map();
Object.defineProperty(badMapInstance, "size", badProperty);
Object.defineProperty(badMapInstance, "constructor", badProperty);
Object.defineProperty(badMapInstance, Symbol.iterator, badProperty);

const badBufferInstance = Buffer.from([0, 1, 2, 3]);
Object.defineProperty(badBufferInstance, "length", badProperty);
Object.defineProperty(badBufferInstance, "constructor", badProperty);
Object.defineProperty(badBufferInstance, Symbol.iterator, badProperty);

const badObjectConstructor = {};
Object.defineProperty(badObjectConstructor, "constructor", badProperty);

const badObjectPrototype = {};
Object.defineProperty(badObjectConstructor, "prototype", badProperty);

const badObjectIterable = {x: 1};
Object.defineProperty(badObjectIterable, Symbol.iterator, badProperty);

addDescriptor((value) => {
    if(value instanceof TestDescriptorClass) {
        return "TestDescriptorClass #" + String(value.n);
    }
});

assertDescription("null", null);
assertDescription("undefined", undefined);
assertDescription("a false boolean value", false);
assertDescription("a true boolean value", true);
assertDescription("NaN", NaN);
assertDescription("positive infinity", Infinity);
assertDescription("negative infinity", -Infinity);
assertDescription("the number 0", 0);
assertDescription("the integer 1", 1);
assertDescription("the integer -1", -1);
assertDescription("the integer 54321", 54321);
assertDescription("the integer -60", -60);
assertDescription("the number 0.75", 0.75);
assertDescription("the number -25.125", -25.125);
assertDescription("the bigint number 0n", 0n);
assertDescription("the bigint number 500n", 500n);
assertDescription("the bigint number -9001n", -9001n);
assertDescription("a positive bigint number", 500000000000000000n);
assertDescription("a negative bigint number", -500000000000000000n);
assertDescription("an empty string", "");
assertDescription("the string \"x\"", "x");
assertDescription("the string \"hello, world!\"", "hello, world!");
assertDescription("the string \"\\\\\"", "\\");
assertDescription("the string \"\\r\\n\"", "\r\n");
assertDescription("the string \"\\u0000\\u0001\"", "\x00\x01");
assertDescription("a string", "\x01\x02\x01\x02\x01\x02\x01\x02\x01\x02\x01\x02");
assertDescription("a string", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
assertDescription("Symbol.iterator", Symbol.iterator);
assertDescription("Symbol.toPrimitive", Symbol.toPrimitive);
assertDescription("an empty array", []);
assertDescription("an array with 1 element", ["abc"]);
assertDescription("an array with 4 elements", [0, 1, 2, 3]);
assertDescription("an empty set", new Set());
assertDescription("a set with 1 element", new Set(["abc"]));
assertDescription("a set with 4 elements", new Set([0, 1, 2, 3]));
assertDescription("an empty map", new Map());
assertDescription("a map with 1 key", new Map([["x", 1]]));
assertDescription("a map with 3 keys", new Map([["x", 1], ["y", 2], ["z", 3]]));
assertDescription("an empty buffer", Buffer.from([]));
assertDescription("a buffer containing 1 byte", Buffer.from([0]));
assertDescription("a buffer containing 6 bytes", Buffer.from([5, 4, 3, 2, 1, 0]));
assertDescription("a promise", new Promise((resolve) => resolve(0)));
assertDescription("an anonymous function", function(n) {return n + n;});
assertDescription("an anonymous function", (n) => {return n * n;});
assertDescription("the function \"describe\"", describe);
assertDescription("the function \"myFunction\"", function myFunction(n) {return -n;});
assertDescription("the function \"VeryLongFunctionNameToVerifyTruncat...\"",
    function VeryLongFunctionNameToVerifyTruncationBehavior(n) {return;}
);
assertDescription("an empty object", {});
assertDescription("a plain object with 1 key", {a: 1});
assertDescription("a plain object with 4 keys", {a: 1, b: 2, c: 3, d: 4});
assertDescription("an object instance of \"TestClass\"", new TestClass(100));
assertDescription("an object instance of \"VeryLongClassNameToVerifyTrunca...\"",
    new VeryLongClassNameToVerifyTruncationBehavior(5)
);
assertDescription("an iterable object", new (function () {this[Symbol.iterator] = () => {};}));
assertDescription("an object", new (function () {this.n = 0}));
assertDescription("TestDescriptorClass #0", new TestDescriptorClass(0));
assertDescription("TestDescriptorClass #100", new TestDescriptorClass(100));
assertDescription("an object instance of \"TestDescriptorClass\"",
    new TestDescriptorClass(1),
    (v) => new Describe().describe(v)
);
assertDescription("an array", new BadArray());
assertDescription("an array with 4 elements", badArrayInstance);
assertDescription("a set", new BadSet());
assertDescription("a set", badSetInstance);
assertDescription("a map", new BadMap());
assertDescription("a map", badMapInstance);
assertDescription("a buffer", badBufferInstance);
assertDescription("an empty object", badObjectConstructor);
assertDescription("an empty object", badObjectPrototype);
assertDescription("a plain object with 1 key", badObjectIterable);

if(!assertDescriptionErrorsCount) {
    const total = assertDescriptionTotalCount;
    console.log("All ok! " + total + "/" + total + " passed.");
    process.exit(0);
}
else {
    const total = assertDescriptionTotalCount;
    const errors = assertDescriptionErrorsCount;
    const passed = total - errors;
    console.log("Errors encountered! " + passed + "/" + total + " passed.");
    process.exit(1);
}
