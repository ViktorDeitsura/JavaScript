    class ScorePanel {
        constructor( _windowGameGroup ) {
            const group = new PIXI.Container();//create new Container
            _windowGameGroup.addChild( group );//Add container on stage
            group.zIndex = GameData.zIndex++;
            group.sortableChildren = true;

            this.showSprites( GameData.sprites.countBackgr, group );
            this.scoreSprites = [];

            const textNumGroup = new PIXI.Container();//create new Container
            group.addChild( textNumGroup );//Add container on stage
            textNumGroup.zIndex = GameData.zIndex++;
            textNumGroup.sortableChildren = true;
            this.textNumGroup = textNumGroup;
        }

        showSprites( _spriteParams, _container ) {//create textute sprite with the given parameters
            let texture = PIXI.Texture.from( _spriteParams.imagePath );
            let sprite = PIXI.Sprite.from( texture );

            sprite.zIndex = GameData.zIndex++;
            sprite.x = _spriteParams.x;
            sprite.y = _spriteParams.y;

            _container.addChild( sprite );
            return sprite;
        };

        get countScore() {
            return this._countScore;
        };

        set countScore( value ) {
            this._countScore = value;
            let oldTextNum = this.scoreSprites;

            this.scoreSprites = this.addSpriteToScore( value );

            if ( oldTextNum.length > 0 ) {
                this.destroySpriteToScore( oldTextNum );
            }
        };


        addSpriteToScore( _val ) {//create sprites for score
            let valString = _val+"";
            let arrForImage = [];

            let shiftX = 18;
            for ( let i = 0; i < valString.length; i++ ) {
                let num = valString[i];
                let sprite = this.showSprites( GameData.fontSprites[num], this.textNumGroup );
                sprite.x = sprite.x + shiftX * i;
                arrForImage.push( sprite );
            }

            return arrForImage;
        };

        destroySpriteToScore( _spritesArr ) {//destroy count number sprite
            for ( let i = 0; i < _spritesArr.length; i++ ) {
                _spritesArr[i].removeChildren();
                _spritesArr[i].visible = false;
            }
        };
    }
