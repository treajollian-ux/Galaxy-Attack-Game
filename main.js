class GalaxyAttack {
    constructor() {
        this.gameState = {
            coins: 1000,
            gems: 50,
            currentLevel: 1,
            unlockedLevels: 1,
            upgrades: {
                weapon: 1,
                fireRate: 1,
                shield: 1,
                health: 1
            },
            ships: {
                unlocked: ['basic'],
                selected: 'basic'
            },
            achievements: {
                first_kill: { unlocked: false, progress: 0 },
                coin_collector: { unlocked: false, progress: 0 },
                level_master: { unlocked: false, progress: 0 }
            },
            dailyReward: {
                lastClaimed: null,
                streak: 0
            },
            commissions: {
                upgrade: 0,
                purchase: 0
            }
        };

        this.audioManager = new AudioManager();
        this.shipsManager = new ShipsManager(this);
        this.settingsManager = new SettingsManager(this);
        this.menuManager = new MenuManager(this);
        
        this.init();
    }

    init() {
        this.loadGame();
        this.setupEventListeners();
        this.updateUI();
        this.generateLevels();
        this.shipsManager.generateShipsDisplay();
        this.menuManager.updateAchievements();
        this.audioManager.playBackgroundMusic();
    }

    loadGame() {
        const saved = localStorage.getItem('galaxyAttackSave');
        if (saved) {
            const loadedState = JSON.parse(saved);
            this.gameState = { ...this.gameState, ...loadedState };
        }
    }

    saveGame() {
        localStorage.setItem('galaxyAttackSave', JSON.stringify(this.gameState));
    }

    setupEventListeners() {
        // الأزرار الرئيسية
        document.getElementById('startBtn').addEventListener('click', () => this.showScreen('levelSelectScreen'));
        document.getElementById('shipsBtn').addEventListener('click', () => this.showScreen('shipsScreen'));
        document.getElementById('upgradesBtn').addEventListener('click', () => this.showScreen('upgradesScreen'));
        document.getElementById('rewardsBtn').addEventListener('click', () => this.showScreen('rewardsScreen'));
        document.getElementById('settingsBtn').addEventListener('click', () => this.showScreen('settingsScreen'));

        // أيقونات سريعة
        document.querySelectorAll('.icon-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const screen = e.target.closest('.icon-btn').dataset.screen;
                this.showScreen(screen + 'Screen');
            });
        });

        // أزرار العودة
        document.getElementById('backToMainFromLevels').addEventListener('click', () => this.showScreen('startScreen'));
        document.getElementById('backToMainFromShips').addEventListener('click', () => this.showScreen('startScreen'));
        document.getElementById('backToMainFromUpgrades').addEventListener('click', () => this.showScreen('startScreen'));
        document.getElementById('backToMainFromRewards').addEventListener('click', () => this.showScreen('startScreen'));
        document.getElementById('backToMainFromSettings').addEventListener('click', () => this.showScreen('startScreen'));

        // الترقيات
        document.querySelectorAll('.upgrade-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.purchaseUpgrade(e.target.dataset.upgrade));
        });

        // المكافآت
        document.getElementById('claimDailyReward').addEventListener('click', () => this.claimDailyReward());
        document.getElementById('claimCommissions').addEventListener('click', () => this.claimCommissions());

        // إعادة تعيين اللعبة
        document.getElementById('resetGame').addEventListener('click', () => this.resetGame());

        // أحداث اللعبة
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseGame());
        document.getElementById('quitBtn').addEventListener('click', () => this.quitGame());
        document.getElementById('nextLevelBtn').addEventListener('click', () => this.nextLevel());
        document.getElementById('victoryMenuBtn').addEventListener('click', () => this.showScreen('startScreen'));
        document.getElementById('retryBtn').addEventListener('click', () => this.retryLevel());
        document.getElementById('gameOverMenuBtn').addEventListener('click', () => this.showScreen('startScreen'));
    }

    showScreen(screenName) {
        // إخفاء جميع الشاشات
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // إظهار الشاشة المطلوبة
        document.getElementById(screenName).classList.add('active');

        // تحديث البيانات في الشاشة
        this.updateScreenData(screenName);
        
        this.audioManager.playSound('button');
    }

    updateScreenData(screenName) {
        switch(screenName) {
            case 'upgradesScreen':
                this.updateUpgradesScreen();
                break;
            case 'shipsScreen':
                this.updateShipsScreen();
                break;
            case 'rewardsScreen':
                this.updateRewardsScreen();
                break;
            case 'levelSelectScreen':
                this.updateLevelSelectScreen();
                break;
        }
    }

    updateUI() {
        // تحديث العملات والأحجار الكريمة في جميع الشاشات
        const coinsElements = document.querySelectorAll('#totalCoins, #shipsCoins, #upgradesCoins, #gameCoins');
        const gemsElements = document.querySelectorAll('#totalGems, #shipsGems, #upgradesGems, #gameGems');
        
        coinsElements.forEach(el => el.textContent = this.gameState.coins);
        gemsElements.forEach(el => el.textContent = this.gameState.gems);
    }

    updateUpgradesScreen() {
        document.getElementById('weaponLevel').textContent = this.gameState.upgrades.weapon;
        document.getElementById('fireRateLevel').textContent = this.gameState.upgrades.fireRate;
        document.getElementById('shieldLevel').textContent = this.gameState.upgrades.shield;
        document.getElementById('healthLevel').textContent = this.gameState.upgrades.health;

        // تحديث أسعار الترقيات
        const upgradeButtons = document.querySelectorAll('.upgrade-btn');
        upgradeButtons.forEach(btn => {
            const upgradeType = btn.dataset.upgrade;
            const cost = this.calculateUpgradeCost(upgradeType);
            btn.innerHTML = `ترقية (💰 ${cost})`;
            btn.disabled = this.gameState.coins < cost;
        });
    }

    updateShipsScreen() {
        this.shipsManager.generateShipsDisplay();
    }

    updateRewardsScreen() {
        this.updateDailyRewardStatus();
        document.getElementById('upgradeCommission').textContent = this.gameState.commissions.upgrade;
        document.getElementById('purchaseCommission').textContent = this.gameState.commissions.purchase;
        
        const claimBtn = document.getElementById('claimCommissions');
        claimBtn.disabled = this.gameState.commissions.upgrade === 0 && this.gameState.commissions.purchase === 0;
    }

    updateLevelSelectScreen() {
        this.generateLevels();
    }

    generateLevels() {
        const levelGrid = document.getElementById('levelGrid');
        levelGrid.innerHTML = '';

        for (let i = 1; i <= 100; i++) {
            const levelBtn = document.createElement('button');
            levelBtn.className = 'level-btn';
            levelBtn.innerHTML = `
                <span class="level-number">${i}</span>
                <div class="level-stars">${this.getLevelStars(i)}</div>
            `;
            levelBtn.dataset.level = i;

            if (i > this.gameState.unlockedLevels) {
                levelBtn.classList.add('locked');
                levelBtn.innerHTML = '<span>🔒</span>';
            } else if (i < this.gameState.currentLevel) {
                levelBtn.classList.add('completed');
            }

            if (i <= this.gameState.unlockedLevels) {
                levelBtn.addEventListener('click', () => this.startLevel(i));
            }

            levelGrid.appendChild(levelBtn);
        }
    }

    getLevelStars(level) {
        // محاكاة نظام النجوم (يمكن تطويره لاحقاً)
        const stars = Math.min(3, Math.floor(Math.random() * 4));
        return '★'.repeat(stars) + '☆'.repeat(3 - stars);
    }

    calculateUpgradeCost(upgradeType) {
        const baseCosts = {
            weapon: 50,
            fireRate: 75,
            shield: 100,
            health: 150
        };
        const currentLevel = this.gameState.upgrades[upgradeType];
        return baseCosts[upgradeType] * Math.pow(1.5, currentLevel - 1);
    }

    purchaseUpgrade(upgradeType) {
        const cost = this.calculateUpgradeCost(upgradeType);
        
        if (this.gameState.coins >= cost) {
            this.gameState.coins -= cost;
            this.gameState.upgrades[upgradeType]++;
            
            // إضافة عمولة
            this.gameState.commissions.upgrade += Math.floor(cost * 0.1);
            
            this.saveGame();
            this.updateUI();
            this.updateUpgradesScreen();
            this.audioManager.playSound('upgrade');
            
            // تأثير مرئي
            this.showFloatingText('+💰' + Math.floor(cost * 0.1), 'commission');
        }
    }

    claimDailyReward() {
        const today = new Date().toDateString();
        const lastClaimed = this.gameState.dailyReward.lastClaimed;
        
        if (lastClaimed !== today) {
            const isConsecutive = lastClaimed === new Date(Date.now() - 86400000).toDateString();
            const streak = isConsecutive ? this.gameState.dailyReward.streak + 1 : 1;
            const reward = 100 + (streak * 50);
            
            this.gameState.coins += reward;
            this.gameState.dailyReward.lastClaimed = today;
            this.gameState.dailyReward.streak = streak;
            
            this.saveGame();
            this.updateRewardsScreen();
            this.updateUI();
            this.audioManager.playSound('coin');
            
            this.showFloatingText(`+💰${reward} (تتابع: ${streak})`, 'reward');
        }
    }

    claimCommissions() {
        const totalCommission = this.gameState.commissions.upgrade + this.gameState.commissions.purchase;
        if (totalCommission > 0) {
            this.gameState.coins += this.gameState.commissions.upgrade;
            this.gameState.gems += this.gameState.commissions.purchase;
            
            this.showFloatingText(`+💰${this.gameState.commissions.upgrade} +💎${this.gameState.commissions.purchase}`, 'commission');
            
            this.gameState.commissions.upgrade = 0;
            this.gameState.commissions.purchase = 0;
            
            this.saveGame();
            this.updateUI();
            this.updateRewardsScreen();
            this.audioManager.playSound('coin');
        }
    }

    updateDailyRewardStatus() {
        const statusElement = document.getElementById('dailyRewardStatus');
        const claimButton = document.getElementById('claimDailyReward');
        const today = new Date().toDateString();
        
        if (this.gameState.dailyReward.lastClaimed === today) {
            statusElement.textContent = `تم الجمع اليوم! تتابع: ${this.gameState.dailyReward.streak}`;
            claimButton.disabled = true;
            claimButton.textContent = 'تم الجمع';
        } else {
            const reward = 100 + (this.gameState.dailyReward.streak * 50);
            statusElement.textContent = `جاهزة للجمع! ${reward} 💰 - تتابع: ${this.gameState.dailyReward.streak + 1}`;
            claimButton.disabled = false;
            claimButton.textContent = `🎁 جمع المكافأة (💰${reward})`;
        }
    }

    startLevel(level) {
        this.gameState.currentLevel = level;
        this.showScreen('gameScreen');
        this.game = new Game(this);
    }

    pauseGame() {
        if (this.game) {
            this.game.togglePause();
        }
    }

    quitGame() {
        if (this.game) {
            this.game.cleanup();
        }
        this.showScreen('startScreen');
    }

    nextLevel() {
        const nextLevel = this.gameState.currentLevel + 1;
        if (nextLevel > this.gameState.unlockedLevels) {
            this.gameState.unlockedLevels = nextLevel;
        }
        this.startLevel(nextLevel);
    }

    retryLevel() {
        this.startLevel(this.gameState.currentLevel);
    }

    showFloatingText(text, type = 'normal') {
        const floatingText = document.createElement('div');
        floatingText.className = `floating-text ${type}`;
        floatingText.textContent = text;
        floatingText.style.position = 'fixed';
        floatingText.style.top = '50%';
        floatingText.style.left = '50%';
        floatingText.style.transform = 'translate(-50%, -50%)';
        floatingText.style.zIndex = '1000';
        floatingText.style.fontSize = '24px';
        floatingText.style.fontWeight = 'bold';
        floatingText.style.color = type === 'commission' ? '#ffd54f' : '#4fc3f7';
        floatingText.style.textShadow = '0 2px 10px rgba(0,0,0,0.8)';
        floatingText.style.animation = 'floatUp 2s ease-out forwards';

        document.body.appendChild(floatingText);

        setTimeout(() => {
            floatingText.remove();
        }, 2000);
    }

    resetGame() {
        if (confirm('هل أنت متأكد من إعادة تعيين اللعبة؟ سيتم فقدان كل التقدم.')) {
            localStorage.removeItem('galaxyAttackSave');
            location.reload();
        }
    }

    addCoins(amount) {
        this.gameState.coins += amount;
        this.updateUI();
        this.audioManager.playSound('coin');
    }

    addGems(amount) {
        this.gameState.gems += amount;
        this.updateUI();
        this.audioManager.playSound('coin');
    }
}

// إضافة أنميشن للنص العائم
const floatUpStyles = `
@keyframes floatUp {
    0% {
        opacity: 1;
        transform: translate(-50%, -50%);
    }
    100% {
        opacity: 0;
        transform: translate(-50%, -100px);
    }
}

.floating-text {
    pointer-events: none;
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = floatUpStyles;
document.head.appendChild(styleSheet);

// بدء اللعبة عند تحميل الصفحة
window.addEventListener('load', () => {
    window.game = new GalaxyAttack();
});
