var DebugMenuLayer = cc.LayerColor.extend({
    _debug:cc.COCOS2D_DEBUG,

    init:function()
    {
        this._super(new cc.Color4B(0, 0, 128, 255));

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
        var menuTitulo = cc.LabelTTF.create("Debug Menú", "Courier New", 30);
        // Position the label on the center of the screen
        menuTitulo.setPosition(new cc_Point(menuItemX, wSizeHeight - 35));
        // Add the label as a child to this layer
        this.addChild(menuTitulo);

        cc_MenuItemFont.setFontName("Courier New");
        cc_MenuItemFont.setFontSize(20);

        var menuItem0 = new cc_MenuItemFont.create("Ver Introducción Historia 1",
                                                   this.showIntroHist1,
                                                   this);
        var menuItem1 = new cc_MenuItemFont.create("Ver Introducción Historia 2",
                                                   this.showIntroHist2,
                                                   this);
        var menuItem2 = new cc_MenuItemFont.create("Ver Historia 1: Nivel 1",
                                                   this.showHist1Lvl1,
                                                   this);
        var menuItem3 = new cc_MenuItemFont.create("Ver Historia 1: Nivel 2",
                                                   this.showHist1Lvl2,
                                                   this);
        var menuItem4 = new cc_MenuItemFont.create("Ver Historia 1: Nivel 3",
                                                   this.showHist1Lvl3,
                                                   this);
        var menuItem5 = new cc_MenuItemFont.create("Ver Historia 2: Nivel 1",
                                                   this.showHist2Lvl1,
                                                   this);
        var menuItem6 = new cc_MenuItemFont.create("Ver Historia 2: Nivel 2",
                                                   this.showHist2Lvl2,
                                                   this);
        var menuItem7 = new cc_MenuItemFont.create("Ver Historia 2: Nivel 3",
                                                   this.showHist2Lvl3,
                                                   this);
        var menuItem8 = new cc_MenuItemFont.create("Volver al menú principal",
                                                   this.backToMainMenu,
                                                   this);

        menuItem0.setPosition(new cc_Point(menuItemX, menuItemY + 120));
        menuItem1.setPosition(new cc_Point(menuItemX, menuItemY + 90));
        menuItem2.setPosition(new cc_Point(menuItemX, menuItemY + 60));
        menuItem3.setPosition(new cc_Point(menuItemX, menuItemY + 30));
        menuItem4.setPosition(new cc_Point(menuItemX, menuItemY));
        menuItem5.setPosition(new cc_Point(menuItemX, menuItemY - 30));
        menuItem6.setPosition(new cc_Point(menuItemX, menuItemY - 60));
        menuItem7.setPosition(new cc_Point(menuItemX, menuItemY - 90));
        menuItem8.setPosition(new cc_Point(menuItemX, menuItemY - 120));

        var main_menu = cc.Menu.create(menuItem0,
                                       menuItem1,
                                       menuItem2,
                                       menuItem3,
                                       menuItem4,
                                       menuItem5,
                                       menuItem6,
                                       menuItem7,
                                       menuItem8);

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

    showIntroHist1:function () {
        cc.log("Mostrar introducción a Historia 1.");
        cc.AudioEngine.getInstance().playEffect(s_effect, false);
        this.stopBGMusic();
    },

    showIntroHist2:function () {
        cc.log("Mostrar introducción a Historia 2.");
        cc.AudioEngine.getInstance().playEffect(s_effect, false);
        this.stopBGMusic();
    },

    showHist1Lvl1:function () {
        cc.log("Mostrar Historia 1: Nivel 1");
        cc.AudioEngine.getInstance().playEffect(s_effect, false);
        this.stopBGMusic();
    },

    showHist1Lvl2:function () {
        cc.log("Mostrar Historia 1: Nivel 2");
        cc.AudioEngine.getInstance().playEffect(s_effect, false);
        this.stopBGMusic();
    },

    showHist1Lvl3:function () {
        cc.log("Mostrar Historia 1: Nivel 3");
        cc.AudioEngine.getInstance().playEffect(s_effect, false);
        this.stopBGMusic();
    },

    showHist2Lvl1:function () {
        cc.log("Mostrar Historia 2: Nivel 1");
        cc.AudioEngine.getInstance().playEffect(s_effect, false);
        this.stopBGMusic();
    },

    showHist2Lvl2:function () {
        cc.log("Mostrar Historia 2: Nivel 1");
        cc.AudioEngine.getInstance().playEffect(s_effect, false);
        this.stopBGMusic();
    },

    showHist2Lvl3:function () {
        cc.log("Mostrar Historia 2: Nivel 1");
        cc.AudioEngine.getInstance().playEffect(s_effect, false);
        this.stopBGMusic();
    },

    backToMainMenu:function () {
        cc.log("Volver al menú principal.");
        cc.AudioEngine.getInstance().playEffect(s_effect, false);
        this.stopBGMusic();

        var mainScene = cc.TransitionFade.create(1,
                                                 new MainMenuScene(),
                                                 new cc.Color3B(0, 0, 0));

        cc.Director.getInstance().replaceScene(mainScene);
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
            this.backToMainMenu();
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


var DebugMenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        this.setTag(TAGS.ESCENAS.DEBUG_MENU);

        var mainMenuL = new DebugMenuLayer();
        mainMenuL.init();
        this.addChild(mainMenuL, 0, TAGS.CAPAS.DEBUG_MENU);

        cc.log("Children Count: " + this.getChildrenCount());
    }
});
