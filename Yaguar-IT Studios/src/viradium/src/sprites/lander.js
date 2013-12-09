var LanderSprite = cc.Sprite.extend({
    _currentDirection: CHR_DIRECTION.RIGHT,
    _currentStatus: CHR_STATUS.STAND,
    _FNStandPrefix: "lander_stand",
    _FNStandIdx: 1,
    _FNShowUpPrefix: "lander_sale",
    _FNShowUpIdx: 1,
    _FNShootPrefix: "lander_shoot",
    _FNShootIdx: 1,
    _currentPos: null,
    _executingAnimation: false,
    _nextStatus: null,
    _nextDirection: CHR_DIRECTION.NOTSET,
    _antiKeyBounceCounter: 0,
    _onFinishStandStop: false,
    _onFinishShowUpStop: false,
    _onFinishShootStop: false,
    director: null,
    frameCache: null,
    wSizeWidth: 0,
    wSizeHeight: 0,
    audioEngine: null,
    spriteDescription: null,
    _playerPhysicBody: null,
    _onGround: false,
    _standDeltaPos: null,
    _health: 0,

    ctor:function () {
        cc.log("Constructor: LanderSprite");
        this._super();

        this.setAnchorPoint(cc_Point(0.5, 0.5));

        var cache = cc.SpriteFrameCache.getInstance();
        cache.addSpriteFrames(s_lander_plist, s_lander_img);

        this.director = cc.Director.getInstance();
        this.wSizeWidth = this.director.getWinSize().width;
        this.wSizeHeight = this.director.getWinSize().height;
        this.frameCache = cc.SpriteFrameCache.getInstance();
        this.audioEngine = cc.AudioEngine.getInstance();

        this.spriteDescription = "Lander";

        this._onFinishShootStop = true;
        this._onFinishShowUpStop = true;

        this.initWithSpriteFrameName(this._FNStandPrefix + "1.png");
        //this.init();

        // Schedule updates
        cc.log("Scheduling Lander Global Update...");
        this.scheduleUpdate();

        // Inicialmente mostrar personaje apuntando hacia la izquierda
        // y parado
        this._currentDirection = CHR_DIRECTION.LEFT;
        this.beginShowUp();
        this._nextStatus = this.beginStand;
    },

    update:function (dt) {
    },

    updateStand:function () {
        var menuItemX, menuItemY = 0;

        menuItemX = this.wSizeWidth / 2;
        menuItemY = this.wSizeHeight / 2;

        if (this._FNStandIdx > 8) {
            this._FNStandIdx = 1;
        }

        var indexAsString = this._FNStandIdx.toString();
        this._FNStandIdx += 1;

        var next_frame = this.frameCache.getSpriteFrame(this._FNStandPrefix +
                                                        indexAsString + ".png");

        this.removeAllChildren();
        this.setTextureRect(next_frame.getRect());
        this.setDisplayFrame(next_frame);
    },

    updateShoot:function () {
        var menuItemX, menuItemY = 0;

        menuItemX = this.wSizeWidth / 2;
        menuItemY = this.wSizeHeight / 2;

        if (this._FNShootIdx > 13) {
            this._FNShootIdx = 1;

            // FIXME:
            if (this._onFinishShootStop) {
                this.stopShoot();
                this.beginStand();
            }
        }

        var indexAsString = this._FNShootIdx.toString();
        this._FNShootIdx += 1;

        var next_frame = this.frameCache.getSpriteFrame(this._FNShootPrefix +
                                                        indexAsString + ".png");

        this.removeAllChildren();
        this.setTextureRect(next_frame.getRect());
        this.setDisplayFrame(next_frame);
    },

    updateShowUp:function () {
        var menuItemX, menuItemY = 0;

        menuItemX = this.wSizeWidth / 2;
        menuItemY = this.wSizeHeight / 2;

        if (this._FNShowUpIdx > 13) {
            this._FNShowUpIdx = 1;

            // FIXME:
            if (this._onFinishShowUpStop) {
                this.stopShowUp();
                this.beginStand();
            }
        }

        var indexAsString = this._FNShowUpIdx.toString();
        this._FNShowUpIdx += 1;

        var next_frame = this.frameCache.getSpriteFrame(this._FNShowUpPrefix +
                                                        indexAsString + ".png");

        this.removeAllChildren();
        this.setTextureRect(next_frame.getRect());
        this.setDisplayFrame(next_frame);
    },

    _stand:function () {
        this.beginStand();
    },

    beginStand:function () {
        cc.log("Stand Cossino.");
        this._currentStatus = CHR_STATUS.STAND;
        // Quick & Dirty, Hacky, Nasty...
        // Must be refactored, improved...
        this.unschedule(this.updateShoot);
        this.stopShootEffect();
        this.unschedule(this.updateShowUp);
        this.stopShowUpEffect();

        this.schedule(this.updateStand, 0.35);
        this.schedule(this.playStandEffect);
    },

    stopStand:function () {
        this.unschedule(this.updateStand);
        this.stopStandEffect();
        this._FNStandIdx = 1;
        this._onFinishStandStop = false;
    },

    _showup:function () {
        this.beginWalk();
    },

    beginShowUp:function () {
        cc.log("Show Up Lander.");

        this._currentStatus = CHR_STATUS.SHOWUP;
        // Quick & Dirty, Hacky, Nasty...
        // Must be refactored, improved...
        this.unschedule(this.updateStand);
        this.stopStandEffect();
        this.unschedule(this.udpateShoot);
        this.stopShootEffect();

        // Importante: la luz es más rápida que el sonido.
        // Reproducir sonido antes de animar.
        this.schedule(this.playShowUpEffect, 1);
        this.schedule(this.updateShowUp, 0.1);
        this._executingAnimation = true;
    },

    stopShowUp:function () {
        this.unschedule(this.updateShowUp);
        this.stopShowUpEffect();
        this._FNShowUpIdx = 1;
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

    _shoot:function () {
        this.beginShoot();
    },

    beginShoot:function () {
        cc.log("Lander Shoot.");
        this._currentStatus = CHR_STATUS.SHOOT;
        // Quick & Dirty, Hacky, Nasty...
        // Must be refactored, improved...
        this.unschedule(this.updateStand);
        this.stopStandEffect();
        this.unschedule(this.updateShowUp);
        this.stopShowUpEffect();

        // Importante: la luz es más rápida que el sonido.
        // Reproducir sonido antes de animar.
        this.schedule(this.playShootEffect, 0.8);
        this.schedule(this.updateShoot, 0.1);
        this._executingAnimation = true;
    },

    stopShoot:function () {
        this.unschedule(this.updateShoot);
        this.stopShootEffect();
        this._FNShootIdx = 1;
        this._onFinishShootStop = false;
    },

    reqOnFinishRunStop:function (next_status) {
        cc.log("Detener Run Lander al finalizar sprites.");
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
            cc.log("Turn Left Lander.");
            this.setFlippedX(true);
            this._currentDirection = CHR_DIRECTION.LEFT;
        }
    },

    turnRight:function () {
        if (this._currentDirection === CHR_DIRECTION.LEFT) {
            cc.log("Turn Right Lander.");
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

    getCurrentStatus:function () {
        return this._currentStatus;
    },

    getCurrentDirection:function () {
        return this._currentDirection;
    },

    _setNextStatus:function (nextStatus) {
        this.nextStatus = nextStatus;
    },

    playStandEffect:function () {
    },

    stopStandEffect:function () {
        this.unschedule(this.playStandEffect);
    },

    playShowUpEffect:function () {
    },

    stopShowUpEffect:function () {
        this.unschedule(this.playShowUpEffect);
    },

    playShootEffect:function () {
    },

    stopShootEffect:function () {
        this.unschedule(this.playShootEffect);
    },

    getSpriteDescription:function () {
        return this.spriteDescription;
    },

    playerIsOnRange:function () {
        this.beginShoot();
    },

    playerIsOutOfRange:function () {
        this.beginStand();
    },

    hitByEnemy:function () {
        cc.log("Lander ha sido alcanzado por fuego enemigo!");
    },

    setHealth:function (health) {
        this._health = health;
    },

    getHealth:function () {
        return this._health;
    }
});
