cc.dumpConfig();

var PauseLayer = cc.Layer.extend({
    
    ctor:function(){
        this._super();

        var winSize = cc.Director.getInstance().getWinSize();

		var layerGray = cc.LayerColor.create(cc.c4b(23, 23, 23, 200), winSize.width, winSize.height);
		layerGray.setAnchorPoint(cc.p(0, 0));
		layerGray.setPosition(cc.p(0, 0));
		this.addChild(layerGray);
		
		var spritePause = cc.Sprite.create(s_pausa);
        spritePause.setAnchorPoint(AnchorPointCenter);
		
		var px = g_sharedGameLayer.screenRect.width / 2;
		var py = g_sharedGameLayer.screenRect.height * 0.75;

        spritePause.setPosition(px, py);
		this.addChild(spritePause);
		
		var restartItem = cc.MenuItemImage.create(
            s_reanudarNormal,
            s_reanudarSelected,
             function () {
                 if (BB.SOUND) {
                     cc.AudioEngine.getInstance().playEffect(s_buttonClick);
                 }
				this.setVisible(false);
				g_sharedGameLayer._state = STATE_PLAYING;
			},this);
		
		var quitItem = cc.MenuItemImage.create(
            s_salirNormal,
            s_salirSelected,
             function () {
                 if (BB.SOUND) {
                     cc.AudioEngine.getInstance().playEffect(s_buttonClick);
                 }
				var scene = cc.Scene.create();
				scene.addChild(SysMenu.create());
				cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));				
			},this);
			
        var menuPause = cc.Menu.create(restartItem, quitItem);
        menuPause.alignItemsVerticallyWithPadding(40);
        this.addChild(menuPause);
        menuPause.setAnchorPoint(AnchorPointCenter);
        menuPause.setPosition(cc.p(size.width / 2, size.height / 2 - 60));
	}
});

