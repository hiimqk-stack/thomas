// Suppress non-critical console errors for cleaner output
(function() {
    'use strict';
    
    // List of error messages to suppress
    const suppressPatterns = [
        'CORS policy',
        'ERR_FAILED',
        'ERR_BLOCKED_BY_ADBLOCKER',
        'ERR_CERT_AUTHORITY_INVALID',
        'Comm100API is not defined',
        'Cannot read properties of null',
        'Cannot set properties of null',
        'Jackpot',
        'appendChild',
        'pushengage',
        'googletagmanager',
        'chat15.djqjsor4wf.com',
        'chat15.i4j4ja.com',
        'chat15.knn121gfcv.com',
        'DynamicLobbyHelper',
        'Home/GetJackpotView',
        '/login/login.html',
        'cdn-cgi/challenge-platform',
        'frame-ancestors',
        'Content Security Policy',
        'sport.grndspr2.com',
        'livechat.ashx',
        'Common.js',
        'Jackpot.js',
        'jackpotSlider.min.js',
        'Refused to frame',
        'Refused to execute script',
        'MIME type',
        'has already been declared',
        'Identifier',
        'Unexpected token',
        'SyntaxError',
        '405 (Method Not Allowed)',
        'net::ERR_',
        'beacon.min.js'
    ];
    
    // Override console.error
    const originalError = console.error;
    console.error = function(...args) {
        const message = args.join(' ');
        
        // Check if this error should be suppressed
        const shouldSuppress = suppressPatterns.some(pattern => 
            message.includes(pattern)
        );
        
        if (!shouldSuppress) {
            originalError.apply(console, args);
        }
    };
    
    // Override console.warn
    const originalWarn = console.warn;
    console.warn = function(...args) {
        const message = args.join(' ');
        
        const shouldSuppress = suppressPatterns.some(pattern => 
            message.includes(pattern)
        );
        
        if (!shouldSuppress) {
            originalWarn.apply(console, args);
        }
    };
    
    // Suppress window errors for known issues
    const originalErrorHandler = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
        const msg = message ? message.toString() : '';
        
        const shouldSuppress = suppressPatterns.some(pattern => 
            msg.includes(pattern)
        );
        
        if (shouldSuppress) {
            return true; // Prevent default error handling
        }
        
        if (originalErrorHandler) {
            return originalErrorHandler.apply(this, arguments);
        }
        return false;
    };
    
    console.log('%c✓ Error suppression active', 'color: #10b981; font-weight: bold');
    console.log('%cℹ️ Suppressed: CORS, external services, backend APIs, Jackpot errors', 'color: #6b7280');
})();
