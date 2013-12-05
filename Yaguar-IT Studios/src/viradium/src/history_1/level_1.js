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


var CossinoSprite = cc.Sprite.extend({
    _currentDirection: CHR_DIRECTION.RIGHT,
    _currentStatus: CHR_STATUS.STAND,
    _FNStandPrefix: "stand",
    _FNStandIdx: 1,
    _FNStandDir: 1,
    _FNRunPrefix: "run",
    _FNRunIdx: 1,
    _FNJumpPrefix: "jump",
    _FNJumpIdx: 1,
    _FNWalkIdx: 1,
    _FNWalkPrefix: "run",
    _currentPos: null,
    _executingAnimation: false,
    _nextStatus: null,
    _nextDirection: CHR_DIRECTION.NOTSET,
    _antiKeyBounceCounter: 0,
    _onFinishStandStop: false,
    _onFinishRunStop: false,
    _onFinishWalkStop: false,
    _onFinishJumpStop: false,
    director: null,
    frameCache: null,
    wSizeWidth: 0,
    wSizeHeight: 0,
    _walkDeltaPos: null,
    _walkDeltaPostCount: 0,
    _jumpDeltaPos: null,
    _jumpDeltaPosCount: 0,
    _runDeltaPos: null,
    _runDeltaPosCount: 0,
    _deltaPosTotal: null,
    _onTerrainType: null,
    audioEngine: null,
    spriteDescription: null,
    _footSoundCounter: 0,
    _rocks: null,
    _playerPhysicBody: null,
    _parallaxNode: null,
    _onGround: false,
    _standDeltaPos: null,

    ctor:function () {
        cc.log("Constructor: CossinoSprite");
        this._super();

        this.setAnchorPoint(cc_Point(0.5, 0.5));

        var cache = cc.SpriteFrameCache.getInstance();
        cache.addSpriteFrames(s_cossino_plist, s_cossino_img);

        this.director = cc.Director.getInstance();
        this.wSizeWidth = this.director.getWinSize().width;
        this.wSizeHeight = this.director.getWinSize().height;
        this.frameCache = cc.SpriteFrameCache.getInstance();
        this.audioEngine = cc.AudioEngine.getInstance();

        this.spriteDescription = "Cossino";

        this._standDeltaPos = cc_Point(0, 0);
        this._walkDeltaPos = cc_Point(1.5, 0);
        this._runDeltaPos = cc_Point(3.5, 0);
        this._jumpDeltaPos = cc_Point(1, 0);
        this._deltaPosTotal = cc_Point(0, 0);

        this.initWithSpriteFrameName(this._FNStandPrefix + "1.png");
        //this.init();

        // Schedule updates
        cc.log("Scheduling Cossino Global Update...");
        this.scheduleUpdate();

        // Inicialmente mostrar personaje apuntando hacia la derecha
        // y parado
        this.beginStand();
        this._nextStatus = this.beginStand;
    },

    update:function (dt) {
    },

    updateStand:function () {
        var menuItemX, menuItemY = 0;

        menuItemX = this.wSizeWidth / 2;
        menuItemY = this.wSizeHeight / 2;

        if (this._FNStandIdx > 3) {
            this._FNStandDir = -1;
        }
        else if (this._FNStandIdx < 2) {
            this._FNStandDir = 1;

            // FIXME:
            if (this._onFinishStandStop) {
                this.stopStand();
                this._nextStatus();
            }
        }

        // cc.log(cossino_pj.FNStandIdx);

        var indexAsString = this._FNStandIdx.toString();
        this._FNStandIdx += this._FNStandDir;

        var next_frame = this.frameCache.getSpriteFrame(this._FNStandPrefix +
                                                        indexAsString + ".png");

        this.removeAllChildren();
        this.setTextureRect(next_frame.getRect());
        this.setContentSize(next_frame.getRect().width, next_frame.getRect().height);
        this.setDisplayFrame(next_frame);
    },

    updateWalk:function () {
        var menuItemX, menuItemY = 0;

        menuItemX = this.wSizeWidth / 2;
        menuItemY = this.wSizeHeight / 2;

        if (this._FNWalkIdx > 17) {
            this._FNWalkIdx = 1;

            // FIXME:
            if (this._onFinishWalkStop) {
                this.stopWalk();
                this._nextStatus();
            }
        }

        // cc.log(this._FNWalkIdx);

        var indexAsString = this._FNWalkIdx.toString();
        this._FNWalkIdx += 1;

        var next_frame = this.frameCache.getSpriteFrame(this._FNWalkPrefix +
                                                        indexAsString + ".png");

        this.removeAllChildren();
        this.setTextureRect(next_frame.getRect());
        this.setDisplayFrame(next_frame);
    },

    updateRun:function () {
        var menuItemX, menuItemY = 0;

        menuItemX = this.wSizeWidth / 2;
        menuItemY = this.wSizeHeight / 2;

        if (this._FNRunIdx > 17) {
            this._FNRunIdx = 1;

            // FIXME:
            if (this._onFinishRunStop) {
                this.stopRun();
                this._nextStatus();
            }
        }

        // cc.log(this._FNRunIdx);

        var indexAsString = this._FNRunIdx.toString();
        this._FNRunIdx += 1;

        var next_frame = this.frameCache.getSpriteFrame(this._FNRunPrefix +
                                                        indexAsString + ".png");

        this.removeAllChildren();
        this.setTextureRect(next_frame.getRect());
        this.setDisplayFrame(next_frame);
    },

    updateJump:function () {
        var menuItemX, menuItemY = 0;

        menuItemX = this.wSizeWidth / 2;
        menuItemY = this.wSizeHeight / 2;

        if (this._FNJumpIdx > 22) {
            this._FNJumpIdx = 1;

            // FIXME:
            if (this._onFinishJumpStop) {
                this.stopJump();
                this._nextStatus();
            }
        }

        // cc.log(cossino_pj.FNStandIdx);

        var indexAsString = this._FNJumpIdx.toString();
        this._FNJumpIdx += 1;

        var next_frame = this.frameCache.getSpriteFrame(this._FNJumpPrefix +
                                                   indexAsString + ".png");

        this.removeAllChildren();
        this.setTextureRect(next_frame.getRect());
        this.setDisplayFrame(next_frame);
    },

    handleKeyDown:function (e) {
        cc.log("Handle Key Down Cossino.");

        switch (e) {
            case KEYS.GOLEFT:
                if (this._currentStatus == CHR_STATUS.JUMP) {
                    this.reqOnFinishJumpStop(this.beginWalk);
                } else {
                    this.turnLeft();
                    this.beginWalk();
                }
                break;
            case KEYS.GORIGHT:
                if (this._currentStatus == CHR_STATUS.JUMP) {
                    this.reqOnFinishJumpStop(this.beginWalk);
                } else {
                    this.turnRight();
                    this.beginWalk();
                }
                break;
            case KEYS.RUN:
                if (this._currentStatus == CHR_STATUS.JUMP) {
                    this.reqOnFinishJumpStop(this.beginRun);
                } else {
                   this.beginRun();
                }
                break;
            case KEYS.JUMP:
                this.beginJump();
                break;
            default:
                // this.beginStand();
        }
    },

    handleKeyUp:function (e) {
        cc.log("Handle Key Up Cossino.");

        switch (e) {
            case KEYS.GOLEFT:
                if (this._currentStatus == CHR_STATUS.WALK) {
                    this.beginStand();
                }
                break;
            case KEYS.GORIGHT:
                if (this._currentStatus == CHR_STATUS.WALK) {
                    this.beginStand();
                }
                break;
            case KEYS.RUN:
                if (this._currentStatus == CHR_STATUS.RUN) {
                    // this.stopRun();
                    this.beginStand();
                 }
                break;
            case KEYS.JUMP:
                if (this._currentStatus == CHR_STATUS.JUMP) {
                    this.reqOnFinishJumpStop();
                    //this.beginStand();
                }
                break;
            default:
                // this.beginStand();
        }
    },

    handleTouchesEnded:function (touch, event) {
        switch(touch.length) {
            case 0:
                this.beginStand();
                break;
            case 1:
                this.beginWalk();
                break;
            case 2:
                this.beginRun();
                break;
            default:
                this.beginStand();
        }
    },

    handleTouchesBegan:function (touch, event) {
        switch (touch.length) {
            case 1:
                this.beginWalk();
                break;
            case 2:
                this.beginRun();
                break;
            default:
                this.beginStand();
        }
    },

    handleTouchesMoved:function (touch, event) {
    },

    _stand:function () {
        this.beginStand();
    },

    beginStand:function () {
        cc.log("Stand Cossino.");
        this.clearDeltaPos();
        this._currentStatus = CHR_STATUS.STAND;
        // Quick & Dirty, Hacky, Nasty...
        // Must be refactored, improved...
        this.unschedule(this.updateRun);
        this.stopRunEffect();
        this.unschedule(this.updateWalk);
        this.stopWalkEffect();
        this.unschedule(this.updateJump);
        this.stopJumpEffect();

        this.schedule(this.updateStand, 0.4);
        this.schedule(this.playStandEffect);
    },

    stopStand:function () {
        this.clearDeltaPos();
        this.unschedule(this.updateStand);
        this.stopStandEffect();
        this._FNStandIdx = 1;
        this._FNStandDir = 1;
        this._onFinishStandStop = false;
    },

    reqOnFinishStandStop:function (next_status) {
        cc.log("Detener Stand Cossino al finalizar sprites.");
        this._onFinishStandStop = true;

        if (typeof next_status === 'function') {
            cc.log("Establecido próximo estado de Stand");
            this._nextStatus = next_status;
        } else {
            this._nextStatus = this.beginStand;
        }
    },

    _walk:function () {
        this.beginWalk();
    },

    beginWalk:function () {
        if (!this._onGround) { return; }

        cc.log("Walk Cossino.");

        switch (this._currentDirection) {
            case CHR_DIRECTION.RIGHT:
                this._setDeltaPos(this._walkDeltaPos.x, this._walkDeltaPos.y);
                break;
            case CHR_DIRECTION.LEFT:
                this._setDeltaPos(this._walkDeltaPos.x * -1, this._walkDeltaPos.y);
                break;
            case CHR_DIRECTION.UP:
                this._setDeltaPos(this._walkDeltaPos.x, this._walkDeltaPos.y);
                break;
            case CHR_DIRECTION.DOWN:
                this._setDeltaPos(this._walkDeltaPos.x, this._walkDeltaPos.y * -1);
                break;
        }

        this._currentStatus = CHR_STATUS.WALK;
        // Quick & Dirty, Hacky, Nasty...
        // Must be refactored, improved...
        this.unschedule(this.updateRun);
        this.stopRunEffect();
        this.unschedule(this.updateStand);
        this.stopStandEffect();
        this.unschedule(this.updateJump);
        this.stopJumpEffect();

        // Importante: la luz es más rápida que el sonido.
        // Reproducir sonido antes de animar.
        this.schedule(this.playWalkEffect, 0.65);
        this.schedule(this.updateWalk, 0);
        this._executingAnimation = true;
    },

    stopWalk:function () {
        this.clearDeltaPos();
        this.unschedule(this.updateWalk);
        this.stopWalkEffect();
        this._FNWalkIdx = 1;
        this._onFinishWalkStop = false;
        this._footSoundCounter = 0;
    },

    reqOnFinishWalkStop:function (next_status) {
        cc.log("Detener Walk Cossino al finalizar sprites.");
        this._onFinishWalkStop = true;

        if (typeof next_status === 'function') {
            cc.log("Establecido próximo estado de Stand");
            this._nextStatus = next_status;
        } else {
            this._nextStatus = this.beginStand;
        }
    },

    _jump:function () {
        this.beginJump();
    },

    beginJump:function () {
        if (!this._onGround) { return; }

        cc.log("Jump Cossino.");

        switch (this._currentDirection) {
            case CHR_DIRECTION.RIGHT:
                this._setDeltaPos(this._jumpDeltaPos.x, this._jumpDeltaPos.y);
                break;
            case CHR_DIRECTION.LEFT:
                this._setDeltaPos(this._jumpDeltaPos.x * -1, this._jumpDeltaPos.y);
                break;
            case CHR_DIRECTION.UP:
                this._setDeltaPos(this._jumpDeltaPos.x, this._jumpDeltaPos.y);
                break;
            case CHR_DIRECTION.DOWN:
                this._setDeltaPos(this._jumpDeltaPos.x, this._jumpDeltaPos.y * -1);
                break;
        }

        this._currentStatus = CHR_STATUS.JUMP;
        // Quick & Dirty, Hacky, Nasty...
        // Must be refactored, improved...
        this.unschedule(this.updateRun);
        this.stopRunEffect();
        this.unschedule(this.updateWalk);
        this.stopWalkEffect();
        this.unschedule(this.updateStand);
        this.stopStandEffect();

        this.audioEngine.playEffect(s_footstep_dirt_1, false);
        // this.scheduleOnce(this.playJumpEffect);
        this.schedule(this.updateJump, 0.1);
        this._executingAnimation = true;
    },

    stopJump:function () {
        this.clearDeltaPos();
        this.unschedule(this.updateJump);

        this.audioEngine.playEffect(s_footstep_dirt_1, false);
        // this.stopJumpEffect();

        this._FNJumpIdx = 1;
        this._onFinishJumpStop = false;
        this._footSoundCounter = 0;
    },

    reqOnFinishJumpStop:function (next_status) {
        cc.log("Detener Jump Cossino al finalizar sprites.");
        this._onFinishJumpStop = true;

        if (typeof next_status === 'function') {
            cc.log("Establecido próximo estado de Stand");
            this._nextStatus = next_status;
        } else {
            this._nextStatus = this.beginStand;
        }
    },

    _run:function () {
        this.beginRun();
    },

    beginRun:function () {
        if (!this._onGround) { return; }

        cc.log("Run Cossino.");
        switch (this._currentDirection) {
            case CHR_DIRECTION.RIGHT:
                this._setDeltaPos(this._runDeltaPos.x, this._runDeltaPos.y);
                break;
            case CHR_DIRECTION.LEFT:
                this._setDeltaPos(this._runDeltaPos.x * -1, this._runDeltaPos.y);
                break;
            case CHR_DIRECTION.UP:
                this._setDeltaPos(this._runDeltaPos.x, this._runDeltaPos.y);
                break;
            case CHR_DIRECTION.DOWN:
                this._setDeltaPos(this._runDeltaPos.x, this._runDeltaPos.y * -1);
                break;
        }

        this._currentStatus = CHR_STATUS.RUN;
        // Quick & Dirty, Hacky, Nasty...
        // Must be refactored, improved...
        this.unschedule(this.updateJump);
        this.stopJumpEffect();
        this.unschedule(this.updateWalk);
        this.stopWalkEffect();
        this.unschedule(this.updateStand);
        this.stopStandEffect();

        // Importante: la luz es más rápida que el sonido.
        // Reproducir sonido antes de animar.
        this.schedule(this.playRunEffect, 0.5);
        this.schedule(this.updateRun, 0.04);
        this._executingAnimation = true;
    },

    stopRun:function () {
        this.clearDeltaPos();
        this.unschedule(this.updateRun);
        this.stopRunEffect();
        this._FNRunIdx = 1;
        this._onFinishRunStop = false;
        this._footSoundCounter = 0;
    },

    reqOnFinishRunStop:function (next_status) {
        cc.log("Detener Run Cossino al finalizar sprites.");
        this._onFinishRunStop = true;

        if (typeof next_status === 'function') {
            cc.log("Establecido próximo estado de Stand");
            this._nextStatus = next_status;
        } else {
            this._nextStatus = this.beginStand;
        }
    },

    onAnimFinish:function () {
        cc.log("Finalizó la animación.");
        this._executingAnimation = false;
    },

    turnLeft:function () {
        if (this._currentDirection === CHR_DIRECTION.RIGHT) {
            cc.log("Turn Left Cossino.");
            this.setFlippedX(true);
            this._currentDirection = CHR_DIRECTION.LEFT;
        }
    },

    turnRight:function () {
        if (this._currentDirection === CHR_DIRECTION.LEFT) {
            cc.log("Turn Right Cossino.");
            this.setFlippedX(false);
            this._currentDirection = CHR_DIRECTION.RIGHT;
        }
    },

    getSpriteRect:function () {
        return this.displayFrame().getRect();
    },

    delay:function (ms) {
        cc.log("Delay: " + ms);
    },

    getWalkDeltaPos:function() {
        return this._walkDeltaPos;
    },

    getRunDeltaPos:function () {
        return this._runDeltaPos;
    },

    getJumpDeltaPos: function () {
        return this._jumpDeltaPos;
    },

    getCurrentStatus:function () {
        return this._currentStatus;
    },

    getCurrentDirection:function () {
        return this._currentDirection;
    },

    getDeltaPos:function () {
        return this._deltaPosTotal;
    },

    clearDeltaPos:function () {
        this._deltaPosTotal.x = 0;
        this._deltaPosTotal.y = 0;
    },

    _setDeltaPos:function (x, y) {
        this._deltaPosTotal.x = x;
        this._deltaPosTotal.y = y;
    },

    _setNextStatus:function (nextStatus) {
        this.nextStatus = nextStatus;
    },

    setTerrainType:function (type) {
        this._onTerrainType = type;
    },

    playStandEffect:function () {
    },

    stopStandEffect:function () {
        this.unschedule(this.playStandEffect);
    },

    playWalkEffect:function () {
        cc.log("Efecto de caminar.");
        if ((this._footSoundCounter % 2) === 0) {
            this.audioEngine.playEffect(s_footstep_dirt_2, false);
        }
        else {
            this.audioEngine.playEffect(s_footstep_dirt_1, false);
        }

        this._footSoundCounter += 1;
    },

    stopWalkEffect:function () {
        this.unschedule(this.playWalkEffect);
        this.audioEngine.stopEffect(s_footstep_dirt_1);
        this.audioEngine.stopEffect(s_footstep_dirt_2);
    },

    playRunEffect:function () {
        cc.log("Efecto de correr.");
        if ((this._footSoundCounter % 2) === 0) {
            this.audioEngine.playEffect(s_footstep_dirt_2, false);
        }
        else {
            this.audioEngine.playEffect(s_footstep_dirt_1, false);
        }

        this._footSoundCounter += 1;
    },

    stopRunEffect:function () {
        this.unschedule(this.playRunEffect);
        this.audioEngine.stopEffect(s_footstep_dirt_1);
        this.audioEngine.stopEffect(s_footstep_dirt_2);
    },

    playJumpEffect:function () {
        if ((this._footSoundCounter % 2) === 0) {
            this.audioEngine.playEffect(s_footstep_dirt_2, false);
        }
        else {
            this.audioEngine.playEffect(s_footstep_dirt_1, false);
        }

        this._footSoundCounter += 1;
    },

    stopJumpEffect:function () {
        // this.audioEngine.playEffect(s_footstep_dirt_1, false);
        this.unschedule(this.playJumpEffect);
    },

    getSpriteDescription:function () {
        return this.spriteDescription;
    },

    setWalkDeltaPos:function (deltaPoint) {
        this._walkDeltaPos = deltaPoint;
    },

    setRunDeltaPos:function (deltaPoint) {
        this._runDeltaPos = deltaPoint;
    },

    setJumpDeltaPos:function (deltaPoint) {
        this._jumpDeltaPos = deltaPoint;
    },

    setPlayerIsOnGround:function (status) {
        this._onGround = status;
    },

    isPlayerOnGround:function () {
        return this._onGround;
    }
});


var Cossino = (function () {
  // Instance stores a reference to the Singleton
  var instance;

  function init() {
    return new CossinoSprite();
  }

  return {
    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance:function () {
      if ( !instance ) {
        instance = init();
      }

      return instance;
    }
  };
})();


var ViradiumSprite = cc.Sprite.extend({
    director: null,
    wSizeWidth: null,
    wSizeHeight: null,
    frameCache: null,
    audioEngine: null,
    spriteDescription: null,

    ctor:function () {
        this._super();

        this.setAnchorPoint(cc_Point(0.5, 0.5));

        var cache = cc.SpriteFrameCache.getInstance();
        cache.addSpriteFrames(s_viradium_plist, s_viradium_img);

        this.director = cc.Director.getInstance();
        this.wSizeWidth = this.director.getWinSize().width;
        this.wSizeHeight = this.director.getWinSize().height;
        this.frameCache = cc.SpriteFrameCache.getInstance();
        this.audioEngine = cc.AudioEngine.getInstance();

        this.spriteDescription = "Viradium";

        this.initWithSpriteFrameName("viradium_1.png");

        var next_frame = this.frameCache.getSpriteFrame("viradium_1.png");

        this.setTextureRect(next_frame.getRect());
        this.setContentSize(next_frame.getRect().width,
                            next_frame.getRect().height);
        this.setDisplayFrame(next_frame);

        this.scheduleUpdate();
    },

    update:function () {
    }
});


var Hist1Lvl1Layer = cc.Layer.extend({
    _debug: cc.COCOS2D_DEBUG,
    physics: null,
    _canvas: null,
    FPS: 60,
    PTM_RATIO: 30,
    director: null,
    audioEngine: null,
    parallaxChild: null,
    _layer2MaxOffset: 0,
    _layer2MinOffset: 0,
    _layer1MaxOffset: 0,
    _layer1MinOffset: 0,
    _layer0MaxOffset: 0,
    _layer0MinOffset: 0,
    _centerScreenX: 0,
    _centerScreenY: 0,
    _wsizeheight: 0,
    _wsizewidth: 0,
    _previousDirection: null,
    _currentDirection: null,
    _playerPrevPhyPos: null,
    _playerCurrPhyPos: null,
    _playerCurrPhyRot: null,
    _playerPrevUIPos: null,
    _playerCurrUIPos: null,
    _playerCurrUIRot: null,
    _tileMap: null,
    _tileSize: null,
    _mapOrientation: null,
    _physicsDoSleep: false,
    _currentPlayer: null,
    _leftLimitPos: null,
    _rightLimitPos: null,
    _debugPhysicsDraw: false,
    _parallaxBG2Ratio: null,
    _parallaxBG1Ratio: null,
    _parallaxBG0Ratio: null,
    _parallaxTilemapRatio: null,
    _playerGroundSensorId: 1000,
    _groundSensorIdCounter: 1,
    _playerCurrentDirection: null,
    _playerCurrentStatus: null,
    _playerRunDeltaMultiplier: 1.0,
    _playerWalkDeltaMultiplier: 1.0,
    _playerJumpDeltaMultiplier: 1.0,


    ctor:function () {
        cc.log("Init Function: Hist1Lvl1Layer.");
        this._super();
        this.init();
    },

    init:function () {
        this.setPosition(cc_Point(0, 0));

        // Caching
        cc_MenuItemFont = cc.MenuItemFont;
        this.audioEngine = cc.AudioEngine.getInstance();
        this.director = cc.Director.getInstance();
        var wSizeWidth = this._wsizewidth = this.director.getWinSize().width;
        var wSizeHeight = this._wsizeheight = this.director.getWinSize().height;
        var systemCapabilities = sys.capabilities;

        var menuItemX, menuItemY = 0;

        this.audioEngine.setEffectsVolume(0.5);
        this.audioEngine.setMusicVolume(0.5);

        menuItemX = this._centerScreenX = wSizeWidth / 2;
        menuItemY = this._centerScreenY = wSizeHeight / 2;

        this._currentDirection = this._previousDirection = CHR_DIRECTION.RIGHT;

        this._leftLimitPos = this._wsizewidth / 2;
        this._rightLimitPos = -3900;

        // Create new label
        var menuTitulo = cc.LabelTTF.create("Historia 1 Nivel 1",
                                            "Courier New",
                                            30);

        cc.log("Crear título de escena...");
        // Position the label on the center of the screen
        menuTitulo.setPosition(cc_Point(menuItemX, wSizeHeight - 35));
        // Add the label as a child to this layer
        this.addChild(menuTitulo);

        // Inicializar fondos parallax
        this.initParallax();

        // Check for input support -------------------------------------------
        // -------------------------------------------------------------------
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
            this.setTouchPriority(0);
        }
        else {
            cc.log("Touch Not Supported");
        }

        // Schedule update
        cc.log("Scheduling update...");
        this.scheduleUpdate();

        return true;
    },

    _initPhysics:function (initGravedadX, initGravedadY, initDoSleep, initScale, initStepAmount, debugElementCanvas) {
        // -------------------------------------------------------------------
        // Configure Box2D ---------------------------------------------------
        // -------------------------------------------------------------------
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

        // Construct a world object, which will hold and simulate the rigid bodies.
        var Physics = function (gravedadX, gravedadY, doSleep, scale, stepAmount) {
            var gravity = new b2Vec2(gravedadX, gravedadY);
            this.world = new b2World(gravity, doSleep);
            this.world.SetContinuousPhysics(true);
            this.scale = scale || 30;  // 30 pixeles = 1 metro
            this.dtRemaining = 0;
            this.stepAmount = stepAmount || 1/60;
        };

        Physics.prototype.step = function (dt) {
            var this_obj = this;
            this_obj.dtRemaining += dt;

            while (this_obj.dtRemaining > this_obj.stepAmount) {
                this_obj.dtRemaining -= this_obj.stepAmount;
                this_obj.world.Step(this_obj.stepAmount,
                                8, // velocity iterations
                                3); // position iterations
            }
        };

        // Crear nueva instancia de mundo físico
        this.physics = new Physics(initGravedadX,
                                   initGravedadY,
                                   initDoSleep,
                                   initScale,
                                   initStepAmount);


        cc.log("Mundo físico:");
        cc.log(this.physics);

        // Límite inferior (piso)
        var fixDefInf = new b2FixtureDef();
        var bodyDefInf = new b2BodyDef();

        fixDefInf.density = 20.0;
        fixDefInf.friction = 0.5;
        fixDefInf.restitution = 0.2;
        bodyDefInf.type = b2Body.b2_staticBody;
        fixDefInf.shape = new b2PolygonShape();
        bodyDefInf.position.Set((12000 / 2) / this.physics.scale, -0.5 / this.physics.scale);
        fixDefInf.shape.SetAsBox((12000 / 2) / this.physics.scale, 0.5 / this.physics.scale);
        this.physics.world.CreateBody(bodyDefInf).CreateFixture(fixDefInf);

        // Límite superior (techo)
        // var fixDefSup = new b2FixtureDef();
        // var bodyDefSup = new b2BodyDef();

        // fixDefSup.density = 10.0;
        // fixDefSup.friction = 0.5;
        // fixDefSup.restitution = 0.2;
        // bodyDefSup.type = b2Body.b2_staticBody;
        // fixDefSup.shape = new b2PolygonShape();
        // bodyDefSup.position.Set((12000 / 2) / this.physics.scale, this._wsizeheight / this.physics.scale);
        // fixDefSup.shape.SetAsBox((12000 / 2) / this.physics.scale, 0.01 / this.physics.scale);
        // this.physics.world.CreateBody(bodyDefSup).CreateFixture(fixDefSup);

        // Límite izquierdo
        var fixDefIzq = new b2FixtureDef();
        var bodyDefIzq = new b2BodyDef();

        fixDefIzq.density = 20.0;
        fixDefIzq.friction = 0.5;
        fixDefIzq.restitution = 0.2;
        bodyDefIzq.type = b2Body.b2_staticBody;
        fixDefIzq.shape = new b2PolygonShape();
        bodyDefIzq.position.Set(0 / this.physics.scale, this._wsizeheight / 2 / this.physics.scale);
        fixDefIzq.shape.SetAsBox(0.5 / this.physics.scale, this._wsizeheight / this.physics.scale);
        this.physics.world.CreateBody(bodyDefIzq).CreateFixture(fixDefIzq);

        // Límite derecho
        var fixDefDer = new b2FixtureDef();
        var bodyDefDer = new b2BodyDef();

        fixDefDer.density = 20.0;
        fixDefDer.friction = 0.5;
        fixDefDer.restitution = 0.2;
        bodyDefDer.type = b2Body.b2_staticBody;
        fixDefDer.shape = new b2PolygonShape();
        bodyDefDer.position.Set(12000 / this.physics.scale, this._wsizeheight / 2 / this.physics.scale);
        fixDefDer.shape.SetAsBox(0.5 / this.physics.scale, this._wsizeheight / this.physics.scale);
        this.physics.world.CreateBody(bodyDefDer).CreateFixture(fixDefDer);

        if (this._debugPhysicsDraw) {
            // Enable debug draw
            var canvasDebug = document.getElementById("debugCanvas");
            var debugDraw = new b2DebugDraw();  // Objeto de visualización de depuración
            var ctx = canvasDebug.getContext("2d");
            ctx.canvas.height /= 5;
            debugDraw.SetSprite(ctx);  // Establecemos el canvas para visualizarlo
            debugDraw.SetDrawScale(5);     // Escala de la visualización
            debugDraw.SetFillAlpha(0.5);    // Transparencia de los elementos (debug)
            debugDraw.SetLineThickness(1.0);
            debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_centerOfMassBit);
            this.physics.world.SetDebugDraw(debugDraw);  // Le proporcionamos al "mundo" la salida del debug
        }
    },

    onEnter:function () {
        this._super();
        cc.log("Reproducir música de fondo.");
        this.audioEngine.playMusic(s_hist_1_amb_music, true);
        cc.log("ZOrder Hist1Lvl1Layer: " + this.getZOrder());
    },

    playNewGame:function () {
        cc.log("Comenzar nuevo juego.");
        this.audioEngine.playEffect(s_effect, false);
        this.stopBGMusic();
    },

    resumeGame:function () {
        cc.log("Continuar juego.");
        this.audioEngine.playEffect(s_effect, false);
        this.stopBGMusic();
    },

    setPreferences:function () {
        cc.log("Ver/Establecer opciones.");
        this.audioEngine.playEffect(s_effect, false);
        this.stopBGMusic();
    },

    stopBGMusic: function () {
        if(this.audioEngine.isMusicPlaying())
        {
            cc.log("Detener música de fondo.");
            this.audioEngine.stopMusic();
        }
        else {
            cc.log("No hay música de fondo en reproducción.");
        }
    },

    exitApp:function () {
        cc.log("Salir del juego.");
        this.audioEngine.playEffect(s_effect, false);
        this.stopBGMusic();
    },

    showDebugMenu:function () {
        cc.log("Show debug menu.");
        this.audioEngine.playEffect(s_effect, false);
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

        //Add a new body/atlas sprite at the touched location
        // var batch = this.getChildByTag(8855);

        // var idx = (Math.random() > 0.5 ? 0 : 1);
        // var idy = (Math.random() > 0.5 ? 0 : 1);
        // var sprite = cc.Sprite.createWithTexture(batch.getTexture(), cc.rect(32 * idx, 32 * idy, 32, 32));
        // batch.addChild(sprite);

        // var location = event.getLocation();
        // cc.log(location);
        // sprite.setPosition(cc.p(location.x, location.y));
        // this.addNewSpriteWithCoords(location);
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
        if (lastEvent && (lastEvent === e)) {
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
            case KEYS.GORIGHT:
                this._previousDirection = this._currentDirection;
                this._currentDirection = CHR_DIRECTION.RIGHT;
                this._playerCurrentDirection = CHR_DIRECTION.RIGHT;
                this._playerCurrentStatus = CHR_STATUS.WALK;
                break;
            case KEYS.GOLEFT:
                this._previousDirection = this._currentDirection;
                this._currentDirection = CHR_DIRECTION.LEFT;
                this._playerCurrentDirection = CHR_DIRECTION.LEFT;
                this._playerCurrentStatus = CHR_STATUS.WALK;
                break;
            case cc.KEY.shift:
                KEYMOD_FLAGS.SHIFT = true;
                break;
            case cc.KEY.control:
                KEYMOD_FLAGS.CONTROL = true;
                break;
            case cc.KEY.alt:
                KEYMOD_FLAGS.ALT = true;
                break;
            case KEYS.RUN:
                this._playerCurrentStatus = CHR_STATUS.RUN;
                break;
            case KEYS.JUMP:
                this._playerCurrentStatus = CHR_STATUS.JUMP;

                // FIXME: Refactorizar en un solo lugar
                if (this._currentPlayer._currentStatus !== CHR_STATUS.JUMP) {
                        this.makePlayerJump(100);
                }
                break;
        }

        // Propagate key down to children
        this._currentPlayer.handleKeyDown(e);
    },

    onKeyUp:function (e) {
        lastEvent = null;
        delete heldKeys[e];

        switch (e) {
            case cc.KEY.shift:
                KEYMOD_FLAGS.SHIFT = false;
                break;
            case cc.KEY.control:
                KEYMOD_FLAGS.CONTROL = false;
                break;
            case cc.KEY.alt:
                KEYMOD_FLAGS.ALT = false;
                break;
            case cc.KEY.r:
                if (KEYMOD_FLAGS.SHIFT) { this._reloadObjsAndEnemiesLayer(); }
                break;
            case KEYS.RUN:
            case KEYS.WALK:
                this._playerCurrentStatus = CHR_STATUS.STAND;
                break;
        }

        // Propagate key up to children
        this._currentPlayer.handleKeyUp(e);
    },

    update:function (dt) {
        var this_obj = this;
        var physics = this_obj.physics;
        var b2Vec2 = Box2D.Common.Math.b2Vec2;
        var spriteAngle = 0;
        var spritePositionOffset = 0;
        var bodyList = physics.world.GetBodyList();
        var sprite = null;
        var objectTMX = null;
        var spritePosition = null;
        var spriteCurrPhyPos = null;
        var spriteDeltaUIPos = null;

        this_obj._playerPrevUIPos = this_obj._playerCurrUIPos;

        switch (this_obj._currentPlayer._currentStatus) {
            case CHR_STATUS.WALK:
                this_obj.makePlayerWalk();
                break;
            case CHR_STATUS.RUN:
                this_obj.makePlayerRun();
                break;
            case CHR_STATUS.JUMP:
                break;
        }

        // for (var body = bodyList; body; body = body.GetNext()) {
        //     sprite = body.GetUserData();

        //     if (sprite === null) { continue; }

        //     if (sprite instanceof cc_Sprite) {
        //         if (sprite === this_obj._currentPlayer) {
        //             // Actualizar posición previa del jugador
        //             this_obj._playerPrevUIPos = this_obj._playerCurrUIPos;

        //             // Sumar ambos vectores para obtener el desplazamiento total
        //             this_obj._playerCurrUIPos = cc_pAdd(this_obj._playerCurrUIPos,
        //                                                 sprite.getDeltaPos());

        //             // Crear vector de desplazamiento de Box2D
        //             spritePosition = new b2Vec2(this_obj._playerCurrUIPos.x / physics.scale,
        //                                         this_obj._playerCurrUIPos.y / physics.scale);

        //             body.SetPosition(spritePosition);
        //             body.SetAngle(spriteAngle);

        //             // Actualizar referencias a posiciones físicas del jugador
        //             this_obj._playerPrevPhyPos = this_obj._playerCurrPhyPos;
        //             this_obj._playerCurrPhyPos = spritePosition;
        //         }
        //     }
        //     else {
        //         objectTMX = sprite;
        //     }
        // }

        // Instruct the world to perform a single step of simulation.
        physics.step(dt);

        //Iterate over the bodies in the physics world
        for (var bodyf = bodyList; bodyf; bodyf = bodyf.GetNext()) {
            sprite = bodyf.GetUserData();

            if (sprite === null) { continue; }

            if (sprite instanceof cc_Sprite) {
                if (sprite === this_obj._currentPlayer) {
                    spritePosition = cc_Point(bodyf.GetPosition().x * physics.scale,
                                              bodyf.GetPosition().y * physics.scale);

                    spriteAngle = -1 * cc_RADIANS_TO_DEGREES(bodyf.GetAngle());

                    this_obj._playerCurrUIPos = spritePosition;
                    this_obj._playerCurrUIRot = spriteAngle;
                    sprite.setRotation(spriteAngle);
                    sprite.setPosition(cc_Point(this_obj._wsizewidth / 2,
                                                spritePosition.y));
                }
                else if (sprite instanceof ViradiumSprite) {
                    spritePosition = cc_Point(bodyf.GetPosition().x * physics.scale,
                                              bodyf.GetPosition().y * physics.scale);

                    spriteAngle = -1 * cc_RADIANS_TO_DEGREES(bodyf.GetAngle());

                    sprite.setPosition(cc_Point(spritePosition.x, spritePosition.y));
                    sprite.setRotation(spriteAngle);
                }
            }
        }

        physics.world.DrawDebugData();
        physics.world.ClearForces();

        // Actualizar parallax
        this_obj._updateParallax();
    },

    showMouseButtonInfo:function (event, trigger) {
        var button = "";

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
    },

    addBoxBodyForSprite:function (sprite, bodyType, setSensor, customPosition) {
        if ((sprite === null) || !(sprite instanceof cc_Sprite)) { return false; }

        cc.log("Add box body for sprite...");

        cc.log(sprite);

        var b2BodyDef = Box2D.Dynamics.b2BodyDef;
        var b2Body = Box2D.Dynamics.b2Body;
        var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
        var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
        var b2Fixture = Box2D.Dynamics.b2Fixture;

        var spriteBodyDef = new b2BodyDef();

        switch (bodyType) {
            case 0:
                spriteBodyDef.type = b2Body.b2_dynamicBody;
                break;
            case 1:
                spriteBodyDef.type = b2Body.b2_staticBody;
                break;
            case 2:
                spriteBodyDef.type = b2Body.b2_kinematicBody;
                break;
            default:
                spriteBodyDef.type = b2Body.b2_dynamicBody;
        }

        var spritePosition = null;
        if ((customPosition !== null) && (customPosition instanceof cc_Point)) {
            cc.log("Posición personalizada.");
            spritePosition = customPosition;
        }
        else {
            cc.log("Posición original.");
            spritePosition = sprite.getPosition();
        }

        spriteBodyDef.position.Set(spritePosition.x / this.physics.scale,
                                   spritePosition.y / this.physics.scale);

        spriteBodyDef.userData = sprite;
        var spriteBody = this.physics.world.CreateBody(spriteBodyDef);

        cc.log(sprite.getBoundingBox().size.width);
        cc.log(sprite.getBoundingBox().size.height);

        var spriteShape = new b2PolygonShape();
        spriteShape.SetAsBox(sprite.getBoundingBox().size.width / this.physics.scale / 2,
                             sprite.getBoundingBox().size.height / this.physics.scale / 2);

        // Define the dynamic body fixture.
        var spriteShapeDef = new b2FixtureDef();
        spriteShapeDef.shape = spriteShape;
        spriteShapeDef.density = 5.0;
        spriteShapeDef.friction = 0.1;
        spriteShapeDef.restitution = 0.1;
        spriteShapeDef.isSensor = setSensor || false;
        spriteBody.CreateFixture(spriteShapeDef);

        return spriteBody;
    },

    addBoxBodyForTMXObject:function (object, userData) {
        if ((object === null) || !(object instanceof Object)) { return false; }

        cc.log("Add box body for TMX object...");
        var b2BodyDef = Box2D.Dynamics.b2BodyDef;
        var b2Body = Box2D.Dynamics.b2Body;
        var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
        var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
        var b2Fixture = Box2D.Dynamics.b2Fixture;
        var b2Vec2 = Box2D.Common.Math.b2Vec2;
        var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
        var spriteShape = null;
        var objectBodyDef = null;
        var objectBody = null;
        var inferedShape = null;
        var hasGroundSensor = false;
        var fixedRotation = false;
        var forcedWidthCalc = object.width;
        var forcedWidth = forcedWidthCalc;
        var forcedHeightCalc = object.height;
        var forcedHeight = forcedHeightCalc;

        var objType = "";
        if (object.Cuerpo) {
            objType = object.Cuerpo.trim().toLowerCase();
        }
        else if (object.cuerpo) {
            objType = object.cuerpo.trim().toLowerCase();
        }

        // Densidad
        var objDensity, densityCalc = 1.0;
        if (object.Densidad) {
            densityCalc = parseFloat(object.Densidad);
        }
        else if (object.densidad) {
            densityCalc = parseFloat(object.densidad);
        }
        if (!isNaN(densityCalc)) { objDensity = densityCalc; }

        // Fricción
        var objFriction, frictionCalc = 1.0;
        if (object.Friccion) {
            frictionCalc = parseFloat(object.Friccion);
        }
        else if (object.friccion) {
            frictionCalc = parseFloat(object.friccion);
        }
        if (!isNaN(frictionCalc)) { objFriction = frictionCalc; }

        // Restitución
        var objRestitution, restitutionCalc = 0.0;
        if (object.Restitucion) {
            restitutionCalc = parseFloat(object.Restitucion);
        }
        else if (object.restitucion) {
            restitutionCalc = parseFloat(object.restitucion);
        }
        if (!isNaN(restitutionCalc)) { objRestitution = restitutionCalc; }

        // Determinar si el objeto es un sensor
        var objIsSensor = false;
        if (object.Sensor) {
            if (object.Sensor.trim().toLowerCase() == "true") {
                objIsSensor = true; }
            else { objIsSensor = false; }
        }
        else if (object.sensor) {
            if (object.sensor.trim().toLowerCase() == "true") {
                objIsSensor = true;
            }
            else { objIsSensor = false; }
        }

        // Determinar si el objeto es un sensor
        if (object.RotacionFija) {
            if (object.RotacionFija.trim().toLowerCase() == "true") {
                fixedRotation = true; }
            else { fixedRotation = false; }
        }
        else if (object.rotacionfija) {
            if (object.rotacionfija.trim().toLowerCase() == "true") {
                fixedRotation = true;
            }
            else { fixedRotation = false; }
        }

        objectBodyDef = new b2BodyDef();

        switch (objType) {
            case "dynamic":
                objectBodyDef.type = b2Body.b2_dynamicBody;
                break;
            case "static":
                objectBodyDef.type = b2Body.b2_staticBody;
                break;
            case "kinematic":
                objectBodyDef.type = b2Body.b2_kinematicBody;
                break;
            default:
                objectBodyDef.type = b2Body.b2_dynamicBody;
        }

        objCenterWidth = object.width / 2;
        objCenterHeight = object.height / 2;

        objectBodyDef.position.Set((object.x + objCenterWidth) / this.physics.scale,
                                   (object.y + objCenterHeight) / this.physics.scale);

        objectBodyDef.userData = ((userData !== null) && (userData !== undefined)) ? userData : object;

        // Inferir tipo de objeto
        if (object.polygonPoints) {
            cc.log("POLYGON.");

            var verticesCount = object.polygonPoints.length;

            // Cantidad máxima de vértices = 8
            if (verticesCount > 8) {
                cc.log("Se permiten hasta 8 vértices por polígono.");
                return false;
            }

            spriteShape = new b2PolygonShape();
            var vertices = [];

            for (var i = 0; i < verticesCount; i++) {
                vertices.push(new b2Vec2(parseFloat(object.polygonPoints[i].x) / this.physics.scale,
                                         parseFloat(object.polygonPoints[i].y * -1) / this.physics.scale));
            }

            spriteShape.SetAsArray(vertices, verticesCount);
        }
        else if (object.polylinePoints) {
            cc.log("POLYLINE.");
            return false;
        }
        else if (((object.Forma) && (object.Forma.trim().toLowerCase() == "circunferencia")) ||
                ((object.forma) && (object.forma.trim().toLowerCase() == "circunferencia"))) {
                cc.log("CIRCLE.");
                spriteShape = new b2CircleShape(object.width / 2 / this.physics.scale);
        }
        else {
            cc.log("RECTANGLE.");
            // Ancho forzado
            if (object.AnchoForzado) {
                forcedWidthCalc = parseFloat(object.AnchoForzado);
            }
            else if (object.anchoforzado) {
                forcedWidthCalc = parseFloat(object.anchoforzado);
            }
            if (!isNaN(forcedWidthCalc) &&  (forcedWidthCalc <= object.width)) {
                forcedWidth = forcedWidthCalc;
            }

            // Alto forzado
            if (object.AltoForzado) {
                forcedHeightCalc = parseFloat(object.AltoForzado);
            }
            else if (object.altoforzado) {
                forcedHeightCalc = parseFloat(object.altoforzado);
            }
            if (!isNaN(forcedHeightCalc) && (forcedHeightCalc <= object.height)) {
                forcedHeight = forcedHeightCalc;
            }

            spriteShape = new b2PolygonShape();

            objCenterWidth = forcedWidth / 2;
            objCenterHeight = forcedHeight / 2;

            spriteShape.SetAsBox(objCenterWidth / this.physics.scale,
                                 objCenterHeight / this.physics.scale);
        }

        objectBody = this.physics.world.CreateBody(objectBodyDef);

        // Establecer la rotación fija si fuera necesario
        objectBody.SetFixedRotation(fixedRotation);

        // Define the dynamic body fixture.
        var spriteShapeDef = new b2FixtureDef();
        spriteShapeDef.userData = ((userData !== null) && (userData !== undefined)) ? userData : object;
        spriteShapeDef.shape = spriteShape;
        spriteShapeDef.density = objDensity;
        spriteShapeDef.friction = objFriction;
        spriteShapeDef.restitution = objRestitution;
        spriteShapeDef.isSensor = objIsSensor;
        objectBody.CreateFixture(spriteShapeDef);

        cc.log("Object Body Def:");
        cc.log(objectBodyDef);

        cc.log("Shape Def:");
        cc.log(spriteShapeDef);

        // Ground sensor
        if (object.SensorTierra && (spriteShape instanceof b2PolygonShape)) {
            if (object.SensorTierra.trim().toLowerCase() == "true") {
                hasGroundSensor = true; }
            else { hasGroundSensor = false; }
        }
        else if (object.sensortierra && (spriteShape instanceof b2PolygonShape)) {
            if (object.sensortierra.trim().toLowerCase() == "true") {
                hasGroundSensor = true;
            }
            else { hasGroundSensor = false; }
        }

        // Add foot sensor fixture
        if (hasGroundSensor) {
            cc.log("HAS GROUND SENSOR");
            var sensorFixtureDef = new b2FixtureDef();
            var sensorShape = new b2PolygonShape();

            sensorShape.SetAsOrientedBox(objCenterWidth / 2 / this.physics.scale,
                                         objCenterHeight / 2 / this.physics.scale,
                                         new b2Vec2(0, -1 * objCenterHeight / this.physics.scale),
                                         0);

            sensorFixtureDef.density = 0;
            sensorFixtureDef.friction = 0;
            sensorFixtureDef.restitution = 0;
            sensorFixtureDef.shape = sensorShape;
            sensorFixtureDef.isSensor = true;
            sensorFixtureDef.userData = this._playerGroundSensorId + this._groundSensorIdCounter;

            var footSensorFixture = objectBody.CreateFixture(sensorFixtureDef);
            footSensorFixture.userData = this._playerGroundSensorId + this._groundSensorIdCounter;
            this._groundSensorIdCounter += 1;
        }

        return objectBody;
    },

    addBoxBodyForTMXObjectSprite:function (sprite, object) {
        if ((sprite === null) || !(sprite instanceof cc_Sprite)) { return false; }

        cc.log("Add box body for TMX Object & Sprite...");

        var b2BodyDef = Box2D.Dynamics.b2BodyDef;
        var b2Body = Box2D.Dynamics.b2Body;
        var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
        var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
        var b2Fixture = Box2D.Dynamics.b2Fixture;
        var b2Vec2 = Box2D.Common.Math.b2Vec2;
        var hasGroundSensor = false;
        var fixedRotation = false;
        var forcedWidthCalc = sprite.getBoundingBox().size.width;
        var forcedWidth = forcedWidthCalc;
        var forcedHeightCalc = sprite.getBoundingBox().size.height;
        var forcedHeight = forcedHeightCalc;

        var objectBodyDef = new b2BodyDef();

        var objType = "";
        if (object.Cuerpo) {
            objType = object.Cuerpo.trim().toLowerCase();
        }
        else if (object.cuerpo) {
            objType = object.cuerpo.trim().toLowerCase();
        }

        // Densidad
        var objDensity, densityCalc = 1.0;
        if (object.Densidad) {
            densityCalc = parseFloat(object.Densidad);
        }
        else if (object.densidad) {
            densityCalc = parseFloat(object.densidad);
        }
        if (!isNaN(densityCalc)) { objDensity = densityCalc; }

        // Fricción
        var objFriction, frictionCalc = 1.0;
        if (object.Friccion) {
            frictionCalc = parseFloat(object.Friccion);
        }
        else if (object.friccion) {
            frictionCalc = parseFloat(object.friccion);
        }
        if (!isNaN(frictionCalc)) { objFriction = frictionCalc; }

        // Restitución
        var objRestitution, restitutionCalc = 0.0;
        if (object.Restitucion) {
            restitutionCalc = parseFloat(object.Restitucion);
        }
        else if (object.restitucion) {
            restitutionCalc = parseFloat(object.restitucion);
        }
        if (!isNaN(restitutionCalc)) { objRestitution = restitutionCalc; }

        // Determinar si el objeto es un sensor
        var objIsSensor = false;
        if (object.Sensor) {
            if (object.Sensor.trim().toLowerCase() == "true") {
                objIsSensor = true; }
            else { objIsSensor = false; }
        }
        else if (object.sensor) {
            if (object.sensor.trim().toLowerCase() == "true") {
                objIsSensor = true;
            }
            else { objIsSensor = false; }
        }

        // Determinar si el objeto es un sensor
        if (object.RotacionFija) {
            if (object.RotacionFija.trim().toLowerCase() == "true") {
                fixedRotation = true; }
            else { fixedRotation = false; }
        }
        else if (object.rotacionfija) {
            if (object.rotacionfija.trim().toLowerCase() == "true") {
                fixedRotation = true;
            }
            else { fixedRotation = false; }
        }

        switch (objType) {
            case "dynamic":
                objectBodyDef.type = b2Body.b2_dynamicBody;
                break;
            case "static":
                objectBodyDef.type = b2Body.b2_staticBody;
                break;
            case "kinematic":
                objectBodyDef.type = b2Body.b2_kinematicBody;
                break;
            default:
                objectBodyDef.type = b2Body.b2_dynamicBody;
        }

        objectBodyDef.position.Set(sprite.getPosition().x / this.physics.scale,
                                   sprite.getPosition().y / this.physics.scale);

        objectBodyDef.userData = sprite;

        var objectBody = this.physics.world.CreateBody(objectBodyDef);

        // Establecer la rotación fija si fuera necesario
        objectBody.SetFixedRotation(fixedRotation);

        cc.log(sprite.getBoundingBox().size.width);
        cc.log(sprite.getBoundingBox().size.height);

        // Ancho forzado
        if (object.AnchoForzado) {
            forcedWidthCalc = parseFloat(object.AnchoForzado);
        }
        else if (object.anchoforzado) {
            forcedWidthCalc = parseFloat(object.anchoforzado);
        }
        if (!isNaN(forcedWidthCalc) &&
            (forcedWidthCalc <= sprite.getBoundingBox().size.width)) {
            forcedWidth = forcedWidthCalc;
        }

        // Alto forzado
        if (object.AltoForzado) {
            forcedHeightCalc = parseFloat(object.AltoForzado);
        }
        else if (object.altoforzado) {
            forcedHeightCalc = parseFloat(object.altoforzado);
        }
        if (!isNaN(forcedHeightCalc) &&
            (forcedHeightCalc <= sprite.getBoundingBox().size.height)) {
            forcedHeight = forcedHeightCalc;
        }

        var spriteShape = new b2PolygonShape();
        spriteShape.SetAsBox(forcedWidth / this.physics.scale / 2,
                             forcedHeight / this.physics.scale / 2);

        // Define the dynamic body fixture.
        var spriteShapeDef = new b2FixtureDef();
        spriteShapeDef.userData = sprite;
        spriteShapeDef.shape = spriteShape;
        spriteShapeDef.density = objDensity;
        spriteShapeDef.friction = objFriction;
        spriteShapeDef.restitution = objRestitution;
        spriteShapeDef.isSensor = objIsSensor;
        objectBody.CreateFixture(spriteShapeDef);

        cc.log("Object Body Def:");
        cc.log(objectBodyDef);

        cc.log("Shape Def:");
        cc.log(spriteShapeDef);

        // Ground sensor
        if (object.SensorTierra && (spriteShape instanceof b2PolygonShape)) {
            if (object.SensorTierra.trim().toLowerCase() == "true") {
                hasGroundSensor = true; }
            else { hasGroundSensor = false; }
        }
        else if (object.sensortierra && (spriteShape instanceof b2PolygonShape)) {
            if (object.sensortierra.trim().toLowerCase() == "true") {
                hasGroundSensor = true;
            }
            else { hasGroundSensor = false; }
        }

        // Add foot sensor fixture
        if (hasGroundSensor) {
            cc.log("HAS GROUND SENSOR");
            var sensorFixtureDef = new b2FixtureDef();
            var sensorShape = new b2PolygonShape();

            sensorShape.SetAsOrientedBox(forcedWidth  / 2.2 / this.physics.scale,
                                         forcedHeight / 100 / this.physics.scale,
                                         new b2Vec2(0, -1 * sprite.getBoundingBox().size.height / 2 / this.physics.scale),
                                         0);

            sensorFixtureDef.density = 0;
            sensorFixtureDef.friction = 0;
            sensorFixtureDef.restitution = 0;
            sensorFixtureDef.shape = sensorShape;
            sensorFixtureDef.isSensor = true;

            if (sprite === this._currentPlayer) {
                sensorFixtureDef.userData = this._playerGroundSensorId;
            }
            else {
                sensorFixtureDef.userData = this._playerGroundSensorId +
                                            this._groundSensorIdCounter;
            }

            var footSensorFixture = objectBody.CreateFixture(sensorFixtureDef);
            footSensorFixture.userData = this._playerGroundSensorId + this._groundSensorIdCounter;
            this._groundSensorIdCounter += 1;

            objectBody.CreateFixture(sensorFixtureDef);
        }

        return objectBody;
    },

    spriteDone:function (sender) {
        cc.log("Destroy body from world...");

        var physics = this.physics;
        var spriteBody = null;

        //Iterate over the bodies in the physics world
        for (var b = physics.world.GetBodyList(); b; b = b.GetNext()) {
            if (b.GetUserData() !== null) {
                //Synchronize the AtlasSprites position and rotation with the corresponding body
                var myActor = b.GetUserData();

                if (myActor === sender) {
                    spriteBody = myActor;
                    break;
                }
            }
        }

        if (spriteBody !== null) {
            physics.world.DestroyBody(spriteBody);
        }
    },

    initParallax:function () {
        cc.log("Inicializar parallax...");
        // Fondo Parallax
        var parallaxNode = this._parallaxNode = cc.ParallaxNode.create();
        parallaxNode.setPosition(cc_Point(0, 0));

        this.addObjsAndEnemiesLayer();

        // Background más profundo
        var offset_x_2 = 0;
        var offset_y_2 = 0;
        var BG_2_SCALE = 1.0;
        var BG_2_RATIO = this._parallaxBG2Ratio;
        cc.log("BG_2_RATIO:");
        cc.log(BG_2_RATIO);
        var BG_2_AP = cc_Point(0, 0);

        var bg_2_images = [s_bg_h1_layer2_part0,
                           s_bg_h1_layer2_part1,
                           s_bg_h1_layer2_part2,
                           s_bg_h1_layer2_part3,
                           s_bg_h1_layer2_part4,
                           s_bg_h1_layer2_part5,
                           s_bg_h1_layer2_part6,
                           s_bg_h1_layer2_part7
                          ];

        for (var i = 0; i < bg_2_images.length; i++) {
            var sprite_2 = cc_sprite_create(bg_2_images[i]);
            sprite_2.setAnchorPoint(BG_2_AP);
            sprite_2.setScale(BG_2_SCALE);
            parallaxNode.addChild(sprite_2, -1, BG_2_RATIO, cc_Point(offset_x_2 - 2, offset_y_2));
            offset_x_2 += sprite_2.getBoundingBox().size.width;
        }
        this._layer2MaxOffset = offset_x_2;

        // Background del medio
        var offset_x_1 = 0;
        var offset_y_1 = 0;
        var BG_1_SCALE = 1.0;
        var BG_1_RATIO = this._parallaxBG1Ratio;
        cc.log("BG_1_RATIO:");
        cc.log(BG_1_RATIO);
        var BG_1_AP = cc_Point(0, 0);

        var bg_1_images = [s_bg_h1_layer1_part0,
                           s_bg_h1_layer1_part1,
                           s_bg_h1_layer1_part2,
                           s_bg_h1_layer1_part3,
                           s_bg_h1_layer1_part4,
                           s_bg_h1_layer1_part5,
                           s_bg_h1_layer1_part6,
                           s_bg_h1_layer1_part7,
                           s_bg_h1_layer1_part8,
                           s_bg_h1_layer1_part9
                          ];

        for (var j = 0; j < bg_1_images.length; j++) {
            var sprite_1 = cc_sprite_create(bg_1_images[j]);
            sprite_1.setAnchorPoint(BG_1_AP);
            sprite_1.setScale(BG_1_SCALE);
            parallaxNode.addChild(sprite_1, 1, BG_1_RATIO, cc_Point(offset_x_1 - 2, offset_y_1));
            offset_x_1 += sprite_1.getBoundingBox().size.width;
        }
        this._layer1MaxOffset = offset_x_1;

        // Background superior
        var offset_x_0 = 0;
        var offset_y_0 = -120;
        var BG_0_SCALE = 0.95;
        var BG_0_RATIO = this._parallaxBG0Ratio;
        cc.log("BG_0_RATIO:");
        cc.log(BG_0_RATIO);
        var BG_0_AP = cc_Point(0, 0);

        var bg_0_images = [s_bg_h1_layer0_part0,
                           s_bg_h1_layer0_part1,
                           s_bg_h1_layer0_part2,
                           s_bg_h1_layer0_part3,
                           s_bg_h1_layer0_part4,
                           s_bg_h1_layer0_part5,
                           s_bg_h1_layer0_part6,
                           s_bg_h1_layer0_part7,
                           s_bg_h1_layer0_part8,
                           s_bg_h1_layer0_part9,
                           s_bg_h1_layer0_part10,
                           s_bg_h1_layer0_part11,
                           s_bg_h1_layer0_part12,
                           s_bg_h1_layer0_part13,
                          ];

        for (var k = 0; k < bg_0_images.length; k++) {
            var sprite_0 = cc_sprite_create(bg_0_images[k]);
            sprite_0.setAnchorPoint(BG_0_AP);
            sprite_0.setScale(BG_0_SCALE);
            parallaxNode.addChild(sprite_0, 2, BG_0_RATIO, cc_Point(offset_x_0 - 2, offset_y_0));
            offset_x_0 += sprite_0.getBoundingBox().size.width;
        }
        this._layer0MaxOffset = offset_x_0;

        this.addChild(parallaxNode, -1, 5555);
        this.parallaxChild = this.getChildByTag(5555);
        this.parallaxChild.setPosition(cc_Point(0, 0));
    },

    _updateParallax:function () {
        var node = this.parallaxChild;
        var currentPos = node.getPosition();
        var deltaPoint = cc_pSub(this._playerPrevUIPos, this._playerCurrUIPos);
        // Corregir desplazamiento para que el parallax se mueva
        // de acuerdo a Cossino
        deltaPoint.x *= 10/21;
        node.setPosition(cc_pAdd(currentPos, deltaPoint));
    },

    scrollParallaxLeft:function (deltaX, deltaY) {
        var node = this.parallaxChild;
        var currentPos = node.getPosition();
        node.setPosition(cc_Point(currentPos.x - deltaX, currentPos.y - deltaY));
    },

    scrollParallaxRight:function (deltaX, deltaY) {
        var node = this.parallaxChild;
        var currentPos = node.getPosition();
        node.setPosition(cc_Point(currentPos.x + deltaX, currentPos.y + deltaY));
    },

    onTouchesBegan:function (touch, event) {
        this._currentPlayer.handleTouchesBegan(touch, event);
    },

    onTouchesEnded:function (touch, event) {
        this._currentPlayer.handleTouchesEnded(touch, event);
    },

    onTouchesMoved:function (touch, event) {
        this._currentPlayer.handleTouchesMoved(touch, event);
    },

    updateCameraLeft:function () {
        cc.log("Update Camera Left...");
        //this._currentPlayer.setPosition(cc_Point(this._wsizewidth * 0.66, 110));

        var goLeft = cc.MoveBy.create(0.3, cc.p(this._wsizewidth / 3, 0));
        this.parallaxChild.runAction(goLeft);

        //var goCossinoLeft = cc.MoveTo.create(0.1, cc.p(this._wsizewidth * 0.66, 110));
        var goCossinoLeft = cc.MoveTo.create(0.1, cc.p(this._wsizewidth / 2, 110));
        this._currentPlayer.runAction(goCossinoLeft);
    },

    updateCameraRight:function () {
        cc.log("Update Camera Right...");
        //this._currentPlayer.setPosition(cc_Point(this._wsizewidth / 3, 110));

        var goRight = cc.MoveBy.create(0.3, cc.p(this._wsizewidth / -3, 0));
        this.parallaxChild.runAction(goRight);

        //var goCossinoRight = cc.MoveTo.create(0.1, cc.p(this._wsizewidth / 3, 110));
        var goCossinoRight = cc.MoveTo.create(0.1, cc.p(this._wsizewidth / 2, 110));
        this._currentPlayer.runAction(goCossinoRight);
    },

    addObjsAndEnemiesLayer:function () {
        cc.log("Agregar obstáculos...");

        var OBJECT_TYPE = {
            ROCK: 0,
            ENEMY: 1,
            VIRADIUM: 2,
            TRAYECTORIA: 3,
            FINISH: 4
        };

        var PHYSIC_TYPE = {
            DYNAMIC: 2,
            KINEMATIC: 1,
            STATIC: 0
        };

        // Crear mapa TMX
        this._tileMap = cc.TMXTiledMap.create(s_objects_layer_tmx);

        if (this._tileMap !== null) {
            // Propiedades por defecto
            var mapGravityXCalc, mapGravityX = 0.0;
            var mapGravityYCalc, mapGravityY = 0.0;
            var doSleep = false;
            var scaleWorldCalc, scaleWorld = 30;
            var stepAmountCalc, stepAmount = 1/60;
            var enableDebugDraw = false;
            var prxBG2RatioXCalc, prxBG2RatioX = 1.0;
            var prxBG2RatioYCalc, prxBG2RatioY = 0;
            var prxBG1RatioXCalc, prxBG1RatioX = 1.5;
            var prxBG1RatioYCalc, prxBG1RatioY = 0;
            var prxBG0RatioXCalc, prxBG0RatioX = 2.1;
            var prxBG0RatioYCalc, prxBG0RatioY = 0;
            var prxTileMapRatioXCalc, prxTileMapRatioX = 2.1;
            var prxTileMapRatioYCalc, prxTileMapRatioY = 0;

            this._tileSize = null;
            this._mapOrientation = null;

            this._tileSize = this._tileMap.getTileSize();
            this._mapOrientation = this._tileMap.getMapOrientation();

            cc.log("Tilemap:");
            cc.log(this._tileMap);

            var mapProperties = this._tileMap.getProperties();
            var mapPropertiesLength = mapProperties.length;

            for (var p = 0; p < mapPropertiesLength; p++) {
                var property = mapProperties[p];

                // Gravedad X
                if (property.GravedadX) {
                    mapGravityXCalc = parseFloat(property.GravedadX);
                }
                else if (property.gravedadx) {
                    mapGravityXCalc = parseFloat(property.gravedadx);
                }
                if (!isNaN(mapGravityXCalc)) {
                    mapGravityX = mapGravityXCalc;
                    doSleep = true;
                }

                // Gravedad Y
                if (property.GravedadY) {
                    mapGravityYCalc = parseFloat(property.GravedadY);
                }
                else if (property.gravedady) {
                    mapGravityYCalc = parseFloat(property.gravedady);
                }
                if (!isNaN(mapGravityYCalc)) {
                    mapGravityY = mapGravityYCalc;
                    doSleep = true;
                }

                // Do Sleep
                if (property.DoSleep) {
                    doSleepProp = property.DoSleep.trim().toLowerCase();

                    if (doSleepProp == "true") {
                        doSleep = true;
                    }
                    else if (doSleepProp == "false") {
                        doSleep = false;
                    }
                }
                else if (property.dosleep) {
                    doSleepProp = property.dosleep.trim().toLowerCase();

                    if (doSleepProp == "true") {
                        doSleep = true;
                    }
                    else if (doSleepProp == "false") {
                        doSleep = false;
                    }
                }

                // Escala del mundo físico
                if (property.Escala) {
                    scaleWorldCalc = parseFloat(property.Escala);
                }
                else if (property.escala) {
                    scaleWorldCalc = parseFloat(property.escala);
                }
                if (!isNaN(scaleWorldCalc)) { scaleWorld = scaleWorldCalc; }

                // Step Amount
                if (property.Avance) {
                    stepAmountCalc = parseFloat(property.Avance);
                }
                else if (property.avance) {
                    stepAmountCalc = parseFloat(property.avance);
                }
                if (!isNaN(stepAmountCalc)) { stepAmount = stepAmountCalc; }

                // Habilitar DebugDraw de físicas
                // Do Sleep
                if (property.DebugDraw) {
                    enableDebugDraw = property.DebugDraw.trim().toLowerCase();

                    if (enableDebugDraw == "true") {
                        this._debugPhysicsDraw = true;
                    }
                    else if (enableDebugDraw == "false") {
                        this._debugPhysicsDraw = false;
                    }
                }
                else if (property.debugdraw) {
                    enableDebugDraw = property.debugdraw.trim().toLowerCase();

                    if (enableDebugDraw == "true") {
                        this._debugPhysicsDraw = true;
                    }
                    else if (enableDebugDraw == "false") {
                        this._debugPhysicsDraw = false;
                    }
                }

                // Parallax Background 2
                // Ratio X
                if (property.ParallaxBG2RatioX) {
                    prxBG2RatioXCalc = parseFloat(property.ParallaxBG2RatioX);
                }
                else if (property.parallaxbg2ratiox) {
                    prxBG2RatioXCalc = parseFloat(property.parallaxbg2ratiox);
                }
                if (!isNaN(prxBG2RatioXCalc)) { prxBG2RatioX = prxBG2RatioXCalc; }

                // Ratio Y
                if (property.ParallaxBG2RatioY) {
                    prxBG2RatioYCalc = parseFloat(property.ParallaxBG2RatioY);
                }
                else if (property.parallaxbg2ratioy) {
                    prxBG2RatioYCalc = parseFloat(property.parallaxbg2ratioy);
                }
                if (!isNaN(prxBG2RatioYCalc)) { prxBG2RatioY = prxBG2RatioYCalc; }

                // Parallax Background 1
                // Ratio X
                if (property.ParallaxBG1RatioX) {
                    prxBG1RatioXCalc = parseFloat(property.ParallaxBG1RatioX);
                }
                else if (property.parallaxbg1ratiox) {
                    prxBG1RatioXCalc = parseFloat(property.parallaxbg1ratiox);
                }
                if (!isNaN(prxBG1RatioXCalc)) { prxBG1RatioX = prxBG1RatioXCalc; }

                // Ratio Y
                if (property.ParallaxBG1RatioY) {
                    prxBG1RatioYCalc = parseFloat(property.ParallaxBG1RatioY);
                }
                else if (property.parallaxbg1ratioy) {
                    prxBG1RatioYCalc = parseFloat(property.parallaxbg1ratioy);
                }
                if (!isNaN(prxBG1RatioYCalc)) { prxBG1RatioY = prxBG1RatioYCalc; }

                // Parallax Background 0
                // Ratio X
                if (property.ParallaxBG0RatioX) {
                    prxBG0RatioXCalc = parseFloat(property.ParallaxBG0RatioX);
                }
                else if (property.parallaxbg0ratiox) {
                    prxBG0RatioXCalc = parseFloat(property.parallaxbg0ratiox);
                }
                if (!isNaN(prxBG0RatioXCalc)) { prxBG0RatioX = prxBG0RatioXCalc; }

                // Ratio Y
                if (property.ParallaxBG0RatioY) {
                    prxBG0RatioYCalc = parseFloat(property.ParallaxBG0RatioY);
                }
                else if (property.parallaxbg0ratioy) {
                    prxBG0RatioYCalc = parseFloat(property.parallaxbg0ratioy);
                }
                if (!isNaN(prxBG0RatioYCalc)) { prxBG0RatioY = prxBG0RatioYCalc; }

                // Parallax Tilemap
                // Ratio X
                if (property.ParallaxTilemapRatioX) {
                    prxTileMapRatioXCalc = parseFloat(property.ParallaxTilemapRatioX);
                }
                else if (property.parallaxtilemapratiox) {
                    prxTileMapRatioXCalc = parseFloat(property.parallaxtilemapratiox);
                }
                if (!isNaN(prxTileMapRatioXCalc)) { prxTileMapRatioX = prxTileMapRatioXCalc; }

                // Ratio Y
                if (property.ParallaxTilemapRatioY) {
                    prxTileMapRatioYCalc = parseFloat(property.ParallaxTilemapRatioY);
                }
                else if (property.parallaxtilemapratioy) {
                    prxTileMapRatioYCalc = parseFloat(property.parallaxtilemapratioy);
                }
                if (!isNaN(prxTileMapRatioYCalc)) { prxTileMapRatioY = prxTileMapRatioYCalc; }
            }

            // Establecer ratios de las capas del parallax
            this._parallaxBG2Ratio = cc_Point(prxBG2RatioX,
                                              prxBG2RatioY);

            this._parallaxBG1Ratio = cc_Point(prxBG1RatioX,
                                              prxBG1RatioY);

            this._parallaxBG0Ratio = cc_Point(prxBG0RatioX,
                                              prxBG0RatioY);

            // Capa de rocas y enemigos
            var offset_x_0 = 0;
            var offset_y_0 = 0;
            var BG_0_SCALE = 1.0;
            var BG_0_RATIO = this._parallaxTilemapRatio = cc_Point(prxTileMapRatioX,
                                                                   prxTileMapRatioY);
            var BG_0_AP = cc_Point(0, 0);

            this._parallaxNode.addChild(this._tileMap, 3, BG_0_RATIO, cc_Point(0, 0));

            // Debug canvas
            var debugCanvas = document.getElementById("debugCanvas");

            // Inicializar el mundo físico con las propiedades obtenidas
            this._initPhysics(mapGravityX,
                              mapGravityY,
                              doSleep,
                              scaleWorld,
                              stepAmount,
                              debugCanvas);

            this._processCossinoPLayer();
            this._processBackgroundLayer();
            this._processColisionesLayer();
            this._processTrayectoriasLayer();
            this._processColeccionablesLayer();
            this._processFinishLayer();
        }
    },

    _setCollisionsListener:function () {
        if ((this.physics === null) && (this.physics === undefined)) { return; }

        // Collision listener override
        var b2ContactListener = Box2D.Dynamics.b2ContactListener;
        var collisionListener = new b2ContactListener();

        collisionListener.BeginContact = function (contact) {
            var fixtureA = contact.GetFixtureA();
            var bodyA = fixtureA.GetBody();
            var userDataA = fixtureA.GetUserData();

            var fixtureB = contact.GetFixtureB();
            var bodyB = fixtureB.GetBody();
            var userDataB = fixtureB.GetUserData();

            if (userDataA !== null) {
                if (userDataA instanceof CossinoSprite) {
                    // TODO: Eliminar líneas de logging y color
                    cc.log("Begin Body A (Cossino Sprite): " + bodyA.GetPosition().x + " " + bodyA.GetPosition().y);
                    userDataA.setColor(new cc.Color4B(255, 0, 0, 128));
                }
                else if (userDataA instanceof ViradiumSprite) {
                    // TODO: Eliminar líneas de logging y color
                    cc.log("Begin Body A (Viradium Sprite): " + bodyA.GetPosition().x + " " + bodyA.GetPosition().y);
                    userDataA.setColor(new cc.Color4B(255, 0, 0, 128));
                }
                else if (userDataA instanceof Object) {
                    // TODO: Eliminar líneas de logging y color
                    cc.log("Begin Body A (TMX Object): " + bodyA.GetPosition().x + " " + bodyA.GetPosition().y);
                }
                else if (userDataA == 1000) {
                    // TODO: Eliminar líneas de logging y color
                    cc.log("Begin Ground Sensor A.");
                    cc.log(userDataA);
                    bodyA.GetUserData().setPlayerIsOnGround(true);
                }
            }

            if (userDataB !== null) {
                if (userDataB instanceof CossinoSprite) {
                    // TODO: Eliminar líneas de logging y color
                    cc.log("Begin Body B (Cossino Sprite): " + bodyB.GetPosition().x + " " + bodyB.GetPosition().y);
                    userDataB.setColor(new cc.Color4B(255, 0, 0, 128));
                }
                else if (userDataB instanceof ViradiumSprite) {
                    // TODO: Eliminar líneas de logging y color
                    cc.log("Begin Body B (Viradium Sprite): " + bodyB.GetPosition().x + " " + bodyB.GetPosition().y);
                    userDataB.setColor(new cc.Color4B(255, 0, 0, 128));
                }
                else if (userDataB instanceof Object) {
                    // TODO: Eliminar líneas de logging y color
                    cc.log("Begin Body B (TMX Object): " + bodyB.GetPosition().x + " " + bodyB.GetPosition().y);
                }
                else if (userDataB == 1000) {
                    // TODO: Eliminar líneas de logging y color
                    cc.log("Begin Ground Sensor B.");
                    cc.log(userDataB);
                    bodyB.GetUserData().setPlayerIsOnGround(true);
                }
            }
        };

        collisionListener.EndContact = function (contact) {
            var fixtureA = contact.GetFixtureA();
            var bodyA = fixtureA.GetBody();
            var userDataA = fixtureA.GetUserData();

            var fixtureB = contact.GetFixtureB();
            var bodyB = fixtureB.GetBody();
            var userDataB = fixtureB.GetUserData();

            if (userDataA !== null) {
                if (userDataA instanceof CossinoSprite) {
                    // TODO: Eliminar líneas de logging y color
                    cc.log("End Body A (Cossino Sprite): " + bodyA.GetPosition().x + " " + bodyA.GetPosition().y);
                    userDataA.setColor(new cc.Color4B(0, 0, 255, 128));
                }
                else if (userDataA instanceof ViradiumSprite) {
                    // TODO: Eliminar líneas de logging y color
                    cc.log("Begin Body A (Viradium Sprite): " + bodyA.GetPosition().x + " " + bodyA.GetPosition().y);
                    userDataA.setColor(new cc.Color4B(0, 0, 255, 128));
                }
                else if (userDataA instanceof Object) {
                    // TODO: Eliminar líneas de logging y color
                    cc.log("End Body A (TMX Object): " + bodyA.GetPosition().x + " " + bodyA.GetPosition().y);
                }
                else if (userDataA == 1000) {
                    // TODO: Eliminar líneas de logging y color
                    cc.log("End Ground Sensor A.");
                    cc.log(userDataA);
                    bodyA.GetUserData().setPlayerIsOnGround(false);
                }
            }

            if (userDataB !== null) {
                if (userDataB instanceof CossinoSprite) {
                    // TODO: Eliminar líneas de logging y color
                    cc.log("End Body B (Sprite): " + bodyB.GetPosition().x + " " + bodyB.GetPosition().y);
                    userDataB.setColor(new cc.Color4B(255, 0, 0, 128));
                }
                else if (userDataB instanceof ViradiumSprite) {
                    // TODO: Eliminar líneas de logging y color
                    cc.log("End Body B (Viradium Sprite): " + bodyB.GetPosition().x + " " + bodyB.GetPosition().y);
                    userDataB.setColor(new cc.Color4B(255, 0, 0, 128));
                }
                else if (userDataB instanceof Object) {
                    // TODO: Eliminar líneas de logging y color
                    cc.log("End Body B (TMX Object): " + bodyB.GetPosition().x + " " + bodyB.GetPosition().y);
                }
                else if (userDataB == 1000) {
                    // TODO: Eliminar líneas de logging y color
                    cc.log("End Ground Sensor B.");
                    cc.log(userDataB);
                    bodyB.GetUserData().setPlayerIsOnGround(false);
                }
            }
        };

        this.physics.world.SetContactListener(collisionListener);
    },

    _processCossinoPLayer:function () {
        var layerCossino = this._tileMap.getObjectGroup("Cossino");
        var objectCossino = null;

        if ((layerCossino !== null) & (layerCossino !== undefined)) {
            objectCossino = layerCossino.objectNamed("Cossino");
        }

        var b2Vec2 = Box2D.Common.Math.b2Vec2;
        var objEscala = 0.5;
        var escalaCalc = 0.5;
        var walkDeltaPos = cc_Point(1.5, 0);
        var walkDeltaPosXCalc = 1.5;
        var walkDeltaPosYCalc = 0;
        var jumpDeltaPos = cc_Point(3.5, 0);
        var jumpDeltaPosXCalc = 3.5;
        var jumpDeltaPosYCalc = 0;
        var runDeltaPos = cc_Point(1.0, 0);
        var runDeltaPosXCalc = 1.0;
        var runDeltaPosYCalc = 0;
        var walkDeltaMultiplier = 1.0;
        var walkDeltaMultiplierCalc = 1.0;
        var runDeltaMultiplier = 1.0;
        var runDeltaMultiplierCalc = 1.0;
        var jumpDeltaMultiplier = 1.0;
        var jumpDeltaMultiplierCalc = 1.0;
        // Posición inicial de Cossino
        var objPosicionInicial = cc_Point(this._wsizewidth / 2, 300);
        // var objPosicionInicial = cc_Point(objectCossino.x + (objectCossino.width / 2),
        //                                   objectCossino.y + (objectCossino.height / 2));

        cc.log("Layer Cossino");
        cc.log(objectCossino);

        if ((objectCossino !== null) & (objectCossino !== undefined)) {
            // Escala
            if (objectCossino.Escala) {
                escalaCalc = parseFloat(objectCossino.Escala);
            }
            else if (objectCossino.escala) {
                escalaCalc = parseFloat(objectCossino.escala);
            }
            if (!isNaN(escalaCalc)) { objEscala = escalaCalc; }

            // Delta Walk
            if (objectCossino.CaminarDeltaX) {
                walkDeltaPosXCalc = parseFloat(objectCossino.CaminarDeltaX);
            }
            else if (objectCossino.caminardeltax) {
                walkDeltaPosXCalc = parseFloat(objectCossino.caminardeltax);
            }

            if (objectCossino.CaminarDeltaY) {
                walkDeltaPosYCalc = parseFloat(objectCossino.CaminarDeltaY);
            }
            else if (objectCossino.caminardeltay) {
                walkDeltaPosYCalc = parseFloat(caminardeltay);
            }

            if (!isNaN(walkDeltaPosXCalc) & !isNaN(walkDeltaPosYCalc)) {
                walkDeltaPos = cc_Point(walkDeltaPosXCalc, walkDeltaPosYCalc);
            }
            else {
                walkDeltaPos = cc_Point(1.5, 0);
            }

            // Delta Jump
            if (objectCossino.SaltarDeltaX) {
                jumpDeltaPosXCalc = parseFloat(objectCossino.SaltarDeltaX);
            }
            else if (objectCossino.saltardeltax) {
                jumpDeltaPosXCalc = parseFloat(objectCossino.saltardeltax);
            }

            if (objectCossino.SaltarDeltaY) {
                jumpDeltaPosYCalc = parseFloat(objectCossino.SaltarDeltaY);
            }
            else if (objectCossino.saltardeltay) {
                jumpDeltaPosYCalc = parseFloat(objectCossino.saltardeltay);
            }

            if (!isNaN(jumpDeltaPosXCalc) & !isNaN(jumpDeltaPosYCalc)) {
                jumpDeltaPos = cc_Point(jumpDeltaPosXCalc, jumpDeltaPosYCalc);
            }
            else {
                jumpDeltaPos = cc_Point(3.5, 0);
            }

            // Delta Run
            if (objectCossino.CorrerDeltaX) {
                runDeltaPosXCalc = parseFloat(objectCossino.CorrerDeltaX);
            }
            else if (objectCossino.correrdeltax) {
                runDeltaPosXCalc = parseFloat(objectCossino.correrdeltax);
            }

            if (objectCossino.CorrerDeltaY) {
                runDeltaPosYCalc = parseFloat(objectCossino.CorrerDeltaY);
            }
            else if (objectCossino.correrdeltay) {
                runDeltaPosYCalc = parseFloat(objectCossino.correrdeltay);
            }

            if (!isNaN(runDeltaPosXCalc) & !isNaN(runDeltaPosYCalc)) {
                runDeltaPos = cc_Point(runDeltaPosXCalc, runDeltaPosYCalc);
            }
            else {
                runDeltaPos = cc_Point(1.0, 0);
            }

            // Multiplicador caminar
            if (objectCossino.MultDeltaCaminar) {
                walkDeltaMultiplierCalc = parseFloat(objectCossino.MultDeltaCaminar);
            }
            else if (objectCossino.multdeltacaminar) {
                walkDeltaMultiplierCalc = parseFloat(objectCossino.multdeltacaminar);
            }
            if (!isNaN(walkDeltaMultiplierCalc)) { walkDeltaMultiplier = walkDeltaMultiplierCalc; }

            // Multiplicador correr
            if (objectCossino.MultDeltaCorrer) {
                runDeltaMultiplierCalc = parseFloat(objectCossino.MultDeltaCorrer);
            }
            else if (objectCossino.multdeltacorrer) {
                runDeltaMultiplierCalc = parseFloat(objectCossino.multdeltacorrer);
            }
            if (!isNaN(runDeltaMultiplierCalc)) { runDeltaMultiplier = runDeltaMultiplierCalc; }

            // Multiplicador saltar
            if (objectCossino.MultDeltaSaltar) {
                jumpDeltaMultiplierCalc = parseFloat(objectCossino.MultDeltaSaltar);
            }
            else if (objectCossino.multdeltasaltar) {
                jumpDeltaMultiplierCalc = parseFloat(objectCossino.multdeltasaltar);
            }
            if (!isNaN(jumpDeltaMultiplierCalc)) { jumpDeltaMultiplier = jumpDeltaMultiplierCalc; }
        }

        // -------------------------------------------------------------------
        // Create Cossino sprite
        cc.log("Crear sprite de Cossino...");
        cossino_pj = Cossino.getInstance();
        cossino_pj.setScale(objEscala);
        cossino_pj.setPosition(objPosicionInicial);
        cossino_pj.setTerrainType(TERRAIN_TYPE.DIRT);
        cossino_pj.setWalkDeltaPos(walkDeltaPos);
        cossino_pj.setRunDeltaPos(runDeltaPos);
        cossino_pj.setJumpDeltaPos(jumpDeltaPos);
        cc.log(cossino_pj);

        cc.log("Agregar sprite Cossino a escena.");
        this.addChild(cossino_pj, 0, 1111);

        // Establecer a Cossino como el personaje actual
        this._currentPlayer = cossino_pj;
        this._playerCurrentStatus = cossino_pj._currentStatus;
        this._playerCurrentDirection = cossino_pj._currentDirection;

        // Establecer multiplicadores de impulsos físicos
        this._playerWalkDeltaMultiplier = walkDeltaMultiplier;
        this._playerRunDeltaMultiplier = runDeltaMultiplier;
        this._playerJumpDeltaMultiplier = jumpDeltaMultiplier;

        // Agregar físicas al personaje actual
        if ((objectCossino !== null & objectCossino !== undefined)) {
            cc.log("Objeto TMX Sprite definido.");
            if (objectCossino.x < objPosicionInicial.x) {
                objectCossino.x = objPosicionInicial.x;
            }

            if (objectCossino.y < objPosicionInicial.y) {
                objectCossino.y = objPosicionInicial.y;
            }

            this._playerPhysicBody = this.addBoxBodyForTMXObjectSprite(cossino_pj, objectCossino);
        }
        else {
            cc.log("Objeto TMX Sprite NO definido.");
            this._playerPhysicBody = this.addBoxBodyForSprite(cossino_pj, 0, false);
        }

        // Registrar su posición actual en el mundo físico
        this._playerCurrPhyPos = this._playerPhysicBody.GetPosition();
        this._playerPrevPhyPos = this._playerCurrPhyPos;

        this._playerCurrUIPos = cc_Point(this._playerCurrPhyPos.x * this.physics.scale,
                                         this._playerCurrPhyPos.y * this.physics.scale);
        this._playerPrevUIPos = this._playerCurrUIPos;
        this._playerPrevUIPos.y -= objPosicionInicial.y;

        this._playerCurrPhyRot = this._playerPhysicBody.GetAngle();
        this._playerCurrUIRot = -1 * cc_RADIANS_TO_DEGREES(this._playerCurrPhyRot);

        cc.log("Player Body");
        cc.log(this._playerPhysicBody);
    },

    _processBackgroundLayer:function () {
        // Capa "Background"
        if (this._tileMap === null) { return false; }

        var layerBackground_1 = this._tileMap.getLayer("Background_1");
        var layerBackground_2 = this._tileMap.getLayer("Background_2");
        cc.log("-----------------");
        cc.log("Layer Background 1");
        cc.log(layerBackground_1);
        cc.log("Layer Background 2");
        cc.log(layerBackground_1);

        return true;
    },

    _processColisionesLayer:function () {
        // Capa "Colisiones"
        if (this._tileMap === null) { return false; }

        var layerColisiones = this._tileMap.getObjectGroup("Colisiones");
        var objectsColisiones = layerColisiones.getObjects();
        cc.log("-----------------");
        cc.log("Layer Colisiones");
        cc.log(layerColisiones);
        cc.log(objectsColisiones);

        var objColisionesLength = objectsColisiones.length;
        for (var c = 0; c < objColisionesLength; c++) {
            var colision = objectsColisiones[c];
            cc.log(colision);

            this.addBoxBodyForTMXObject(colision);
        }

        this._setCollisionsListener();

        return true;
    },

    _processTrayectoriasLayer:function () {
        // Capa "Trayectorias"
        if (this._tileMap === null) { return false; }

        var layerTrayectorias = this._tileMap.getObjectGroup("Trayectorias");
        var objectsTrayectorias = layerTrayectorias.getObjects();
        cc.log("-----------------");
        cc.log("Layer Trayectorias");
        cc.log(layerTrayectorias);
        cc.log(objectsTrayectorias);

        var objTrayecLength = objectsTrayectorias.length;
        for (var t = 0; t < objTrayecLength; t++) {
        }

        return true;
    },

    _processColeccionablesLayer:function () {
        // Capa "Coleccionables"
        if (this._tileMap === null) { return false; }

        var layerColeccionables = this._tileMap.getObjectGroup("Coleccionables");
        var objectsColeccionables = layerColeccionables.getObjects();
        cc.log("-----------------");
        cc.log("Layer Coleccionables");
        cc.log(layerColeccionables);
        cc.log(objectsColeccionables);

        var objColecLength = objectsColeccionables.length;
        var collectable = null;
        var viradiumSprite = null;

        for (var k = 0; k < objColecLength; k++) {
            collectable = objectsColeccionables[k];

            collectable.Sensor = "True";
            collectable.Densidad = 0;
            collectable.Friccion = 0;
            collectable.Restitucion = 0;
            collectable.Cuerpo = "Static";

            viradiumSpr = new ViradiumSprite();
            viradiumSpr.setScale(0.5);
            this._tileMap.addChild(viradiumSpr, -1);

            this.addBoxBodyForTMXObject(collectable, viradiumSpr);
        }

        return true;
    },

    _processFinishLayer:function () {
        // Capa "Finish"
        if (this._tileMap === null) { return false; }

        var layerFinish = this._tileMap.getObjectGroup("Finish");
        var objectsFinish = layerFinish.getObjects();
        cc.log("-----------------");
        cc.log("Layer Finish");
        cc.log(layerFinish);
        cc.log(objectsFinish);

        var objFinishLength = objectsFinish.length;
        for (var m = 0; m < objFinishLength; m++) {
        }

        return true;
    },

    _destroyPhysicWorld:function () {
        if (this.physics.world !== null) {
            //Iterate over the bodies in the physics world
            for (var bodyf = this.physics.world.GetBodyList(); bodyf; bodyf = bodyf.GetNext()) {
                this.physics.world.DestroyBody(bodyf);
            }

            this.physics.step(1/60);
            this.physics.world = null;
            this.physics = null;
        }
    },

    _reloadObjsAndEnemiesLayer:function () {
        if ((this.parallaxChild === null) || (this._tileMap === null)) { return; }
        // In the meantime, preload TMX
        cc.Loader.getInstance().releaseResources([{src: "../../" + s_objects_layer_tmx}]);
        cc.Loader.purgeCachedData([{src: "../../" + s_objects_layer_tmx}]);
        cc.SAXParser.getInstance().preloadPlist(s_objects_layer_tmx);

        this.unscheduleUpdate();

        this._destroyPhysicWorld();

        var canvasDebug = document.getElementById("debugCanvas");
        var ctx = canvasDebug.getContext("2d");
        ctx.canvas.height = 600;
        ctx.canvas.width = 1024;

        // Destroy everything
        this.removeChild(this.parallaxChild);
        this.removeChild(this._currentPlayer);
        this._parallaxNode = null;
        this.parallaxChild = null;
        this._tileMap = null;
        this._previousDirection = null;
        this._currentDirection = null;
        this._playerPrevPhyPos = null;
        this._playerCurrPhyPos = null;
        this._playerCurrPhyRot = null;
        this._playerPrevUIPos = null;
        this._playerCurrUIPos = null;
        this._playerCurrUIRot = null;
        this._tileMap = null;
        this._tileSize = null;
        this._mapOrientation = null;
        this._physicsDoSleep = false;
        this._currentPlayer = null;
        this._debugPhysicsDraw = false;
        this._parallaxBG2Ratio = null;
        this._parallaxBG1Ratio = null;
        this._parallaxBG0Ratio = null;
        this._parallaxTilemapRatio = null;

        // Re-create
        this.initParallax();

        this.scheduleUpdate();
    },

    makePlayerJump:function () {
            var this_obj = this;
            var b2Vec2 = Box2D.Common.Math.b2Vec2;
            var body = this_obj._playerPhysicBody;
            var multiplier = this_obj._playerJumpDeltaMultiplier;
            cc.log(multiplier);
            var deltaX = (this_obj._currentPlayer.getJumpDeltaPos().x /
                          this_obj.physics.scale) * multiplier;
            var deltaY = (this_obj._currentPlayer.getJumpDeltaPos().y /
                          this_obj.physics.scale) * multiplier;

            deltaX *= (this_obj._currentPlayer._currentDirection === CHR_DIRECTION.RIGHT) ? 1 : -1;
            // deltaY *= (this_obj._currentPlayer._currentDirection === CHR_DIRECTION.UP) ? 1 : -1;

            var velChangeX = deltaX - body.GetLinearVelocity().x;
            var velChangeY = deltaY - body.GetLinearVelocity().y;
            var bodyMass = body.GetMass();

            body.ApplyImpulse(new b2Vec2(bodyMass * velChangeX, bodyMass * velChangeY),
                                         body.GetWorldCenter());
    },

    makePlayerRun:function () {
        var this_obj = this;
        var b2Vec2 = Box2D.Common.Math.b2Vec2;
        var body = this_obj._playerPhysicBody;
        var multiplier = this_obj._playerRunDeltaMultiplier;

        var deltaX = (this_obj._currentPlayer.getDeltaPos().x /
                      this_obj.physics.scale) * multiplier;

        var velChangeX = deltaX - body.GetLinearVelocity().x;
        var bodyMass = body.GetMass();

        body.ApplyImpulse(new b2Vec2(bodyMass * velChangeX, 0), body.GetWorldCenter());
    },

    makePlayerWalk:function () {
        var this_obj = this;
        var b2Vec2 = Box2D.Common.Math.b2Vec2;
        var body = this_obj._playerPhysicBody;
        var multiplier = this_obj._playerWalkDeltaMultiplier;

        var deltaX = (this_obj._currentPlayer.getDeltaPos().x /
                      this_obj.physics.scale) * multiplier;

        var velChangeX = deltaX - body.GetLinearVelocity().x;
        var bodyMass = body.GetMass();

        body.ApplyImpulse(new b2Vec2(bodyMass * velChangeX, 0), body.GetWorldCenter());
    }
});


var gameHUDLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this.setPosition(cc_Point(0, 0));
        return true;
    }
});


var Hist1Level1Scene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        this.setPosition(cc_Point(0, 0));

        this.setTag(TAGS.ESCENAS.MAIN_MENU);

        // Game Layer
        var mainMenu = new Hist1Lvl1Layer();
        // mainMenu.init();
        this.addChild(mainMenu, 1, TAGS.CAPAS.MAIN_MENU);

        // HUD Layer
        var gameHUD = new gameHUDLayer();
        // gameHUD.init();
        this.addChild(gameHUD, 2, TAGS.CAPAS.HUD);

        cc.log("Children Count: " + this.getChildrenCount());
    }
});
