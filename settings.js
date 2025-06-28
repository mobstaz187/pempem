// Authentic PS4 Settings JavaScript
$(document).ready(function() {
    // Clock functionality
    function currentTime() {
        let date = new Date(); 
        let hh = date.getHours();
        let mm = date.getMinutes();

        hh = (hh < 10) ? "0" + hh : hh;
        mm = (mm < 10) ? "0" + mm : mm;
        
        let time = hh + ":" + mm;

        document.getElementById("clock").innerText = time; 
        setTimeout(currentTime, 1000);
    }
    
    currentTime();

    // Navigation functionality
    $('.nav-item').click(function() {
        const panel = $(this).data('panel');
        
        // Update active navigation
        $('.nav-item').removeClass('active');
        $(this).addClass('active');
        
        // Update active panel
        $('.settings-panel').removeClass('active');
        $('#' + panel + '-panel').addClass('active');
    });

    // Setting option clicks
    $('.setting-option').click(function() {
        const settingName = $(this).find('.setting-name').text();
        
        // Add click animation
        $(this).css('transform', 'translateX(5px)');
        setTimeout(() => {
            $(this).css('transform', '');
        }, 150);

        // Simulate PS4 behavior - would normally navigate to sub-menu
        console.log('Opening setting:', settingName);
        
        // For demo purposes, show PS4-style notification
        setTimeout(() => {
            showPS4Notification('Setting', settingName + ' selected');
        }, 200);
    });

    // Keyboard and gamepad navigation
    let currentFocus = 0;
    const focusableElements = $('[tabindex="0"]');

    function updateFocus() {
        focusableElements.blur();
        $(focusableElements[currentFocus]).focus();
    }

    // Keyboard controls
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
                // Navigate to previous category if in nav
                if ($(focusableElements[currentFocus]).hasClass('nav-item')) {
                    currentFocus = Math.max(0, currentFocus - 1);
                    updateFocus();
                }
                break;
            case 39: // Right arrow
                e.preventDefault();
                // Navigate to next category if in nav
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

    // Gamepad support
    let gamepadIndex = null;
    let lastButtonState = {};

    function connectGamepad() {
        const gamepads = navigator.getGamepads();
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                gamepadIndex = i;
                console.log('Gamepad connected:', gamepads[i].id);
                break;
            }
        }
    }

    function handleGamepadInput() {
        if (gamepadIndex === null) return;

        const gamepad = navigator.getGamepads()[gamepadIndex];
        if (!gamepad) return;

        // Check for button press (not held)
        function isButtonPressed(buttonIndex) {
            const pressed = gamepad.buttons[buttonIndex].pressed;
            const wasPressed = lastButtonState[buttonIndex] || false;
            lastButtonState[buttonIndex] = pressed;
            return pressed && !wasPressed;
        }

        // D-pad navigation
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

        // X button (confirm)
        if (isButtonPressed(0)) {
            $(focusableElements[currentFocus]).click();
        }

        // Circle button (back)
        if (isButtonPressed(1)) {
            goBackToMain();
        }

        // Options button
        if (isButtonPressed(9)) {
            showPS4Notification('Options', 'Options menu not available');
        }
    }

    // Initialize gamepad
    window.addEventListener('gamepadconnected', connectGamepad);
    connectGamepad();

    // Gamepad polling
    setInterval(handleGamepadInput, 100);

    // Set initial focus
    updateFocus();
});

// PS4-style notification
function showPS4Notification(title, message) {
    const notification = $(`
        <div class="ps4-notification">
            <div class="notification-icon"></div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
        </div>
    `);

    $('body').append(notification);

    // Animate in
    setTimeout(() => {
        notification.addClass('show');
    }, 100);

    // Animate out
    setTimeout(() => {
        notification.removeClass('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Go back to main PS4 interface
function goBackToMain() {
    $('.ps4-settings').css({
        'transform': 'scale(0.95)',
        'opacity': '0',
        'transition': 'all 0.3s ease'
    });
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 300);
}

// Add PS4 notification styles
const notificationStyles = `
    <style>
        .ps4-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 15px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 10000;
            font-family: 'ps4', sans-serif;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }
        
        .ps4-notification.show {
            transform: translateX(0);
        }
        
        .notification-icon {
            width: 40px;
            height: 40px;
            background: #0066cc;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        }
        
        .notification-title {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 2px;
        }
        
        .notification-message {
            font-size: 14px;
            opacity: 0.8;
        }
    </style>
`;

$('head').append(notificationStyles);