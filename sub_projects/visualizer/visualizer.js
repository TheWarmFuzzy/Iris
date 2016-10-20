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
		this.ctx_mask.fillStyle="rgba(0,0,0,1)";
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
		this.x = 250;
		this.y = 250;
		this.radius = 4;
		this.vertices = [];
		this.vertices[0] = [this.x - 800, this.y];
	}
	
	update(){
		this.x = (this.x + 1.5) % (1800 + this.radius * 2);
	}
	
	draw(ctx){
		ctx.fillStyle="#fff";
		ctx.beginPath();
		ctx.arc(this.x|0,this.y|0,this.radius,0,2*Math.PI);
		ctx.fill();
		
		ctx.lineWidth=2;
		
		var my_gradient=ctx.createLinearGradient(this.x - 800,0,this.x,0);
		my_gradient.addColorStop(0,"rgba(255,255,255,0)");
		my_gradient.addColorStop(1,"rgba(255,255,255,1)");
		ctx.strokeStyle = my_gradient;
		//ctx.fillRect(this.x - 800, this.y - 1, 800, 2);
		ctx.beginPath();
		ctx.moveTo(this.vertices[0][0],this.vertices[0][1]);
		for(var i = 1; i < this.vertices.length; i++){
			ctx.lineTo(this.vertices[i][0],this.vertices[i][1]);
		}
		ctx.lineTo(this.x,this.y);
		ctx.stroke();
	}
	
	shift_vertices(){
		
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