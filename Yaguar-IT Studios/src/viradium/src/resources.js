// Menu Resources
var menu_img_dir = "resources/menu/img/";
var menu_music_dir = "resources/menu/music/";

// History 1 Resources
var h_1_img_dir = "resources/history_1/img/";
var h_1_music_dir = "resources/history_1/music/";

// History 2 Resources
var h_2_img_dir = "resources/history_2/img/";
var h_2_music_dir = "resources/history_2/music/";

var s_HelloWorld = menu_img_dir + "HelloWorld.jpg";
var s_CloseNormal = menu_img_dir + "CloseNormal.png";
var s_CloseSelected = menu_img_dir + "CloseSelected.png";
var s_jet = menu_img_dir + "Jet.png";

var s_background_music = menu_music_dir + "background";
var s_background_music_mp3 = s_background_music + ".mp3";
var s_background_music_wav = s_background_music + ".wav";
var s_background_music_ogg = s_background_music + ".ogg";

var s_effect = menu_music_dir + "effect2";
var s_effect_mp3 = s_effect + ".mp3";
var s_effect_wav = s_effect + ".wav";
var s_effect_ogg = s_effect + ".ogg";

var g_resources = [
    //image
    {src:s_CloseNormal},
    {src:s_HelloWorld},
    {src:s_CloseSelected},
    {src:s_jet},

    //plist

    //fnt

    //tmx

    //bgm
    {type:"image", src:s_background_music_ogg},
    {type:"image", src:s_background_music_mp3},
    {type:"image", src:s_background_music_wav},

    //effect
    {type:"sound", src:s_effect_ogg},
    {type:"sound", src:s_effect_mp3},
    {type:"sound", src:s_effect_wav}
];
