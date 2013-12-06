if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/gm, '');
  };
}

/**
 * Array.prototype.[method name] allows you to define/overwrite an objects method
 * needle is the item you are searching for
 * this is a special variable that refers to "this" instance of an Array.
 * returns true if needle is in the array, and false otherwise
 */
Array.prototype.contains = function (v) {
    return arr.indexOf(v) > -1;
};


// Menu Resources
var menu_img_dir = "resources/menu/img/";
var menu_music_dir = "resources/menu/music/";

// History 1 Resources
// ---------------------------------------------------------------------
// Imagen
var h_1_img_dir = "resources/history_1/img/";

var s_cossino_img = h_1_img_dir + "cossino.png";
var s_cossino_plist = h_1_img_dir + "cossino.plist";

var s_bg_h1_layer0_part0 = h_1_img_dir + "background_0_0.png";
var s_bg_h1_layer0_part1 = h_1_img_dir + "background_0_1.png";
var s_bg_h1_layer0_part2 = h_1_img_dir + "background_0_2.png";
var s_bg_h1_layer0_part3 = h_1_img_dir + "background_0_3.png";
var s_bg_h1_layer0_part4 = h_1_img_dir + "background_0_4.png";
var s_bg_h1_layer0_part5 = h_1_img_dir + "background_0_5.png";
var s_bg_h1_layer0_part6 = h_1_img_dir + "background_0_6.png";
var s_bg_h1_layer0_part7 = h_1_img_dir + "background_0_7.png";
var s_bg_h1_layer0_part8 = h_1_img_dir + "background_0_8.png";
var s_bg_h1_layer0_part9 = h_1_img_dir + "background_0_9.png";
var s_bg_h1_layer0_part10 = h_1_img_dir + "background_0_10.png";
var s_bg_h1_layer0_part11 = h_1_img_dir + "background_0_11.png";
var s_bg_h1_layer0_part12 = h_1_img_dir + "background_0_12.png";
var s_bg_h1_layer0_part13 = h_1_img_dir + "background_0_13.png";

var s_bg_h1_layer1_part0 = h_1_img_dir + "background_1_0.png";
var s_bg_h1_layer1_part1 = h_1_img_dir + "background_1_1.png";
var s_bg_h1_layer1_part2 = h_1_img_dir + "background_1_2.png";
var s_bg_h1_layer1_part3 = h_1_img_dir + "background_1_3.png";
var s_bg_h1_layer1_part4 = h_1_img_dir + "background_1_4.png";
var s_bg_h1_layer1_part5 = h_1_img_dir + "background_1_5.png";
var s_bg_h1_layer1_part6 = h_1_img_dir + "background_1_6.png";
var s_bg_h1_layer1_part7 = h_1_img_dir + "background_1_7.png";
var s_bg_h1_layer1_part8 = h_1_img_dir + "background_1_8.png";
var s_bg_h1_layer1_part9 = h_1_img_dir + "background_1_9.png";

var s_bg_h1_layer2_part0 = h_1_img_dir + "background_2_0.png";
var s_bg_h1_layer2_part1 = h_1_img_dir + "background_2_1.png";
var s_bg_h1_layer2_part2 = h_1_img_dir + "background_2_2.png";
var s_bg_h1_layer2_part3 = h_1_img_dir + "background_2_3.png";
var s_bg_h1_layer2_part4 = h_1_img_dir + "background_2_4.png";
var s_bg_h1_layer2_part5 = h_1_img_dir + "background_2_5.png";
var s_bg_h1_layer2_part6 = h_1_img_dir + "background_2_6.png";
var s_bg_h1_layer2_part7 = h_1_img_dir + "background_2_7.png";

var s_espina_1 = h_1_img_dir + "espina_1.png";
var s_espina_2 = h_1_img_dir + "espina_2.png";
var s_espina_3 = h_1_img_dir + "espina_3.png";
var s_bad_alien_1 = h_1_img_dir + "bad_alien.png";

var s_objects_layer_tmx = h_1_img_dir + "objects_layer.tmx";
var s_roca_1_chica = h_1_img_dir + "roca_1_chica.png";
var s_roca_1_media = h_1_img_dir + "roca_1_media.png";
var s_roca_1_grande = h_1_img_dir + "roca_1_grande.png";

var s_rocas_img = h_1_img_dir + "rocas.png";
var s_rocas_plist = h_1_img_dir + "rocas.plist";

var s_viradium_img = h_1_img_dir + "viradium.png";
var s_viradium_plist = h_1_img_dir + "viradium.plist";

// Sonido
var h_1_music_dir = "resources/history_1/music/";

var s_hist_1_acc_1_music = h_1_music_dir + "background/m_hist_1_acc_1";
var s_hist_1_acc_1_music_ogg = s_hist_1_acc_1_music + ".ogg";
var s_hist_1_acc_1_music_mp3 = s_hist_1_acc_1_music + ".mp3";

var s_hist_1_acc_2_music = h_1_music_dir + "background/m_hist_1_acc_1";
var s_hist_1_acc_2_music_ogg = s_hist_1_acc_2_music + ".ogg";
var s_hist_1_acc_2_music_mp3 = s_hist_1_acc_2_music + ".mp3";

var s_hist_1_amb_music = h_1_music_dir + "background/m_hist_1_amb";
var s_hist_1_amb_music_ogg = s_hist_1_amb_music + ".ogg";
var s_hist_1_amb_music_mp3 = s_hist_1_amb_music + ".mp3";

var s_hist_1_intro_music = h_1_music_dir + "background/m_hist_1_intro";
var s_hist_1_intro_music_ogg = s_hist_1_intro_music + ".ogg";
var s_hist_1_intro_music_mp3 = s_hist_1_intro_music + ".mp3";

var s_footstep_dirt_1 = h_1_music_dir + "footsteps/footstep_dirt1";
var s_footstep_dirt_1_mp3 = s_footstep_dirt_1 + ".mp3";
var s_footstep_dirt_1_ogg = s_footstep_dirt_1 + ".ogg";

var s_footstep_dirt_2 = h_1_music_dir + "footsteps/footstep_dirt2";
var s_footstep_dirt_2_mp3 = s_footstep_dirt_2 + ".mp3";
var s_footstep_dirt_2_ogg = s_footstep_dirt_2 + ".ogg";

var s_menu_laser_effect = menu_music_dir + "m_efecto_laser";
var s_menu_laser_effect_ogg = s_menu_laser_effect + ".ogg";
var s_menu_laser_effect_mp3 = s_menu_laser_effect + ".mp3";


// History 2 Resources
// ---------------------------------------------------------------------
var h_2_img_dir = "resources/history_2/img/";
var h_2_music_dir = "resources/history_2/music/";

var s_menu_background_music = menu_music_dir + "m_menu_principal";
var s_menu_background_music_mp3 = s_menu_background_music + ".mp3";
var s_menu_background_music_ogg = s_menu_background_music + ".ogg";

var s_effect = menu_music_dir + "effect2";
var s_effect_mp3 = s_effect + ".mp3";
var s_effect_ogg = s_effect + ".ogg";

var s_font_bitmap_img = menu_img_dir + "font_bitmap.png";
var s_font_bitmap_fnt = menu_img_dir + "font_bitmap.fnt";

var s_pathBlock = h_1_img_dir + "blocks.png";


var g_resources = [
    //image
    {type:"image", src:s_cossino_img},
    {type:"image", src:s_font_bitmap_img},

    {type:"image", src:s_bg_h1_layer0_part0},
    {type:"image", src:s_bg_h1_layer0_part1},
    {type:"image", src:s_bg_h1_layer0_part2},
    {type:"image", src:s_bg_h1_layer0_part3},
    {type:"image", src:s_bg_h1_layer0_part4},
    {type:"image", src:s_bg_h1_layer0_part5},
    {type:"image", src:s_bg_h1_layer0_part6},
    {type:"image", src:s_bg_h1_layer0_part7},
    {type:"image", src:s_bg_h1_layer0_part8},
    {type:"image", src:s_bg_h1_layer0_part9},
    {type:"image", src:s_bg_h1_layer0_part10},
    {type:"image", src:s_bg_h1_layer0_part11},
    {type:"image", src:s_bg_h1_layer0_part12},
    {type:"image", src:s_bg_h1_layer0_part13},
    {type:"image", src:s_bg_h1_layer1_part0},
    {type:"image", src:s_bg_h1_layer1_part1},
    {type:"image", src:s_bg_h1_layer1_part2},
    {type:"image", src:s_bg_h1_layer1_part3},
    {type:"image", src:s_bg_h1_layer1_part4},
    {type:"image", src:s_bg_h1_layer1_part5},
    {type:"image", src:s_bg_h1_layer1_part6},
    {type:"image", src:s_bg_h1_layer1_part7},
    {type:"image", src:s_bg_h1_layer1_part8},
    {type:"image", src:s_bg_h1_layer1_part9},
    {type:"image", src:s_bg_h1_layer2_part0},
    {type:"image", src:s_bg_h1_layer2_part1},
    {type:"image", src:s_bg_h1_layer2_part2},
    {type:"image", src:s_bg_h1_layer2_part3},
    {type:"image", src:s_bg_h1_layer2_part4},
    {type:"image", src:s_bg_h1_layer2_part5},
    {type:"image", src:s_bg_h1_layer2_part6},
    {type:"image", src:s_bg_h1_layer2_part7},

    {type:"image", src:s_espina_1},
    {type:"image", src:s_espina_2},
    {type:"image", src:s_espina_3},
    {type:"image", src:s_bad_alien_1},
    {type:"image", src:s_roca_1_chica},
    {type:"image", src:s_roca_1_media},
    {type:"image", src:s_roca_1_grande},
    {type:"image", src:s_rocas_img},
    {type:"image", src:s_viradium_img},

    //plist
    {type:"plist", src:s_cossino_plist},
    {type:"plist", src:s_rocas_plist},
    {type:"plist", src:s_viradium_plist},

    //fnt
    {type:"fnt", src:s_font_bitmap_fnt},

    //tmx
    {type:"xml", src:s_objects_layer_tmx},

    //bgm
    // Ofrecer al navegador primero el audio en formato .ogg
    // En caso de no soportarlo, realizar fallback a .mp3
    {type:"sound", src:s_menu_background_music_ogg},
    {type:"sound", src:s_menu_background_music_mp3},
    {type:"sound", src:s_hist_1_acc_1_music_ogg},
    {type:"sound", src:s_hist_1_acc_1_music_mp3},
    {type:"sound", src:s_hist_1_acc_2_music_ogg},
    {type:"sound", src:s_hist_1_acc_2_music_mp3},
    {type:"sound", src:s_hist_1_amb_music_ogg},
    {type:"sound", src:s_hist_1_amb_music_mp3},
    {type:"sound", src:s_hist_1_intro_music_ogg},
    {type:"sound", src:s_hist_1_intro_music_mp3},

    //effect
    {type:"sound", src:s_footstep_dirt_1_ogg},
    {type:"sound", src:s_footstep_dirt_1_mp3},
    {type:"sound", src:s_footstep_dirt_2_ogg},
    {type:"sound", src:s_footstep_dirt_2_mp3},
    {type:"sound", src:s_menu_laser_effect_ogg},
    {type:"sound", src:s_menu_laser_effect_mp3},
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
        HUD: 106
    }
};

var CHR_STATUS = {
    STAND: 0,
    WALK: 1,
    RUN: 2,
    JUMP: 3,
    NOTSET: 4,
};

var CHR_DIRECTION = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
    NOTSET: 4
};

var TERRAIN_TYPE = {
    DIRT: 0,
    METAL: 1,
    REGULAR: 2,
    WOOD: 3
};

var FOOT_SENSOR = 7676;

var cc_Point = cc.p;
var cc_pAdd = cc.pAdd;
var cc_pSub = cc.pSub;
var cc_Sprite = cc.Sprite;
var cc_sprite_create = cc.Sprite.create;
var cc_DEGREES_TO_RADIANS = cc.DEGREES_TO_RADIANS;
var cc_RADIANS_TO_DEGREES = cc.RADIANS_TO_DEGREES;

var lastEvent = -1;
var heldKeys = {};

var TAG_SPRITE_MANAGER = 8888;
var PTM_RATIO = 30;

var KEYS = {
    GOLEFT: cc.KEY.left,
    GORIGHT: cc.KEY.right,
    JUMP: cc.KEY.w,
    RUN: cc.KEY.s
};

var KEYMOD_FLAGS = {
    ALT: false,
    SHIFT: false,
    CONTROL: false
};

// Box2D
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2ContactListener = Box2D.Dynamics.b2ContactListener;
