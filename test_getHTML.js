var t = require('./index.js');

// Basic test
t.getHTML('http://detail.ju.taobao.com/home.htm?spm=608.5847457.floor1.2.6uaiDN&id=10000005702641&item_id=41307082785'
	,function(err, html){
		if (err) return cb(err);
		console.log(html);
	});

// Basic test
t.getHTML('https://tw.news.yahoo.com/%E8%A2%AB%E8%A9%95%E4%BC%B0%E9%9B%A3%E6%95%99%E5%8C%96-%E9%84%AD%E6%8D%B7%E5%86%B7%E6%BC%A0%E4%BB%A5%E5%B0%8D-041134386.html'
	,function(err, html){
		if (err) return cb(err);
		console.log(html);
	});

// This is make encode detection return "null"
t.getHTML('http://www.clipular.com/c/5643689918464000.png?k=M4PZxrdBmut-NOvy-vCeSvRvs-Y'
	,function(err, html){
		if (err) return ;
		console.log(html);
	});