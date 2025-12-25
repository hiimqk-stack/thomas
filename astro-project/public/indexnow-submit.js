// IndexNow API - Instant Indexing for Bing, Yandex, and other search engines
// This script automatically submits URLs to IndexNow for rapid indexing

(function() {
    'use strict';
    
    // Configuration
    const config = {
        host: 'grandpashabet7234.com',
        key: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', // Unique key for your site
        keyLocation: 'https://grandpashabet7234.com/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6.txt',
        endpoints: [
            'https://api.indexnow.org/indexnow',
            'https://www.bing.com/indexnow',
            'https://yandex.com/indexnow'
        ]
    };
    
    // Get all URLs from sitemap
    const urlsToSubmit = [
        'https://grandpashabet7234.com/',
        'https://grandpashabet7234.com/tr/lobby/casino/main.html',
        'https://grandpashabet7234.com/tr/lobby/livecasino/main.html',
        'https://grandpashabet7234.com/sport.html',
        'https://grandpashabet7234.com/sport/live.html',
        'https://grandpashabet7234.com/promotions.html',
        'https://grandpashabet7234.com/blog/',
        'https://grandpashabet7234.com/giris',
        'https://grandpashabet7234.com/uye-ol',
        'https://grandpashabet7234.com/guncel-giris',
        'https://grandpashabet7234.com/bonuslar/hosgeldin-bonusu',
        'https://grandpashabet7234.com/oyunlar/sweet-bonanza',
        'https://grandpashabet7234.com/oyunlar/gates-of-olympus',
        'https://grandpashabet7234.com/oyunlar/crazy-time',
        'https://grandpashabet7234.com/oyunlar/aviator'
    ];
    
    // Submit to IndexNow
    function submitToIndexNow() {
        const payload = {
            host: config.host,
            key: config.key,
            keyLocation: config.keyLocation,
            urlList: urlsToSubmit
        };
        
        config.endpoints.forEach(endpoint => {
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (response.ok) {
                    console.log(`✅ IndexNow submission successful to ${endpoint}`);
                } else {
                    console.log(`⚠️ IndexNow submission failed to ${endpoint}: ${response.status}`);
                }
            })
            .catch(error => {
                console.log(`❌ IndexNow submission error to ${endpoint}:`, error);
            });
        });
    }
    
    // Auto-submit on page load (only once per session)
    if (!sessionStorage.getItem('indexnow_submitted')) {
        setTimeout(() => {
            submitToIndexNow();
            sessionStorage.setItem('indexnow_submitted', 'true');
        }, 3000); // Wait 3 seconds after page load
    }
    
    // Expose function globally for manual submission
    window.submitToIndexNow = submitToIndexNow;
    
})();
