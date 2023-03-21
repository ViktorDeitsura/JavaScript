    var Game = function( _windowGame ) {
        var group = new PIXI.Container();//create new Container
        _windowGame.addChild( group );//Add container on stage
        group.zIndex = GameData.zIndex++;
        group.sortableChildren = true;

        this.group = group;

    };

    Game.prototype.init = function() {
        this.showSprites( GameData.sprites.background, this.group );

        var tileBackX = Consts.TILE_COORD_X;
        var tileBackY = Consts.TILE_COORD_Y;
        //add tiles backgrounds sprites
        for ( var j = 0; j < 4; j++ ) {
            for ( var i = 0; i < 4; i++ ) {
                var tileParams = GameData.sprites.tileBackgr;
                tileParams.x = tileBackX + 88 * i;
                tileParams.y = tileBackY + 88 * j;
                this.showSprites( tileParams, this.group );
            }
        }

    };

    Game.prototype.showSprites = function( _spriteParams, _container ) {//create textute sprite with the given parameters
        var texture = PIXI.Texture.from( _spriteParams.imagePath );
        var sprite = PIXI.Sprite.from( texture );

        sprite.zIndex = GameData.zIndex++;
        sprite.x = _spriteParams.x;
        sprite.y = _spriteParams.y;

        _container.addChild( sprite );
        return sprite;
    };
