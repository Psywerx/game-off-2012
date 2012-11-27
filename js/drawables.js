Restart = function(){
    var bg = new Square();
    bg.texture.enabled = true;
    bg.texture.fromChar("0");
    bg.color = [0,0,0,1];
    bg.size  = [0,0.9/3,0];
    bg.position = [0,-0.1,-0.5];
    bg.texture.sprite = [1,17];
    bg.texture.size = [15,5];
    
    var selector = new Square();
    selector.texture.enabled = false;
    selector.color = [0.9,0.9,0.9,0.5];
    selector.size = [0.22,0.07, 0];
    selector.position = [0.02, -0.13, -0.51];
    
    
    return {
        position : 0,
        size : [0,0,0],
        tick : function(theta){
            selector.position[1] = this.position*(-0.13)-0.13;
            bg.size[0] = this.size[0];
            if(bg.size[0] > 0.85){
                selector.color[3] = selector.color[3]*0.8 + 0.5*0.2;
            }
            else{
                selector.color[3] = 0;
            }
        },
        draw : function(gl){
            bg.draw(gl);
            selector.draw(gl);
        }
    };
    
};


HighscoresAdd = function(){
    
    var bg = new Square();
    bg.texture.enabled = true;
    bg.texture.fromChar("0");
    bg.color = [0,0,0,1];
    bg.size  = [0,0.9/3,0];
    bg.position = [0,-0.1,-0.5];
    bg.texture.sprite = [1,23];
    bg.texture.size = [15,5];
    
    
    var t = Text("___");
    t.position([0.12, -0.15, -0.53]);
    
    var selector = new Square();
    selector.texture.enabled = false;
    selector.color = [0.9,0.9,0.9,0.5];
    selector.size = [0.22,0.07, 0];
    selector.position = [-0.59, -0.25, -0.51];
    
    var ta = ["_", "_", "_"];
    
    return{
        size : [0,0,0],
        getName : function(){
            return ta.join('').replace(/_/g, " ");
        },
        position : 0,
        update : function(code){
            if(code == KeyEvent.VK_BACK_SPACE){
                if(ta[this.position] == "_"){
                    this.position -= 1;
                }
                this.position = Math.max(0, this.position);
                ta[this.position] = "_"; 
                
            }
            else if(code > 64 && code < 91){
                ta[this.position] = String.fromCharCode(code).toUpperCase();
                if(this.position != 2){
                    this.position += 1;
                    ta[this.position] = "_";
                }
            }
            t.update(ta.join(''));
        },
        tick : function(theta){
            bg.size[0] = this.size[0];
            if(bg.size[0] > 0.85){
                selector.color[3] = selector.color[3]*0.8 + 0.5*0.2;
            }
            else{
                selector.color[3] = 0;
            }
        },
        draw : function(gl){
            bg.draw(gl);
            t.draw(gl);
            selector.draw(gl);
        }
    };
};

Highscores = function(){
    var bg = new Square();
    bg.texture.enabled = true;
    bg.texture.fromChar("0");
    bg.color = [0,0,0,1];
    bg.size  = [0.0,0.9/1.3,0];
    bg.position = [0,-0.1,-0.5];
    bg.texture.sprite = [17,17];
    bg.texture.size = [15,12];
    
    var selector = new Square();
    selector.texture.enabled = false;
    selector.color = [0.9,0.9,0.9,0.5];
    selector.size = [0.2,0.07, 0];
    selector.position = [0.65, -0.5, -0.51];
    
    function pad(number, length) {
        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }
    
    return{
        
        scores : [],
        update : function(){
            var scores = storage.get('scores');
            if(!(scores instanceof Array))
                scores = [];
            scores.sort(function(a,b){
                return b[1] - a[1]; 
            });
            for(var i = 0; i < Math.min(5, scores.length); i++){
                var t = Text((i+1) + ". " + scores[i][0] + " "+pad(scores[i][1], 4));
                t.position([0.55,0.17-i*0.1,-0.52]);
                t.size([0.05,0.05,0]);
                this.scores.push(t);
            }
        },
        size : [0,0,0],
        
        tick : function(theta){
            bg.size[0] = this.size[0];
            if(bg.size[0] > 0.85){
                selector.color[3] = selector.color[3]*0.8 + 0.5*0.2;
            }
            else{
                selector.color[3] = 0;
            }
        },
        draw : function(gl){
            bg.draw(gl);
            selector.draw(gl);
            for(var i=0; i<this.scores.length;i++){
                this.scores[i].draw(gl);
            }
        }
    };
    
};

Menu = function(){
    var s = new Square();
    s.texture.enabled = true;
    s.texture.fromChar("0");
    s.color = [0,0,0,1];
    s.size  = [0.75,0.75/1.3,0];
    s.position = [0,-0.05,-0.5];
    s.texture.sprite = [16,0];
    s.texture.size = [10,7];
    
    var selector = new Square();
    selector.texture.enabled = false;
    selector.color = [0.9,0.9,0.9,0.5];
    selector.size = [0.4,0.07, 0];
    selector.position =[0, 0.10, -0.51];
    
    
    return{
        
        size : [0,0,0],
        
        tick : function(gl){
            var about= game.currentMenu == game.menuState.ABOUT ? 1 : 0;
            selector.position[1] = (-1.1*(game.currentMenu+0.1+about)+1)*0.12;
            
            s.size[0] = this.size[0];
            if(s.size[0] > 0.73){
                selector.color[3] = selector.color[3]*0.8 + 0.5*0.2;
            }
            else{
                selector.color[3] = 0;
            }
        },
        draw : function(gl){
            s.draw(gl);
            selector.draw(gl);
        }
    };
};


Death = function(){
    var death = new Square();
    death.color = [0.5,0.5,0.5,0.8];
    death.size  = [1, 0.6, 1];
    death.position = [0,-0.05,-0.5];
    death.texture.enabled = false;
    
    var text = new Text("Game Over");
    text.position([0.40,0.1,-0.51]);
    
    var press = new Text("Press <space> to restart");
    press.size([0.045, 0.045, 0]);
    press.position([0.85,-0.25,-0.51]);
    
    return {
        
        tick: function(theta){
            
        },
        draw: function(gl){
            death.draw(gl);
            text.draw(gl);
            press.draw(gl);
        }
    };
};


Pause = function(){
    var pause = new Square();
    pause.color = [0.3,0.3,0.3,0.4];
    pause.size  = [1, 0.4, 1];
    pause.position = [-0.23,-0.05,-0.5];
    pause.texture.enabled = false;
    
    var text = new Text("Game paused");
    text.position([0.25,-0.0,-0.51]);
    
    return {
        
        tick: function(theta){
            
        },
        draw: function(gl){
            pause.draw(gl);
            text.draw(gl);
        }
    };
};

Text = function(string){
    var squares = [];
    var size = [0.075,0.075,0];
    var pos = [0,1.33, -0.01];
    for(var i = 0; i < string.length; i++){
        var s = new Square();
        s.texture.enabled = true;
        s.texture.fromChar(string.charAt(i));
        s.color = [0.3,0.3,0.3,1];
        s.size  = size;
        s.position = [pos[0]-i/(18-size[0]*100), pos[1], pos[2]];
        squares.push(s);
    }
    return {
        
        update : function(string){
            squares = [];
            for(var i = 0; i < string.length; i++){
                var s = new Square();
                s.texture.enabled = true;
                s.texture.fromChar(string.charAt(i));
                s.color = [0.3,0.3,0.3,1];
                s.size  = size;
                s.position = [pos[0]-i/(18-size[0]*100), pos[1], pos[2]];
                squares.push(s);
            }
        },
        
        size : function(s){
            for(var i = 0; i < string.length; i++){
                squares[i].size = s;
            }
            size = s;
        },
        position : function(p){
            for(var i = 0; i < string.length; i++){
                // TODO: This is some ugly code, make it better
                squares[i].position = [p[0]-i/(18-squares[i].size[0]*100), p[1], p[2]];
                pos = p;
            }
        },
        tick : function(theta){
            
        },
        draw : function(gl){
            for(var i = 0; i < string.length; i++){
                squares[i].draw(gl);
            }
        }
    };
};

Score = function(){
    
    var squares = [];
    var num_numbers = 14;
    for(var i = 0; i < num_numbers; i++){
        var s = new Square();
        s.texture.enabled = true;
        s.texture.fromChar("0");
        s.color = [0.3,0.3,0.3,1];
        s.size  = [0.075,0.075,0];
        s.position = [-i/10-0.01, 1.33, -0.01];
        squares.push(s);
    }
    
    return {
        
        tick : function(theta){
            var score = game.score + "";
            while(score.length < num_numbers){
                score = "0" + score;
            }
            
            for(var i = 0; i < num_numbers; i++){
                squares[i].texture.fromChar(score.charAt(i));
            }
        },
        draw : function(gl){
            for(var i = 0; i < num_numbers; i++){
                squares[i].draw(gl);
            }
        }
    };
};

Object = function(objectType){
    var ObjectTypes = [
                   { 
                       name: "pull",
                       size: [0.1,0.1/2,0],
                       textureSprite : [0,11],
                       textureSize : [2,1],
                       collissionModifier : 0.8,
                       collission : function(o,p){
                           game.objectSpeed -= 0.25;
                           game.objectSpeed = Math.max(0.2, game.objectSpeed);
                           o.makeIdle();
                           game.score += 5;
                       }
                   
                   },{ 
                       name: "watch",
                       size: [0.1,0.1/2,0],
                       textureSprite : [2,11],
                       textureSize : [2,1],
                       collissionModifier : 0.8,
                       collission : function(o,p){
                           o.makeIdle();
                           game.score += 5;
                           p.localTimeout(this.name,function(){
                               p.invulnerable = false;
                               p.alpha = 1;
                           },3000);
                           p.invulnerable = true;
                           p.alpha = 0.5;
                       }
                   },{ 
                       name: "star",
                       size: [0.1,0.1/2,0],
                       textureSprite : [4,11],
                       textureSize : [2,1],
                       collissionModifier : 0.8,
                       collission : function(o,p){
                           o.makeIdle();
                           game.score += 5;
                           p.small = true;
                           p.size = [0.1, 0.1, 0];
                           p.localTimeout(this.name,function(){
                               p.small = false;
                               p.size = [0.2, 0.2, 0];
                           }, 3000);
                       }
                   },{ 
                       name: "fork",
                       size: [0.1,0.1/2,0],
                       textureSprite : [6,11],
                       textureSize : [2,1],
                       collissionModifier : 0.8,
                       collission : function(o,p){
                           game.score += 5;
                           o.makeIdle();
                           p.localTimeout(this.name,function(){
                               p.fork = false;
                           }, 3000);
                           p.fork = true;
                       }
                   }, {
                       name: "issue",
                       size: [0.2,0.2/3,0],
                       textureSprite : [0,10],
                       textureSize : [3,1],
                       collissionModifier : 0.8,
                       collission : function(o,p){
                           if(!p.invulnerable)
                               game.die();
                       }
                   }
                   ];
    var object = new Square();
    object.color = [0,0,0,1];
    object.position = [0, -1*game.bg.size[1], Math.random()/100];
    object.collissionModifier = 0.8;
    object.alpha = 1;
    object.texture.enabled = true;
    var type = ObjectTypes[objectType != 'B' ? 4 : Math.round(Math.random()*3)];//Math.round(Math.random()*3)];
    object.size  = type.size;
    object.texture.sprite = type.textureSprite;
    object.texture.size = type.textureSize;
    object.type  = type;

    var particles = new Point();
    
    return {
        object : object,
        velocity : [0,0,0],
        position : object.position,
        makeIdle : function(){
            game.objects.splice(game.objects.indexOf(this), 1);
            game.idleObjects.push(this);
            this.object.velocity = [0,0,0];
            this.object.position[1] = -1*game.bg.size[1];
            
        },
        tick : function(theta){
            this.velocity[1] = game.objectSpeed;
            object.position[1] += theta * this.velocity[1];
            if(object.position[1] > game.bg.size[1]-0.5){
                
                this.makeIdle();
                game.score += 1;
            }
            if(game.areColliding(object, game.player))
                object.type.collission(this, game.player);
            
            if(game.player.fork && game.areColliding(object, game.player.forkObject))
                object.type.collission(this, game.player);
        
            if(game.areColliding(object, game.player2))
                object.type.collission(this, game.player2);
            
            if(game.player2.fork && game.areColliding(object, game.player2.forkObject))
                object.type.collission(this, game.player2);

//            particles.position = object.position.slice();
//            particles.position[1] -= 0.2;
//            particles.position[2] += 0.001;
//            particles.tick(theta);
        },
        draw : function(gl){
            //particles.draw(gl);
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
    
    var forkObject = new Square();
    forkObject.color = [1,1,1,0];
    forkObject.size  = [0.2, 0.2, 1];
    forkObject.position = [0, 0.9, 0.00001];
    forkObject.texture.enabled = true;
    forkObject.texture.sprite = [4,6];
    forkObject.collissionModifier = 0.6,
    forkObject.texture.size = [4,4];
    
    var isWallColliding = function(o){ // d = 1 left wall; d = -1 right wall
        if(o.disabled) return false;
        return o.position[0] < -1*(game.bg.size[0]-o.size[0]) || o.position[0] > (game.bg.size[0]-o.size[0]);
    };
    
    return {
        timeouts : [],
        speed : [0,0,0],
        direction : [0,0,0],
        position : player.position,
        size : player.size,
        collissionModifier : 0.6,
        forkObject : forkObject,
        alpha : 1,
        fork : false,
        small : false,
        invulnerable : false,
        disabled : false,
        setPosition : function(pos){
            player.position = pos;
            forkObject.position = player.position.slice();
            forkObject.position[2] = player.position[2] - 0.00001;
            forkObject.position[0] += 1.45*player.size[0];
        },
        tick : function(theta){
            player.disabled = this.disabled;
            if(player.disabled) return;
            this.speed[0] += theta*2;
            this.speed[1] += theta*2;
            if(this.direction[0] == 0) this.speed[0] = 0;
            if(this.direction[1] == 0) this.speed[1] = 0;
            if(this.direction[0] != 0 && this.direction[1] != 0){
                this.speed[0] = 0;
                this.speed[1] = 0;
            }
            var posChange = (this.direction[0] + this.direction[1]) * theta * 2 * (this.speed[0]+this.speed[1]);
            player.position[0] += posChange;
            this.position = player.position;
            player.size = _.map(this.size, function(s,i){return s * 0.2 + player.size[i] * 0.8;}, this);
            player.color[3] = this.alpha;
            forkObject.size = player.size;
            forkObject.position = player.position.slice();
			forkObject.position[2] = player.position[2] - 0.00001;
            forkObject.position[0] += 1.45*player.size[0];
            
            
            if(this.fork){
                forkObject.color[3] = 0.2 + 0.8*(this.invulnerable ? this.alpha : forkObject.color[3]);
            }
            else{
                forkObject.color[3] = forkObject.color[3]*0.8;
            }
            if(this.fork && this.invulnerable){
                forkObject.color[3] = this.alpha;
            }
            if (isWallColliding(player)) {
                var collidingWall = player.position[0]/Math.abs(player.position[0]); // -1 left, 1 right
                player.position[0]     = collidingWall*(game.bg.size[0]-forkObject.size[0]);
                forkObject.position[0] = player.position[0] + 1.45*player.size[0];
                this.speed[0] = 0;
            }
            if(this.fork && isWallColliding(forkObject)){
                forkObject.position[0] = game.bg.size[0]-forkObject.size[0];
                player.position[0] = forkObject.position[0] - 1.45*player.size[0];
                this.speed[0] = 0;
            }
        },
        draw : function(gl){
            player.draw(gl);
            forkObject.draw(gl);
        },
        localTimeout : function(name,f,t){
            if (this.timeouts[name]){
                clearTimeout(this.timeouts[name]);
            }
            this.timeouts[name] = setTimeout(f,t);
        }
    };
};
Top = function(){
    var top = new Square();
    top.size = [1.7, 1.8/8.3, 1];
    top.color = [0,0,0,1.0];
    top.position = [0, 1.34, 0.000];
    top.texture.enabled = true;
    top.texture.sprite = [0,14];
    top.texture.size = [25,3];
    
    return{
        tick : function(theta){
        },
        draw : function(gl){
            top.draw(gl);
        }
    };
};
Background = function(){
    
    var bg = new Square();
    bg.size = [1.7,1.7*4.2, 1];
    bg.color = [1, 1, 1, 1.0];
    bg.position = [0,-6,0.21];
    bg.texture.enabled = true;
    bg.texture.sprite = [32,0];
    bg.texture.size = [15,63]; 
    
    var bg2 = new Square();
    bg2.size = [1.7,1.7*4.2, 1];
    bg2.color = [1, 1, 1, 1.0];
    bg2.position = [0,-6,0.211];
    bg2.texture.enabled = true;
    bg2.texture.sprite = [47,0];
    bg2.texture.size = [15,63]; 
   
    return{
        size : bg.size,
        tick : function(theta){
            bg.position[1] += theta*0.05;
            bg2.position[1] += theta*0.1;
        }, 
        draw : function(gl){
            bg2.size = _.map(this.size, function(a){return a+0.15;});
            bg2.position[0] = -0.055;
            bg2.draw(gl);
            bg.size = _.map(this.size, function(a){return a+0.15;});
            bg.position[0] = -0.055;
            bg.draw(gl);
        }
    };
};

Point = function(){
    
    var program = Main.program;
    var modelMatrix = mat4.identity();
    var vertBuffer =  gl.createBuffer();
    var colorBuffer = gl.createBuffer();
    var texBuffer = gl.createBuffer();
    var vertices = [];
    var colors = [];
    var speed  = [];
    for (var i = 0; i < 50; i++){
        vertices.push(Math.random()*0.5-0.4);
        vertices.push(2);
        vertices.push(0);
        
        colors.push(0);
        colors.push(0);
        colors.push(0);
        colors.push(1);
        
        speed.push(Math.random()+0.2);
    }
    var arrayVertices = new Float32Array(vertices);
    
    var initZeroArr = function(l){
        var rv = new Array(l);
        while (--l >= 0) {
            rv[l] = 0;
        }
        return rv;
    };
    
    return {
        position : [0,0,0],
        color : [0.5, 0, 0, 1],
        draw: function(gl){
            modelMatrix = mat4.translate(mat4.identity(), this.position);
            gl.uniformMatrix4fv(program.modelMatrix_location, false, modelMatrix);
            gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
            gl.enableVertexAttribArray(program.positionLoc);
            arrayVertices.set(vertices);
            gl.bufferData(gl.ARRAY_BUFFER, arrayVertices, gl.STATIC_DRAW);
            gl.vertexAttribPointer(program.positionLoc, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(program.colorLoc);
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
            gl.vertexAttribPointer(program.colorLoc, 4, gl.FLOAT, false, 0, 0);
            
            gl.enableVertexAttribArray(program.texLoc);
            gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initZeroArr(vertices.length/3*2)), gl.STATIC_DRAW);
            gl.vertexAttribPointer(program.texLoc, 2, gl.FLOAT, false, 0, 0);
            gl.uniform1i(program.sampler_location, 0);
            
            gl.uniform1f(program.isText_location, 1.0);
            gl.drawArrays(gl.POINTS, 0, vertices.length/3);
            
            gl.disableVertexAttribArray(program.positionLoc);
            gl.disableVertexAttribArray(program.colorLoc);
            gl.disableVertexAttribArray(program.tecLoc);
        },
        tick: function(delta){
            for ( var i = 0; i < vertices.length; i+=3) {
                vertices[i+1] += speed[i/3] * delta;
                if(vertices[i+1] > 0.2){
                    vertices[i+1] = 0;
                }
                colors[i/3*4+3] = vertices[i+1]*5;
            }
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
            

            var charWidth = [0.03125/2*this.texture.size[0], 0.03125/2*this.texture.size[1]];
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
