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

MAX_CONTAINT_WIDTH = 40;
MAX_CONTAINT_HEIGHT = 40;

var g_sharedGameLayer;

var MyLayer = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,
    castorcete:null,
    
    init:function () {

        //////////////////////////////
        // 1. super init first
        this._super();

        cc.SpriteFrameCache.getInstance().addSpriteFrames(s_sprites_plist);

        g_sharedGameLayer = this;

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
        this.sprite11 = cc.Sprite.create("silla1.png");
        this.sprite11.setAnchorPoint(cc.p(0.5, 0.5));
        this.sprite11.setPosition(cc.p(size.width / 2, size.height / 2));
        this.sprite11.setScale(0.5);
        this.addChild(this.sprite11);


         // add "Helloworld" splash screen"
        castorcete = Beaver.create(BeaverType[0]);
        this.addChild(castorcete);
    
   
         if ('keyboard' in sys.capabilities) {
            this.setKeyboardEnabled(true);
        }
        this.scheduleUpdate();
    },
    
    onKeyDown: function (e) {
        BB.KEYS[e] = true;
    },

    onKeyUp: function (e) {
        BB.KEYS[e] = false;
    },
    
    update: function() {
              
        
        /*for (var i in BB.KEYS) {
            if (BB.KEYS[i]) {
                cc.log("Presionado el botón"+i);
                                                                    
                if (i == 32){
                    castorcete.jump();
                } else {
                    if (i == 38) {
                        castorcete.move(1);
                    } else if (i == 40){
                        castorcete.move(-1);
                    }               
                } 
                BB.KEYS[i] = false;
            }
        }*/
    },

    checkIsCollide:function () {
        var selChild, beaverChild;
        // check collide
        var i = 0;
        for (i = 0; i < BB.CONTAINER.OBJECTS.length; i++) {
            selChild = BB.CONTAINER.OBJECTS[i];
            if (!selChild.active)
                continue;

                beaverChild = castorcete;
                if (beaverChild.active && this.collide(selChild, beaverChild)) {
                    beaverChild.hurt();
                    selChild.hurt();
                }
           }
    },

    collide:function (a, b) {
        var pos1 = a.getPosition();
        var pos2 = b.getPosition();
        if (Math.abs(pos1.x - pos2.x) > MAX_CONTAINT_WIDTH || Math.abs(pos1.y - pos2.y) > MAX_CONTAINT_HEIGHT)
            return false;

        var aRect = a.collideRect(pos1);
        var bRect = b.collideRect(pos2);
        return cc.rectIntersectsRect(aRect, bRect);
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
