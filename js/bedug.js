// حل طارئ لإخفاء شاشة التحميل
setTimeout(() => {
    const loading = document.getElementById('loadingScreen');
    const game = document.getElementById('gameContainer');
    const start = document.getElementById('startScreen');
    
    if (loading && loading.style.display !== 'none') {
        loading.style.display = 'none';
        if (game) game.style.display = 'block';
        if (start) start.classList.add('active');
        console.log('🔧 تم إصلاح شاشة التحميل تلقائياً');
    }
}, 2000);
