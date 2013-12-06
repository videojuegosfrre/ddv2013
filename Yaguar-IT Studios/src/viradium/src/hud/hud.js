var gameHUDLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this.setPosition(cc_Point(0, 0));
        return true;
    }
});
