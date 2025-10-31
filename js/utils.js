// Utility Functions
class GameUtils {
    // Format numbers with commas
    static formatNumber(num) {
        return new Intl.NumberFormat('ar-EG').format(num);
    }
    
    // Generate random number between min and max
    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Calculate distance between two points
    static distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    
    // Check collision between two rectangles
    static checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }
    
    // Clamp value between min and max
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    
    // Linear interpolation
    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    // Format time (mm:ss)
    static formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Debounce function
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Throttle function
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Deep clone object
    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    
    // Generate unique ID
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Check if device is mobile
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Preload images
    static preloadImages(urls) {
        return Promise.all(
            urls.map(url => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = url;
                });
            })
        );
    }
    
    // Create floating text element
    static createFloatingText(text, x, y, color = '#ffffff') {
        const floatingText = document.createElement('div');
        floatingText.className = 'floating-text';
        floatingText.textContent = text;
        floatingText.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            color: ${color};
            font-weight: bold;
            font-size: 16px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.8);
            pointer-events: none;
            z-index: 1000;
            animation: floatUp 1.5s ease-out forwards;
        `;
        
        document.getElementById('gameScreen').appendChild(floatingText);
        
        setTimeout(() => {
            floatingText.remove();
        }, 1500);
        
        return floatingText;
    }
    
    // Calculate upgrade cost
    static calculateUpgradeCost(baseCost, level, multiplier) {
        return Math.floor(baseCost * Math.pow(multiplier, level - 1));
    }
    
    // Get star rating based on score
    static getStarRating(score, thresholds) {
        let stars = 0;
        for (let i = 0; i < thresholds.length; i++) {
            if (score >= thresholds[i]) {
                stars = i + 1;
            }
        }
        return stars;
    }
    
    // Shuffle array
    static shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    // Create particle effect
    static createParticles(x, y, count, color) {
        const particles = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 30,
                maxLife: 30,
                color,
                alpha: 1
            });
        }
        return particles;
    }
    
    // Format currency with icons
    static formatCurrency(amount, type = 'coins') {
        const icon = type === 'coins' ? '💰' : '💎';
        return `${icon} ${this.formatNumber(amount)}`;
    }
    
    // Check if today's reward is available
    static isDailyRewardAvailable(lastClaimed) {
        if (!lastClaimed) return true;
        
        const lastClaimedDate = new Date(lastClaimed);
        const today = new Date();
        
        return (
            lastClaimedDate.getDate() !== today.getDate() ||
            lastClaimedDate.getMonth() !== today.getMonth() ||
            lastClaimedDate.getFullYear() !== today.getFullYear()
        );
    }
    
    // Calculate daily streak
    static calculateStreak(lastClaimed, currentStreak) {
        if (!lastClaimed) return 1;
        
        const lastClaimedDate = new Date(lastClaimed);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Check if last claim was yesterday
        if (
            lastClaimedDate.getDate() === yesterday.getDate() &&
            lastClaimedDate.getMonth() === yesterday.getMonth() &&
            lastClaimedDate.getFullYear() === yesterday.getFullYear()
        ) {
            return currentStreak + 1;
        }
        
        // Check if last claim was today
        if (
            lastClaimedDate.getDate() === today.getDate() &&
            lastClaimedDate.getMonth() === today.getMonth() &&
            lastClaimedDate.getFullYear() === today.getFullYear()
        ) {
            return currentStreak;
        }
        
        // Streak broken
        return 1;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameUtils;
} 
