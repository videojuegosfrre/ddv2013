var BadAlienSprite = cc.Sprite.extend({
    director: null,
    wSizeWidth: null,
    wSizeHeight: null,
    frameCache: null,
    audioEngine: null,
    spriteDescription: null,
    _viradiumQuantity: 1,
    _currentDirection: null,

    ctor:function () {
        this._super();

        this.setAnchorPoint(cc_Point(0.5, 0.5));

        var cache = cc.SpriteFrameCache.getInstance();
        cache.addSpriteFrames(s_bad_alien_tipo_1_plist, s_bad_alien_tipo_1_img);

        this.director = cc.Director.getInstance();
        this.wSizeWidth = this.director.getWinSize().width;
        this.wSizeHeight = this.director.getWinSize().height;
        this.frameCache = cc.SpriteFrameCache.getInstance();
        this.audioEngine = cc.AudioEngine.getInstance();

        this.spriteDescription = "Bad Alien";

        this.initWithSpriteFrameName("bad_alien_1.png");

        var next_frame = this.frameCache.getSpriteFrame("bad_alien_1.png");

        this.setTextureRect(next_frame.getRect());
        this.setContentSize(next_frame.getRect().width,
                            next_frame.getRect().height);
        this.setDisplayFrame(next_frame);

        this.scheduleUpdate();
    },

    update:function () {
    }
});
