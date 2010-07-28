var gameroomlincoln = {
	
	run : function() {
		
		gameroomlincoln.loadBlog();
		gameroomlincoln.initPONG();
		
	},
	
	loadBlog : function() {
		
		$('img.loading').css('display', 'block');
		
		$.getJSON('http://staff.tumblr.com/api/read/json?num=5&callback=?', function(data){
			gameroomlincoln.fillBlog(data);
			$('img.loading').css('display', 'none');
		});
		
	},
	
	fillBlog : function(data) {
		
		//alert(data.posts[1]['regular-title']);
		
	},
	
	initPONG : function() {
		
		$('canvas.game').PONG();
		
	}
	
};