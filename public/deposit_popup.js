// Deposit Popup System - Para Yatır
(function() {
    'use strict';
    
    console.log('💰 Deposit popup system loading...');
    
    // Wait for Firebase to be ready
    if (typeof firebase === 'undefined') {
        console.error('Firebase not loaded! Make sure firebase scripts are included.');
    }
    
    // Minimal CSS for deposit popup
    const depositStyles = `
        <style id="gp-deposit-styles">
            #gp-deposit-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                z-index: 99999;
                justify-content: center;
                align-items: center;
                backdrop-filter: blur(5px);
            }
            
            #gp-deposit-modal {
                width: 700px;
                max-width: 95%;
                max-height: 90vh;
                overflow-y: auto;
                animation: slideDown 0.3s ease-out;
            }
            
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .deposit-tabs {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
            }
            
            .deposit-tab {
                flex: 1;
                padding: 14px 20px;
                background: #2B350B;
                border: 2px solid transparent;
                border-radius: 8px;
                color: #B8B8B8;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                text-align: center;
            }
            
            .deposit-tab:hover {
                background: #3d5239;
            }
            
            .deposit-tab.active {
                background: #D0B752;
                color: #000;
                border-color: #D0B752;
            }
            
            .deposit-section {
                display: none;
            }
            
            .deposit-section.active {
                display: block;
            }
            
            .account-card {
                background: #2B350B;
                border: 1px solid rgba(201, 169, 97, 0.3);
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 15px;
            }
            
            .account-card h3 {
                color: #D0B752;
                font-size: 16px;
                margin: 0 0 15px 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .account-info {
                display: grid;
                grid-template-columns: 140px 1fr;
                gap: 10px;
                color: #fff;
                font-size: 14px;
            }
            
            .account-label {
                color: #B8B8B8;
                font-weight: 600;
            }
            
            .account-value {
                color: #fff;
                font-weight: 400;
                word-break: break-all;
            }
            
            .copy-btn {
                background: #D0B752;
                color: #000;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                margin-left: 10px;
            }
            
            .copy-btn:hover {
                background: #e4cb66;
                transform: translateY(-1px);
            }
            
            .deposit-note {
                background: rgba(201, 169, 97, 0.1);
                border-left: 3px solid #D0B752;
                padding: 15px;
                margin-top: 20px;
                border-radius: 4px;
                color: #B8B8B8;
                font-size: 13px;
                line-height: 1.6;
            }
            
            .deposit-note strong {
                color: #D0B752;
            }
        </style>
    `;
    
    // Load bank data from Firebase
    function getBankDataFromFirebase(callback) {
        console.log('💰 Attempting to load bank data from Firebase...');
        
        // Wait for Firebase to be ready
        function waitForFirebase(attempts = 0) {
            if (typeof firebase !== 'undefined' && firebase.database) {
                console.log('✅ Firebase is ready, fetching bank data...');
                const bankDataRef = firebase.database().ref('bankData');
                bankDataRef.once('value').then(function(snapshot) {
                    const data = snapshot.val();
                    if (data) {
                        console.log('✅ Bank data loaded from Firebase:', Object.keys(data).length, 'banks');
                        callback(data);
                    } else {
                        console.warn('⚠️ No data in Firebase, using defaults');
                        callback(getDefaultBankData());
                    }
                }).catch(function(error) {
                    console.error('❌ Firebase read error:', error);
                    callback(getDefaultBankData());
                });
            } else if (attempts < 20) {
                // Wait 100ms and retry (max 2 seconds)
                console.log('⏳ Waiting for Firebase... attempt', attempts + 1);
                setTimeout(function() {
                    waitForFirebase(attempts + 1);
                }, 100);
            } else {
                // Firebase not available after 2 seconds, use defaults
                console.warn('⚠️ Firebase not initialized after 2s, using default bank data');
                callback(getDefaultBankData());
            }
        }
        
        waitForFirebase();
    }
    
    // Default bank data
    function getDefaultBankData() {
        return {
            bank1: { owner: 'GRANDPASHABET LTD', iban: 'TR33 0001 0012 3456 7890 1234 56' },
            bank2: { owner: 'GRANDPASHABET LTD', iban: 'TR44 0006 2000 1234 5678 9012 34' },
            bank3: { owner: 'GRANDPASHABET LTD', iban: 'TR55 0006 4000 0011 2233 4455 66' }
        };
    }
    
    // Generate bank section HTML dynamically
    function generateBankSectionHTML(bankData) {
        
        return `
            <div class="account-card">
                <h3>🏦 Ziraat Bankası</h3>
                <div class="account-info">
                    <span class="account-label">Hesap Sahibi:</span>
                    <span class="account-value">${bankData.bank1.owner}</span>
                    
                    <span class="account-label">IBAN:</span>
                    <span class="account-value">
                        ${bankData.bank1.iban}
                        <button class="copy-btn" onclick="copyToClipboard('${bankData.bank1.iban.replace(/\s/g, '')}')">Kopyala</button>
                    </span>
                    
                    <span class="account-label">Şube Kodu:</span>
                    <span class="account-value">1234</span>
                    
                    <span class="account-label">Hesap No:</span>
                    <span class="account-value">98765432</span>
                </div>
            </div>
            
            <div class="account-card">
                <h3>🏦 Garanti BBVA</h3>
                <div class="account-info">
                    <span class="account-label">Hesap Sahibi:</span>
                    <span class="account-value">${bankData.bank2.owner}</span>
                    
                    <span class="account-label">IBAN:</span>
                    <span class="account-value">
                        ${bankData.bank2.iban}
                        <button class="copy-btn" onclick="copyToClipboard('${bankData.bank2.iban.replace(/\s/g, '')}')">Kopyala</button>
                    </span>
                    
                    <span class="account-label">Şube Kodu:</span>
                    <span class="account-value">2000</span>
                    
                    <span class="account-label">Hesap No:</span>
                    <span class="account-value">12345678</span>
                </div>
            </div>
            
            <div class="account-card">
                <h3>🏦 İş Bankası</h3>
                <div class="account-info">
                    <span class="account-label">Hesap Sahibi:</span>
                    <span class="account-value">${bankData.bank3.owner}</span>
                    
                    <span class="account-label">IBAN:</span>
                    <span class="account-value">
                        ${bankData.bank3.iban}
                        <button class="copy-btn" onclick="copyToClipboard('${bankData.bank3.iban.replace(/\s/g, '')}')">Kopyala</button>
                    </span>
                    
                    <span class="account-label">Şube Kodu:</span>
                    <span class="account-label">4000</span>
                    
                    <span class="account-label">Hesap No:</span>
                    <span class="account-value">11223344</span>
                </div>
            </div>
            
            <div class="deposit-note">
                <strong>⚠️ Önemli Notlar:</strong><br>
                • Para yatırma işlemleriniz 5-10 dakika içinde hesabınıza yansır.<br>
                • Açıklama kısmına kullanıcı adınızı yazmayı unutmayın.<br>
                • Minimum yatırım tutarı 50 TRY'dir.<br>
                • Havale/EFT ile yapılan ödemeler anında işleme alınır.
            </div>
        `;
    }
    
    // HTML for deposit popup
    const depositHTML = `
        <div id="gp-deposit-overlay">
            <div id="gp-deposit-modal">
                <div class="tl_popup_container">
                    <div class="tl_popup_header">
                        <span class="tl_head_text">PARA YATIR</span>
                        <i class="tl_head_close dont-shrink" id="gp-deposit-close"></i>
                    </div>
                    <div class="tl_popup_content">
                        <!-- Tabs -->
                        <div class="deposit-tabs">
                            <button class="deposit-tab active" data-tab="bank">
                                🏦 Banka Hesapları
                            </button>
                            <button class="deposit-tab" data-tab="crypto">
                                ₿ Kripto Para
                            </button>
                        </div>
                        
                        <!-- Bank Accounts Section (will be populated dynamically) -->
                        <div class="deposit-section active" id="bank-section"></div>
                        
                        <!-- Crypto Section -->
                        <div class="deposit-section" id="crypto-section">
                            <div class="account-card">
                                <h3>💵 Tether (USDT) - TRC20 (Tron)</h3>
                                <div class="account-info">
                                    <span class="account-label">Network:</span>
                                    <span class="account-value">TRC20 (Tron)</span>
                                    
                                    <span class="account-label">Wallet Address:</span>
                                    <span class="account-value">
                                        TDnk2ryt8uUF4EmHVUbkaRPM6Pkv4qgnu2
                                        <button class="copy-btn" onclick="copyToClipboard('TDnk2ryt8uUF4EmHVUbkaRPM6Pkv4qgnu2')">Kopyala</button>
                                    </span>
                                    
                                    <span class="account-label">Min. Yatırım:</span>
                                    <span class="account-value">10 USDT</span>
                                </div>
                            </div>
                            
                            <div class="account-card">
                                <h3>₿ Bitcoin (BTC)</h3>
                                <div class="account-info">
                                    <span class="account-label">Network:</span>
                                    <span class="account-value">Bitcoin (BTC)</span>
                                    
                                    <span class="account-label">Wallet Address:</span>
                                    <span class="account-value">
                                        bc1qzk933nh0zk8j5yr9qzh4039s777hgeaxamag9n
                                        <button class="copy-btn" onclick="copyToClipboard('bc1qzk933nh0zk8j5yr9qzh4039s777hgeaxamag9n')">Kopyala</button>
                                    </span>
                                    
                                    <span class="account-label">Min. Yatırım:</span>
                                    <span class="account-value">0.001 BTC</span>
                                </div>
                            </div>
                            
                            <div class="account-card">
                                <h3>💎 Ethereum (ETH)</h3>
                                <div class="account-info">
                                    <span class="account-label">Network:</span>
                                    <span class="account-value">Ethereum (ERC20)</span>
                                    
                                    <span class="account-label">Wallet Address:</span>
                                    <span class="account-value">
                                        0xca8D23e0DdE77B083510c11A5e0741078dbA94c5
                                        <button class="copy-btn" onclick="copyToClipboard('0xca8D23e0DdE77B083510c11A5e0741078dbA94c5')">Kopyala</button>
                                    </span>
                                    
                                    <span class="account-label">Min. Yatırım:</span>
                                    <span class="account-value">0.01 ETH</span>
                                </div>
                            </div>
                            
                            <div class="account-card">
                                <h3>🪙 BNB (BEP20)</h3>
                                <div class="account-info">
                                    <span class="account-label">Network:</span>
                                    <span class="account-value">Binance Smart Chain (BEP20)</span>
                                    
                                    <span class="account-label">Wallet Address:</span>
                                    <span class="account-value">
                                        0xca8D23e0DdE77B083510c11A5e0741078dbA94c5
                                        <button class="copy-btn" onclick="copyToClipboard('0xca8D23e0DdE77B083510c11A5e0741078dbA94c5')">Kopyala</button>
                                    </span>
                                    
                                    <span class="account-label">Min. Yatırım:</span>
                                    <span class="account-value">0.05 BNB</span>
                                </div>
                            </div>
                            
                            <div class="account-card">
                                <h3>💵 USDT (ERC20)</h3>
                                <div class="account-info">
                                    <span class="account-label">Network:</span>
                                    <span class="account-value">Ethereum (ERC20)</span>
                                    
                                    <span class="account-label">Wallet Address:</span>
                                    <span class="account-value">
                                        0xca8D23e0DdE77B083510c11A5e0741078dbA94c5
                                        <button class="copy-btn" onclick="copyToClipboard('0xca8D23e0DdE77B083510c11A5e0741078dbA94c5')">Kopyala</button>
                                    </span>
                                    
                                    <span class="account-label">Min. Yatırım:</span>
                                    <span class="account-value">50 USDT</span>
                                </div>
                            </div>
                            
                            <div class="account-card">
                                <h3>⚡ Solana (SOL)</h3>
                                <div class="account-info">
                                    <span class="account-label">Network:</span>
                                    <span class="account-value">Solana</span>
                                    
                                    <span class="account-label">Wallet Address:</span>
                                    <span class="account-value">
                                        2bhJ4CkN2GLR9cxaY749vSZx6wR8D9qGArt9mBWKtnqq
                                        <button class="copy-btn" onclick="copyToClipboard('2bhJ4CkN2GLR9cxaY749vSZx6wR8D9qGArt9mBWKtnqq')">Kopyala</button>
                                    </span>
                                    
                                    <span class="account-label">Min. Yatırım:</span>
                                    <span class="account-value">0.1 SOL</span>
                                </div>
                            </div>
                            
                            <div class="account-card">
                                <h3>💵 USDT (SOLANA)</h3>
                                <div class="account-info">
                                    <span class="account-label">Network:</span>
                                    <span class="account-value">Solana SPL</span>
                                    
                                    <span class="account-label">Wallet Address:</span>
                                    <span class="account-value">
                                        2bhJ4CkN2GLR9cxaY749vSZx6wR8D9qGArt9mBWKtnqq
                                        <button class="copy-btn" onclick="copyToClipboard('2bhJ4CkN2GLR9cxaY749vSZx6wR8D9qGArt9mBWKtnqq')">Kopyala</button>
                                    </span>
                                    
                                    <span class="account-label">Min. Yatırım:</span>
                                    <span class="account-value">50 USDT</span>
                                </div>
                            </div>
                            
                            <div class="account-card">
                                <h3>🔁 Tron (TRX)</h3>
                                <div class="account-info">
                                    <span class="account-label">Network:</span>
                                    <span class="account-value">Tron (TRX)</span>
                                    
                                    <span class="account-label">Wallet Address:</span>
                                    <span class="account-value">
                                        TDnk2ryt8uUF4EmHVUbkaRPM6Pkv4qgnu2
                                        <button class="copy-btn" onclick="copyToClipboard('TDnk2ryt8uUF4EmHVUbkaRPM6Pkv4qgnu2')">Kopyala</button>
                                    </span>
                                    
                                    <span class="account-label">Min. Yatırım:</span>
                                    <span class="account-value">250 TRX</span>
                                </div>
                            </div>
                            
                            <div class="account-card">
                                <h3>💠 BNB - USDT (BEP20)</h3>
                                <div class="account-info">
                                    <span class="account-label">Network:</span>
                                    <span class="account-value">Binance Smart Chain (BEP20)</span>
                                    
                                    <span class="account-label">Wallet Address:</span>
                                    <span class="account-value">
                                        0xca8D23e0DdE77B083510c11A5e0741078dbA94c5
                                        <button class="copy-btn" onclick="copyToClipboard('0xca8D23e0DdE77B083510c11A5e0741078dbA94c5')">Kopyala</button>
                                    </span>
                                    
                                    <span class="account-label">Min. Yatırım:</span>
                                    <span class="account-value">50 USDT</span>
                                </div>
                            </div>
                            
                            <div class="account-card">
                                <h3>💎 ETH - USDT (ERC20)</h3>
                                <div class="account-info">
                                    <span class="account-label">Network:</span>
                                    <span class="account-value">Ethereum (ERC20)</span>
                                    
                                    <span class="account-label">Wallet Address:</span>
                                    <span class="account-value">
                                        0xca8D23e0DdE77B083510c11A5e0741078dbA94c5
                                        <button class="copy-btn" onclick="copyToClipboard('0xca8D23e0DdE77B083510c11A5e0741078dbA94c5')">Kopyala</button>
                                    </span>
                                    
                                    <span class="account-label">Min. Yatırım:</span>
                                    <span class="account-value">50 USDT</span>
                                </div>
                            </div>
                            
                            <div class="account-card">
                                <h3>🌊 XRP (Ripple)</h3>
                                <div class="account-info">
                                    <span class="account-label">Network:</span>
                                    <span class="account-value">Ripple</span>
                                    
                                    <span class="account-label">Wallet Address:</span>
                                    <span class="account-value">
                                        rN4iR1Kxsq2SUJApNnUuDZcTxFPQogyXMn
                                        <button class="copy-btn" onclick="copyToClipboard('rN4iR1Kxsq2SUJApNnUuDZcTxFPQogyXMn')">Kopyala</button>
                                    </span>
                                    
                                    <span class="account-label">Memo / Tag:</span>
                                    <span class="account-value">Gerekli Değil</span>
                                </div>
                            </div>
                            
                            <div class="account-card">
                                <h3>🪙 Litecoin (LTC)</h3>
                                <div class="account-info">
                                    <span class="account-label">Network:</span>
                                    <span class="account-value">Litecoin</span>
                                    
                                    <span class="account-label">Wallet Address:</span>
                                    <span class="account-value">
                                        ltc1qcksq78z504qeq8mg3vztzytd3r78x8a2nq446q
                                        <button class="copy-btn" onclick="copyToClipboard('ltc1qcksq78z504qeq8mg3vztzytd3r78x8a2nq446q')">Kopyala</button>
                                    </span>
                                    
                                    <span class="account-label">Min. Yatırım:</span>
                                    <span class="account-value">0.05 LTC</span>
                                </div>
                            </div>
                            
                            <div class="account-card">
                                <h3>🪙 Monero (XMR)</h3>
                                <div class="account-info">
                                    <span class="account-label">Network:</span>
                                    <span class="account-value">Monero</span>
                                    
                                    <span class="account-label">Wallet Address:</span>
                                    <span class="account-value">
                                        453XbjL7GbCKsjF2jRHRpNTv53t515vqKGQNb6i2xgXTieY9Eu2zVu9LUHxkzTJ1UKUWioHrHZzcjXkrJpxcAELmTHfqeUV
                                        <button class="copy-btn" onclick="copyToClipboard('453XbjL7GbCKsjF2jRHRpNTv53t515vqKGQNb6i2xgXTieY9Eu2zVu9LUHxkzTJ1UKUWioHrHZzcjXkrJpxcAELmTHfqeUV')">Kopyala</button>
                                    </span>
                                    
                                    <span class="account-label">Min. Yatırım:</span>
                                    <span class="account-value">0.1 XMR</span>
                                </div>
                            </div>
                            
                            <div class="deposit-note">
                                <strong>⚠️ Kripto Para Yatırma Notları:</strong><br>
                                • Sadece belirtilen network'ü kullanın, aksi halde paranız kaybolabilir.<br>
                                • Kripto para transferleri blockchain onayı sonrası hesabınıza yansır (10-30 dakika).<br>
                                • Minimum yatırım tutarının altında gönderilen ödemeler işleme alınmaz.<br>
                                • Transfer yaparken memo/tag gerekiyorsa mutlaka ekleyin.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Initialize deposit popup
    function initDepositPopup() {
        // Add styles
        if (!document.getElementById('gp-deposit-styles')) {
            document.head.insertAdjacentHTML('beforeend', depositStyles);
        }
        
        // Add HTML
        if (!document.getElementById('gp-deposit-overlay')) {
            document.body.insertAdjacentHTML('beforeend', depositHTML);
            
            // Populate bank section with dynamic data from Firebase
            const bankSection = document.getElementById('bank-section');
            if (bankSection) {
                getBankDataFromFirebase(function(bankData) {
                    bankSection.innerHTML = generateBankSectionHTML(bankData);
                });
            }
            
            // Attach event listeners
            const overlay = document.getElementById('gp-deposit-overlay');
            const closeBtn = document.getElementById('gp-deposit-close');
            
            // Close button
            if (closeBtn) {
                closeBtn.addEventListener('click', closeDepositPopup);
            }
            
            // Close on overlay click
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    closeDepositPopup();
                }
            });
            
            // Close on ESC
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && overlay.style.display === 'flex') {
                    closeDepositPopup();
                }
            });
            
            // Tab switching
            const tabs = document.querySelectorAll('.deposit-tab');
            tabs.forEach(function(tab) {
                tab.addEventListener('click', function() {
                    const targetTab = this.getAttribute('data-tab');
                    
                    // Update active tab
                    tabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Update active section
                    document.querySelectorAll('.deposit-section').forEach(s => s.classList.remove('active'));
                    document.getElementById(targetTab + '-section').classList.add('active');
                });
            });
        }
    }
    
    // Open deposit popup
    window.openDepositPopup = function() {
        const overlay = document.getElementById('gp-deposit-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    };
    
    // Close deposit popup
    function closeDepositPopup() {
        const overlay = document.getElementById('gp-deposit-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
    
    // Copy to clipboard function
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(function() {
            alert('✓ Kopyalandı: ' + text);
        }).catch(function() {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('✓ Kopyalandı: ' + text);
        });
    };
    
    // Attach to deposit buttons
    function attachDepositHandlers() {
        // Find all deposit buttons
        const depositButtons = document.querySelectorAll('[href*="deposit"], [href*="para-yatir"], .deposit-btn, [automation*="deposit"]');
        
        depositButtons.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openDepositPopup();
            });
        });
        
        console.log('✓ Deposit handlers attached to', depositButtons.length, 'buttons');
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initDepositPopup();
            setTimeout(attachDepositHandlers, 1000);
        });
    } else {
        initDepositPopup();
        setTimeout(attachDepositHandlers, 1000);
    }
    
    console.log('✅ Deposit popup system loaded!');
})();
