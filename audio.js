class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.sfxVolume = 0.8;
        this.musicVolume = 0.6;
        this.init();
    }

    init() {
        this.loadSounds();
        this.setupAudioElements();
    }

    loadSounds() {
        this.sounds = {
            shoot: this.createSound('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQ'),
            explosion: this.createSound('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQ'),
            coin: this.createSound('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQ'),
            upgrade: this.createSound('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQ'),
            button: this.createSound('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQ'),
            victory: this.createSound('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQ'),
            gameOver: this.createSound('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQ')
        };
    }

    createSound(base64Data) {
        const audio = new Audio();
        audio.src = base64Data;
        return audio;
    }

    setupAudioElements() {
        // استخدام العناصر الموجودة في HTML
        this.sounds.shoot = document.getElementById('shootSound');
        this.sounds.explosion = document.getElementById('explosionSound');
        this.sounds.coin = document.getElementById('coinSound');
        this.sounds.upgrade = document.getElementById('upgradeSound');
        this.sounds.button = document.getElementById('buttonSound');
        this.sounds.victory = document.getElementById('victorySound');
        this.sounds.gameOver = document.getElementById('gameOverSound');
        this.music = document.getElementById('backgroundMusic');
    }

    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].volume = this.sfxVolume;
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(e => console.log('Audio play failed:', e));
        }
    }

    playBackgroundMusic() {
        if (this.music) {
            this.music.volume = this.musicVolume;
            this.music.loop = true;
            this.music.play().catch(e => console.log('Music play failed:', e));
        }
    }

    stopBackgroundMusic() {
        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
        }
    }

    setVolume(sfxVolume, musicVolume) {
        this.sfxVolume = sfxVolume;
        this.musicVolume = musicVolume;

        // تحديث حجم الصوت لجميع المؤثرات
        Object.values(this.sounds).forEach(sound => {
            if (sound) sound.volume = this.sfxVolume;
        });

        // تحديث حجم صوت الموسيقى
        if (this.music) {
            this.music.volume = this.musicVolume;
        }
    }

    pauseAll() {
        Object.values(this.sounds).forEach(sound => {
            if (sound) sound.pause();
        });
        if (this.music) this.music.pause();
    }

    resumeAll() {
        if (this.music) this.music.play();
    }
}
