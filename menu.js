class MenuManager {
    constructor(main) {
        this.main = main;
    }

    updateAchievements() {
        const achievementsList = document.getElementById('achievementsList');
        if (!achievementsList) return;

        const achievements = [
            {
                id: 'first_kill',
                name: 'أول قتلة',
                description: 'اقتل أول عدو',
                reward: '50 💰',
                progress: this.main.gameState.achievements.first_kill.progress,
                unlocked: this.main.gameState.achievements.first_kill.unlocked
            },
            {
                id: 'coin_collector',
                name: 'جامع العملات',
                description: 'اجمع 1000 عملة',
                reward: '100 💰',
                progress: Math.min(this.main.gameState.coins, 1000),
                unlocked: this.main.gameState.achievements.coin_collector.unlocked
            },
            {
                id: 'level_master',
                name: 'سيد المستويات',
                description: 'أكمل المستوى 10',
                reward: '5 💎',
                progress: Math.min(this.main.gameState.currentLevel, 10),
                unlocked: this.main.gameState.achievements.level_master.unlocked
            }
        ];

        achievementsList.innerHTML = '';

        achievements.forEach(achievement => {
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement ${achievement.unlocked ? 'completed' : ''}`;
            
            const progressPercent = (achievement.progress / (achievement.id === 'coin_collector' ? 1000 : 10)) * 100;
            
            achievementElement.innerHTML = `
                <h4>${achievement.unlocked ? '✅ ' : ''}${achievement.name}</h4>
                <p>${achievement.description}</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
                <p class="achievement-progress">${achievement.progress}/${achievement.id === 'coin_collector' ? 1000 : 10}</p>
                <p>المكافأة: ${achievement.reward}</p>
            `;

            achievementsList.appendChild(achievementElement);
        });
    }
}
