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
