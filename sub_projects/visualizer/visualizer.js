class Visualizer{
	constructor(){
		var self = this;
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext("2d");
		
		this.canvas_buffer = document.createElement('canvas');
		this.ctx_buffer = this.canvas_buffer.getContext("2d");
		
		this.canvas_trail = document.createElement('canvas');
		this.ctx_trail = this.canvas_trail.getContext("2d");
		
		this.canvas_dots = document.createElement('canvas');
		this.ctx_dots = this.canvas_dots.getContext("2d");
		
		this.canvas_clouds = document.createElement('canvas');
		this.ctx_clouds = this.canvas_clouds.getContext("2d");
		
		this.image_library = new ImageLibrary();
		this.image_library.new_image("Cloud","images/cloud.png");
		this.image_library.onload(function(){self.start();});
		
		this.canvas.id = "canvas_visualizer";
		this.canvas.width = this.canvas_buffer.width = this.canvas_trail.width = this.canvas_dots.width = this.canvas_clouds.width = this.width;
		this.canvas.height = this.canvas_buffer.height = this.canvas_trail.height = this.canvas_dots.height = this.canvas_clouds.height = this.height;
		//this.canvas.style.webkitFilter = "blur(3px)";
		this.canvas.style.backgroundColor = "#000";

		document.body.appendChild(this.canvas);
		
		this.system_dot = new ParticleSystem(P_Dot,48);
		this.system_trail = new ParticleSystem(P_Circuit_Trail,20);
		this.system_cloud = new ParticleSystem(P_Cloud,8);
	}
	
	start(){
		var self = this;
		
		this.system_dot.init();
		this.system_trail.init();
		this.system_cloud.set_image(this.image_library.image["Cloud"]);
		this.system_cloud.init();
		
		
		this.update_timer = setInterval(function(){self.update();}, 1000/60);
	}
	
	update(){
		this.render_frame = true;
		if(window.innerWidth != this.width){
			this.canvas.width = this.canvas_buffer.width = this.canvas_trail.width = this.canvas_dots.width =  this.canvas_clouds.width = window.innerWidth;
			this.width = window.innerWidth;
		}
		
		if(window.innerHeight != this.height){
			this.canvas.height = this.canvas_buffer.height = this.canvas_trail.height = this.canvas_dots.height =  this.canvas_clouds.height = window.innerHeight;
			this.height = window.innerHeight;
		}
		
		this.system_dot.update();
		this.system_trail.update();
		this.system_cloud.update();
		this.draw();

	}
	
	draw(){
		
		//Reset Buffer
		this.ctx_buffer.fillStyle="#000";
		this.ctx_buffer.fillRect(0,0,screen.width,screen.height);
		
		//Reset trail canvas
		this.ctx_trail.fillStyle="#000";
		this.ctx_trail.fillRect(0,0,screen.width,screen.height);
		
		//Reset dots canvas
		this.ctx_dots.fillStyle="#000";
		this.ctx_dots.fillRect(0,0,screen.width,screen.height);
		
		//Reset cloud canvas
		this.ctx_clouds.fillStyle="#06b";
		this.ctx_clouds.fillRect(0,0,screen.width,screen.height);
		
		//Draw systems
		this.system_dot.draw(this.ctx_dots);
		this.system_trail.draw(this.ctx_trail);
		this.system_cloud.draw(this.ctx_clouds);		
		
		//Draw clouds to buffer
		this.ctx_buffer.save();
		this.ctx_buffer.translate(this.canvas_buffer.width,0);
		this.ctx_buffer.scale(-1,1);
		
		this.ctx_buffer.globalAlpha = 0.15;
		this.ctx_buffer.drawImage(this.canvas_clouds,0,0,this.canvas_buffer.width,this.canvas_buffer.height);
		this.ctx_buffer.globalAlpha = 1;
		
		this.ctx_buffer.scale(-1,1);
		this.ctx_buffer.restore();
		
		//Draw clouds over trails
		this.ctx_trail.globalCompositeOperation="multiply";
		this.ctx_trail.drawImage(this.canvas_clouds,0,0,this.canvas.width,this.canvas.height);
		this.ctx_trail.globalCompositeOperation="source-over";
		
		this.ctx_trail.globalCompositeOperation="hard-light";
		this.ctx_trail.drawImage(this.canvas_trail,0,0,this.canvas.width,this.canvas.height);
		this.ctx_trail.globalCompositeOperation="source-over";
		
		//Change hue of clouds
		this.ctx_clouds.globalCompositeOperation="hue";
		this.ctx_clouds.fillStyle="#0f4";
		this.ctx_clouds.fillRect(0,0,screen.width,screen.height);
		this.ctx_clouds.globalCompositeOperation="source-over";
		
		//Draw clouds over dots
		this.ctx_dots.globalCompositeOperation="multiply";
		this.ctx_dots.drawImage(this.canvas_clouds,0,0,this.canvas.width,this.canvas.height);
		this.ctx_dots.globalCompositeOperation="source-over";
		
		this.ctx_dots.globalCompositeOperation="hard-light";
		this.ctx_dots.drawImage(this.canvas_dots,0,0,this.canvas.width,this.canvas.height);
		this.ctx_dots.globalCompositeOperation="source-over";

		//Draw dots to buffer
		this.ctx_buffer.globalCompositeOperation="screen";
		this.ctx_buffer.drawImage(this.canvas_trail,0,0,this.canvas.width,this.canvas.height);
		this.ctx_buffer.globalCompositeOperation="source-over";
		
		//Draw trails to buffer
		this.ctx_buffer.globalCompositeOperation="screen";
		this.ctx_buffer.drawImage(this.canvas_dots,0,0,this.canvas.width,this.canvas.height);
		this.ctx_buffer.globalCompositeOperation="source-over";
		
		//Amplify colours
		//this.ctx_buffer.globalCompositeOperation="overlay";
		//this.ctx_buffer.drawImage(this.canvas_buffer,0,0,this.canvas.width,this.canvas.height);
		//this.ctx_buffer.globalCompositeOperation="source-over";
		
		//Draw border on buffer
		Filter.faded_border(this.canvas_buffer, 150);
		
		//Draw buffer to canvas
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
		this.image;
			
	}
	
	init(){
		for(var i = 0; i < this.particle_count; i++){
			this.particles[i] = new this.particle(i);
			this.particles[i].set_image(this.image);
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
	
	set_image(image){
		if("undefined" == typeof image)
			return;
		
		this.image = image;
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
	
	set_image(image){
		this.image = image;
	}
	
	//Returns -1 or 1
	get_direction(){
		return ((Math.random() * 2)|0) == 0 ? -1 : 1;
	}
}

class P_Cloud extends Particle{
	constructor(id){
		super (id,id);
		this.id = id;
		this.scale;
		this.width;
		this.height;
		this.position;
		this.velocity;
		this.rotation;
		this.rotation_velocity;
		this.image;
		this.colour;
		this.colour_base;
		this.colour_variation;
		this.colour_canvas = document.createElement('canvas');
		this.colour_ctx = this.colour_canvas.getContext("2d");
		this.opacity;
		
	}
	
	init(){
		this.scale = Math.random() * 0.4 + 0.1;
		this.width = this.image.width * this.scale;
		this.height = this.image.height * this.scale;
		this.position = new Vector(Math.random() * window.innerWidth,random_normal_distribution()*window.innerHeight - window.innerHeight * 0.5);
		this.velocity = new Vector((Math.random() + 1) * this.get_direction(),Math.random() * 0.2 - 0.1);
		this.rotation = 360 * Math.random();
		this.rotation_velocity = 0.2 * Math.random() - 0.1;
		this.opacity = 1;
		
		this.colour_base = 180;
		this.colour_variation = (20 * this.id) % 100;
		this.colour = "hsl("+ (this.colour_base + ((this.colour_variation * Math.random())|0)) +"," + (Math.random() * 50 + 50) + "%, 50%)";
		this.colour_canvas.width = this.colour_canvas.height = this.width > this.height ? (this.width * 1.415)|0 : (this.height * 1.415)|0;
		
	}
	
	update(){
		this.rotation = (this.rotation + this.rotation_velocity) % 360;
		this.position.add(this.velocity);
		
		if(this.position.x < 0 - this.colour_canvas.width && this.velocity.x < 0){
			this.init();
			this.position.set(window.innerWidth + this.width,random_normal_distribution()*window.innerHeight - window.innerHeight * 0.5);
			this.velocity.set(-Math.random() - 1,Math.random() * 0.2 - 0.1);
		}
		
		if(this.position.x > window.innerWidth + this.colour_canvas.width && this.velocity.x > 0){
			this.init();
			this.position.set(-this.colour_canvas.width,random_normal_distribution()*window.innerHeight - window.innerHeight * 0.5);
			this.velocity.set(Math.random()+ 1,Math.random() * 0.2 - 0.1);
		}
	}
	
	draw(ctx){
		//Don't draw if there isn't an image
		if("undefined" == typeof this.image)
			return;
		
		//Reset Buffer
		this.colour_ctx.globalCompositeOperation="source-over";
		this.colour_ctx.fillStyle = this.colour;
		this.colour_ctx.fillRect(0,0,this.colour_canvas.width,this.colour_canvas.height);
		
		
		this.colour_ctx.save();
		
		//Transform
		this.colour_ctx.translate( this.colour_canvas.width * 0.5, this.colour_canvas.height * 0.5 );
		this.colour_ctx.rotate(this.rotation*Math.PI/180);
		this.colour_ctx.translate( -this.colour_canvas.width * 0.5, -this.colour_canvas.height * 0.5 );
		
		//Use image as alpha channel for colour
		this.colour_ctx.globalCompositeOperation="destination-in";
		this.colour_ctx.drawImage(this.image,this.colour_canvas.width * 0.5 - this.width * 0.5,this.colour_canvas.height * 0.5 - this.height * 0.5,this.width,this.height);
		
		this.colour_ctx.restore();
		
		//Set the opacity
		ctx.globalAlpha = this.opacity;
		
		//Draw to main canvas
		ctx.drawImage(this.colour_canvas,this.position.x - this.colour_canvas.width * 0.5,this.position.y - this.colour_canvas.height * 0.5,this.colour_canvas.width * 2,this.colour_canvas.height * 2);
		
		//Reset the opacity
		ctx.globalAlpha = 1;
	}
}

class P_Dot extends Particle{
	constructor(id){
		super(id,id);
		this.id = id;
		this.max_radius;
		this.radius;
		this.lifespan;
		this.current_life;
		this.position;
		this.life_value; // % of life left
		this.image;
	}
	
	init(){
		//Physical
		this.position = new Vector(((random_normal_distribution() * window.innerWidth)|0), ((random_normal_distribution() * window.innerHeight)|0));
		this.max_radius = random_normal_distribution() * Math.min(this.id, 8) * 0.5 + 1;
		
		//Emotional
		this.current_life = 0;
		this.lifespan = random_normal_distribution() * 400;
		this.life_value = 1 - this.current_life / this.lifespan;
		this.spawn_time = Math.ceil(Math.random() * 8) + 1;
	}
	
	update(){
		
		//Checks if the particle is dead
		if(this.lifespan <= ++this.current_life){
			//Un-dead it
			this.init();
		}
		
		//Doesn't just spawn into existance, it grows!
		if(this.current_life < this.spawn_time){
			this.radius = this.max_radius * this.current_life / this.spawn_time; 
		}else{
			this.radius = this.max_radius;
		}
		
		//Set the life value
		this.life_value = 1 - this.current_life / this.lifespan;
		this.life_value = this.life_value < 0 ? 0 : this.life_value;
		//Change the radius
		//this.radius *= this.life_value;
	}
	
	draw(ctx){
		
		if("undefined" == typeof this.image){
			//Draw circle
			var c = (255 * this.life_value)|0;
			ctx.fillStyle="rgba("+c+","+c+","+c+",1)";
			ctx.beginPath();
			ctx.arc(this.position.x|0,this.position.y|0,this.radius * this.life_value,0,2*Math.PI);
			ctx.fill();
		}
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
		this.radius;
		this.speed;
		this.length;
		this.trail_width;
		
		//Position Attributes
		this.direction = new Vector(this.id%2 == 1 ? -1 : 1,((Math.random() * 3)|0) - 1);;
		this.position = new Vector((Math.random() * window.innerWidth)|0,(random_normal_distribution() * window.innerHeight)|0);
		this.velocity = new Vector(this.speed * this.direction.x,0);

		//Direction change timer variables
		this.dct;
		this.dctm;

		//Vertex array for drawing the particle trail
		this.vertices;
		this.image;
	}
	
	init(){
		//Physical attributes
		this.radius = Math.ceil(this.id % 4 * random_normal_distribution()) + 3;
		this.speed = this.radius / 18;
		this.length = 600 + (Math.random() * 150 * this.radius)|0;
		this.trail_width = Math.ceil(this.radius / 3);

		this.dct = 0;
		
		//Vertex array for drawing the particle trail
		this.vertices = [];
		
		//Set new vertex
		this.change_direction();
		
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
			this.direction.y = 0;
			this.init();
		}
		
		//Off the left side
		if(this.vertices[0].x < 0 && -1 == this.direction.x){
			this.position = new Vector((Math.random() * 100)|0 + window.innerWidth,(random_normal_distribution() * window.innerHeight)|0);
			this.direction.y = 0;
			this.init();
		}
	}
	
	draw(ctx){
		
		
		
		//Set trail width
		ctx.lineWidth=this.trail_width;
		
		//Prepare the gradient to make the trail fade out
		var my_gradient=ctx.createLinearGradient(this.position.x - this.length * this.direction.x,0,this.position.x,0);
		my_gradient.addColorStop(0,"rgba(255,255,255,0)");
		my_gradient.addColorStop(1,"rgba(255,255,255,1)");
		ctx.strokeStyle = my_gradient;

		//Draw trail
		ctx.beginPath();
		ctx.moveTo(this.vertices[0].x,this.vertices[0].y);
		for(var i = 1; i < this.vertices.length; i++){
			ctx.lineTo(this.vertices[i].x,this.vertices[i].y);
		}
		ctx.lineTo(this.position.x,this.position.y);
		ctx.stroke();
		
		if("undefined" == typeof this.image){
			//Draw circle
			var c =((255 * this.radius * this.magic_opacity_constant)|0);
			var c = 255;
			ctx.fillStyle="rgba("+ c +","+ c +","+ c +",1)";
			ctx.beginPath();
			ctx.arc(this.position.x|0,this.position.y|0,this.radius,0,2*Math.PI);
			ctx.fill();
		}else{
			
		}
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

//Image library to load images
class ImageLibrary{
	constructor(){
		this.image = [];
		this.image_count = 0;
		this.images_loaded = 0;
		this.onload_func;
	}
	
	//Adds a new image to be loaded
	new_image(name,src){
		//Ensure proper types
		if("string" != typeof name || "string" != typeof src)
			return false;
		
		//Ensure it doesn't overwrite an image
		if("undefined" != typeof this.image[name])
			return false;
		
		//Set the image up to load
		var self = this;
		this.image[name] = new Image;
		this.image[name].onload = function(){
			self.on_image_load();
		};
		this.image[name].src = src;
	}
	
	//Naming style changed to match native javascript
	onload(func){
		this.onload_func = func;
	}
	
	//Runs the onload function if all of the images are loaded
	on_image_load(){
		if(++this.images_loaded < this.image_count)
			return false;
		
		if("undefined" != typeof this.onload_func)
			this.onload_func();
	}
	
}
