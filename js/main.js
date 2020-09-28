$(
    function () {

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
                    })
                }
            }
        )
        
        function creatMusicItem(index, music) {
            return $(`
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
        }

        //歌曲选择框鼠标移入移出处理
        $(".song_list").delegate(".song_list_check", "mouseenter", function () {
            $(this).css("border-color", "rgba(255,255,255,1)");
        })
        $(".song_list").delegate(".song_list_check", "mouseleave", function () {
            if(!$(this).hasClass("song_list_checked")) {
                $(this).css("border-color", "rgba(225,225,225,.2)");
            }
        })

        //歌曲选择框鼠标点击处理
        $(".song_list").delegate(".song_list_check", "click", function () {
            $(this).toggleClass("song_list_checked");
            if($(this).hasClass("song_list_checked")){
                //如果选中的是全选按钮
                if($(this).hasClass("song_list_all_check")){
                    $(".song_list_check").addClass("song_list_checked").css("border-color", "rgba(255,255,255,1)");
                }
                else{ //或者所有框都被选中
                    if($(".song_list_content .song_list_check").not(".song_list_checked").length === 0){
                        $(".song_list_check").addClass("song_list_checked").css("border-color", "rgba(255,255,255,1)");
                    };
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