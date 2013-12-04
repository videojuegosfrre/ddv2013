
cc.dumpConfig();

var AboutLayer = cc.Layer.extend({

    init:function () {
        var bRet = false;
        if (this._super()) {
           
            winSize = cc.Director.getInstance().getWinSize();
            var sp = cc.Sprite.create(s_menuhelp);
            sp.setAnchorPoint(cc.p(0,0));
			sp.setScale(winSize.height/sp.getContentSize().height);
            this.addChild(sp, 0, 1);
        
            var gameMenuNormal = cc.Sprite.create(s_menunormal);
            var gameMenuSelected = cc.Sprite.create(s_menuselected);
                            var gamemenu = cc.MenuItemSprite.create(gameMenuNormal, gameMenuSelected, this.onMenu , this);
           
            var menu = cc.Menu.create(gamemenu);
            menu.alignItemsVerticallyWithPadding(10);
            this.addChild(menu, 1, 2);
			menu.setScale(0.5);
            menu.setPosition(0, 80);

            if (BB.SOUND) {
                cc.AudioEngine.getInstance().setMusicVolume(0.7);
                cc.AudioEngine.getInstance().playMusic(s_mainMainMusic_mp3, true);
            }

            bRet = true;
        }
        return bRet;
    },

    onMenu:function (pSender) {
       
        var scene = cc.Scene.create();
        scene.addChild(SysMenu.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },



});

AboutLayer.create = function () {
    var sg = new AboutLayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

AboutLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = AboutLayer.create();
    scene.addChild(layer);
    return scene;
};
