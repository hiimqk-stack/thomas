// Grandpashabet-style Login Popup
(function() {
    'use strict';
    
    console.log('🎮 Grandpashabet login popup loading...');
    
    // Minimal CSS for overlay only - use site's existing styles for popup content
    const loginStyles = `
        <style id="gp-login-styles">
            #gp-login-overlay {
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
                overflow-y: auto;
            }
            
            #gp-login-modal {
                width: 500px;
                max-width: 95%;
                max-height: 90vh;
                overflow-y: auto;
                animation: slideDown 0.3s ease-out;
                margin: 20px 0;
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
            
            #gp-login-modal #login_container {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
            }
            
            #gp-login-modal .tl_popup_content {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            #gp-login-modal .form-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 20px;
                width: 100%;
            }
            
            #gp-login-modal .form-group-label {
                display: flex;
                align-items: center;
                justify-content: flex-start;
            }
            
            #gp-login-modal .form-group-label label {
                text-align: left;
                font-size: 14px;
                font-weight: 500;
                color: #fff;
            }
            
            .gp-header-actions {
                display: flex;
                align-items: center;
                gap: 10px;
                font-family: 'Roboto', sans-serif;
            }
            
            .gp-pill {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                padding: 8px 18px;
                border-radius: 999px;
                border: 1px solid rgba(208, 183, 82, 0.35);
                background: radial-gradient(circle at top, #9fb335 0%, #546115 70%);
                color: #fff;
                font-size: 13px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
                position: relative;
            }
            
                .gp-pill:hover {
                transform: translateY(-1px);
                box-shadow: inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 20px rgba(0,0,0,0.25);
            }
            
            .gp-pill--icon,
            .gp-pill--lang {
                width: 46px;
                justify-content: center;
                padding: 8px;
            }
            
            .gp-pill--balance {
                min-width: 140px;
                justify-content: flex-start;
            }
            
            .gp-pill--user {
                padding-right: 8px;
            }
            
            .gp-icon {
                font-size: 16px;
            }
            
            .gp-icon--mail::before { content: '✉️'; }
            .gp-icon--card::before { content: '💳'; }
            .gp-icon--user::before { content: '👤'; }
            
            .gp-user-btn {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: transparent;
                border: none;
                color: inherit;
                font: inherit;
                cursor: pointer;
                padding: 0;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .gp-arrow {
                font-size: 10px;
                color: #f3f3d3;
            }
            
            .gp-flag {
                width: 22px;
                height: 22px;
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                position: relative;
            }
            
            .gp-flag-tr {
                background: #c70124;
            }
            
            .gp-flag-tr::before {
                content: '';
                width: 10px;
                height: 10px;
                border: 2px solid #fff;
                border-radius: 50%;
                position: absolute;
                left: 6px;
            }
            
            .gp-flag-tr::after {
                content: '';
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: #fff;
                position: absolute;
                right: 4px;
            }
            
            .gp-user-dropdown {
                display: none;
                position: absolute;
                top: calc(100% + 8px);
                right: 0;
                background: #1f2a0d;
                border: 1px solid rgba(208, 183, 82, 0.4);
                border-radius: 8px;
                min-width: 160px;
                box-shadow: 0 12px 30px rgba(0,0,0,0.35);
                z-index: 9999;
            }
            
            .gp-dropdown-item {
                width: 100%;
                padding: 12px 18px;
                background: transparent;
                border: none;
                color: #fff;
                text-align: left;
                font-size: 14px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .gp-dropdown-item:hover {
                background: rgba(208, 183, 82, 0.15);
            }
        </style>
    `;
    
    // HTML for the popup
    const loginHTML = `
        <div id="gp-login-overlay">
            <div id="gp-login-modal">
                <div class="tl_popup_container tl_login_content">
                    <div class="tl_popup_header">
                        <span class="tl_head_text">ÜYE GİRİŞİ</span>
                        <i class="tl_head_close dont-shrink"></i>
                    </div>
                    <div id="login_container">
                        <div class="tl_popup_content">
                            <div class="D_logo" style="background-image: url('../cdn.grandpashabet7034.com/plat/prd/Img/Partners/1093/login_logo.webp')"></div>
                    
                    <form id="gp-login-form">
                        <div class="form-group login_form_group register_input_new js_login_input">
                            <div class="form-group-label">
                                <label for="email">Kullanıcı adı</label>
                            </div>
                            <div class="relative">
                                <input automation="email_input" class="tl_input_popup_reg" id="email" name="Email" placeholder="Kullanıcı adı / E-mail / Cep numarası" type="text" value="" autocomplete="username">
                            </div>
                        </div>

                        <div class="form-group login_form_group register_input_new relative js_login_input">
                            <div class="form-group-label">
                                <label for="password">Şifre</label>
                            </div>
                            <div class="tl_input_with_suffix eye_block">
                                <input autocomplete="off" automation="password_input" class="tl_input_popup_reg" id="password" name="Password" placeholder="Şifre" type="password">
                                <button type="button" class="eye_button opened_pass _password eye_button_login js_pass_eye_btn" data-btn-for="password"></button>
                            </div>
                        </div>

                        <div class="mb-1 login_form_group text-center">
                            <button type="submit" class="tl_btn login_btn btnSec h-bg-primary" automation="login_button" id="js_lg_btn">ÜYE GİRİŞİ</button>
                        </div>

                        <a href="#" class="tl_popup_link recover_btn popup_lbl_2" id="js_ft_pass_btn">Şifrenizi mi unuttunuz?</a>

                            <a href="#" class="tl_sup_link"><i class="tf_support_icon"></i>7 / 24 Canlı Destek</a>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Initialize popup
    function initPopup() {
        // Add styles
        if (!document.getElementById('gp-login-styles')) {
            document.head.insertAdjacentHTML('beforeend', loginStyles);
        }
        
        // Add HTML
        if (!document.getElementById('gp-login-overlay')) {
            document.body.insertAdjacentHTML('beforeend', loginHTML);
            
            // Attach event listeners
            const overlay = document.getElementById('gp-login-overlay');
            const closeBtn = document.querySelector('.tl_head_close');
            const form = document.getElementById('gp-login-form');
            
            // Close on X button
            if (closeBtn) {
                closeBtn.addEventListener('click', closePopup);
            }
            
            // Close on overlay click
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    closePopup();
                }
            });
            
            // Close on ESC
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && overlay.style.display === 'flex') {
                    closePopup();
                }
            });
            
            // Eye button toggle password visibility
            const eyeBtn = document.querySelector('.js_pass_eye_btn');
            const passwordInput = document.getElementById('password');
            if (eyeBtn && passwordInput) {
                eyeBtn.addEventListener('click', function() {
                    if (passwordInput.type === 'password') {
                        passwordInput.type = 'text';
                        eyeBtn.classList.remove('opened_pass');
                    } else {
                        passwordInput.type = 'password';
                        eyeBtn.classList.add('opened_pass');
                    }
                });
            }
            
            // Forgot password link
            const forgotBtn = document.getElementById('js_ft_pass_btn');
            if (forgotBtn) {
                forgotBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    alert('Şifre sıfırlama özelliği demo modda mevcut değil.');
                });
            }
            
            // Support link
            const supportLink = document.querySelector('.tl_sup_link');
            if (supportLink) {
                supportLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    alert('Canlı destek demo modda mevcut değil.');
                });
            }
            
            // Handle form submit
            form.addEventListener('submit', handleLogin);
        }
    }
    
    // Open popup
    window.openGPLogin = function() {
        const overlay = document.getElementById('gp-login-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
            setTimeout(function() {
                const emailInput = document.getElementById('email');
                if (emailInput) emailInput.focus();
            }, 100);
        }
    };
    
    // Close popup
    function closePopup() {
        const overlay = document.getElementById('gp-login-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
    
    // Handle login
    function handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        if (username) {
            // Save to localStorage
            localStorage.setItem('fake_username', username);
            
            // Close popup
            closePopup();
            
            // Show logged-in state
            showLoggedInState(username);
            
            console.log('✅ Login successful:', username);
        }
    }
    
    // Random balance generator
    function generateRandomBalance() {
        return (Math.random() * 0.98).toFixed(2);
    }
    
    function getStoredBalance() {
        let balance = localStorage.getItem('fake_balance');
        if (!balance) {
            balance = generateRandomBalance();
            localStorage.setItem('fake_balance', balance);
        }
        return balance;
    }
    
    // Show logged in state
    function showLoggedInState(username) {
        const loginContainer = document.querySelector('.tl_login_container');
        if (loginContainer) {
            const balance = getStoredBalance();
            loginContainer.innerHTML = `
                <div class="gp-header-actions">
                    <button class="gp-pill gp-pill--cta" id="gp-deposit-pill">PARA YATIRMA</button>
                    <button class="gp-pill gp-pill--icon" id="gp-mail-pill">
                        <span class="gp-icon gp-icon--mail" aria-hidden="true"></span>
                    </button>
                    <div class="gp-pill gp-pill--balance" aria-label="Bakiye">
                        <span class="gp-icon gp-icon--card" aria-hidden="true"></span>
                        <span id="gp-fake-balance">${balance} TRY</span>
                    </div>
                    <div class="gp-pill gp-pill--user">
                        <button class="gp-user-btn" id="gp-user-dropdown-btn" aria-haspopup="true" aria-expanded="false">
                            <span class="gp-icon gp-icon--user" aria-hidden="true"></span>
                            <span class="gp-username-text">${username}</span>
                            <span class="gp-arrow">▼</span>
                        </button>
                        <div class="gp-user-dropdown" id="gp-user-dropdown-menu" role="menu">
                            <button class="gp-dropdown-item" role="menuitem" onclick="gpLogout()">
                                <span>Çıkış Yap</span>
                            </button>
                        </div>
                    </div>
                    <div class="gp-pill gp-pill--lang" id="gp-lang-pill">
                        <span class="gp-flag gp-flag-tr" aria-hidden="true"></span>
                        <span class="gp-arrow">▼</span>
                    </div>
                </div>
            `;
            
            // wire up CTA buttons and dropdowns after DOM paint
            setTimeout(function() {
                const dropdownBtn = document.getElementById('gp-user-dropdown-btn');
                const dropdownMenu = document.getElementById('gp-user-dropdown-menu');
                const depositBtn = document.getElementById('gp-deposit-pill');
                const mailBtn = document.getElementById('gp-mail-pill');
                const langBtn = document.getElementById('gp-lang-pill');
                
                if (dropdownBtn && dropdownMenu) {
                    dropdownBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const isVisible = dropdownMenu.style.display === 'block';
                        dropdownMenu.style.display = isVisible ? 'none' : 'block';
                        dropdownBtn.setAttribute('aria-expanded', (!isVisible).toString());
                    });
                    
                    document.addEventListener('click', function(e) {
                        if (!dropdownMenu.contains(e.target) && !dropdownBtn.contains(e.target)) {
                            dropdownMenu.style.display = 'none';
                            dropdownBtn.setAttribute('aria-expanded', 'false');
                        }
                    });
                }
                
                if (typeof openDepositPopup === 'function' && depositBtn) {
                    depositBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        openDepositPopup();
                    });
                }
                
                if (mailBtn) {
                    mailBtn.addEventListener('click', function() {
                        alert('Mesaj kutusu şu anda kullanılamıyor.');
                    });
                }
                
                if (langBtn) {
                    langBtn.addEventListener('click', function() {
                        alert('Dil değişimi demo modunda devre dışıdır.');
                    });
                }
            }, 0);
        }
        
        // Hide all login buttons
        document.querySelectorAll('.loginDialog, .openLogin, [automation="home_login_button"]').forEach(function(btn) {
            btn.style.display = 'none';
        });
    }
    
    // Logout
    window.gpLogout = function() {
        localStorage.removeItem('fake_username');
        localStorage.removeItem('fake_balance');
        location.reload();
    };
    
    // Check if already logged in
    function checkLoginStatus() {
        const username = localStorage.getItem('fake_username');
        if (username) {
            showLoggedInState(username);
        }
    }
    
    // Override jQuery login handler
    function overrideLoginHandlers() {
        if (typeof $ !== 'undefined') {
            // Remove existing handlers
            $(document).off('click', '.loginDialog');
            $(document).off('click', '.openLogin');
            
            // Add new handler
            $(document).on('click', '.loginDialog, .openLogin, [automation="home_login_button"]', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                openGPLogin();
                return false;
            });
            
            console.log('✅ Login handlers overridden');
        }
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initPopup();
            checkLoginStatus();
            setTimeout(overrideLoginHandlers, 500);
        });
    } else {
        initPopup();
        checkLoginStatus();
        setTimeout(overrideLoginHandlers, 500);
    }
    
    // Also override after jQuery is ready
    if (typeof $ !== 'undefined') {
        $(document).ready(function() {
            setTimeout(overrideLoginHandlers, 1000);
        });
    }
    
    console.log('✅ Grandpashabet login system loaded!');
})();
