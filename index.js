var http = require('http'),
	https = require('https'),
	cheerio = require('cheerio');


var shorthandProperties = {
	"image": "image:url",
	"video": "video:url",
	"audio": "audio:url"
}


module.exports = function(url, cb, options){
	exports.getHTML(url, function(html){
		cb(null, exports.parse(html, options));
	})
}


exports.getHTML = function(url, cb){
	var protocol = require('url').parse(url).protocol;
	var httpModule = protocol === 'https:'
		? https
		: http;
	
	httpModule.get(url, function(res){
		res.setEncoding('utf-8');
		
		var html = "";
		
		res.on('data', function(data){
			html += data;
		});
		
		res.on('end', function(){
			if (res.statusCode >= 300 && res.statusCode < 400)
			{
				exports.getHTML(res.headers.location, cb);
			}
			else
			{
				cb(html);
			}
			
		});
	});
}


exports.parse = function(html, options){
	options = options || {};
	
	var $ = cheerio.load(html);
	
	// Check for xml namespace
	var namespace,
		attribs = $('html')[0].attribs,
		attribKeys = Object.keys(attribs),
		numberOfAttribs = attribKeys.length;
	
	for (var i = 0; i < numberOfAttribs; ++i){
		var attrName = attribKeys[i],
			attrValue = attribs[attrName];
		
		if (attrValue.toLowerCase() === 'http://opengraphprotocol.org/schema/'
			&& attrName.substring(0, 6) == 'xmlns:')
		{
			namespace = attrName.substring(6);
			break;
		}
	}
	
	if (!namespace) 
		// If no namespace is explicitly set..
		if (options.strict)
			// and strict mode is specified, abort parse.
			return null;
		else
			// and strict mode is not specific, then default to "og"
			namespace = "og";
	
	var meta = {},
		metaTags = $('meta');
	
	metaTags.each(function() {
		var tagAttribs = this[0].attribs,
			propertyAttr = tagAttribs['property'];
		
		// If meta element isn't an "og:" property, skip it
		if (!propertyAttr || propertyAttr.substring(0, namespace.length) !== namespace)
			return;
		
		var property = propertyAttr.substring(namespace.length+1),
			content = tagAttribs['content'];
		
		// If property is a shorthand for a longer property,
		// Use the full property
		property = shorthandProperties[property] || property;
		
		
		var key, tmp,
			ptr = meta,
			keys = property.split(':');

		// we want to leave one key to assign to so we always use references
		// as long as there's one key left, we're dealing with a sub-node and not a value

		while (keys.length > 1) {
			key = keys.shift();

			if (Array.isArray(ptr[key])) {
				// the last index of ptr[key] should become
				// the object we are examining.
				tmp = ptr[key].length-1;
				ptr = ptr[key];
				key = tmp;
			}

			if (typeof ptr[key] === 'string') {
				// if it's a string, convert it
				ptr[key] = { '': ptr[key] };
			} else if (ptr[key] === undefined) {
				// create a new key
				ptr[key] = {};
			}

			// move our pointer to the next subnode
			ptr = ptr[key];
		}

		// deal with the last key
		key = keys.shift();

		if (ptr[key] === undefined) {
			ptr[key] = content;
		} else if (Array.isArray(ptr[key])) {
			ptr[key].push(content);
		} else {
			ptr[key] = [ ptr[key], content ];
		}
	});
	
	return meta;
}