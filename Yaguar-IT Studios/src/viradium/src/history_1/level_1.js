var cc_Point = cc.p;
var cc_sprite_create = cc.Sprite.create;

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
    director: null,
    frameCache: null,
    wSizeWidth: 0,
    wSizeHeight: 0,

    ctor:function () {
        cc.log("Constructor: CossinoSprite");
        this._super();

        var cache = cc.SpriteFrameCache.getInstance();
        cache.addSpriteFrames(s_cossino_plist, s_cossino_img);

        this.director = cc.Director.getInstance();
        this.wSizeWidth = this.director.getWinSize().width;
        this.wSizeHeight = this.director.getWinSize().height;
        this.frameCache = cc.SpriteFrameCache.getInstance();

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
                this.beginStand();
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
        this.schedule(this.updateRun, 0.04);
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
    },

    delay:function (ms) {
        cc.log("Delay: " + ms);
    }
});


var Hist1Lvl1Layer = cc.LayerColor.extend({
    _debug: cc.COCOS2D_DEBUG,
    cossino_pj: null,
    physics: null,
    _canvas: null,
    FPS: 60,
    PTM_RATIO: 30,
    director: null,
    audioEngine: null,
    parallaxChild: null,

    init:function()
    {
        cc.log("Init Function: Hist1Lvl1Layer.");
        this._super(new cc.Color4B(128, 128, 128, 0), 800, 600);

        // Caching
        cc_MenuItemFont = cc.MenuItemFont;
        this.audioEngine = cc.AudioEngine.getInstance();
        this.director = cc.Director.getInstance();
        var wSizeWidth = this.director.getWinSize().width;
        var wSizeHeight = this.director.getWinSize().height;
        var systemCapabilities = sys.capabilities;

        var menuItemX, menuItemY = 0;

        this.audioEngine.setEffectsVolume(0.8);
        this.audioEngine.setMusicVolume(0.8);

        menuItemX = wSizeWidth / 2;
        menuItemY = wSizeHeight / 2;

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
        this.cossino_pj.setPosition(cc_Point(menuItemX, 128));
        this.cossino_pj.setScale(0.6);
        cc.log(this.cossino_pj);

        cc.log("Agregar sprite Cossino a escena.");
        this.addChild(this.cossino_pj);

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
                break;
            case cc.KEY.left:
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

        // Propagate key up to children
        this.cossino_pj.handleKeyUp(e);
    },

    update:function (dt) {
        // Instruct the world to perform a single step of simulation. It is
        // generally best to keep the time step and iterations fixed.
        // this.world.Step(dt, velocityIterations, positionIterations);
        this.physics.step(dt);

        //Iterate over the bodies in the physics world
        bodies = this.physics.world.GetBodyList();
        for (var b = 0; b < bodies.length; b++) {
            if (bodies.GetUserData() !== null) {
                //Synchronize the AtlasSprites position and rotation with the corresponding body
                var myActor = bodies.GetUserData();
                myActor.setPosition(cc.Point(bodies.GetPosition().x * this.PTM_RATIO, bodies.GetPosition().y * this.PTM_RATIO));
                myActor.setRotation(-1 * cc.RADIANS_TO_DEGREES(bodies.GetAngle()));
                // cc.log(b.GetPosition().x + " " + b.GetPosition().y);
                // cc.log(myActor.getPosition().x + " " + myActor.getPosition().y);
                // cc.log(b.GetAngle());
            }
            bodies.getNext();
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
    },

    initParallax:function () {
        cc.log("Inicializar parallax...");
        // Fondo Parallax
        var parallaxNode = cc.ParallaxNode.create();

        // Background más profundo
        var BG_2_SCALE = 1.0;
        var BG_2_RATIO = cc_Point(0.2, 0);
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

        var offset_x_2 = 0;
        for (var i = 0; i < 7; i++) {
            var sprite_2 = cc_sprite_create(bg_2_images[i]);
            sprite_2.setAnchorPoint(BG_2_AP);
            sprite_2.setScale(BG_2_SCALE);
            parallaxNode.addChild(sprite_2, -1, BG_2_RATIO, cc_Point(offset_x_2, 0));
            offset_x_2 += sprite_2.getBoundingBox().size.width;
        }

        // Background del medio
        var BG_1_SCALE = 0.8;
        var BG_1_RATIO = cc_Point(0.6, 0);
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

        var offset_x_1 = 0;
        for (var j = 0; j < 9; j++) {
            var sprite_1 = cc_sprite_create(bg_1_images[j]);
            sprite_1.setAnchorPoint(BG_1_AP);
            sprite_1.setScale(BG_1_SCALE);
            parallaxNode.addChild(sprite_1, 1, BG_1_RATIO, cc_Point(offset_x_1, 0));
            offset_x_1 += sprite_1.getBoundingBox().size.width;
        }

        // Background superior
        var BG_0_SCALE = 0.3;
        var BG_0_RATIO = cc_Point(2.0, 0);
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

        var offset_x_0 = 0;
        for (var k = 0; k < 13; k++) {
            var sprite_0 = cc_sprite_create(bg_0_images[k]);
            sprite_0.setAnchorPoint(BG_0_AP);
            sprite_0.setScale(BG_0_SCALE);
            parallaxNode.addChild(sprite_0, 2, BG_0_RATIO, cc_Point(offset_x_0, 0));
            offset_x_0 += sprite_0.getBoundingBox().size.width;
        }

        this.addChild(parallaxNode, -1, 5555);
        this.parallaxChild = this.getChildByTag(5555);
    },

    scrollParallaxLeft:function () {
        var node = this.parallaxChild;
        var currentPos = node.getPosition();
        node.setPosition(cc_Point(currentPos.x - 1, 0));
    },

    scrollParallaxRight:function () {
        var node = this.parallaxChild;
        var currentPos = node.getPosition();
        node.setPosition(cc_Point(currentPos.x + 1, 0));
    }
});


var Hist1Level1Scene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        this.setTag(TAGS.ESCENAS.MAIN_MENU);

        var mainMenuL = new Hist1Lvl1Layer();
        mainMenuL.init();

        this.addChild(mainMenuL, 1, TAGS.CAPAS.MAIN_MENU);

        cc.log("Children Count: " + this.getChildrenCount());
    }
});
