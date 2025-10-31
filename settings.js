class SettingsManager {
    constructor(main) {
        this.main = main;
        this.settings = this.loadSettings();
        this.setupSettings();
    }

    loadSettings() {
        const defaultSettings = {
            sfxVolume: 80,
            musicVolume: 60,
            darkMode: false,
            vibrations: true
        };

        const saved = localStorage.getItem('galaxyAttackSettings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }

    saveSettings() {
        localStorage.setItem('galaxyAttackSettings', JSON.stringify(this.settings));
    }

    setupSettings() {
        this.setupVolumeControls();
        this.setupTheme();
        this.applySettings();
    }

    setupVolumeControls() {
        const sfxSlider = document.getElementById('sfxVolume');
        const musicSlider = document.getElementById('musicVolume');
        const darkModeToggle = document.getElementById('darkMode');

        if (sfxSlider) {
            sfxSlider.value = this.settings.sfxVolume;
            sfxSlider.addEventListener('input', (e) => {
                this.settings.sfxVolume = e.target.value;
                this.applyVolumeSettings();
                this.saveSettings();
            });
        }

        if (musicSlider) {
            musicSlider.value = this.settings.musicVolume;
            musicSlider.addEventListener('input', (e) => {
                this.settings.musicVolume = e.target.value;
                this.applyVolumeSettings();
                this.saveSettings();
            });
        }

        if (darkModeToggle) {
            darkModeToggle.checked = this.settings.darkMode;
            darkModeToggle.addEventListener('change', (e) => {
                this.settings.darkMode = e.target.checked;
                this.applyTheme();
                this.saveSettings();
            });
        }
    }

    applyVolumeSettings() {
        this.main.audioManager.setVolume(
            this.settings.sfxVolume / 100,
            this.settings.musicVolume / 100
        );
    }

    applyTheme() {
        if (this.settings.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    applySettings() {
        this.applyVolumeSettings();
        this.applyTheme();
    }
}
