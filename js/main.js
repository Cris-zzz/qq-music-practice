import Player from "./playerControl.js";

$(
    function () {
        const $audio = $("audio");
        const player = new Player($audio);

        //获取歌曲列表
        $.ajax(
            {
                url: "./source/musiclist.json",
                dataType: "json",
                success: function (data) {
                    let $song_list_content = $(".song_list_content");
                    $.each(data, function (index, ele) {
                        let $item = creatMusicItem(index, ele);
                        $song_list_content.append($item);

                        //默认歌曲
                        player.music = $(".song_list_content > li:first-child").get(0).music;
                        initMusicInfo(player.music);
                    })
                }
            }
        )
        
        function creatMusicItem(index, music) {
            let $item = $(`
            <li class="song">
                <div class="song_list_item">
                    <div class="song_list_check sprite"></div>
                    <div class="song_list_number">${index + 1}</div>
                    <div class="song_list_item_name">${music.name}</div>
                    <div class="song_list_item_menu">
                        <a href="javascript:;" class="list_menu_item_play sprite_song_control" title="播放"></a
                        ><a href="javascript:;" class="list_menu_item_add sprite_song_control" title="添加到歌单"></a
                        ><a href="javascript:;" class="list_menu_item_down sprite_song_control" title="下载"></a
                        ><a href="javascript:;" class="list_menu_item_share sprite_song_control" title="分享"></a>
                    </div>
                    <div class="song_list_item_author"><a href="javascript:;">${music.singer}</a></div>
                    <div class="song_list_item_time">${music.time}</div>
                    <div><a href="javascript:;" class="song_list_item_delete sprite_song_control" title="删除"></a></div>
                </div>
            </li>`);

            music.index = index;
            $item.get(0).music = music;

            return $item;
        }

        //单列歌曲
        const $song_list = $(".song_list");

        //歌曲选择框鼠标移入移出处理
        $song_list.delegate(".song_list_check", "mouseenter", function () {
            $(this).css("border-color", "rgba(255,255,255,1)");
        })
        $song_list.delegate(".song_list_check", "mouseleave", function () {
            if(!$(this).hasClass("song_list_checked")) {
                $(this).css("border-color", "rgba(225,225,225,.2)");
            }
        })

        //歌曲选择框鼠标点击处理
        $song_list.delegate(".song_list_check", "click", function () {
            $(this).toggleClass("song_list_checked");
            if($(this).hasClass("song_list_checked")){
                //如果选中的是全选按钮
                if($(this).hasClass("song_list_all_check")){
                    $(".song_list_check").addClass("song_list_checked").css("border-color", "rgba(255,255,255,1)");
                }
                else{ //或者所有框都被选中
                    if($(".song_list_content .song_list_check").not(".song_list_checked").length === 0){
                        $(".song_list_check").addClass("song_list_checked").css("border-color", "rgba(255,255,255,1)");
                    }
                }
            }
            else{
                //如果选中的是全选按钮
                if($(this).hasClass("song_list_all_check")){
                    $(".song_list_check").not(".song_list_all_check").removeClass("song_list_checked").css("border-color", "rgba(255,255,255,.2)");
                }
                else{
                    $(".song_list_all_check").css("border-color", "rgba(255,255,255,.2)");
                }
                $(".song_list_all_check").removeClass("song_list_checked");
            }
        })

        //单列歌曲控制按钮事件
        $song_list.delegate(".song_list_item_menu > a:first-child", "click", function () {
            const $currentPlaySong = $(this).parents(".song");
            player.playMusic($currentPlaySong.get(0).music);
            if(player.audio.paused){
                $(this).removeClass("list_menu_item_pause").addClass("list_menu_item_play");
                $(".btn_play").removeClass("btn_play_pause");
            }
            else{
                $(this).addClass("list_menu_item_pause").removeClass("list_menu_item_play");
                $(".song_list_item_menu > a").not(this).removeClass("list_menu_item_pause").addClass("list_menu_item_play");
                $(".btn_play").addClass("btn_play_pause");
            }
            $currentPlaySong.addClass("hover").siblings().removeClass("hover");
            initMusicInfo(player.music);
        })

        //底部控制按钮事件
        $(".btn_play").click(function () {
            let musicIndex = player.musicIndex;

            if(musicIndex === -1){
                musicIndex = 0;
            }
            $(".song_list_content > li").eq(musicIndex).find(".song_list_item_menu > a:first-child")
                .trigger("click");
        })

        $(".btn_prev").click(function () {
            let musicIndex = player.musicIndex;

            if(musicIndex > 0){
                musicIndex --;
            }
            else{
                musicIndex = $(".song_list_content > li:last-child").get(0).music.index;
            }
            $(".song_list_content > li").eq(musicIndex).find(".song_list_item_menu > a:first-child")
                .trigger("click");
            initMusicInfo(player.music);
        })

        $(".btn_next").click(function () {
            let musicIndex = player.musicIndex;

            if(musicIndex === -1){
                musicIndex = 1;
            }
            else if(musicIndex < $(".song_list_content > li:last-child").get(0).music.index){
                musicIndex ++;
            }
            else{
                musicIndex = 0;
            }
            $(".song_list_content > li").eq(musicIndex).find(".song_list_item_menu > a:first-child")
                .trigger("click");
            initMusicInfo(player.music);
        })

        //切换歌曲时更新歌曲信息
        function initMusicInfo(music) {
            $(".footer_music_name").text(music.name);
            $(".footer_singer_name").text(music.singer);
            $(".footer_middle_time").text("00:00" + " / " + music.time);
            $(".song_info_name > a").text(music.name);
            $(".song_info_singer > a").text(music.singer);
            $(".song_info_album > a").text(music.album);
            $(".song_info_pic").attr("src", music.cover);
            $(".player_bg").css("background-image", "url(" + music.cover + ")");
            $(".footer_progress_play").css("width", 0 + "%");
        }

        //歌曲播放时更新进度条和歌词
        player.musicTimeUpdate(function (currentTime, duration, timeStr) {
            $(".footer_middle_time").text(timeStr);
            $(".footer_progress_play").css("width", currentTime/duration*100 + "%");
        })

        //默认音量为20%
        setVolume(0.2);

        //调节音量
        $(".player_voice").click(function (event) {
            const voiceStart = $(".voice_progress").offset().left;
            const voiceClick = event.pageX;
            const offset = voiceClick - voiceStart;
            if(offset < 0) return;
            setVolume(offset/$(".voice_progress").width());
        })

        //静音
        $(".btn_voice").click(function () {
            $(this).toggleClass("btn_voice_mute");
            if($(this).hasClass("btn_voice_mute")) {
                player.muted(true);
            }
            else{
                player.muted(false);
            }
        })

        //设置音量，同时更新音量进度条，newVolume: 0 ~ 1
        function setVolume(newVolume) {
            player.volume = newVolume;
            $(".voice_progress_play").css("width", 100*player.volume + "%");
        }

        //mScrollbar
        $(".song_list").mCustomScrollbar({ scrollInertia: 500 ,
                                           mouseWheel:{ scrollAmount: 100 },
                                           autoHideScrollbar: false
                                         });

        //歌曲列表顶部工具栏的鼠标移入移出处理(用css代替)
        // $(".mod_btn").hover(function () {
        //     $(this).css({"border-color": "rgba(255, 255, 255, 1)", "opacity": "1"});
        //     $(this).find("i").css("opacity", "1");
        // },function () {
        //     $(this).css({"border-color": "rgba(201, 201, 201, .2)", "opacity": ".8"});
        //     $(this).find("i").css("opacity", ".6");
        // })

        // // 歌曲列表控制工具的显示与隐藏(使用css代替)
        // $(".song_list_content").delegate("li", "mouseenter", function () {
        //     $(this).find(".song_list_item_menu > a").css("display","inline-block");
        //     $(this).find(".song_list_item_delete").css("display","inline-block");
        //     $(this).find(".song_list_item_time").css("display","none");
        // });
        //
        // $(".song_list_content").delegate("li", "mouseleave", function () {
        //     $(this).find(".song_list_item_menu > a").css("display","none");
        //     $(this).find(".song_list_item_delete").css("display","none");
        //     $(this).find(".song_list_item_time").css("display","inline-block");
        // });
    }
)