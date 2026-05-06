function applyPreset(cat, name) {


    
    var prefix = "M_";
    var prefixInput = document.getElementById('setting-prefix');
    if (prefixInput) prefix = prefixInput.value || "M_";

    
    var safeCat = cat.replace(/"/g, '\\"');
    var safeName = name.replace(/"/g, '\\"');
    var safePrefix = prefix.replace(/"/g, '\\"');

    
    csInterface.evalScript(`Utils.applyPreset("${safeCat}", "${safeName}", "${safePrefix}")`, function (result) {
        if (result === "Error") {
            console.error("AE Side Error: Preset application failed.");
        }
    });
}

function clearExpressions() {
    csInterface.evalScript('Utils.clearAllExpressions()');
}
