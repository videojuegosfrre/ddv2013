
cc.dumpConfig();



var MapLayer = cc.Layer.extend({

    init:function () {
        var bRet = false;
        if (this._super()) {
           
            var winSize = cc.Director.getInstance().getWinSize();
            var sp = cc.Sprite.create(s_menumap);
            sp.setAnchorPoint(AnchorPointTopLeft);
            sp.setPosition(0, winSize.height);
			sp.setScale(winSize.width/sp.getContentSize().width);
            this.addChild(sp, 0, 1);

            var levels = [];

            for (var i = 0; i < LevelsConfig.length; i++){
                var btn = new ButtonLevel(this, i);

                btn.setPosition(LevelsConfig[i].buttonPosition);
                levels.push(btn);

                if(BB.CURRENT_LEVEL >= LevelsConfig[i].level){
                    btn.setEnabled(true);
                }else{
                    btn.setEnabled(false);
                }
            };

            var menuLevel = cc.Menu.create(levels);
            menuLevel.setPosition(cc.p(0, 0));
            this.addChild(menuLevel, 1, 2);

            // add a "close" icon to exit the progress. it's an autorelease object
            var closeItem = cc.MenuItemImage.create(
                s_CloseNormal,
                s_CloseSelected,
                this.onMenu,this);
            closeItem.setAnchorPoint(cc.p(0.5, 0.5));

			var menu = cc.Menu.create(closeItem);
			menu.setPosition(cc.p(0, 0));
			this.addChild(menu, 1, 2);
            closeItem.setPosition(cc.p(winSize.width - 20, 20));

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
    }
});

MapLayer.create = function () {
    var sg = new MapLayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

MapLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = MapLayer.create();
    scene.addChild(layer);
    return scene;
};
