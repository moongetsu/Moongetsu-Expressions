function showModal(title, message, type, onConfirm) {
    const overlay = document.getElementById('modal-overlay');
    const footer = document.getElementById('modal-footer');
    const body = document.querySelector('.modal-body');
    
    document.getElementById('modal-title').innerText = title;
    
    
    const oldInput = body.querySelector('.modal-input');
    if (oldInput) oldInput.remove();
    const oldSelect = body.querySelector('.custom-select-container');
    if (oldSelect) oldSelect.remove();
    const oldDiff = body.querySelector('.diff-container');
    if (oldDiff) oldDiff.remove();
    
    footer.innerHTML = '';
    
    
    const msgEl = document.getElementById('modal-message');
    if (typeof message === 'string') {
        msgEl.innerText = message;
    } else {
        msgEl.innerText = ""; 
    }

    if (type === 'prompt') {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'modal-input';
        input.placeholder = 'Enter name...';
        body.appendChild(input);
        setTimeout(() => input.focus(), 100);
    }
    
    if (type === 'select') {
        const selectContainer = document.createElement('div');
        selectContainer.className = 'custom-select-container';
        selectContainer.id = 'modal-select-container';
        const firstVal = Array.isArray(message) ? message[0] : "Select...";
        selectContainer.innerHTML = `
            <div class="custom-select-trigger" onclick="toggleCustomSelect('modal-select')">
                <span id="modal-select-text">${firstVal}</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="custom-select-options" id="modal-select-options"></div>
            <input type="hidden" id="modal-select-value" value="${firstVal}">
        `;
        body.appendChild(selectContainer);
        const optionsContainer = selectContainer.querySelector('#modal-select-options');
        if (Array.isArray(message)) {
            message.forEach(opt => {
                const o = document.createElement('div');
                o.className = 'custom-select-option';
                o.innerText = opt;
                o.onclick = () => selectCustomOption('modal-select', opt, 'modal-select-value');
                optionsContainer.appendChild(o);
            });
            msgEl.innerText = "Choose destination:";
        }
    }
    
    if (type === 'diff') {
        const container = document.createElement('div');
        container.className = 'diff-container';
        container.innerHTML = `
            <div class="diff-box old">
                <label>Existing: ${message.name}</label>
                <textarea readonly>${message.oldCode}</textarea>
            </div>
            <div class="diff-box new">
                <label>Incoming: ${message.name}</label>
                <textarea readonly>${message.newCode}</textarea>
            </div>
        `;
        msgEl.innerText = "Conflict detected! Review changes below:";
        body.appendChild(container);
    }

    if (type === 'edit') {
        const textarea = document.createElement('textarea');
        textarea.className = 'modal-input';
        textarea.style.height = '200px';
        textarea.style.fontFamily = 'monospace';
        textarea.style.fontSize = '11px';
        textarea.style.resize = 'none';
        textarea.value = message;
        body.appendChild(textarea);
    }

    if (type === 'confirm' || type === 'prompt' || type === 'select' || type === 'diff' || type === 'edit') {
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'modal-btn cancel';
        cancelBtn.innerText = (type === 'diff') ? 'Abort Import' : 'Cancel';
        cancelBtn.onclick = () => overlay.classList.remove('active');
        footer.appendChild(cancelBtn);
    }
    
    const okBtn = document.createElement('button');
    okBtn.className = 'modal-btn confirm';
    okBtn.innerText = (type === 'confirm' || type === 'prompt' || type === 'select' || type === 'diff' || type === 'edit') ? 'Confirm' : 'OK';
    okBtn.onclick = () => {
        var result = true;
        if (type === 'prompt') result = body.querySelector('.modal-input').value;
        else if (type === 'select') result = body.querySelector('#modal-select-value').value;
        else if (type === 'edit') result = body.querySelector('textarea').value;
        
        overlay.classList.remove('active');
        if (onConfirm) onConfirm(result);
    };
    footer.appendChild(okBtn);
    overlay.classList.add('active');
}
