export const playSound = () => {
    let audio = document.createElement('audio');
    audio.src = require('../assets/audio/notification.mp3');
    audio.play();
}