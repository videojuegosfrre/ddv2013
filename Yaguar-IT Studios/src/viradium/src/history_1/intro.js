var lastEvent = -1;
var heldKeys = {};

var CHR_STATUS = {
    STAND: 0,
    WALK: 1,
    RUN: 2,
    JUMP: 3
};

var CHR_DIRECTION = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};


var CossinoSprite = cc.Sprite.extend({
    _currentDirection: CHR_DIRECTION.RIGHT,
    _currentStatus: CHR_STATUS.STAND,
    _FNStandPrefix: "stand",
    _FNStandIdx: 1,
    _FNStandDir: 1,
    _FNRunPrefix: "run",
    _FNRunIdx: 1,
    _status: CHR_STATUS.STAND,
    _currentPos: null,

    ctor:function () {
        cc.log("Constructor: CossinoSprite");
        this._super();

        var cache = cc.SpriteFrameCache.getInstance();
        cache.addSpriteFrames(s_cossino_plist, s_cossino_img);

        // this.initWithSpriteFrameName(this._FNStandPrefix + "1.png");
        this.init();

        cc.log("Scheduling Cossino Stand Update...");
        this.schedule(this.updateStand, 0.4);
    },

    update:function (dt) {
        switch (this._currentStatus) {
            case CHR_STATUS.STAND:
                this.updateStand();
                break;
            case CHR_STATUS.WALK:
                this.updateWalk();
                break;
            case CHR_STATUS.RUN:
                this.updateRun();
                break;
            case CHR_STATUS.JUMP:
                this.updateJump();
                break;
        }

        switch (this._currentDirection) {
            case CHR_DIRECTION.RIGHT:
                this.setFlippedX(false);
                break;
            case CHR_DIRECTION.LEFT:
                this.setFlippedX(true);
                break;
        }
    },

    updateStand:function () {
        var director = cc.Director.getInstance();
        var wSizeWidth = director.getWinSize().width;
        var wSizeHeight = director.getWinSize().height;
        var menuItemX, menuItemY = 0;

        menuItemX = wSizeWidth / 2;
        menuItemY = wSizeHeight / 2;

        if (this._FNStandIdx > 3) {
            this._FNStandDir = -1;
        }
        else if (this._FNStandIdx < 2) {
            this._FNStandDir = 1;
        }

        // cc.log(cossino_pj.FNStandIdx);

        var indexAsString = '';
        indexAsString = this._FNStandIdx.toString();
        this._FNStandIdx += this._FNStandDir;

        this.removeAllChildren(true);

        next_frame = cc.Sprite.createWithSpriteFrameName(
            this._FNStandPrefix + indexAsString + ".png"
        );

        this.addChild(next_frame);
    },

    updateWalk:function () {

    },

    updateRun:function () {
        var director = cc.Director.getInstance();
        var wSizeWidth = director.getWinSize().width;
        var wSizeHeight = director.getWinSize().height;
        var menuItemX, menuItemY = 0;

        menuItemX = wSizeWidth / 2;
        menuItemY = wSizeHeight / 2;

        if (this._FNStandIdx > 3) {
            this._FNStandDir = -1;
        }
        else if (this._FNStandIdx < 2) {
            this._FNStandDir = 1;
        }

        // cc.log(cossino_pj.FNStandIdx);

        var indexAsString = '';
        indexAsString = this._FNStandIdx.toString();
        this._FNStandIdx += this._FNStandDir;

        this.removeAllChildren(true);

        next_frame = cc.Sprite.createWithSpriteFrameName(
            this._FNStandPrefix + indexAsString + ".png"
        );

        this.addChild(next_frame);
    },

    updateJump:function () {

    },

    handleKey:function (e) {

    },

    handleTouch:function (touchLocation) {

    },

    handleTouchMove:function (touchLocation) {

    }
});


var IntroHist1Layer = cc.LayerColor.extend({
    _debug:cc.COCOS2D_DEBUG,

    init:function()
    {
        cc.log("Init Function: IntroHist1Layer.");
        this._super(new cc.Color4B(0, 0, 0, 255), 200, 200);

        var director = cc.Director.getInstance();
        var wSizeWidth = director.getWinSize().width;
        var wSizeHeight = director.getWinSize().height;
        var audioEngine = cc.AudioEngine.getInstance();
        var systemCapabilities = sys.capabilities;
        var cc_Point = cc.Point;
        var cc_MenuItemFont = cc.MenuItemFont;
        var menuItemX, menuItemY = 0;

        audioEngine.setEffectsVolume(0.5);
        audioEngine.setMusicVolume(0.5);

        menuItemX = wSizeWidth / 2;
        menuItemY = wSizeHeight / 2;

        // Create new label
        var menuTitulo = cc.LabelTTF.create("Introducción Historia 1",
                                            "Courier New",
                                            30);

        cc.log("Crear título de escena...");
        // Position the label on the center of the screen
        menuTitulo.setPosition(new cc_Point(menuItemX, wSizeHeight - 35));
        // Add the label as a child to this layer
        this.addChild(menuTitulo);

        // -------------------------------------------------------------------
        // Create Cossino sprite
        cc.log("Crear sprite de Cossino...");
        cossino_pj = new CossinoSprite();
        cossino_pj.setPosition(new cc_Point(menuItemX, menuItemY));
        cossino_pj.setScale(1);
        cc.log(cossino_pj);

        cc.log("Agregar sprite Cossino a escena.");
        this.addChild(cossino_pj);

        cc.log("Posición inicial: " + cossino_pj.getPosition().x + " " + cossino_pj.getPosition().y);

        // Check for input support -------------------------------------------
        // Check for mouse support
        if ('mouse' in systemCapabilities) {
            cc.log("Mouse Supported. Enabling...");
            this.setMouseEnabled(true);
        }
        else {
            cc.log("Mouse Not Supported");
        }

        // Check for keyboard support
        if ('keyboard' in systemCapabilities) {
            cc.log("Keyboard Supported. Enabling...");
            this.setKeyboardEnabled(true);
        }
        else {
            cc.log("Keyboard Not Supported");
        }

        //Check for touch support
        if ('touches' in systemCapabilities) {
            cc.log("Touch Supported. Enabling...");
            this.setTouchEnabled(true);
        }
        else {
            cc.log("Touch Not Supported");
        }

        // Schedule update
        cc.log("Scheduling update...");
        this.scheduleUpdate();

        return this;
    },

    onEnter:function () {
        this._super();
        cc.log("Reproducir música de fondo.");
        cc.AudioEngine.getInstance().playMusic(s_background_music, true);
        cc.log("ZOrder IntroHist1Layer: " + this.getZOrder());
    },

    playNewGame:function () {
        cc.log("Comenzar nuevo juego.");
        cc.AudioEngine.getInstance().playEffect(s_effect, false);
        this.stopBGMusic();
    },

    resumeGame:function () {
        cc.log("Continuar juego.");
        cc.AudioEngine.getInstance().playEffect(s_effect, false);
        this.stopBGMusic();
    },

    setPreferences:function () {
        cc.log("Ver/Establecer opciones.");
        cc.AudioEngine.getInstance().playEffect(s_effect, false);
        this.stopBGMusic();
    },

    stopBGMusic: function () {
        var audio_engine = cc.AudioEngine.getInstance();

        if(audio_engine.isMusicPlaying())
        {
            cc.log("Detener música de fondo.");
            audio_engine.stopMusic();
        }
        else {
            cc.log("No hay música de fondo en reproducción.");
        }
    },

    exitApp:function () {
        cc.log("Salir del juego.");
        cc.AudioEngine.getInstance().playEffect(s_effect, false);
        this.stopBGMusic();
    },

    showDebugMenu:function () {
        cc.log("Show debug menu.");
        cc.AudioEngine.getInstance().playEffect(s_effect, false);
        this.stopBGMusic();

        var debugScene = cc.TransitionFade.create(1,
                                                  new DebugMenuScene(),
                                                  new cc.Color3B(0, 0, 0));

        cc.Director.getInstance().replaceScene(debugScene);
    },

    onMouseDown:function (event) {
        this.showMouseButtonInfo(event, "Down");
    },

    onMouseUp:function (event) {
        this.showMouseButtonInfo(event, "Up");
    },

    onMouseMoved:function (event) {
    },

    onMouseDragged:function (event) {
        this.showMouseButtonInfo(event, "Dragged");
    },

    onRightMouseDown:function (event) {
        this.showMouseButtonInfo(event, "Down");
    },

    onRightMouseUp:function (event) {
        this.showMouseButtonInfo(event, "Up");
    },

    onRightMouseMoved:function (event) {
    },

    onRightMouseDragged:function (event) {
        this.showMouseButtonInfo(event, "Dragged");
    },

    onScrollWheel:function (event) {
        cc.log("Scroll Wheel - Delta: " + event.getWheelDelta());
    },

    onKeyDown:function (e) {
        if (lastEvent && lastEvent == e) {
            return;
        }

        lastEvent = e;
        heldKeys[e] = true;

        // Mostrar teclas presionadas
        cc.log(heldKeys);

        switch (lastEvent) {
            // Se presionó la tecla ESC.
            // "Salir" de la aplicación.
            case cc.KEY.escape:
                this.exitApp();
                break;
            default:
                return;
        }
    },

    onKeyUp:function (e) {
        lastEvent = null;
        delete heldKeys[e];
    },

    update:function (dt) {

    },

    showMouseButtonInfo:function (event, trigger) {
        var button = null;

        switch (event._button) {
            case 0:
                button = 'Izquierdo';
                break;
            case 1:
                button = 'Central';
                break;
            case 2:
                button = 'Derecho';
                break;
            default:
                button = 'Desconocido';
        }

        cc.log("Mouse " + trigger + " - Button: " + button + " - Pos: (" +
               event.getLocation().x + ", " +
               event.getLocation().y + ")");
    }
});


var IntroHist1Scene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        this.setTag(TAGS.ESCENAS.MAIN_MENU);

        var mainMenuL = new IntroHist1Layer();
        mainMenuL.init();
        this.addChild(mainMenuL, 0, TAGS.CAPAS.MAIN_MENU);

        cc.log("Children Count: " + this.getChildrenCount());
    }
});
