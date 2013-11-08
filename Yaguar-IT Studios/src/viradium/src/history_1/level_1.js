var lastEvent = -1;
var heldKeys = {};

var CHR_STATUS = {
    STAND: 0,
    WALK: 1,
    RUN: 2,
    JUMP: 3,
    NOTSET: 4
};

var CHR_DIRECTION = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
    NOTSET: 4
};

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
    _nextStatus: CHR_STATUS.STAND,
    _nextDirection: CHR_DIRECTION.NOTSET,
    _antiKeyBounceCounter: 0,
    _onFinishStandStop: false,
    _onFinishRunStop: false,
    _onFinishWalkStop: false,
    _onFinishJumpStop: false,

    ctor:function () {
        cc.log("Constructor: CossinoSprite");
        this._super();

        var cache = cc.SpriteFrameCache.getInstance();
        cache.addSpriteFrames(s_cossino_plist, s_cossino_img);

        // this.initWithSpriteFrameName(this._FNStandPrefix + "1.png");
        this.init();

        // Schedule updates
        cc.log("Scheduling Cossino Global Update...");
        this.scheduleUpdate();

        // Inicialmente mostrar personaje apuntando hacia la derecha
        // y parado
        this.beginStand();
    },

    update:function (dt) {
    },

    updateStand:function () {
        var director = cc.Director.getInstance();
        var wSizeWidth = director.getWinSize().width;
        var wSizeHeight = director.getWinSize().height;
        var frameCache = cc.SpriteFrameCache.getInstance();
        var menuItemX, menuItemY = 0;

        menuItemX = wSizeWidth / 2;
        menuItemY = wSizeHeight / 2;

        if (this._FNStandIdx > 3) {
            this._FNStandDir = -1;
        }
        else if (this._FNStandIdx < 2) {
            this._FNStandDir = 1;

            // FIXME:
            if (this._onFinishStandStop) {
                this.stopStand();
            }
        }

        // cc.log(cossino_pj.FNStandIdx);

        var indexAsString = '';
        indexAsString = this._FNStandIdx.toString();
        this._FNStandIdx += this._FNStandDir;

        var next_frame = frameCache.getSpriteFrame(this._FNStandPrefix +
                                                   indexAsString + ".png");

        this.removeAllChildren(true);
        this.setTextureRect(next_frame.getRect());
        this.setContentSize(next_frame.getRect().width, next_frame.getRect().height);
        this.setDisplayFrame(next_frame);
    },

    updateWalk:function () {
        var director = cc.Director.getInstance();
        var wSizeWidth = director.getWinSize().width;
        var wSizeHeight = director.getWinSize().height;
        var frameCache = cc.SpriteFrameCache.getInstance();
        var menuItemX, menuItemY = 0;

        menuItemX = wSizeWidth / 2;
        menuItemY = wSizeHeight / 2;

        if (this._FNWalkIdx > 17) {
            this._FNWalkIdx = 1;

            // FIXME:
            if (this._onFinishWalkStop) {
                this.stopWalk();
            }
        }

        // cc.log(this._FNWalkIdx);

        var indexAsString = '';
        indexAsString = this._FNWalkIdx.toString();
        this._FNWalkIdx += 1;

        var next_frame = frameCache.getSpriteFrame(this._FNWalkPrefix +
                                                   indexAsString + ".png");

        this.removeAllChildren(true);
        this.setTextureRect(next_frame.getRect());
        this.setDisplayFrame(next_frame);
    },

    updateRun:function () {
        var director = cc.Director.getInstance();
        var wSizeWidth = director.getWinSize().width;
        var wSizeHeight = director.getWinSize().height;
        var frameCache = cc.SpriteFrameCache.getInstance();
        var menuItemX, menuItemY = 0;

        menuItemX = wSizeWidth / 2;
        menuItemY = wSizeHeight / 2;

        if (this._FNRunIdx > 17) {
            this._FNRunIdx = 1;

            // FIXME:
            if (this._onFinishRunStop) {
                this.stopRun();
            }
        }

        // cc.log(this._FNRunIdx);

        var indexAsString = '';
        indexAsString = this._FNRunIdx.toString();
        this._FNRunIdx += 1;

        var next_frame = frameCache.getSpriteFrame(this._FNRunPrefix +
                                                   indexAsString + ".png");

        this.removeAllChildren(true);
        this.setTextureRect(next_frame.getRect());
        this.setDisplayFrame(next_frame);
    },

    updateJump:function () {
        var director = cc.Director.getInstance();
        var wSizeWidth = director.getWinSize().width;
        var wSizeHeight = director.getWinSize().height;
        var frameCache = cc.SpriteFrameCache.getInstance();
        var menuItemX, menuItemY = 0;

        menuItemX = wSizeWidth / 2;
        menuItemY = wSizeHeight / 2;

        if (this._FNJumpIdx > 22) {
            this._FNJumpIdx = 1;

            // FIXME:
            if (this._onFinishJumpStop) {
                this.stopJump();
                this.beginStand();
            }
        }

        // cc.log(cossino_pj.FNStandIdx);

        var indexAsString = '';
        indexAsString = this._FNJumpIdx.toString();
        this._FNJumpIdx += 1;

        var next_frame = frameCache.getSpriteFrame(this._FNJumpPrefix +
                                                   indexAsString + ".png");

        this.removeAllChildren(true);
        this.setTextureRect(next_frame.getRect());
        this.setDisplayFrame(next_frame);
    },

    handleKeyDown:function (e) {
        cc.log("Handle Key Down Cossino.");

        switch (e) {
            case cc.KEY.left:
                if (this._currentStatus !== CHR_STATUS.JUMP) {
                    this.turnLeft();
                    this.beginWalk();
                }
                break;
            case cc.KEY.right:
                if (this._currentStatus !== CHR_STATUS.JUMP) {
                    this.turnRight();
                    this.beginWalk();
                }
                break;
            case cc.KEY.a:
                this.beginRun();
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
                if (this._currentStatus === CHR_STATUS.WALK) {
                    this.beginStand();
                }
                break;
            case cc.KEY.right:
                if (this._currentStatus === CHR_STATUS.WALK) {
                    this.beginStand();
                }
                break;
            case cc.KEY.a:
                if (this._currentStatus === CHR_STATUS.RUN) {
                    // this.stopRun();
                    this.beginStand();
                 }
                break;
            case cc.KEY.s:
                if (this._currentStatus === CHR_STATUS.JUMP) {
                    this.reqOnFinishJumpStop(this.beginStand);
                    //this.beginStand();
                }
                break;
            default:
                this.beginStand();
                break;
        }
    },

    handleTouch:function (touchLocation) {
    },

    handleTouchMove:function (touchLocation) {
    },

    _stand:function () {
        this.beginStand();
    },

    beginStand:function () {
        cc.log("Stand Cossino.");
        this._currentStatus = CHR_STATUS.STAND;
        // Quick & Dirty, Hacky, Nasty...
        // Must be refactored, improved...
        this.unschedule(this.updateRun);
        this.unschedule(this.updateWalk);
        this.unschedule(this.updateJump);
        this.schedule(this.updateStand, 0.4);
    },

    stopStand:function () {
        this.unschedule(this.updateStand);
        this._FNStandIdx = 1;
        this._FNStandDir = 1;
        this._onFinishStandStop = false;
    },

    reqOnFinishStandStop:function (next_status) {
        cc.log("Detener Stand Cossino al finalizar sprites.");
        this._onFinishStandStop = true;

        if (typeof next_status === 'function') {
            cc.log("Establecido próximo estado de Stand");
            this.next_status();
        }
    },

    _walk:function () {
        this.beginWalk();
    },

    beginWalk:function () {
        cc.log("Walk Cossino.");
        this._currentStatus = CHR_STATUS.WALK;
        // Quick & Dirty, Hacky, Nasty...
        // Must be refactored, improved...
        this.unschedule(this.updateRun);
        this.unschedule(this.updateStand);
        this.unschedule(this.updateJump);
        this.schedule(this.updateWalk, 0);
        this._executingAnimation = true;
    },

    stopWalk:function () {
        this.unschedule(this.updateWalk);
        this._FNWalkIdx = 1;
        this._onFinishWalkStop = false;
    },

    reqOnFinishWalkStop:function (next_status) {
        cc.log("Detener Walk Cossino al finalizar sprites.");
        this._onFinishWalkStop = true;

        if (typeof next_status === 'function') {
            cc.log("Establecido próximo estado de Walk");
            next_status();
        }
    },

    _jump:function () {
        this.beginJump();
    },

    beginJump:function () {
        cc.log("Jump Cossino.");
        this._currentStatus = CHR_STATUS.JUMP;
        // Quick & Dirty, Hacky, Nasty...
        // Must be refactored, improved...
        this.unschedule(this.updateRun);
        this.unschedule(this.updateWalk);
        this.unschedule(this.updateStand);
        this.schedule(this.updateJump, 0.1);
        this._executingAnimation = true;
    },

    stopJump:function () {
        this.unschedule(this.updateJump);
        this._FNJumpIdx = 1;
        this._onFinishJumpStop = false;
    },

    reqOnFinishJumpStop:function (next_status) {
        cc.log("Detener Jump Cossino al finalizar sprites.");
        this._onFinishJumpStop = true;

        if (typeof next_status === 'function') {
            cc.log("Establecido próximo estado de Jump");
                next_status.apply(this);
        }
    },

    _run:function () {
        this.beginRun();
    },

    beginRun:function () {
        cc.log("Run Cossino.");
        this._currentStatus = CHR_STATUS.RUN;
        // Quick & Dirty, Hacky, Nasty...
        // Must be refactored, improved...
        this.unschedule(this.updateJump);
        this.unschedule(this.updateWalk);
        this.unschedule(this.updateStand);
        this.schedule(this.updateRun, 0.05);
        this._executingAnimation = true;
    },

    stopRun:function () {
        this.unschedule(this.updateRun);
        this._FNRunIdx = 1;
        this._onFinishRunStop = false;
    },

    reqOnFinishRunStop:function (next_status) {
        cc.log("Detener Run Cossino al finalizar sprites.");
        this._onFinishRunStop = true;

        if (typeof next_status === 'function') {
            cc.log("Establecido próximo estado de Run");
            next_status();
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
    }
});


var Hist1Lvl1Layer = cc.LayerColor.extend({
    _debug: cc.COCOS2D_DEBUG,
    cossino_pj: null,
    physics: null,
    _canvas: null,
    FPS: 60,
    PTM_RATIO: 30,

    init:function()
    {
        cc.log("Init Function: Hist1Lvl1Layer.");
        this._super(new cc.Color4B(128, 128, 128, 255), 800, 600);

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
        this.cossino_pj = new CossinoSprite();
        this.cossino_pj.setPosition(new cc_Point(menuItemX, menuItemY));
        this.cossino_pj.setScale(0.8);
        cc.log(this.cossino_pj);

        cc.log("Agregar sprite Cossino a escena.");
        this.addChild(this.cossino_pj);

        // -------------------------------------------------------------------
        // Configure Box2D ---------------------------------------------------
        // -------------------------------------------------------------------
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

        // Construct a world object, which will hold and simulate the rigid bodies.
        var Physics = function (element, scale) {
            var gravity = new b2Vec2(0, -9.8);
            this.world = new b2World(gravity, true);
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

        var fixDef = new b2FixtureDef();
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;

        var bodyDef = new b2BodyDef();

        // Piso
        bodyDef.type = b2Body.b2_staticBody;
        fixDef.shape = new b2PolygonShape();

        // Límite superior
        bodyDef.position.Set((wSizeWidth / 2) / 30, (wSizeHeight / 30));
        fixDef.shape.SetAsBox((wSizeWidth / 2) / 30, 0.5 / 30);
        this.physics.world.CreateBody(bodyDef).CreateFixture(fixDef);

        // Límite inferior (piso)
        bodyDef.position.Set((wSizeWidth / 2) / 30, 50 / 30);
        fixDef.shape.SetAsBox((wSizeWidth / 2) / 30, 0.5 / 30);
        this.physics.world.CreateBody(bodyDef).CreateFixture(fixDef);

        // Límite izquierdo
        bodyDef.position.Set(0 / 30, (wSizeHeight / 2) / 30);
        fixDef.shape.SetAsBox(0.5 / 30, wSizeHeight / 30);
        this.physics.world.CreateBody(bodyDef).CreateFixture(fixDef);

        // Límite derecho
        bodyDef.position.Set(wSizeWidth / 30, (wSizeHeight / 2) / 30);
        fixDef.shape.SetAsBox(0.5 / 30, wSizeHeight / 30);
        this.physics.world.CreateBody(bodyDef).CreateFixture(fixDef);

        //Set up sprite
        //this.addNewSpriteWithPhysics(this.cossino_pj);

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
        }
        else {
            cc.log("Touch Not Supported");
        }

        // Schedule update
        cc.log("Scheduling update...");
        this.scheduleUpdate();

        return this;
    },

    initPhysics:function () {
    },

    onEnter:function () {
        this._super();
        cc.log("Reproducir música de fondo.");
        cc.AudioEngine.getInstance().playMusic(s_background_music, true);
        cc.log("ZOrder Hist1Lvl1Layer: " + this.getZOrder());
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
        }

        // Propagate key down to children
        this.cossino_pj.handleKeyDown(e);
    },

    onKeyUp:function (e) {
        lastEvent = null;
        delete heldKeys[e];

        // Propagate key up to children
        this.cossino_pj.handleKeyUp(e);
    },

    update:function (dt) {
        // Instruct the world to perform a single step of simulation. It is
        // generally best to keep the time step and iterations fixed.
        // this.world.Step(dt, velocityIterations, positionIterations);
        this.physics.step(dt);

        //Iterate over the bodies in the physics world
        for (var b = this.physics.world.GetBodyList(); b; b = b.GetNext()) {
            if (b.GetUserData() !== null) {
                //Synchronize the AtlasSprites position and rotation with the corresponding body
                var myActor = b.GetUserData();
                myActor.setPosition(new cc.Point(b.GetPosition().x * this.PTM_RATIO, b.GetPosition().y * this.PTM_RATIO));
                myActor.setRotation(-1 * cc.RADIANS_TO_DEGREES(b.GetAngle()));
                // cc.log(b.GetPosition().x + " " + b.GetPosition().y);
                // cc.log(myActor.getPosition().x + " " + myActor.getPosition().y);
                // cc.log(b.GetAngle());
            }
        }

        //this.physics.world.DrawDebugData();
        this.physics.world.ClearForces();
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

    addNewSpriteWithPhysics:function (sprite) {
        var spritePosition = sprite.getPosition();
        var spriteContSize = sprite.getContentSize();
        var spriteHeight = (spriteContSize.height * sprite.getScaleY()) / this.physics.scale;
        var spriteWidth = (spriteContSize.width * sprite.getScaleX()) / this.physics.scale;


        cc.log(sprite.getPosition().x + " " + sprite.getPosition().y);

        cc.log(spriteWidth + "x" + spriteHeight);

        // Define the dynamic body.
        //Set up a 1m squared box in the physics world
        var b2BodyDef = Box2D.Dynamics.b2BodyDef;
        var b2Body = Box2D.Dynamics.b2Body;
        var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
        var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_dynamicBody;

        bodyDef.position.Set(spritePosition.x / this.physics.scale,
                             spritePosition.y / this.physics.scale);
        bodyDef.userData = sprite;

        // Define another box shape for our dynamic body.
        var dynamicBox = new b2PolygonShape();

        dynamicBox.SetAsBox(spriteWidth / 2, spriteHeight / 2);

        // Define the dynamic body fixture.
        var fixtureDef = new b2FixtureDef();
        fixtureDef.shape = dynamicBox;
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.3;
        this.physics.world.CreateBody(bodyDef).CreateFixture(fixtureDef);
    }
});


var Hist1Level1Scene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        this.setTag(TAGS.ESCENAS.MAIN_MENU);

        var mainMenuL = new Hist1Lvl1Layer();
        mainMenuL.init();
        this.addChild(mainMenuL, 0, TAGS.CAPAS.MAIN_MENU);

        cc.log("Children Count: " + this.getChildrenCount());
    }
});
