// Menu Resources
var menu_img_dir = "resources/menu/img/";
var menu_music_dir = "resources/menu/music/";

// History 1 Resources
var h_1_img_dir = "resources/history_1/img/";
var h_1_music_dir = "resources/history_1/music/";

// History 2 Resources
var h_2_img_dir = "resources/history_2/img/";
var h_2_music_dir = "resources/history_2/music/";

var s_background_music = menu_music_dir + "background";
var s_background_music_mp3 = s_background_music + ".mp3";
var s_background_music_wav = s_background_music + ".wav";
var s_background_music_ogg = s_background_music + ".ogg";

var s_effect = menu_music_dir + "effect2";
var s_effect_mp3 = s_effect + ".mp3";
var s_effect_wav = s_effect + ".wav";
var s_effect_ogg = s_effect + ".ogg";

var s_cossino_img = h_1_img_dir + "cossino.png";
var s_cossino_plist = h_1_img_dir + "cossino.plist";

var s_font_bitmap_img = menu_img_dir + "font_bitmap.png";
var s_font_bitmap_fnt = menu_img_dir + "font_bitmap.fnt";


var g_resources = [
    //image
    {type:"image", src:s_cossino_img},
    {type:"image", src:s_font_bitmap_img},

    //plist
    {type:"plist", src:s_cossino_plist},

    //fnt
    {type:"fnt", src:s_font_bitmap_fnt},

    //tmx

    //bgm
    {type:"sound", src:s_background_music_ogg},
    {type:"sound", src:s_background_music_mp3},
    {type:"sound", src:s_background_music_wav},

    //effect
    {type:"sound", src:s_effect_ogg},
    {type:"sound", src:s_effect_mp3},
    {type:"sound", src:s_effect_wav}
];

var TAGS = {
    ESCENAS: {
        MAIN_MENU: 0,
        DEBUG_MENU: 1,
        OPTIONS_MENU: 2,
        HISTORY_1: {
            INTRO: 10,
            LEVEL_1: 11,
            LEVEL_2: 12,
            LEVEL_3: 13
        },
        HISTORY_2: {
            INTRO: 30,
            LEVEL_1: 31,
            LEVEL_2: 32,
            LEVEL_3: 33
        }
    },
    CAPAS: {
        DEFAULT: 100,
        MAIN_MENU: 101,
        DEBUG_MENU: 102,
        FONDO_TRASERO: 103,
        FONDO_INTERMEDIO: 104,
        FONDO_FRONTAL: 105,
    }
};
