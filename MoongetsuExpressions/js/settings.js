function pushSettingsToDisk() {
    var prefs = {
        theme: document.body.classList.contains('light-theme') ? 'light' : 'dark',
        compact: document.body.classList.contains('compact-mode'),
        hidePresets: document.getElementById('nav-presets').style.display === 'none',
        prefix: document.getElementById('setting-prefix').value || "M_"
    };
    
    var json = JSON.stringify(prefs);
    csInterface.evalScript(`Utils.savePrefs('${json}')`);
}

function saveSettings() {
    var prefix = document.getElementById('setting-prefix').value || "M_";
    localStorage.setItem('moongetsu-prefix', prefix);
    pushSettingsToDisk();
}

function toggleCompactMode() {
    document.body.classList.toggle('compact-mode');
    var isCompact = document.body.classList.contains('compact-mode');
    localStorage.setItem('moongetsu-compact', isCompact ? 'true' : 'false');
    updateCompactButton();
    pushSettingsToDisk();
}

function updateCompactButton() {
    var isCompact = document.body.classList.contains('compact-mode');
    var btn = document.getElementById('compact-toggle');
    if (btn) {
        btn.innerText = isCompact ? "Disable" : "Enable";
    }
}

function togglePresetsVisibility() {
    var navItem = document.getElementById('nav-presets');
    var isHidden = navItem.style.display === 'none';
    
    if (isHidden) {
        navItem.style.display = 'flex';
    } else {
        navItem.style.display = 'none';
        
        if (document.getElementById('tab-presets').classList.contains('active')) {
            switchTab('home');
        }
    }
    
    localStorage.setItem('moongetsu-hide-presets', (!isHidden).toString());
    updatePresetsButton();
    pushSettingsToDisk();
}

function updatePresetsButton() {
    var navItem = document.getElementById('nav-presets');
    var isHidden = navItem.style.display === 'none';
    var btn = document.getElementById('presets-toggle');
    if (btn) {
        btn.innerText = isHidden ? "Show" : "Hide";
    }
}


function toggleTheme() {
    var body = document.body;
    body.classList.toggle('light-theme');
    var isLight = body.classList.contains('light-theme');
    localStorage.setItem('moongetsu-theme', isLight ? 'light' : 'dark');
    updateThemeButton();
    pushSettingsToDisk();
}

function updateThemeButton() {
    var isLight = document.body.classList.contains('light-theme');
    var btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.innerText = isLight ? "Dark Mode" : "Light Mode";
    }
}

function switchSettingsCategory(catId) {
    document.querySelectorAll('.settings-nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.innerText.toLowerCase() === catId) item.classList.add('active');
    });

    document.querySelectorAll('.settings-category').forEach(cat => {
        cat.classList.remove('active');
    });

    var target = document.getElementById(`set-${catId}`);
    if (target) target.classList.add('active');
}

function changeStoragePath() {
    csInterface.evalScript('Utils.pickStorageFolder()', function (result) {
        if (result && result !== "null" && result !== "false") {
            var safePath = result.replace(/\\/g, '/');
            csInterface.evalScript(`Utils.migrateStorage("${safePath}")`, function () {
                localStorage.setItem('moongetsu-storage-path', result);
                updateStoragePathDisplay();
                showModal("Storage Updated", "Your library and settings have been merged and moved to: " + result, "alert");
                refreshCustomUI();
                pushSettingsToDisk(); 
            });
        }
    });
}

function updateStoragePathDisplay() {
    var path = localStorage.getItem('moongetsu-storage-path');
    var display = document.getElementById('storage-path-display');
    if (display) {
        display.innerText = path ? path : "Default (%AppData%)";
    }
}


function initSettings() {
    
    var customPath = localStorage.getItem('moongetsu-storage-path');
    if (customPath) {
        var safePath = customPath.replace(/\\/g, '/');
        csInterface.evalScript(`Utils.setStoragePath("${safePath}")`);
    }
    updateStoragePathDisplay();

    
    csInterface.evalScript('Utils.loadPrefs()', function (result) {
        if (result && result !== "null") {
            try {
                var prefs = JSON.parse(result);
                if (prefs.theme === 'light') document.body.classList.add('light-theme');
                else document.body.classList.remove('light-theme');
                updateThemeButton();

                if (prefs.compact) document.body.classList.add('compact-mode');
                else document.body.classList.remove('compact-mode');
                updateCompactButton();

                var navPresets = document.getElementById('nav-presets');
                if (prefs.hidePresets) navPresets.style.display = 'none';
                else navPresets.style.display = 'flex';
                updatePresetsButton();

                if (prefs.prefix) {
                    var input = document.getElementById('setting-prefix');
                    if (input) input.value = prefs.prefix;
                }
            } catch (e) { console.error("Failed to parse shared settings:", e); }
        } else {
            
            if (localStorage.getItem('moongetsu-theme') === 'light') document.body.classList.add('light-theme');
            updateThemeButton();
            if (localStorage.getItem('moongetsu-compact') === 'true') document.body.classList.add('compact-mode');
            updateCompactButton();

            var hidePresets = localStorage.getItem('moongetsu-hide-presets') === 'true';
            var navPresetsLocal = document.getElementById('nav-presets');
            if (hidePresets) navPresetsLocal.style.display = 'none';
            else navPresetsLocal.style.display = 'flex';
            updatePresetsButton();

            var savedPrefix = localStorage.getItem('moongetsu-prefix') || "M_";
            var prefixInput = document.getElementById('setting-prefix');
            if (prefixInput) prefixInput.value = savedPrefix;
        }
    });
}
