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
    _playerVisionSensorId: 10000,
    _playerVisionSensorCounter: 1,
    _playerCurrentDirection: null,
    _playerCurrentStatus: null,
    _playerRunDeltaMultiplier: 1.0,
    _playerWalkDeltaMultiplier: 1.0,
    _playerJumpDeltaMultiplier: 1.0,
    _playerJumpExtraImpulse: null,
    _debugCanvas: null,
    _debugCanvasCtx: null,
    _bodiesScheduledToDelete: [],
    _playerShootIntervalId: null,
    _playerShootCount: 0,

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
            this._debugCanvas = canvasDebug;
            var debugDraw = new b2DebugDraw();  // Objeto de visualización de depuración
            var ctx = canvasDebug.getContext("2d");
            this._debugCanvasCtx = ctx;
            ctx.canvas.height /= 4;
            debugDraw.SetSprite(ctx);  // Establecemos el canvas para visualizarlo
            debugDraw.SetDrawScale(6);     // Escala de la visualización
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
                // FIXME
                this.adjustJumpToRight();
                break;
            case KEYS.GOLEFT:
                this._previousDirection = this._currentDirection;
                this._currentDirection = CHR_DIRECTION.LEFT;
                this._playerCurrentDirection = CHR_DIRECTION.LEFT;
                this._playerCurrentStatus = CHR_STATUS.WALK;
                // FIXME
                this.adjustJumpToLeft();
                break;
            case KEYS.RUN:
                this._playerCurrentStatus = CHR_STATUS.RUN;
                break;
            case KEYS.JUMP:
                this._playerCurrentStatus = CHR_STATUS.JUMP;
                this.makePlayerJump(100);
                break;
            case KEYS.SHOOT:
                this.makePlayerShoot(100);
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
            case cc.KEY.f:
                if (KEYMOD_FLAGS.SHIFT) {
                    this._debugPhysicsDraw = !this._debugPhysicsDraw;
                    cc.log(this._debugPhysicsDraw);

                    if (this._debugCanvas && this._debugCanvasCtx) {
                        this._debugCanvasCtx.fillRect(this._debugCanvas.x,
                                                      this._debugCanvas.y,
                                                      this._debugCanvas.width,
                                                      this._debugCanvas.height);

                        this._debugCanvasCtx.strokeRect(this._debugCanvas.x,
                                                        this._debugCanvas.y,
                                                        this._debugCanvas.width,
                                                        this._debugCanvas.height);

                        this._debugCanvas.width = this._debugCanvas.width;

                        cc.log("Fill Stroke Rect Debug Canvas.");
                    }
                }
                break;
            case KEYS.RUN:
            case KEYS.WALK:
                this._playerCurrentStatus = CHR_STATUS.STAND;
                break;
            case KEYS.SHOOT:
                clearInterval(this._playerShootIntervalId);
                break;
        }

        // Propagate key up to children
        this._currentPlayer.handleKeyUp(e);
    },

    update:function (dt) {
        var this_obj = this;
        var physics = this_obj.physics;
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
            case CHR_STATUS.SHOOT:
                break;
        }

        // Instruct the world to perform a single step of simulation.
        physics.step(dt);

        //Iterate over the bodies in the physics world
        for (var bodyf = bodyList; bodyf; bodyf = bodyf.GetNext()) {
            sprite = bodyf.GetUserData();

            if (sprite === null) { continue; }

            if (sprite === this_obj._currentPlayer) {
                spritePosition = cc_Point(bodyf.GetPosition().x * physics.scale,
                                          bodyf.GetPosition().y * physics.scale);

                spriteAngle = -1 * cc_RADIANS_TO_DEGREES(bodyf.GetAngle());

                this_obj._playerCurrUIPos = spritePosition;
                this_obj._playerCurrUIRot = spriteAngle;
                sprite.setRotation(spriteAngle);
                sprite.setPosition(cc_Point(this_obj._wsizewidth / 2,
                                            spritePosition.y));

                if (sprite.getHealth() <= 0) {
                    this_obj._bodiesScheduledToDelete.push(bodyf);
                    this_obj.parallaxChild.removeChild(sprite, true);
                }
            }
            else if (sprite instanceof ViradiumSprite) {
                spritePosition = cc_Point(bodyf.GetPosition().x * physics.scale,
                                          bodyf.GetPosition().y * physics.scale);

                spriteAngle = -1 * cc_RADIANS_TO_DEGREES(bodyf.GetAngle());

                sprite.setPosition(cc_Point(spritePosition.x, spritePosition.y));
                sprite.setRotation(spriteAngle);
            }
            else if (sprite instanceof LanderSprite) {
                spritePosition = cc_Point(bodyf.GetPosition().x * physics.scale,
                                          bodyf.GetPosition().y * physics.scale);

                spriteAngle = -1 * cc_RADIANS_TO_DEGREES(bodyf.GetAngle());

                sprite.setPosition(cc_Point(spritePosition.x, spritePosition.y));
                sprite.setRotation(spriteAngle);

                if (sprite.getHealth() <= 0) {
                    this_obj._bodiesScheduledToDelete.push(bodyf);
                    this_obj.parallaxChild.removeChild(sprite, true);
                }
            }
            else if (sprite instanceof Object) {
                // TMX Object
            }
        }

        if (this._debugPhysicsDraw) { physics.world.DrawDebugData(); }
        physics.world.ClearForces();

        // Eliminar cuerpos no utilizados
        for (var d = 0, len = this_obj._bodiesScheduledToDelete.length; d < len; d++) {
            this_obj.physics.world.DestroyBody(this_obj._bodiesScheduledToDelete[d]);
        }

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
        spriteShape.SetAsBox((sprite.getContentSize().width * sprite.getScaleX()) / this.physics.scale / 2,
                             (sprite.getContentSize().height * sprite.getScaleY()) / this.physics.scale / 2);

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
        var longSensorVision = 0;
        var longSensorCalc = 0;

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

        // Determinar si posee sensor de visión
        if (object.LongitudSensorVision) {
            longSensorCalc = parseFloat(object.LongitudSensorVision);
        }
        else if (object.longitudsensorvision) {
            longSensorCalc = parseFloat(object.longitudsensorvision);
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

        // Add vision sensor fixture
        if (!isNaN(longSensorCalc) && longSensorCalc > 0) {
            cc.log("HAS VISION SENSOR");
            var visionSensorFixtureDef = new b2FixtureDef();
            var visionSensorShape = new b2PolygonShape();

            visionSensorShape.SetAsOrientedBox(longSensorCalc / 2 / this.physics.scale,
                                         objCenterHeight / this.physics.scale,
                                         new b2Vec2((((longSensorCalc / 2) + objCenterWidth) * -1) / this.physics.scale, 0),
                                         0);

            visionSensorFixtureDef.density = 0;
            visionSensorFixtureDef.friction = 0;
            visionSensorFixtureDef.restitution = 0;
            visionSensorFixtureDef.shape = visionSensorShape;
            visionSensorFixtureDef.isSensor = true;
            visionSensorFixtureDef.userData = 2000;

            var visionSensorFixture = objectBody.CreateFixture(visionSensorFixtureDef);
            visionSensorFixture.userData = 2000;
        }

        return objectBody;
    },

    addBoxBodyForTMXObjectSprite:function (sprite, object) {
        if ((sprite === null) || !(sprite instanceof cc_Sprite)) { return false; }

        cc.log("Add box body for TMX Object & Sprite...");

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

            sensorShape.SetAsOrientedBox(forcedWidth  / 2.1 / this.physics.scale,
                                         forcedHeight / 30 / this.physics.scale,
                                         new b2Vec2(0, -1 * (sprite.getContentSize().height * sprite.getScaleY()) / 2 / this.physics.scale),
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
        var this_obj = this;
        var node = this_obj.parallaxChild;
        var currentPos = node.getPosition();
        var deltaPoint = cc_pSub(this_obj._playerPrevUIPos, this_obj._playerCurrUIPos);
        // Corregir desplazamiento para que el parallax se mueva
        // de acuerdo a Cossino
        deltaPoint.x *= 10/21;
        node.setPosition(cc_pAdd(currentPos, deltaPoint));

        if ((deltaPoint.x !== 0) && this_obj._debugCanvasCtx) {
            this_obj._debugCanvasCtx.fillRect(this_obj._debugCanvas.x,
                                              this_obj._debugCanvas.y,
                                              this_obj._debugCanvas.width,
                                              this_obj._debugCanvas.height);

            this_obj._debugCanvasCtx.translate(deltaPoint.x / 3.6, 0);
        }
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
        if (s_objects_layer_tmx) {
           this._tileMap = cc.TMXTiledMap.create(s_objects_layer_tmx);
        }

        if (this._tileMap !== null || this._tileMap !== undefined) {
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
        var collisionListener = new b2ContactListener();
        var bodiesScheduledToDelete = this._bodiesScheduledToDelete;

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
                    // cc.log("Begin Body A (Cossino Sprite): " + bodyA.GetPosition().x + " " + bodyA.GetPosition().y);
                    // userDataA.setColor(new cc.Color4B(255, 0, 0, 128));
                }
                else if (userDataA instanceof ViradiumSprite && userDataB instanceof CossinoSprite) {
                    // TODO: Eliminar líneas de logging y color
                    // cc.log("Begin Body A (Viradium Sprite): " + bodyA.GetPosition().x + " " + bodyA.GetPosition().y);
                    // cc.log(userDataA.getViradiumQuantity());
                    userDataA.setColor(new cc.Color4B(255, 0, 0, 128));
                }
                else if (userDataA instanceof LanderSprite) {
                    // cc.log("Begin Body A (Lander Sprite)");
                    // bodyA.GetUserData().playerIsOnRange();
                }
                else if (userDataA instanceof Object) {
                    // TODO: Eliminar líneas de logging y color
                    // cc.log("Begin Body A (TMX Object): " + bodyA.GetPosition().x + " " + bodyA.GetPosition().y);
                }
                else if ((userDataA === 1000) && !fixtureB.IsSensor()) {
                    // TODO: Eliminar líneas de logging y color
                    // cc.log("Begin Ground Sensor A.");
                    bodyA.GetUserData().setPlayerIsOnGround(true);
                }
                else if ((userDataA === 2000) && (userDataB instanceof CossinoSprite)) {
                    cc.log("Lander A ha empezado a ver a Cossino.");
                    bodyA.GetUserData().playerIsOnRange();
                }
                else if (userDataA === 3000) {
                    if (userDataB instanceof LanderSprite) {
                        bodyB.GetUserData().hitByEnemy(25);
                    }

                    if (!fixtureB.IsSensor()) {
                        bodiesScheduledToDelete.push(bodyA);
                    }
                }
            }

            if (userDataB !== null) {
                if (userDataB instanceof CossinoSprite) {
                    // TODO: Eliminar líneas de logging y color
                    // cc.log("Begin Body B (Cossino Sprite): " + bodyB.GetPosition().x + " " + bodyB.GetPosition().y);
                    // userDataB.setColor(new cc.Color4B(255, 0, 0, 128));
                }
                else if (userDataB instanceof ViradiumSprite && userDataA instanceof CossinoSprite) {
                    // TODO: Eliminar líneas de logging y color
                    // cc.log("Begin Body B (Viradium Sprite): " + bodyB.GetPosition().x + " " + bodyB.GetPosition().y);
                    userDataB.setColor(new cc.Color4B(255, 0, 0, 128));
                    // cc.log(userDataB.getViradiumQuantity());
                }
                else if (userDataB instanceof LanderSprite) {
                    // cc.log("Begin Body B (Lander Sprite)");
                    // bodyB.GetUserData().playerIsOnRange();
                }
                else if (userDataB instanceof Object) {
                    // TODO: Eliminar líneas de logging y color
                    // cc.log("Begin Body B (TMX Object): " + bodyB.GetPosition().x + " " + bodyB.GetPosition().y);
                }
                else if ((userDataB === 1000) && !fixtureA.IsSensor()) {
                    // TODO: Eliminar líneas de logging y color
                    // cc.log("Begin Ground Sensor B.");
                    bodyB.GetUserData().setPlayerIsOnGround(true);
                }
                else if ((userDataB === 2000) && (userDataA instanceof CossinoSprite)) {
                    cc.log("Lander B ha empezado a ver a Cossino.");
                    bodyB.GetUserData().playerIsOnRange();
                }
                else if (userDataB === 3000) {
                    if (userDataA instanceof LanderSprite) {
                        bodyA.GetUserData().hitByEnemy(25);
                    }

                    if (!fixtureA.IsSensor()) {
                        bodiesScheduledToDelete.push(bodyB);
                    }
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
                    // cc.log("End Body A (Cossino Sprite): " + bodyA.GetPosition().x + " " + bodyA.GetPosition().y);
                    // userDataA.setColor(new cc.Color4B(0, 0, 255, 128));
                }
                else if (userDataA instanceof ViradiumSprite && userDataB instanceof CossinoSprite) {
                    // TODO: Eliminar líneas de logging y color
                    // cc.log("End Body A (Viradium Sprite): " + bodyA.GetPosition().x + " " + bodyA.GetPosition().y);
                    userDataA.setColor(new cc.Color4B(0, 0, 255, 128));
                }
                else if (userDataA instanceof LanderSprite) {
                    // cc.log("End Body A (Lander Sprite)");
                    // bodyA.GetUserData().playerIsOutOfRange();
                }
                else if (userDataA instanceof Object) {
                    // TODO: Eliminar líneas de logging y color
                    // cc.log("End Body A (TMX Object): " + bodyA.GetPosition().x + " " + bodyA.GetPosition().y);
                }
                else if ((userDataA === 1000) && (!fixtureB.IsSensor())) {
                    // TODO: Eliminar líneas de logging y color
                    // cc.log("End Ground Sensor A.");
                    bodyA.GetUserData().setPlayerIsOnGround(false);
                }
                else if ((userDataA === 2000) && (userDataB instanceof CossinoSprite)) {
                    cc.log("Lander A ha dejado de ver a Cossino.");
                    bodyA.GetUserData().playerIsOutOfRange();
                }
                else if (userDataA === 3000 && !fixtureB.IsSensor()) {
                    bodiesScheduledToDelete.push(bodyA);
                }
            }

            if (userDataB !== null) {
                if (userDataB instanceof CossinoSprite) {
                    // TODO: Eliminar líneas de logging y color
                    // cc.log("End Body B (Sprite): " + bodyB.GetPosition().x + " " + bodyB.GetPosition().y);
                    // userDataB.setColor(new cc.Color4B(255, 0, 0, 128));
                }
                else if (userDataB instanceof ViradiumSprite && userDataA instanceof CossinoSprite) {
                    // TODO: Eliminar líneas de logging y color
                    // cc.log("End Body B (Viradium Sprite): " + bodyB.GetPosition().x + " " + bodyB.GetPosition().y);
                    userDataB.setColor(new cc.Color4B(255, 0, 0, 128));
                }
                else if (userDataB instanceof LanderSprite) {
                    // cc.log("End Body B (Lander Sprite)");
                    // bodyB.GetUserData().playerIsOutOfRange();
                }
                else if (userDataB instanceof Object) {
                    // TODO: Eliminar líneas de logging y color
                    // cc.log("End Body B (TMX Object): " + bodyB.GetPosition().x + " " + bodyB.GetPosition().y);
                }
                else if ((userDataB === 1000) && (!fixtureA.IsSensor())) {
                    // TODO: Eliminar líneas de logging y color
                    // cc.log("End Ground Sensor B.");
                    bodyB.GetUserData().setPlayerIsOnGround(false);
                }
                else if ((userDataB === 2000) && (userDataA instanceof CossinoSprite)) {
                    cc.log("Lander B ha dejado de ver a Cossino.");
                    bodyB.GetUserData().playerIsOutOfRange();
                }
                else if (userDataB === 3000 && !fixtureA.IsSensor()) {
                    bodiesScheduledToDelete.push(bodyB);
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
        var playerXtraImpulse = cc_Point(0, 0);
        var playerXtraImpulseX = 0;
        var playerXtraImpulseY = 0;
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

            if (objectCossino.SaltarImpulsoExtraX) {
                playerXtraImpulseX = parseFloat(objectCossino.SaltarImpulsoExtraX);
            }
            else if (objectCossino.saltarimpulsoextrax) {
                playerXtraImpulseX = parseFloat(objectCossino.saltarimpulsoextrax);
            }

            if (objectCossino.SaltarImpulsoExtraY) {
                playerXtraImpulseY = parseFloat(objectCossino.SaltarImpulsoExtraY);
            }
            else if (objectCossino.saltarimpulsoextray) {
                playerXtraImpulseY = parseFloat(objectCossino.saltarimpulsoextray);
            }

            if (!isNaN(playerXtraImpulseX) && !isNaN(playerXtraImpulseY)) {
                playerXtraImpulse = cc_Point(playerXtraImpulseX, playerXtraImpulseY);
            }
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

        this._playerJumpExtraImpulse = playerXtraImpulse;

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
        var colision = null;

        for (var c = 0; c < objColisionesLength; c++) {
            colision = objectsColisiones[c];
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
        var trayectoria = null;
        var tipoPersonaje = "";
        var spritePersonaje = null;
        var escalaPersonaje = 1.0;
        var escalaPersonajeCalc = 1.0;
        var boxPhyCharacter = null;
        var fixedRotation = "false";
        var fixedRotationCalc = "false";
        var longSensorVision = 0;

        for (var t = 0; t < objTrayecLength; t++) {
            trayectoria = objectsTrayectorias[t];

            if (trayectoria.Personaje) {
                tipoPersonaje = trayectoria.Personaje.trim().toLowerCase();
            }
            else if (trayectoria.personaje) {
                tipoPersonaje = trayectoria.personaje.trim().toLowerCase();
            }

            if (trayectoria.EscalaPersonaje) {
                escalaPersonajeCalc = parseFloat(trayectoria.EscalaPersonaje);
            }
            else if (trayectoria.escalapersonaje) {
                escalaPersonajeCalc = parseFloat(trayectoria.escalapersonaje);
            }
            if (!isNaN(escalaPersonajeCalc) && (escalaPersonajeCalc > 0)) {
                escalapersonaje = escalaPersonajeCalc;
            }

            if (trayectoria.RotacionFija) {
                fixedRotationCalc = trayectoria.RotacionFija.trim().toLowerCase() === "true" ? "true" : "false";
            }
            else if (trayectoria.rotacionfija) {
                fixedRotationCalc = trayectoria.rotacionfija.trim().toLowerCase() === "true" ? "true" : "false";
            }

            fixedRotation = fixedRotationCalc;

            switch (tipoPersonaje) {
                case "cossino":
                    spritePersonaje = new Cossino();
                    break;
                case "viradium":
                    spritePersonaje = new ViradiumSprite();
                    break;
                case "lander":
                    spritePersonaje = new LanderSprite();
                    break;
                default:
                    spritePersonaje = null;
            }

            if (spritePersonaje) {
                spritePersonaje.setScale(escalaPersonaje);

                boxPhyCharacter = Object.create({},
                    { x: {
                          value: trayectoria.x,
                          writable: true,
                          enumerable: true,
                          configurable: true
                          },
                      y : {
                          value: trayectoria.y,
                          writable: true,
                          enumerable: true,
                          configurable: true
                          },
                      height : {
                          value: spritePersonaje.getContentSize().height * spritePersonaje.getScaleY(),
                          writable: true,
                          enumerable: true,
                          configurable: true
                          },
                      width : {
                          value: spritePersonaje.getContentSize().width * spritePersonaje.getScaleX(),
                          writable: true,
                          enumerable: true,
                          configurable: true
                          },
                      RotacionFija : {
                          value: fixedRotation,
                          writable: true,
                          enumerable: true,
                          configurable: true
                          },
                      LongitudSensorVision : {
                          value: trayectoria.LongitudSensorVision ? trayectoria.LongitudSensorVision : "0",
                          writable: true,
                          enumerable: true,
                          configurable: true
                          },
                      Cuerpo : {
                          value: trayectoria.Cuerpo ? trayectoria.Cuerpo : "dynamic",
                          writable: true,
                          enumerable: true,
                          configurable: true
                          }
                    });

                this._tileMap.addChild(spritePersonaje, -1);

                this.addBoxBodyForTMXObject(boxPhyCharacter, spritePersonaje);
            }
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
        var cantidad = 1;
        var cantidadCalc = 1;

        for (var k = 0; k < objColecLength; k++) {
            collectable = objectsColeccionables[k];

            collectable.Sensor = "True";
            collectable.Densidad = 0;
            collectable.Friccion = 0;
            collectable.Restitucion = 0;
            collectable.Cuerpo = "Static";

            if (collectable.Cantidad) {
                cantidadCalc = parseInt(collectable.Cantidad, 10);
            }
            else if (collectable.cantidad) {
                cantidadCalc = parseInt(collectable.cantidad, 10);
            }
            if (!isNaN(cantidadCalc) && (cantidadCalc > 0)) { cantidad = cantidadCalc; }

            viradiumSpr = new ViradiumSprite();
            viradiumSpr.setScale(0.3);
            viradiumSpr.setViradiumQuantity(cantidad);

            // Resetear cantidad del coleccionable
            cantidad = cantidadCalc = 1;

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

            this.physics.world.ClearForces();

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
        this._debugCanvas = canvasDebug;
        var ctx = canvasDebug.getContext("2d");
        this._debugCanvasCtx = ctx;
        ctx.canvas.height = 600;
        ctx.canvas.width = 1024;

        if (this._debugCanvasCtx) {
            this._debugCanvasCtx.fillRect(this._debugCanvas.x,
                                          this._debugCanvas.y,
                                          this._debugCanvas.width,
                                          this._debugCanvas.height);
        }

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
            if (this._currentPlayer._currentStatus === CHR_STATUS.JUMP ||
                !this._currentPlayer.isPlayerOnGround()) {
                return false;
            }

            var this_obj = this;
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
        var body = this_obj._playerPhysicBody;
        var multiplier = this_obj._playerWalkDeltaMultiplier;

        var deltaX = (this_obj._currentPlayer.getDeltaPos().x /
                      this_obj.physics.scale) * multiplier;

        var velChangeX = deltaX - body.GetLinearVelocity().x;
        var bodyMass = body.GetMass();

        body.ApplyImpulse(new b2Vec2(bodyMass * velChangeX, 0), body.GetWorldCenter());
    },

    makePlayerShoot:function (bulletCount) {
        var this_obj = this;
        var cantidadBalas = (!isNaN(bulletCount) && bulletCount > 0) ? bulletCount : 0;

        var bulletBodyDef = new b2BodyDef();
        bulletBodyDef.type = b2Body.b2_dynamicBody;

        bulletBodyDef.userData = 3000;

        var bulletShape = new b2PolygonShape();
        bulletShape.SetAsBox(0.015, 0.005);

        var bulletShapeDef = new b2FixtureDef();
        bulletShapeDef.userData = 3000;
        bulletShapeDef.shape = bulletShape;
        bulletShapeDef.density = 0.001;
        bulletShapeDef.friction = 0.1;
        bulletShapeDef.restitution = 0;

        var bulletImpulse = new b2Vec2(450, 0);

        this_obj._playerShootIntervalId = setInterval.call(this_obj,
                                                           this_obj._shootBullet,
                                                           500,
                                                           bulletBodyDef,
                                                           bulletShapeDef,
                                                           bulletImpulse);
    },

    _shootBullet:function (bulletBodyDef, bulletShapeDef, bulletImpulse) {
        cc.log("Shoot bullet.");
        var this_obj = this;
        var direction = (this_obj._currentPlayer._currentDirection === CHR_DIRECTION.RIGHT) ? 1 : -1;
        var initialPosition = this_obj._playerPhysicBody.GetPosition();

        // Actualizar posisión del jugador
        bulletBodyDef.position.Set(initialPosition.x + (1.5 * direction),
                                   initialPosition.y + 0.6);

        var bulletBody = this_obj.physics.world.CreateBody(bulletBodyDef);

        bulletBody.SetBullet(true);
        bulletBody.SetFixedRotation(true);
        bulletBody.CreateFixture(bulletShapeDef);
        // Disparar bala
        bulletImpulse.x *= direction;
        bulletBody.ApplyImpulse(bulletImpulse, bulletBody.GetWorldCenter());
    },

    turnPlayerToLeft:function () {
        if (this._currentPlayer._currentDirection === CHR_DIRECTION.RIGHT) {
            this._currentPlayer._currentDirection = CHR_DIRECTION.LEFT;
        }
    },

    turnPlayerToRight:function () {
        if (this._currentPlayer._currentDirection === CHR_DIRECTION.LEFT) {
            this._currentPlayer._currentDirection = CHR_DIRECTION.RIGHT;
        }
    },

    adjustJumpToLeft:function () {
        var this_obj = this;

        if (this_obj._currentPlayer._currentStatus !== CHR_STATUS.JUMP) { return; }

        var body = this_obj._playerPhysicBody;
        var bodyMass = body.GetMass();

        body.ApplyImpulse(new b2Vec2(bodyMass * this_obj._playerJumpExtraImpulse.x * -1, 0),
                                     body.GetWorldCenter());
    },

    adjustJumpToRight:function () {
        var this_obj = this;

        if (this_obj._currentPlayer._currentStatus !== CHR_STATUS.JUMP) { return; }

        var body = this_obj._playerPhysicBody;
        var bodyMass = body.GetMass();

        body.ApplyImpulse(new b2Vec2(bodyMass * this_obj._playerJumpExtraImpulse.x, 0),
                                     body.GetWorldCenter());
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
