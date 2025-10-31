class Game {
    constructor(main) {
        this.main = main;
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        
        this.gameState = 'playing'; // playing, paused, gameOver, victory
        this.score = 0;
        
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.particles = [];
        this.loot = [];
        this.enemyBullets = [];
        
        this.keys = {};
        this.lastShot = 0;
        
        this.init();
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.createPlayer();
        this.spawnEnemies();
        this.setupControls();
        this.gameLoop();
        
        // تحديث واجهة اللعبة
        this.updateGameUI();
    }

    createPlayer() {
        const shipStats = this.main.shipsManager.getSelectedShipStats();
        
        this.player = {
            x: this.canvas.width / 2 - 25,
            y: this.canvas.height - 100,
            width: 50,
            height: 50,
            speed: 8,
            health: 100 + (this.main.gameState.upgrades.health * 25),
            maxHealth: 100 + (this.main.gameState.upgrades.health * 25),
            color: '#4fc3f7',
            lastShot: 0,
            fireRate: 300 - (this.main.gameState.upgrades.fireRate * 25),
            damage: 25 + (this.main.gameState.upgrades.weapon * 15),
            shield: this.main.gameState.upgrades.shield
        };
    }

    spawnEnemies() {
        const level = this.main.gameState.currentLevel;
        const enemyCount = 5 + Math.floor(level / 2) + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < enemyCount; i++) {
            this.enemies.push({
                x: Math.random() * (this.canvas.width - 60),
                y: Math.random() * 300 + 50,
                width: 40 + (level * 2),
                height: 40 + (level * 2),
                speed: 1 + (level * 0.2),
                health: 30 + (level * 8),
                maxHealth: 30 + (level * 8),
                color: this.getEnemyColor(level),
                value: 10 + (level * 3),
                type: this.getEnemyType(level),
                lastShot: 0,
                fireRate: 1500 - (level * 50)
            });
        }
    }

    getEnemyColor(level) {
        const colors = ['#ff5252', '#ff4081', '#e040fb', '#7c4dff', '#536dfe'];
        return colors[Math.min(level - 1, colors.length - 1)];
    }

    getEnemyType(level) {
        if (level < 5) return 'basic';
        if (level < 10) return 'shooter';
        if (level < 20) return 'elite';
        return 'boss';
    }

    setupControls() {
        // لوحة المفاتيح
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            if (e.key === ' ') {
                this.shoot();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        // اللمس/الفأرة
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.player.x = e.clientX - rect.left - this.player.width / 2;
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            this.player.x = e.touches[0].clientX - rect.left - this.player.width / 2;
        });

        this.canvas.addEventListener('mousedown', () => this.shoot());
        this.canvas.addEventListener('touchstart', () => this.shoot());

        // إطلاق النار التلقائي عند الضغط المستمر
        this.canvas.addEventListener('mousemove', () => {
            if (this.keys['Control']) this.shoot();
        });
    }

    update() {
        if (this.gameState !== 'playing') return;

        this.updatePlayer();
        this.updateBullets();
        this.updateEnemies();
        this.updateEnemyBullets();
        this.updateParticles();
        this.updateLoot();
        this.checkCollisions();
        this.autoShoot();
    }

    updatePlayer() {
        // حركة اللاعب
        if (this.keys['ArrowLeft'] || this.keys['a']) {
            this.player.x = Math.max(0, this.player.x - this.player.speed);
        }
        if (this.keys['ArrowRight'] || this.keys['d']) {
            this.player.x = Math.min(this.canvas.width - this.player.width, this.player.x + this.player.speed);
        }
        if (this.keys['ArrowUp'] || this.keys['w']) {
            this.player.y = Math.max(0, this.player.y - this.player.speed);
        }
        if (this.keys['ArrowDown'] || this.keys['s']) {
            this.player.y = Math.min(this.canvas.height - this.player.height, this.player.y + this.player.speed);
        }
    }

    updateBullets() {
        this.bullets = this.bullets.filter(bullet => {
            bullet.y -= bullet.speed;
            return bullet.y > -bullet.height;
        });
    }

    updateEnemyBullets() {
        this.enemyBullets = this.enemyBullets.filter(bullet => {
            bullet.y += bullet.speed;
            return bullet.y < this.canvas.height;
        });
    }

    updateEnemies() {
        this.enemies.forEach(enemy => {
            // حركة الأعداء
            if (enemy.type === 'basic') {
                enemy.y += enemy.speed;
            } else if (enemy.type === 'shooter') {
                enemy.y += enemy.speed * 0.7;
                enemy.x += Math.sin(Date.now() * 0.002) * 2;
            } else if (enemy.type === 'elite') {
                enemy.y += enemy.speed * 0.5;
                enemy.x += Math.sin(Date.now() * 0.003 + enemy.y * 0.01) * 3;
            }

            // إطلاق النار من الأعداء
            if (enemy.type !== 'basic' && Date.now() - enemy.lastShot > enemy.fireRate) {
                this.enemyShoot(enemy);
                enemy.lastShot = Date.now();
            }

            // إعادة الظهور إذا خرج من الأسفل
            if (enemy.y > this.canvas.height) {
                enemy.y = -enemy.height;
                enemy.x = Math.random() * (this.canvas.width - enemy.width);
            }
        });
    }

    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            particle.alpha = particle.life / particle.maxLife;
            return particle.life > 0;
        });
    }

    updateLoot() {
        this.loot = this.loot.filter(item => {
            item.y += item.speed;
            return item.y < this.canvas.height;
        });
    }

    autoShoot() {
        if (this.keys['Control'] && Date.now() - this.player.lastShot > this.player.fireRate) {
            this.shoot();
        }
    }

    shoot() {
        if (Date.now() - this.player.lastShot > this.player.fireRate) {
            this.bullets.push({
                x: this.player.x + this.player.width / 2 - 2.5,
                y: this.player.y,
                width: 5,
                height: 15,
                speed: 12,
                damage: this.player.damage,
                color: '#4fc3f7'
            });

            this.player.lastShot = Date.now();
            this.main.audioManager.playSound('shoot');
        }
    }

    enemyShoot(enemy) {
        this.enemyBullets.push({
            x: enemy.x + enemy.width / 2 - 2.5,
            y: enemy.y + enemy.height,
            width: 5,
            height: 15,
            speed: 6,
            damage: 10 + (this.main.gameState.currentLevel * 2),
            color: '#ff5252'
        });
    }

    checkCollisions() {
        // تصادم الرصاص مع الأعداء
        this.bullets.forEach((bullet, bulletIndex) => {
            this.enemies.forEach((enemy, enemyIndex) => {
                if (this.isColliding(bullet, enemy)) {
                    // إصابة العدو
                    enemy.health -= bullet.damage;
                    this.bullets.splice(bulletIndex, 1);
                    
                    this.createExplosion(bullet.x, bullet.y, '#4fc3f7');
                    
                    if (enemy.health <= 0) {
                        this.score += enemy.value;
                        this.main.addCoins(enemy.value);
                        
                        // فرصة إسقاط غنائم
                        this.createLoot(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
                        
                        this.enemies.splice(enemyIndex, 1);
                        this.main.audioManager.playSound('explosion');
                        
                        // فحص الإنجازات
                        this.checkAchievements();
                    }
                }
            });
        });

        // تصادم رصاص الأعداء مع اللاعب
        this.enemyBullets.forEach((bullet, bulletIndex) => {
            if (this.isColliding(bullet, this.player)) {
                const damage = Math.max(5, bullet.damage - this.player.shield);
                this.player.health -= damage;
                this.enemyBullets.splice(bulletIndex, 1);
                this.createExplosion(bullet.x, bullet.y, '#ff5252');
                
                if (this.player.health <= 0) {
                    this.gameOver();
                }
                
                this.updateGameUI();
            }
        });

        // تصادم الأعداء مع اللاعب
        this.enemies.forEach((enemy, enemyIndex) => {
            if (this.isColliding(enemy, this.player)) {
                this.player.health -= 30;
                this.enemies.splice(enemyIndex, 1);
                this.createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#ff9800');
                
                if (this.player.health <= 0) {
                    this.gameOver();
                }
                
                this.updateGameUI();
            }
        });

        // جمع الغنائم
        this.loot.forEach((item, itemIndex) => {
            if (this.isColliding(item, this.player)) {
                if (item.type === 'coin') {
                    this.main.addCoins(item.value);
                    this.showFloatingText(`+💰${item.value}`, 'coin');
                } else if (item.type === 'gem') {
                    this.main.addGems(item.value);
                    this.showFloatingText(`+💎${item.value}`, 'gem');
                } else if (item.type === 'health') {
                    this.player.health = Math.min(this.player.maxHealth, this.player.health + 30);
                    this.showFloatingText('+❤️', 'health');
                }
                
                this.loot.splice(itemIndex, 1);
                this.updateGameUI();
            }
        });

        // فوز بالمستوى
        if (this.enemies.length === 0 && this.gameState === 'playing') {
            this.victory();
        }
    }

    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    createExplosion(x, y, color) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 30,
                maxLife: 30,
                color: color,
                alpha: 1
            });
        }
    }

    createLoot(x, y) {
        const lootTypes = [
            { type: 'coin', chance: 0.6, value: 5, color: '#ffd54f' },
            { type: 'coin', chance: 0.3, value: 10, color: '#ffd54f' },
            { type: 'gem', chance: 0.1, value: 1, color: '#e91e63' },
            { type: 'health', chance: 0.2, value: 0, color: '#4caf50' }
        ];

        lootTypes.forEach(loot => {
            if (Math.random() < loot.chance) {
                this.loot.push({
                    x: x,
                    y: y,
                    width: 20,
                    height: 20,
                    speed: 2,
                    type: loot.type,
                    value: loot.value,
                    color: loot.color
                });
            }
        });
    }

    render() {
        // مسح Canvas
        this.ctx.fillStyle = 'rgba(12, 12, 46, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // رسم الخلفية
        this.drawBackground();

        // رسم الكائنات
        this.drawLoot();
        this.drawParticles();
        this.drawPlayer();
        this.drawEnemies();
        this.drawBullets();
        this.drawEnemyBullets();
    }

    drawBackground() {
        // النجوم
        this.ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 50; i++) {
            this.ctx.fillRect(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                2, 2
            );
        }
    }

    drawPlayer() {
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // الدرع
        if (this.player.shield > 0) {
            this.ctx.strokeStyle = 'rgba(79, 195, 247, 0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                this.player.x - 5, 
                this.player.y - 5, 
                this.player.width + 10, 
                this.player.height + 10
            );
        }
    }

    drawEnemies() {
        this.enemies.forEach(enemy => {
            this.ctx.fillStyle = enemy.color;
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            
            // شريط الصحة
            const healthPercent = enemy.health / enemy.maxHealth;
            this.ctx.fillStyle = '#ff5252';
            this.ctx.fillRect(enemy.x, enemy.y - 10, enemy.width * healthPercent, 5);
        });
    }

    drawBullets() {
        this.bullets.forEach(bullet => {
            this.ctx.fillStyle = bullet.color;
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
    }

    drawEnemyBullets() {
        this.enemyBullets.forEach(bullet => {
            this.ctx.fillStyle = bullet.color;
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(particle.x, particle.y, 4, 4);
            this.ctx.restore();
        });
    }

    drawLoot() {
        this.loot.forEach(item => {
            this.ctx.fillStyle = item.color;
            this.ctx.fillRect(item.x, item.y, item.width, item.height);
        });
    }

    gameLoop() {
        this.update();
        this.render();
        
        if (this.gameState === 'playing' || this.gameState === 'paused') {
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    updateGameUI() {
        document.getElementById('currentLevel').textContent = this.main.gameState.currentLevel;
        document.getElementById('currentScore').textContent = this.score;
        
        const healthPercent = (this.player.health / this.player.maxHealth) * 100;
        document.getElementById('healthFill').style.width = healthPercent + '%';
    }

    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseBtn').textContent = '▶️';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pauseBtn').textContent = '⏸️';
            this.gameLoop();
        }
    }

    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('gameOverLevel').textContent = this.main.gameState.currentLevel;
        document.getElementById('gameOverScore').textContent = this.score;
        this.main.showScreen('gameOverScreen');
        this.main.audioManager.playSound('gameOver');
    }

    victory() {
        this.gameState = 'victory';
        const coinsEarned = 50 + (this.main.gameState.currentLevel * 15);
        const gemsEarned = Math.random() < 0.3 ? 1 : 0;
        
        this.main.addCoins(coinsEarned);
        if (gemsEarned > 0) {
            this.main.addGems(gemsEarned);
        }
        
        document.getElementById('victoryLevel').textContent = this.main.gameState.currentLevel;
        document.getElementById('victoryScore').textContent = this.score;
        document.getElementById('coinsEarned').textContent = coinsEarned;
        document.getElementById('gemsEarned').textContent = gemsEarned;
        
        if (this.main.gameState.currentLevel === this.main.gameState.unlockedLevels) {
            this.main.gameState.unlockedLevels++;
        }
        
        this.main.saveGame();
        this.main.showScreen('victoryScreen');
        this.main.audioManager.playSound('victory');
    }

    checkAchievements() {
        // يمكن إضافة منطق الإنجازات هنا
    }

    showFloatingText(text, type) {
        const colors = {
            coin: '#ffd54f',
            gem: '#e91e63',
            health: '#4caf50',
            normal: '#4fc3f7'
        };

        const floatingText = document.createElement('div');
        floatingText.className = 'floating-text';
        floatingText.textContent = text;
        floatingText.style.position = 'absolute';
        floatingText.style.left = this.player.x + 'px';
        floatingText.style.top = this.player.y + 'px';
        floatingText.style.color = colors[type] || colors.normal;
        floatingText.style.fontWeight = 'bold';
        floatingText.style.fontSize = '16px';
        floatingText.style.textShadow = '0 2px 4px rgba(0,0,0,0.8)';
        floatingText.style.pointerEvents = 'none';
        floatingText.style.zIndex = '1000';
        floatingText.style.animation = 'floatUp 1.5s ease-out forwards';

        document.getElementById('gameScreen').appendChild(floatingText);

        setTimeout(() => {
            floatingText.remove();
        }, 1500);
    }

    cleanup() {
        // تنظيف الموارد
        this.gameState = 'gameOver';
    }
}
