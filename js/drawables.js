Object = function(){
	var object = new Square();
	object.color = [1,0,0,1];
	object.size  = [0.1,0.1,0];
	object.position = [Math.random()*game.bg.size[0]*2-game.bg.size[0], -1*game.bg.size[1], Math.random()/100];
	
	return {
		velocity : [0,Math.random(),0],
		tick : function(theta){
			object.position[1] += theta * this.velocity[1];
			if(object.position[1] > game.bg.size[1])
				object.position[1] = -1*game.bg.size[1];
			
			if(object.position[1] + object.size[1] > game.player.position[1] - game.player.size[1] &&
					object.position[1] - object.size[1] < game.player.position[1] + game .player.size[1]){
				
				if(object.position[0] + object.size[0] > game.player.position[0] - game.player.size[0] &&
						object.position[0] - object.size[0] < game.player.position[0] + game .player.size[0]){
					object.color = [0,0,1,1];
					
				}
				else{
					object.color = [0,1,1,1];
				}
			}
			else{
				object.color = [1,0,0,1];
			}
		},
		draw : function(gl){
			object.draw(gl);
		}
	};
};

Player = function(){
	var player = new Square();
	player.color = [1,1,0,1];
	player.size  = [0.1, 0.1, 1];
	return {
		speed : [0,0,0],
		direction : [0,0,0],
		position : player.position,
		size : player.size,
		tick : function(theta){
			this.speed[0] += theta*2;
			this.speed[1] += theta*2;
			if(this.direction[0] == 0) this.speed[0] = 0;
			if(this.direction[1] == 0) this.speed[1] = 0;
			if(this.direction[0] != 0 && this.direction[1] != 0){
				this.speed[0] = 0;
				this.speed[1] = 0;
			}
			player.position[0] += (this.direction[0] + this.direction[1]) * theta * 2 * (this.speed[0]+this.speed[1]);
			//player.rotateAngle = this.direction[0]*0.0001;
			if (player.position[0] < -1*(game.bg.size[0]-player.size[0])) {
	            player.position[0] = -1*(game.bg.size[0]-player.size[0]);
	            this.speed[0] = 0;
	        }
	        if (player.position[0] > (game.bg.size[0]-player.size[0])) {
	            player.position[0] = (game.bg.size[0]-player.size[0]);
	            this.speed[0] = 0;
	        }
	        this.position = player.position;
	        player.size = this.size;
			
		},
		draw : function(gl){
			player.draw(gl);
		}
	};
};

Background = function(){
	
	var bg = new Square();
	bg.size = [1.72, 1.40, 1];
	bg.color = [0.2, 0.2, 0.2, 1.0];
	bg.position = [0,0,0.01];
	
	return{
		size : bg.size,
		tick : function(theta){
			bg.size = this.size;
		},
		draw : function(gl){
			bg.draw(gl);
		}
	};
};

Square = function(){
	
	var program = Main.program;
	var modelMatrix = mat4.identity();
	var vertices = [1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0];
	var vertBuffer =  gl.createBuffer();
	var colorBuffer = gl.createBuffer();
	var texBuffer = gl.createBuffer();
	var arrayVertices = new Float32Array(vertices);
	
	return{
		
		size     : [1,1,1],
		position : [0.0, 0.4, 0],
		velocity : [0, 0, 0],
		color    : [0, 0, 0, 1],
		char     : ' ',
		isText   : false,
		rotateAngle : 0,
		rotateAxis  : [0, 1, 0],
		
		draw: function(gl){
			
			
			
			modelMatrix = mat4.translate(mat4.identity(), this.position);
			modelMatrix = mat4.rotate(modelMatrix, Math.PI, [0, 1, 0]);
			modelMatrix = mat4.rotate(modelMatrix, this.rotateAngle, this.rotateAxis);
	        gl.uniformMatrix4fv(program.modelMatrix_location, false, modelMatrix);
	        vertices = [1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0];
	        vertices = _.map(vertices, function(num,i){return num * this.size[i%3];}, this);
	        gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
	        gl.enableVertexAttribArray(program.positionLoc);
	        arrayVertices.set(vertices);
	        gl.bufferData(gl.ARRAY_BUFFER, arrayVertices, gl.STATIC_DRAW);
	        gl.vertexAttribPointer(program.positionLoc, 3, gl.FLOAT, false, 0, 0);
	        var colors = _.flatten([this.color, this.color, this.color, this.color]);
	        gl.enableVertexAttribArray(program.colorLoc);
	        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	        gl.vertexAttribPointer(program.colorLoc, 4, gl.FLOAT, false, 0, 0);
	        
	        var charIndex = this.char.charCodeAt(0) - 32;
	        var charWidth = 0.03125 * 2;
	        var NUM_SPRITES = 16;
	        var uVal = (charIndex % NUM_SPRITES);
	        var vVal = Math.floor(charIndex / NUM_SPRITES);
	        
	        var tex = [
	                // Mapping coordinates for the vertices
	                (uVal + 1) * charWidth, vVal * charWidth, 
	                (uVal) * charWidth, vVal * charWidth,
	                (uVal + 1) * charWidth, (vVal + 1) * charWidth, 
	                uVal * charWidth, (vVal + 1) * charWidth, 
	        ];
	        
	        
	        gl.enableVertexAttribArray(program.texLoc);
	        gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
	        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex), gl.STATIC_DRAW);
	        gl.vertexAttribPointer(program.texLoc, 2, gl.FLOAT, false, 0, 0);
	        gl.uniform1f(program.isText_location, this.isText ? 0.0 : 1.0);
	        gl.uniform1i(program.sampler_location, 0);
	        
	        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	        
	        gl.disableVertexAttribArray(program.positionLoc);
	        gl.disableVertexAttribArray(program.colorLoc);
	        gl.disableVertexAttribArray(program.tecLoc);
		},
		tick: function(theta){
		}
		
	};
};
