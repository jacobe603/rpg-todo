// todoManager.js
function addTodo() {
    const input = document.getElementById('todo-input');
    const difficulty = document.getElementById('difficulty');
    const text = input.value.trim();

    if (text) {
        const todo = {
            id: Date.now(),
            text: text,
            questFlavor: generateQuestFlavor(difficulty.value),
            difficulty: difficulty.value,
            completed: false,
            subtasks: [],
            hp: null,
            maxHp: null,
            remainingHp: null,
            finalHp: null
        };

        allocateHp(todo);
        window.todos.push(todo);
        input.value = '';
        renderTodos();
        updateStats();
        saveGameState();
        SoundManager.questAddedSound();
    }
}

function handleClick(id) {
    const todo = window.todos.find(t => t.id === id);
    if (!todo) return;

    if (todo.subtasks.every(sub => sub.completed)) {
        if (todo.remainingHp !== null) {
            const damage = Math.ceil(todo.remainingHp * 0.2);
            todo.remainingHp -= damage;

            showNotification(`Strike deals ${damage} damage!`);

            if (todo.remainingHp <= 0) {
                completeQuest(todo);
                showNotification(`${getFinishingBlowDescription()}<br>Quest Completed!`, 5000);
            }
        } else {
            completeQuest(todo);
        }
    } else {
        showNotification("Complete all subtasks first!");
    }

    renderTodos();
    saveGameState();
}

function completeQuest(todo) {
    todo.completed = true;

    const baseRewards = DIFFICULTIES[todo.difficulty];
    const subtaskBonus = todo.subtasks.length * 10;
    const totalXp = baseRewards.xp + subtaskBonus;
    const totalGold = baseRewards.gold + subtaskBonus;

    window.stats.xp += totalXp;
    window.stats.gold += totalGold;

    // Heal player based on difficulty
    const healAmount = {
        normal: 10,
        hard: 20,
        epic: 30,
        boss: 50
    }[todo.difficulty];
    
    window.stats.currentHp = Math.min(
        window.stats.maxHp, 
        window.stats.currentHp + healAmount
    );
    
    showNotification(
        `Quest Completed!<br>+${totalXp} XP<br>+${totalGold} Gold<br>+${healAmount} HP`
    );

    if (todo.difficulty === 'boss') {
        SoundManager.bossDefeatSound();
    } else {
        SoundManager.taskCompletedSound();
    }

    renderTodos();
    updateStats();
    saveGameState();
}

function addSubtask(id) {
    const subtaskText = prompt('Enter subtask description:');
    if (subtaskText && subtaskText.trim().length > 0) {
        const todo = window.todos.find(t => t.id === id);
        todo.subtasks.push({ 
            text: subtaskText.trim(), 
            completed: false 
        });
        renderTodos();
        saveGameState();
    }
}

function toggleSubtask(todoId, subtaskIndex) {
    const todo = window.todos.find(t => t.id === todoId);
    const subtask = todo.subtasks[subtaskIndex];

    subtask.completed = !subtask.completed;

    if (todo.remainingHp !== null) {
        const subtaskHp = todo.maxHp ? Math.floor((todo.maxHp * 0.7) / todo.subtasks.length) : 0;
        
        if (subtask.completed) {
            todo.remainingHp -= subtaskHp;
            showNotification(`Subtask Completed! Enemy HP -${subtaskHp}`);
            SoundManager.subtaskCompletedSound();
        } else {
            todo.remainingHp += subtaskHp;
        }
    }

    renderTodos();
    checkQuestCompletion(todo);
    saveGameState();
}

function deleteTodo(event, id) {
    event.stopPropagation();
    window.todos = window.todos.filter(todo => todo.id !== id);
    renderTodos();
    updateStats();
    saveGameState();
}

function checkQuestCompletion(todo) {
    if (todo.subtasks.length > 0 && todo.subtasks.every(sub => sub.completed) && !todo.completed) {
        showNotification('All subtasks completed! Click the quest to finish it!');
    }
}

function checkPlayerDamage() {
    const uncompletedTasks = window.todos.filter(todo => !todo.completed);
    if (uncompletedTasks.length === 0) return; // Don't damage if no tasks
    
    uncompletedTasks.forEach(todo => {
        const damagePerTask = {
            normal: 1,
            hard: 2,
            epic: 3,
            boss: 5
        };
        
        // Add base damage to calculated damage
        const totalDamage = window.stats.baseDamage + 
            (damagePerTask[todo.difficulty] * Math.pow(window.stats.xpScaling, window.stats.level - 1));
            
        window.stats.currentHp = Math.max(0, window.stats.currentHp - Math.floor(totalDamage));
    });
    
    updateStats();
    saveGameState();
}

// Update damage interval
let damageTimer = setInterval(checkPlayerDamage, window.stats.damageInterval * 1000);