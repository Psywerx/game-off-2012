
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
		console.log(this.positionLoc, this.colorLoc, this.texLoc);
		
		this.projectionMatrix_location = gl.getUniformLocation(this.program, "uniform_Projection");
	    this.modelMatrix_location = gl.getUniformLocation(this.program, "uniform_Model");
	    this.sampler_location = gl.getUniformLocation(this.program, "s_texture");
	    this.isText_location = gl.getUniformLocation(this.program, "u_isText");
		
	    this.t0 = Date.now();
		this.render();
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

