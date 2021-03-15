const playMusic = document.getElementById('play');
const stopMusic = document.getElementById('stop');

stopMusic.style.display = 'none';

playMusic.addEventListener('click', e => {
    let audio = document.getElementById('music')
        play(audio)
    stopMusic.style.display = 'block';
    playMusic.style.display = 'none';
})

stopMusic.addEventListener('click', e => {
    let audio = document.getElementById('music')
        stop(audio)
    stopMusic.style.display = 'none';
    playMusic.style.display = 'block';
})

function play(audio) {
    audio.play();
}

function stop(audio) {
    audio.pause();
}