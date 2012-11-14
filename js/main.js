
Main = {
		
	init : function(){
		this.canvas = $("#the-canvas")[0];
		gl     = WebGLUtils.setupWebGL(this.canvas);
		if (!gl) {
			console.log("Sorry :(");
		}
		this.WIDTH = this.canvas.width;
		this.HEIGHT = this.canvas.height;
		// Create shaders:
		this.program = ProgramUtils.createProgram($("#shader-vs").html(), $("#shader-fs").html());
		
		
		
		this.positionLoc = gl.getAttribLocation(this.program, "attribute_Position");
        this.colorLoc = gl.getAttribLocation(this.program, "attribute_Color");
        this.texLoc = gl.getAttribLocation(this.program, "a_texCoord");
		
		this.projectionMatrix_location = gl.getUniformLocation(this.program, "uniform_Projection");
	    this.modelMatrix_location = gl.getUniformLocation(this.program, "uniform_Model");
	    this.sampler_location = gl.getUniformLocation(this.program, "s_texture");
	    this.isText_location = gl.getUniformLocation(this.program, "u_isText");
		
	    this.t0 = Date.now();
	    
	    var image = new Image();
		image.src = "res/text.png";
		image.onload = function(){
			var texty = gl.createTexture();
			texty.image = image;
			gl.pixelStorei(gl.UNPACK_ALIGNMENT, true);
			gl.bindTexture(gl.TEXTURE_2D, texty);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texty.image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
			gl.generateMipmap(gl.TEXTURE_2D);
			gl.bindTexture(gl.TEXTURE_2D, null);
			Main.texture = texty;
			Main.render();
		};

	    
	},
	render : function(){
		// request render to be called for the next frame.
		
		window.requestAnimFrame(Main.render, Main.canvas);
		  
		var t1 = Date.now();
		var theta = (t1 - this.t0) * 0.001;
		this.t0 = t1;
		  
		game.tick(theta);
		game.draw(gl);
		  
	}
};

$(document).ready(function(){
	Main.init();
});

