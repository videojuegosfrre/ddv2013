var LevelManager = cc.Class.extend({
    _currentLevel:null,
    _linesPositions:null,

    ctor:function(level){
        this._currentLevel = level;
        this._linesPositions = [];
        this.setLevel(this._currentLevel);

        BB.ACTIVE_OBJECTS = 0;
    },

    setLevel:function(level){
        for(var i = 0; i< level.objects.length; i++){
            this._currentLevel.objects[i].ShowTime = this._minuteToSecond(this._currentLevel.objects[i].ShowTime);
        }
        var topHeight = g_sharedGameLayer.spriteArriba.getContentSize().height;
        var botHeight = g_sharedGameLayer.spriteAbajo.getContentSize().height;
        var pHeight = g_sharedGameLayer.screenRect.height - topHeight - botHeight;
        var linesDistance = pHeight / (this._currentLevel.lines + 1);

        for (var i = 1; i <= this._currentLevel.lines ; i++){
            var pos = botHeight + linesDistance * i;
            this._linesPositions.push(pos);
        }
    },

    _minuteToSecond:function(minuteStr){
        if(!minuteStr)
            return 0;
        if(typeof(minuteStr) !=  "number"){
            var mins = minuteStr.split(':');
            if(mins.length == 1){
                return parseInt(mins[0],10);
            }else {
                return parseInt(mins[0],10 )* 60 + parseInt(mins[1],10);
            }
        }
        return minuteStr;
    },

    loadLevelResource:function(deltaTime){
        var bMax = false;
        if(BB.ACTIVE_OBJECTS >= this._currentLevel.objectMax){
            bMax = true;
        }
        //load objects
        for(var i = 0; i< this._currentLevel.objects.length; i++){
            var selObject = this._currentLevel.objects[i];
            if(selObject){
                if(deltaTime % selObject.ShowTime === 0){
                    if (selObject.ShowType == "Repeat" && !bMax){
                        for(var rIndex = 0; rIndex < this._currentLevel.lines; rIndex++ ){
                            this.addObjectToGameLayer(selObject.Types, rIndex);
                        }
                    }else{
                        if (selObject.ShowType == "Once" && bMax){
                            return;
                        }
                        var o = Math.trunc((Math.random() * 100) % this._linesPositions.length);
                        if (o == 0){
                            o += 1;
                        }
                        if (o == (this._linesPositions.length - 1)){
                            o -= 1;
                        }
                        this.addObjectToGameLayer(selObject.Types, o);

                        return;
                    }
                }
            }
        }
    },

    addObjectToGameLayer:function(oTypes, oLine){
        var i;
        if (oTypes[0] == BB.OBJECT_TYPE.LIFE || oTypes[0] == BB.OBJECT_TYPE.WOOD){
            i = 0;
        }else{
            i = Math.trunc((Math.random() * 100) % oTypes.length);
        }

        var addObject = Objeto.getOrCreateObjeto(ObjectType[oTypes[i]]);

        var tmpAction;
        var a0=0;
        var a1=0;

        var oSpeed = addObject.speed;
        var py = this._linesPositions[oLine];

        switch (addObject.moveType) {
            case BB.OBJECT_MOVE_TYPE.VERTICAL:

            case BB.OBJECT_MOVE_TYPE.HORIZONTAL:
                var pos, offset;
                var ancho = g_sharedGameLayer.screenRect.width;
                if (oLine % 2 == 0){
                    pos = cc.p(0, py);
                    offset = cc.p(ancho+40, py);
                }else{
                    pos = cc.p(ancho, py);
                    offset = cc.p(-40, py);
                }
                addObject.setPosition(pos);
                tmpAction = cc.MoveTo.create(oSpeed, offset);
                break;

            case BB.OBJECT_MOVE_TYPE.ZICZAC:

                addObject.setPosition(cc.p(40, py));

                var delay = cc.DelayTime.create(0.25);
                var array = [
                    cc.p(0,100),
                    cc.p(10,75),
                    cc.p(VisibleRect.rect().width / 4, VisibleRect.rect().height / 4),
                    cc.p(VisibleRect.rect().width / 6, VisibleRect.rect().height / 6),
                    cc.p(VisibleRect.rect().width / 2, VisibleRect.rect().height / 4),
                    cc.p(700, 200),
                    cc.p(900,50),
                    cc.p(975,1),
                    cc.p(1380, VisibleRect.rect().height / 8)
                ];
                tmpAction = cc.CardinalSplineBy.create(oSpeed, array, 0);
                break;
        }
        addObject.runAction(tmpAction);
    }
});
