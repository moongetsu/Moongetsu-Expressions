var csInterface = new CSInterface();

function switchTab(tabId) {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    
    var activeNavItem = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
    if (activeNavItem) activeNavItem.classList.add('active');

    
    var targetContent = document.getElementById(`tab-${tabId}`);
    if (targetContent) {
        targetContent.classList.add('active');

        
        if (tabId === 'manage') {
            refreshCustomUI(); 
        }
        if (tabId === 'register') {
            updateRegisterDropdown(); 
        }
        if (tabId === 'tools') {
            scanLayerExpressions(); 
        }
    }
}

function switchSettingsCategory(catId) {
    document.querySelectorAll('.settings-category').forEach(cat => cat.classList.remove('active'));
    document.querySelectorAll('.settings-nav-item').forEach(item => item.classList.remove('active'));

    var targetCat = document.getElementById(`set-${catId}`);
    if (targetCat) targetCat.classList.add('active');

    
    document.querySelectorAll('.settings-nav-item').forEach(item => {
        if (item.getAttribute('onclick').indexOf(catId) !== -1) {
            item.classList.add('active');
        }
    });
}


document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
        var tabId = btn.dataset.tab;
        if (tabId) switchTab(tabId);
    });
});


document.querySelectorAll('.home-card').forEach(card => {
    card.addEventListener('click', () => {
        var tabId = card.dataset.goto;
        if (tabId) switchTab(tabId);
    });
});
