function generateQuestFlavor(difficulty) {
    switch(difficulty) {
        case 'normal':
            return `Quest: Gather ${getRandomElement(QUEST_ELEMENTS.fetchItems)} ${getRandomElement(QUEST_ELEMENTS.fetchLocations)}`;
        case 'hard':
            return `Quest: Seek the ${getRandomElement(QUEST_ELEMENTS.treasureAdjectives)} ${getRandomElement(QUEST_ELEMENTS.treasureItems)}`;
        case 'epic':
            return `Epic Challenge: Conquer the ${getRandomElement(QUEST_ELEMENTS.miniBossAdjectives)} ${getRandomElement(QUEST_ELEMENTS.miniBossTypes)} guarding the ${getRandomElement(QUEST_ELEMENTS.treasureAdjectives)} ${getRandomElement(QUEST_ELEMENTS.treasureItems)}`;
        case 'boss':
            return `LEGENDARY MISSION: Defeat the ${getRandomElement(QUEST_ELEMENTS.bossAdjectives)} ${getRandomElement(QUEST_ELEMENTS.bossAttributes)} ${getRandomElement(QUEST_ELEMENTS.bossCreatures)}`;
        default:
            return 'Mysterious Quest';
    }
}

function allocateHp(todo) {
    if (todo.difficulty === 'epic' || todo.difficulty === 'boss') {
        todo.maxHp = DIFFICULTIES[todo.difficulty].hp;
        todo.remainingHp = todo.maxHp;

        const subtaskHp = todo.subtasks.length > 0 
            ? Math.floor((todo.maxHp * 0.7) / todo.subtasks.length) 
            : 0;

        todo.subtasks.forEach(subtask => subtask.hp = subtaskHp);
        todo.finalHp = Math.ceil(todo.maxHp * 0.3);
    } else {
        todo.maxHp = null;
        todo.remainingHp = null;
        todo.finalHp = null;
    }
}

function getFinishingBlowDescription() {
    const finishingMoves = [
        "You strike with a powerful slash!",
        "A thunderous blow sends the enemy reeling!",
        "You unleash a flurry of critical hits!",
        "A decisive strike pierces the enemy's core!"
    ];
    return getRandomElement(finishingMoves);
}