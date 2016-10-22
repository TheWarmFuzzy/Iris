class Visualizer{
	constructor(){
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext("2d");
		
		this.canvas_buffer = document.createElement('canvas');
		this.ctx_buffer = this.canvas_buffer.getContext("2d");
		
		this.canvas_mask = document.createElement('canvas');
		this.ctx_mask = this.canvas_mask.getContext("2d");
		
		this.canvas.id = "canvas_visualizer";
		this.canvas.width = this.canvas_buffer.width = this.canvas_mask.width = this.width;
		this.canvas.height = this.canvas_buffer.height = this.canvas_mask.height = this.height;
		this.canvas.style.webkitFilter = "blur(1px)";
		this.canvas.style.backgroundColor = "#000";
		
		this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
		this.ctx_buffer.fillRect(0,0,this.canvas_buffer.width,this.canvas_buffer.height);
		this.ctx_mask.fillRect(0,0,this.canvas_mask.width,this.canvas_mask.height);
		document.body.appendChild(this.canvas);
		
		this.system_dot = new ParticleSystem(P_Dot,64);
		this.system_trail = new ParticleSystem(P_Circuit_Trail,24);
		
	}
	
	start(){
		var self = this;
		
		this.system_dot.init();
		this.system_trail.init();
		
		this.update_timer = setInterval(function(){self.update();}, 1000/60);
	}
	
	update(){
		this.render_frame = true;
		if(window.innerWidth != this.width){
			this.canvas.width = this.canvas_buffer.width = this.canvas_mask.width = window.innerWidth;
			this.width = window.innerWidth;
		}
		
		if(window.innerHeight != this.height){
			this.canvas.height = this.canvas_buffer.height = this.canvas_mask.height = window.innerHeight;
			this.height = window.innerHeight;
		}
		
		this.system_dot.update();
		this.system_trail.update();
		
		this.draw();

	}
	
	draw(){
		
		//Reset Buffer
		this.ctx_buffer.fillStyle="#08f";
		this.ctx_buffer.fillRect(0,0,screen.width * 2,screen.height * 2);
		
		//Reset Mask
		this.ctx_mask.fillStyle="#000";
		this.ctx_mask.fillRect(0,0,screen.width * 2,screen.height * 2);
		
		//Draw systems
		this.system_dot.draw(this.ctx_mask);
		this.system_trail.draw(this.ctx_mask);
		Filter.faded_border(this.canvas_mask, 150);
		
		//Draw mask over buffer
		this.ctx_buffer.globalCompositeOperation="multiply";
		this.ctx_buffer.drawImage(this.canvas_mask,0,0,this.canvas.width,this.canvas.height);
		this.ctx_buffer.globalCompositeOperation="source-over";
		
		//Draw to main canvas
		this.ctx.drawImage(this.canvas_buffer,0,0,this.canvas.width,this.canvas.height);
		
	}
}

class ParticleSystem{
	constructor(particle,count){
		
		
		this.x = 250;
		this.y = 250;
		this.radius = 3;
		this.particle = particle;
		this.particles = [];
		this.particle_count = count;
	}
	
	init(){
		for(var i = 0; i < this.particle_count; i++){
			this.particles[i] = new this.particle(i);
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
	constructor(id){
		
	}
	init(){
		
	}
	
	update(){
		
	}
	
	draw(ctx){
		
	}
}

class P_Dot extends Particle{
	constructor(id){
		super(id,id);
		this.id = id;
		this.radius;
		this.lifespan;
		this.current_life;
		this.position;
		this.life_value; // % of life left
	}
	
	init(){
		//Physical
		this.position = new Vector(((random_normal_distribution() * window.innerWidth)|0), ((random_normal_distribution() * window.innerHeight)|0));
		this.radius = random_normal_distribution() * Math.min(this.id, 24) * 0.5 + 2;
		
		//Emotional
		this.current_life = random_normal_distribution() * 400;
		this.lifespan = random_normal_distribution() * 800;
		this.life_value = 1 - this.current_life / this.lifespan;
	}
	
	update(){
		
		//Checks if the particle is dead
		if(this.lifespan <= ++this.current_life){
			//Un-dead it
			this.init();
		}
		
		//Set the life value
		this.life_value = 1 - this.current_life / this.lifespan;
		this.life_value = this.life_value < 0 ? 0 : this.life_value;
		//Change the radius
		//this.radius *= this.life_value;
	}
	
	draw(ctx){
		
		//Draw circle
		var c = (255 * this.life_value)|0;
		ctx.fillStyle="rgba("+c+","+c+","+c+",1)";
		ctx.beginPath();
		ctx.arc(this.position.x|0,this.position.y|0,this.radius * this.life_value,0,2*Math.PI);
		ctx.fill();
		
	}
}

class P_Circuit_Trail extends Particle{
	constructor(id){
		//Don't forget the super
		super(id, id);
		
		this.id = id;
		//Magical attributes
		this.magic_direction_constant = 0.707;
		this.magic_opacity_constant = 0.07142;
		
		//Physical attributes
		this.radius = Math.ceil(Math.min(id,12) * random_normal_distribution()) + 1;
		this.speed = this.radius / 18;
		this.length = 600 + (Math.random() * 150 * this.radius)|0;
		this.trail_width = Math.ceil(this.radius / 3);
		
		//Position Attributes
		this.direction = new Vector(id%2 == 1 ? -1 : 1,((Math.random() * 3)|0) - 1); //x = -1 (Left) x = 1 (Right), y = -1 (Up) y = 0 (Straight) y = 1 (Down) 
		this.position = new Vector((Math.random() * window.innerWidth)|0,(random_normal_distribution() * window.innerHeight)|0);
		this.velocity = new Vector(this.speed * this.direction.x,0);

		//Direction change timer variables
		this.dct = 0;
		this.dctm;

		//Vertex array for drawing the particle trail
		this.vertices = [];
		
		this.change_direction();
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
			this.position = new Vector((Math.random() * -100)|0,(random_normal_distribution() * window.innerHeight)|0);
			this.vertices = [];
			this.vertices[0] = new Vector(this.position.x - this.length, this.position.y);
			this.direction.y = 0;
		}
		
		//Off the left side
		if(this.vertices[0].x < 0 && -1 == this.direction.x){
			this.position = new Vector((Math.random() * 100)|0 + window.innerWidth,(random_normal_distribution() * window.innerHeight)|0);
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
			this.dctm *= 0.2 - (Math.random() * 0.15);
			
		}else{
			//Middle
			this.direction.y = 0;
		}

	}
	
	//Gets a new direction change timer maximum value
	get_new_dctm(){
		return (random_normal_distribution() * 900)|0;
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

// Random number based on central limit theorem
function random_normal_distribution() {
    return (Math.random() + Math.random() + Math.random()) / 3;
}


class ImageLibrary{
	
	
}
