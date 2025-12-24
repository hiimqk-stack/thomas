// Aggressive iframe blocker - prevents any fin-ro.com or RequestHelper iframes
console.log('🚫 Iframe blocker loading...');

// Block list
const BLOCKED_DOMAINS = ['fin-ro.com', 'sport.grndspr2.com'];

// Function to check and remove blocked iframes
function removeBlockedIframes() {
    const allIframes = document.querySelectorAll('iframe');
    let removedCount = 0;
    
    allIframes.forEach(iframe => {
        const src = iframe.src || iframe.getAttribute('src') || '';
        const shouldBlock = BLOCKED_DOMAINS.some(domain => src.includes(domain));
        
        if (shouldBlock) {
            console.log('🚫 Blocked and removed iframe:', src);
            iframe.remove();
            removedCount++;
        }
    });
    
    if (removedCount > 0) {
        console.log(`✅ Removed ${removedCount} blocked iframe(s)`);
    }
}

// Run immediately
removeBlockedIframes();

// Watch for new iframes being added
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeName === 'IFRAME') {
                const src = node.src || node.getAttribute('src') || '';
                const shouldBlock = BLOCKED_DOMAINS.some(domain => src.includes(domain));
                
                if (shouldBlock) {
                    console.log('🚫 Blocked dynamic iframe creation:', src);
                    node.remove();
                }
            }
            // Check children for iframes too
            if (node.querySelectorAll) {
                const iframes = node.querySelectorAll('iframe');
                iframes.forEach(iframe => {
                    const src = iframe.src || iframe.getAttribute('src') || '';
                    const shouldBlock = BLOCKED_DOMAINS.some(domain => src.includes(domain));
                    
                    if (shouldBlock) {
                        console.log('🚫 Blocked nested iframe:', src);
                        iframe.remove();
                    }
                });
            }
        });
    });
});

// Start observing
observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});

// Also check periodically as a fallback
setInterval(removeBlockedIframes, 1000);

console.log('✅ Iframe blocker active - monitoring for blocked domains');
