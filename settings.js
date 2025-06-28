// Settings Page JavaScript
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
        let t = setTimeout(function(){ currentTime() }, 1000);
    }
    
    currentTime();

    // Category navigation
    $('.settings-category').click(function() {
        const category = $(this).data('category');
        
        // Update active category
        $('.settings-category').removeClass('active');
        $(this).addClass('active');
        
        // Update active panel
        $('.content-panel').removeClass('active');
        $('#' + category + '-panel').addClass('active');
    });

    // Keyboard navigation
    let currentFocus = 0;
    const focusableElements = $('[tabindex="0"]');

    function updateFocus() {
        focusableElements.removeClass('keyboard-focus');
        $(focusableElements[currentFocus]).addClass('keyboard-focus').focus();
    }

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
            case 13: // Enter
                e.preventDefault();
                $(focusableElements[currentFocus]).click();
                break;
            case 27: // Escape
                e.preventDefault();
                goBack();
                break;
        }
    });

    // Gamepad support
    let gamepadIndex = null;

    function connectGamepad() {
        const gamepads = navigator.getGamepads();
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                gamepadIndex = i;
                break;
            }
        }
    }

    function handleGamepadInput() {
        if (gamepadIndex === null) return;

        const gamepad = navigator.getGamepads()[gamepadIndex];
        if (!gamepad) return;

        // D-pad or left stick navigation
        if (gamepad.buttons[12].pressed || gamepad.axes[1] < -0.5) { // Up
            currentFocus = Math.max(0, currentFocus - 1);
            updateFocus();
        } else if (gamepad.buttons[13].pressed || gamepad.axes[1] > 0.5) { // Down
            currentFocus = Math.min(focusableElements.length - 1, currentFocus + 1);
            updateFocus();
        } else if (gamepad.buttons[14].pressed || gamepad.axes[0] < -0.5) { // Left
            // Handle left navigation if needed
        } else if (gamepad.buttons[15].pressed || gamepad.axes[0] > 0.5) { // Right
            // Handle right navigation if needed
        }

        // X button (confirm)
        if (gamepad.buttons[0].pressed) {
            $(focusableElements[currentFocus]).click();
        }

        // Circle button (back)
        if (gamepad.buttons[1].pressed) {
            goBack();
        }
    }

    // Check for gamepad connection
    window.addEventListener('gamepadconnected', connectGamepad);
    connectGamepad();

    // Gamepad polling
    setInterval(handleGamepadInput, 100);

    // Setting item interactions
    $('.setting-item').click(function() {
        // Add click animation
        $(this).css('transform', 'translateX(15px) scale(0.98)');
        setTimeout(() => {
            $(this).css('transform', '');
        }, 150);

        // Here you could add specific functionality for each setting
        const settingTitle = $(this).find('h3').text();
        console.log('Clicked setting:', settingTitle);
        
        // For demo purposes, show an alert
        // In a real implementation, you'd navigate to specific setting pages
        setTimeout(() => {
            alert('Opening: ' + settingTitle + '\n\nThis would normally open the specific setting page.');
        }, 200);
    });
});

// Go back to main PS4 interface
function goBack() {
    // Add exit animation
    $('.settings-container').css({
        'transform': 'scale(0.9)',
        'opacity': '0',
        'transition': 'all 0.3s ease'
    });
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 300);
}

// Add some visual feedback for keyboard navigation
const style = document.createElement('style');
style.textContent = `
    .keyboard-focus {
        box-shadow: 0 0 0 3px #00d4ff !important;
        transform: translateX(10px) !important;
    }
`;
document.head.appendChild(style);