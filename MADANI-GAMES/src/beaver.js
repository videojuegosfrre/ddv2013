STATE_GO = 0;
STATE_BACK = 1;

var Beaver;
Beaver = cc.Sprite.extend({
    active: true,
    x: null,
    y: null,
    desplazamiento: null,
    size: null,
    lives: 0,
    strench: null,
    speed: 0,
    armor: null,
    imageDown: null,
    imageUp: null,
    imageInit: null,
    imageRotate: null,
    _state:0,

    ctor: function (arg) {
        this._super();

        this.desplazamiento = arg.desplazamiento;
        this.strench = arg.strench;
        this.speed = arg.speed;
        this.armor = arg.armor;
        BB.LIFE = arg.lives;

        this.imageDown = arg.imageDown;
        this.imageUp = arg.imageUp;
        this.imageInit = arg.imageInit;
        this.imageRotate = arg.imageRotate;

        this.x = screenWidth / 2;
        this.y = 40;
        this._state = STATE_GO;

        this.initWithSpriteFrameName(arg.frameName);
        this.setPosition(cc.p(this.x, this.y));
        this.setAnchorPoint(AnchorPointCenter);
    },

    update: function () {
        var UP = 1;
        var DOWN = -1;
        var pos = this.getPosition();
        maxtop = screenHeight - g_sharedGameLayer.spriteArriba.getContentSize().height;
        maxbottom = g_sharedGameLayer.spriteAbajo.getContentSize().height;

        if ((BB.KEYS[cc.KEY.w] || BB.KEYS[cc.KEY.up]) && pos.y <= screenHeight) {
            BB.KEYS[cc.KEY.w] = false;
            BB.KEYS[cc.KEY.up] = false;

            if (pos.y <= maxtop && pos.y >= maxbottom) {
                if(this._state == STATE_GO){
                    this.animate(this.imageUp);
                }else{
                    this.animate(this.imageDown);
                }
                this.move(UP);
            } else {
                if (pos.y >= maxtop && this._state == STATE_GO){
                    this._state = STATE_BACK;
                    this.animate(this.imageRotate);
                    this.unschedule(this.animar_agua);
                }
                if (pos.y < maxbottom) {
                    this.setPosition(cc.p(this.x, maxbottom));
                }
            }
        }
        if ((BB.KEYS[cc.KEY.s] || BB.KEYS[cc.KEY.down]) && pos.y >= 0) {
            BB.KEYS[cc.KEY.s] = false;
            BB.KEYS[cc.KEY.down] = false;
            if (pos.y <= maxtop && pos.y >= maxbottom) {
                if(this._state == STATE_GO){
                    this.animate(this.imageUp);
                }else{
                    this.animate(this.imageDown);
                }
                this.move(DOWN);
            } else {
                if(pos.y <= maxbottom && this._state == STATE_BACK){
                    this._state = STATE_GO;
                    this.agregarTronco();
                    this.unschedule(this.animar_agua);
                }
                if(pos.y > maxtop){
                    this.setPosition(cc.p(this.x, maxtop));
                }
            }
        }
    },

    animate: function (images) {
        // set frame
        var animFrames = [];
        for (var i = images.length - 1; i >= 0; i--) {
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(images[i]);
            animFrames.push(frame);
        };

        var animation = cc.Animation.create(animFrames, 0.1);
        var aAnimate = cc.Animate.create(animation);
        this.runAction(aAnimate);
    },

    agregarTronco: function(){
        g_sharedGameLayer.addDamItem();
        this.animate(this.imageInit);
    },
    destroy: function (dt) {
        var p = this.getPosition();
        this.runAction(cc.JumpTo.create(1, cc.p(400, 400), 20, 20));
        this.runAction(cc.RotateBy.create(1, cc.p(0, 0)));
    },

    jump: function () {
        var p = this.getPosition();
        var j = cc.JumpTo.create(0.5, p, this.desplazamiento, 1);
        this.runAction(cc.Sequence.create(j, cc.DelayTime.create(0.5), j.clone()));
    },

    move: function (direction) {
        var p = this.getPosition();
        var movimiento = p.y;
        movimiento += this.desplazamiento * direction;
        var m = cc.MoveTo.create(0.1, cc.p(p.x, movimiento), 40, 1);
        this.schedule(this.animar_agua, 1.0);
        this.runAction(m);
    },

    //Movimientos para la left and right
    move_der_izq: function (direction) {
        var p = this.getPosition();
        var movimiento = p.x;
        movimiento += this.desplazamiento * direction;
        var m = cc.MoveTo.create(0.1, cc.p(movimiento, p.y), 40, 1);
        this.runAction(m);
    },

    hurt: function () {
        BB.LIFE--;
        this._state = STATE_GO;
        this.animate(this.imageUp);
        this.born();
    },

    collideRect: function (p) {
        var a = this.getContentSize();
        return cc.rect(p.x - a.width / 2, p.y - a.height / 2, a.width, a.height);
    },

    born: function () {
        var blinks = cc.Blink.create(1.5, 6);
        this.runAction(cc.Sequence.create(cc.DelayTime.create(0.5), blinks));
        this.active = true;
        this.x = screenWidth / 2;
        this.y = maxbottom;
        this.setPosition(cc.p(this.x, this.y));
    },

    animar_agua:function(){
        sprite = cc.Sprite.create(s_adentro);
        //sprite.setAnchorPoint(AnchorPointCenter);
        this.addChild(sprite, -1, 1000);
        sprite.setPosition(15,50);
        var delay = cc.DelayTime.create(0.6);
        var action = cc.FadeIn.create(0,5);
        var actionBack = action.reverse();

        sprite.runAction(cc.Sequence.create(action, delay.clone(), actionBack));
        //----Sprite 2 de animacion del agua con circulo en el medio;
        //sprite2=cc.Sprite.create(s_adentro2);
        //this.addChild(sprite2, 1, 1000);
        //sprite2.setPosition(15,50);
        //var delay2 = cc.DelayTime.create(0.7);
        //var action2 = cc.FadeIn.create(0,6);
        //var actionBack2 = action2.reverse();
        //sprite2.runAction(cc.Sequence.create(action2, delay2.clone(), actionBack2));
        //----Sprite 3 de animacion del agua con circulo fuera;
        sprite3=cc.Sprite.create(s_medio);
        this.addChild(sprite3, -1, 1000);
        sprite3.setPosition(15,50);
        var delay3 = cc.DelayTime.create(0.8);
        var action3 = cc.FadeIn.create(0,7);
        var actionBack3 = action3.reverse();

        sprite3.runAction(cc.Sequence.create(action3, delay3.clone(), actionBack3));
        //---Otro sprite para ver como queda;
        sprite4=cc.Sprite.create(s_afuera);
        this.addChild(sprite4, -1, 1000);
        sprite4.setPosition(15,50);
        var delay4 = cc.DelayTime.create(0.9);
        var action4 = cc.FadeIn.create(0,8);
        var actionBack4 = action4.reverse();

        sprite4.runAction(cc.Sequence.create(action4, delay4.clone(), actionBack4));
    }
});

Beaver.create = function(arg){
    var beaver = new Beaver(arg);
    size = cc.Director.getInstance().getVisibleSize();

    return beaver;
};