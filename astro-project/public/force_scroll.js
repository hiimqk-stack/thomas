// AGGRESSIVE scroll protection - prevent ANY blocking
(function() {
    'use strict';
    
    // Inject CSS to override .ofh and .noscroll classes IMMEDIATELY
    const styleOverride = document.createElement('style');
    styleOverride.id = 'force-scroll-override';
    styleOverride.innerHTML = `
        .ofh, .noscroll,
        body.ofh, body.noscroll,
        html.ofh, html.noscroll {
            overflow: visible !important;
            overflow-y: auto !important;
            height: auto !important;
        }
        body {
            overflow: visible !important;
            overflow-y: auto !important;
        }
    `;
    
    // Insert immediately - even before DOM is ready
    if (document.head) {
        document.head.insertBefore(styleOverride, document.head.firstChild);
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            document.head.insertBefore(styleOverride, document.head.firstChild);
        });
    }
    
    // Force scroll enabled
    function forceScrollEnabled() {
        const html = document.documentElement;
        const body = document.body;
        
        // Remove overflow hidden classes
        if (html) {
            html.classList.remove('ofh', 'noscroll');
            html.style.overflow = 'visible !important';
            html.style.overflowY = 'auto !important';
            html.style.height = 'auto !important';
            html.style.position = 'static !important';
        }
        
        if (body) {
            body.classList.remove('ofh', 'noscroll');
            body.style.overflow = 'visible !important';
            body.style.overflowY = 'auto !important';
            body.style.height = 'auto !important';
            if (body.style.position === 'fixed') {
                body.style.position = 'static !important';
            }
            body.style.width = 'auto !important';
            body.style.top = 'auto !important';
        }
    }
    
    // Prevent preventDefault on wheel/touch events
    const allowScroll = function(e) {
        return true;
    };
    
    // Capture phase to override any listeners
    ['wheel', 'touchmove', 'scroll', 'mousewheel'].forEach(function(event) {
        window.addEventListener(event, allowScroll, { passive: true, capture: true });
        document.addEventListener(event, allowScroll, { passive: true, capture: true });
    });
    
    // Run immediately and repeatedly
    forceScrollEnabled();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', forceScrollEnabled);
    }
    
    window.addEventListener('load', forceScrollEnabled);
    
    // Re-enable scroll every 100ms (aggressive)
    setInterval(forceScrollEnabled, 100);
    
    // Monitor DOM changes
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(forceScrollEnabled);
        
        if (document.documentElement) {
            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        }
        
        if (document.body) {
            observer.observe(document.body, {
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        }
        
        // Also observe when body appears
        const bodyObserver = new MutationObserver(function() {
            if (document.body && !bodyObserved) {
                bodyObserved = true;
                observer.observe(document.body, {
                    attributes: true,
                    attributeFilter: ['style', 'class']
                });
                forceScrollEnabled();
            }
        });
        
        let bodyObserved = false;
        bodyObserver.observe(document.documentElement, { childList: true });
    }
    
    console.log('✅ AGGRESSIVE scroll protection active');
})();
