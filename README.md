# RPG Todo Quest

A gamified todo list application that turns your tasks into epic quests! Complete tasks to gain experience, level up, and earn gold.

## Features
- Transform regular tasks into RPG-style quests
- Multiple difficulty levels (Normal, Hard, Epic, Boss)
- Experience points (XP) and gold rewards
- Level progression system
- Subtasks for complex quests
- HP system for Epic and Boss quests
- Sound effects for actions
- Local storage save system

## Setup
1. Clone or download this repository
2. Open `index.html` in a web browser
3. Start adding your quests!

## Quest Difficulties
- **Normal**: Simple tasks with basic rewards
- **Hard**: More challenging tasks with increased rewards
- **Epic**: Major tasks with HP bar and subtask system
- **Boss**: Ultimate challenges with maximum rewards

## How to Use
1. Enter your task in the input field
2. Select the difficulty level
3. Click "Add Quest" or press Enter
4. Add subtasks if needed
5. Complete subtasks and click the quest to finish it
6. Earn XP and gold for completed quests
7. Level up as you gain XP

## Development
The project is structured into modular components:
```
rpg-todo/
├── index.html
├── styles/
│   ├── main.css
│   ├── modal.css
│   ├── notifications.css
│   └── todo-items.css
├── js/
│   ├── constants.js
│   ├── soundManager.js
│   ├── utils.js
│   ├── gameState.js
│   ├── questGeneration.js
│   ├── todoManager.js
│   ├── ui.js
│   └── main.js
└── assets/
    ├── images/
    ├── sounds/
    └── fonts/
```


## JavaScript Architecture

The application's JavaScript is divided into modular files, each with a specific responsibility:

### js/constants.js
- Contains all game constants and configuration
- Defines difficulty levels and their rewards (XP, gold, HP)
- Stores arrays of text elements for quest generation
- Key objects:
  - `DIFFICULTIES`: Defines rewards and HP for each difficulty level
  - `QUEST_ELEMENTS`: Contains arrays for generating quest descriptions
- Modify this file to:
  - Adjust game balance (XP, gold, HP values)
  - Add new quest text variations
  - Add new difficulty levels

### js/soundManager.js
- Handles all audio functionality
- Uses Web Audio API for sound generation
- Contains methods for different sound effects:
  - questAddedSound()
  - taskCompletedSound()
  - criticalHitSound()
  - bossDefeatSound()
  - errorSound()
  - subtaskCompletedSound()
- Modify this file to:
  - Add new sound effects
  - Change existing sound patterns
  - Adjust audio parameters

### js/utils.js
- Contains utility functions used across the application
- Key functions:
  - `getRandomInt(min, max)`: Generate random numbers
  - `getRandomElement(array)`: Pick random array elements
  - `isCriticalHit()`: Calculate critical hit chance
- Modify this file to:
  - Add new utility functions
  - Adjust randomization logic
  - Change critical hit probability

### js/gameState.js
- Manages the game's state and persistence
- Handles saving/loading from localStorage
- Maintains current stats (XP, gold, level)
- Key functions:
  - `saveGameState()`
  - `loadGameState()`
  - `getXpForLevel()`
- Modify this file to:
  - Change save/load behavior
  - Adjust leveling system
  - Add new stats or game state properties

### js/questGeneration.js
- Handles generation of quest descriptions and properties
- Manages HP allocation for epic/boss quests
- Key functions:
  - `generateQuestFlavor()`
  - `allocateHp()`
  - `getFinishingBlowDescription()`
- Modify this file to:
  - Change quest text generation
  - Adjust HP mechanics
  - Add new quest types

### js/todoManager.js
- Core task/quest management functionality
- Handles adding, completing, and deleting quests
- Manages subtasks and quest progression
- Key functions:
  - `addTodo()`
  - `handleClick()`
  - `completeQuest()`
  - `addSubtask()`
  - `toggleSubtask()`
  - `deleteTodo()`
- Modify this file to:
  - Change quest behavior
  - Add new quest features
  - Modify completion mechanics

### js/ui.js
- Handles all DOM manipulation and UI updates
- Manages notifications and modals
- Key functions:
  - `renderTodos()`
  - `updateStats()`
  - `showNotification()`
  - Modal functions (open/close/reset)
- Modify this file to:
  - Change UI appearance
  - Add new UI elements
  - Modify notifications

### js/main.js
- Application initialization
- Sets up event listeners
- Handles sound toggle functionality
- Key functions:
  - `window.onload`
  - `initializeSoundToggle()`
- Modify this file to:
  - Add new initialization logic
  - Change startup behavior
  - Add new global event listeners

## Common Modification Scenarios

1. To add a new quest feature:
   - Add constants to `constants.js`
   - Add generation logic to `questGeneration.js`
   - Add UI elements in `ui.js`
   - Add handling logic in `todoManager.js`

2. To modify quest rewards:
   - Update reward values in `constants.js`
   - Modify reward calculations in `todoManager.js`

3. To add new UI elements:
   - Add HTML elements to `index.html`
   - Add styling to appropriate CSS file
   - Add rendering logic to `ui.js`
   - Add event handlers to `todoManager.js`

4. To modify game mechanics:
   - Update core logic in `gameState.js`
   - Modify quest handling in `todoManager.js`
   - Update UI feedback in `ui.js`

5. To add new sound effects:
   - Add new sound methods to `soundManager.js`
   - Call new methods from appropriate locations in `todoManager.js` or `ui.js`