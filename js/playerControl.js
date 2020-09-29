function Player($audio) {
    this.$audio = $audio;
    this.audio = $audio.get(0);
    this.musicIndex = 0;
    this.music = null;

}

Player.prototype = {
    constructor: Player,
    playMusic: function (music) {
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
}

export default Player;





