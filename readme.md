# Metadata Extractor (Open Graph, Twitter Cards , and others) for Node.js

An [Open Graph](http://ogp.me/) and [Twitter Cards](https://dev.twitter.com/cards) implementation for Node.js. 
Simple to use; give it a URL and it'll give you the open graph meta properties scraped from that URL.

## Install

	npm install git://github.com/chadliu23/node-open-graph --save

## Usage

```js
var og = require('open-graph');

var url = "http://github.com/samholmes/node-open-graph/raw/master/test.html";

og(url, function(err, meta){
	console.log(meta);
})
```

Outputs:

	{ og: 
	   { site_name: 'GitHub',
	     type: 'object',
	     image: { url: 'https://avatars1.githubusercontent.com/u/1700992?v=3&s=400' },
	     title: 'chadliu23/node-open-graph',
	     url: 'https://github.com/chadliu23/node-open-graph',
	     description: 'node-open-graph - An Open Graph implementation for Node.js.' },
	  twitter: 
	   { site: '@github',
	     card: 'summary',
	     title: 'chadliu23/node-open-graph',
	     description: 'node-open-graph - An Open Graph implementation for Node.js.',
	     image: { src: 'https://avatars1.githubusercontent.com/u/1700992?v=3&s=400' } },
	  'browser-stats-url': 'https://api.github.com/_private/browser/stats',
	  'browser-errors-url': 'https://api.github.com/_private/browser/errors',
	  'pjax-timeout': '1000',
	  'msapplication-TileImage': '/windows-tile.png',
	  'msapplication-TileColor': '#ffffff',
	  'selected-link': undefined,
	  'google-analytics': 'UA-3769691-2',
	  'octolytics-host': 'collector.githubapp.com',
	  'octolytics-script-host': 'collector-cdn.github.com',
	  'octolytics-app-id': 'github',
	  'octolytics-dimension-request_id': 'DDF974CE:301A:6DD7503:556D77C9',
	  'analytics-event': 'Rails, view, files#disambiguate',
	  dimension1: 'Logged Out',
	  dimension2: 'Header v3',
	  'is-dotcom': 'true',
	  hostname: 'github.com',
	  description: 'node-open-graph - An Open Graph implementation for Node.js.',
	  'go-import': 'github.com/chadliu23/node-open-graph git https://github.com/chadliu23/node-open-graph.git',
	  'octolytics-dimension-user_id': '1700992',
	  'octolytics-dimension-user_login': 'chadliu23',
	  'octolytics-dimension-repository_id': '29286619',
	  'octolytics-dimension-repository_nwo': 'chadliu23/node-open-graph',
	  'octolytics-dimension-repository_public': 'true',
	  'octolytics-dimension-repository_is_fork': 'true',
	  'octolytics-dimension-repository_parent_id': '27179645',
	  'octolytics-dimension-repository_parent_nwo': 'mvolz/node-open-graph',
	  'octolytics-dimension-repository_network_root_id': '12169151',
	  'octolytics-dimension-repository_network_root_nwo': 'samholmes/node-open-graph' 
  }


# Todo

1. **Better data types**  
	Convert properties to numbers, etc.
2. **Fallback data**  
	If Open Graph data isn't present, scrap img elements and document titles off the page.
