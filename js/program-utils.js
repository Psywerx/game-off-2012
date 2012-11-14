ProgramUtils = function() {

	function createShader(str, type) {
		var shader = gl.createShader(type);
		gl.shaderSource(shader, str);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			throw gl.getShaderInfoLog(shader);
		}
		return shader;
	}

	function createProgram(vstr, fstr) {
		var program = gl.createProgram();
		var vshader = createShader(vstr, gl.VERTEX_SHADER);
		var fshader = createShader(fstr, gl.FRAGMENT_SHADER);
		gl.attachShader(program, vshader);
		gl.attachShader(program, fshader);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			throw gl.getProgramInfoLog(program);
		}
		return program;
	}

	function linkProgram(program) {
		var vshader = createShader(program.vshaderSource, gl.VERTEX_SHADER);
		var fshader = createShader(program.fshaderSource, gl.FRAGMENT_SHADER);
		gl.attachShader(program, vshader);
		gl.attachShader(program, fshader);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			throw gl.getProgramInfoLog(program);
		}
	}

	function loadProgram(vs, fs, callback) {
		var program = gl.createProgram();
		function vshaderLoaded(str) {
			program.vshaderSource = str;
			if (program.fshaderSource) {
				linkProgram(program);
				callback(program);
			}
		}
		function fshaderLoaded(str) {
			program.fshaderSource = str;
			if (program.vshaderSource) {
				linkProgram(program);
				callback(program);
			}
		}
		loadFile(vs, vshaderLoaded, true);
		loadFile(fs, fshaderLoaded, true);
		return program;
	}

	return {
		loadProgram : loadProgram,
		createProgram : createProgram
	};
}();