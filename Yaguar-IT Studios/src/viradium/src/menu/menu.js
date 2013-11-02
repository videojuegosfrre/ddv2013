var lastEvent;
var heldKeys = {};

var JetSprite = cc.Sprite.extend({
  _currentRotation:0,

  ctor:function(){
    this._super();
    this.initWithFile(s_jet);
  },

  update:function(dt){
    this.setRotation(this._currentRotation);
  },

  handleKey:function(e)
  {
    if(e === cc.KEY.left)
    {
      this._currentRotation--;
    }
    else if(e === cc.KEY.right) {
      this._currentRotation++;
    }

    if(this._currentRotation < 0) {
        this._currentRotation = 360;
    }

    if(this._currentRotation > 360) {
        this._currentRotation = 0;
    }
  },

  handleTouch:function(touchLocation)
  {
    if(touchLocation.x < 300)
      this._currentRotation = 0;
    else
      this._currentRotation = 180;
  },

  handleTouchMove:function(touchLocation){
    // Gross use of hardcoded width,height params.
    var angle = Math.atan2(touchLocation.x - 300,
                           touchLocation.y - 300);

    angle = angle * (180/Math.PI);
    this._currentRotation = angle;

  }
});

var MenuLayer = cc.LayerColor.extend({
    _debug:cc.COCOS2D_DEBUG,

    init:function()
    {
        this._super(new cc.Color4B(0, 0, 0, 255));

        var size = cc.Director.getInstance().getWinSize();
        var audio_engine = cc.AudioEngine.getInstance();

        audio_engine.setEffectsVolume(0.5);
        audio_engine.setMusicVolume(0.5);

        var menuItem1 = new cc.MenuItemFont.create("Play Sound", this.playSound, this);
        var menuItem2 = new cc.MenuItemFont.create("Play Song", this.playSong, this);
        var menuItem3 = new cc.MenuItemFont.create("Stop Playing Song", this.stopPlayingSound, this);
        var menuItem4 = new cc.MenuItemFont.create("Exit", this.exit, this);

        menuItem1.setPosition(new cc.Point(size.width / 2, size.height / 2+50));
        menuItem2.setPosition(new cc.Point(size.width / 2, size.height / 2));
        menuItem3.setPosition(new cc.Point(size.width / 2, size.height / 2-50));
        menuItem4.setPosition(new cc.Point(size.width / 2, size.height / 2-100));

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

    playSound:function(){
        cc.log("Playing sound");
        cc.AudioEngine.getInstance().playEffect(s_effect);
    },

    playSong:function(){
        cc.log("Playing song");
        cc.AudioEngine.getInstance().playMusic(s_background_music);
    },

    stopPlayingSound:function(){
        cc.log("Done playing song");
        var audio_engine = cc.AudioEngine.getInstance();

        if(audio_engine.isMusicPlaying())
        {
            cc.log("Stoping song");
            audio_engine.stopMusic();
        }
        else {
            cc.log("Music is not playing");
        }
    },

    exit:function () {
      cc.log("Exit");
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
        cc.log(heldKeys);
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

MenuScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var layer = new MenuLayer();
        layer.init();
        this.addChild(layer);
    }
});
