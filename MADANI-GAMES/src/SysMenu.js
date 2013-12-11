
cc.dumpConfig();

var SysMenu = cc.Layer.extend({

    init:function () {
        var bRet = false;
        if (this._super()) {
          
			winSize = cc.Director.getInstance().getWinSize();
            var sp = cc.Sprite.create(s_menuprincipal);
            sp.setAnchorPoint(cc.p(0,0));
			sp.setScale(winSize.height/sp.getContentSize().height);
            this.addChild(sp, 0, 1);

            var newGameNormal = cc.Sprite.create(s_gamenormal);
            var newGameSelected = cc.Sprite.create(s_gameselected);
            
            var gamehelpNormal = cc.Sprite.create(s_helpnormal);
            var gamehelpSelected = cc.Sprite.create(s_helpselected);
            
            var closegamenormal=cc.Sprite.create(s_creditonormal);
            var closegameselected = cc.Sprite.create(s_creditoselected);
        
            var newGame = cc.MenuItemSprite.create(newGameNormal, newGameSelected, this.onNewGame , this);
            var gameHelp = cc.MenuItemSprite.create(gamehelpNormal, gamehelpSelected, this.onHelp , this);

            var about = cc.MenuItemSprite.create(closegamenormal, closegameselected, this.onAbout, this);

            var menu = cc.Menu.create(newGame, gameHelp, about);
            menu.alignItemsVerticallyWithPadding(10);
            this.addChild(menu, 1, 2);
            menu.setAnchorPoint(AnchorPointCenter);
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
    onNewGame:function (pSender) {
        if (BB.SOUND) {
            cc.AudioEngine.getInstance().playEffect(s_buttonClick);
        }
        var scene = cc.Scene.create();
        scene.addChild(MapLayer.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
	},

    onHelp:function (pSender) {
        if (BB.SOUND) {
            cc.AudioEngine.getInstance().playEffect(s_buttonClick);
        }
        var scene = cc.Scene.create();
        scene.addChild(HelpLayer.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },
    onAbout:function (pSender) {
        if (BB.SOUND) {
            cc.AudioEngine.getInstance().playEffect(s_buttonClick);
        }
        var scene = cc.Scene.create();
        scene.addChild(AboutLayer.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },
	

});

SysMenu.create = function () {
    var sg = new SysMenu();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

SysMenu.scene = function () {
    var scene = cc.Scene.create();
    var layer = SysMenu.create();
    scene.addChild(layer);
    return scene;
};
