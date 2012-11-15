var game = {
	tick : function(theta){
		
	},
	draw : function(gl){
		
		var program = Main.program; // Local pointer to shader program
		
		gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0, 1, 1, 1);
        gl.clear(gl.STENCIL_BUFFER_BIT | gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(program);
        gl.uniform1i(program.sampler_location, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, Main.texture);
        
        var ratio = Main.WIDTH / Main.HEIGHT;
        var model_projection = mat4.lookAt([0,0,-4], [0,0,0], [0,1,0]);
        var model_view_projection = mat4.frustum(-ratio, ratio, -1, 1, 3, 7);
        var projection = mat4.multiply(model_view_projection, model_projection);
        
        gl.uniformMatrix4fv(program.projectionMatrix_location, false, projection);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        
        // DRAW SQUARE:
        var modelMatrix = mat4.rotate(mat4.identity(), Math.PI, [0, 1, 0]);
        gl.uniformMatrix4fv(program.modelMatrix_location, false, modelMatrix);
        gl.uniform1f(program.isText_location, 0.0);
        
        var vertices = [
                        1.0, 1.0, 0.0,
                        -1.0, 1.0, 0.0,
                        1.0, -1.0, 0.0,
                        -1.0, -1.0, 0.0,
                        ];
        
        vertices = _.map(vertices, function(i){return i*0.5;});
        
        var vertBuffer =  gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
        gl.enableVertexAttribArray(program.positionLoc);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(program.positionLoc, 3, gl.FLOAT, false, 0, 0);
        
        var color = [0,0,0];
        var alpha = 1;
        var colors = [ color[0], color[1], color[2], alpha, 
                color[0], color[1], color[2], alpha,
                color[0], color[1], color[2], alpha,
                color[0], color[1], color[2], alpha
        ];
        
        var colorBuffer = gl.createBuffer();
        gl.enableVertexAttribArray(program.colorLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(program.colorLoc, 4, gl.FLOAT, false, 0, 0);
        
        
        var charIndex = "B".charCodeAt(0) - 32;
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
        
        var texBuffer = gl.createBuffer();
        
        gl.enableVertexAttribArray(program.texLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex), gl.STATIC_DRAW);
        gl.vertexAttribPointer(program.texLoc, 2, gl.FLOAT, false, 0, 0);
        
        gl.uniform1i(program.sampler_location, 0);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        gl.disableVertexAttribArray(program.positionLoc);
        gl.disableVertexAttribArray(program.colorLoc);
        gl.disableVertexAttribArray(program.tecLoc);
        
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