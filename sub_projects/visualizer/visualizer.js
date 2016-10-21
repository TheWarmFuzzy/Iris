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
		//this.canvas.style.webkitFilter = "blur(1px)";
		
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
		Filter.faded_border(this.canvas_mask, 150);
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
		this.particle_count = 24;
	}
	
	init(){
		for(var i = 0; i < this.particle_count; i++){
			this.particles[i] = new Particle();
			this.particles[i].init();
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
		//Magical attributes
		this.magic_direction_constant = 0.707;
		this.magic_opacity_constant = 0.07142;
		
		//Physical attributes
		this.radius = (Math.random() * 12)|0 + 2;
		this.speed = this.radius / 3;
		this.length = 600 + (Math.random() * 150 * this.radius)|0;
		this.trail_width = Math.ceil(this.radius / 3);
		
		//Position Attributes
		this.direction = new Vector(this.get_direction(),0); //x = -1 (Left) x = 1 (Right), y = -1 (Up) y = 0 (Straight) y = 1 (Down) 
		this.position = new Vector((Math.random() * window.innerWidth)|0,(Math.random() * window.innerHeight)|0);
		this.velocity = new Vector(this.speed * this.direction.x,0);

		//Direction change timer variables
		this.dct = 0;
		this.dctm = this.get_new_dctm();

		//Vertex array for drawing the particle trail
		this.vertices = [];
		//Initial trail end
		this.vertices[0] = new Vector(this.position.x - this.length * this.direction.x , this.position.y);
	}
	
	init(){
		
	}
	
	update(){
		
		//Update Velocity
		if(0 == this.direction.y){
			this.velocity.set(this.speed * this.direction.x,0);
		}else{
			this.velocity.set(this.speed * this.direction.x  * this.magic_direction_constant, this.speed * this.direction.y  * this.magic_direction_constant);
		}
		
		//Update Position
		this.position.add(this.velocity);
		
		//Change direction if direction change timer is greater than direction change timer max
		if (++this.dct > this.dctm){
			this.dct = 0;
			this.change_direction();
		}
		
		//Check if the first vertex is unused
		if("undefined" != typeof this.vertices[1]){
			if(-1 == this.direction.x){
				if(this.vertices[1].x > this.position.x + this.length)
					this.shift_vertices();
			}else{
				if(this.vertices[1].x < this.position.x - this.length)
					this.shift_vertices();
			}

		}
		
		//Off the right side
		if(this.vertices[0].x > screen.width && 1 == this.direction.x){
			this.position = new Vector((Math.random() * -100)|0,(Math.random() * window.innerHeight)|0);
			this.vertices = [];
			this.vertices[0] = new Vector(this.position.x - this.length, this.position.y);
			this.direction.y = 0;
		}
		
		//Off the left side
		if(this.vertices[0].x < 0 && -1 == this.direction.x){
			this.position = new Vector((Math.random() * 100)|0 + window.innerWidth,(Math.random() * window.innerHeight)|0);
			this.vertices = [];
			this.vertices[0] = new Vector(this.position.x + this.length, this.position.y);
			this.direction.y = 0;
		}
	}
	
	draw(ctx){
		
		
		
		//Set trail width
		ctx.lineWidth=this.trail_width;
		
		//Prepare the gradient to make the trail fade out
		var my_gradient=ctx.createLinearGradient(this.position.x - this.length * this.direction.x,0,this.position.x,0);
		my_gradient.addColorStop(0,"rgba(255,255,255,0)");
		my_gradient.addColorStop(1,"rgba(255,255,255," + this.radius * this.magic_opacity_constant + ")");
		ctx.strokeStyle = my_gradient;

		//Draw trail
		ctx.beginPath();
		ctx.moveTo(this.vertices[0].x,this.vertices[0].y);
		for(var i = 1; i < this.vertices.length; i++){
			ctx.lineTo(this.vertices[i].x,this.vertices[i].y);
		}
		ctx.lineTo(this.position.x,this.position.y);
		ctx.stroke();
		
		
		//Draw circle
		var c =((255 * this.radius * this.magic_opacity_constant)|0);
		ctx.fillStyle="rgba("+ c +","+ c +","+ c +",1)";
		ctx.beginPath();
		ctx.arc(this.position.x|0,this.position.y|0,this.radius,0,2*Math.PI);
		ctx.fill();
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
	
	//Handles all functions relating to changing the direction of the particle
	change_direction(){
		
		//Set new vertex
		this.vertices[this.vertices.length] = new Vector(this.position.x, this.position.y);
		
		//Set new direction change timer maximum
		this.dctm = this.get_new_dctm();
		
		//Change vertical direction
		if(0 == this.direction.y){
			
			//Up or Down
			this.direction.y = this.get_direction();
			
			//Scale the time down a bit for diagonals
			this.dctm *= 0.7 + (Math.random() * 0.25);
			
		}else{
			//Middle
			this.direction.y = 0;
		}

	}
	
	//Gets a new direction change timer maximum value
	get_new_dctm(){
		return 160 + (Math.random() * 300)|0;
	}
	
	//Returns -1 or 1
	get_direction(){
		return ((Math.random() * 2)|0) == 0 ? -1 : 1;
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
	
	set(x, y){
		this.x = x;
		this.y = y;
	}
}

class Filter{
	static faded_border(canvas,border_size){
		var ctx = canvas.getContext("2d");
		
		//Left border
		var my_gradient=ctx.createLinearGradient(0,0,border_size,0);
		my_gradient.addColorStop(0,"rgba(0,0,0,1)");
		my_gradient.addColorStop(1,"rgba(0,0,0,0)");
		ctx.fillStyle = my_gradient;
		ctx.fillRect(0,0,border_size,canvas.height);
		
		//Top border
		my_gradient=ctx.createLinearGradient(0,0,0,border_size);
		my_gradient.addColorStop(0,"rgba(0,0,0,1)");
		my_gradient.addColorStop(1,"rgba(0,0,0,0)");
		ctx.fillStyle = my_gradient;
		ctx.fillRect(0,0,canvas.width,border_size);
		
		//Right border
		my_gradient=ctx.createLinearGradient(canvas.width,0,canvas.width - border_size,0);
		my_gradient.addColorStop(0,"rgba(0,0,0,1)");
		my_gradient.addColorStop(1,"rgba(0,0,0,0)");
		ctx.fillStyle = my_gradient;
		ctx.fillRect(canvas.width - border_size,0,canvas.width,canvas.height);
		
		//Bottom border
		my_gradient=ctx.createLinearGradient(0,canvas.height,0,canvas.height - border_size);
		my_gradient.addColorStop(0,"rgba(0,0,0,1)");
		my_gradient.addColorStop(1,"rgba(0,0,0,0)");
		ctx.fillStyle = my_gradient;
		ctx.fillRect(0,canvas.height - border_size,canvas.width,canvas.height);
	}
}
