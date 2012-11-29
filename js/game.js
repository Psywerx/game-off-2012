var game = {


	state : {
		PLAY : 0,
		PAUSE : 1,
		DEATH : 2,
		MENU : 3,
		HIGHSCORES_LIST: 4,
		HIGHSCORES_ADD : 5,
		RESTART : 6
	},
	menuState :{
	    SINGLEPLAYER : 0,
	    MULTIPLAYER : 1,
	    HIGHSCORES: 2,
	    ABOUT: 3
	},
	currentMenu : 0,
	init : function(){
		this.bg = Background();
		this.top = Top();
		this.highscores = Highscores();
		this.highscoresAdd = HighscoresAdd();
		this.player = Player(false);
		this.player.position[0] = 0;
		
		this.player2 = Player(true);
		this.player2.position[0] = 101;
		this.player2.position[2] = this.player.position[2] - 0.01;
		this.player2.disabled = true;
		this.objects = [];
		this.idleObjects = [];
		this.objectSpeed = 1.2;
		this.objectDelay = 1.600;
		this.timePlayed = 0;
		this.generatorCnt = 1.6;
		
		// Generate bonuses:
		for(var i=0, j=0; i < 17*2; [i++, j++]){
			var o = Object('B');
			var position = game.bg.size[0]-o.object.size[0] - j*o.object.size[0]*2;
			if(Math.abs(position) > game.bg.size[0]){
				j = 0;
				position = game.bg.size[0]-o.object.size[0];
			}
			o.position[0] = position;
			this.idleObjects.push(o);
		}
		
		// Generate obstacles:
		for(i=0, j=0; i < 7*20; [i++, j++]){
			o = Object('O');
			position = game.bg.size[0]-o.object.size[0] - j*(0.1+o.object.size[0]*2) ;
			if(Math.abs(position) > game.bg.size[0]){
				j = 0;
				position = game.bg.size[0]-o.object.size[0];
			}
			o.position[0] = position;
			this.idleObjects.push(o);
		}
		
		// Pause menu:
		this.pause = Pause();
		
		this.death = Death();
		
		this.menu = Menu();
		
		
		this.menuDirection = [0,0];
		this.smooth = [0,0];
		this.scoreBoard = Score();
		this.restart = Restart();
		this.score = 0;
		game.currentState = game.state.MENU;
		game.menuChanged();
		
	},
	generator : function(theta){
		this.generatorCnt += theta;
		if(this.generatorCnt < this.objectDelay/this.objectSpeed) return;
		this.generatorCnt = 0;
		for(var j=0; j<Math.log(this.timePlayed);j++){
			var i = Math.floor(Math.random() * game.idleObjects.length);
			var o = game.idleObjects[i];
			game.idleObjects.splice(i, 1); // get random element;
			o.velocity = [0, game.objectSpeed, 0];
			o.position[1] -= j*0.25;
			game.objects.push(o);
		}
	},
	keydown : function(event){
		switch (event.keyCode) {
		case KeyEvent.VK_DOWN:
		    if(game.currentState == game.state.MENU){
    		    game.menuDirection[0] = 1;
    		    game.currentMenu = (game.currentMenu+1)%4;
    		    game.menuChanged();
		    }
		    else if (game.currentState == game.state.RESTART){
		        game.restart.position += 1;
		        game.restart.position %= 2;
            }
		    break;
		case KeyEvent.VK_UP:
		    if(game.currentState == game.state.MENU){
	            
    		    game.menuDirection[1] = -1;
                game.currentMenu = (game.currentMenu-1)%4;
                game.currentMenu = game.currentMenu < 0 ? 3 : game.currentMenu;
                game.menuChanged();
		    }
		    else if (game.currentState == game.state.RESTART){
		        game.restart.position += 1;
                game.restart.position %= 2;
		    }
            break;
        case KeyEvent.VK_LEFT:
            game.player.direction[0] = 1;
            break;
        case KeyEvent.VK_RIGHT:
        	game.player.direction[1] = -1;
            break;
        case KeyEvent.VK_A:
            game.player2.direction[0] = 1;
            break;
        case KeyEvent.VK_D:
        	game.player2.direction[1] = -1;
            break;
		case KeyEvent.VK_SPACE:
		    if(game.currentState == game.state.PLAY){
		        //game.restart();
		        game.currentState = game.state.RESTART;
		    }
			break;
		}
	},
	keyup : function(event){
	    
	    event.preventDefault();
	    if(game.currentState == game.state.HIGHSCORES_ADD){
            // Add score with name...
            if(event.keyCode == KeyEvent.VK_RETURN){
                
                var scores = storage.get('scores');
                if(!(scores instanceof Array))
                    scores = [];
                scores.push([game.highscoresAdd.getName(), game.score]);
                storage.put('scores', scores);
                
                game.highscores.update();
                game.currentState = game.state.HIGHSCORES_LIST;
            }
            else{
                game.highscoresAdd.update(event.keyCode);
            }
            return;
            
        }
		switch (event.keyCode) {
		
		case KeyEvent.VK_RETURN:
		    if(game.currentState == game.state.MENU){
		        if(game.currentMenu == game.menuState.ABOUT)
		            window.location = "https://github.com/Psywerx/game-off-2012";
		        else if(game.currentMenu == game.menuState.HIGHSCORES){
		            game.currentState = game.state.HIGHSCORES_LIST;
		            game.highscores.update();
		            game.menu.size = [0,0,0];
		        }
		        else{
		            game.currentState = game.state.PLAY;
		            game.menu.size = [0,0,0];
		        }
		            
		    } else if(game.currentState == game.state.RESTART){
		        if(game.restart.position == 0){
		            game.init();
		        }
		        else{
		            game.currentState = game.state.PLAY;
		        }
		    }
		    else if(game.currentState == game.state.HIGHSCORES_LIST){
		        game.init();
		        game.highscores.size = [0,0,0];
		    }
		    break;
		case KeyEvent.VK_DOWN:
            game.menuDirection[0] = 0;
            
            break;
        case KeyEvent.VK_UP:
            game.menuDirection[1] = 0;
            
            break;
        case KeyEvent.VK_LEFT:
        	game.player.direction[0] = 0;
            break;
        case KeyEvent.VK_RIGHT:
        	game.player.direction[1] = 0;
            break;
        case KeyEvent.VK_A:
        	game.player2.direction[0] = 0;
            break;
        case KeyEvent.VK_D:
        	game.player2.direction[1] = 0;
            break;
        }
	},
	menuChanged : function(){
	    
	    if(game.currentState != game.state.MENU) return;
	    if(game.currentMenu == game.menuState.SINGLEPLAYER){
	        game.player.position[0] = 0;
	        game.player2.position[0] = 100;
	        game.player2.disabled = true;
	    }
	    else if(game.currentMenu == game.menuState.MULTIPLAYER){
	        game.player.position[0] = -1;
	        game.player2.position[0] = 1;
	        game.player2.disabled = false;
	    }
	},
	isHighScore: function(){
	    var scores = storage.get('scores');
	    if(!(scores instanceof Array))
	        scores = [];
	    
	    if(scores.length < 5){
	        return true;
	    }
	    
	    scores.sort(function(a,b){
	        return b[1] - a[1]; 
	    });
	    
	    for(var i = 0; i < 5; i++){
	        if(game.score > scores[i][1]){
	            return true;
	        }
	    }
	    return false;
	},
	die : function(){
	    
        //scores.push(['???', game.score]);
        //storage.put('scores', scores);
	    
	    if(game.isHighScore()){
	        game.currentState = game.state.HIGHSCORES_ADD;
	    }
	    else{
	        game.highscores.update();	    
	        game.currentState = game.state.HIGHSCORES_LIST;
	    }
	},
	areColliding : function(a, b){
		for (var i=1; i>=0; i--)
			if(a.position[i] + a.size[i]*a.collissionModifier < b.position[i] - b.size[i] * b.collissionModifier ||
			   a.position[i] - a.size[i]*a.collissionModifier >  b.position[i] + b.size[i] * b.collissionModifier)
				return false;
		return true;
		
	},
	tick : function(theta){
		
		// The left/right animation should be present always:
		this.smooth[0] = 0.8*this.smooth[0] + 0.2*(game.player.direction[0] + game.player.direction[1]);
		this.smooth[1] = 0.8*this.smooth[1] + 0.2*(game.menuDirection[0] + game.menuDirection[1]);
		
		switch(game.currentState){
		case game.state.PAUSE:
			break;
		case game.state.RESTART:
		    game.restart.size[0] = 0.9*game.restart.size[0] + 0.1*0.9; 
		    game.restart.tick(theta);
            break;
		case game.state.PLAY:
			this.generator(theta);
			this.timePlayed += theta;
			game.objectSpeed = Math.min(2.15,game.objectSpeed + this.timePlayed*0.000005);
			this.bg.tick(theta);
			

			
			this.player.tick(theta);
			this.player2.tick(theta);
			
			for(var i=0; i < this.objects.length; i++){
			    this.objects[i].tick(theta);
			}
			this.scoreBoard.tick(theta);

			if(game.currentMenu == game.menuState.SINGLEPLAYER)
			    return;
			
			
			break;
		case game.state.MENU:
		    game.menu.size[0] = 0.9*game.menu.size[0] + 0.1*0.75; 
		    this.menu.tick(theta);
			break;
		case game.state.HIGHSCORES_LIST:
		    
		    
		    game.highscores.size[0] = 0.9*game.highscores.size[0] + 0.1*0.9; 
		    game.highscores.tick(theta);
			break;
			
        case game.state.HIGHSCORES_ADD:
            game.highscoresAdd.size[0] = 0.9*game.highscoresAdd.size[0] + 0.1*0.9; 
            game.highscoresAdd.tick(theta);
            break;
		}
	},
	draw : function(gl){
		var program = Main.program; // Local pointer to shader program
		
		gl.enable(gl.DEPTH_TEST);
        gl.clearColor(1, 1, 1, 1);
        gl.clear(gl.STENCIL_BUFFER_BIT | gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(program);
        gl.uniform1i(program.sampler_location, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, Main.texture);
        
        var ratio = Main.WIDTH / Main.HEIGHT;
        var model_projection = mat4.lookAt([0,0,-3], [0,0,0], [0,1,0]);
        var model_view_projection = mat4.frustum(-ratio, ratio, -1, 1, 2, 6);
        if(game.currentMenu == game.menuState.SINGLEPLAYER)
            model_projection = mat4.rotate(model_projection, this.smooth[0]*-0.1, [0,1,0]);
        if(game.currentState == game.state.MENU)
            model_projection = mat4.rotate(model_projection, this.smooth[1]*-0.1, [1,0,0]);
        var projection = mat4.multiply(model_view_projection, model_projection);
        
        gl.uniformMatrix4fv(program.projectionMatrix_location, false, projection);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        
        
        
        this.bg.draw(gl);
        this.objects.sort(function(a,b){
        	return b.position[2] - a.position[2]; 
        });
        for(var i=0; i < this.objects.length; i++){
        	this.objects[i].draw(gl);
        }
        this.top.draw(gl);
        this.scoreBoard.draw(gl);
        this.player.draw(gl);
        this.player2.draw(gl);
        switch(game.currentState){
        case(game.state.DEATH):
            this.death.draw(gl);
            break;
        case(game.state.PAUSE):
            this.pause.draw(gl);
            break;
        case(game.state.HIGHSCORES_ADD):
            this.highscoresAdd.draw(gl);
            break;
        case(game.state.HIGHSCORES_LIST):
            this.highscores.draw(gl);
            break;
        case(game.state.MENU):
            this.menu.draw(gl);
            break;
        case(game.state.RESTART):
            this.restart.draw(gl);
            break;
        }
            
        
    }
};
