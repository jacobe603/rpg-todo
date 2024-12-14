// soundManager.js

const SoundManager = {
    audioContext: null,
    soundEnabled: true,

    initializeAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            document.addEventListener('click', () => this.resumeAudioContext());
            document.addEventListener('keydown', () => this.resumeAudioContext());
        }
    },

    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    },

    playTone(frequency, duration, type = 'square') {
        if (!this.audioContext) {
            this.initializeAudioContext();
        }

        if (!this.soundEnabled) return;

        if (this.audioContext.state === 'suspended') {
            this.resumeAudioContext();
        }

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    },

    questAddedSound() {
        this.playTone(880, 0.1);
    },

    taskCompletedSound() {
        this.playTone(262, 0.1);
        setTimeout(() => this.playTone(330, 0.1), 50);
        setTimeout(() => this.playTone(392, 0.1), 100);
    },

    criticalHitSound() {
        this.playTone(660, 0.05);
        setTimeout(() => this.playTone(880, 0.05), 50);
    },

    bossDefeatSound() {
        this.playTone(392, 0.1);
        setTimeout(() => this.playTone(493.88, 0.1), 50);
        setTimeout(() => this.playTone(587.33, 0.2), 100);
    },

    errorSound() {
        this.playTone(200, 0.1, 'triangle');
        setTimeout(() => this.playTone(100, 0.1, 'triangle'), 50);
    },

    subtaskCompletedSound() {
        this.playTone(660, 0.05);
    }
};