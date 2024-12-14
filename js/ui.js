// ui.js
function renderTodos() {
    const list = document.getElementById('todo-list');
    list.innerHTML = '';

    window.todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div>
                <span class="task-text">${todo.text}</span>
                <span class="quest-flavor">${todo.questFlavor}</span>
                <button class="delete-btn" onclick="deleteTodo(event, ${todo.id})">✗</button>
                <span class="difficulty">[${todo.difficulty.toUpperCase()}]</span>
                ${todo.maxHp !== null ? `<div class="hp-bar"><div class="hp-bar-inner" style="width: ${(todo.remainingHp / todo.maxHp) * 100}%;"></div></div>` : ''}
                <button onclick="addSubtask(${todo.id})">+ Subtask</button>
                <ul class="subtask-list">
                    ${todo.subtasks.map((subtask, index) => `
                        <li class="subtask-item">
                            <label>
                                <input type="checkbox" ${subtask.completed ? 'checked' : ''} onclick="toggleSubtask(${todo.id}, ${index})">
                                ${subtask.text}
                            </label>
                        </li>`).join('')}
                </ul>
            </div>
        `;

        if (!todo.completed) {
            if (todo.subtasks.length === 0 || todo.subtasks.every(sub => sub.completed)) {
                li.onclick = () => handleClick(todo.id);
                li.classList.add('clickable');
            }
        }

        list.appendChild(li);
    });
}

function updateStats() {
    const completedCount = window.todos.filter(todo => todo.completed).length;
    document.getElementById('completed-count').textContent = completedCount;
    document.getElementById('total-count').textContent = window.todos.length;
    document.getElementById('gold').textContent = window.stats.gold;
    document.getElementById('level').textContent = window.stats.level;
    document.getElementById('xp').textContent = window.stats.xp;

    while (window.stats.xp >= getXpForLevel(window.stats.level)) {
        window.stats.xp -= getXpForLevel(window.stats.level);
        window.stats.level++;
        showNotification(`LEVEL UP!<br>Level ${window.stats.level}`);
        SoundManager.bossDefeatSound();
    }

    document.getElementById('next-level-xp').textContent = getXpForLevel(window.stats.level);
    saveGameState();

    document.getElementById('player-hp').textContent = window.stats.currentHp;
    document.getElementById('player-max-hp').textContent = window.stats.maxHp;
    
    // Check for player death
    if (window.stats.currentHp <= 0) {
        clearInterval(damageTimer); // Stop damage timer
        document.getElementById('defeat-dialog').style.display = 'flex';
    }
}

function handleContinue() {
    window.stats.gold = Math.floor(window.stats.gold * 0.5);
    window.stats.currentHp = window.stats.maxHp;
    document.getElementById('defeat-dialog').style.display = 'none';
    
    // Turn timer off
    const timerToggle = document.getElementById('timer-toggle');
    timerToggle.checked = false;
    timerToggle.dispatchEvent(new Event('change'));
    
    showNotification('You continue your journey! (-50% Gold)');
    updateStats();
    saveGameState();
}

function handleSurrender() {
    document.getElementById('defeat-dialog').style.display = 'none';
    resetGameProgress();
    showNotification('Game Over - Progress Reset!');
}

function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    notification.innerHTML = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, duration);
}

function openSettingsModal() {
    document.getElementById('modal').style.display = 'flex';
}

function closeSettingsModal() {
    document.getElementById('modal').style.display = 'none';
}

function resetGameProgress() {
    if (window.damageTimer) {
        clearInterval(window.damageTimer);
        window.damageTimer = null;
    }
    
    window.todos = [];
    window.stats = {
        xp: 0,
        gold: 0,
        level: 1,
        maxHp: 100,
        currentHp: 100,
        baseDamage: 1,
        xpScaling: 1.5,
        damageInterval: 60,
        timerEnabled: false
    };
    
    // Reset timer toggle UI
    const timerToggle = document.getElementById('timer-toggle');
    if (timerToggle) {
        timerToggle.checked = false;
        const toggleText = timerToggle.nextElementSibling;
        toggleText.textContent = 'Off';
        toggleText.classList.remove('active');
    }
    
    // Reset settings input values
    const baseDamage = document.getElementById('base-damage');
    const xpScaling = document.getElementById('xp-scaling');
    const damageInterval = document.getElementById('damage-interval');
    
    baseDamage.value = window.stats.baseDamage;
    xpScaling.value = window.stats.xpScaling;
    damageInterval.value = window.stats.damageInterval;
    
    localStorage.removeItem('todoRpgData');
    renderTodos();
    updateStats();
    closeSettingsModal();
}

// Initialize sound toggle
function initializeSoundToggle() {
    const soundToggle = document.getElementById('sound-toggle');
    soundToggle.checked = SoundManager.soundEnabled;
    
    soundToggle.addEventListener('change', function() {
        SoundManager.soundEnabled = this.checked;
        localStorage.setItem('soundEnabled', this.checked);
    });

    // Load previous sound setting
    const savedSoundSetting = localStorage.getItem('soundEnabled');
    if (savedSoundSetting !== null) {
        SoundManager.soundEnabled = savedSoundSetting === 'true';
        soundToggle.checked = SoundManager.soundEnabled;
    }
}

function initializeSettings() {
    const baseDamage = document.getElementById('base-damage');
    const xpScaling = document.getElementById('xp-scaling');
    const damageInterval = document.getElementById('damage-interval');

    // Set initial values
    baseDamage.value = window.stats.baseDamage;
    xpScaling.value = window.stats.xpScaling;
    damageInterval.value = window.stats.damageInterval;

    // Add change handlers
    baseDamage.addEventListener('change', function() {
        window.stats.baseDamage = Number(this.value);
        saveGameState();
    });

    xpScaling.addEventListener('change', function() {
        window.stats.xpScaling = Number(this.value);
        saveGameState();
    });

    damageInterval.addEventListener('change', function() {
        window.stats.damageInterval = Number(this.value);
        if (window.damageTimer && window.stats.timerEnabled) {
            clearInterval(window.damageTimer);
            window.damageTimer = setInterval(checkPlayerDamage, window.stats.damageInterval * 1000);
        }
        saveGameState();
    });
}

function initializeTimerToggle() {
    const timerToggle = document.getElementById('timer-toggle');
    const toggleText = timerToggle.nextElementSibling;
    
    // Set initial state from saved state
    timerToggle.checked = window.stats.timerEnabled;
    toggleText.textContent = window.stats.timerEnabled ? 'On' : 'Off';
    toggleText.classList.toggle('active', window.stats.timerEnabled);
    
    // Start timer if it was enabled
    if (window.stats.timerEnabled) {
        window.damageTimer = setInterval(checkPlayerDamage, window.stats.damageInterval * 1000);
    }
    
    timerToggle.addEventListener('change', function() {
        const toggleText = this.nextElementSibling;
        window.stats.timerEnabled = this.checked;
        
        if (this.checked) {
            window.damageTimer = setInterval(checkPlayerDamage, window.stats.damageInterval * 1000);
            toggleText.textContent = 'On';
            toggleText.classList.add('active');
        } else {
            clearInterval(window.damageTimer);
            window.damageTimer = null;
            toggleText.textContent = 'Off';
            toggleText.classList.remove('active');
        }
        
        saveGameState();
    });
}