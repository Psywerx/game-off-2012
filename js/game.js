var game = {
	tick : function(theta){
		
	},
	draw : function(gl){
		gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.STENCIL_BUFFER_BIT | gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(Main.program);
//        int loc = gl.glGetUniformLocation(Main.shaderProgram, "s_texture");
//        gl.glUniform1i(loc, 0);
//        gl.glActiveTexture(GL.GL_TEXTURE0);
//        gl.glBindTexture(GL.GL_TEXTURE_2D, Main.texture1);
        var ratio = Main.WIDTH / Main.HEIGHT;
        var model_projection = mat4.lookAt([0,0,-4], [0,0,0], [0,1,0]);

        var model_view_projection = mat4.frustum(-ratio, ratio, -1, 1, 3, 7);
//        Matrix.rotateM(model_projection, 0, -smoothDirection / 1.5f, 0, 1f, 0f);
//
//        float[] projection = new float[16];
        var projection = mat4.multiply(model_view_projection, model_projection);
        //projection = mat4.identity();
        gl.uniformMatrix4fv(Main.projectionMatrix_location, false, projection);
//        gl.enable(gl.BLEND);
//        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        
        
        // DRAW SQUARE:
        
        var modelMatrix = mat4.identity();
        gl.uniformMatrix4fv(Main.modelMatrix_location, false, modelMatrix);
        gl.uniform1f(Main.isText_location, 1.0);
        
        var vertices = [
                        1.0, 1.0, 0.0,
                        -1.0, 1.0, 0.0,
                        1.0, -1.0, 0.0,
                        -1.0, -1.0, 0.0,
                        ];
        
        vertices = _.map(vertices, function(i){return i*0.5;});
        
        var vertBuffer =  gl.createBuffer();
        
        gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
        gl.enableVertexAttribArray(Main.positionLoc);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(Main.positionLoc, 3, gl.FLOAT, false, 0, 0);
        
        
        var color = [0,255,255];
        var alpha = 1;
        var colors = [ color[0], color[1], color[2], alpha, // Top color
                color[0], color[1], color[2], alpha, // Bottom Left color
                color[0], color[1], color[2], alpha, // Bottom Right
                color[0], color[1], color[2], alpha // Transparency
        ];
        
        var colorBuffer = gl.createBuffer();
        
        gl.enableVertexAttribArray(Main.colorLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(Main.colorLoc, 4, gl.FLOAT, false, 0, 0);
        
        
        //gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        gl.disableVertexAttribArray(Main.positionLoc);
        gl.disableVertexAttribArray(Main.colorLoc);
        
//        
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