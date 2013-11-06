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
        this.stand();
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
        }

        // cc.log(cossino_pj.FNStandIdx);

        var indexAsString = '';
        indexAsString = this._FNStandIdx.toString();
        this._FNStandIdx += this._FNStandDir;

        var next_frame = frameCache.getSpriteFrame(this._FNStandPrefix +
                                                   indexAsString + ".png");

        this.removeAllChildren(true);
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
        }

        // cc.log(this._FNWalkIdx);

        var indexAsString = '';
        indexAsString = this._FNWalkIdx.toString();
        this._FNWalkIdx += 1;

        var next_frame = frameCache.getSpriteFrame(this._FNWalkPrefix +
                                                   indexAsString + ".png");

        this.removeAllChildren(true);
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
        }

        // cc.log(this._FNRunIdx);

        var indexAsString = '';
        indexAsString = this._FNRunIdx.toString();
        this._FNRunIdx += 1;

        var next_frame = frameCache.getSpriteFrame(this._FNRunPrefix +
                                                   indexAsString + ".png");

        this.removeAllChildren(true);
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
        }

        // cc.log(cossino_pj.FNStandIdx);

        var indexAsString = '';
        indexAsString = this._FNJumpIdx.toString();
        this._FNJumpIdx += 1;

        var next_frame = frameCache.getSpriteFrame(this._FNJumpPrefix +
                                                   indexAsString + ".png");

        this.removeAllChildren(true);
        this.setDisplayFrame(next_frame);
    },

    handleKeyDown:function (e) {
        cc.log("Handle Key Down Cossino.");

        switch (e) {
            case cc.KEY.left:
                this.turnLeft();
                this.walk();
                break;
            case cc.KEY.right:
                this.turnRight();
                this.walk();
                break;
            case cc.KEY.a:
                this.run();
                break;
            case cc.KEY.s:
                this.jump();
                break;
            default:
                this.stand();
                break;
        }
    },

    handleKeyUp:function (e) {
        cc.log("Handle Key Up Cossino.");

        switch (e) {
            case cc.KEY.left:
                if (this._currentStatus === CHR_STATUS.WALK) {
                    this.stand();
                }

                break;
            case cc.KEY.right:
                if (this._currentStatus === CHR_STATUS.WALK) {
                    this.stand();
                }

                break;
            case cc.KEYS.a:
                break;
            case cc.KEYS.s:
                break;
            default:
                break;
        }
    },

    handleTouch:function (touchLocation) {
    },

    handleTouchMove:function (touchLocation) {
    },

    stand:function () {
        cc.log("Stand Cossino.");
        this._currentStatus = CHR_STATUS.STAND;
        // Quick & Dirty, Hacky, Nasty...
        // Must be refactored, improved...
        this.unschedule(this.updateRun);
        this.unschedule(this.updateWalk);
        this.unschedule(this.updateJump);
        this.schedule(this.updateStand, 0.4);
    },

    walk:function () {
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

    jump:function () {
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

    run:function () {
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
    }
});


var Hist1Lvl1Layer = cc.LayerColor.extend({
    _debug: cc.COCOS2D_DEBUG,
    cossino_pj: null,
    physics: null,
    _canvas: null,

    init:function()
    {
        cc.log("Init Function: Hist1Lvl1Layer.");
        this._super(new cc.Color4B(128, 128, 128, 255));

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

        this._canvas = document.getElementById("gameCanvas");

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
        var Physics = window.Physics = function (element, scale) {
            var gravity = new b2Vec2(0, 9.8);
            this.world = new b2World(gravity, true);
            this.world.SetContinuousPhysics(true);
            this.element = element;
            this.context = element.getContext("2d");
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
            else {
                this.context.clearRect(0, 0, this.element.width, this.element.height);

                var obj = this.world.GetBodyList();

                this.context.save();
                this.context.scale(this.scale, this.scale);

                while (obj) {
                    var body = obj.GetUserData();

                    if (body) {
                        body.draw(this.context);
                    }

                    obj = obj.GetNext();
                }
                this.context.restore();
            }
        };

        Physics.prototype.debug = function () {
            this.debugDraw = new b2DebugDraw();
            this.debugDraw.SetSprite(this.context);
            this.debugDraw.SetDrawScale(this.scale);
            this.debugDraw.SetFillAlpha(0.3);
            this.debugDraw.SetLineThickness(1.0);
            this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
            this.world.SetDebugDraw(this.debugDraw);
        };

        this.physics = new Physics(this._canvas);
        // this.physics.debug();

        var Body = window.Body = function (physics, details) {
            this.details = details = details || {};

            // Create the definition
            this.definition = new b2BodyDef();

            // Set up the definition
            for (var k in this.definitionDefaults) {
                this.definition[k] = details[k] || this.definitionDefaults[k];
            }

            this.definition.position = new b2Vec2(details.x || 0, details.y || 0);
            this.definition.linearVelocity = new b2Vec2(details.vx || 0, details.vy || 0);
            this.definition.userData = this;
            this.definition.type = details.type == "static" ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;

            // Create the Body
            this.body = physics.world.CreateBody(this.definition);

            // Create the fixture
            this.fixtureDef = new b2FixtureDef();
            for (var l in this.fixtureDefaults) {
                this.fixtureDef[l] = details[l] || this.fixtureDefaults[l];
            }


            details.shape = details.shape || this.defaults.shape;

            switch (details.shape) {
                case "circle":
                    details.radius = details.radius || this.defaults.radius;
                    this.fixtureDef.shape = new b2CircleShape(details.radius);
                    break;
                case "polygon":
                    this.fixtureDef.shape = new b2PolygonShape();
                    this.fixtureDef.shape.SetAsArray(details.points, details.points.length);
                    break;
                case "block":
                    break;
                default:
                    details.width = details.width || this.defaults.width;
                    details.height = details.height || this.defaults.height;

                    this.fixtureDef.shape = new b2PolygonShape();
                    this.fixtureDef.shape.SetAsBox(details.width / 2,
                        details.height / 2);
                    break;
            }

            this.body.CreateFixture(this.fixtureDef);
        };

        Physics.prototype.collision = function () {
            this.listener = new Box2D.Dynamics.b2ContactListener();

            this.listener.PostSolve = function (contact, impulse) {
                var bodyA = context.GetFixtureA().GetBody().GetUserData(),
                    bodyB = context.GetFixtureB().GetBody().GetUserData();

                if (bodyA.contact) {
                    bodyA.contact(contact, impulse, true);
                }

                if (bodyB.contact) {
                    bodyB.contact(contact, impulse, false);
                }

            };
            this.world.SetContactListener(this.listener);
        };

        Body.prototype.defaults = {
            shape: "block",
            width: 5,
            height: 5,
            radius: 2.5
        };

        Body.prototype.fixtureDefaults = {
            density: 2,
            friction: 1,
            restitution: 0.2
        };

        Body.prototype.definitionDefaults = {
            active: true,
            allowSleep: true,
            angle: 0,
            angularVelocity: 0,
            awake: true,
            bullet: false,
            fixedRotation: false
        };

        Body.prototype.draw = function (context) {
            var pos = this.body.GetPosition(),
                angle = this.body.GetAngle();

            // Save the context
            context.save();

            // Translate and rotate
            context.translate(pos.x, pos.y);
            context.rotate(angle);


            // Draw the shape outline if the shape has a color
            if (this.details.color) {
                context.fillStyle = this.details.color;

                switch (this.details.shape) {
                    case "circle":
                        context.beginPath();
                        context.arc(0, 0, this.details.radius, 0, Math.PI * 2);
                        context.fill();
                        break;
                    case "polygon":
                        var points = this.details.points;
                        context.beginPath();
                        context.moveTo(points[0].x, points[0].y);
                        for (var i = 1; i < points.length; i++) {
                            context.lineTo(points[i].x, points[i].y);
                        }
                        context.fill();
                        break;
                    case "block":
                        context.fillRect(-this.details.width / 2, -this.details.height / 2,
                        this.details.width,
                        this.details.height);
                        break;
                    default:
                        break;
                }
            }

            // If an image property is set, draw the image.
            if (this.details.image) {
                context.drawImage(this.details.image, -this.details.width / 2, -this.details.height / 2,
                this.details.width,
                this.details.height);
            }

            context.restore();
        };

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
