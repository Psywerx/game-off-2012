var game = {
		
	init : function(){
		this.bg = Background();
		this.player = Player();
		this.objects = [];
		for(var i=0; i < 50; i++){
			this.objects.push(Object());
		}
		this.objectsSpawner = 2;
		this.smooth = 0;
		this.timeline = 0;
	},
	keydown : function(event){
		switch (event.keyCode) {
        case KeyEvent.VK_LEFT:
            game.player.direction[0] = 1;
            break;
        case KeyEvent.VK_RIGHT:
        	game.player.direction[1] = -1;
            break;
        }
	},
	keyup : function(event){
		switch (event.keyCode) {
        case KeyEvent.VK_LEFT:
        	game.player.direction[0] = 0;
            break;
        case KeyEvent.VK_RIGHT:
        	game.player.direction[1] = 0;
            break;
        }
	},
	tick : function(theta){
		this.timeline += theta;
		this.bg.tick(theta);
		this.player.tick(theta);
		this.smooth = 0.8*this.smooth + 0.2*(game.player.direction[0] + game.player.direction[1]);
		for(var i=0; i < this.objects.length; i++){
			this.objects[i].tick(theta);
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
        var model_view_projection = mat4.frustum(-ratio, ratio, -1, 1, 2, 7);
        model_projection = mat4.rotate(model_projection, this.smooth*-0.1, [0,1,0]);
        var projection = mat4.multiply(model_view_projection, model_projection);
        
        gl.uniformMatrix4fv(program.projectionMatrix_location, false, projection);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        
        // DRAW SQUARE:
        
        this.bg.draw(gl);
        this.player.draw(gl);
        for(var i=0; i < this.objects.length; i++){
        	this.objects[i].draw(gl);
        }
//        // Draw actual stuff:
//        bg.bgSquare.z = 0.1f;
//         bg.draw(gl);
//         title.draw(gl);
//         scoreText.draw(gl);
//        for (Obstacle g : objects) {
//            g.draw(gl);
//        }
//        player.draw(gl);
	}
};