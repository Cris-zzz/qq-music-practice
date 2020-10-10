class Lyric {
    constructor(lyric) {
        this.lyric = [];
        this.times = [];
        this.timeIndex = 0;
        this.$lyric = $(lyric);
    }

    loadLyric(music) {
        const $this = this;
        const timeReg = /\[(\d*:\d*\.\d*)\]/;
        let res;
        let res2;
        let timeStr;
        let min;
        let sec;
        let time;

        this.$lyric.html("");
        this.lyric = [];
        this.times = [];
        this.timeIndex = 0;
        this.$lyric.animate({"margin-top": 20 + "px"}, 150);
        $.ajax({
            url: music.link_lrc,
            dataType: "text",
            success: function (data) {
                // const array = data.split("\r\n");//本地服务器
                const array = data.split("\n");//github
                $.each(array, function (index, item) {
                    const lrc = item.split("]")[1];
                    if(!lrc.length) return;
                    $this.lyric.push(lrc);
                    res = timeReg.exec(item);
                    if(res == null) return;
                    timeStr = res[1];
                    res2 = timeStr.split(":");
                    min = parseInt(res2[0]) * 60;
                    sec = parseFloat(res2[1]);
                    time = (min + sec).toFixed(2);
                    $this.times.push(time);
                })
                $.each($this.lyric, function (index, item) {
                    const $lrcItem = $(`<p>${item}</p>`);
                    $this.$lyric.append($lrcItem);
                });
            },
            error: function (e) {
                console.log(e);
            }
        });
    }

    changeLyric(currentTime) {
        const $this = this;
        $.each(this.times, function (index) {
            if(index < $this.times.length && currentTime >= $this.times[index] && currentTime < $this.times[index + 1]) {
                doChange(index);
                return false;
            }
            else if(index === $this.times.length && currentTime >= $this.times[index - 1] && currentTime < $this.times[index]) {
                doChange(index);
                return false;
            }
        })

        function doChange(index) {
            $this.timeIndex = index;
            $this.$lyric.stop().animate({"margin-top": 20 + -30 * $this.timeIndex + "px"}, 150);
            $this.$lyric.find("p").removeClass("on").eq($this.timeIndex).addClass("on");
        }
        // if(currentTime >= this.times[this.timeIndex]){
        //     this.$lyric.animate({"margin-top": -30 * this.timeIndex}, 150);
        //     this.$lyric.find("p").removeClass("on").eq(this.timeIndex).addClass("on");
        //     this.timeIndex++;
        // }
    }
}

export default Lyric;