export function startSoundHandler (src) {
  window.audio = new Audio (src);
  window.audio.play()
    .catch(e => console.log(e))
}

export function stopSoundHandler () {
  window.audio.pause();
}
