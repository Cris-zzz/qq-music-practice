$(
    function () {

        //获取歌曲列表
        $.ajax(
            {
                url: "./source/musiclist.json",
                dataType: "json",
                success: function (data) {
                    let $musicList = $(".song_list_content");
                    $.each(data, function (index, ele) {
                        let $item = creatMusicItem(index, ele);
                        $musicList.append($item);
                    })

                    // 歌曲列表控制工具的显示与隐藏
                    $(".song_list_content > li").hover(function () {
                        $(this).find(".song_list_item_menu > a").css({display: "inline-block"});
                        console.log($(this).find(".song_list_item_menu > a").prop("display"));
                    },function () {
                        $(this).find(".song_list_item_menu > a").css({display: "none"});
                    })
                }
            }
        )
        
        function creatMusicItem(index, music) {
            let $item = $(`
            <li class="song1">
                <div class="song_list_item">
                    <div class="song_list_item_check">
                        <input type="checkbox" class="song_list_item_checkbox">
                    </div>
                    <div class="song_list_number">${index + 1}</div>
                    <div class="song_list_item_name">${music.name}</div>
                    <div class="song_list_item_menu">
                        <a href="javascript:;" class="list_menu_item_play sprite_song_control" title="播放"></a
                        ><a href="javascript:;" class="list_menu_item_add sprite_song_control" title="添加到歌单"></a
                        ><a href="javascript:;" class="list_menu_item_down sprite_song_control" title="下载"></a
                        ><a href="javascript:;" class="list_menu_item_share sprite_song_control" title="分享"></a>
                    </div>
                    <div class="song_list_item_author">${music.singer}</div>
                    <div class="song_list_item_time">${music.time}</div>
                    <div><a href="javascript:;" class="song_list_item_delete sprite_song_control" title="删除"></a></div>
                </div>
            </li>`);
            return $item;
        }
    }
)