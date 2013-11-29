var cc_Point = cc.p;
var cc_sprite_create = cc.Sprite.create;

var lastEvent = -1;
var heldKeys = {};

var TAG_SPRITE_MANAGER = 8888;
var PTM_RATIO = 30;


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
    _walkDeltaPos: 1.1,
    _walkDeltaPostCount: 0,
    _jumpDeltaPos: 1,
    _jumpDeltaPosCount: 0,
    _runDeltaPos: 3,
    _runDeltaPosCount: 0,
    _deltaPosTotal: 0,
    _onTerrainType: null,
    audioEngine: null,
    spriteDescription: null,
    _footSoundCounter: 0,
    _rocks: null,

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
            case cc.KEY.left:
                if (this._currentStatus == CHR_STATUS.JUMP) {
                    this.reqOnFinishJumpStop(this.beginWalk);
                } else {
                    this.turnLeft();
                    this.beginWalk();
                }

                break;
            case cc.KEY.right:
                if (this._currentStatus == CHR_STATUS.JUMP) {
                    this.reqOnFinishJumpStop(this.beginWalk);
                } else {
                    this.turnRight();
                    this.beginWalk();
                }
                break;
            case cc.KEY.a:
                if (this._currentStatus == CHR_STATUS.JUMP) {
                    this.reqOnFinishJumpStop(this.beginRun);
                } else {
                   this.beginRun();
                }
                break;
            case cc.KEY.s:
                this.beginJump();
                break;
            default:
                this.beginStand();
                break;
        }
    },

    handleKeyUp:function (e) {
        cc.log("Handle Key Up Cossino.");

        switch (e) {
            case cc.KEY.left:
                if (this._currentStatus == CHR_STATUS.WALK) {
                    this.beginStand();
                }
                break;
            case cc.KEY.right:
                if (this._currentStatus == CHR_STATUS.WALK) {
                    this.beginStand();
                }
                break;
            case cc.KEY.a:
                if (this._currentStatus == CHR_STATUS.RUN) {
                    // this.stopRun();
                    this.beginStand();
                 }
                break;
            case cc.KEY.s:
                if (this._currentStatus == CHR_STATUS.JUMP) {
                    this.reqOnFinishJumpStop();
                    //this.beginStand();
                }
                break;
            default:
                // this.beginStand();
                break;
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
        cc.log("Walk Cossino.");
        this._setDeltaPos(this._walkDeltaPos);
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
        cc.log("Jump Cossino.");
        this._setDeltaPos(this._jumpDeltaPos);
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
        cc.log("Run Cossino.");
        this._setDeltaPos(this._runDeltaPos);
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
        this._deltaPosTotal = 0;
    },

    _setDeltaPos:function (delta) {
        this._deltaPosTotal = delta;
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
    }
});


var Hist1Lvl1Layer = cc.Layer.extend({
    _debug: cc.COCOS2D_DEBUG,
    cossino_pj: null,
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
    _tileMap: null,

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

        this.audioEngine.setEffectsVolume(0.8);
        this.audioEngine.setMusicVolume(0.8);

        menuItemX = this._centerScreenX = wSizeWidth / 2;
        menuItemY = this._centerScreenY = wSizeHeight / 2;

        this._currentDirection = this._previousDirection = CHR_DIRECTION.RIGHT;

        // Inicializar fondos parallax
        this.initParallax();

        // Create new label
        var menuTitulo = cc.LabelTTF.create("Introducción Historia 1",
                                            "Courier New",
                                            30);

        cc.log("Crear título de escena...");
        // Position the label on the center of the screen
        menuTitulo.setPosition(cc_Point(menuItemX, wSizeHeight - 35));
        // Add the label as a child to this layer
        this.addChild(menuTitulo);

        // -------------------------------------------------------------------
        // Create Cossino sprite
        cc.log("Crear sprite de Cossino...");
        this.cossino_pj = new CossinoSprite();
        //this.cossino_pj.setScale(0.55);
        this.cossino_pj.setScale(0.55);
        this.cossino_pj.setPosition(cc_Point(this._wsizewidth / 2, 100));
        this.cossino_pj.setTerrainType(TERRAIN_TYPE.DIRT);
        cc.log(this.cossino_pj);

        cc.log("Agregar sprite Cossino a escena.");
        this.addChild(this.cossino_pj, 0, 1111);

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
        var Physics = function (element, scale) {
            var gravity = new b2Vec2(0, -10.0);
            var doSleep = true;
            this.world = new b2World(gravity, doSleep);
            this.world.SetContinuousPhysics(true);
            this.element = element;

            try {
                this.context = element.getContext("2d");
            }
            catch (e) {
            }

            this.scale = scale || 30;  // 30 pixeles = 1 metro
            this.dtRemaining = 0;
            this.stepAmount = 1/60;
        };

        Physics.prototype.step = function (dt) {
            this.dtRemaining += dt;

            while (this.dtRemaining > this.stepAmount) {
                this.dtRemaining -= this.stepAmount;
                this.world.Step(this.stepAmount,
                8, // velocity iterations
                3); // position iterations
            }
            if (this.debugDraw) {
                this.world.DrawDebugData();
            }
        };

        this._canvas = document.getElementById(myApp.config.tag);
        this.physics = new Physics(this._canvas, 30);

        // Límite inferior (piso)
        // var fixDefInf = new b2FixtureDef();
        // var bodyDefInf = new b2BodyDef();

        // fixDefInf.density = 10.0;
        // fixDefInf.friction = 0.5;
        // fixDefInf.restitution = 0.2;
        // bodyDefInf.type = b2Body.b2_staticBody;
        // fixDefInf.shape = new b2PolygonShape();
        // bodyDefInf.position.Set((wSizeWidth / 2) / 30, 0 / 30);
        // fixDefInf.shape.SetAsBox((wSizeWidth / 2) / 30, 0.1 / 30);
        // this.physics.world.CreateBody(bodyDefInf).CreateFixture(fixDefInf);

        // Enable debug draw
        // var canvasDebug = document.getElementById(myApp.config.tag);
        // var debugDraw = new b2DebugDraw();  // Objeto de visualización de depuración
        // debugDraw.SetSprite(canvasDebug.getContext("2d") || canvasDebug.getContext("webgl"));  // Establecemos el canvas para visualizarlo
        // debugDraw.SetDrawScale(this.physics.scale);     // Escala de la visualización
        // debugDraw.SetFillAlpha(0.5);    // Transparencia de los elementos (debug)
        // debugDraw.SetLineThickness(1.0);
        // debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        // this.physics.world.SetDebugDraw(debugDraw);  // Le proporcionamos al "mundo" la salida del debug

        // Set up sprite physics for Cossino
        // FIXME:
        this.addBoxBodyForSprite(this.cossino_pj, 0, false);

        // Agregar capa de obstáculos
        this.addObjsAndEnemiesLayer();

        // For testing physics
        // var mgr = cc.SpriteBatchNode.create(s_pathBlock, 150);
        // this.addChild(mgr, 0, 8855);

        // -------------------------------------------------------------------

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

    initPhysics:function () {
    },

    onEnter:function () {
        this._super();
        cc.log("Reproducir música de fondo.");
        this.audioEngine.playMusic(s_ambient_music_1, true);
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
            case cc.KEY.right:
                this._previousDirection = this._currentDirection;
                this._currentDirection = CHR_DIRECTION.RIGHT;
                break;
            case cc.KEY.left:
                this._previousDirection = this._currentDirection;
                this._currentDirection = CHR_DIRECTION.LEFT;
                break;
            default:
                break;
        }

        // Propagate key down to children
        this.cossino_pj.handleKeyDown(e);
    },

    onKeyUp:function (e) {
        lastEvent = null;
        delete heldKeys[e];

        switch (e) {
            case cc.KEY.r:
                this._reloadObjsAndEnemiesLayer();
                break;
        }

        // Propagate key up to children
        this.cossino_pj.handleKeyUp(e);
    },

    update:function (dt) {
        var this_obj = this;
        var physics = this_obj.physics;
        var b2Vec2 = Box2D.Common.Math.b2Vec2;

        //Iterate over the bodies in the physics world
        // for (var b = physics.world.GetBodyList(); b; b = b.GetNext()) {
        //     if (b.GetUserData() !== null) {
        //         //Synchronize the AtlasSprites position and rotation with the corresponding body
        //         var myActor = b.GetUserData();

        //         myActor.setPosition(cc.p(b.GetPosition().x * physics.scale,
        //                                  b.GetPosition().y * physics.scale));

        //         myActor.setRotation(-1 * cc.RADIANS_TO_DEGREES(b.GetAngle()));

        //         // cc.log(myActor.getPosition().x + " " + myActor.getPosition().y);
        //     }
        // }

        // Instruct the world to perform a single step of simulation.
        physics.step(dt);

        for (var body = physics.world.GetBodyList(); body; body = body.GetNext()) {
            if (body.GetUserData() !== null) {
                //Synchronize the Sprites position and rotation with the corresponding body
                var sprite = body.GetUserData();

                if (sprite === this_obj.cossino_pj) {
                    var spritePositionOffset = sprite.getPosition();

                    var spritePosition = new b2Vec2(spritePositionOffset.x / physics.scale,
                                                    spritePositionOffset.y / physics.scale);
                }
                else {
                    var spritePositionOffset = cc.pAdd(sprite.getPosition(), this_obj.parallaxChild.getPosition());

                    var spritePosition = new b2Vec2(spritePositionOffset.x / physics.scale,
                                                    spritePositionOffset.y / physics.scale);
                }

                var spriteAngle = -1 * cc.DEGREES_TO_RADIANS(sprite.getRotation());

                body.SetPosition(spritePosition);
                body.SetAngle(spriteAngle);

                // cc.log("Position: " + body.GetPosition().x + " " + body.GetPosition().y);
            }
        }

        // cc.log(this.parallaxChild.getPosition().x + " " + this.parallaxChild.getPosition().y);

        physics.world.DrawDebugData();
        physics.world.ClearForces();

        // Actualizar parallax
        var cossinoDirection = this_obj.cossino_pj.getCurrentDirection();
        var cossinoDeltaPos = this_obj.cossino_pj.getDeltaPos();
        var currentParallaxPos = this_obj.parallaxChild.getPosition();

        // Actualizar posición de cámara
        // if (this_obj._previousDirection != this_obj._currentDirection) {
        //     if (this_obj._currentDirection == CHR_DIRECTION.RIGHT) {
        //         this_obj.updateCameraRight();
        //     } else {
        //         this_obj.updateCameraLeft();
        //     }
        //     this_obj._previousDirection = this_obj._currentDirection;
        // }

        if ((cossinoDirection == CHR_DIRECTION.LEFT) && (currentParallaxPos.x < 1)) {
                this_obj.scrollParallaxRight(cossinoDeltaPos, 0);
        } else if ((cossinoDirection == CHR_DIRECTION.RIGHT) && (currentParallaxPos.x > -5000)) {    // TODO: Límite derecho automático
            this_obj.scrollParallaxLeft(cossinoDeltaPos, 0);
        }
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
    },

    addBoxBodyForSprite:function (sprite, bodyType, setSensor, customPosition) {
        cc.log("Add box body for sprite...");

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
        if ((customPosition !== null) && (customPosition instanceof cc.Point)) {
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
        spriteShapeDef.isSensor = setSensor || false;
        spriteBody.CreateFixture(spriteShapeDef);
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
        var parallaxNode = cc.ParallaxNode.create();
        parallaxNode.setPosition(cc_Point(0, 0));

        // Background más profundo
        var offset_x_2 = 0;
        var offset_y_2 = 0;
        var BG_2_SCALE = 1.0;
        var BG_2_RATIO = cc_Point(1.0, 0);
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
        var BG_1_RATIO = cc_Point(1.5, 0);
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
        var BG_0_RATIO = cc_Point(2.1, 0);
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
        this.cossino_pj.handleTouchesBegan(touch, event);
    },

    onTouchesEnded:function (touch, event) {
        this.cossino_pj.handleTouchesEnded(touch, event);
    },

    onTouchesMoved:function (touch, event) {
        this.cossino_pj.handleTouchesMoved(touch, event);
    },

    updateCameraLeft:function () {
        cc.log("Update Camera Left...");
        //this.cossino_pj.setPosition(cc_Point(this._wsizewidth * 0.66, 110));

        var goLeft = cc.MoveBy.create(0.3, cc.p(this._wsizewidth / 3, 0));
        this.parallaxChild.runAction(goLeft);

        //var goCossinoLeft = cc.MoveTo.create(0.1, cc.p(this._wsizewidth * 0.66, 110));
        var goCossinoLeft = cc.MoveTo.create(0.1, cc.p(this._wsizewidth / 2, 110));
        this.cossino_pj.runAction(goCossinoLeft);
    },

    updateCameraRight:function () {
        cc.log("Update Camera Right...");
        //this.cossino_pj.setPosition(cc_Point(this._wsizewidth / 3, 110));

        var goRight = cc.MoveBy.create(0.3, cc.p(this._wsizewidth / -3, 0));
        this.parallaxChild.runAction(goRight);

        //var goCossinoRight = cc.MoveTo.create(0.1, cc.p(this._wsizewidth / 3, 110));
        var goCossinoRight = cc.MoveTo.create(0.1, cc.p(this._wsizewidth / 2, 110));
        this.cossino_pj.runAction(goCossinoRight);
    },

    addObjsAndEnemiesLayer:function () {
        cc.log("Agregar obstáculos...");

        var b2ContactListener = Box2D.Dynamics.b2ContactListener;
        parallaxNode = this.parallaxChild;

        // Capa de rocas y enemigos
        var offset_x_0 = 0;
        var offset_y_0 = 0;
        var BG_0_SCALE = 1.0;
        var BG_0_RATIO = cc_Point(2.1, 0);
        var BG_0_AP = cc_Point(0, 0);

        var OBJECT_TYPE = {
            ROCK: 0,
            ENEMY: 1,
            WATER: 2,
            FLOOR: 3,
            SPINE: 4
        };

        var PHYSIC_TYPE = {
            DYNAMIC: 0,
            KINEMATIC: 1,
            STATIC: 2
        };

        // var levelObjects = [{type: OBJECT_TYPE.ROCK, spriteImage: s_roca_1, scale: 0.5, x: 200, y: 0},
        //                     {type: OBJECT_TYPE.ROCK, spriteImage: s_roca_1, scale: 0.8, x: 100, y: 0},
        //                     {type: OBJECT_TYPE.ENEMY, spriteImage: s_bad_alien_1, scale: 0.6, x: 300, y: 0}
        //                    ];

        // for (var k = 0; k < levelObjects.length; k++) {
        //     spriteInfo = levelObjects[k];

        //     var sprite = cc_sprite_create(spriteInfo.spriteImage);
        //     sprite.setAnchorPoint(cc_Point(0.5, 0.5));
        //     sprite.setScale(spriteInfo.scale);
        //     objectsLayer.addChild(sprite);
        //     sprite.setPosition(cc_Point(spriteInfo.x, spriteInfo.y));
        //     this.addBoxBodyForSprite(sprite,
        //                              spriteInfo.type,
        //                              true,
        //                              cc.pAdd(cc_Point(spriteInfo.x, spriteInfo.y),
        //                              this.parallaxChild.getPosition()));
        // }

        this._tileMap = cc.TMXTiledMap.create(s_objects_layer_tmx);
        parallaxNode.addChild(this._tileMap, 3, BG_0_RATIO, cc_Point(0, 0));

        // Collision listener override
        var collisionListener = new b2ContactListener();
        collisionListener.BeginContact = function (contact) {
                // cc.log("Begin Contact.");
                bodyA = contact.GetFixtureA().GetBody().GetUserData();
                bodyB = contact.GetFixtureB().GetBody().GetUserData();

                if (bodyA !== null) {
                    bodyA.setColor(new cc.Color4B(0, 0, 255, 255));
                    cc.log("Begin Body A: " + bodyA.getPosition().x + " " + bodyA.getPosition().y);
                }

                if (bodyB !== null) {
                    bodyB.setColor(new cc.Color4B(255, 0, 0, 255));
                    cc.log("Begin Body B: " + bodyB.getPosition().x + " " + bodyB.getPosition().y);
                }
        };

        collisionListener.EndContact = function (contact) {
                // cc.log("End Contact.");
                bodyA = contact.GetFixtureA().GetBody().GetUserData();
                bodyB = contact.GetFixtureB().GetBody().GetUserData();

                if (bodyA !== null) {
                    bodyA.setColor(cc.white());
                    cc.log("End Body A: " + bodyA.getPosition().x + " " + bodyA.getPosition().y);
                }

                if (bodyB !== null) {
                    bodyB.setColor(cc.white());
                    cc.log("End Body B: " + bodyB.getPosition().x + " " + bodyB.getPosition().y);
                }
        };


        this.physics.world.SetContactListener(collisionListener);
    },

    _reloadObjsAndEnemiesLayer:function () {
        if (this._tileMap !== null) {
            this.parallaxChild.removeChild(this._tileMap, true);
            this._tileMap = null;
        }

        cc.log(s_objects_layer_tmx);
        cc.Loader.getInstance().releaseResources([{src: "/" + s_objects_layer_tmx}]);
        cc.Loader.purgeCachedData([{src: "/" + s_objects_layer_tmx}]);
        cc.SAXParser.getInstance().preloadPlist(s_objects_layer_tmx);
        this.addObjsAndEnemiesLayer();
        this.update();
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
