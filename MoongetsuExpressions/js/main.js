function loadTabContent(tabId, fileName) {
    return new Promise((resolve, reject) => {
        try {
            var extensionPath = csInterface.getSystemPath(SystemPath.EXTENSION);
            var filePath = extensionPath + '/tabs/' + fileName;

            var xhr = new XMLHttpRequest();
            xhr.open('GET', filePath, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 0) {
                        var container = document.getElementById(`tab-${tabId}`);
                        if (container) container.innerHTML = xhr.responseText;
                        resolve();
                    } else {
                        reject("Failed to load: " + filePath);
                    }
                }
            };
            xhr.send();
        } catch (err) {
            reject(err);
        }
    });
}


document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
        var tabId = btn.dataset.tab;
        if (tabId) switchTab(tabId);
    });
});


document.addEventListener('click', (e) => {
    const card = e.target.closest('.home-card');
    if (card) {
        var tabId = card.dataset.goto;
        if (tabId) switchTab(tabId);
    }
});


async function initApp() {

    var tabs = [
        { id: 'home', file: 'home.html' },
        { id: 'presets', file: 'presets.html' },
        { id: 'tools', file: 'tools.html' },
        { id: 'manage', file: 'manage.html' },
        { id: 'register', file: 'register.html' },
        { id: 'settings', file: 'settings.html' }
    ];

    try {
        const timestamp = new Date().getTime();
        const loadPromises = tabs.map(tab => loadTabContent(tab.id, tab.file + "?v=" + timestamp));

        await Promise.all(loadPromises);

        
        setTimeout(() => {
            initSettings();
            refreshCustomUI();
            switchTab('home');

        }, 150);

    } catch (err) {
        console.error("Initialization Failed:", err);
        switchTab('home');
    }
}


initApp();


window.applyPreset = applyPreset;
window.switchTab = switchTab;
window.switchSettingsCategory = switchSettingsCategory;
window.clearExpressions = clearExpressions;
window.exitFolder = exitFolder;
window.createNewFolderUI = createNewFolderUI;
window.refreshCustomUI = refreshCustomUI;
window.savePreset = savePreset;
window.grabFromSelected = grabFromSelected;
window.runReplace = runReplace;
window.scanLayerExpressions = scanLayerExpressions;
window.runRevert = runRevert;
window.toggleTheme = toggleTheme;
window.toggleCompactMode = toggleCompactMode;
window.changeStoragePath = changeStoragePath;
window.exportLibrary = exportLibrary;
window.toggleCustomSelect = toggleCustomSelect;
window.selectCustomOption = selectCustomOption;
window.updateRegisterDropdown = updateRegisterDropdown;
window.validatePresetName = validatePresetName;
window.renamePreset = renamePreset;
window.editPresetExpression = editPresetExpression;
