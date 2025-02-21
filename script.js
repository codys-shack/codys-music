const greetingElement = document.getElementById('greeting');

function getGreeting() {
    const currentTime = new Date().getHours();
    let greeting;

    if (currentTime < 12) {
        greeting = 'Good morning';
    } else if (currentTime < 18) {
        greeting = 'Good afternoon';
    } else {
        greeting = 'Good evening';
    }

    greetingElement.textContent = greeting;
}

getGreeting();
