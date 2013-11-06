
var Beaver = cc.Sprite.extend({
    active:true,
    x:null,
    y:null,
    desplazamiento:null,
    size:null,
    lives:0,
	strench:null,
    speed:220,
    armor:null,

    ctor:function(arg){
        this._super();

        this.desplazamiento = arg.desplazamiento;
        this.strench = arg.strench;
        this.speed = arg.speed;
        this.armor = arg.armor;
        this.lives = arg.lives;

        this.x = screenWidth / 2;
        this.y = 0;

        this.initWithSpriteFrameName("slice27_27.png");
        this.setPosition(cc.p(this.x, this.y));
        this.setAnchorPoint(AnchorPointBottom);

        this.schedule(this.asd, 0.5);
        this.scheduleUpdate();

    },
	
	update: function(dt) {
        cc.log("Update");

        var UP = 1;
        var DOWN = -1;
      //  if (sys.platform == 'browser') {
            var pos = this.getPosition();
            if ((BB.KEYS[cc.KEY.w] || BB.KEYS[cc.KEY.up]) && pos.y <= screenHeight) {
                this.move(UP);
                BB.KEYS[cc.KEY.w] = false;
                BB.KEYS[cc.KEY.up] = false;
                this.animate();
            }
            if ((BB.KEYS[cc.KEY.s] || BB.KEYS[cc.KEY.down]) && pos.y >= 0) {
                this.move(DOWN);
                BB.KEYS[cc.KEY.s] = false;
                BB.KEYS[cc.KEY.down]= false;
                this.animate();
            }
            if ((BB.KEYS[cc.KEY.a] || BB.KEYS[cc.KEY.left]) && pos.x >= 0) {
                //pos.x -= dt * this.speed;
            }
            if ((BB.KEYS[cc.KEY.d] || BB.KEYS[cc.KEY.right]) && pos.x <= screenWidth) {
                //pos.x += dt * this.speed;
            }
            if ((BB.KEYS[cc.KEY.space]) && pos.y <= screenHeight) {
                this.jump();
                BB.KEYS[cc.KEY.space] = false;
            }
            this.setPosition(pos);
      //  };
    },

    animate:function(){
        // set frame
        var frame0 = cc.SpriteFrameCache.getInstance().getSpriteFrame("slice27_27.png");
        var frame1 = cc.SpriteFrameCache.getInstance().getSpriteFrame("slice28_28.png");

        var animFrames = [];
        animFrames.push(frame0);
        animFrames.push(frame1);

        // ship animate
        var animation = cc.Animation.create(animFrames, 0.1);
        var animate = cc.Animate.create(animation);
        this.runAction(animate); 
    },


    destroy:function (dt) {
        var p = this.getPosition();
        cc.log("destroy");  
    },

    jump:function () {
        var p = this.getPosition();
        var j = cc.JumpTo.create(0.1, p, this.desplazamiento, 1);
        this.runAction(j);
    },

    move:function (direction) {
        var p = this.getPosition();
        var movimiento = p.y;
        movimiento += this.desplazamiento * direction;
        var m = cc.MoveTo.create(0.1, cc.p(p.x, movimiento), 40, 1);
        this.runAction(m); 
    },

    hurt:function () {
        //Decrementar vida
    },

    collideRect:function (p) {
        var a = this.getContentSize();
        return cc.rect(p.x - a.width / 2, p.y - a.height / 4, a.width, a.height / 2+20);
    }
});

Beaver.create = function(arg){
    var beaver = new Beaver(arg);
    size = cc.Director.getInstance().getVisibleSize();

    return beaver;
};