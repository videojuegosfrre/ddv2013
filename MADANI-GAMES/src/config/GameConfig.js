var BB = BB || {};

//KEYS
BB.KEYS = [];

//objects of water
BB.CONTAINER = { 
    OBJECTS:[]
};

//life
BB.LIFE = 3;

//score
BB.SCORE = 0;

//sound
BB.SOUND = true;

BB.OBJECT_MOVE_TYPE = {
    ATTACK:0,
    VERTICAL:1,
    HORIZONTAL:2,
    OVERLAP:3,
    ZICZAC:4
};

BB.OBJECT_TYPE = {
    OBJECT:0,
    LIFE:4,
    WOOD:5,
    ENEMY:3
};

//game state
BB.GAME_STATE = {
    HOME:0,
    PLAY:1,
    OVER:2,
	PAUSED:3
};

//Current level
BB.CURRENT_LEVEL = 1;

// the counter of active enemies
BB.ACTIVE_OBJECTS = 0;

BB.DAM_ITEMS = 0;

// N° Layer
BB.UNIT_LAYER = {
	OBJECT:100,
	BEAVER:100
};