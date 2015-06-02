var http = require('http'),
	https = require('https'),
	cheerio = require('cheerio');


var shorthandProperties = {
	"image": "image:url",
	"video": "video:url",
	"audio": "audio:url"
}
var iconv  = require('iconv-lite'),
    jschardet = require("jschardet");


exports = module.exports = function(url, cb, options){
	exports.getHTML(url, function(err, html){
		if (err) return cb(err);

		var $ = cheerio.load(html);
		cb(null, exports.parse($, options));
	})
}


exports.getHTML = function(url, cb){
	var purl = require('url').parse(url);
	
	if (!purl.protocol)
		purl = require('url').parse("http://"+url);
	
	var httpModule = purl.protocol === 'https:'
		? https
		: http;
	
	url = require('url').format(purl);
	try{
		var client = httpModule.get(url, function(res){
			var chunks = [];
			var matched = undefined;
			if (res.headers['content-type']){
				matched = res.headers['content-type'].match(/charset=(.*)/i);
			}
			var encode = undefined;
			if (matched){
				encode = matched[1];
			}

			res.on('data', function(data){
				try{
					chunks.push(data);
				}catch(ex){
				}
			});
			res.on('end', function(){
				if (res.statusCode >= 300 && res.statusCode < 400)
				{
					exports.getHTML(res.headers.location, cb);
				}
				else
				{
					var html = "";
					try{
						html = iconv.decode(Buffer.concat(chunks), jschardet.detect(Buffer.concat(chunks))['encoding']);
					}catch(ex){
						html = iconv.decode(Buffer.concat(chunks), 'utf-8');
					}
					cb(null, html);
				}
			});
		});
		
		client.on('error', function(err){
			cb(err);
		});
	}catch(ex){
		cb(ex);
	}
}


exports.parse = function($, options){
	options = options || {};
	
	// Check for xml namespace
	var namespace,
		$html = $('html');
	
	if ($html.length)
	{
		var attribKeys = Object.keys($html[0].attribs);
		
		attribKeys.some(function(attrName){
			var attrValue = $html.attr(attrName);
			
			if (attrValue.toLowerCase() === 'http://opengraphprotocol.org/schema/'
				&& attrName.substring(0, 6) == 'xmlns:')
			{
				namespace = attrName.substring(6);
				return false;
			}
		})
	}
	else if (options.strict)
		return null;
	
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
	meta.og = {};
	meta.twitter = {};
	var ogNamespace = "og";
	var twitterNamespace = 'twitter';
	metaTags.each(function() {
		var element = $(this);
			propertyAttr = element.attr('property'), 
			nameAttr = element.attr('name');
		var ptr;
		namespace = "";
		if (propertyAttr && propertyAttr.substring(0, ogNamespace.length) == ogNamespace){
			namespace = ogNamespace;
			ptr = meta.og;
		}

		if (nameAttr && nameAttr.substring(0, twitterNamespace.length) == twitterNamespace){
			namespace = twitterNamespace;
			propertyAttr = nameAttr;
			ptr = meta.twitter;
		}
		if (nameAttr && nameAttr.substring(0, ogNamespace.length) == ogNamespace){
			namespace = ogNamespace;
			propertyAttr = nameAttr;
			ptr = meta.og;
		}

		// If meta element isn't an "og:" property, skip it
		if ( namespace === ""){
			if (nameAttr){
				meta[nameAttr] = element.attr('content');
			}
			return;
		}
		
		var property = propertyAttr.substring(namespace.length+1),
			content = element.attr('content');
		
		// If property is a shorthand for a longer property,
		// Use the full property
		property = shorthandProperties[property] || property;
		
		
		var	keys = property.split(':');

		// we want to leave one key to assign to so we always use references
		// as long as there's one key left, we're dealing with a sub-node and not a value

		extractMeta(ptr, keys, content);

	});
	
	return meta;
}

function extractMeta(ptr, keys, content){
	var key, tmp;
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
}