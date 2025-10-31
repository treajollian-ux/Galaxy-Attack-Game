class GalaxyAttack {
    constructor() {
        this.version = '2.0.0';
        this.isMobile = this.detectMobile();
        this.initializeGame();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    async initializeGame() {
        try {
            // تهيئة الأنظمة
            this.setupManagers();
            
            // تحميل البيانات
            await this.loadGameData();
            
            // إعداد الواجهة
            this.setupUI();
            
            // إعداد الأحداث
            this.setupEventListeners();
            
            // بدء اللعبة
            this.startGame();
            
        } catch (error) {
            console.error('فشل في تهيئة اللعبة:', error);
            this.showError('فشل في تحميل اللعبة. يرجى تحديث الصفحة.');
        }
    }

    setupManagers() {
        this.storage = new StorageManager();
        this.audio = new AudioManager();
        this.ships = new ShipsManager(this);
        this.upgrades = new UpgradesManager(this);
        this.levels = new LevelsManager(this);
        this.menu = new MenuManager(this);
    }

    async loadGameData() {
        // تحميل بيانات اللعبة
        this.gameData = await this.storage.loadGameData();
        
        // تحميل التكوينات
        this.config = await this.loadConfig();
        
        // تحميل الأصول
        await this.loadAssets();
    }

    setupUI() {
        this.updateAllUI();
        this.generateLevelsGrid();
        this.setupMobileControls();
    }

    setupEventListeners() {
        this.setupNavigationEvents();
        this.setupGameEvents();
        this.setupTouchEvents();
    }

    startGame() {
        // إخفاء شاشة التحميل
        this.hideLoadingScreen();
        
        // تشغيل الموسيقى
        this.audio.playBackgroundMusic();
        
        // تحديث الواجهة
        this.updateDailyBonus();
        
        console.log(`🎮 Galaxy Attack ${this.version} جاهز للعب!`);
    }

    // ... المزيد من الدوال المحسنة
}

// بدء اللعبة عند تحميل الصفحة
window.addEventListener('load', () => {
    window.game = new GalaxyAttack();
});
class GalaxyAttack {
    constructor() {
        this.version = '2.0.0';
        this.isMobile = this.detectMobile();
        this.initializeGame();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    async initializeGame() {
        try {
            console.log('🚀 بدء تهيئة اللعبة...');
            
            // تهيئة الأنظمة الأساسية أولاً
            this.setupBasicManagers();
            
            // إخفاء شاشة التحميل فوراً
            this.hideLoadingScreen();
            
            // ثم تحميل باقي البيانات
            await this.loadGameData();
            this.setupUI();
            this.setupEventListeners();
            this.startGame();
            
        } catch (error) {
            console.error('❌ فشل في تهيئة اللعبة:', error);
            this.hideLoadingScreen();
            this.showError('فشل في تحميل اللعبة. يرجى تحديث الصفحة.');
        }
    }

    setupBasicManagers() {
        // تهيئة الأنظمة الأساسية فقط
        this.storage = new StorageManager();
        this.audio = new AudioManager();
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const gameContainer = document.getElementById('gameContainer');
        
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        if (gameContainer) {
            gameContainer.style.display = 'block';
        }
        
        // إظهار شاشة البداية مباشرة
        this.showScreen('startScreen');
        console.log('✅ تم إخفاء شاشة التحميل');
    }

    async loadGameData() {
        try {
            console.log('📁 جاري تحميل بيانات اللعبة...');
            this.gameData = await this.storage.loadGameData();
            console.log('✅ تم تحميل بيانات اللعبة');
        } catch (error) {
            console.error('❌ خطأ في تحميل البيانات:', error);
            this.gameData = this.getDefaultGameData();
        }
    }

    getDefaultGameData() {
        return {
            player: {
                coins: 1000,
                gems: 50,
                level: 1
            },
            progress: {
                currentLevel: 1,
                unlockedLevels: 1
            },
            ships: {
                unlocked: ['basic'],
                selected: 'basic'
            },
            upgrades: {
                weapon: 1,
                fireRate: 1,
                shield: 1,
                health: 1
            }
        };
    }

    setupUI() {
        this.updateUI();
        this.generateLevelsGrid();
        if (this.isMobile) {
            this.setupMobileControls();
        }
    }

    setupEventListeners() {
        this.setupNavigationEvents();
        this.setupGameEvents();
    }

    startGame() {
        console.log('🎮 اللعبة جاهزة للعب!');
        this.updateDailyBonus();
    }

    showScreen(screenName) {
        try {
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            
            const targetScreen = document.getElementById(screenName);
            if (targetScreen) {
                targetScreen.classList.add('active');
            }
        } catch (error) {
            console.error('❌ خطأ في إظهار الشاشة:', error);
        }
    }

    updateUI() {
        // تحديث العملات والعناصر الأساسية فقط
        const coinsElements = document.querySelectorAll('#totalCoins, #shipsCoins, #upgradesCoins, #gameCoins');
        const gemsElements = document.querySelectorAll('#totalGems, #shipsGems, #upgradesGems, #gameGems');
        
        coinsElements.forEach(el => {
            if (el) el.textContent = this.gameData.player.coins;
        });
        gemsElements.forEach(el => {
            if (el) el.textContent = this.gameData.player.gems;
        });
    }

    setupNavigationEvents() {
        // الأزرار الأساسية فقط
        const startBtn = document.getElementById('startBtn');
        const backBtns = document.querySelectorAll('.back-btn');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => this.showScreen('levelSelectScreen'));
        }
        
        backBtns.forEach(btn => {
            btn.addEventListener('click', () => this.showScreen('startScreen'));
        });

        // الأيقونات السريعة
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const screen = e.target.closest('.quick-btn').dataset.screen;
                this.showScreen(screen + 'Screen');
            });
        });
    }

    setupGameEvents() {
        // الأحداث الأساسية للعبة
        const pauseBtn = document.getElementById('pauseBtn');
        const quitBtn = document.getElementById('quitBtn');
        
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pauseGame());
        }
        if (quitBtn) {
            quitBtn.addEventListener('click', () => this.quitGame());
        }
    }

    generateLevelsGrid() {
        const levelGrid = document.getElementById('levelGrid');
        if (!levelGrid) return;

        levelGrid.innerHTML = '';
        
        for (let i = 1; i <= 20; i++) { // 20 مستوى فقط للبداية
            const levelBtn = document.createElement('button');
            levelBtn.className = 'level-btn';
            levelBtn.innerHTML = i.toString();
            levelBtn.addEventListener('click', () => this.startLevel(i));
            
            if (i > this.gameData.progress.unlockedLevels) {
                levelBtn.classList.add('locked');
                levelBtn.innerHTML = '🔒';
            }
            
            levelGrid.appendChild(levelBtn);
        }
    }

    setupMobileControls() {
        console.log('📱 تم تفعيل عناصر التحكم للجوال');
    }

    pauseGame() {
        console.log('⏸️ اللعبة متوقفة');
    }

    quitGame() {
        this.showScreen('startScreen');
    }

    startLevel(level) {
        console.log(`🎯 بدء المستوى ${level}`);
        this.showScreen('gameScreen');
        // سيتم إضافة منطق اللعبة لاحقاً
    }

    updateDailyBonus() {
        console.log('🎁 تحديث المكافآت اليومية');
    }

    showError(message) {
        alert(message);
    }
}

// بدء اللعبة مع معالجة الأخطاء
window.addEventListener('load', () => {
    try {
        console.log('🌌 بدء تحميل Galaxy Attack...');
        window.game = new GalaxyAttack();
    } catch (error) {
        console.error('❌ فشل تحميل اللعبة:', error);
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        document.getElementById('startScreen').classList.add('active');
    }
});
