(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-24e5e63a"],{"00d8":function(t,n){(function(){var n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",e={rotl:function(t,n){return t<<n|t>>>32-n},rotr:function(t,n){return t<<32-n|t>>>n},endian:function(t){if(t.constructor==Number)return 16711935&e.rotl(t,8)|4278255360&e.rotl(t,24);for(var n=0;n<t.length;n++)t[n]=e.endian(t[n]);return t},randomBytes:function(t){for(var n=[];t>0;t--)n.push(Math.floor(256*Math.random()));return n},bytesToWords:function(t){for(var n=[],e=0,r=0;e<t.length;e++,r+=8)n[r>>>5]|=t[e]<<24-r%32;return n},wordsToBytes:function(t){for(var n=[],e=0;e<32*t.length;e+=8)n.push(t[e>>>5]>>>24-e%32&255);return n},bytesToHex:function(t){for(var n=[],e=0;e<t.length;e++)n.push((t[e]>>>4).toString(16)),n.push((15&t[e]).toString(16));return n.join("")},hexToBytes:function(t){for(var n=[],e=0;e<t.length;e+=2)n.push(parseInt(t.substr(e,2),16));return n},bytesToBase64:function(t){for(var e=[],r=0;r<t.length;r+=3)for(var o=t[r]<<16|t[r+1]<<8|t[r+2],s=0;s<4;s++)8*r+6*s<=8*t.length?e.push(n.charAt(o>>>6*(3-s)&63)):e.push("=");return e.join("")},base64ToBytes:function(t){t=t.replace(/[^A-Z0-9+\/]/gi,"");for(var e=[],r=0,o=0;r<t.length;o=++r%4)0!=o&&e.push((n.indexOf(t.charAt(r-1))&Math.pow(2,-2*o+8)-1)<<2*o|n.indexOf(t.charAt(r))>>>6-2*o);return e}};t.exports=e})()},"1bea":function(t,n,e){},2144:function(t,n,e){"use strict";e.r(n);var r=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"signup"},[e("div",{staticClass:"chat-form-main"},[e("h3",{staticClass:"title"},[t._v("聊天室")]),e("div",{staticClass:"form-item-control"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.userName,expression:"userName"}],attrs:{type:"text"},domProps:{value:t.userName},on:{input:function(n){n.target.composing||(t.userName=n.target.value)}}})]),e("div",{staticClass:"form-item-control"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.passWord,expression:"passWord"}],attrs:{type:"password",id:"signinBtn"},domProps:{value:t.passWord},on:{input:function(n){n.target.composing||(t.passWord=n.target.value)}}})]),e("div",{staticClass:"form-item-control"},[e("button",{staticClass:"btn btn-primary btn-block",attrs:{type:"button",id:"signin"},on:{click:t.signin}},[t._v(" 登录 ")])]),e("div",{staticClass:"form-item-control"},[e("button",{staticClass:"btn btn-block",attrs:{type:"button"},on:{click:t.touristGo}},[t._v(" 游客身份进入 ")])]),e("a",{staticClass:"link signup-link",attrs:{href:"javascript:;"},on:{click:t.signup}},[t._v("快速注册")])])])},o=[],s=e("6821"),i=e.n(s),a=e("c20c"),u={name:"signin",data:function(){return{userName:"",passWord:""}},methods:{signin:function(){var t=this;Object(a["a"])({userName:this.userName,passWord:i()(this.passWord)}).then((function(n){"0"===n.code&&n.data&&(console.log(n,"res:登录"),window.localStorage.setItem("userName",n.data.userName),window.localStorage.setItem("token",n.token),t.$socket.emit("add user",n.data.userName),t.$router.push("/")),console.log(n,"response")})).catch((function(t){alert("用户名或密码错误")}))},touristGo:function(){this.$router.push("/")},signup:function(){this.$router.push("/signup")},signinEnter:function(){var t=document.getElementById("signinInput");t.addEventListener("keyup",(function(t){t.preventDefault(),13===t.keyCode&&document.getElementById("signinBtn").click()}))}}},c=u,l=(e("ee64"),e("2877")),f=Object(l["a"])(c,r,o,!1,null,null,null);n["default"]=f.exports},6821:function(t,n,e){(function(){var n=e("00d8"),r=e("9a63").utf8,o=e("044b"),s=e("9a63").bin,i=function(t,e){t.constructor==String?t=e&&"binary"===e.encoding?s.stringToBytes(t):r.stringToBytes(t):o(t)?t=Array.prototype.slice.call(t,0):Array.isArray(t)||(t=t.toString());for(var a=n.bytesToWords(t),u=8*t.length,c=1732584193,l=-271733879,f=-1732584194,d=271733878,p=0;p<a.length;p++)a[p]=16711935&(a[p]<<8|a[p]>>>24)|4278255360&(a[p]<<24|a[p]>>>8);a[u>>>5]|=128<<u%32,a[14+(u+64>>>9<<4)]=u;var g=i._ff,h=i._gg,v=i._hh,m=i._ii;for(p=0;p<a.length;p+=16){var b=c,y=l,w=f,T=d;c=g(c,l,f,d,a[p+0],7,-680876936),d=g(d,c,l,f,a[p+1],12,-389564586),f=g(f,d,c,l,a[p+2],17,606105819),l=g(l,f,d,c,a[p+3],22,-1044525330),c=g(c,l,f,d,a[p+4],7,-176418897),d=g(d,c,l,f,a[p+5],12,1200080426),f=g(f,d,c,l,a[p+6],17,-1473231341),l=g(l,f,d,c,a[p+7],22,-45705983),c=g(c,l,f,d,a[p+8],7,1770035416),d=g(d,c,l,f,a[p+9],12,-1958414417),f=g(f,d,c,l,a[p+10],17,-42063),l=g(l,f,d,c,a[p+11],22,-1990404162),c=g(c,l,f,d,a[p+12],7,1804603682),d=g(d,c,l,f,a[p+13],12,-40341101),f=g(f,d,c,l,a[p+14],17,-1502002290),l=g(l,f,d,c,a[p+15],22,1236535329),c=h(c,l,f,d,a[p+1],5,-165796510),d=h(d,c,l,f,a[p+6],9,-1069501632),f=h(f,d,c,l,a[p+11],14,643717713),l=h(l,f,d,c,a[p+0],20,-373897302),c=h(c,l,f,d,a[p+5],5,-701558691),d=h(d,c,l,f,a[p+10],9,38016083),f=h(f,d,c,l,a[p+15],14,-660478335),l=h(l,f,d,c,a[p+4],20,-405537848),c=h(c,l,f,d,a[p+9],5,568446438),d=h(d,c,l,f,a[p+14],9,-1019803690),f=h(f,d,c,l,a[p+3],14,-187363961),l=h(l,f,d,c,a[p+8],20,1163531501),c=h(c,l,f,d,a[p+13],5,-1444681467),d=h(d,c,l,f,a[p+2],9,-51403784),f=h(f,d,c,l,a[p+7],14,1735328473),l=h(l,f,d,c,a[p+12],20,-1926607734),c=v(c,l,f,d,a[p+5],4,-378558),d=v(d,c,l,f,a[p+8],11,-2022574463),f=v(f,d,c,l,a[p+11],16,1839030562),l=v(l,f,d,c,a[p+14],23,-35309556),c=v(c,l,f,d,a[p+1],4,-1530992060),d=v(d,c,l,f,a[p+4],11,1272893353),f=v(f,d,c,l,a[p+7],16,-155497632),l=v(l,f,d,c,a[p+10],23,-1094730640),c=v(c,l,f,d,a[p+13],4,681279174),d=v(d,c,l,f,a[p+0],11,-358537222),f=v(f,d,c,l,a[p+3],16,-722521979),l=v(l,f,d,c,a[p+6],23,76029189),c=v(c,l,f,d,a[p+9],4,-640364487),d=v(d,c,l,f,a[p+12],11,-421815835),f=v(f,d,c,l,a[p+15],16,530742520),l=v(l,f,d,c,a[p+2],23,-995338651),c=m(c,l,f,d,a[p+0],6,-198630844),d=m(d,c,l,f,a[p+7],10,1126891415),f=m(f,d,c,l,a[p+14],15,-1416354905),l=m(l,f,d,c,a[p+5],21,-57434055),c=m(c,l,f,d,a[p+12],6,1700485571),d=m(d,c,l,f,a[p+3],10,-1894986606),f=m(f,d,c,l,a[p+10],15,-1051523),l=m(l,f,d,c,a[p+1],21,-2054922799),c=m(c,l,f,d,a[p+8],6,1873313359),d=m(d,c,l,f,a[p+15],10,-30611744),f=m(f,d,c,l,a[p+6],15,-1560198380),l=m(l,f,d,c,a[p+13],21,1309151649),c=m(c,l,f,d,a[p+4],6,-145523070),d=m(d,c,l,f,a[p+11],10,-1120210379),f=m(f,d,c,l,a[p+2],15,718787259),l=m(l,f,d,c,a[p+9],21,-343485551),c=c+b>>>0,l=l+y>>>0,f=f+w>>>0,d=d+T>>>0}return n.endian([c,l,f,d])};i._ff=function(t,n,e,r,o,s,i){var a=t+(n&e|~n&r)+(o>>>0)+i;return(a<<s|a>>>32-s)+n},i._gg=function(t,n,e,r,o,s,i){var a=t+(n&r|e&~r)+(o>>>0)+i;return(a<<s|a>>>32-s)+n},i._hh=function(t,n,e,r,o,s,i){var a=t+(n^e^r)+(o>>>0)+i;return(a<<s|a>>>32-s)+n},i._ii=function(t,n,e,r,o,s,i){var a=t+(e^(n|~r))+(o>>>0)+i;return(a<<s|a>>>32-s)+n},i._blocksize=16,i._digestsize=16,t.exports=function(t,e){if(void 0===t||null===t)throw new Error("Illegal argument "+t);var r=n.wordsToBytes(i(t,e));return e&&e.asBytes?r:e&&e.asString?s.bytesToString(r):n.bytesToHex(r)}})()},"9a63":function(t,n){var e={utf8:{stringToBytes:function(t){return e.bin.stringToBytes(unescape(encodeURIComponent(t)))},bytesToString:function(t){return decodeURIComponent(escape(e.bin.bytesToString(t)))}},bin:{stringToBytes:function(t){for(var n=[],e=0;e<t.length;e++)n.push(255&t.charCodeAt(e));return n},bytesToString:function(t){for(var n=[],e=0;e<t.length;e++)n.push(String.fromCharCode(t[e]));return n.join("")}}};t.exports=e},ee64:function(t,n,e){"use strict";var r=e("1bea"),o=e.n(r);o.a}}]);