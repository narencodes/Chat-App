const audioMapping = {
    notification : "audio/notification.mp3",
    message : "audio/messagesound.mp3"
}

export const playSound = type => {
    let audio = document.createElement('audio');
    audio.src = require(`@/assets/${audioMapping[type]}`);
    audio.play();
}