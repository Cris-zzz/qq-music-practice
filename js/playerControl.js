class Player {
    constructor($audio) {
        this.$audio = $audio;
        this.audio = $audio.get(0);
        this.musicIndex = -1;
        this.music = null;
    }

    playMusic(music) {
        if(this.musicIndex === music.index) {
            if(this.audio.paused){
                this.audio.play();
            }
            else {
                this.audio.pause();
            }
        }
        else {
            this.$audio.attr("src", music.link_url);
            this.audio.play();
            this.musicIndex = music.index;
            this.music = music;
        }
    }

    musicTimeUpdate(callback) {
        const $this = this;
        this.$audio.on("timeupdate", function () {
            const currentTime = $this.audio.currentTime;
            const duration = $this.audio.duration;
            const timeStr = $this.formatTime(currentTime, duration);
            if(duration !== duration) return; //第一次获取到的duration为NaN
            callback(currentTime, duration, timeStr);
        })
    }

    formatTime(currentTime, duration) {
        let endMin = parseInt(duration / 60);
        let endSec = parseInt(duration % 60);
        if(endMin < 10){
            endMin = "0" + endMin;
        }
        if(endSec < 10){
            endSec = "0" + endSec;
        }

        let currentMin = parseInt(currentTime / 60);
        let currentSec = parseInt(currentTime % 60);
        if(currentMin < 10){
            currentMin = "0" + currentMin;
        }
        if(currentSec < 10){
            currentSec = "0" + currentSec;
        }
        return currentMin + ":" + currentSec + " / " + endMin + ":" + endSec;
    }

    musicEnd(callback) {
        this.$audio.on("ended", () => {callback();})
    }

    set volume(newVolume) {
        this.audio.volume = newVolume;
    }

    get volume() {
        return this.audio.volume;
    }

    muted(state) {
        this.audio.muted = state;
    }
}

export default Player;





