var lastEvent = -1;
var heldKeys = {};


var MainMenuLayer = cc.LayerColor.extend({
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

        audioEngine.setEffectsVolume(0.5);
        audioEngine.setMusicVolume(0.5);

        cc_MenuItemFont.setFontName("Arial");
        cc_MenuItemFont.setFontSize(30);

        var menuItem0 = new cc_MenuItemFont.create("Debug menu",
                                                        this.showDebugMenu,
                                                        this);
        var menuItem1 = new cc_MenuItemFont.create("Nuevo juego",
                                                   this.playNewGame,
                                                   this);
        var menuItem2 = new cc_MenuItemFont.create("Continuar juego",
                                                   this.resumeGame,
                                                   this);
        var menuItem3 = new cc_MenuItemFont.create("Opciones",
                                                   this.setPreferences,
                                                   this);
        var menuItem4 = new cc_MenuItemFont.create("Salir",
                                                   this.exitApp,
                                                   this);

        menuItemX = wSizeWidth / 2;
        menuItemY = wSizeHeight / 2;

        menuItem0.setPosition(new cc_Point(menuItemX, menuItemY + 100));
        menuItem1.setPosition(new cc_Point(menuItemX, menuItemY + 50));
        menuItem2.setPosition(new cc_Point(menuItemX, menuItemY));
        menuItem3.setPosition(new cc_Point(menuItemX, menuItemY - 50));
        menuItem4.setPosition(new cc_Point(menuItemX, menuItemY - 100));

        var main_menu = cc.Menu.create(menuItem0,
                                       menuItem1,
                                       menuItem2,
                                       menuItem3,
                                       menuItem4);

        main_menu.setPosition(new cc_Point(0, 0));

        this.addChild(main_menu);

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
        cc.log("ZOrder MainMenuLayer: " + this.getZOrder());
    },

    playNewGame:function () {
        cc.log("Comenzar nuevo juego.");
        cc.AudioEngine.getInstance().playEffect(s_effect, false);
        this.stopBGMusic();

        var hist1Intro = cc.TransitionFade.create(1,
                                                  new IntroHist1Scene(),
                                                  new cc.Color3B(0, 0, 0));

        cc.Director.getInstance().replaceScene(hist1Intro);
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

    update: function (dt) {
        // cc.log(heldKeys);
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


var MainMenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        this.setTag(TAGS.ESCENAS.MAIN_MENU);

        var mainMenuL = new MainMenuLayer();
        mainMenuL.init();
        this.addChild(mainMenuL, 0, TAGS.CAPAS.MAIN_MENU);

        cc.log("Children Count: " + this.getChildrenCount());
    }
});
