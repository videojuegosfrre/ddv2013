/**
 * Created by Disco on 23/11/13.
 */
var ButtonLevel = cc.MenuItemSprite.extend({

    ctor: function(parent, lvl){
        this._super();

        this._lvl = lvl;

        //Add button Level
        var bNormal = cc.Sprite.create(s_blanco);
        var bNormalAct = cc.Sprite.create(s_blancopresionadoAct);
        var bSelected = cc.Sprite.create(s_blancopresionado);

        this.initWithNormalSprite(bNormalAct, bNormal, bSelected, function() {
                            this.flareEffect(parent, this, this.onlevel);
                            }.bind(this), parent);
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setScale(0.25);
    },

    flareEffect: function (parent, target, callback) {
        var flare = cc.Sprite.create(s_flare);
        flare.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
        parent.addChild(flare, 10);
        flare.setOpacity(0);
        flare.setAnchorPoint(AnchorPointCenter);
        flare.setPosition(target.getPosition());
        flare.setRotation(-120);
        flare.setScale(0.2);

        var opacityAnim = cc.FadeTo.create(0.5, 255);
        var opacDim = cc.FadeTo.create(0.3, 0);
        var biggeAnim = cc.ScaleBy.create(0.3, 1.2, 1.2);
        var biggerEase = cc.EaseSineOut.create(biggeAnim);
        var moveAnim = cc.MoveBy.create(0.3, target.getPosition());
        var easeMove = cc.EaseSineOut.create(moveAnim);
        var rotateAnim = cc.RotateBy.create(0.3, 90);
        var rotateEase = cc.EaseExponentialOut.create(rotateAnim);
        var bigger = cc.ScaleTo.create(0.3, 1);

        var onComplete = cc.CallFunc.create(callback, target);
        var killflare = cc.CallFunc.create(function () {
            this.getParent().removeChild(this,true);
        }, flare);

        if (BB.SOUND) {
            cc.AudioEngine.getInstance().playEffect(s_buttonMapClick);
        }

        flare.runAction(cc.Sequence.create(opacityAnim, biggerEase, opacDim, killflare, onComplete));
        //flare.runAction(easeMove);
        flare.runAction(rotateEase);
        flare.runAction(bigger);
    },

    onlevel:function () {
        var scene = cc.Scene.create();
        scene.addChild(GameLayer.create(LevelsConfig[this._lvl]));
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
        cc.AudioEngine.getInstance().stopMusic();
    }
});