var game = {


	state : {
		PLAY : 0,
		PAUSE : 1,
		DEATH : 2,
		MENU : 3,
		HIGHSCORES_LIST: 4
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
		this.highscores = Highscores();
		this.player = Player();
		this.player.position[0] = 0;
		
		this.player2 = Player();
		this.player2.position[0] = 101;
		this.player2.position[2] = this.player.position[2] - 0.01;
		this.player2.disabled = true;
		this.objects = [];
		this.idleObjects = [];
		this.objectSpeed = 0.8;
		this.objectDelay = 1.600;
		this.timePlayed = 0;
		this.generatorCnt = 0;
		
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
		for(var i=0, j=0; i < 7*20; [i++, j++]){
			var o = Object('O');
			var position = game.bg.size[0]-o.object.size[0] - j*(0.1+o.object.size[0]*2) ;
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
			o.position[1] += j*0.25;
			game.objects.push(o);
		}
	},
	keydown : function(event){
		switch (event.keyCode) {
		case KeyEvent.VK_DOWN:
		    game.menuDirection[0] = 1;
		    game.currentMenu = (game.currentMenu+1)%4;
		    game.menuChanged();
		    break;
		case KeyEvent.VK_UP:
            game.menuDirection[1] = -1;
            game.currentMenu = (game.currentMenu-1)%4;
            game.currentMenu = game.currentMenu < 0 ? 3 : game.currentMenu;
            game.menuChanged();
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
			game.restart();
			break;
		}
	},
	keyup : function(event){
		switch (event.keyCode) {
		case KeyEvent.VK_RETURN:
		    if(game.currentState == game.state.MENU){
		        if(game.currentMenu == game.menuState.ABOUT)
		            window.location = "https://github.com/Psywerx/game-off-2012";
		        else if(game.currentMenu == game.menuState.HIGHSCORES){
		            game.currentState = game.state.HIGHSCORES_LIST;
		            game.menu.size = [0,0,0];
		        }
		        else{
		            game.currentState = game.state.PLAY;
		            game.menu.size = [0,0,0];
		        }
		            
		    }
		    else if(game.currentState == game.state.HIGHSCORES_LIST){
		        game.restart();
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
	die : function(){
		game.currentState = game.state.HIGHSCORES_LIST;
	},
	restart : function(){
		this.init();
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
		case game.state.PLAY:
			this.generator(theta);
			this.timePlayed += theta;
			game.objectSpeed = Math.min(1.5, game.objectSpeed + this.timePlayed*0.000005);
			this.bg.tick(theta);
			
			var prevPosition = game.player.position.slice();

			this.player.tick(theta);
			
			for(var i=0; i < this.objects.length; i++){
			    this.objects[i].tick(theta);
			}
			this.scoreBoard.tick(theta);

			if(game.currentMenu == game.menuState.SINGLEPLAYER)
			    return
			
			this.player2.tick(theta);
			var prevPosition2 = game.player2.position.slice();
			
			if(game.player.alpha == 1 && game.player2.alpha == 1 && ( 
			   game.areColliding(game.player, game.player2) ||
			   (game.player.fork && game.areColliding(game.player.forkObject, game.player2)) ||
			   (game.player2.fork && game.areColliding(game.player, game.player2.forkObject)))){
			    if(game.player.position[0] < game.player2.position[0]){
			        if(game.player.direction[0] != 0){
			            game.player.setPosition(prevPosition);
			            game.player.speed = [0,0,0];
			            game.player.direction = [0,0];
			        }
			        if(game.player2.direction[1] != 0){
			                game.player2.direction = [0,0];
			                game.player2.setPosition(prevPosition2);
			                game.player2.speed = [0,0,0];
                    }
			    }
			    if(game.player.position[0] > game.player2.position[0]){
                    if(game.player.direction[1] != 0){
                        game.player.setPosition(prevPosition);
                        game.player.speed = [0,0,0];
                        game.player.direction = [0,0];
                    }
                    if(game.player2.direction[0] != 0){
                        game.player2.setPosition(prevPosition2);
                        game.player2.speed = [0,0,0];
                        game.player2.direction = [0,0];
                    }
                }
			}
			
			break;
		case game.state.MENU:
		    game.menu.size[0] = 0.9*game.menu.size[0] + 0.1*0.75; 
		    this.menu.tick(theta);
			break;
		case game.state.HIGHSCORES_LIST:
		    game.highscores.size[0] = 0.9*game.highscores.size[0] + 0.1*0.9; 
		    game.highscores.tick(theta);
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
        
        
        
        this.objects.sort(function(a,b){
        	return b.position[2] - a.position[2]; 
        });
        for(var i=0; i < this.objects.length; i++){
        	this.objects[i].draw(gl);
        }
        this.player.draw(gl);
        this.player2.draw(gl);
        this.bg.draw(gl);
        this.scoreBoard.draw(gl);
        
        switch(game.currentState){
        case(game.state.DEATH):
            this.death.draw(gl);
            break;
        case(game.state.PAUSE):
            this.pause.draw(gl);
            break;
        case(game.state.HIGHSCORES_LIST):
            this.highscores.draw(gl);
            break;
        case(game.state.MENU):
            this.menu.draw(gl);
            break;
        }
        
    },
};
