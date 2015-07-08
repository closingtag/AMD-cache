/**
 * AMD-cache, a loader plugin for AMD loaders.
 *
 * Available via the MIT or new BSD license.
 *
 * Copyright (c) 2011 Jens Arps
 *
 * The xhr code is taken from the RequireJS text plugin:
 *
 * @license RequireJS text 0.26.0 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * see: http://github.com/jrburke/requirejs for details
 */

(function () {

	define(function () {

		var cache = {

		  	defaultCache: '7d',

		  	multiplier: {
		  		d: 86400000,
		  		h: 3600000,
		  		m: 60000,
		  		s: 1000
		  	},

		  	storage: (function() {

		  		var storage, fail, uid;

		  		try {

		  			uid = new Date;
		  			(storage = window.localStorage).setItem(uid, uid);
		  			fail = storage.getItem(uid) != uid;
		  			storage.removeItem(uid);
		  			fail && (storage = false);

				} catch (e) {}

				return storage;

			}()),

			get: function (url, callback) {

				var xhr = new XMLHttpRequest();

				xhr.open('GET', url, true);

				xhr.onreadystatechange = function (evt) {
					if ( xhr.readyState === 4 ) {

						if ( ( xhr.status === 200 ) || ( ( xhr.status === 0 ) && xhr.responseText ) ) {

							if ( callback && typeof callback === 'function' ) {

								callback(xhr.responseText);
							}

						} else {

							console.log('Could not load file ' + src);
						}
					}
				};
				xhr.send(null);
			},

			validate: function(saved, timeframe) {
				var now = new Date().getTime();
				var matcher = timeframe.match(/^(\d+)([dhms]{1})$/);

				if (matcher) {

					timeframe = +matcher[1] * this.multiplier[matcher[2]];

					return (saved + timeframe) >= now;
				}
				else {
					return false;
				}

				return false;
			},

			load: function (name, req, load, config) {

				var url, timeToLive;
				var cached = {};

				if ( ~name.indexOf(':') ) {
					timeToLive = name.split(':')[0];
					name = name.split(':')[1];
				}
				else {
					timeToLive = this.defaultCache;
				}

				url = req.toUrl(name);

				var xhrCallback = function(content) {

					cached = {
						savedOn: new Date().getTime(),
						content: content,
						url: url
					};

					load.fromText(name, content);

					req([name], function (content) {
						load(content);
					});

					try {
						localStorage.setItem(name, JSON.stringify(cached));
					}
					catch (e) {}
				};

				if ( this.storage ) {

					cached = JSON.parse(this.storage.getItem(name));

					if ( cached ) {

						if ( this.validate(cached.savedOn, timeToLive) ) {

							load.fromText(name, cached.content);
						}
						else {

							this.get(url, xhrCallback);
							return;
						}
					}
					else {
						this.get(url, xhrCallback);
						return;
					}

					req([name], function (content) {
						load(content);
					});
				}
			}
		};

		return cache;
	});

}());
