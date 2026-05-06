if (!Object.keys) { Object.keys = function (obj) { var keys = []; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) keys.push(key); } return keys; }; }
if (!Array.prototype.indexOf) { Array.prototype.indexOf = function (item) { for (var i = 0; i < this.length; i++) { if (this[i] === item) return i; } return -1; }; }
if (typeof JSON === "undefined") { JSON = {}; }
if (!JSON.parse) { JSON.parse = function (s) { return eval("(" + s + ")"); }; }
JSON.stringify = function (obj, replacer, space) {
    var indent = "";
    if (typeof space === "number") {
        for (var i = 0; i < space; i++) indent += " ";
    } else if (typeof space === "string") {
        indent = space;
    }

    function stringify(obj, currentIndent) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            if (t == "string") return '"' + obj.replace(/["\\]/g, '\\$&').replace(/\r/g, '\\r').replace(/\n/g, '\\n') + '"';
            return String(obj);
        } else {
            var n, v, json = [], arr = (obj && obj.constructor == Array);
            var nextIndent = currentIndent + indent;
            for (n in obj) {
                if (obj.hasOwnProperty(n)) {
                    v = obj[n];
                    if (typeof v === "function") continue;
                    var valStr = stringify(v, nextIndent);
                    json.push((arr ? "" : '"' + n + '":' + (indent ? " " : "")) + valStr);
                }
            }
            if (!indent) return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            var open = arr ? "[" : "{";
            var close = arr ? "]" : "}";
            if (json.length === 0) return open + close;
            return open + "\n" + nextIndent + json.join(",\n" + nextIndent) + "\n" + currentIndent + close;
        }
    }
    return stringify(obj, "");
};
