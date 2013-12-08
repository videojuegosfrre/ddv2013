var gameHUDLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();

        this.setPosition(cc_Point(0, 0));

        this.setMouseEnabled(false);
        this.setKeyboardEnabled(false);
        this.setTouchEnabled(false);
    },

    update:function () {

    }
});
