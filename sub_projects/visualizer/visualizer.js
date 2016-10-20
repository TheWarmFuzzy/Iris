class Visualizer{
	constructor(){
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext("2d");
		
		this.canvas_buffer = document.createElement('canvas');
		this.ctx_buffer = this.canvas_buffer.getContext("2d");
		
		this.canvas_mask = document.createElement('canvas');
		this.ctx_mask = this.canvas_mask.getContext("2d");
		
		this.canvas.id = "canvas_visualizer";
		this.canvas.width = this.canvas_buffer.width = this.canvas_mask.width = 500;
		this.canvas.height = this.canvas_buffer.height = this.canvas_mask.height = 500;
		
		this.ctx.fillRect(0,0,500,500);
		document.body.appendChild(this.canvas);
		
		
		
		
	}
	
	start(){
		var self = this;
		this.update_timer = setInterval(function(){self.update();}, 1000/60);
	}
	
	update(){
		console.log(this);
	}
}


class particle{
	constructor(){
		this.x = 250;
		this.y = 250;
		this.radius = 3;
		
	}
	
	update(){
		
	}
	
}