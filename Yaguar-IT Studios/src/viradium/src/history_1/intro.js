var lastEvent = -1;
var heldKeys = {};

var sprites = {
        cossino: {
            obj: null,
            FNStandPrefix: "stand",
            FNStandIdx: 1,
            FNStandDir: 1,
            FNRunPrefix: "run",
            FNRunIdx: 1,
        }
};


var IntroHist1Layer = cc.LayerColor.extend({
    _debug:cc.COCOS2D_DEBUG,

    init:function()
    {
        this._super(new cc.Color4B(0, 0, 0, 255), 200, 200);

        var director = cc.Director.getInstance();
        var wSizeWidth = director.getWinSize().width;
        var wSizeHeight = director.getWinSize().height;
        var audioEngine = cc.AudioEngine.getInstance();
        var systemCapabilities = sys.capabilities;
        var cc_Point = cc.Point;
        var cc_MenuItemFont = cc.MenuItemFont;
        var menuItemX, menuItemY = 0;
        var cache = cc.SpriteFrameCache.getInstance();

        audioEngine.setEffectsVolume(0.5);
        audioEngine.setMusicVolume(0.5);

        menuItemX = wSizeWidth / 2;
        menuItemY = wSizeHeight / 2;

        // Create new label
        var menuTitulo = cc.LabelTTF.create("Introducción Historia 1",
                                            "Courier New",
                                            30);

        // Position the label on the center of the screen
        menuTitulo.setPosition(new cc_Point(menuItemX, wSizeHeight - 35));
        // Add the label as a child to this layer
        this.addChild(menuTitulo);

        // -------------------------------------------------------------------
        // Create Cossino sprite
        cache.addSpriteFrames(s_cossino_plist, s_cossino_img);
        sprites.cossino.obj = cc.Sprite.createWithSpriteFrameName(sprites.cossino.FNStandPrefix + "1.png");
        sprites.cossino.obj.setPosition(new cc_Point(menuItemX, menuItemY));
        sprites.cossino.obj.setScale(1);
        sprites.cossino.FNStandDir = 1;
        this.addChild(sprites.cossino.obj);

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
        cc.log("Scheduling Cossino update...");
        this.schedule(this.updateCossino, 0.3);

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

        // Se presionó la tecla ESC.
        // "Salir" de la aplicación.
        if (lastEvent == 27) {
            this.exitApp();
        }

        // Mostrar teclas presionadas
        cc.log(heldKeys);
    },

    onKeyUp:function (e) {
        lastEvent = null;
        delete heldKeys[e];
    },

    update:function (dt) {

    },

    updateCossino: function (dt) {
        var director = cc.Director.getInstance();
        var wSizeWidth = director.getWinSize().width;
        var wSizeHeight = director.getWinSize().height;
        var menuItemX, menuItemY = 0;

        var cossino_pj = sprites.cossino;

        menuItemX = wSizeWidth / 2;
        menuItemY = wSizeHeight / 2;

        if (cossino_pj.FNStandIdx > 3) {
            cossino_pj.FNStandDir = -1;
        }
        else if (cossino_pj.FNStandIdx < 2) {
            cossino_pj.FNStandDir = 1;
        }

        // cc.log(cossino_pj.FNStandIdx);

        var indexAsString = '';
        indexAsString = cossino_pj.FNStandIdx.toString();

        this.removeChild(cossino_pj.obj);

        cossino_pj.obj = cc.Sprite.createWithSpriteFrameName(
            cossino_pj.FNStandPrefix + indexAsString + ".png"
        );

        cossino_pj.FNStandIdx += cossino_pj.FNStandDir;

        cossino_pj.obj.setPosition(new cc.Point(menuItemX, menuItemY));
        cossino_pj.obj.setScale(1);

        this.addChild(cossino_pj.obj);
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
