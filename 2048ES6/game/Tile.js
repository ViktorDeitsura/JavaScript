    class Tile {
        constructor( _gameGroup, _x, _y, _pos ) {
            let group = new PIXI.Container();//create new Container
            _gameGroup.addChild( group );//Add container on stage
            group.zIndex = GameData.zIndex++;
            group.sortableChildren = true;
            this.group = group;

            this.count = Math.random() > 0.1 ? 2 : 4;
            this.group.self = this;

            this.init( _x, _y, _pos );
        }

        init( _x, _y, _pos ) {
            this.x = _x;
            this.y = _y;
            this.position = _pos;
            this.merge = false;//this property disables merged tiles

            this.show();
        }

        show() {
            if ( this.sprite != null ) {
                this.destroy();
            }
            let spriteObj = GameData.sprites[this.name];
            this.sprite = Main.game.showSprites( spriteObj, this.group );
        }

        move( _x, _y, _pos, _callback ) {
            Main.game.animation = true;
            if ( _x == null ) {
                _x = this.x;
            }
            if ( _y == null ) {
                _y = this.y;
            }
            let onComplete = () => {
                if ( _callback != null ) {
                    _callback();
                }
                if ( Main.game.spawnTileSys ) {
                    Main.game.spawnTileSys = false;
                    let tileIndex = Main.game.searchFreePlaceForTile();
                    Main.game.addTileToField( tileIndex );
                    Main.game.renewalObjectTiles();
                    Main.game.animation = false;
                }
            };
            gsap.to( this.group, Consts.TILE_ANIMATION_SPEED, { x:_x, y:_y, onComplete:onComplete } );
        }

        destroy() {
            if ( this.sprite != null ) {
                this.sprite.removeChildren();
                this.sprite.visible = false;
                this.sprite = null;
            }
        }

        get name() {
            return "tile"+this.count;
        }

        get x() {
            return this.group.x;
        }
        set x( value ) {
            this.group.x = value;
        }

        get y() {
            return this.group.y;
        }
        set y( value ) {
            this.group.y = value;
        }
    }
