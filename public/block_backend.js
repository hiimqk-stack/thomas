// Block all backend API calls completely
(function() {
    'use strict';
    
    console.log('🚫 Backend blocker loading...');
    
    // List of URLs that should be blocked - match any domain
    const blockPatterns = [
        '/DynamicLobbyHelper',
        '/Home/GetJackpotView',
        '/login/',
        '/cdn-cgi/',
        'chat15.djqjsor4wf.com',
        'chat15.i4j4ja.com',
        'chat15.knn121gfcv.com',
        'pushengage.com',
        'googletagmanager.com',
        'service.djqjsor4wf.com',
        'sport.grndspr2.com',
        '/Scripts/Common.js',
        '/Scripts/Jackpot.js',
        '/Scripts/jackpotSlider.min.js'
    ];
    
    function shouldBlock(url) {
        if (!url) return false;
        return blockPatterns.some(pattern => url.includes(pattern));
    }
    
    // Override XMLHttpRequest
    const OriginalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new OriginalXHR();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;
        
        xhr.open = function(method, url) {
            this._url = url;
            if (shouldBlock(url)) {
                // Don't log to reduce console spam
                return;
            }
            return originalOpen.apply(this, arguments);
        };
        
        xhr.send = function() {
            if (shouldBlock(this._url)) {
                // Simulate successful empty response
                setTimeout(() => {
                    Object.defineProperty(this, 'readyState', { value: 4, writable: false });
                    Object.defineProperty(this, 'status', { value: 200, writable: false });
                    Object.defineProperty(this, 'responseText', { value: '{}', writable: false });
                    if (this.onreadystatechange) this.onreadystatechange();
                }, 0);
                return;
            }
            return originalSend.apply(this, arguments);
        };
        
        return xhr;
    };
    
    // Override fetch
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (shouldBlock(url)) {
            // Return successful empty response
            return Promise.resolve(new Response('{}', {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }));
        }
        return originalFetch.apply(this, arguments);
    };
    
    // Override jQuery AJAX
    if (typeof $ !== 'undefined' && $.ajax) {
        const originalAjax = $.ajax;
        $.ajax = function(options) {
            const url = typeof options === 'string' ? options : (options.url || '');
            
            if (shouldBlock(url)) {
                // Return successful empty response
                const deferred = $.Deferred();
                deferred.resolve({}, 'success', {
                    status: 200,
                    statusText: 'OK',
                    responseText: '{}',
                    responseJSON: {}
                });
                return deferred.promise();
            }
            
            return originalAjax.apply(this, arguments);
        };
    }
    
    console.log('✅ Backend blocker active - silently blocking problematic calls');
})();
