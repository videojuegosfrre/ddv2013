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
    _FNWalkPrefix: "walk",
    _FNShootIdx: 1,
    _FNShootPrefix: "shooting",
    _currentPos: null,
    _executingAnimation: false,
    _nextStatus: null,
    _nextDirection: CHR_DIRECTION.NOTSET,
    _antiKeyBounceCounter: 0,
    _onFinishStandStop: false,
    _onFinishRunStop: false,
    _onFinishWalkStop: false,
    _onFinishJumpStop: false,
    _onFinishShootStop: false,
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
    _shootDeltaPos: null,
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
        this._shootDeltaPos = cc_Point(0, 0);

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

        if (this._FNWalkIdx > 18) {
            this._FNWalkIdx = 5;

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

    updateShoot:function () {
        var menuItemX, menuItemY = 0;

        menuItemX = this.wSizeWidth / 2;
        menuItemY = this.wSizeHeight / 2;

        if (this._FNShootIdx > 8) {
            this._FNShootIdx = 2;

            // FIXME:
            if (this._onFinishShootStop) {
                this.stopJump();
                this._nextStatus();
            }
        }

        // cc.log(cossino_pj.FNStandIdx);

        var indexAsString = this._FNShootIdx.toString();
        this._FNShootIdx += 1;

        var next_frame = this.frameCache.getSpriteFrame(this._FNShootPrefix +
                                                   indexAsString + ".png");

        this.removeAllChildren();
        this.setTextureRect(next_frame.getRect());
        this.setDisplayFrame(next_frame);
    },

    updateGunDown:function () {

    },

    handleKeyDown:function (e) {
        cc.log("Handle Key Down Cossino.");

        switch (e) {
            case KEYS.GOLEFT:
                if (this._currentStatus == CHR_STATUS.JUMP) {
                    //this.reqOnFinishJumpStop(this.beginWalk);
                    this.reqOnFinishJumpStop();
                } else {
                    this.turnLeft();
                    this.beginWalk();
                }
                break;
            case KEYS.GORIGHT:
                if (this._currentStatus == CHR_STATUS.JUMP) {
                    //this.reqOnFinishJumpStop(this.beginWalk);
                    this.reqOnFinishJumpStop();
                } else {
                    this.turnRight();
                    this.beginWalk();
                }
                break;
            case KEYS.RUN:
                if (this._currentStatus == CHR_STATUS.JUMP) {
                    //this.reqOnFinishJumpStop(this.beginRun);
                    this.reqOnFinishJumpStop();
                } else {
                   this.beginRun();
                }
                break;
            case KEYS.JUMP:
                this.beginJump();
                break;
            case KEYS.SHOOT:
                this.beginShoot();
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
                    this.beginStand();
                 }
                break;
            case KEYS.JUMP:
                if (this._currentStatus == CHR_STATUS.JUMP) {
                    this.reqOnFinishJumpStop();
                    //this.beginStand();
                }
                break;
            case KEYS.SHOOT:
                if (this._currentStatus === CHR_STATUS.SHOOT) {
                    this.beginStand();
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
        this.unschedule(this.updateShoot);
        this.stopShootEffect();

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
        this.schedule(this.updateWalk, 0.12);
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

    _shoot:function () {
        this.beginShoot();
    },

    beginShoot:function () {
        cc.log("Cossino Shoot.");
        switch (this._currentDirection) {
            case CHR_DIRECTION.RIGHT:
                this._setDeltaPos(this._shootDeltaPos.x, this._shootDeltaPos.y);
                break;
            case CHR_DIRECTION.LEFT:
                this._setDeltaPos(this._shootDeltaPos.x * -1, this._shootDeltaPos.y);
                break;
            case CHR_DIRECTION.UP:
                this._setDeltaPos(this._shootDeltaPos.x, this._shootDeltaPos.y);
                break;
            case CHR_DIRECTION.DOWN:
                this._setDeltaPos(this._shootDeltaPos.x, this._shootDeltaPos.y * -1);
                break;
        }

        this._currentStatus = CHR_STATUS.SHOOT;
        // Quick & Dirty, Hacky, Nasty...
        // Must be refactored, improved...
        this.unschedule(this.updateJump);
        this.stopJumpEffect();
        this.unschedule(this.updateWalk);
        this.stopWalkEffect();
        this.unschedule(this.updateStand);
        this.stopStandEffect();
        this.unschedule(this.updateRun);
        this.stopRunEffect();

        // Importante: la luz es más rápida que el sonido.
        // Reproducir sonido antes de animar.
        this.schedule(this.playShootEffect, 0.8);
        this.schedule(this.updateShoot, 0.1);
        this._executingAnimation = true;
    },

    stopShoot:function () {
        this.clearDeltaPos();
        this.unschedule(this.updateShoot);
        this.stopShootEffect();
        this._FNShootIdx = 1;
        this._onFinishShootStop = false;
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

    playShootEffect:function () {
        this.audioEngine.playEffect(s_cossino_shoot);
    },

    stopShootEffect:function () {
        this.unschedule(this.playShootEffect);
        this.audioEngine.stopEffect(s_cossino_shoot);
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
