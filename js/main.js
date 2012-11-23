
Main = {
		
	init : function(){
		
		$(document).keydown(game.keydown);
		$(document).keyup(game.keyup);
		$(window).focus(function(){
				if(game.currentState == game.state.PAUSE){
					game.currentState = game.state.PLAY;
					Main.t0 = Date.now();
				}
			});
		$(window).blur(function(){
			if(game.currentState == game.state.PLAY)
				game.currentState = game.state.PAUSE;
		});

		
		
		this.canvas = $("#the-canvas")[0];
		
		gl = WebGLUtils.setupWebGL(this.canvas);
		if (!gl)  {
			console.log("Sorry, something went wrong :(");
		}
		
		this.WIDTH = this.canvas.width;
		this.HEIGHT = this.canvas.height;
		
		// Create shaders:
		this.program = ProgramUtils.createProgram($("#shader-vs").html(), $("#shader-fs").html());
		_.extend(this.program, {
			positionLoc : gl.getAttribLocation(this.program, "attribute_Position"),
	        colorLoc : gl.getAttribLocation(this.program, "attribute_Color"),
	        texLoc : gl.getAttribLocation(this.program, "a_texCoord"),
			projectionMatrix_location : gl.getUniformLocation(this.program, "uniform_Projection"),
		    modelMatrix_location : gl.getUniformLocation(this.program, "uniform_Model"),
		    sampler_location : gl.getUniformLocation(this.program, "s_texture"),
		    isText_location : gl.getUniformLocation(this.program, "u_isText")
		});
		
	    this.t0 = Date.now();
	    
	    game.init();
	    
	    var image = new Image();
		image.src = "res/text.png";
		image.onload = function(){
			var texture = gl.createTexture();
			texture.image = image;
			gl.pixelStorei(gl.UNPACK_ALIGNMENT, true);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
			gl.generateMipmap(gl.TEXTURE_2D);
			gl.bindTexture(gl.TEXTURE_2D, null);
			Main.texture = texture;
			Main.render();
		};

	    
	},
	render : function(){
		// request render to be called for the next frame.
		
		window.requestAnimFrame(Main.render, Main.canvas);
		  
		var t1 = Date.now();
		var theta = (t1 - this.t0) * 0.001;
		this.t0 = t1;
		if(_.isNaN(theta)) // XXX sometimes theta is NaN?!?
			return;
		game.tick(theta);
		game.draw(gl);
	}
};

$(document).ready(function(){
	Main.init();
});

