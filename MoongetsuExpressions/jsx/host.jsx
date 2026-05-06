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


var DefaultPresets = {
    "Dynamics": {
        "Bounce": {
            code: "amp = effect(\"M_Amp\")(\"Slider\") / 100;\r\nfreq = effect(\"M_Freq\")(\"Slider\");\r\ndecay = effect(\"M_Decay\")(\"Slider\");\r\nn = 0;\r\nif (numKeys > 0){\r\nn = nearestKey(time).index;\r\nif (key(n).time > time){ n--; }\r\n}\r\nif (n == 0){ t = 0; }\r\nelse{ t = time - key(n).time; }\r\nif (n > 0 && t < 1){\r\nv = velocityAtTime(key(n).time - .001);\r\nvalue + v * amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);\r\n}else{ value; }",
            sliders: [["M_Amp", 5], ["M_Freq", 3], ["M_Decay", 5]]
        },
        "Elastic": {
            code: "amp = effect(\"M_Amp\")(\"Slider\") / 100;\r\nfreq = effect(\"M_Freq\")(\"Slider\");\r\ndecay = effect(\"M_Decay\")(\"Slider\");\r\nn = 0;\r\nif (numKeys > 0){\r\nn = nearestKey(time).index;\r\nif (key(n).time > time){ n--; }\r\n}\r\nif (n == 0){ t = 0; }\r\nelse{ t = time - key(n).time; }\r\nif (n > 0 && t < 1){\r\nv = velocityAtTime(key(n).time - .001);\r\nvalue + v * amp * Math.cos(freq * t * 2 * Math.PI) / Math.exp(decay * t);\r\n}else{ value; }",
            sliders: [["M_Amp", 10], ["M_Freq", 5], ["M_Decay", 3]]
        },
        "Overshoot": {
            code: "freq = effect(\"M_Freq\")(\"Slider\");\r\namp = effect(\"M_Amp\")(\"Slider\");\r\ndecay = effect(\"M_Decay\")(\"Slider\");\r\nn = 0;\r\nif (numKeys > 0){\r\nn = nearestKey(time).index;\r\nif (key(n).time > time){ n--; }\r\n}\r\nif (n > 0){\r\nt = time - key(n).time;\r\ns = amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);\r\nif (value instanceof Array) {\r\n  mult = []; for(i=0; i<value.length; i++) mult.push(s);\r\n  value + mult;\r\n} else {\r\n  value + s;\r\n}\r\n}else{ value; }",
            sliders: [["M_Amp", 10], ["M_Freq", 2], ["M_Decay", 5]]
        }
    },
    "Random": {
        "Wiggle": {
            code: "f = effect(\"M_Freq\")(\"Slider\");\r\na = effect(\"M_Amp\")(\"Slider\");\r\nwiggle(f, a);",
            sliders: [["M_Freq", 2], ["M_Amp", 50]]
        },
        "Wig X": {
            code: "f = effect(\"M_Freq\")(\"Slider\");\r\na = effect(\"M_Amp\")(\"Slider\");\r\nw = wiggle(f, a);\r\n[w[0], value[1]]",
            sliders: [["M_Freq", 2], ["M_Amp", 50]]
        },
        "Wig Y": {
            code: "f = effect(\"M_Freq\")(\"Slider\");\r\na = effect(\"M_Amp\")(\"Slider\");\r\nw = wiggle(f, a);\r\n[value[0], w[1]]",
            sliders: [["M_Freq", 2], ["M_Amp", 50]]
        }
    },
    "Utility": {
        "Loop": {
            code: "loopOut(\"cycle\");",
            sliders: []
        },
        "Ping": {
            code: "loopOut(\"pingpong\");",
            sliders: []
        },
        "Poster": {
            code: "fps = effect(\"M_FPS\")(\"Slider\");\r\nposterizeTime(fps);\r\nvalue;",
            sliders: [["M_FPS", 12]]
        }
    },
    "Responsive": {
        "TL": {
            code: "offset = effect(\"M_Offset\")(\"Point\");\r\n[0, 0] + offset;",
            sliders: [["M_Offset", [50, 50], "point"]]
        },
        "TR": {
            code: "offset = effect(\"M_Offset\")(\"Point\");\r\n[thisComp.width, 0] + [-offset[0], offset[1]];",
            sliders: [["M_Offset", [50, 50], "point"]]
        },
        "BL": {
            code: "offset = effect(\"M_Offset\")(\"Point\");\r\n[0, thisComp.height] + [offset[0], -offset[1]];",
            sliders: [["M_Offset", [50, 50], "point"]]
        },
        "BR": {
            code: "offset = effect(\"M_Offset\")(\"Point\");\r\n[thisComp.width, thisComp.height] - offset;",
            sliders: [["M_Offset", [50, 50], "point"]]
        },
        "Center": {
            code: "[thisComp.width/2, thisComp.height/2];",
            sliders: []
        }
    }
};


var customStoragePath = null;

function getSettingsFile(filename) {
    var name = filename || "presets.json";
    var path;
    if (customStoragePath) {
        path = customStoragePath;
    } else {
        path = Folder.userData.fsName + "/Moongetsu";
    }

    var targetFolder = new Folder(path);
    if (!targetFolder.exists) targetFolder.create();

    return new File(targetFolder.fsName + "/" + name);
}

var Utils = {


    setStoragePath: function (path) {
        customStoragePath = path;
    },

    loadPrefs: function () {
        var file = getSettingsFile("settings.json");
        if (file.exists) {
            file.open("r");
            var content = file.read();
            file.close();
            return content;
        }
        return "null";
    },

    savePrefs: function (json) {
        var file = getSettingsFile("settings.json");
        file.encoding = "UTF-8";
        file.open("w");
        try {
            var obj = JSON.parse(json);
            file.write(JSON.stringify(obj, null, 4));
        } catch (e) {
            file.write(json);
        }
        file.close();
        return "true";
    },

    migrateStorage: function (newPath) {
        this.loadUserPresets();
        var currentPresets = this.UserPresets;

        customStoragePath = newPath;
        var targetFolder = new Folder(newPath);
        if (!targetFolder.exists) targetFolder.create();

        var newFile = getSettingsFile();
        if (newFile.exists) {
            newFile.open("r");
            var content = newFile.read();
            newFile.close();
            try {
                var existingInNew = JSON.parse(content);
                for (var key in existingInNew) {
                    if (!currentPresets.hasOwnProperty(key)) {
                        currentPresets[key] = existingInNew[key];
                    }
                }
            } catch (e) { }
        }

        this.UserPresets = currentPresets;
        this.saveUserPresets();
        return "true";
    },

    pickStorageFolder: function () {
        var folder = Folder.selectDialog("Select Folder for Moongetsu Presets");
        if (folder) return folder.fsName;
        return "null";
    },


    UserPresets: {},

    getPresetsRoot: function () {
        var base = customStoragePath || (Folder.userData.fsName + "/Moongetsu");
        var root = new Folder(base + "/Presets");
        if (!root.exists) root.create();
        return root;
    },

    loadUserPresets: function () {
        var root = this.getPresetsRoot();
        var allData = {};
        var folders = root.getFiles();

        for (var i = 0; i < folders.length; i++) {
            if (folders[i] instanceof Folder) {
                var pFile = new File(folders[i].fsName + "/presets.json");
                var catName = decodeURI(folders[i].name);

                if (pFile.exists) {
                    pFile.open("r");
                    pFile.encoding = "UTF-8";
                    try {
                        var catData = JSON.parse(pFile.read());
                        allData[catName] = catData;
                    } catch (e) { }
                    pFile.close();
                } else {
                    allData[catName] = {};
                }
            }
        }
        this.UserPresets = allData;
    },

    saveUserPreset: function (category, name, code) {
        var catName = category || "General";
        var root = this.getPresetsRoot();
        var catFolder = new Folder(root.fsName + "/" + catName);
        if (!catFolder.exists) catFolder.create();

        var pFile = new File(catFolder.fsName + "/presets.json");
        var data = {};

        if (pFile.exists) {
            pFile.open("r");
            try { data = JSON.parse(pFile.read()); } catch (e) { }
            pFile.close();
        }

        data[name] = { code: String(code), sliders: [] };

        pFile.open("w");
        pFile.encoding = "UTF-8";
        pFile.write(JSON.stringify(data, null, 4));
        pFile.close();
        return "true";
    },

    createCategory: function (name) {
        var root = this.getPresetsRoot();
        var catFolder = new Folder(root.fsName + "/" + name);
        if (!catFolder.exists) catFolder.create();
        return "true";
    },

    saveCategoryJSON: function (category) {
        var root = this.getPresetsRoot();
        var pFile = new File(root.fsName + "/" + category + "/presets.json");
        var data = this.UserPresets[category] || {};

        pFile.open("w");
        pFile.encoding = "UTF-8";
        pFile.write(JSON.stringify(data, null, 4));
        pFile.close();
    },

    renamePreset: function (category, oldName, newName) {
        this.ensureLibraryLoaded();
        if (this.UserPresets[category] && this.UserPresets[category][oldName]) {
            var presetData = this.UserPresets[category][oldName];
            delete this.UserPresets[category][oldName];
            this.UserPresets[category][newName] = presetData;
            this.saveCategoryJSON(category);
            return true;
        }
        return false;
    },

    deleteUserPreset: function (category, name) {
        var root = this.getPresetsRoot();
        var pFile = new File(root.fsName + "/" + category + "/presets.json");
        if (pFile.exists) {
            pFile.open("r");
            var data = {};
            try { data = JSON.parse(pFile.read()); } catch (e) { }
            pFile.close();

            if (data[name]) {
                delete data[name];
                pFile.open("w");
                pFile.encoding = "UTF-8";
                pFile.write(JSON.stringify(data, null, 4));
                pFile.close();
            }
        }
        return "true";
    },


    applyPreset: function (category, name, prefix) {
        var preset = null;

        if (DefaultPresets[category] && DefaultPresets[category][name]) {
            preset = DefaultPresets[category][name];
        } else {
            this.loadUserPresets();
            if (this.UserPresets[category] && this.UserPresets[category][name]) {
                preset = this.UserPresets[category][name];
            }
        }

        if (!preset) return "Error";
        var comp = this.getComp();
        if (!comp) return;
        var props = comp.selectedProperties;

        var code = preset.code;
        var sliders = preset.sliders;

        if (prefix && prefix !== "M_") {
            code = code.replace(/M_/g, prefix);
            if (sliders) {
                var newSliders = [];
                for (var s = 0; s < sliders.length; s++) {
                    newSliders.push([sliders[s][0].replace("M_", prefix), sliders[s][1], sliders[s][2]]);
                }
                sliders = newSliders;
            }
        }

        app.beginUndoGroup("Apply " + name);
        for (var i = 0; i < props.length; i++) {
            if (props[i].canSetExpression) {
                var layer = this.getLayer(props[i]);
                if (sliders) this.injectSliders(layer, sliders);
                props[i].expression = code;
            }
        }
        app.endUndoGroup();
    },

    getComp: function () { return app.project.activeItem instanceof CompItem ? app.project.activeItem : null; },
    getLayer: function (prop) { var p = prop; while (p.parentProperty != null) p = p.parentProperty; return p; },

    injectSliders: function (layer, sliders) {
        if (!layer.property("Effects") || !sliders) return;
        for (var i = 0; i < sliders.length; i++) {
            var sName = sliders[i][0], sVal = sliders[i][1], sType = sliders[i][2] || "slider";
            if (!layer.property("Effects").property(sName)) {
                var effect = layer.property("Effects").addProperty(sType === "point" ? "ADBE Point Control" : "ADBE Slider Control");
                effect.name = sName;
                effect.property(1).setValue(sVal);
            }
        }
    },

    clearAllExpressions: function () {
        var comp = this.getComp();
        if (!comp) return;
        var props = comp.selectedProperties;
        app.beginUndoGroup("Clear");
        for (var i = 0; i < props.length; i++) if (props[i].canSetExpression) props[i].expression = "";
        app.endUndoGroup();
    },

    revertLayer: function () {
        var comp = this.getComp();
        if (!comp || comp.selectedLayers.length === 0) return;
        app.beginUndoGroup("Deep Revert Layer");
        var layers = comp.selectedLayers;
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            this.recursiveProcess(layer, function (p) { if (p.canSetExpression) p.expression = ""; });
            var fx = layer.property("Effects");
            if (fx) {
                for (var j = fx.numProperties; j >= 1; j--) {
                    if (fx.property(j).matchName.indexOf("Control") !== -1) fx.property(j).remove();
                }
            }
        }
        app.endUndoGroup();
    },

    getLayerExpressions: function () {
        var comp = this.getComp();
        if (!comp || comp.selectedLayers.length === 0) return "[]";
        var layer = comp.selectedLayers[0];
        var found = [];
        this.recursiveProcess(layer, function (p) {
            if (p.canSetExpression && p.expression !== "" && p.expression !== null) {
                found.push({ name: String(p.name), code: String(p.expression) });
            }
        });
        return JSON.stringify(found);
    },

    resetPropertyExpression: function (index) {
        var comp = this.getComp();
        if (!comp || comp.selectedLayers.length === 0) return;
        var layer = comp.selectedLayers[0];
        this.recursiveProcess(layer, function (p) {
            if (p.canSetExpression && p.name === index) {
                app.beginUndoGroup("Reset " + p.name);
                p.expression = "";
                app.endUndoGroup();
            }
        });
    },

    globalSearchReplace: function (find, replace) {
        var comp = this.getComp();
        if (!comp) return;
        app.beginUndoGroup("Replace");
        for (var i = 1; i <= comp.numLayers; i++) {
            this.recursiveProcess(comp.layer(i), function (p) {
                p.expression = p.expression.split(find).join(replace);
            });
        }
        app.endUndoGroup();
    },

    cleanScene: function () {
        var comp = this.getComp();
        if (!comp || comp.selectedLayers.length === 0) return;
        app.beginUndoGroup("Clean");
        var layers = comp.selectedLayers;
        for (var i = 0; i < layers.length; i++) {
            var expressions = [];
            this.recursiveProcess(layers[i], function (p) { expressions.push(p.expression); });
            var fx = layers[i].property("Effects");
            if (fx) {
                for (var j = fx.numProperties; j >= 1; j--) {
                    var name = fx.property(j).name;
                    var used = false;
                    for (var k = 0; k < expressions.length; k++) if (expressions[k].indexOf('effect("' + name + '")') !== -1) { used = true; break; }
                    if (!used && (fx.property(j).matchName.indexOf("Control") !== -1)) fx.property(j).remove();
                }
            }
        }
        app.endUndoGroup();
    },

    recursiveProcess: function (parent, callback) {
        for (var i = 1; i <= parent.numProperties; i++) {
            var prop = parent.property(i);
            if (prop.propertyType === PropertyType.PROPERTY && prop.canSetExpression && prop.expression !== "") callback(prop);
            else if (prop.propertyType !== PropertyType.PROPERTY) this.recursiveProcess(prop, callback);
        }
    },

    grabExpression: function () {
        var comp = this.getComp();
        if (comp && comp.selectedProperties.length > 0 && comp.selectedProperties[0].canSetExpression) return comp.selectedProperties[0].expression;
        return "";
    },


    exportLibraryToFolder: function (destPath) {
        var root = this.getPresetsRoot();
        var dest = new Folder(destPath);
        if (!dest.exists) dest.create();

        var files = root.getFiles();
        for (var i = 0; i < files.length; i++) {
            if (files[i] instanceof Folder) {
                var targetSub = new Folder(dest.fsName + "/" + files[i].name);
                if (!targetSub.exists) targetSub.create();

                var pFile = new File(files[i].fsName + "/presets.json");
                if (pFile.exists) {
                    pFile.copy(targetSub.fsName + "/presets.json");
                }
            }
        }
        return "true";
    },

    importFromFolder: function (srcPath) {
        var src = new Folder(srcPath);
        if (!src.exists) return "false";

        var root = this.getPresetsRoot();
        var files = src.getFiles();
        for (var i = 0; i < files.length; i++) {
            if (files[i] instanceof Folder) {
                var pFile = new File(files[i].fsName + "/presets.json");
                if (pFile.exists) {
                    pFile.open("r");
                    var data = JSON.parse(pFile.read());
                    pFile.close();
                    for (var name in data) {
                        this.saveUserPreset(files[i].name, name, data[name].code);
                    }
                }
            }
        }
        return "true";
    },

    importJSONToCategory: function (jsonPath, category) {
        var file = new File(jsonPath);
        if (!file.exists) return "false";
        file.open("r");
        var content = file.read();
        file.close();

        try {
            var data = JSON.parse(content);
            for (var key in data) {
                if (data[key].code) {
                    this.saveUserPreset(category, key, data[key].code);
                } else {
                    for (var pre in data[key]) {
                        this.saveUserPreset(category, pre, data[key][pre].code);
                    }
                }
            }
            return "true";
        } catch (e) { return "Error"; }
    },

    exportJSONToPath: function (path) {
        this.loadUserPresets();
        var file = new File(path);
        file.open("w");
        file.encoding = "UTF-8";
        file.write(JSON.stringify(this.UserPresets, null, 4));
        file.close();
        return "true";
    },

    importPresetsFromPath: function (path) {
        var file = new File(path);
        if (!file.exists) return "false";
        file.open("r");
        file.encoding = "UTF-8";
        var content = file.read();
        file.close();

        try {
            var data = JSON.parse(content);
            for (var cat in data) {
                var items = data[cat];
                if (items.hasOwnProperty('code')) {
                    this.saveUserPreset("General", cat, items.code);
                } else {
                    for (var preName in items) {
                        this.saveUserPreset(cat, preName, items[preName].code);
                    }
                }
            }
            return "true";
        } catch (e) { return "Error"; }
    },

    getImportConflicts: function (jsonPath, category) {
        var file = new File(jsonPath);
        if (!file.exists) return "[]";
        file.open("r");
        var content = file.read();
        file.close();

        try {
            var data = JSON.parse(content);
            this.loadUserPresets();
            var conflicts = [];

            var presetsToImport = {};
            for (var k in data) {
                if (data[k].code) presetsToImport[k] = data[k];
                else {
                    for (var sub in data[k]) presetsToImport[sub] = data[k][sub];
                }
            }

            if (this.UserPresets[category]) {
                for (var name in presetsToImport) {
                    if (this.UserPresets[category][name]) {
                        conflicts.push({
                            name: name,
                            oldCode: this.UserPresets[category][name].code,
                            newCode: presetsToImport[name].code
                        });
                    }
                }
            }
            return JSON.stringify(conflicts);
        } catch (e) { return "[]"; }
    },

    getPresetCode: function (category, name) {
        this.loadUserPresets();
        if (this.UserPresets[category] && this.UserPresets[category][name]) {
            return this.UserPresets[category][name].code;
        }
        return "";
    },

    getUserPresetData: function () {
        var oldFile = getSettingsFile("presets.json");
        if (oldFile.exists) {
            oldFile.open("r");
            try {
                var oldData = JSON.parse(oldFile.read());
                for (var cat in oldData) {
                    if (typeof oldData[cat] === "object" && !oldData[cat].code) {
                        for (var pre in oldData[cat]) {
                            this.saveUserPreset(cat, pre, oldData[cat][pre].code);
                        }
                    }
                }
                oldFile.remove();
            } catch (e) { }
            oldFile.close();
        }

        this.loadUserPresets();
        return JSON.stringify(this.UserPresets);
    }


};