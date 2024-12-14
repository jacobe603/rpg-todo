// main.js
window.onload = function() {
    loadGameState();
    initializeSoundToggle();
    initializeSettings();
    initializeTimerToggle(); // Add this line
    
    // Add click handler to initialize audio
    document.body.addEventListener('click', function() {
        SoundManager.initializeAudioContext();
    }, { once: true });
    
    // Event listeners
    document.getElementById('todo-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
};

function initializeSoundToggle() {
    const soundToggle = document.getElementById('sound-toggle');
    soundToggle.checked = SoundManager.soundEnabled;
    
    soundToggle.addEventListener('change', function() {
        SoundManager.soundEnabled = this.checked;
        localStorage.setItem('soundEnabled', this.checked);
    });

    const savedSoundSetting = localStorage.getItem('soundEnabled');
    if (savedSoundSetting !== null) {
        SoundManager.soundEnabled = savedSoundSetting === 'true';
        soundToggle.checked = SoundManager.soundEnabled;
    }
}