    var Tile = function( _gameGroup, _x, _y, _pos ) {
        var group = new PIXI.Container();//create new Container
        _gameGroup.addChild( group );//Add container on stage
        group.zIndex = GameData.zIndex++;
        group.sortableChildren = true;
        this.group = group;

        this.count = Math.random() > 0.5 ? 2 : 4;
        this.group.self = this;

        this.init( _x, _y, _pos );
    };

    Tile.prototype.init = function( _x, _y, _pos ) {
        this.x = _x;
        this.y = _y;
        this.position = _pos;

        this.show();
    };

    Tile.prototype.show = function() {
        if ( this.sprite != null ) {
            this.destroy();
        }
        var spriteObj = GameData.sprites[this.name];
        this.sprite = Main.game.showSprites( spriteObj, this.group );
    };

    Tile.prototype.move = function( _x, _y, _pos ) {
        if ( _x == null ) {
            _x = this.x;
        }
        if ( _y == null ) {
            _y = this.y;
        }
        var onComplete = function() {

        };
        gsap.to( this.group, Consts.TILE_ANIMATION_SPEED, { x:_x, y:_y, onComplete:onComplete } );
    };

    Tile.prototype.destroy = function() {
        this.sprite.removeChildren();
        this.sprite.visible = false;
        this.sprite = null;
    };

    Object.defineProperty( Tile.prototype, "name", {
        get: function() {
            return "tile"+this.count;
        }
    });

    Object.defineProperty( Tile.prototype, "x", {
        get: function() { return this.group.x; },
        set: function( val ) {
            this.group.x = val;
        }
    });

    Object.defineProperty( Tile.prototype, "y", {
        get: function() { return this.group.y; },
        set: function( val ) {
            this.group.y = val;
        }
    });
