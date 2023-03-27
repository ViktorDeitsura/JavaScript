    class Game {
        constructor( _windowGameGroup ) {
            let group = new PIXI.Container();//create new Container
            _windowGameGroup.addChild( group );//Add container on stage
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
            this.spawnTileSys = false;
            this.animation = false;
            this.countScore = 0;
        }

        init() {
            let self = this;
            this.showSprites( GameData.sprites.background, this.group );

            let tileBackX = Consts.TILE_COORD_X;
            let tileBackY = Consts.TILE_COORD_Y;
            //add tiles backgrounds sprites
            for ( let j = 0; j < 4; j++ ) {
                for ( let i = 0; i < 4; i++ ) {
                    let tileParams = GameData.sprites.tileBackgr;
                    tileParams.x = tileBackX + Consts.DISTANCE_BETWEEN_TILES * i;
                    tileParams.y = tileBackY + Consts.DISTANCE_BETWEEN_TILES * j;
                    this.showSprites( tileParams, this.group );
                }
            }

            let groupTiles = new PIXI.Container();//create new Container
            this.group.addChild( groupTiles );//Add container on stage
            groupTiles.zIndex = GameData.zIndex++;
            groupTiles.sortableChildren = true;
            this.tilesGroup = groupTiles;

            for ( let i = 0; i < 2; i++ ) {
                let tileIndex = this.searchFreePlaceForTile();
                this.addTileToField( tileIndex );
            }

            this.group.buttonMode = true;
            this.group.interactive = true;
            this.group.on( "pointerdown", (e) => { self.onClickDown(e); } );
            this.group.on( "pointerup",   (e) => { self.onClickUp  (e); } );
        }

        showSprites( _spriteParams, _container ) {//create textute sprite with the given parameters
            let texture = PIXI.Texture.from( _spriteParams.imagePath );
            let sprite = PIXI.Sprite.from( texture );

            sprite.zIndex = GameData.zIndex++;
            sprite.x = _spriteParams.x;
            sprite.y = _spriteParams.y;

            _container.addChild( sprite );
            return sprite;
        }

        searchFreePlaceForTile() {
            let freePlace = [];
            for ( let j = 0; j < 4; j++ ) {
                for ( let i = 0; i < 4; i++ ) {
                    if ( this.tilesOnField[j][i] == null ) {
                        let pos = j+""+i;
                        freePlace.push(pos)
                    }
                }
            }

            for ( let i = freePlace.length - 1; i > 0; i-- ) {
                let j = Math.floor( Math.random() * (i + 1)) ;
                let temp = freePlace[i];
                freePlace[i] = freePlace[j];
                freePlace[j] = temp;
            }

            let randomIndex = Math.floor( Math.random() * freePlace.length );

            return freePlace[randomIndex];
        }

        addTileToField( _tileIndex ) {
            let x = Consts.TILE_COORD_X + Consts.DISTANCE_BETWEEN_TILES * _tileIndex[1];
            let y = Consts.TILE_COORD_Y + Consts.DISTANCE_BETWEEN_TILES * _tileIndex[0];
            let tile = new Tile( this.tilesGroup, x, y, _tileIndex )
            this.tilesOnField[_tileIndex[0]][_tileIndex[1]] = tile;
            this.tilesObj.push( tile );
            this.checkGameOver();
        }

        onClickDown( _evt ) {
            if ( this.animation ) {
                return;
            }
            this.eventClickX = Math.floor( _evt.data.global.x );
            this.eventClickY = Math.floor( _evt.data.global.y );
        }

        onClickUp( _evt ) {
            if ( this.animation ) {
                return;
            }
            let x = Math.floor( _evt.data.global.x );
            let y = Math.floor( _evt.data.global.y );
            let diffX = Math.abs( this.eventClickX - x );
            let diffY = Math.abs( this.eventClickY - y );

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

        }

        makeStep( _direction ) {
            for ( let j = 0; j < this.tilesOnField.length; j++ ) {
                if ( _direction == Consts.STEP_DIRECTION_LEFT ) {
                    for ( let i = 0; i < this.tilesOnField[j].length; i++ ) {
                        let tile = this.tilesOnField[j][i];
                        if ( tile != null && i != 0 ) {
                            this.tileHandlerLeft( tile, this.tilesOnField[j], i );
                        }
                    }
                } else if ( _direction == Consts.STEP_DIRECTION_RIGHT ) {
                    for ( let i = this.tilesOnField[j].length-1; i >= 0; i-- ) {
                        let tile = this.tilesOnField[j][i];
                        if ( tile != null && i != 3 ) {
                            this.tileHandlerRight( tile, this.tilesOnField[j], i );
                        }
                    }
                } else if ( _direction == Consts.STEP_DIRECTION_DOWN ) {
                    for ( let i = this.tilesOnField.length-1; i >= 0; i-- ) {
                        let tile = this.tilesOnField[i][j];
                        if ( tile != null && i != 3 ) {
                            this.tileHandlerDown( tile, this.tilesOnField, i, j );
                        }
                    }
                } else if ( _direction == Consts.STEP_DIRECTION_UP ) {
                    for ( let i = 0; i < this.tilesOnField.length; i++ ) {
                        let tile = this.tilesOnField[i][j];
                        if ( tile != null && i != 0 ) {
                            this.tileHandlerUp( tile, this.tilesOnField, i, j );
                        }
                    }
                }
            }

        }

        tileHandlerLeft( _tile, _arr, _numpos ) {
            this.spawnTileSys = true;
            let moveTo = true;
            let x = 0;
            for ( let i = _numpos-1; i >= 0; i-- ) {
                if ( _arr[i] == null ) {
                    x -= Consts.DISTANCE_BETWEEN_TILES;
                    _arr[i] = _tile;
                    _arr[i+1] = null;
                } else {
                    if ( _tile.count == _arr[i].count && !_tile.merge && !_arr[i].merge ) {
                        x -= Consts.DISTANCE_BETWEEN_TILES;
                        _tile = this.mergeTiles( _arr[i], _tile, x, null );//new tile continues handling
                        _arr[i] = _tile;
                        _arr[i+1] = null;
                        x = 0;//reset value
                        moveTo = true;
                    } else {
                        break;
                    }
                }
            }
            if ( moveTo && x != 0 ) {
                x = _tile.x + x;
                _tile.move( x );
            }
        }

        tileHandlerRight( _tile, _arr, _numpos ) {
            this.spawnTileSys = true;
            let moveTo = true;
            let x = 0;
            for ( let i = _numpos+1; i < _arr.length; i++ ) {
                if ( _arr[i] == null ) {
                    x += Consts.DISTANCE_BETWEEN_TILES;
                    _arr[i] = _tile;
                    _arr[i-1] = null;
                } else {
                    if ( _tile.count == _arr[i].count && !_tile.merge && !_arr[i].merge ) {
                        x += Consts.DISTANCE_BETWEEN_TILES;
                        _tile = this.mergeTiles( _arr[i], _tile, x, null );//new tile continues handling
                        _arr[i] = _tile;
                        _arr[i-1] = null;
                        x = 0;//reset value
                        moveTo = false;
                    } else {
                        break;
                    }
                }
            }
            if ( moveTo && x != 0 ) {
                x = _tile.x + x;
                _tile.move( x );
            }
        }

        tileHandlerDown( _tile, _arr, _numpos, _columnNum ) {
            this.spawnTileSys = true;
            let moveTo = true;
            let y = 0;
            for ( let i = _numpos+1; i < _arr.length; i++ ) {
                if ( _arr[i][_columnNum] == null ) {
                    y += Consts.DISTANCE_BETWEEN_TILES;
                    _arr[i][_columnNum] = _tile;
                    _arr[i-1][_columnNum] = null;
                } else {
                    if ( _tile.count == _arr[i][_columnNum].count && !_tile.merge && !_arr[i][_columnNum].merge ) {
                        y += Consts.DISTANCE_BETWEEN_TILES;
                        _tile = this.mergeTiles( _arr[i][_columnNum] ,_tile, null, y );//new tile continues handling
                        _arr[i][_columnNum] = _tile;
                        _arr[i-1][_columnNum] = null;
                        y = 0;//reset value
                        moveTo = false;
                    } else {
                        break;
                    }
                }
            }
            if ( moveTo && y != 0 ) {
                y = _tile.y + y;
                _tile.move( null, y );
            }
        }

        tileHandlerUp( _tile, _arr, _numpos, _columnNum ) {
            this.spawnTileSys = true;
            let moveTo = true;
            let y = 0;
            for ( let i = _numpos-1; i >= 0; i-- ) {
                if ( _arr[i][_columnNum] == null ) {
                    y -= Consts.DISTANCE_BETWEEN_TILES;
                    _arr[i][_columnNum] = _tile;
                    _arr[i+1][_columnNum] = null;
                } else {
                    if ( _tile.count == _arr[i][_columnNum].count && !_tile.merge && !_arr[i][_columnNum].merge ) {
                        y -= Consts.DISTANCE_BETWEEN_TILES;
                        _tile = this.mergeTiles( _arr[i][_columnNum] ,_tile, null, y );//new tile continues handling
                        _arr[i][_columnNum] = _tile;
                        _arr[i+1][_columnNum] = null;
                        y = 0;//reset value
                        moveTo = false;
                    } else {
                        break;
                    }
                }
            }
            if ( moveTo && y != 0 ) {
                y = _tile.y + y;
                _tile.move( null, y );
            }
        }

        mergeTiles( _absorbe, _infuse, _x, _y ) {
            _absorbe.merge = true;
            _infuse.merge = true;
            _absorbe.count = _infuse.count + _absorbe.count;//write new count in tile

            let onMoveComplete = () => {//destroy old tile and show new tile
                _infuse.destroy();//destroy tile sprite
                _absorbe.show();//update tile sprite
            };
            _infuse.count = null;
            _infuse.position = null;
            _y = _infuse.y + _y;
            _x = _infuse.x + _x;
            _infuse.move( _x, _y, null, onMoveComplete );
            this.countScore += _absorbe.count;//adds the value of the tiles to the score
            return _absorbe;
        }

        renewalObjectTiles() {
            for ( let i = 0; i < this.tilesObj.length; i++ ) {
                if ( this.tilesObj[i].sprite == null && this.tilesObj[i].count == null ) {
                    this.tilesObj.splice( i, 1 );
                    i--;
                } else if ( this.tilesObj[i].merge ) {
                    this.tilesObj[i].merge = false;
                    if ( this.tilesObj[i].count == Consts.WIN_COUNT_NUMBER ) {
                        window.alert("Уровень пройден");
                        this.startNewGame();
                        break;
                    }
                }
            }
        }

        checkGameOver() {
            let gameOver = true;
            for ( let j = 0; j < this.tilesOnField.length; j++ ) {
                if ( !gameOver ) {
                    break;
                }
                for ( let i = 0; i < this.tilesOnField.length; i++ ) {
                    if ( this.tilesOnField[j][i] == null ) {
                        gameOver = false
                        break;
                    }
                    if ( i < 3 && this.tilesOnField[j][i] != null && this.tilesOnField[j][i+1] != null
                        && this.tilesOnField[j][i].count == this.tilesOnField[j][i+1].count ) {
                        gameOver = false
                        break;
                    }
                }
            }

            if ( gameOver ) {
                for ( let j = 0; j < this.tilesOnField.length; j++ ) {
                    if ( !gameOver ) {
                        break;
                    }
                    for ( let i = 0; i < this.tilesOnField.length; i++ ) {
                        if ( i < 3 && this.tilesOnField[i][j] != null && this.tilesOnField[i+1][j] != null
                            && this.tilesOnField[i][j].count == this.tilesOnField[i+1][j].count ) {
                            gameOver = false
                            break;
                        }
                    }
                }
            }

            if ( gameOver ) {
                window.alert("Нельзя сделать ход");
                this.startNewGame();
            }
        }

        startNewGame() {
            this.group.removeChildren();
            this.tilesOnField = [
                                    [null, null, null, null],
                                    [null, null, null, null],
                                    [null, null, null, null],
                                    [null, null, null, null]
                                ];
            this.tilesObj = [];
            this.spawnTileSys = false;
            this.animation = false;
            this.countScore = 0;

            this.init();
        }

        get countScore() {
            return Main.scorePanel.countScore;
        }
        set countScore( value ) {
            Main.scorePanel.countScore = value;
        }

    }
