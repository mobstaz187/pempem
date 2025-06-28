// Authentic PS4 Settings JavaScript with Real Animations
$(document).ready(function() {
    // Initialize PS4 settings with authentic animations
    initializePS4Settings();
    
    // Clock functionality with PS4-style updates
    function currentTime() {
        let date = new Date(); 
        let hh = date.getHours();
        let mm = date.getMinutes();

        hh = (hh < 10) ? "0" + hh : hh;
        mm = (mm < 10) ? "0" + mm : mm;
        
        let time = hh + ":" + mm;

        const clockElement = document.getElementById("clock");
        if (clockElement.innerText !== time) {
            clockElement.style.animation = 'digitalClock 0.5s ease-in-out';
            clockElement.innerText = time;
            setTimeout(() => {
                clockElement.style.animation = '';
            }, 500);
        }
        
        setTimeout(currentTime, 1000);
    }
    
    currentTime();

    // PS4-style navigation with authentic animations
    $('.nav-item').click(function() {
        const panel = $(this).data('panel');
        
        // Add PS4-style click animation
        $(this).addClass('ripple-effect');
        setTimeout(() => {
            $(this).removeClass('ripple-effect');
        }, 600);
        
        // PS4-style panel transition
        const currentPanel = $('.settings-panel.active');
        const newPanel = $('#' + panel + '-panel');
        
        if (currentPanel.length && !newPanel.hasClass('active')) {
            // Exit animation for current panel
            currentPanel.addClass('panel-transition-exit');
            
            setTimeout(() => {
                // Update active navigation with PS4 glow
                $('.nav-item').removeClass('active');
                $(this).addClass('active');
                
                // Switch panels
                $('.settings-panel').removeClass('active panel-transition-exit');
                newPanel.addClass('active panel-transition-enter');
                
                // Remove enter animation class after animation completes
                setTimeout(() => {
                    newPanel.removeClass('panel-transition-enter');
                }, 400);
                
                // Animate setting options with staggered delay
                animateSettingOptions(newPanel);
                
            }, 300);
        } else if (!currentPanel.length) {
            // First time initialization
            $('.nav-item').removeClass('active');
            $(this).addClass('active');
            $('.settings-panel').removeClass('active');
            newPanel.addClass('active');
            animateSettingOptions(newPanel);
        }
        
        // PS4 navigation sound effect (if audio files are available)
        playPS4Sound('navigate');
    });

    // Animate setting options with PS4-style staggered entrance
    function animateSettingOptions(panel) {
        const options = panel.find('.setting-option');
        options.each(function(index) {
            $(this).css({
                'animation-delay': (index * 0.1) + 's',
                'animation': 'optionSlideIn 0.5s ease-out both'
            });
        });
    }

    // PS4-style setting option interactions
    $('.setting-option').click(function() {
        const settingName = $(this).find('.setting-name').text();
        
        // PS4-style click animation with ripple effect
        $(this).addClass('ripple-effect');
        
        // Authentic PS4 selection animation
        $(this).css({
            'transform': 'translateX(15px) scale(0.98)',
            'background': 'rgba(0, 212, 255, 0.2)',
            'border-left-color': '#00d4ff',
            'box-shadow': '0 6px 25px rgba(0, 212, 255, 0.6)'
        });
        
        setTimeout(() => {
            $(this).css({
                'transform': '',
                'background': '',
                'border-left-color': '',
                'box-shadow': ''
            });
            $(this).removeClass('ripple-effect');
        }, 300);

        // PS4 selection sound
        playPS4Sound('select');
        
        // Show PS4-style loading for authentic feel
        showPS4Loading(settingName);
        
        setTimeout(() => {
            hidePS4Loading();
            showPS4Notification('Setting', settingName + ' selected');
        }, 1200);
    });

    // Enhanced keyboard and gamepad navigation with PS4 animations
    let currentFocus = 0;
    const focusableElements = $('[tabindex="0"]');

    function updateFocus() {
        focusableElements.removeClass('ps4-glow').blur();
        const currentElement = $(focusableElements[currentFocus]);
        currentElement.focus().addClass('ps4-glow');
        
        // PS4-style focus animation
        currentElement.css('animation', 'focusPulse 1.5s ease-in-out infinite');
        
        // Navigation sound
        playPS4Sound('navigate');
    }

    // Enhanced keyboard controls with PS4 feel
    $(document).keydown(function(e) {
        switch(e.which) {
            case 38: // Up arrow
                e.preventDefault();
                currentFocus = Math.max(0, currentFocus - 1);
                updateFocus();
                break;
            case 40: // Down arrow
                e.preventDefault();
                currentFocus = Math.min(focusableElements.length - 1, currentFocus + 1);
                updateFocus();
                break;
            case 37: // Left arrow
                e.preventDefault();
                if ($(focusableElements[currentFocus]).hasClass('nav-item')) {
                    currentFocus = Math.max(0, currentFocus - 1);
                    updateFocus();
                }
                break;
            case 39: // Right arrow
                e.preventDefault();
                if ($(focusableElements[currentFocus]).hasClass('nav-item')) {
                    currentFocus = Math.min(focusableElements.length - 1, currentFocus + 1);
                    updateFocus();
                }
                break;
            case 13: // Enter (X button)
                e.preventDefault();
                $(focusableElements[currentFocus]).click();
                break;
            case 27: // Escape (Circle button)
                e.preventDefault();
                goBackToMain();
                break;
        }
    });

    // Enhanced gamepad support with PS4 controller mapping
    let gamepadIndex = null;
    let lastButtonState = {};

    function connectGamepad() {
        const gamepads = navigator.getGamepads();
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                gamepadIndex = i;
                console.log('PS4 Controller connected:', gamepads[i].id);
                showPS4Notification('Controller', 'DUALSHOCK 4 connected');
                break;
            }
        }
    }

    function handleGamepadInput() {
        if (gamepadIndex === null) return;

        const gamepad = navigator.getGamepads()[gamepadIndex];
        if (!gamepad) return;

        // Check for button press (not held) - PS4 style
        function isButtonPressed(buttonIndex) {
            const pressed = gamepad.buttons[buttonIndex].pressed;
            const wasPressed = lastButtonState[buttonIndex] || false;
            lastButtonState[buttonIndex] = pressed;
            return pressed && !wasPressed;
        }

        // PS4 D-pad and analog stick navigation
        if (isButtonPressed(12) || gamepad.axes[1] < -0.5) { // Up
            currentFocus = Math.max(0, currentFocus - 1);
            updateFocus();
        } else if (isButtonPressed(13) || gamepad.axes[1] > 0.5) { // Down
            currentFocus = Math.min(focusableElements.length - 1, currentFocus + 1);
            updateFocus();
        } else if (isButtonPressed(14) || gamepad.axes[0] < -0.5) { // Left
            if ($(focusableElements[currentFocus]).hasClass('nav-item')) {
                currentFocus = Math.max(0, currentFocus - 1);
                updateFocus();
            }
        } else if (isButtonPressed(15) || gamepad.axes[0] > 0.5) { // Right
            if ($(focusableElements[currentFocus]).hasClass('nav-item')) {
                currentFocus = Math.min(focusableElements.length - 1, currentFocus + 1);
                updateFocus();
            }
        }

        // PS4 button mapping
        if (isButtonPressed(0)) { // X button (confirm)
            $(focusableElements[currentFocus]).click();
            // PS4 controller vibration
            if (gamepad.vibrationActuator) {
                gamepad.vibrationActuator.playEffect('dual-rumble', {
                    startDelay: 0,
                    duration: 100,
                    weakMagnitude: 0.5,
                    strongMagnitude: 0.5
                });
            }
        }

        if (isButtonPressed(1)) { // Circle button (back)
            goBackToMain();
        }

        if (isButtonPressed(9)) { // Options button
            showPS4Notification('Options', 'Options menu not available');
        }

        // PS4 Share button
        if (isButtonPressed(8)) {
            showPS4Notification('Share', 'Share functionality not available');
        }

        // PS4 Home button
        if (isButtonPressed(16)) {
            goBackToMain();
        }
    }

    // Initialize gamepad with PS4 detection
    window.addEventListener('gamepadconnected', function(e) {
        connectGamepad();
        // PS4 startup vibration
        setTimeout(() => {
            const gamepad = navigator.getGamepads()[gamepadIndex];
            if (gamepad && gamepad.vibrationActuator) {
                gamepad.vibrationActuator.playEffect('dual-rumble', {
                    startDelay: 0,
                    duration: 200,
                    weakMagnitude: 0.3,
                    strongMagnitude: 0.7
                });
            }
        }, 100);
    });
    
    connectGamepad();

    // Gamepad polling with PS4 timing
    setInterval(handleGamepadInput, 16); // 60fps polling like PS4

    // Set initial focus with PS4 animation
    setTimeout(() => {
        updateFocus();
    }, 500);
});

// PS4 initialization with authentic startup sequence
function initializePS4Settings() {
    // PS4-style startup sequence
    $('.ps4-settings').css('opacity', '0');
    
    setTimeout(() => {
        $('.ps4-settings').css({
            'opacity': '1',
            'animation': 'fadeIn 0.8s ease-out'
        });
    }, 100);
    
    // Staggered element animations like real PS4
    setTimeout(() => {
        $('.ps4-top-bar').css('animation', 'slideDown 0.6s ease-out');
    }, 200);
    
    setTimeout(() => {
        $('.settings-nav').css('animation', 'slideInLeft 0.6s ease-out');
    }, 400);
    
    setTimeout(() => {
        $('.settings-content-area').css('animation', 'slideInRight 0.8s ease-out');
    }, 600);
    
    setTimeout(() => {
        $('.ps4-bottom-bar').css('animation', 'slideUp 0.7s ease-out');
    }, 800);
}

// PS4-style loading indicator
function showPS4Loading(settingName) {
    const loadingHtml = `
        <div class="ps4-loading-overlay">
            <div class="ps4-loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading ${settingName}...</div>
            </div>
        </div>
    `;
    
    $('body').append(loadingHtml);
    
    setTimeout(() => {
        $('.ps4-loading-overlay').addClass('show');
    }, 50);
}

function hidePS4Loading() {
    $('.ps4-loading-overlay').removeClass('show');
    setTimeout(() => {
        $('.ps4-loading-overlay').remove();
    }, 300);
}

// Enhanced PS4-style notification with authentic animations
function showPS4Notification(title, message) {
    const notification = $(`
        <div class="ps4-notification">
            <div class="notification-icon">
                <div class="ps4-logo-small"></div>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <div class="notification-progress"></div>
        </div>
    `);

    $('body').append(notification);

    // PS4-style slide in animation
    setTimeout(() => {
        notification.addClass('show');
    }, 100);

    // Progress bar animation
    setTimeout(() => {
        notification.find('.notification-progress').addClass('animate');
    }, 200);

    // PS4-style slide out
    setTimeout(() => {
        notification.removeClass('show');
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 4000);
}

// PS4 sound effects (placeholder - would use actual PS4 sounds)
function playPS4Sound(type) {
    // In a real implementation, these would be actual PS4 sound files
    switch(type) {
        case 'navigate':
            // Play PS4 navigation sound
            console.log('PS4 Navigate Sound');
            break;
        case 'select':
            // Play PS4 selection sound
            console.log('PS4 Select Sound');
            break;
        case 'back':
            // Play PS4 back sound
            console.log('PS4 Back Sound');
            break;
        case 'error':
            // Play PS4 error sound
            console.log('PS4 Error Sound');
            break;
    }
}

// FIXED: Go back to main PS4 interface without startup screen
function goBackToMain() {
    playPS4Sound('back');
    
    // PS4-style exit animation
    $('.ps4-settings').css({
        'transform': 'scale(0.95)',
        'opacity': '0',
        'transition': 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    
    setTimeout(() => {
        // Set a flag to skip startup screen
        sessionStorage.setItem('skipStartup', 'true');
        window.location.href = 'index.html';
    }, 400);
}

// Add enhanced PS4 notification and loading styles
const enhancedPS4Styles = `
    <style>
        .ps4-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(0, 61, 130, 0.9));
            color: white;
            padding: 20px 25px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 15px;
            transform: translateX(120%);
            transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            z-index: 10000;
            font-family: 'ps4', sans-serif;
            border: 1px solid rgba(0, 212, 255, 0.3);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
            min-width: 300px;
            position: relative;
            overflow: hidden;
        }
        
        .ps4-notification::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.1), transparent);
            transition: left 0.6s ease;
        }
        
        .ps4-notification.show {
            transform: translateX(0);
        }
        
        .ps4-notification.show::before {
            left: 100%;
        }
        
        .notification-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #0066cc, #00d4ff);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            animation: ps4Pulse 2s ease-in-out infinite;
            position: relative;
        }
        
        .ps4-logo-small {
            width: 30px;
            height: 30px;
            background: white;
            border-radius: 4px;
        }
        
        .notification-title {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 4px;
            color: #00d4ff;
        }
        
        .notification-message {
            font-size: 14px;
            opacity: 0.9;
            font-weight: 300;
        }
        
        .notification-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: #00d4ff;
            width: 0;
            transition: width 4s linear;
        }
        
        .notification-progress.animate {
            width: 100%;
        }
        
        .ps4-loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 20000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .ps4-loading-overlay.show {
            opacity: 1;
        }
        
        .ps4-loading-content {
            text-align: center;
            color: white;
            font-family: 'ps4', sans-serif;
        }
        
        .loading-text {
            margin-top: 20px;
            font-size: 18px;
            font-weight: 300;
            animation: ps4Pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes ps4Pulse {
            0%, 100% {
                opacity: 1;
                transform: scale(1);
            }
            50% {
                opacity: 0.7;
                transform: scale(1.05);
            }
        }
    </style>
`;

$('head').append(enhancedPS4Styles);