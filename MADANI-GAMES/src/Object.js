const MOVERIGHT = 1;
const MOVELEFT = -1;

var Objeto = cc.Sprite.extend({
    active:true,
    desplazamiento:null,
    speed:0,
	objetoType:0,
	moveType:null,

    ctor:function(arg){
        this._super();

        this.desplazamiento = arg.desplazamiento;
        this.moveType = arg.moveType;
        this.speed = arg.speed;
        this.objetoType = arg.type;

        this.initWithSpriteFrameName(arg.textureName);
        this.setAnchorPoint(AnchorPointCenter);	
		
		this.schedule(this.ctrlPosition, 0.5);
    },
	
	ctrlPosition: function() {
        if(g_sharedGameLayer._state == STATE_PLAYING){
            var p = this.getPosition();
            if (p.x < 0 || p.x > g_sharedGameLayer.screenRect.width) {
                this.active = false;
                this.setVisible(false);
                this.unschedule(this.ctrlPosition);
                BB.ACTIVE_OBJECTS--;
            }else{
                if(!this.active){
                    this.active = true;
                    this.setVisible(true);
                    this.schedule(this.ctrlPosition, 0.5);
                    BB.ACTIVE_OBJECTS++;
                }
            }
        }
        if(g_sharedGameLayer._state == STATE_PAUSED){
         //   this.stopAllActions();
        }
    },

	animate:function(images){
        // set frame
        var animFrames = [];
        for (var i = images.length - 1; i >= 0; i--) {
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(images[i]);
            animFrames.push(frame);
        };

        // ship animate
        var animation = cc.Animation.create(animFrames, 0.1);
        var aAnimate = cc.Animate.create(animation);
        this.runAction(aAnimate); 
    },

	hurt:function () {
        blink = cc.Blink.create(2, 10);
        fade = cc.FadeOut.create(1.0);
        this.setOpacity(0);
        this.runAction(cc.Sequence.create(blink, fade));

        if (BB.SOUND) {
            if (this.objetoType == BB.OBJECT_TYPE.WOOD || this.objetoType == BB.OBJECT_TYPE.LIFE){
                cc.AudioEngine.getInstance().playEffect(s_takeLife);
            }else{
                cc.AudioEngine.getInstance().playEffect(s_choque);
            }
        }
        this.setVisible(false);
        this.active = false;
        this.stopAllActions();
        this.unschedule(this.ctrlPosition);
        BB.ACTIVE_OBJECTS--;
    },
	
    collideRect:function (p) {
        var a = this.getContentSize();
        return cc.rect(p.x - a.width / 2, p.y - a.height / 4, a.width, a.height / 2+20);
    }
});

Objeto.getOrCreateObjeto = function (arg) {
    var selChild = null;
    for (var j = 0; j < BB.CONTAINER.OBJECTS.length; j++) {
        selChild = BB.CONTAINER.OBJECTS[j];

        if (selChild.active == false && selChild.objetoType == arg.type) {
            selChild.active = true;
            selChild.moveType = arg.moveType;
            selChild.setVisible(true);
            selChild.schedule(selChild.ctrlPosition, 0.5);
            BB.ACTIVE_OBJECTS++;
            return selChild;
        }
    }
    selChild = Objeto.create(arg);
    BB.ACTIVE_OBJECTS++;
    return selChild;
};

Objeto.create = function(arg){
    var objeto = new Objeto(arg);
	BB.CONTAINER.OBJECTS.push(objeto);
	g_sharedGameLayer.addChild(objeto, BB.UNIT_LAYER.OBJECT);
    return objeto;
};

Objeto.preSet = function () {
    /*var objeto = null;
    for (var i = 0; i < ObjectType.length; i++) {
        objeto = Objeto.create(ObjectType[i]);
        objeto.setVisible(false);
        objeto.active = false;
        objeto.unscheduleAllCallbacks();
    }*/
};