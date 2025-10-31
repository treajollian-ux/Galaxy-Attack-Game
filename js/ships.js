class ShipsManager {
    constructor(main) {
        this.main = main;
        this.ships = this.initializeShips();
        this.setupShips();
    }

    initializeShips() {
        return [
            {
                id: 'basic',
                name: 'الطائرة الأساسية',
                icon: '🚀',
                price: 0,
                currency: 'coins',
                unlocked: true,
                stats: {
                    health: 100,
                    speed: 8,
                    damage: 25,
                    fireRate: 300
                },
                description: 'طائرة بدائية مناسبة للمبتدئين'
            },
            {
                id: 'fighter',
                name: 'المقاتلة السريعة',
                icon: '🛸',
                price: 500,
                currency: 'coins',
                unlocked: false,
                stats: {
                    health: 80,
                    speed: 12,
                    damage: 20,
                    fireRate: 200
                },
                description: 'طائرة سريعة ذات معدل إطلاق نار عالي'
            },
            {
                id: 'tank',
                name: 'الدبابة الفضائية',
                icon: '🛡️',
                price: 800,
                currency: 'coins',
                unlocked: false,
                stats: {
                    health: 200,
                    speed: 5,
                    damage: 35,
                    fireRate: 500
                },
                description: 'طائرة دفاعية ذات صحة عالية'
            },
            {
                id: 'sniper',
                name: 'القناصة',
                icon: '🎯',
                price: 1200,
                currency: 'coins',
                unlocked: false,
                stats: {
                    health: 90,
                    speed: 7,
                    damage: 60,
                    fireRate: 600
                },
                description: 'طائرة ذات قوة نارية هائلة ولكن بطيئة'
            },
            {
                id: 'legendary',
                name: 'الأسطورية',
                icon: '👑',
                price: 50,
                currency: 'gems',
                unlocked: false,
                stats: {
                    health: 150,
                    speed: 10,
                    damage: 45,
                    fireRate: 250
                },
                description: 'طائرة أسطورية متوازنة في جميع النواحي'
            },
            {
                id: 'ultimate',
                name: 'النهائية',
                icon: '💫',
                price: 100,
                currency: 'gems',
                unlocked: false,
                stats: {
                    health: 180,
                    speed: 9,
                    damage: 55,
                    fireRate: 180
                },
                description: 'أقوى طائرة في الأسطول'
            }
        ];
    }

    setupShips() {
        this.main.gameState.ships = this.main.gameState.ships || {
            unlocked: ['basic'],
            selected: 'basic'
        };

        // تأكد من أن السفن المفتوحة محفوظة بشكل صحيح
        this.ships.forEach(ship => {
            if (this.main.gameState.ships.unlocked.includes(ship.id)) {
                ship.unlocked = true;
            }
        });
    }

    generateShipsDisplay() {
        const shipsContainer = document.getElementById('shipsContainer');
        if (!shipsContainer) return;

        shipsContainer.innerHTML = '';

        this.ships.forEach(ship => {
            const shipCard = document.createElement('div');
            shipCard.className = `ship-card ${ship.unlocked ? '' : 'locked'} ${this.main.gameState.ships.selected === ship.id ? 'selected' : ''}`;
            shipCard.dataset.shipId = ship.id;

            shipCard.innerHTML = `
                <div class="ship-icon">${ship.icon}</div>
                <h3>${ship.name}</h3>
                <p>${ship.description}</p>
                <div class="ship-stats">
                    <div>❤️ ${ship.stats.health}</div>
                    <div>⚡ ${ship.stats.speed}</div>
                    <div>💥 ${ship.stats.damage}</div>
                    <div>🎯 ${ship.stats.fireRate}ms</div>
                </div>
                ${!ship.unlocked ? 
                    `<div class="ship-price">
                        ${ship.currency === 'coins' ? '💰' : '💎'} ${ship.price}
                    </div>
                    <button class="buy-btn" onclick="game.shipsManager.purchaseShip('${ship.id}')" 
                            ${this.canPurchaseShip(ship) ? '' : 'disabled'}>
                        شراء
                    </button>` : 
                    `<button class="select-btn" onclick="game.shipsManager.selectShip('${ship.id}')"
                            ${this.main.gameState.ships.selected === ship.id ? 'disabled' : ''}>
                        ${this.main.gameState.ships.selected === ship.id ? 'محددة' : 'اختيار'}
                    </button>`
                }
            `;

            shipsContainer.appendChild(shipCard);
        });
    }

    canPurchaseShip(ship) {
        if (ship.currency === 'coins') {
            return this.main.gameState.coins >= ship.price;
        } else {
            return this.main.gameState.gems >= ship.price;
        }
    }

    purchaseShip(shipId) {
        const ship = this.ships.find(s => s.id === shipId);
        if (!ship || ship.unlocked) return;

        if (this.canPurchaseShip(ship)) {
            if (ship.currency === 'coins') {
                this.main.gameState.coins -= ship.price;
            } else {
                this.main.gameState.gems -= ship.price;
            }

            this.unlockShip(shipId);
            
            // إضافة عمولة شراء
            this.main.gameState.commissions.purchase += Math.floor(ship.price * 0.05);
            
            this.main.saveGame();
            this.main.updateUI();
            this.generateShipsDisplay();
            this.main.audioManager.playSound('upgrade');
            
            this.main.showFloatingText(`+💎${Math.floor(ship.price * 0.05)}`, 'commission');
        }
    }

    unlockShip(shipId) {
        const ship = this.ships.find(s => s.id === shipId);
        if (ship) {
            ship.unlocked = true;
            this.main.gameState.ships.unlocked.push(shipId);
            this.selectShip(shipId); // اختيار الطائرة تلقائياً بعد الشراء
        }
    }

    selectShip(shipId) {
        if (this.main.gameState.ships.unlocked.includes(shipId)) {
            this.main.gameState.ships.selected = shipId;
            this.main.saveGame();
            this.generateShipsDisplay();
            this.main.audioManager.playSound('button');
        }
    }

    getSelectedShip() {
        return this.ships.find(ship => ship.id === this.main.gameState.ships.selected);
    }

    getSelectedShipStats() {
        const ship = this.getSelectedShip();
        return ship ? ship.stats : this.ships[0].stats;
    }
}
