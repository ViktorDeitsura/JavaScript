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
        var self = this;
        this.showSprites( GameData.sprites.background, this.group );

        var tileBackX = Consts.TILE_COORD_X;
        var tileBackY = Consts.TILE_COORD_Y;
        //add tiles backgrounds sprites
        for ( var j = 0; j < 4; j++ ) {
            for ( var i = 0; i < 4; i++ ) {
                var tileParams = GameData.sprites.tileBackgr;
                tileParams.x = tileBackX + Consts.DISTANCE_BETWEEN_TILES * i;
                tileParams.y = tileBackY + Consts.DISTANCE_BETWEEN_TILES * j;
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
            var x = tileBackX + Consts.DISTANCE_BETWEEN_TILES * tileIndex[1];
            var y = tileBackY + Consts.DISTANCE_BETWEEN_TILES * tileIndex[0];
            var tile = new Tile( this.tilesGroup, x, y, tileIndex )
            this.tilesOnField[tileIndex[0]][tileIndex[1]] = tile;
            this.tilesObj.push( tile );
        }

        this.group.buttonMode = true;
        this.group.interactive = true;
        this.group.on( "pointerdown", function(e){ self.onClickDown(e); } );
        this.group.on( "pointerup",   function(e){ self.onClickUp  (e); } );
        console.log(this.group);
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

    Game.prototype.onClickDown = function( _evt ) {
        console.log(this);
        this.eventClickX = Math.floor( _evt.data.global.x );
        this.eventClickY = Math.floor( _evt.data.global.y );
    };

    Game.prototype.onClickUp = function( _evt ) {
        var x = Math.floor( _evt.data.global.x );
        var y = Math.floor( _evt.data.global.y );
        var diffX = Math.abs( this.eventClickX - x );
        var diffY = Math.abs( this.eventClickY - y );

        if ( diffX > diffY && diffX > Consts.DISTANCE_BETWEEN_TILES/2 ) {
            if ( x > this.eventClickX ) {//moveRight
                this.makeStep( Consts.STEP_DIRECTION_RIGHT );
            } else {//moveLeft
                this.makeStep( Consts.STEP_DIRECTION_LEFT );
            }
        } else if ( diffY > diffX && diffY > Consts.DISTANCE_BETWEEN_TILES/2 ) {
            if ( y > this.eventClickY ) {//moveDown
                this.makeStep( Consts.STEP_DIRECTION_DOWN );
            } else {//moveUp
                this.makeStep( Consts.STEP_DIRECTION_UP );
            }
        }

    };

    Game.prototype.makeStep = function( _direction ) {
        if ( _direction == Consts.STEP_DIRECTION_LEFT ) {
            for ( var j = 0; j < this.tilesOnField.length; j++ ) {
                for ( var i = 0; i < this.tilesOnField[j].length; i++ ) {
                    var tile = this.tilesOnField[j][i];
                    if ( tile != null && i != 0 ) {
                        this.tileHandlerLeft( tile, this.tilesOnField[j], i );
                    }
                }
            }
        } else if ( _direction == Consts.STEP_DIRECTION_RIGHT ) {
            for ( var j = 0; j < this.tilesOnField.length; j++ ) {
                for ( var i = this.tilesOnField[j].length-1; i >= 0; i-- ) {
                    var tile = this.tilesOnField[j][i];
                    if ( tile != null && i != 3 ) {
                        this.tileHandlerRight( tile, this.tilesOnField[j], i );
                    }
                }
            }
        } else if ( _direction == Consts.STEP_DIRECTION_DOWN ) {

        } else if ( _direction == Consts.STEP_DIRECTION_UP ) {

        }
    };

    Game.prototype.tileHandlerLeft = function( _tile, _arr, _numpos ) {
        var x = 0;
        for ( var i = _numpos-1; i >= 0; i-- ) {
            if ( _arr[i] == null ) {
                x -= Consts.DISTANCE_BETWEEN_TILES;
                _arr[i] = _tile;
                _arr[i+1] = null;
            } else {
                if ( _tile.count == _arr[i].count ) {
                    _tile = this.mergeTiles( _arr[i] ,_tile );//new tile continues handling
                    x = 0;//reset value
                } else {
                    break;
                }
            }
        }
        x = _tile.x + x;
        _tile.move( x );
    };

    Game.prototype.tileHandlerRight = function( _tile, _arr, _numpos ) {
        var x = 0;
        for ( var i = _numpos+1; i < _arr.length; i++ ) {
            if ( _arr[i] == null ) {
                x += Consts.DISTANCE_BETWEEN_TILES;
                _arr[i] = _tile;
                _arr[i-1] = null;
            } else {
                if ( _tile.count == _arr[i].count ) {
                    _tile = this.mergeTiles( _arr[i], _tile );//new tile continues handling
                    x = 0;//reset value
                } else {
                    break;
                }
            }
        }
        x = _tile.x + x;
        _tile.move( x );
    };
