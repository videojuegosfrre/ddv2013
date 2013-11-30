var InGameMenuLayer = cc.LayerColor.extend({
    _debug:cc.COCOS2D_DEBUG,

    init:function()
    {
        this._super(new cc.Color4B(0, 0, 0, 255));

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

        var menuItem0 = new cc_MenuItemFont.create("Debug menú",
                                                   this.showDebugMenu,
                                                   this);
        var menuItem1 = new cc_MenuItemFont.create("Volver al juego",
                                                   this.backToGame,
                                                   this);
        var menuItem2 = new cc_MenuItemFont.create("Comenzar nuevo juego",
                                                   this.startNewGame,
                                                   this);
        var menuItem3 = new cc_MenuItemFont.create("Opciones",
                                                   this.setPreferences,
                                                   this);
        var menuItem4 = new cc_MenuItemFont.create("Salir del juego",
                                                   this.exitGame,
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

    backToGame:function () {
        cc.log("Volver al juego.");
        cc.AudioEngine.getInstance().playEffect(s_menu_laser_effect, false);
        this.stopBGMusic();
    },

    setPreferences:function () {
        cc.log("Ver/Establecer opciones.");
        cc.AudioEngine.getInstance().playEffect(s_menu_laser_effect, false);
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

    showDebugMenu:function () {
        cc.log("Mostrar menú de depuración.");
    },

    startNewGame:function () {
        cc.log("Comenzar nuevo juego.");
    },

    exitGame:function () {
        cc.log("Salir del juego.");
        cc.AudioEngine.getInstance().playEffect(s_menu_laser_effect, false);
        this.stopBGMusic();
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
        // Volver al menú principal.
        if (lastEvent == 27) {
            this.exitGame();
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
