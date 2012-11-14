$(document).ready(function(){
	
	
	canvas = document.getElementById("the-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
		
	}
	render();

	function render() {
	  // request render to be called for the next frame.
	  window.requestAnimFrame(render, canvas);
	  //console.log("rendering");
	  // render scene
	}
});

