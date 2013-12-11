/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 ****************************************************************************/
STATE_PLAYING = 0;
STATE_GAMEOVER = 1;
STATE_PAUSED = 2;
STATE_WIN = 3;
MAX_CONTAINT_WIDTH = 40;
MAX_CONTAINT_HEIGHT = 40;

var g_sharedGameLayer;

var GameLayer = cc.Layer.extend({
	_time:null,
    isMouseDown:false,
	screenRect:null,
    sprite:null,
	spriteAbajo:null,
	spriteArriba:null,
    _beaver:null,
    _levelManager:null,
	_state:STATE_PLAYING,
	_tmpScore:0,
    _tmpTime:0,
	_layerPause:null,
	_lbTime:null,
    damItemPos:null,

    init2:function (level) {

        //////////////////////////////
        // 1. super init first
        //this._super();

        cc.SpriteFrameCache.getInstance().addSpriteFrames(s_sprites_plist);

		// reset global values
        BB.CONTAINER.OBJECTS = [];
        BB.DAM_ITEMS = level.damItemPos.length -1;
        this.damItemPos = level.damItemPos;

        //Start the Game with the playing state
		this._state = STATE_PLAYING;

		size = cc.Director.getInstance().getWinSize();

		this.screenRect = cc.rect(0, 0, size.width, size.height);

		// ship life
		var life = cc.Sprite.create(s_corazon);
		life.setScale(0.5);
		life.setPosition(size.width - 110, 70);
		this.addChild(life, 1, 1000);

		// ship Life count
		this._lbLife = cc.LabelTTF.create("0", "Georgia", 35);
		this._lbLife.setPosition(size.width - 70, 65);
		this._lbLife.setColor(cc.c3b(255, 255, 255));
		this.addChild(this._lbLife, 1000);

        this._time = level.gameTime;

		// Timer count
		this._lbTime = cc.LabelTTF.create(String(this._time), "Georgia", 35);
		this._lbTime.setPosition(size.width - 100, 25);
		this._lbTime.setColor(cc.c3b(255, 255, 255));
		this.addChild(this._lbTime, 1000);


        // add "Helloworld" splash screen"
        this.sprite = cc.Sprite.create(s_Fondo);
        this.sprite.setAnchorPoint(cc.p(0.5, 0.5));
        this.sprite.setPosition(cc.p(size.width / 2, size.height / 2));
        this.sprite.setScale(size.height/this.sprite.getContentSize().height);
        this.addChild(this.sprite);

		//Button Pause
		var pauseItem = cc.MenuItemImage.create(
            s_pausaNormal,
            s_pausaSelected,
             function () {
				if (this._state == STATE_PAUSED){
					this._state = STATE_PLAYING;
				}else{
					this._state = STATE_PAUSED;
				}
                if (BB.SOUND) {
                   cc.AudioEngine.getInstance().playEffect(s_buttonClick);
                }
			},this);
        pauseItem.setAnchorPoint(cc.p(0.5, 0.5));
		pauseItem.setScale(0.2);

        var menuPause = cc.Menu.create(pauseItem);
        menuPause.setPosition(cc.p(0, 0));
        this.addChild(menuPause, 2001);
        pauseItem.setPosition(cc.p(size.width - 20, 25));

        // add "pasto de arriba
        this.spriteArriba = cc.Sprite.create(level.border.top);
        this.spriteArriba.setAnchorPoint(AnchorPointTop);
        this.spriteArriba.setPosition(VisibleRect.top());
        this.spriteArriba.setScale(this.sprite.getScale());
        this.addChild(this.spriteArriba);

        // add pasto de abajo
        this.spriteAbajo = cc.Sprite.create(level.border.bottom);
        this.spriteAbajo.setAnchorPoint(AnchorPointBottom);
        this.spriteAbajo.setPosition(VisibleRect.bottom());
        this.spriteAbajo.setScale(this.sprite.getScale());
        this.addChild(this.spriteAbajo);

         // add "Helloworld" splash screen"
        this._beaver = Beaver.create(BeaverType[0]);

        this.addChild(this._beaver, BB.UNIT_LAYER.BEAVER);

         if ('keyboard' in sys.capabilities) {
            this.setKeyboardEnabled(true);
        }

        this.scheduleUpdate();
        this.schedule(this.timeCounter, 1);
        //Dibuja temporalmente una madera
        //this.schedule(this.madera_temporal,20);

		g_sharedGameLayer = this;
        this._levelManager = new LevelManager(level);

        this._layerPause = new PauseLayer();
        this._layerPause.setAnchorPoint(cc.p(0, 0));
        this._layerPause.setPosition(cc.p(0, 0));
		this.addChild(this._layerPause, 2000);
        this._layerPause.setVisible(false);

		Objeto.preSet();

		return true;
    },

    madera_temporal:function() {
        var p = this._beaver.getPosition();

        sprite = cc.Sprite.create("madera.png");
        sprite.setOpacity(0);
        this.addChild(sprite, 1, 1000);
        //sprite.setPosition(size.width - 60, 600);
        sprite.setPosition(60, 600);
        var delay = cc.DelayTime.create(0.25);
        //var action = cc.FadeOut.create(7.0);
        var action = cc.FadeIn.create(9.0);
        var actionBack = action.reverse();
        sprite.runAction(cc.Sequence.create(action, delay, actionBack));
        var action2 = cc.FadeOut.create(2.0);
        var action2Back = action2.reverse();
        //sprite.runAction(cc.Sequence.create(action2, delay.clone(), action2Back));
        if (p.x == 60 && p.y == 600) {
            cc.log("Toca madera");
            sprite.runAction(cc.Sequence.create(action2, delay.clone(), action2Back));
            this._beaver.animate(this._beaver.imageDown);
        }
    },

	timeCounter:function () {
        if (this._state == STATE_PLAYING) {
            this._time--;

            var minute = 0 | (this._time / 60);
            var second = this._time % 60;
            minute = minute > 9 ? minute : "0" + minute;
            second = second > 9 ? second : "0" + second;
            var curTime = minute + ":" + second;

			this._lbTime.setString(curTime);

            this._levelManager.loadLevelResource(this._time);
        }
    },

    onKeyDown: function (e) {
        BB.KEYS[e] = true;
    },

    onKeyUp: function (e) {
        BB.KEYS[e] = false;
    },

    update: function(dt) {

		switch (this._state){
			case STATE_PAUSED:
                this._layerPause.setVisible(true);
				/*if (BB.KEYS[cc.KEY.p]) {
					this._state = STATE_PLAYING;
                    this._layerPause.setVisible(false);
				}*/
				break;

			case STATE_PLAYING:
                this._layerPause.setVisible(false);
				/*if (BB.KEYS[cc.KEY.p]) {
					this._state = STATE_PAUSED;
                    this._layerPause.setVisible(true);
				}*/
				this._beaver.update();
				this.checkIsCollide();
                this.checkIsReborn();
                this.updateUI();
				break;

            case STATE_GAMEOVER:
                this.unscheduleUpdate();
                if (BB.SOUND) {
                    cc.AudioEngine.getInstance().playEffect(s_gameFail);
                }
                this.runAction(cc.Sequence.create(
                    cc.DelayTime.create(2),
                    cc.CallFunc.create(this.onGameOver, this)));
                break;

            case STATE_WIN:
                if (BB.SOUND) {
                    cc.AudioEngine.getInstance().playEffect(s_gamePass);
                }
                this._beaver.jump();
                this.runAction(cc.Sequence.create(
                    cc.DelayTime.create(2),
                    cc.CallFunc.create(this.onGameWin, this)));
                break;
		}
    },

    checkIsCollide:function () {
        var selChild;
        // check collide
        var i = 0;
        for (i = 0; i < BB.CONTAINER.OBJECTS.length; i++) {
            selChild = BB.CONTAINER.OBJECTS[i];
			if (!selChild.active)
				continue;

			if (this.collide(selChild, this._beaver)) {
                if (selChild.objetoType == BB.OBJECT_TYPE.WOOD){
                    this._beaver.wood();
                }else if (selChild.objetoType == BB.OBJECT_TYPE.LIFE){
                    BB.LIFE ++;
                }else{
                    this._beaver.hurt();
                }
                selChild.hurt();
			}
		}
    },

	checkIsReborn:function () {
        if (BB.LIFE > 0 && !this._beaver.active) {
            this._beaver.born();
        }
        else if (BB.LIFE <= 0 ) {
            this._state = STATE_GAMEOVER;
        }
    },

    updateUI:function () {
        if (BB.DAM_ITEMS == 0){
            this._state = STATE_WIN;
        }
        if (this._time == 0) {
            this._state = STATE_GAMEOVER;
        }
        this._lbLife.setString(BB.LIFE + '');
    },

    collide:function (a, b) {
        var pos1 = a.getPosition();
        var pos2 = b.getPosition();
        if (Math.abs(pos1.x - pos2.x) > MAX_CONTAINT_WIDTH || Math.abs(pos1.y - pos2.y) > MAX_CONTAINT_HEIGHT)
            return false;

        var aRect = a.collideRect(pos1);
        var bRect = b.collideRect(pos2);
        return cc.rectIntersectsRect(aRect, bRect);
    },

    addDamItem:function(){
        var sp = cc.Sprite.create(s_tronco_represa);
        sp.setAnchorPoint(AnchorPointCenter);
        sp.setPosition(this._beaver.getPosition());
        g_sharedGameLayer.addChild(sp, BB.UNIT_LAYER);

        var pos = this.damItemPos[BB.DAM_ITEMS];
        BB.DAM_ITEMS--;

        var action = cc.Spawn.create(
            cc.MoveTo.create(1, pos),
            cc.RotateBy.create(1, 720));
        sp.runAction(action);
    },

    onGameOver:function () {
        var scene = cc.Scene.create();
        scene.addChild(GameOver.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },

    onGameWin:function () {
        BB.CURRENT_LEVEL++;
        var scene = cc.Scene.create();
        scene.addChild(MapLayer.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    }
});

GameLayer.create = function (level) {
    var sg = new GameLayer();
    if (sg && sg.init()) {
        sg.init2(level);
        return sg;
    }
    return null;
};

GameLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = GameLayer.create();
    scene.addChild(layer, 1);
    return scene;
};
