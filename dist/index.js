"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var format_1 = require("./format");
function fixStr(str) {
    if (str.length > 31)
        throw new Error("length must be lower than 32");
    var size = Buffer.alloc(1);
    size.writeUInt8(format_1.Format.FIX_STR + str.length);
    var value = Buffer.from(str);
    return Buffer.concat([size, value]);
}
function str8(str) {
    var buf = Buffer.alloc(2);
    buf.write(format_1.Format.STR_8, 'hex');
    buf.writeUInt8(str.length, 1);
    var value = Buffer.from(str);
    return Buffer.concat([buf, value]);
}
function str16(str) {
    var buf = Buffer.alloc(3);
    buf.write(format_1.Format.STR_16, 'hex');
    buf.writeUInt16BE(str.length, 1);
    var value = Buffer.from(str);
    return Buffer.concat([buf, value]);
}
function str32(str) {
    var buf = Buffer.alloc(5);
    buf.write(format_1.Format.STR_32, 'hex');
    buf.writeUInt32BE(str.length, 1);
    var value = Buffer.from(str);
    return Buffer.concat([buf, value]);
}
function int8(val) {
    var res = Buffer.alloc(2);
    res.write(format_1.Format.INT_8, 'hex');
    res.writeInt8(val, 1);
    return res;
}
function int16(val) {
    var res = Buffer.alloc(3);
    res.write(format_1.Format.INT_16, 'hex');
    res.writeInt16BE(val, 1);
    return res;
}
function int32(val) {
    var res = Buffer.alloc(5);
    res.write(format_1.Format.INT_32, 'hex');
    res.writeInt32BE(val, 1);
    return res;
}
function bin8(binStr) {
    var buf = Buffer.alloc(2);
    buf.write(format_1.Format.BIN_8, 'hex');
    buf.writeUInt8(binStr.length, 1);
    var valBuf = Buffer.from(binStr, 'binary');
    return Buffer.concat([buf, valBuf]);
}
function fixArray(arr) {
    if (arr.length > 15)
        throw new Error('number of elements must be lower than 16!');
    var res = Buffer.alloc(1);
    res.writeUInt8(format_1.Format.FIX_ARRAY + arr.length);
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var element = arr_1[_i];
        res = Buffer.concat([res, pack(element)]);
    }
    return res;
}
function array16(arr) {
    var res = Buffer.alloc(3);
    res.write(format_1.Format.ARRAY_16, 'hex');
    res.writeUInt16BE(arr.length, 1);
    for (var _i = 0, arr_2 = arr; _i < arr_2.length; _i++) {
        var element = arr_2[_i];
        res = Buffer.concat([res, pack(element)]);
    }
    return res;
}
function array32(arr) {
    var res = Buffer.alloc(5);
    res.write(format_1.Format.ARRAY_32, 'hex');
    res.writeUInt16BE(arr.length, 1);
    for (var _i = 0, arr_3 = arr; _i < arr_3.length; _i++) {
        var element = arr_3[_i];
        res = Buffer.concat([res, pack(element)]);
    }
    return res;
}
function float32(val) {
    var res = Buffer.alloc(5);
    res.write(format_1.Format.FLOAT_32, 'hex');
    res.writeFloatBE(val, 1);
    return res;
}
function fixMap(obj) {
    var propsCount = Object.keys(obj).length;
    if (propsCount > 15)
        throw new Error('number of elements must be lower than 16!');
    var res = Buffer.alloc(1);
    res.writeUInt8(format_1.Format.FIX_MAP + propsCount);
    for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        res = Buffer.concat([res, parseStr(key), pack(value)]);
    }
    return res;
}
function map16(obj) {
    var propsCount = Object.keys(obj).length;
    var res = Buffer.alloc(3);
    res.write(format_1.Format.MAP_16, 'hex');
    res.writeUInt16BE(propsCount, 1);
    for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        res = Buffer.concat([res, parseStr(key), pack(value)]);
    }
    return res;
}
function map32(obj) {
    var propsCount = Object.keys(obj).length;
    var res = Buffer.alloc(5);
    res.write(format_1.Format.MAP_32, 'hex');
    res.writeUInt32BE(propsCount, 1);
    for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        res = Buffer.concat([res, parseStr(key), pack(value)]);
    }
    return res;
}
function parseStr(str) {
    if (inRange(4))
        return fixStr(str);
    if (inRange(8))
        return str8(str);
    if (inRange(16))
        return str16(str);
    if (inRange(32))
        return str32(str);
    throw new Error('provided string is too long!');
    function inRange(exp) {
        return str.length < Math.pow(2, exp);
    }
}
function parseNum(num) {
    if (isFloat())
        return float32(num);
    if (inRange(8))
        return int8(num);
    if (inRange(16))
        return int16(num);
    if (inRange(32))
        return int32(num);
    throw new Error('provided integer is too long!');
    function inRange(exp) {
        return Math.pow(-2, exp - 1) <= num && num < Math.pow(2, exp - 1);
    }
    function isFloat() {
        return num % 1 !== 0;
    }
}
function parseMap(obj) {
    if (inRange(4))
        return fixMap(obj);
    if (inRange(16))
        return map16(obj);
    if (inRange(32))
        return map32(obj);
    throw new Error('provided object has too many properties!');
    function inRange(exp) {
        return Object.keys(obj).length < Math.pow(2, exp);
    }
}
function parseArray(arr) {
    if (inRange(4))
        return fixArray(arr);
    if (inRange(16))
        return array16(arr);
    if (inRange(32))
        return array32(arr);
    throw new Error('provided array has too many elements!');
    function inRange(exp) {
        return arr.length < Math.pow(2, exp);
    }
}
function parseBool(val) {
    return val ? Buffer.from(format_1.Format.BOOL_TRUE, 'hex') : Buffer.from(format_1.Format.BOOL_FALSE, 'hex');
}
function parseNil(val) {
    return Buffer.from(format_1.Format.NIL, 'hex');
}
function pack(value) {
    var valType = typeof value;
    if (!value && value !== 0)
        return parseNil(value);
    if (Array.isArray(value))
        return parseArray(value);
    if (valType === 'object')
        return parseMap(value);
    if (valType === 'string')
        return parseStr(value);
    if (valType === 'number')
        return parseNum(value);
    if (valType === 'boolean')
        return parseBool(value);
}
console.log(1, pack({ a: 12, b: true }));
console.log(2, pack({ a: 12, b: null }));
console.log(3, pack({ a: 12, b: { c: null } }));
console.log(4, pack({ a: [12, { c: [1, 2, 3] }], b: true }));
console.log(5, pack([12, { c: [1, 2, 3] }]));
console.log(5, pack(null));
console.log(5, pack({}));
console.log(5, pack([]));
console.log(5, pack(5));
//# sourceMappingURL=index.js.map