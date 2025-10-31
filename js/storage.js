// Storage Manager
class StorageManager {
    constructor() {
        this.storageKey = 'galaxyAttackSave';
        this.settingsKey = 'galaxyAttackSettings';
        this.version = '2.0.0';
    }

    // Get default game state
    getDefaultState() {
        return {
            version: this.version,
            player: {
                coins: GameConfig.player.startCoins,
                gems: GameConfig.player.startGems,
                level: GameConfig.player.startLevel,
                experience: 0,
                totalScore: 0
            },
            progress: {
                currentLevel: 1,
                unlockedLevels: 1,
                completedLevels: 0,
                stars: 0,
                playTime: 0
            },
            ships: {
                unlocked: ['basic'],
                selected: 'basic',
                purchases: []
            },
            upgrades: {
                weapon: 1,
                fireRate: 1,
                shield: 1,
                health: 1
            },
            achievements: {
                first_kill: { unlocked: false, progress: 0 },
                coin_collector: { unlocked: false, progress: 0 },
                level_master: { unlocked: false, progress: 0 },
                upgrade_expert: { unlocked: false, progress: 0 }
            },
            dailyReward: {
                lastClaimed: null,
                streak: 0,
                totalClaims: 0
            },
            commissions: {
                upgrade: 0,
                purchase: 0
            },
            statistics: {
                totalKills: 0,
                totalCoinsCollected: 0,
                totalGemsCollected: 0,
                totalPlayTime: 0,
                totalShotsFired: 0,
                totalDeaths: 0
            },
            missions: {
                daily: [],
                weekly: [],
                completed: []
            },
            inventory: {
                powerUps: {},
                skins: {}
            }
        };
    }

    // Get default settings
    getDefaultSettings() {
        return {
            version: this.version,
            audio: {
                sfxVolume: 80,
                musicVolume: 60,
                muted: false
            },
            graphics: {
                quality: 'high',
                particles: true,
                screenShake: true
            },
            controls: {
                sensitivity: 50,
                autoFire: false,
                touchControls: true
            },
            game: {
                language: 'ar',
                notifications: true,
                autoSave: true
            }
        };
    }

    // Load game data
    async loadGameData() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (!saved) {
                return this.getDefaultState();
            }

            const loaded = JSON.parse(saved);
            
            // Migration from older versions
            return this.migrateSaveData(loaded);
            
        } catch (error) {
            console.error('Failed to load game data:', error);
            return this.getDefaultState();
        }
    }

    // Load settings
    async loadSettings() {
        try {
            const saved = localStorage.getItem(this.settingsKey);
            if (!saved) {
                return this.getDefaultSettings();
            }

            const loaded = JSON.parse(saved);
            return { ...this.getDefaultSettings(), ...loaded };
            
        } catch (error) {
            console.error('Failed to load settings:', error);
            return this.getDefaultSettings();
        }
    }

    // Save game data
    async saveGameData(gameData) {
        try {
            gameData.version = this.version;
            gameData.lastSaved = new Date().toISOString();
            
            localStorage.setItem(this.storageKey, JSON.stringify(gameData));
            return true;
            
        } catch (error) {
            console.error('Failed to save game data:', error);
            return false;
        }
    }

    // Save settings
    async saveSettings(settings) {
        try {
            settings.version = this.version;
            localStorage.setItem(this.settingsKey, JSON.stringify(settings));
            return true;
            
        } catch (error) {
            console.error('Failed to save settings:', error);
            return false;
        }
    }

    // Clear all data
    async clearData() {
        try {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.settingsKey);
            return true;
            
        } catch (error) {
            console.error('Failed to clear data:', error);
            return false;
        }
    }

    // Export save data
    async exportSave() {
        try {
            const gameData = await this.loadGameData();
            const settings = await this.loadSettings();
            
            const exportData = {
                game: gameData,
                settings: settings,
                exportDate: new Date().toISOString(),
                version: this.version
            };
            
            return JSON.stringify(exportData);
            
        } catch (error) {
            console.error('Failed to export save:', error);
            return null;
        }
    }

    // Import save data
    async importSave(data) {
        try {
            const importData = JSON.parse(data);
            
            if (importData.version !== this.version) {
                console.warn('Importing from different version');
            }
            
            await this.saveGameData(importData.game);
            await this.saveSettings(importData.settings);
            
            return true;
            
        } catch (error) {
            console.error('Failed to import save:', error);
            return false;
        }
    }

    // Migrate save data from older versions
    migrateSaveData(loadedData) {
        const defaultState = this.getDefaultState();
        
        // Version 1.x to 2.x migration
        if (!loadedData.version || loadedData.version.startsWith('1.')) {
            console.log('Migrating from version 1.x to 2.x');
            
            // Migrate old structure to new structure
            const migrated = {
                ...defaultState,
                player: {
                    ...defaultState.player,
                    coins: loadedData.coins || defaultState.player.coins,
                    gems: loadedData.gems || defaultState.player.gems,
                    level: loadedData.currentLevel || defaultState.player.level
                },
                progress: {
                    ...defaultState.progress,
                    currentLevel: loadedData.currentLevel || defaultState.progress.currentLevel,
                    unlockedLevels: loadedData.unlockedLevels || defaultState.progress.unlockedLevels
                },
                ships: loadedData.ships || defaultState.ships,
                upgrades: loadedData.upgrades || defaultState.upgrades
            };
            
            return migrated;
        }
        
        // For same version, just return the loaded data
        if (loadedData.version === this.version) {
            return { ...defaultState, ...loadedData };
        }
        
        // For future versions, add migration logic here
        console.warn('Loading from future version, using defaults');
        return defaultState;
    }

    // Get storage statistics
    getStorageStats() {
        try {
            const gameDataSize = localStorage.getItem(this.storageKey)?.length || 0;
            const settingsSize = localStorage.getItem(this.settingsKey)?.length || 0;
            const totalSize = gameDataSize + settingsSize;
            
            return {
                gameData: gameDataSize,
                settings: settingsSize,
                total: totalSize,
                lastSaved: JSON.parse(localStorage.getItem(this.storageKey))?.lastSaved
            };
        } catch (error) {
            console.error('Failed to get storage stats:', error);
            return null;
        }
    }

    // Check if storage is available
    isStorageAvailable() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            console.error('Local storage not available:', error);
            return false;
        }
    }

    // Auto-save functionality
    startAutoSave(gameInstance, interval = 30000) {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        this.autoSaveInterval = setInterval(() => {
            if (gameInstance.gameData) {
                this.saveGameData(gameInstance.gameData);
                if (GameConfig.settings.debugMode) {
                    console.log('Game auto-saved');
                }
            }
        }, interval);
    }

    // Stop auto-save
    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}
