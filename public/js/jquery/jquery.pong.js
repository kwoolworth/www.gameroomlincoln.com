(function($) {

	$.fn.PONG = function(options) {
	
		var defaults = {
			'run' : true,
			'control' : false,
			'time' : false,
			'alpha' : 1.0,
			'face' : {
				'visible' : true,
				'fill' : '#FFFFFF',
				'stroke' : '#000000',
			},
			'indicators' : {
				'visible' : true,
				'fill' : '#FFFFFF',
				'stroke' : false,
			},
			'hour' : {
				'visible' : true,
				'fill' : '#000000',
				'stroke' : false,
			},
			'minute' : {
				'visible' : true,
				'fill' : '#999999',
				'stroke' : false,
			},
			'second' : {
				'visible' : true,
				'fill' : '#FF0000',
				'stroke' : false,
			}
		};
	
		var options = $.extend({}, defaults, options);
	
		function Clock(canvas, options) {
			
			this.options = options;
			this.time = false;
			this.canvas = {
				'context' : $(canvas)[0].getContext('2d'),
				'width' : $(canvas).innerWidth(),
				'height' : $(canvas).innerHeight()
			};
			this.origin = {
				'x' : this.canvas.width / 2,
				'y' : this.canvas.width / 2
			};
			this.radius = this.canvas.width / 2;
			this.interval = null;
			this.initialized = false;
		
			this.run = function() {
			
				var clock = this;
				
				clock.initCanvas();
				
				if(clock.options.time !== false){
					clock.time = new Date(this.options.time);
				} else {
					clock.time = new Date();
				}
				
				window.clearInterval(clock.interval);
				
				if(clock.options.run) {
					clock.interval = setInterval(function() {
						clock.time.setTime(clock.time.valueOf() + 1000);
						clock.draw(clock.time);
					},1000);
				} else {
					clock.draw(clock.time);
				}
			
			};
			
			this.toggle = function() {
				this.options.run = !this.options.run;
				this.run();
			};
			
			this.initCanvas = function() {
				
				if(!this.initialized) {
					
					$(canvas)[0].width = this.canvas.width;
					$(canvas)[0].height = this.canvas.height;
			
					this.clearCanvas();
					
					this.initialized = true;
				
				}
			
			};
		
			this.clearCanvas = function() {
			
				this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			
			};
		
			this.draw = function(time) {
			
				this.clearCanvas();
				
				this.canvas.context.globalAlpha = this.options.alpha;
				
				if(this.options.face.visible){
					this.drawFace();
				}
				if(this.options.indicators.visible){
					this.drawIndicators();
				}
				if(this.options.hour.visible){
					this.drawHourHand(time.getHours());
				}
				if(this.options.minute.visible){
					this.drawMinuteHand(time.getMinutes());
				}
				if(this.options.second.visible){
					this.drawSecondHand(time.getSeconds());
				}
			
			};
			
			this.drawFace = function() {
				
				this.canvas.context.beginPath();
				this.canvas.context.arc(this.origin.x, this.origin.x, this.radius - (this.canvas.width * 0.1) / 2, 0, Math.PI * 2, false);
				this.canvas.context.closePath();
				this.canvas.context.lineWidth = this.canvas.width * 0.1;
				this.setStroke(this.options.face.stroke);
				this.setFill(this.options.face.fill);
				this.canvas.context.stroke();
				this.canvas.context.fill();
				
			};
			
			this.drawIndicators = function() {
			
				var large_indicator_radius = this.radius * 0.05;
				var small_indicator_radius = this.radius * 0.03;
				var indicator_radius = this.radius - large_indicator_radius * 2;
				
				for(i = 0; i < 12; i++) {
				
					var angle = i * 30 * Math.PI / 180;
				
					var x = this.origin.x + indicator_radius * Math.cos(angle);
					var y = this.origin.y + indicator_radius * Math.sin(angle);
					
					this.canvas.context.beginPath();
					if(i % 3 == 0){
						this.canvas.context.arc(x, y, large_indicator_radius, 0, Math.PI * 2, true);
					} else {
						this.canvas.context.arc(x, y, small_indicator_radius, 0, Math.PI * 2, true);
					}
					this.canvas.context.closePath();
					this.canvas.context.lineWidth = this.canvas.width * 0.01;
					this.setStroke(this.options.indicators.stroke);
					this.setFill(this.options.indicators.fill);
					this.canvas.context.stroke();
					this.canvas.context.fill();
				
				}
			
			};
		
			this.drawHourHand = function(hour){
			
				var hour_hand_length = this.radius * 0.5;
				var hour_hand_angle = (Math.PI / 180) * 30 * hour - Math.PI * 3 / 2;
				var hour_hand_start_angle = ((Math.PI / 180) * 30 * hour);
				var hour_hand_end_angle = ((Math.PI / 180) * 30 * hour) + Math.PI;
				var hour_hand_middle_radius = this.radius * 0.1;
				var hour_hand_end_radius = hour_hand_middle_radius / 3;
				var hour_hand_end_origin = {
					'x' : this.origin.x - hour_hand_length * Math.cos(hour_hand_angle),
					'y' : this.origin.y - hour_hand_length * Math.sin(hour_hand_angle)
				};
				
				this.canvas.context.beginPath();
				this.canvas.context.arc(this.origin.x, this.origin.y, hour_hand_middle_radius, hour_hand_start_angle, hour_hand_end_angle, false);
				this.canvas.context.arc(hour_hand_end_origin.x, hour_hand_end_origin.y, hour_hand_end_radius, hour_hand_end_angle, hour_hand_start_angle, false);
				this.canvas.context.closePath();
				this.canvas.context.lineWidth = this.canvas.width * 0.01;
				this.setStroke(this.options.hour.stroke);
				this.setFill(this.options.hour.fill);
				this.canvas.context.stroke();
				this.canvas.context.fill();
			
			};
		
			this.drawMinuteHand = function(minute) {
				
				var minute_hand_length = this.radius * 0.6;
				var minute_hand_angle = (Math.PI / 180) * 6 * minute - Math.PI * 3 / 2;
				var minute_hand_start_angle = ((Math.PI / 180) * 6 * minute);
				var minute_hand_end_angle = ((Math.PI / 180) * 6 * minute) + Math.PI;
				var minute_hand_middle_radius = this.radius * 0.05;
				var minute_hand_end_radius = minute_hand_middle_radius / 3;
				var minute_hand_end_origin = {
					'x' : this.origin.x - minute_hand_length * Math.cos(minute_hand_angle),
					'y' : this.origin.y - minute_hand_length * Math.sin(minute_hand_angle)
				};
				
				this.canvas.context.beginPath();
				this.canvas.context.arc(this.origin.x, this.origin.y, minute_hand_middle_radius, minute_hand_start_angle, minute_hand_end_angle, false);
				this.canvas.context.arc(minute_hand_end_origin.x, minute_hand_end_origin.y, minute_hand_end_radius, minute_hand_end_angle, minute_hand_start_angle, false);
				this.canvas.context.closePath();
				this.canvas.context.lineWidth = this.canvas.width * 0.01;
				this.setStroke(this.options.minute.stroke);
				this.setFill(this.options.minute.fill);
				this.canvas.context.stroke();
				this.canvas.context.fill();
			
			};
		
			this.drawSecondHand = function(second) {
			
				var second_hand_length = this.radius * 0.8;
				var second_hand_angle = (Math.PI / 180) * 6 * second - Math.PI * 3 / 2;
				var second_hand_start_angle = ((Math.PI / 180) * 6 * second);
				var second_hand_end_angle = ((Math.PI / 180) * 6 * second) + Math.PI;
				var second_hand_middle_radius = this.radius * 0.02;
				var second_hand_end_radius = second_hand_middle_radius / 3;
				var second_hand_end_origin = {
					'x' : this.origin.x - second_hand_length * Math.cos(second_hand_angle),
					'y' : this.origin.y - second_hand_length * Math.sin(second_hand_angle)
				};
				
				this.canvas.context.beginPath();
				this.canvas.context.arc(this.origin.x, this.origin.y, second_hand_middle_radius, second_hand_start_angle, second_hand_end_angle, false);
				this.canvas.context.arc(second_hand_end_origin.x, second_hand_end_origin.y, second_hand_end_radius, second_hand_end_angle, second_hand_start_angle, false);
				this.canvas.context.closePath();
				this.canvas.context.lineWidth = this.canvas.width * 0.01;
				this.setStroke(this.options.second.stroke);
				this.setFill(this.options.second.fill);
				this.canvas.context.stroke();
				this.canvas.context.fill();
			
			};
			
			this.setFill = function(fill) {
				if(fill !== false){
					if(typeof(fill) == 'string') {
						this.canvas.context.fillStyle = fill;
					}
				} else {
					this.canvas.context.fillStyle = 'transparent';
				}
			};
			
			this.setStroke = function(stroke) {
				if(stroke !== false){
					if(typeof(stroke) == 'string') {
						this.canvas.context.strokeStyle = stroke;
					}
				} else {
					this.canvas.context.strokeStyle = 'transparent';
				}
			};
		
		};
	
		$(this).each(function(index) {
		
			if($(this).is('canvas')){
				
				var canvas = this;
				
				/* Make sure canvas is actually on screen before drawing!! */
				var visible_timeout = setInterval(function() {
					if($(canvas).parents().is(':visible') && $(canvas).parents().css('display') != 'none'){
						var clock = new Clock(canvas, options);
						clock.run();
						if(options.control !== false) {
							$(options.control).click(function(){
								clock.toggle();
							});
						}
						clearInterval(visible_timeout);
					}
				},100);
		
			}
		
		});
	
	};
	
})(jQuery);