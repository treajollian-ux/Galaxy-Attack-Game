// Game Configuration
const GameConfig = {
    // Game Version
    version: '2.0.0',
    
    // Game Settings
    settings: {
        maxFPS: 60,
        debugMode: false,
        autoSave: true,
        autoSaveInterval: 30000, // 30 seconds
    },
    
    // Player Configuration
    player: {
        startCoins: 1000,
        startGems: 50,
        startLevel: 1,
        maxLevel: 100,
    },
    
    // Ships Configuration
    ships: {
        basic: {
            id: 'basic',
            name: 'الطائرة الأساسية',
            icon: '🚀',
            price: 0,
            currency: 'coins',
            stats: {
                health: 100,
                speed: 8,
                damage: 25,
                fireRate: 300,
                shield: 0
            },
            description: 'طائرة بدائية مناسبة للمبتدئين'
        },
        fighter: {
            id: 'fighter',
            name: 'المقاتلة السريعة',
            icon: '🛸',
            price: 500,
            currency: 'coins',
            stats: {
                health: 80,
                speed: 12,
                damage: 20,
                fireRate: 200,
                shield: 0
            },
            description: 'طائرة سريعة ذات معدل إطلاق نار عالي'
        },
        tank: {
            id: 'tank',
            name: 'الدبابة الفضائية',
            icon: '🛡️',
            price: 800,
            currency: 'coins',
            stats: {
                health: 200,
                speed: 5,
                damage: 35,
                fireRate: 500,
                shield: 10
            },
            description: 'طائرة دفاعية ذات صحة عالية'
        },
        sniper: {
            id: 'sniper',
            name: 'القناصة',
            icon: '🎯',
            price: 1200,
            currency: 'coins',
            stats: {
                health: 90,
                speed: 7,
                damage: 60,
                fireRate: 600,
                shield: 5
            },
            description: 'طائرة ذات قوة نارية هائلة ولكن بطيئة'
        },
        legendary: {
            id: 'legendary',
            name: 'الأسطورية',
            icon: '👑',
            price: 50,
            currency: 'gems',
            stats: {
                health: 150,
                speed: 10,
                damage: 45,
                fireRate: 250,
                shield: 15
            },
            description: 'طائرة أسطورية متوازنة في جميع النواحي'
        },
        ultimate: {
            id: 'ultimate',
            name: 'النهائية',
            icon: '💫',
            price: 100,
            currency: 'gems',
            stats: {
                health: 180,
                speed: 9,
                damage: 55,
                fireRate: 180,
                shield: 20
            },
            description: 'أقوى طائرة في الأسطول'
        }
    },
    
    // Upgrades Configuration
    upgrades: {
        weapon: {
            name: 'قوة السلاح',
            baseCost: 50,
            costMultiplier: 1.5,
            maxLevel: 20,
            effect: (level) => 25 + (level * 15),
            description: 'يزيد من قوة الضرر للطائرة'
        },
        fireRate: {
            name: 'سرعة الطلقات',
            baseCost: 75,
            costMultiplier: 1.6,
            maxLevel: 15,
            effect: (level) => Math.max(100, 300 - (level * 13)),
            description: 'يزيد من سرعة إطلاق النار'
        },
        shield: {
            name: 'درع الطاقة',
            baseCost: 100,
            costMultiplier: 1.7,
            maxLevel: 10,
            effect: (level) => level * 5,
            description: 'يقلل الضرر الواقع على الطائرة'
        },
        health: {
            name: 'تعزيز الصحة',
            baseCost: 150,
            costMultiplier: 1.8,
            maxLevel: 10,
            effect: (level) => 100 + (level * 25),
            description: 'يزيد من الصحة القصوى للطائرة'
        }
    },
    
    // Levels Configuration
    levels: {
        count: 100,
        enemies: {
            baseCount: 5,
            countIncrease: 0.5,
            baseHealth: 30,
            healthIncrease: 8,
            baseSpeed: 1,
            speedIncrease: 0.2,
            baseValue: 10,
            valueIncrease: 3
        },
        rewards: {
            baseCoins: 50,
            coinsIncrease: 15,
            gemChance: 0.3,
            starThresholds: [500, 1000, 1500] // Points needed for 1, 2, 3 stars
        }
    },
    
    // Audio Configuration
    audio: {
        volume: {
            sfx: 0.8,
            music: 0.6
        },
        files: {
            background: 'sounds/background.mp3',
            shoot: 'sounds/shoot.wav',
            explosion: 'sounds/explosion.wav',
            coin: 'sounds/coin.wav',
            upgrade: 'sounds/upgrade.wav',
            button: 'sounds/button.wav',
            victory: 'sounds/victory.wav',
            gameOver: 'sounds/game-over.wav'
        }
    },
    
    // Achievements Configuration
    achievements: {
        first_kill: {
            name: 'أول قتلة',
            description: 'اقتل أول عدو',
            reward: { coins: 50, gems: 0 },
            target: 1
        },
        coin_collector: {
            name: 'جامع العملات',
            description: 'اجمع 1000 عملة',
            reward: { coins: 100, gems: 0 },
            target: 1000
        },
        level_master: {
            name: 'سيد المستويات',
            description: 'أكمل المستوى 10',
            reward: { coins: 0, gems: 5 },
            target: 10
        },
        upgrade_expert: {
            name: 'خبير الترقيات',
            description: 'قم بترقية جميع المهارات إلى المستوى 5',
            reward: { coins: 200, gems: 10 },
            target: 20 // 4 upgrades * 5 levels
        }
    },
    
    // Daily Rewards Configuration
    dailyRewards: {
        baseReward: 100,
        streakBonus: 50,
        maxStreak: 7
    },
    
    // Commission System
    commissions: {
        upgrade: 0.1, // 10% of upgrade cost
        purchase: 0.05 // 5% of purchase cost
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameConfig;
}
