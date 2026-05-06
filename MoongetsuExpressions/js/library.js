function grabFromSelected() {
    csInterface.evalScript('Utils.grabExpression()', function (result) {
        if (result) document.getElementById('new-preset-code').value = result;
    });
}

var currentLibraryFolder = null;

function createNewFolderUI() {
    showModal("New Category", "Enter a name for the new expression folder:", "prompt", function (name) {
        csInterface.evalScript(`Utils.createCategory("${name}")`, function () {
            refreshCustomUI();
            
            showModal("Success", `Folder '${name}' created!`, "alert");
        });
    });
}

function enterFolder(folderName) {
    currentLibraryFolder = folderName;
    refreshCustomUI();
}

function exitFolder() {
    currentLibraryFolder = null;
    refreshCustomUI();
}

function updateRegisterDropdown() {
    csInterface.evalScript('Utils.getUserPresetData()', function (result) {
        try {
            var data = JSON.parse(result);
            var optionsContainer = document.getElementById('folder-select-options');
            if (!optionsContainer) return;

            optionsContainer.innerHTML = '';

            var cats = ["General"];
            for (var k in data) {
                if (k !== "General") cats.push(k);
            }

            cats.forEach(c => {
                var opt = document.createElement('div');
                opt.className = 'custom-select-option';
                opt.innerText = c;
                opt.onclick = () => selectCustomOption('folder-select', c);
                optionsContainer.appendChild(opt);
            });

        } catch (e) { console.error(e); }
    });
}

function toggleCustomSelect(id) {
    const container = document.getElementById(`${id}-container`);
    if (container) container.classList.toggle('open');
}

function selectCustomOption(id, value, inputId) {
    const text = document.getElementById(`${id}-text`);
    const input = document.getElementById(inputId || 'new-preset-cat');
    if (text) text.innerText = value;
    if (input) input.value = value;

    const container = document.getElementById(`${id}-container`);
    if (container) container.classList.remove('open');

    
    if (id === 'folder-select') {
        validatePresetName();
    }
}

function validatePresetName() {
    var cat = document.getElementById('new-preset-cat').value || "General";
    var nameEl = document.getElementById('new-preset-name');
    var name = nameEl ? nameEl.value.trim() : "";
    var warning = document.getElementById('preset-name-warning');
    var btn = document.getElementById('save-preset-btn');
    
    if (!name || !warning || !btn) return;

    csInterface.evalScript('Utils.getUserPresetData()', function (result) {
        try {
            var data = JSON.parse(result);
            if (data[cat] && data[cat][name]) {
                warning.style.display = "block";
                btn.disabled = true;
                btn.style.opacity = "0.5";
                btn.style.cursor = "not-allowed";
                nameEl.style.borderColor = "var(--accent)";
            } else {
                warning.style.display = "none";
                btn.disabled = false;
                btn.style.opacity = "1";
                btn.style.cursor = "pointer";
                nameEl.style.borderColor = "var(--border)";
            }
        } catch (e) { console.error(e); }
    });
}


document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select-container')) {
        document.querySelectorAll('.custom-select-container').forEach(c => c.classList.remove('open'));
    }
});

function savePreset() {
    var cat = document.getElementById('new-preset-cat').value || "General";
    var name = document.getElementById('new-preset-name').value;
    var code = document.getElementById('new-preset-code').value;
    if (!name || !code) return;

    var safeCat = encodeURIComponent(cat);
    var safeName = encodeURIComponent(name);
    var safeCode = encodeURIComponent(code);

    csInterface.evalScript(`Utils.saveUserPreset(decodeURIComponent("${safeCat}"), decodeURIComponent("${safeName}"), decodeURIComponent("${safeCode}"))`, function () {
        document.getElementById('new-preset-name').value = '';
        document.getElementById('new-preset-code').value = '';
        showModal("Success", "Preset saved to folder: " + cat, "alert");
        refreshCustomUI();
    });
}

function deletePreset(cat, name) {
    showModal("Delete Preset", `Are you sure you want to delete "${name}" from "${cat}"?`, "confirm", function () {
        var safeCat = encodeURIComponent(cat);
        var safeName = encodeURIComponent(name);
        csInterface.evalScript(`Utils.deleteUserPreset(decodeURIComponent("${safeCat}"), decodeURIComponent("${safeName}"))`, function () {
            refreshCustomUI();
        });
    });
}

function renamePreset(cat, oldName) {
    showModal("Rename Preset", `Enter new name for "${oldName}":`, "prompt", function (newName) {
        if (!newName || newName === oldName) return;

        csInterface.evalScript('Utils.getUserPresetData()', function (result) {
            try {
                var data = JSON.parse(result);
                if (data[cat] && data[cat][newName]) {
                    showModal("Name Clash", "A preset with that name already exists in this folder.", "alert");
                } else {
                    csInterface.evalScript(`Utils.renamePreset("${cat}", "${oldName}", "${newName}")`, function () {
                        refreshCustomUI();
                    });
                }
            } catch (e) { console.error(e); }
        });
    });
}

function editPresetExpression(cat, name) {
    csInterface.evalScript('Utils.getUserPresetData()', function (result) {
        try {
            var data = JSON.parse(result);
            var code = data[cat][name].code;
            showModal(`Edit: ${name}`, code, "edit", function (newCode) {
                var safeCat = encodeURIComponent(cat);
                var safeName = encodeURIComponent(name);
                var safeCode = encodeURIComponent(newCode);
                csInterface.evalScript(`Utils.saveUserPreset(decodeURIComponent("${safeCat}"), decodeURIComponent("${safeName}"), decodeURIComponent("${safeCode}"))`, function () {
                    refreshCustomUI();
                });
            });
        } catch (e) { console.error(e); }
    });
}

function refreshCustomUI() {
    csInterface.evalScript('Utils.getUserPresetData()', function (result) {
        try {
            var data = JSON.parse(result);
            var container = document.getElementById('custom-list');
            var breadcrumb = document.getElementById('library-breadcrumb');
            var backBtn = document.getElementById('library-back-btn');
            var registerSelect = document.getElementById('new-preset-cat');

            if (!container) return;
            container.innerHTML = '';

            
            if (registerSelect) {
                var currentVal = registerSelect.value;
                registerSelect.innerHTML = '';
                for (var cat in data) {
                    var opt = document.createElement('option');
                    opt.value = cat;
                    opt.innerText = cat;
                    registerSelect.appendChild(opt);
                }
                if (currentVal) registerSelect.value = currentVal;
            }

            
            if (currentLibraryFolder) {
                breadcrumb.innerHTML = `<span onclick="exitFolder()" class="root-label" style="opacity:0.6;">Root</span> <i class="fas fa-chevron-right" style="font-size:9px; opacity:0.4;"></i> <span style="color:var(--accent); font-weight:700;">${currentLibraryFolder}</span>`;
                backBtn.style.display = "flex";
            } else {
                breadcrumb.innerHTML = `<span class="root-label">Root</span>`;
                backBtn.style.display = "none";
            }

            var hasAny = false;
            for (var c in data) { hasAny = true; break; }

            if (!hasAny) {
                container.style.justifyContent = "center";
                container.style.alignItems = "center";
                container.innerHTML = `
                    <div style="text-align: center; opacity: 0; animation: fadeIn 0.5s forwards; padding-bottom: 40px;">
                        <i class="fas fa-folder-open" style="font-size: 32px; color: var(--border); margin-bottom: 15px; display: block;"></i>
                        <p style="color: var(--text-muted); font-size: 13px; font-style: italic; letter-spacing: 0.5px;">No folders in library.</p>
                    </div>
                `;
                return;
            }

            container.style.justifyContent = "flex-start";
            container.style.alignItems = "stretch";

            if (!currentLibraryFolder) {
                
                for (var category in data) {
                    var fld = document.createElement('div');
                    fld.className = "preset-card folder";
                    (function (cat) {
                        var count = Object.keys(data[cat]).length;
                        fld.innerHTML = `
                            <div class="preset-icon">
                                <i class="fas fa-folder"></i>
                            </div>
                            <div class="preset-info" onclick="enterFolder('${cat}')">
                                <span class="preset-name">${cat}</span>
                                <span class="preset-meta">${count} items</span>
                            </div>
                            <div class="preset-actions">
                                <div class="action-btn" onclick="enterFolder('${cat}')" title="Open Folder">
                                    <i class="fas fa-folder-open"></i>
                                </div>
                            </div>
                        `;
                    })(category);
                    container.appendChild(fld);
                }
            } else {
                
                var presets = data[currentLibraryFolder];
                var count = 0;
                for (var name in presets) {
                    count++;
                    var item = document.createElement('div');
                    item.className = "preset-card preset";
                    (function (cat, n) {
                        item.innerHTML = `
                            <div class="preset-icon">
                                <i class="fas fa-code"></i>
                            </div>
                            <div class="preset-info" onclick="applyPreset('${cat}', '${n}')">
                                <span class="preset-name">${n}</span>
                                <span class="preset-meta">${cat}</span>
                            </div>
                            <div class="preset-actions">
                                <div class="action-btn" onclick="renamePreset('${cat}', '${n}')" title="Rename">
                                    <i class="fas fa-tag"></i>
                                </div>
                                <div class="action-btn" onclick="editPresetExpression('${cat}', '${n}')" title="Edit Code">
                                    <i class="fas fa-edit"></i>
                                </div>
                                <div class="action-btn delete" onclick="deletePreset('${cat}', '${n}')" title="Delete">
                                    <i class="fas fa-trash-alt"></i>
                                </div>
                                <div class="action-btn" onclick="applyPreset('${cat}', '${n}')" title="Apply">
                                    <i class="fas fa-bolt"></i>
                                </div>
                            </div>
                        `;
                    })(currentLibraryFolder, name);
                    container.appendChild(item);
                }

                if (count === 0) {
                    container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:40px; font-style:italic;">This folder is empty.</p>`;
                }
            }
        } catch (e) { console.error("Refresh UI Error:", e); }
    });
}
