Object = function(){
	var object = new Square();
	object.color = [0,0,0,1];
	object.size  = [0.2,0.2/3,0];
	object.position = [Math.random()*game.bg.size[0]*2-game.bg.size[0]-object.size[0], -1*game.bg.size[1], Math.random()/100];
	object.collissionModifier = 1;
	object.texture.enabled = true;
	object.texture.sprite = [0,10];
	object.texture.size = [3,1];
	
	return {
		velocity : [0,Math.random(),0],
		position : object.position,
		tick : function(theta){
			object.position[1] += theta * this.velocity[1];
			if(object.position[1] > game.bg.size[1])
				object.position[1] = -1*game.bg.size[1];
			
			if(object.position[1] + object.size[1]*object.collissionModifier > game.player.position[1] - game.player.size[1] * game.player.collissionModifier &&
					object.position[1] - object.size[1]*object.collissionModifier < game.player.position[1] + game .player.size[1] * game.player.collissionModifier ){
				
				if(object.position[0] + object.size[0]*object.collissionModifier > game.player.position[0] - game.player.size[0] * game.player.collissionModifier &&
						object.position[0] - object.size[0]*object.collissionModifier < game.player.position[0] + game .player.size[0] * game.player.collissionModifier ){
					//object.color = [0,0,1,1];
				}
				else{
					//object.color = [0,1,1,1];
				}
			}
			else{
				//object.color = [1,0,0,1];
			}
		},
		draw : function(gl){
			object.draw(gl);
		}
	};
};

Player = function(){
	var player = new Square();
	player.color = [0,0,0,1];
	player.size  = [0.2, 0.2, 1];
	player.position = [0, 0.9, 0];
	player.texture.enabled = true;
	player.texture.sprite = [0,6];
	player.texture.size = [4,4];
	return {
		speed : [0,0,0],
		direction : [0,0,0],
		position : player.position,
		size : player.size,
		collissionModifier : 0.6,
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
	bg.size = [1.6, 1.4, 1];
	bg.color = [1, 1, 1, 1.0];
	bg.position = [0,0,0.01];
	
	var top = new Square();
	top.size = [1.65, 1.65/8, 1];
	top.color = [0,0,0,1.0];
	top.position = [0, 1.30, 0.000];
	top.texture.enabled = true;
	top.texture.sprite = [0,14];
	top.texture.size = [16,2];
	
	return{
		size : bg.size,
		tick : function(theta){
			bg.size = this.size;
		},
		draw : function(gl){
			bg.draw(gl);
			top.draw(gl);
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
		texture  : {
			NUM_SPRITES : 16,
			enabled: false,
			sprite : [0, 0],
			size   : [1, 1],
			fromChar : function(c){
				var charIndex = c.charCodeAt(0) - 32;
		        this.sprite = [(charIndex % this.NUM_SPRITES), Math.floor(charIndex / this.NUM_SPRITES)];
			}
		},
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
	        
	        gl.enableVertexAttribArray(program.texLoc);
	        gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
	        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getTextureUV()), gl.STATIC_DRAW);
	        gl.vertexAttribPointer(program.texLoc, 2, gl.FLOAT, false, 0, 0);
	        gl.uniform1f(program.isText_location, this.texture.enabled ? 0.0 : 1.0);
	        gl.uniform1i(program.sampler_location, 0);
	        
	        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	        
	        gl.disableVertexAttribArray(program.positionLoc);
	        gl.disableVertexAttribArray(program.colorLoc);
	        gl.disableVertexAttribArray(program.tecLoc);
		},
		tick: function(theta){
		},
		
		getTextureUV : function(){
			
			if(!this.texture.enabled) return [0,0,0,0,0,0,0,0];
			

	        var charWidth = [0.0625*this.texture.size[0], 0.0625*this.texture.size[1]];
	        var u = this.texture.sprite[0]/this.texture.size[0];
	        var v = this.texture.sprite[1]/this.texture.size[1];
	        return tex = [
	                // Mapping coordinates for the vertices
	                (u + 1) * charWidth[0],  v * charWidth[1], 
	                 u      * charWidth[0],  v * charWidth[1],
	                (u + 1) * charWidth[0], (v + 1) * charWidth[1], 
	                 u      * charWidth[0], (v + 1) * charWidth[1], 
	        ];
		}
		
	};
};
