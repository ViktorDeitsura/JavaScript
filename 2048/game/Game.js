    var Game = function( _windowGame ) {
        var group = new PIXI.Container();//create new Container
        _windowGame.addChild( group );//Add container on stage
        group.zIndex = GameData.zIndex++;
        group.sortableChildren = true;

        this.group = group;
        this.tilesOnField = [
                                [null, null, null, null],
                                [null, null, null, null],
                                [null, null, null, null],
                                [null, null, null, null]
                            ];
        this.tilesObj = [];
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

        var groupTiles = new PIXI.Container();//create new Container
        this.group.addChild( groupTiles );//Add container on stage
        groupTiles.zIndex = GameData.zIndex++;
        groupTiles.sortableChildren = true;
        this.tilesGroup = groupTiles;

        for ( var i = 0; i < 2; i++ ) {
            var tileIndex = this.spawnTileInRandomPlace();
            var x = tileBackX + 88 * tileIndex[1];
            var y = tileBackY + 88 * tileIndex[0];
            var tile = new Tile( this.tilesGroup, x, y, tileIndex )
            this.tilesOnField[tileIndex[0]][tileIndex[1]] = tileIndex;
            this.tilesObj.push( tile );
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

    Game.prototype.spawnTileInRandomPlace = function() {
        var freePlace = [];
        for ( var j = 0; j < 4; j++ ) {
            for ( var i = 0; i < 4; i++ ) {
                if ( this.tilesOnField[j][i] == null ) {
                    var pos = j+""+i;
                    freePlace.push(pos)
                }
            }
        }

        for ( var i = freePlace.length - 1; i > 0; i-- ) {
            var j = Math.floor( Math.random() * (i + 1)) ;
            var temp = freePlace[i];
            freePlace[i] = freePlace[j];
            freePlace[j] = temp;
        }

        var randomIndex = Math.floor( Math.random() * freePlace.length );

        return freePlace[randomIndex];
    };
