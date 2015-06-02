var og = require('./index.js');

var url = "https://github.com/chadliu23/node-open-graph";

og(url, function(err, meta){
    console.log(meta);
})