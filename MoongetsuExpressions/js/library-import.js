function exportLibrary() {
    
    csInterface.evalScript('File.saveDialog("Export Moongetsu Library", "JSON:*.json")', function (result) {
        if (result && result !== "null") {
            var safePath = result.replace(/\\/g, '/');
            
            csInterface.evalScript(`Utils.exportJSONToPath("${safePath}")`, function () {
                showModal("Export Success", "Library backed up to: " + result, "alert");
            });
        }
    });
}

function createNewFolderUI() {
    showModal("New Category", "Enter a name for the new expression folder:", "prompt", function (name) {
        
        csInterface.evalScript('Utils.getUserPresetData()', function (result) {
            var data = JSON.parse(result);
            if (data[name]) {
                showModal("Folder Exists", `A folder named '${name}' already exists. Overwrite/Merge with it?`, "confirm", function (confirm) {
                    if (confirm) {
                        csInterface.evalScript(`Utils.createCategory("${name}")`, function () {
                            refreshCustomUI();
                            showModal("Success", `Folder '${name}' is ready!`, "alert");
                        });
                    }
                });
            } else {
                csInterface.evalScript(`Utils.createCategory("${name}")`, function () {
                    refreshCustomUI();
                    showModal("Success", `Folder '${name}' created!`, "alert");
                });
            }
        });
    });
}

function importLibrary() {
    csInterface.evalScript('File.openDialog("Select Moongetsu Backup", "JSON:*.json")', function (filePath) {
        if (filePath && filePath !== "null") {
            csInterface.evalScript('Utils.getUserPresetData()', function (result) {
                try {
                    var data = JSON.parse(result);
                    var categories = ["General"];
                    for (var k in data) if (k !== "General") categories.push(k);
                    categories.push("+ New Category...");

                    showModal("Import Target", categories, "select", function (selectedCat) {
                        var safePath = filePath.replace(/\\/g, '/');
                        var processImport = function (target) {
                            
                            csInterface.evalScript(`Utils.getImportConflicts("${safePath}", "${target}")`, function (confRes) {
                                var conflicts = JSON.parse(confRes);
                                if (conflicts.length > 0) {
                                    showModal("Conflict Alert", `${conflicts.length} presets already exist in '${target}'. Review differences?`, "confirm", function (review) {
                                        if (review) {
                                            
                                            showModal("Compare Changes", conflicts[0], "diff", function () {
                                                csInterface.evalScript(`Utils.importJSONToCategory("${safePath}", "${target}")`, function () {
                                                    showModal("Import Success", "All presets merged into " + target, "alert");
                                                    refreshCustomUI();
                                                });
                                            });
                                        } else {
                                            
                                            showModal("Overwrite All", "Do you want to overwrite all existing presets without reviewing?", "confirm", function (ow) {
                                                if (ow) {
                                                    csInterface.evalScript(`Utils.importJSONToCategory("${safePath}", "${target}")`, function () {
                                                        refreshCustomUI();
                                                    });
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    csInterface.evalScript(`Utils.importJSONToCategory("${safePath}", "${target}")`, function () {
                                        showModal("Import Success", "Presets added to " + target, "alert");
                                        refreshCustomUI();
                                    });
                                }
                            });
                        };

                        if (selectedCat === "+ New Category...") {
                            showModal("New Category", "Enter name for the new folder:", "prompt", function (newName) {
                                processImport(newName);
                            });
                        } else {
                            processImport(selectedCat);
                        }
                    });
                } catch (e) { console.error(e); }
            });
        }
    });
}
