class Visualizer{
	constructor(width, height){
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext("2d");
		
		this.canvas_buffer = document.createElement('canvas');
		this.ctx_buffer = this.canvas_buffer.getContext("2d");
		
		this.canvas_mask = document.createElement('canvas');
		this.ctx_mask = this.canvas_mask.getContext("2d");
		
		this.canvas.id = "canvas_visualizer";
		this.canvas.width = this.canvas_buffer.width = this.canvas_mask.width = width;
		this.canvas.height = this.canvas_buffer.height = this.canvas_mask.height = height;
		
		this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
		this.ctx_buffer.fillRect(0,0,this.canvas_buffer.width,this.canvas_buffer.height);
		this.ctx_mask.fillRect(0,0,this.canvas_mask.width,this.canvas_mask.height);
		document.body.appendChild(this.canvas);
		
		this.system = new ParticleSystem(width, height);
		
		
	}
	
	start(){
		var self = this;
		
		this.system.init();
		
		this.update_timer = setInterval(function(){self.update();}, 1000/60);
	}
	
	update(){

		this.system.update();
		
		this.draw();
	}
	
	draw(){
		
		this.system.draw(this.ctx_mask);
		this.ctx.drawImage(this.canvas_mask,0,0,this.canvas.width,this.canvas.height);
		
		
		//Dull Buffer
		this.ctx_mask.fillStyle="rgb(0,0,0)";
		this.ctx_mask.fillRect(0,0,this.canvas_mask.width,this.canvas_mask.height);
		//this.ctx_mask.clearRect(0,0,this.canvas_mask.width,this.canvas_mask.height);
		//reduce_whites(this.ctx_mask, 1);
		
		//Reset Buffer
		this.ctx_buffer.fillStyle="#000";
		this.ctx_buffer.fillRect(0,0,this.canvas_buffer.width,this.canvas_buffer.height);
		
		
	}
}

class ParticleSystem{
	constructor(width, height){
		
		
		this.x = 250;
		this.y = 250;
		this.radius = 3;
		this.particles = [];
		this.particle_count = 4;
	}
	
	init(){
		for(var i = 0; i < this.particle_count; i++){
			this.particles[i] = new Particle();
		}
	}
	
	update(){
		for(var i = 0; i < this.particle_count; i++){
			this.particles[i].update();
		}
	}
	
	draw(ctx){
		for(var i = 0; i < this.particle_count; i++){
			this.particles[i].draw(ctx);
		}
	}
}

class Particle{
	constructor(){
		this.radius = 4;
		this.speed = 1;
		this.change_timer = 0;
		this.direction = 0;
		this.update_change_timer_max(this.direction);

		
		
		//Physical attributes
		this.length = 600 + (Math.random() * 150 * this.radius)|0;
		
		//Virtual Attributes
		this.position = new Vector((Math.random() * 1000)|0,(Math.random() * 400)|0);
		this.velocity = [];
		this.velocity[-1] = new Vector(this.speed / 1.414,-this.speed / 1.414);
		this.velocity[0] = new Vector(this.speed,0);
		this.velocity[1] = new Vector(this.speed / 1.414,this.speed / 1.414);
		
		this.vertices = [];
		this.vertices[0] = new Vector(this.position.x - this.length, this.position.y);
	}
	
	init(){
		
	}
	
	update(){
		
		this.position.add(this.velocity[this.direction]);
		
		this.change_timer++;
		//Makes diagonals shorter
		
		if (this.change_timer > this.change_timer_max - this.direction_mod|0){
			this.change_timer = 0;
			this.change_direction();
			this.update_change_timer_max(this.direction);
		}
		//Check if the first vertex is unused
		if("undefined" != typeof this.vertices[1]){
			//TO DO: multi-directional
			if(this.vertices[1].x < this.position.x - this.length){
				this.shift_vertices();
			}
		}
	}
	
	draw(ctx){
		ctx.fillStyle="#fff";
		ctx.beginPath();
		ctx.arc(this.position.x|0,this.position.y|0,this.radius,0,2*Math.PI);
		ctx.fill();
		
		ctx.lineWidth=Math.ceil(this.radius / 3);
		
		var my_gradient=ctx.createLinearGradient(this.position.x - this.length,0,this.position.x,0);
		my_gradient.addColorStop(0,"rgba(255,255,255,0)");
		my_gradient.addColorStop(1,"rgba(255,255,255,1)");
		ctx.strokeStyle = my_gradient;
		//ctx.fillRect(this.x - 800, this.y - 1, 800, 2);
		ctx.beginPath();
		ctx.moveTo(this.vertices[0].x,this.vertices[0].y);
		for(var i = 1; i < this.vertices.length; i++){
			ctx.lineTo(this.vertices[i].x,this.vertices[i].y);
		}
		ctx.lineTo(this.position.x,this.position.y);
		ctx.stroke();
	}
	
	//Shifts vertices to remove the oldest element
	shift_vertices(){
		
		//Shift all vertices down one
		for(var i = 1; i < this.vertices.length; i++){
			this.vertices[i - 1] = this.vertices[i];
		}
		//Remove the newest vertex (duplicate)
		this.vertices.splice(this.vertices.length - 1, 1);

	}
	
	change_direction(){
		this.vertices[this.vertices.length] = new Vector(this.position.x, this.position.y);
		
		switch(this.direction){
			case 0:
				this.direction = Math.floor(Math.random() * 2) == 0 ? 1 : -1;
				break;
			case -1:
			case 1:
				this.direction = 0;
				break;
			
		}
		
	}
	
	update_change_timer_max(direction){
		this.change_timer_max = 160 + (Math.random() * 300)|0;
		this.direction_mod = this.change_timer_max * 0.6 + (Math.random() * 0.35) * Math.abs(direction);
	}
}

class Vector{
	
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
	
	add(vector){
		this.x += vector.x;
		this.y += vector.y;
	}
}

/*
function reduce_whites(ctx, speed){
	try{
		var imgd = ctx.getImageData(0,0,500,500);
		var pix = imgd.data;
		
		for (var i = 0, n = pix.length; i < n; i += 4){
			pix[i] = pix[i] - speed < 0 ? 0 : pix[i] - speed;
			pix[i+1] = pix[i+1] - speed < 0 ? 0 : pix[i+1] - speed;
			pix[i+2] = pix[i+2] - speed < 0 ? 0 : pix[i+2] - speed;	
		}

		ctx.putImageData(imgd, 0, 0);
	}catch(e){
		console.log(e);
	}
}*/