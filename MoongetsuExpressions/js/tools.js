function runReplace() {
    var find = document.getElementById('find-in').value;
    var replace = document.getElementById('replace-in').value;
    csInterface.evalScript(`Utils.globalSearchReplace("${find}", "${replace}")`);
}

function runRevert() {
    showModal("Deep Revert", "This will wipe ALL expressions and sliders from the selected layer. Continue?", "confirm", function () {
        csInterface.evalScript('Utils.revertLayer()');
    });
}

function scanLayerExpressions() {
    csInterface.evalScript('Utils.getLayerExpressions()', function (result) {
        if (result === "[]") {
            document.getElementById('property-list').innerHTML = '<p style="color: var(--text-muted); font-size: 10px; text-align: center; padding: 10px;">No active expressions found on selected layer.</p>';
            return;
        }
        try {
            var props = JSON.parse(result);
            var container = document.getElementById('property-list');
            container.innerHTML = '';

            if (props.length === 0) {
                container.innerHTML = '<p style="color: var(--text-muted); font-size: 10px; text-align: center;">No active expressions found.</p>';
                return;
            }

            props.forEach(p => {
                var row = document.createElement('div');
                row.className = "property-item";
                row.style = "display: flex; align-items: center; background: rgba(255,255,255,0.03); padding: 10px 12px; border-radius: 6px; margin-bottom: 8px; border: 1px solid var(--border);";

                var preview = p.code.length > 40 ? p.code.substring(0, 37) + '...' : p.code;
                preview = preview.replace(/\n/g, ' ');

                row.innerHTML = `
                    <div style="flex: 1; min-width: 0;">
                        <div style="color: var(--accent); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">${p.name}</div>
                        <div style="color: var(--text-muted); font-size: 10px; font-family: monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 3px;">${preview}</div>
                    </div>
                    <div style="display: flex; gap: 8px; margin-left: 10px;">
                        <i class="fas fa-eye" style="color: var(--text-muted); cursor: pointer; font-size: 13px; padding: 5px;" title="View Expression" onclick="viewFullExpression('${p.name}', '${encodeURIComponent(p.code)}')"></i>
                        <i class="fas fa-times" style="color: var(--danger); cursor: pointer; font-size: 14px; padding: 5px;" title="Reset Property" onclick="resetProperty('${p.name}')"></i>
                    </div>
                `;
                container.appendChild(row);
            });
        } catch (e) { console.error(e); }
    });
}

function viewFullExpression(name, encodedCode) {
    var code = decodeURIComponent(encodedCode);
    showModal(`Expression: ${name}`, code, "alert");
}

function resetProperty(name) {
    csInterface.evalScript(`Utils.resetPropertyExpression("${name}")`, function () {
        scanLayerExpressions();
    });
}
