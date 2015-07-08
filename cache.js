/**
 * AMD-cache, a loader plugin for AMD loaders.
 *
 * Available via the MIT or new BSD license.
 * Copyright (c) 2011 Jens Arps
 * Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 */

!function(){define(function(){var a={defaultCache:"7d",multiplier:{d:864e5,h:36e5,m:6e4,s:1e3},storage:function(){var a,b,c;try{c=new Date,(a=window.localStorage).setItem(c,c),b=a.getItem(c)!=c,a.removeItem(c),b&&(a=!1)}catch(d){}return a}(),get:function(a,b){var c=new XMLHttpRequest;c.open("GET",a,!0),c.onreadystatechange=function(){4===c.readyState&&(200===c.status||0===c.status&&c.responseText?b&&"function"==typeof b&&b(c.responseText):console.log("Could not load file "+src))},c.send(null)},validate:function(a,b){var c=(new Date).getTime(),d=b.match(/^(\d+)([dhms]{1})$/);return d?(b=+d[1]*this.multiplier[d[2]],a+b>=c):!1},load:function(a,b,c){var e,f,g={};~a.indexOf(":")?(f=a.split(":")[0],a=a.split(":")[1]):f=this.defaultCache,e=b.toUrl(a);var h=function(d){g={savedOn:(new Date).getTime(),content:d,url:e},c.fromText(a,d),b([a],function(a){c(a)});try{localStorage.setItem(a,JSON.stringify(g))}catch(f){}};if(this.storage){if(g=JSON.parse(this.storage.getItem(a)),!g)return this.get(e,h),void 0;if(!this.validate(g.savedOn,f))return this.get(e,h),void 0;c.fromText(a,g.content),b([a],function(a){c(a)})}}};return a})}();
