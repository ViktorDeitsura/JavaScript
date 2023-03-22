    var Tile = function( _gameGroup, _x, _y, _pos ) {
        var group = new PIXI.Container();//create new Container
        _gameGroup.addChild( group );//Add container on stage
        group.zIndex = GameData.zIndex++;
        group.sortableChildren = true;
        this.group = group;

        this.count = Math.random() > 0.5 ? 2 : 4;
        this.group.self = this;

        this.init( _x, _y );
    };

    Tile.prototype.init = function ( _x, _y, _pos ) {
        this.x = _x;
        this.y = _y;
        this.position = _pos;

        this.show();
    };

    Tile.prototype.show = function () {

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