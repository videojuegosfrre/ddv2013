/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 ****************************************************************************/
var LG = {
    KEYS: [],
    JUSTPRESSED: []
};

var MyLayer = cc.Layer.extend({
    x:null,
    y:null,
    beaverImg:null,
    desplazamiento:null,
    size:null,
    lives:0,
	strench:null,
    speed:null,
    armor:null,

    ctor:function(){
        this._super();
        this.init();
    }
	
    init:function () {

        //////////////////////////////
        // 1. super init first
        this._super();
		x = 0;
		desplazamiento = 20;
		
        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        size = cc.Director.getInstance().getVisibleSize();

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = cc.MenuItemImage.create(
            s_CloseNormal,
            s_CloseSelected,
            function () {
                cc.log("close");
            },this);
        closeItem.setAnchorPoint(cc.p(0.5, 0.5));

        var menu = cc.Menu.create(closeItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);
        closeItem.setPosition(cc.p(size.width - 20, 20));

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        this.helloLabel = cc.LabelTTF.create("Hello World", "Impact", 38);
        // position the label on the center of the screen
        this.helloLabel.setPosition(cc.p(size.width / 2, size.height - 40));
        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);

        // add "Helloworld" splash screen"
        this.sprite = cc.Sprite.create(s_Fondo);
        this.sprite.setAnchorPoint(cc.p(0.5, 0.5));
        this.sprite.setPosition(cc.p(size.width / 2, size.height / 2));
        this.sprite.setScale(size.height/this.sprite.getContentSize().height);
        this.addChild(this.sprite);
		
		 // add "Helloworld" splash screen"
        castorcete = cc.Sprite.create(s_Castorcete);
        castorcete.setPosition(cc.p(size.width / 2, 0));
        castorcete.setAnchorPoint(cc.p(0.5, 0));
		castorcete.setScale(0.1);
        this.addChild(castorcete);
		
		// var jump = cc.JumpTo.create(0.5, cc.p(size.width / 2, 0), 10, 1);
		// castorcete.runAction(jump);
   
		 if ('keyboard' in sys.capabilities) {
            this.setKeyboardEnabled(true);
        }
		this.scheduleUpdate();
    },
	
	onKeyDown: function (e) {
        LG.KEYS[e] = true;
        LG.JUSTPRESSED[e] = true;
    },

    onKeyUp: function (e) {
        LG.KEYS[e] = false;
        LG.JUSTPRESSED[e] = false;
    },
	
	update: function() {
        for (var i in LG.KEYS) {
            if (LG.JUSTPRESSED[i]) {
                cc.log("Presionado el botón"+i);
				
				var movimiento = positionX;
													
				if (i == 32){
					var jump = cc.JumpTo.create(0.3, cc.p(size.width / 2, movimiento), 40, 1);
					castorcete.runAction(jump);
				} else {
					if (i == 38) {
						movimiento += desplazamiento;
					} else if (i == 40){
						movimiento -= desplazamiento;
					}
					var move = cc.MoveTo.create(0.5, cc.p(size.width / 2, movimiento), 40, 1);
					castorcete.runAction(move);					
				}
				positionX = movimiento;	
            }
            if (LG.KEYS[i] && LG.JUSTPRESSED[i]) {
                LG.JUSTPRESSED[i] = false;
            }
        }
    },
});

var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MyLayer();
        this.addChild(layer);
        layer.init();
    }
});
