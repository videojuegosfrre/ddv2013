var lastEvent;
var heldKeys = {};

var InGameMenuLayer = cc.LayerColor.extend({
    _debug:cc.COCOS2D_DEBUG,

    init:function()
    {
        this._super(new cc.Color4B(0, 0, 0, 255));

        var size = cc.Director.getInstance().getWinSize();
        var audio_engine = cc.AudioEngine.getInstance();

        audio_engine.setEffectsVolume(0.6);
        audio_engine.setMusicVolume(0.4);

        var menuItem1 = new cc.MenuItemFont.create("Nuevo Juego",
                                                   this.playNewGame,
                                                   this);
        var menuItem2 = new cc.MenuItemFont.create("Continuar Juego",
                                                   this.resumeGame,
                                                   this);
        var menuItem3 = new cc.MenuItemFont.create("Opciones",
                                                   this.setPreferences,
                                                   this);
        var menuItem4 = new cc.MenuItemFont.create("Salir",
                                                   this.exitGame,
                                                   this);

        menuItem1.setPosition(new cc.Point(size.width / 2, size.height / 2 + 50));
        menuItem2.setPosition(new cc.Point(size.width / 2, size.height / 2));
        menuItem3.setPosition(new cc.Point(size.width / 2, size.height / 2 - 50));
        menuItem4.setPosition(new cc.Point(size.width / 2, size.height / 2 - 100));

        var menu = cc.Menu.create(menuItem1, menuItem2, menuItem3, menuItem4);
        menu.setPosition(new cc.Point(0, 0));

        this.addChild(menu);

        // Check for mouse support
        if ('mouse' in sys.capabilities) {
            cc.log("Mouse Supported. Enabling...");
            this.setMouseEnabled(true);
        }
        else {
            cc.log("Mouse Not Supported");
        }

        // Check for keyboard support
        if ('keyboard' in sys.capabilities) {
            cc.log("Keyboard Supported. Enabling...");
            this.setKeyboardEnabled(true);
        }
        else {
            cc.log("Keyboard Not Supported");
        }

        //Check for touch support
        if ('touches' in sys.capabilities) {
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
    },

    playNewGame:function () {
        cc.log("Comenzar nuevo juego.");
        cc.AudioEngine.getInstance().playEffect(s_effect);
        this.stopBGMusic();
    },

    resumeGame:function () {
        cc.log("Continuar juego.");
        cc.AudioEngine.getInstance().playEffect(s_effect);
        this.stopBGMusic();
    },

    setPreferences:function () {
        cc.log("Ver/Establecer opciones.");
        cc.AudioEngine.getInstance().playEffect(s_effect);
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

    exitGame:function () {
        cc.log("Salir del juego.");
        cc.AudioEngine.getInstance().playEffect(s_effect);
        this.stopBGMusic();
    },

    onMouseDown:function (event) {
        this._showMouseButtonInfo(event, "Down");
    },

    onMouseUp:function (event) {
        this._showMouseButtonInfo(event, "Up");
    },

    onMouseMoved:function (event) {
    },

    onMouseDragged:function (event) {
        this._showMouseButtonInfo(event, "Dragged");
    },

    onRightMouseDown:function (event) {
        this._showMouseButtonInfo(event, "Down");
    },

    onRightMouseUp:function (event) {
        this._showMouseButtonInfo(event, "Up");
    },

    onRightMouseMoved:function (event) {
    },

    onRightMouseDragged:function (event) {
        this._showMouseButtonInfo(event, "Dragged");
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
    },

    onKeyUp:function (e) {
        lastEvent = null;
        delete heldKeys[e];
    },

    update: function (dt) {
        // cc.log(heldKeys);
    },

    _showMouseButtonInfo:function (event, trigger) {
        if (this._debug !== 0) {
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
    }
});

MainMenu = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new InGameMenuLayer();
        layer.init();
        this.addChild(layer);
    }
});
