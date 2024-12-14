// constants.js
const DIFFICULTIES = {
    normal: { xp: 50, gold: 25 },
    hard: { xp: 100, gold: 50 },
    epic: { xp: 200, gold: 100, hp: 100 },
    boss: { xp: 500, gold: 250, hp: 200 }
};

const QUEST_ELEMENTS = {
    fetchItems: ['Ancient Scroll', 'Magic Herb', 'Lost Ring', 'Sacred Stone', 'Crystal Shard', 'Mystic Feather', 'Enchanted Map', 'Celestial Compass'],
    fetchLocations: ['from the Dark Forest', 'from the Misty Mountains', 'from the Abandoned Temple', 'from the Crystal Cave', 'from the Enchanted Garden', 'hidden in Shadowmist Valley', 'deep in Whispering Woods'],
    treasureAdjectives: ['Legendary', 'Mythical', 'Fabled', 'Ancient', 'Forgotten', 'Sacred', 'Ethereal', 'Luminous'],
    treasureItems: ['Sword', 'Crown', 'Scepter', 'Amulet', 'Grimoire', 'Orb', 'Crystal'],
    miniBossAdjectives: ['Corrupted', 'Savage', 'Venomous', 'Twisted', 'Cursed'],
    miniBossTypes: ['Warrior', 'Sorcerer', 'Guardian', 'Knight', 'Berserker'],
    bossAdjectives: ['Ancient', 'Dark', 'Mystic', 'Frozen', 'Burning', 'Corrupted'],
    bossAttributes: ['Cursed', 'Vengeful', 'Eternal', 'Savage', 'Celestial', 'Demonic'],
    bossCreatures: ['Dragon', 'Lich', 'Demon', 'Phoenix', 'Hydra', 'Kraken']
};

