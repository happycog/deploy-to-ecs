var yaml = (function() {
  var module = {};
  /* js-yaml 3.5.3 https://github.com/nodeca/js-yaml */
  !function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.jsyaml=e()}}(function(){return function e(t,n,i){function r(a,s){if(!n[a]){if(!t[a]){var c="function"==typeof require&&require;if(!s&&c)return c(a,!0);if(o)return o(a,!0);var u=new Error("Cannot find module '"+a+"'");throw u.code="MODULE_NOT_FOUND",u}var l=n[a]={exports:{}};t[a][0].call(l.exports,function(e){var n=t[a][1][e];return r(n?n:e)},l,l.exports,e,t,n,i)}return n[a].exports}for(var o="function"==typeof require&&require,a=0;a<i.length;a++)r(i[a]);return r}({1:[function(e,t,n){"use strict";function i(e){return function(){throw new Error("Function "+e+" is deprecated and cannot be used.")}}var r=e("./js-yaml/loader"),o=e("./js-yaml/dumper");t.exports.Type=e("./js-yaml/type"),t.exports.Schema=e("./js-yaml/schema"),t.exports.FAILSAFE_SCHEMA=e("./js-yaml/schema/failsafe"),t.exports.JSON_SCHEMA=e("./js-yaml/schema/json"),t.exports.CORE_SCHEMA=e("./js-yaml/schema/core"),t.exports.DEFAULT_SAFE_SCHEMA=e("./js-yaml/schema/default_safe"),t.exports.DEFAULT_FULL_SCHEMA=e("./js-yaml/schema/default_full"),t.exports.load=r.load,t.exports.loadAll=r.loadAll,t.exports.safeLoad=r.safeLoad,t.exports.safeLoadAll=r.safeLoadAll,t.exports.dump=o.dump,t.exports.safeDump=o.safeDump,t.exports.YAMLException=e("./js-yaml/exception"),t.exports.MINIMAL_SCHEMA=e("./js-yaml/schema/failsafe"),t.exports.SAFE_SCHEMA=e("./js-yaml/schema/default_safe"),t.exports.DEFAULT_SCHEMA=e("./js-yaml/schema/default_full"),t.exports.scan=i("scan"),t.exports.parse=i("parse"),t.exports.compose=i("compose"),t.exports.addConstructor=i("addConstructor")},{"./js-yaml/dumper":3,"./js-yaml/exception":4,"./js-yaml/loader":5,"./js-yaml/schema":7,"./js-yaml/schema/core":8,"./js-yaml/schema/default_full":9,"./js-yaml/schema/default_safe":10,"./js-yaml/schema/failsafe":11,"./js-yaml/schema/json":12,"./js-yaml/type":13}],2:[function(e,t,n){"use strict";function i(e){return"undefined"==typeof e||null===e}function r(e){return"object"==typeof e&&null!==e}function o(e){return Array.isArray(e)?e:i(e)?[]:[e]}function a(e,t){var n,i,r,o;if(t)for(o=Object.keys(t),n=0,i=o.length;i>n;n+=1)r=o[n],e[r]=t[r];return e}function s(e,t){var n,i="";for(n=0;t>n;n+=1)i+=e;return i}function c(e){return 0===e&&Number.NEGATIVE_INFINITY===1/e}t.exports.isNothing=i,t.exports.isObject=r,t.exports.toArray=o,t.exports.repeat=s,t.exports.isNegativeZero=c,t.exports.extend=a},{}],3:[function(e,t,n){"use strict";function i(e,t){var n,i,r,o,a,s,c;if(null===t)return{};for(n={},i=Object.keys(t),r=0,o=i.length;o>r;r+=1)a=i[r],s=String(t[a]),"!!"===a.slice(0,2)&&(a="tag:yaml.org,2002:"+a.slice(2)),c=e.compiledTypeMap[a],c&&F.call(c.styleAliases,s)&&(s=c.styleAliases[s]),n[a]=s;return n}function r(e){var t,n,i;if(t=e.toString(16).toUpperCase(),255>=e)n="x",i=2;else if(65535>=e)n="u",i=4;else{if(!(4294967295>=e))throw new I("code point within a string may not be greater than 0xFFFFFFFF");n="U",i=8}return"\\"+n+j.repeat("0",i-t.length)+t}function o(e){this.schema=e.schema||S,this.indent=Math.max(1,e.indent||2),this.skipInvalid=e.skipInvalid||!1,this.flowLevel=j.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=i(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function a(e,t){for(var n,i=j.repeat(" ",t),r=0,o=-1,a="",s=e.length;s>r;)o=e.indexOf("\n",r),-1===o?(n=e.slice(r),r=s):(n=e.slice(r,o+1),r=o+1),n.length&&"\n"!==n&&(a+=i),a+=n;return a}function s(e,t){return"\n"+j.repeat(" ",e.indent*t)}function c(e,t){var n,i,r;for(n=0,i=e.implicitTypes.length;i>n;n+=1)if(r=e.implicitTypes[n],r.resolve(t))return!0;return!1}function u(e){this.source=e,this.result="",this.checkpoint=0}function l(e,t,n,i){var r,o,s,l,f,m,g,y,x,v,A,b,w,k,C,j,I,S,E,O,F;if(0===t.length)return void(e.dump="''");if(-1!==te.indexOf(t))return void(e.dump="'"+t+"'");for(r=!0,o=t.length?t.charCodeAt(0):0,s=L===o||L===t.charCodeAt(t.length-1),($===o||W===o||G===o||z===o)&&(r=!1),s||e.flowLevel>-1&&e.flowLevel<=n?(s&&(r=!1),l=!1,f=!1):(l=!i,f=!i),m=!0,g=new u(t),y=!1,x=0,v=0,A=e.indent*n,b=e.lineWidth,-1===b&&(b=9007199254740991),40>A?b-=A:b=40,k=0;k<t.length;k++){if(w=t.charCodeAt(k),r){if(h(w))continue;r=!1}m&&w===R&&(m=!1),C=ee[w],j=d(w),(C||j)&&(w!==T&&w!==D&&w!==R?(l=!1,f=!1):w===T&&(y=!0,m=!1,k>0&&(I=t.charCodeAt(k-1),I===L&&(f=!1,l=!1)),l&&(S=k-x,x=k,S>v&&(v=S))),w!==D&&(m=!1),g.takeUpTo(k),g.escapeChar())}if(r&&c(e,t)&&(r=!1),E="",(l||f)&&(O=0,t.charCodeAt(t.length-1)===T&&(O+=1,t.charCodeAt(t.length-2)===T&&(O+=1)),0===O?E="-":2===O&&(E="+")),(f&&b>v||null!==e.tag)&&(l=!1),y||(f=!1),r)e.dump=t;else if(m)e.dump="'"+t+"'";else if(l)F=p(t,b),e.dump=">"+E+"\n"+a(F,A);else if(f)E||(t=t.replace(/\n$/,"")),e.dump="|"+E+"\n"+a(t,A);else{if(!g)throw new Error("Failed to dump scalar value");g.finish(),e.dump='"'+g.result+'"'}}function p(e,t){var n,i="",r=0,o=e.length,a=/\n+$/.exec(e);for(a&&(o=a.index+1);o>r;)n=e.indexOf("\n",r),n>o||-1===n?(i&&(i+="\n\n"),i+=f(e.slice(r,o),t),r=o):(i&&(i+="\n\n"),i+=f(e.slice(r,n),t),r=n+1);return a&&"\n"!==a[0]&&(i+=a[0]),i}function f(e,t){if(""===e)return e;for(var n,i,r,o=/[^\s] [^\s]/g,a="",s=0,c=0,u=o.exec(e);u;)n=u.index,n-c>t&&(i=s!==c?s:n,a&&(a+="\n"),r=e.slice(c,i),a+=r,c=i+1),s=n+1,u=o.exec(e);return a&&(a+="\n"),a+=c!==s&&e.length-c>t?e.slice(c,s)+"\n"+e.slice(s+1):e.slice(c)}function h(e){return N!==e&&T!==e&&_!==e&&P!==e&&V!==e&&Z!==e&&J!==e&&X!==e&&U!==e&&Y!==e&&B!==e&&M!==e&&Q!==e&&H!==e&&R!==e&&D!==e&&q!==e&&K!==e&&!ee[e]&&!d(e)}function d(e){return!(e>=32&&126>=e||133===e||e>=160&&55295>=e||e>=57344&&65533>=e||e>=65536&&1114111>=e)}function m(e,t,n){var i,r,o="",a=e.tag;for(i=0,r=n.length;r>i;i+=1)A(e,t,n[i],!1,!1)&&(0!==i&&(o+=", "),o+=e.dump);e.tag=a,e.dump="["+o+"]"}function g(e,t,n,i){var r,o,a="",c=e.tag;for(r=0,o=n.length;o>r;r+=1)A(e,t+1,n[r],!0,!0)&&(i&&0===r||(a+=s(e,t)),a+="- "+e.dump);e.tag=c,e.dump=a||"[]"}function y(e,t,n){var i,r,o,a,s,c="",u=e.tag,l=Object.keys(n);for(i=0,r=l.length;r>i;i+=1)s="",0!==i&&(s+=", "),o=l[i],a=n[o],A(e,t,o,!1,!1)&&(e.dump.length>1024&&(s+="? "),s+=e.dump+": ",A(e,t,a,!1,!1)&&(s+=e.dump,c+=s));e.tag=u,e.dump="{"+c+"}"}function x(e,t,n,i){var r,o,a,c,u,l,p="",f=e.tag,h=Object.keys(n);if(e.sortKeys===!0)h.sort();else if("function"==typeof e.sortKeys)h.sort(e.sortKeys);else if(e.sortKeys)throw new I("sortKeys must be a boolean or a function");for(r=0,o=h.length;o>r;r+=1)l="",i&&0===r||(l+=s(e,t)),a=h[r],c=n[a],A(e,t+1,a,!0,!0,!0)&&(u=null!==e.tag&&"?"!==e.tag||e.dump&&e.dump.length>1024,u&&(l+=e.dump&&T===e.dump.charCodeAt(0)?"?":"? "),l+=e.dump,u&&(l+=s(e,t)),A(e,t+1,c,!0,u)&&(l+=e.dump&&T===e.dump.charCodeAt(0)?":":": ",l+=e.dump,p+=l));e.tag=f,e.dump=p||"{}"}function v(e,t,n){var i,r,o,a,s,c;for(r=n?e.explicitTypes:e.implicitTypes,o=0,a=r.length;a>o;o+=1)if(s=r[o],(s.instanceOf||s.predicate)&&(!s.instanceOf||"object"==typeof t&&t instanceof s.instanceOf)&&(!s.predicate||s.predicate(t))){if(e.tag=n?s.tag:"?",s.represent){if(c=e.styleMap[s.tag]||s.defaultStyle,"[object Function]"===O.call(s.represent))i=s.represent(t,c);else{if(!F.call(s.represent,c))throw new I("!<"+s.tag+'> tag resolver accepts not "'+c+'" style');i=s.represent[c](t,c)}e.dump=i}return!0}return!1}function A(e,t,n,i,r,o){e.tag=null,e.dump=n,v(e,n,!1)||v(e,n,!0);var a=O.call(e.dump);i&&(i=e.flowLevel<0||e.flowLevel>t);var s,c,u="[object Object]"===a||"[object Array]"===a;if(u&&(s=e.duplicates.indexOf(n),c=-1!==s),(null!==e.tag&&"?"!==e.tag||c||2!==e.indent&&t>0)&&(r=!1),c&&e.usedDuplicates[s])e.dump="*ref_"+s;else{if(u&&c&&!e.usedDuplicates[s]&&(e.usedDuplicates[s]=!0),"[object Object]"===a)i&&0!==Object.keys(e.dump).length?(x(e,t,e.dump,r),c&&(e.dump="&ref_"+s+e.dump)):(y(e,t,e.dump),c&&(e.dump="&ref_"+s+" "+e.dump));else if("[object Array]"===a)i&&0!==e.dump.length?(g(e,t,e.dump,r),c&&(e.dump="&ref_"+s+e.dump)):(m(e,t,e.dump),c&&(e.dump="&ref_"+s+" "+e.dump));else{if("[object String]"!==a){if(e.skipInvalid)return!1;throw new I("unacceptable kind of an object to dump "+a)}"?"!==e.tag&&l(e,e.dump,t,o)}null!==e.tag&&"?"!==e.tag&&(e.dump="!<"+e.tag+"> "+e.dump)}return!0}function b(e,t){var n,i,r=[],o=[];for(w(e,r,o),n=0,i=o.length;i>n;n+=1)t.duplicates.push(r[o[n]]);t.usedDuplicates=new Array(i)}function w(e,t,n){var i,r,o;if(null!==e&&"object"==typeof e)if(r=t.indexOf(e),-1!==r)-1===n.indexOf(r)&&n.push(r);else if(t.push(e),Array.isArray(e))for(r=0,o=e.length;o>r;r+=1)w(e[r],t,n);else for(i=Object.keys(e),r=0,o=i.length;o>r;r+=1)w(e[i[r]],t,n)}function k(e,t){t=t||{};var n=new o(t);return n.noRefs||b(e,n),A(n,0,e,!0,!0)?n.dump+"\n":""}function C(e,t){return k(e,j.extend({schema:E},t))}var j=e("./common"),I=e("./exception"),S=e("./schema/default_full"),E=e("./schema/default_safe"),O=Object.prototype.toString,F=Object.prototype.hasOwnProperty,N=9,T=10,_=13,L=32,M=33,D=34,U=35,q=37,Y=38,R=39,B=42,P=44,$=45,K=58,H=62,W=63,G=64,V=91,Z=93,z=96,J=123,Q=124,X=125,ee={};ee[0]="\\0",ee[7]="\\a",ee[8]="\\b",ee[9]="\\t",ee[10]="\\n",ee[11]="\\v",ee[12]="\\f",ee[13]="\\r",ee[27]="\\e",ee[34]='\\"',ee[92]="\\\\",ee[133]="\\N",ee[160]="\\_",ee[8232]="\\L",ee[8233]="\\P";var te=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"];u.prototype.takeUpTo=function(e){var t;if(e<this.checkpoint)throw t=new Error("position should be > checkpoint"),t.position=e,t.checkpoint=this.checkpoint,t;return this.result+=this.source.slice(this.checkpoint,e),this.checkpoint=e,this},u.prototype.escapeChar=function(){var e,t;return e=this.source.charCodeAt(this.checkpoint),t=ee[e]||r(e),this.result+=t,this.checkpoint+=1,this},u.prototype.finish=function(){this.source.length>this.checkpoint&&this.takeUpTo(this.source.length)},t.exports.dump=k,t.exports.safeDump=C},{"./common":2,"./exception":4,"./schema/default_full":9,"./schema/default_safe":10}],4:[function(e,t,n){"use strict";function i(e,t){Error.call(this),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack||"",this.name="YAMLException",this.reason=e,this.mark=t,this.message=(this.reason||"(unknown reason)")+(this.mark?" "+this.mark.toString():"")}i.prototype=Object.create(Error.prototype),i.prototype.constructor=i,i.prototype.toString=function(e){var t=this.name+": ";return t+=this.reason||"(unknown reason)",!e&&this.mark&&(t+=" "+this.mark.toString()),t},t.exports=i},{}],5:[function(e,t,n){"use strict";function i(e){return 10===e||13===e}function r(e){return 9===e||32===e}function o(e){return 9===e||32===e||10===e||13===e}function a(e){return 44===e||91===e||93===e||123===e||125===e}function s(e){var t;return e>=48&&57>=e?e-48:(t=32|e,t>=97&&102>=t?t-97+10:-1)}function c(e){return 120===e?2:117===e?4:85===e?8:0}function u(e){return e>=48&&57>=e?e-48:-1}function l(e){return 48===e?"\x00":97===e?"":98===e?"\b":116===e?"	":9===e?"	":110===e?"\n":118===e?"\x0B":102===e?"\f":114===e?"\r":101===e?"":32===e?" ":34===e?'"':47===e?"/":92===e?"\\":78===e?"":95===e?" ":76===e?"\u2028":80===e?"\u2029":""}function p(e){return 65535>=e?String.fromCharCode(e):String.fromCharCode((e-65536>>10)+55296,(e-65536&1023)+56320)}function f(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||K,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.documents=[]}function h(e,t){return new B(t,new P(e.filename,e.input,e.position,e.line,e.position-e.lineStart))}function d(e,t){throw h(e,t)}function m(e,t){e.onWarning&&e.onWarning.call(null,h(e,t))}function g(e,t,n,i){var r,o,a,s;if(n>t){if(s=e.input.slice(t,n),i)for(r=0,o=s.length;o>r;r+=1)a=s.charCodeAt(r),9===a||a>=32&&1114111>=a||d(e,"expected valid JSON character");else X.test(s)&&d(e,"the stream contains non-printable characters");e.result+=s}}function y(e,t,n,i){var r,o,a,s;for(R.isObject(n)||d(e,"cannot merge mappings; the provided source object is unacceptable"),r=Object.keys(n),a=0,s=r.length;s>a;a+=1)o=r[a],H.call(t,o)||(t[o]=n[o],i[o]=!0)}function x(e,t,n,i,r,o){var a,s;if(r=String(r),null===t&&(t={}),"tag:yaml.org,2002:merge"===i)if(Array.isArray(o))for(a=0,s=o.length;s>a;a+=1)y(e,t,o[a],n);else y(e,t,o,n);else e.json||H.call(n,r)||!H.call(t,r)||d(e,"duplicated mapping key"),t[r]=o,delete n[r];return t}function v(e){var t;t=e.input.charCodeAt(e.position),10===t?e.position++:13===t?(e.position++,10===e.input.charCodeAt(e.position)&&e.position++):d(e,"a line break is expected"),e.line+=1,e.lineStart=e.position}function A(e,t,n){for(var o=0,a=e.input.charCodeAt(e.position);0!==a;){for(;r(a);)a=e.input.charCodeAt(++e.position);if(t&&35===a)do a=e.input.charCodeAt(++e.position);while(10!==a&&13!==a&&0!==a);if(!i(a))break;for(v(e),a=e.input.charCodeAt(e.position),o++,e.lineIndent=0;32===a;)e.lineIndent++,a=e.input.charCodeAt(++e.position)}return-1!==n&&0!==o&&e.lineIndent<n&&m(e,"deficient indentation"),o}function b(e){var t,n=e.position;return t=e.input.charCodeAt(n),45!==t&&46!==t||t!==e.input.charCodeAt(n+1)||t!==e.input.charCodeAt(n+2)||(n+=3,t=e.input.charCodeAt(n),0!==t&&!o(t))?!1:!0}function w(e,t){1===t?e.result+=" ":t>1&&(e.result+=R.repeat("\n",t-1))}function k(e,t,n){var s,c,u,l,p,f,h,d,m,y=e.kind,x=e.result;if(m=e.input.charCodeAt(e.position),o(m)||a(m)||35===m||38===m||42===m||33===m||124===m||62===m||39===m||34===m||37===m||64===m||96===m)return!1;if((63===m||45===m)&&(c=e.input.charCodeAt(e.position+1),o(c)||n&&a(c)))return!1;for(e.kind="scalar",e.result="",u=l=e.position,p=!1;0!==m;){if(58===m){if(c=e.input.charCodeAt(e.position+1),o(c)||n&&a(c))break}else if(35===m){if(s=e.input.charCodeAt(e.position-1),o(s))break}else{if(e.position===e.lineStart&&b(e)||n&&a(m))break;if(i(m)){if(f=e.line,h=e.lineStart,d=e.lineIndent,A(e,!1,-1),e.lineIndent>=t){p=!0,m=e.input.charCodeAt(e.position);continue}e.position=l,e.line=f,e.lineStart=h,e.lineIndent=d;break}}p&&(g(e,u,l,!1),w(e,e.line-f),u=l=e.position,p=!1),r(m)||(l=e.position+1),m=e.input.charCodeAt(++e.position)}return g(e,u,l,!1),e.result?!0:(e.kind=y,e.result=x,!1)}function C(e,t){var n,r,o;if(n=e.input.charCodeAt(e.position),39!==n)return!1;for(e.kind="scalar",e.result="",e.position++,r=o=e.position;0!==(n=e.input.charCodeAt(e.position));)if(39===n){if(g(e,r,e.position,!0),n=e.input.charCodeAt(++e.position),39!==n)return!0;r=o=e.position,e.position++}else i(n)?(g(e,r,o,!0),w(e,A(e,!1,t)),r=o=e.position):e.position===e.lineStart&&b(e)?d(e,"unexpected end of the document within a single quoted scalar"):(e.position++,o=e.position);d(e,"unexpected end of the stream within a single quoted scalar")}function j(e,t){var n,r,o,a,u,l;if(l=e.input.charCodeAt(e.position),34!==l)return!1;for(e.kind="scalar",e.result="",e.position++,n=r=e.position;0!==(l=e.input.charCodeAt(e.position));){if(34===l)return g(e,n,e.position,!0),e.position++,!0;if(92===l){if(g(e,n,e.position,!0),l=e.input.charCodeAt(++e.position),i(l))A(e,!1,t);else if(256>l&&re[l])e.result+=oe[l],e.position++;else if((u=c(l))>0){for(o=u,a=0;o>0;o--)l=e.input.charCodeAt(++e.position),(u=s(l))>=0?a=(a<<4)+u:d(e,"expected hexadecimal character");e.result+=p(a),e.position++}else d(e,"unknown escape sequence");n=r=e.position}else i(l)?(g(e,n,r,!0),w(e,A(e,!1,t)),n=r=e.position):e.position===e.lineStart&&b(e)?d(e,"unexpected end of the document within a double quoted scalar"):(e.position++,r=e.position)}d(e,"unexpected end of the stream within a double quoted scalar")}function I(e,t){var n,i,r,a,s,c,u,l,p,f,h,m=!0,g=e.tag,y=e.anchor,v={};if(h=e.input.charCodeAt(e.position),91===h)a=93,u=!1,i=[];else{if(123!==h)return!1;a=125,u=!0,i={}}for(null!==e.anchor&&(e.anchorMap[e.anchor]=i),h=e.input.charCodeAt(++e.position);0!==h;){if(A(e,!0,t),h=e.input.charCodeAt(e.position),h===a)return e.position++,e.tag=g,e.anchor=y,e.kind=u?"mapping":"sequence",e.result=i,!0;m||d(e,"missed comma between flow collection entries"),p=l=f=null,s=c=!1,63===h&&(r=e.input.charCodeAt(e.position+1),o(r)&&(s=c=!0,e.position++,A(e,!0,t))),n=e.line,_(e,t,W,!1,!0),p=e.tag,l=e.result,A(e,!0,t),h=e.input.charCodeAt(e.position),!c&&e.line!==n||58!==h||(s=!0,h=e.input.charCodeAt(++e.position),A(e,!0,t),_(e,t,W,!1,!0),f=e.result),u?x(e,i,v,p,l,f):s?i.push(x(e,null,v,p,l,f)):i.push(l),A(e,!0,t),h=e.input.charCodeAt(e.position),44===h?(m=!0,h=e.input.charCodeAt(++e.position)):m=!1}d(e,"unexpected end of the stream within a flow collection")}function S(e,t){var n,o,a,s,c=z,l=!1,p=t,f=0,h=!1;if(s=e.input.charCodeAt(e.position),124===s)o=!1;else{if(62!==s)return!1;o=!0}for(e.kind="scalar",e.result="";0!==s;)if(s=e.input.charCodeAt(++e.position),43===s||45===s)z===c?c=43===s?Q:J:d(e,"repeat of a chomping mode identifier");else{if(!((a=u(s))>=0))break;0===a?d(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):l?d(e,"repeat of an indentation width identifier"):(p=t+a-1,l=!0)}if(r(s)){do s=e.input.charCodeAt(++e.position);while(r(s));if(35===s)do s=e.input.charCodeAt(++e.position);while(!i(s)&&0!==s)}for(;0!==s;){for(v(e),e.lineIndent=0,s=e.input.charCodeAt(e.position);(!l||e.lineIndent<p)&&32===s;)e.lineIndent++,s=e.input.charCodeAt(++e.position);if(!l&&e.lineIndent>p&&(p=e.lineIndent),i(s))f++;else{if(e.lineIndent<p){c===Q?e.result+=R.repeat("\n",f):c===z&&l&&(e.result+="\n");break}for(o?r(s)?(h=!0,e.result+=R.repeat("\n",f+1)):h?(h=!1,e.result+=R.repeat("\n",f+1)):0===f?l&&(e.result+=" "):e.result+=R.repeat("\n",f):l?e.result+=R.repeat("\n",f+1):e.result+=R.repeat("\n",f),l=!0,f=0,n=e.position;!i(s)&&0!==s;)s=e.input.charCodeAt(++e.position);g(e,n,e.position,!1)}}return!0}function E(e,t){var n,i,r,a=e.tag,s=e.anchor,c=[],u=!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=c),r=e.input.charCodeAt(e.position);0!==r&&45===r&&(i=e.input.charCodeAt(e.position+1),o(i));)if(u=!0,e.position++,A(e,!0,-1)&&e.lineIndent<=t)c.push(null),r=e.input.charCodeAt(e.position);else if(n=e.line,_(e,t,V,!1,!0),c.push(e.result),A(e,!0,-1),r=e.input.charCodeAt(e.position),(e.line===n||e.lineIndent>t)&&0!==r)d(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break;return u?(e.tag=a,e.anchor=s,e.kind="sequence",e.result=c,!0):!1}function O(e,t,n){var i,a,s,c,u=e.tag,l=e.anchor,p={},f={},h=null,m=null,g=null,y=!1,v=!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=p),c=e.input.charCodeAt(e.position);0!==c;){if(i=e.input.charCodeAt(e.position+1),s=e.line,63!==c&&58!==c||!o(i)){if(!_(e,n,G,!1,!0))break;if(e.line===s){for(c=e.input.charCodeAt(e.position);r(c);)c=e.input.charCodeAt(++e.position);if(58===c)c=e.input.charCodeAt(++e.position),o(c)||d(e,"a whitespace character is expected after the key-value separator within a block mapping"),y&&(x(e,p,f,h,m,null),h=m=g=null),v=!0,y=!1,a=!1,h=e.tag,m=e.result;else{if(!v)return e.tag=u,e.anchor=l,!0;d(e,"can not read an implicit mapping pair; a colon is missed")}}else{if(!v)return e.tag=u,e.anchor=l,!0;d(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else 63===c?(y&&(x(e,p,f,h,m,null),h=m=g=null),v=!0,y=!0,a=!0):y?(y=!1,a=!0):d(e,"incomplete explicit mapping pair; a key node is missed"),e.position+=1,c=i;if((e.line===s||e.lineIndent>t)&&(_(e,t,Z,!0,a)&&(y?m=e.result:g=e.result),y||(x(e,p,f,h,m,g),h=m=g=null),A(e,!0,-1),c=e.input.charCodeAt(e.position)),e.lineIndent>t&&0!==c)d(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return y&&x(e,p,f,h,m,null),v&&(e.tag=u,e.anchor=l,e.kind="mapping",e.result=p),v}function F(e){var t,n,i,r,a=!1,s=!1;if(r=e.input.charCodeAt(e.position),33!==r)return!1;if(null!==e.tag&&d(e,"duplication of a tag property"),r=e.input.charCodeAt(++e.position),60===r?(a=!0,r=e.input.charCodeAt(++e.position)):33===r?(s=!0,n="!!",r=e.input.charCodeAt(++e.position)):n="!",t=e.position,a){do r=e.input.charCodeAt(++e.position);while(0!==r&&62!==r);e.position<e.length?(i=e.input.slice(t,e.position),r=e.input.charCodeAt(++e.position)):d(e,"unexpected end of the stream within a verbatim tag")}else{for(;0!==r&&!o(r);)33===r&&(s?d(e,"tag suffix cannot contain exclamation marks"):(n=e.input.slice(t-1,e.position+1),ne.test(n)||d(e,"named tag handle cannot contain such characters"),s=!0,t=e.position+1)),r=e.input.charCodeAt(++e.position);i=e.input.slice(t,e.position),te.test(i)&&d(e,"tag suffix cannot contain flow indicator characters")}return i&&!ie.test(i)&&d(e,"tag name cannot contain such characters: "+i),a?e.tag=i:H.call(e.tagMap,n)?e.tag=e.tagMap[n]+i:"!"===n?e.tag="!"+i:"!!"===n?e.tag="tag:yaml.org,2002:"+i:d(e,'undeclared tag handle "'+n+'"'),!0}function N(e){var t,n;if(n=e.input.charCodeAt(e.position),38!==n)return!1;for(null!==e.anchor&&d(e,"duplication of an anchor property"),n=e.input.charCodeAt(++e.position),t=e.position;0!==n&&!o(n)&&!a(n);)n=e.input.charCodeAt(++e.position);return e.position===t&&d(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(t,e.position),!0}function T(e){var t,n,i;if(i=e.input.charCodeAt(e.position),42!==i)return!1;for(i=e.input.charCodeAt(++e.position),t=e.position;0!==i&&!o(i)&&!a(i);)i=e.input.charCodeAt(++e.position);return e.position===t&&d(e,"name of an alias node must contain at least one character"),n=e.input.slice(t,e.position),e.anchorMap.hasOwnProperty(n)||d(e,'unidentified alias "'+n+'"'),e.result=e.anchorMap[n],A(e,!0,-1),!0}function _(e,t,n,i,r){var o,a,s,c,u,l,p,f,h=1,m=!1,g=!1;if(null!==e.listener&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,o=a=s=Z===n||V===n,i&&A(e,!0,-1)&&(m=!0,e.lineIndent>t?h=1:e.lineIndent===t?h=0:e.lineIndent<t&&(h=-1)),1===h)for(;F(e)||N(e);)A(e,!0,-1)?(m=!0,s=o,e.lineIndent>t?h=1:e.lineIndent===t?h=0:e.lineIndent<t&&(h=-1)):s=!1;if(s&&(s=m||r),(1===h||Z===n)&&(p=W===n||G===n?t:t+1,f=e.position-e.lineStart,1===h?s&&(E(e,f)||O(e,f,p))||I(e,p)?g=!0:(a&&S(e,p)||C(e,p)||j(e,p)?g=!0:T(e)?(g=!0,(null!==e.tag||null!==e.anchor)&&d(e,"alias node should not have any properties")):k(e,p,W===n)&&(g=!0,null===e.tag&&(e.tag="?")),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):0===h&&(g=s&&E(e,f))),null!==e.tag&&"!"!==e.tag)if("?"===e.tag){for(c=0,u=e.implicitTypes.length;u>c;c+=1)if(l=e.implicitTypes[c],l.resolve(e.result)){e.result=l.construct(e.result),e.tag=l.tag,null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);break}}else H.call(e.typeMap,e.tag)?(l=e.typeMap[e.tag],null!==e.result&&l.kind!==e.kind&&d(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+l.kind+'", not "'+e.kind+'"'),l.resolve(e.result)?(e.result=l.construct(e.result),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):d(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")):d(e,"unknown tag !<"+e.tag+">");return null!==e.listener&&e.listener("close",e),null!==e.tag||null!==e.anchor||g}function L(e){var t,n,a,s,c=e.position,u=!1;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap={},e.anchorMap={};0!==(s=e.input.charCodeAt(e.position))&&(A(e,!0,-1),s=e.input.charCodeAt(e.position),!(e.lineIndent>0||37!==s));){for(u=!0,s=e.input.charCodeAt(++e.position),t=e.position;0!==s&&!o(s);)s=e.input.charCodeAt(++e.position);for(n=e.input.slice(t,e.position),a=[],n.length<1&&d(e,"directive name must not be less than one character in length");0!==s;){for(;r(s);)s=e.input.charCodeAt(++e.position);if(35===s){do s=e.input.charCodeAt(++e.position);while(0!==s&&!i(s));break}if(i(s))break;for(t=e.position;0!==s&&!o(s);)s=e.input.charCodeAt(++e.position);a.push(e.input.slice(t,e.position))}0!==s&&v(e),H.call(se,n)?se[n](e,n,a):m(e,'unknown document directive "'+n+'"')}return A(e,!0,-1),0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)?(e.position+=3,A(e,!0,-1)):u&&d(e,"directives end mark is expected"),_(e,e.lineIndent-1,Z,!1,!0),A(e,!0,-1),e.checkLineBreaks&&ee.test(e.input.slice(c,e.position))&&m(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&b(e)?void(46===e.input.charCodeAt(e.position)&&(e.position+=3,A(e,!0,-1))):void(e.position<e.length-1&&d(e,"end of the stream or a document separator is expected"))}function M(e,t){e=String(e),t=t||{},0!==e.length&&(10!==e.charCodeAt(e.length-1)&&13!==e.charCodeAt(e.length-1)&&(e+="\n"),65279===e.charCodeAt(0)&&(e=e.slice(1)));var n=new f(e,t);for(n.input+="\x00";32===n.input.charCodeAt(n.position);)n.lineIndent+=1,n.position+=1;for(;n.position<n.length-1;)L(n);return n.documents}function D(e,t,n){var i,r,o=M(e,n);for(i=0,r=o.length;r>i;i+=1)t(o[i])}function U(e,t){var n=M(e,t);if(0!==n.length){if(1===n.length)return n[0];throw new B("expected a single document in the stream, but found more")}}function q(e,t,n){D(e,t,R.extend({schema:$},n))}function Y(e,t){return U(e,R.extend({schema:$},t))}for(var R=e("./common"),B=e("./exception"),P=e("./mark"),$=e("./schema/default_safe"),K=e("./schema/default_full"),H=Object.prototype.hasOwnProperty,W=1,G=2,V=3,Z=4,z=1,J=2,Q=3,X=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,ee=/[\x85\u2028\u2029]/,te=/[,\[\]\{\}]/,ne=/^(?:!|!!|![a-z\-]+!)$/i,ie=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i,re=new Array(256),oe=new Array(256),ae=0;256>ae;ae++)re[ae]=l(ae)?1:0,oe[ae]=l(ae);var se={YAML:function(e,t,n){var i,r,o;null!==e.version&&d(e,"duplication of %YAML directive"),1!==n.length&&d(e,"YAML directive accepts exactly one argument"),i=/^([0-9]+)\.([0-9]+)$/.exec(n[0]),null===i&&d(e,"ill-formed argument of the YAML directive"),r=parseInt(i[1],10),o=parseInt(i[2],10),1!==r&&d(e,"unacceptable YAML version of the document"),e.version=n[0],e.checkLineBreaks=2>o,1!==o&&2!==o&&m(e,"unsupported YAML version of the document")},TAG:function(e,t,n){var i,r;2!==n.length&&d(e,"TAG directive accepts exactly two arguments"),i=n[0],r=n[1],ne.test(i)||d(e,"ill-formed tag handle (first argument) of the TAG directive"),H.call(e.tagMap,i)&&d(e,'there is a previously declared suffix for "'+i+'" tag handle'),ie.test(r)||d(e,"ill-formed tag prefix (second argument) of the TAG directive"),e.tagMap[i]=r}};t.exports.loadAll=D,t.exports.load=U,t.exports.safeLoadAll=q,t.exports.safeLoad=Y},{"./common":2,"./exception":4,"./mark":6,"./schema/default_full":9,"./schema/default_safe":10}],6:[function(e,t,n){"use strict";function i(e,t,n,i,r){this.name=e,this.buffer=t,this.position=n,this.line=i,this.column=r}var r=e("./common");i.prototype.getSnippet=function(e,t){var n,i,o,a,s;if(!this.buffer)return null;for(e=e||4,t=t||75,n="",i=this.position;i>0&&-1==="\x00\r\n\u2028\u2029".indexOf(this.buffer.charAt(i-1));)if(i-=1,this.position-i>t/2-1){n=" ... ",i+=5;break}for(o="",a=this.position;a<this.buffer.length&&-1==="\x00\r\n\u2028\u2029".indexOf(this.buffer.charAt(a));)if(a+=1,a-this.position>t/2-1){o=" ... ",a-=5;break}return s=this.buffer.slice(i,a),r.repeat(" ",e)+n+s+o+"\n"+r.repeat(" ",e+this.position-i+n.length)+"^"},i.prototype.toString=function(e){var t,n="";return this.name&&(n+='in "'+this.name+'" '),n+="at line "+(this.line+1)+", column "+(this.column+1),e||(t=this.getSnippet(),t&&(n+=":\n"+t)),n},t.exports=i},{"./common":2}],7:[function(e,t,n){"use strict";function i(e,t,n){var r=[];return e.include.forEach(function(e){n=i(e,t,n)}),e[t].forEach(function(e){n.forEach(function(t,n){t.tag===e.tag&&r.push(n)}),n.push(e)}),n.filter(function(e,t){return-1===r.indexOf(t)})}function r(){function e(e){i[e.tag]=e}var t,n,i={};for(t=0,n=arguments.length;n>t;t+=1)arguments[t].forEach(e);return i}function o(e){this.include=e.include||[],this.implicit=e.implicit||[],this.explicit=e.explicit||[],this.implicit.forEach(function(e){if(e.loadKind&&"scalar"!==e.loadKind)throw new s("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.")}),this.compiledImplicit=i(this,"implicit",[]),this.compiledExplicit=i(this,"explicit",[]),this.compiledTypeMap=r(this.compiledImplicit,this.compiledExplicit)}var a=e("./common"),s=e("./exception"),c=e("./type");o.DEFAULT=null,o.create=function(){var e,t;switch(arguments.length){case 1:e=o.DEFAULT,t=arguments[0];break;case 2:e=arguments[0],t=arguments[1];break;default:throw new s("Wrong number of arguments for Schema.create function")}if(e=a.toArray(e),t=a.toArray(t),!e.every(function(e){return e instanceof o}))throw new s("Specified list of super schemas (or a single Schema object) contains a non-Schema object.");if(!t.every(function(e){return e instanceof c}))throw new s("Specified list of YAML types (or a single Type object) contains a non-Type object.");return new o({include:e,explicit:t})},t.exports=o},{"./common":2,"./exception":4,"./type":13}],8:[function(e,t,n){"use strict";var i=e("../schema");t.exports=new i({include:[e("./json")]})},{"../schema":7,"./json":12}],9:[function(e,t,n){"use strict";var i=e("../schema");t.exports=i.DEFAULT=new i({include:[e("./default_safe")],explicit:[e("../type/js/undefined"),e("../type/js/regexp"),e("../type/js/function")]})},{"../schema":7,"../type/js/function":18,"../type/js/regexp":19,"../type/js/undefined":20,"./default_safe":10}],10:[function(e,t,n){"use strict";var i=e("../schema");t.exports=new i({include:[e("./core")],implicit:[e("../type/timestamp"),e("../type/merge")],explicit:[e("../type/binary"),e("../type/omap"),e("../type/pairs"),e("../type/set")]})},{"../schema":7,"../type/binary":14,"../type/merge":22,"../type/omap":24,"../type/pairs":25,"../type/set":27,"../type/timestamp":29,"./core":8}],11:[function(e,t,n){"use strict";var i=e("../schema");t.exports=new i({explicit:[e("../type/str"),e("../type/seq"),e("../type/map")]})},{"../schema":7,"../type/map":21,"../type/seq":26,"../type/str":28}],12:[function(e,t,n){"use strict";var i=e("../schema");t.exports=new i({include:[e("./failsafe")],implicit:[e("../type/null"),e("../type/bool"),e("../type/int"),e("../type/float")]})},{"../schema":7,"../type/bool":15,"../type/float":16,"../type/int":17,"../type/null":23,"./failsafe":11}],13:[function(e,t,n){"use strict";function i(e){var t={};return null!==e&&Object.keys(e).forEach(function(n){e[n].forEach(function(e){t[String(e)]=n})}),t}function r(e,t){if(t=t||{},Object.keys(t).forEach(function(t){if(-1===a.indexOf(t))throw new o('Unknown option "'+t+'" is met in definition of "'+e+'" YAML type.')}),this.tag=e,this.kind=t.kind||null,this.resolve=t.resolve||function(){return!0},this.construct=t.construct||function(e){return e},this.instanceOf=t.instanceOf||null,this.predicate=t.predicate||null,this.represent=t.represent||null,this.defaultStyle=t.defaultStyle||null,this.styleAliases=i(t.styleAliases||null),-1===s.indexOf(this.kind))throw new o('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.')}var o=e("./exception"),a=["kind","resolve","construct","instanceOf","predicate","represent","defaultStyle","styleAliases"],s=["scalar","sequence","mapping"];t.exports=r},{"./exception":4}],14:[function(e,t,n){"use strict";function i(e){if(null===e)return!1;var t,n,i=0,r=e.length,o=u;for(n=0;r>n;n++)if(t=o.indexOf(e.charAt(n)),!(t>64)){if(0>t)return!1;i+=6}return i%8===0}function r(e){var t,n,i=e.replace(/[\r\n=]/g,""),r=i.length,o=u,a=0,c=[];for(t=0;r>t;t++)t%4===0&&t&&(c.push(a>>16&255),c.push(a>>8&255),c.push(255&a)),a=a<<6|o.indexOf(i.charAt(t));return n=r%4*6,0===n?(c.push(a>>16&255),c.push(a>>8&255),c.push(255&a)):18===n?(c.push(a>>10&255),c.push(a>>2&255)):12===n&&c.push(a>>4&255),s?new s(c):c}function o(e){var t,n,i="",r=0,o=e.length,a=u;for(t=0;o>t;t++)t%3===0&&t&&(i+=a[r>>18&63],i+=a[r>>12&63],i+=a[r>>6&63],i+=a[63&r]),r=(r<<8)+e[t];return n=o%3,0===n?(i+=a[r>>18&63],i+=a[r>>12&63],
  i+=a[r>>6&63],i+=a[63&r]):2===n?(i+=a[r>>10&63],i+=a[r>>4&63],i+=a[r<<2&63],i+=a[64]):1===n&&(i+=a[r>>2&63],i+=a[r<<4&63],i+=a[64],i+=a[64]),i}function a(e){return s&&s.isBuffer(e)}var s=e("buffer").Buffer,c=e("../type"),u="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";t.exports=new c("tag:yaml.org,2002:binary",{kind:"scalar",resolve:i,construct:r,predicate:a,represent:o})},{"../type":13,buffer:30}],15:[function(e,t,n){"use strict";function i(e){if(null===e)return!1;var t=e.length;return 4===t&&("true"===e||"True"===e||"TRUE"===e)||5===t&&("false"===e||"False"===e||"FALSE"===e)}function r(e){return"true"===e||"True"===e||"TRUE"===e}function o(e){return"[object Boolean]"===Object.prototype.toString.call(e)}var a=e("../type");t.exports=new a("tag:yaml.org,2002:bool",{kind:"scalar",resolve:i,construct:r,predicate:o,represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"})},{"../type":13}],16:[function(e,t,n){"use strict";function i(e){return null===e?!1:u.test(e)?!0:!1}function r(e){var t,n,i,r;return t=e.replace(/_/g,"").toLowerCase(),n="-"===t[0]?-1:1,r=[],"+-".indexOf(t[0])>=0&&(t=t.slice(1)),".inf"===t?1===n?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:".nan"===t?NaN:t.indexOf(":")>=0?(t.split(":").forEach(function(e){r.unshift(parseFloat(e,10))}),t=0,i=1,r.forEach(function(e){t+=e*i,i*=60}),n*t):n*parseFloat(t,10)}function o(e,t){var n;if(isNaN(e))switch(t){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(t){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(t){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(s.isNegativeZero(e))return"-0.0";return n=e.toString(10),l.test(n)?n.replace("e",".e"):n}function a(e){return"[object Number]"===Object.prototype.toString.call(e)&&(e%1!==0||s.isNegativeZero(e))}var s=e("../common"),c=e("../type"),u=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)\\.[0-9_]*(?:[eE][-+][0-9]+)?|\\.[0-9_]+(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),l=/^[-+]?[0-9]+e/;t.exports=new c("tag:yaml.org,2002:float",{kind:"scalar",resolve:i,construct:r,predicate:a,represent:o,defaultStyle:"lowercase"})},{"../common":2,"../type":13}],17:[function(e,t,n){"use strict";function i(e){return e>=48&&57>=e||e>=65&&70>=e||e>=97&&102>=e}function r(e){return e>=48&&55>=e}function o(e){return e>=48&&57>=e}function a(e){if(null===e)return!1;var t,n=e.length,a=0,s=!1;if(!n)return!1;if(t=e[a],("-"===t||"+"===t)&&(t=e[++a]),"0"===t){if(a+1===n)return!0;if(t=e[++a],"b"===t){for(a++;n>a;a++)if(t=e[a],"_"!==t){if("0"!==t&&"1"!==t)return!1;s=!0}return s}if("x"===t){for(a++;n>a;a++)if(t=e[a],"_"!==t){if(!i(e.charCodeAt(a)))return!1;s=!0}return s}for(;n>a;a++)if(t=e[a],"_"!==t){if(!r(e.charCodeAt(a)))return!1;s=!0}return s}for(;n>a;a++)if(t=e[a],"_"!==t){if(":"===t)break;if(!o(e.charCodeAt(a)))return!1;s=!0}return s?":"!==t?!0:/^(:[0-5]?[0-9])+$/.test(e.slice(a)):!1}function s(e){var t,n,i=e,r=1,o=[];return-1!==i.indexOf("_")&&(i=i.replace(/_/g,"")),t=i[0],("-"===t||"+"===t)&&("-"===t&&(r=-1),i=i.slice(1),t=i[0]),"0"===i?0:"0"===t?"b"===i[1]?r*parseInt(i.slice(2),2):"x"===i[1]?r*parseInt(i,16):r*parseInt(i,8):-1!==i.indexOf(":")?(i.split(":").forEach(function(e){o.unshift(parseInt(e,10))}),i=0,n=1,o.forEach(function(e){i+=e*n,n*=60}),r*i):r*parseInt(i,10)}function c(e){return"[object Number]"===Object.prototype.toString.call(e)&&e%1===0&&!u.isNegativeZero(e)}var u=e("../common"),l=e("../type");t.exports=new l("tag:yaml.org,2002:int",{kind:"scalar",resolve:a,construct:s,predicate:c,represent:{binary:function(e){return"0b"+e.toString(2)},octal:function(e){return"0"+e.toString(8)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return"0x"+e.toString(16).toUpperCase()}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}})},{"../common":2,"../type":13}],18:[function(e,t,n){"use strict";function i(e){if(null===e)return!1;try{var t="("+e+")",n=s.parse(t,{range:!0});return"Program"!==n.type||1!==n.body.length||"ExpressionStatement"!==n.body[0].type||"FunctionExpression"!==n.body[0].expression.type?!1:!0}catch(i){return!1}}function r(e){var t,n="("+e+")",i=s.parse(n,{range:!0}),r=[];if("Program"!==i.type||1!==i.body.length||"ExpressionStatement"!==i.body[0].type||"FunctionExpression"!==i.body[0].expression.type)throw new Error("Failed to resolve function");return i.body[0].expression.params.forEach(function(e){r.push(e.name)}),t=i.body[0].expression.body.range,new Function(r,n.slice(t[0]+1,t[1]-1))}function o(e){return e.toString()}function a(e){return"[object Function]"===Object.prototype.toString.call(e)}var s;try{var c=e;s=c("esprima")}catch(u){"undefined"!=typeof window&&(s=window.esprima)}var l=e("../../type");t.exports=new l("tag:yaml.org,2002:js/function",{kind:"scalar",resolve:i,construct:r,predicate:a,represent:o})},{"../../type":13}],19:[function(e,t,n){"use strict";function i(e){if(null===e)return!1;if(0===e.length)return!1;var t=e,n=/\/([gim]*)$/.exec(e),i="";if("/"===t[0]){if(n&&(i=n[1]),i.length>3)return!1;if("/"!==t[t.length-i.length-1])return!1}return!0}function r(e){var t=e,n=/\/([gim]*)$/.exec(e),i="";return"/"===t[0]&&(n&&(i=n[1]),t=t.slice(1,t.length-i.length-1)),new RegExp(t,i)}function o(e){var t="/"+e.source+"/";return e.global&&(t+="g"),e.multiline&&(t+="m"),e.ignoreCase&&(t+="i"),t}function a(e){return"[object RegExp]"===Object.prototype.toString.call(e)}var s=e("../../type");t.exports=new s("tag:yaml.org,2002:js/regexp",{kind:"scalar",resolve:i,construct:r,predicate:a,represent:o})},{"../../type":13}],20:[function(e,t,n){"use strict";function i(){return!0}function r(){}function o(){return""}function a(e){return"undefined"==typeof e}var s=e("../../type");t.exports=new s("tag:yaml.org,2002:js/undefined",{kind:"scalar",resolve:i,construct:r,predicate:a,represent:o})},{"../../type":13}],21:[function(e,t,n){"use strict";var i=e("../type");t.exports=new i("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return null!==e?e:{}}})},{"../type":13}],22:[function(e,t,n){"use strict";function i(e){return"<<"===e||null===e}var r=e("../type");t.exports=new r("tag:yaml.org,2002:merge",{kind:"scalar",resolve:i})},{"../type":13}],23:[function(e,t,n){"use strict";function i(e){if(null===e)return!0;var t=e.length;return 1===t&&"~"===e||4===t&&("null"===e||"Null"===e||"NULL"===e)}function r(){return null}function o(e){return null===e}var a=e("../type");t.exports=new a("tag:yaml.org,2002:null",{kind:"scalar",resolve:i,construct:r,predicate:o,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"}},defaultStyle:"lowercase"})},{"../type":13}],24:[function(e,t,n){"use strict";function i(e){if(null===e)return!0;var t,n,i,r,o,c=[],u=e;for(t=0,n=u.length;n>t;t+=1){if(i=u[t],o=!1,"[object Object]"!==s.call(i))return!1;for(r in i)if(a.call(i,r)){if(o)return!1;o=!0}if(!o)return!1;if(-1!==c.indexOf(r))return!1;c.push(r)}return!0}function r(e){return null!==e?e:[]}var o=e("../type"),a=Object.prototype.hasOwnProperty,s=Object.prototype.toString;t.exports=new o("tag:yaml.org,2002:omap",{kind:"sequence",resolve:i,construct:r})},{"../type":13}],25:[function(e,t,n){"use strict";function i(e){if(null===e)return!0;var t,n,i,r,o,s=e;for(o=new Array(s.length),t=0,n=s.length;n>t;t+=1){if(i=s[t],"[object Object]"!==a.call(i))return!1;if(r=Object.keys(i),1!==r.length)return!1;o[t]=[r[0],i[r[0]]]}return!0}function r(e){if(null===e)return[];var t,n,i,r,o,a=e;for(o=new Array(a.length),t=0,n=a.length;n>t;t+=1)i=a[t],r=Object.keys(i),o[t]=[r[0],i[r[0]]];return o}var o=e("../type"),a=Object.prototype.toString;t.exports=new o("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:i,construct:r})},{"../type":13}],26:[function(e,t,n){"use strict";var i=e("../type");t.exports=new i("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return null!==e?e:[]}})},{"../type":13}],27:[function(e,t,n){"use strict";function i(e){if(null===e)return!0;var t,n=e;for(t in n)if(a.call(n,t)&&null!==n[t])return!1;return!0}function r(e){return null!==e?e:{}}var o=e("../type"),a=Object.prototype.hasOwnProperty;t.exports=new o("tag:yaml.org,2002:set",{kind:"mapping",resolve:i,construct:r})},{"../type":13}],28:[function(e,t,n){"use strict";var i=e("../type");t.exports=new i("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return null!==e?e:""}})},{"../type":13}],29:[function(e,t,n){"use strict";function i(e){return null===e?!1:null===s.exec(e)?!1:!0}function r(e){var t,n,i,r,o,a,c,u,l,p,f=0,h=null;if(t=s.exec(e),null===t)throw new Error("Date resolve error");if(n=+t[1],i=+t[2]-1,r=+t[3],!t[4])return new Date(Date.UTC(n,i,r));if(o=+t[4],a=+t[5],c=+t[6],t[7]){for(f=t[7].slice(0,3);f.length<3;)f+="0";f=+f}return t[9]&&(u=+t[10],l=+(t[11]||0),h=6e4*(60*u+l),"-"===t[9]&&(h=-h)),p=new Date(Date.UTC(n,i,r,o,a,c,f)),h&&p.setTime(p.getTime()-h),p}function o(e){return e.toISOString()}var a=e("../type"),s=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?)?$");t.exports=new a("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:i,construct:r,instanceOf:Date,represent:o})},{"../type":13}],30:[function(e,t,n){},{}],"/":[function(e,t,n){"use strict";var i=e("./lib/js-yaml.js");t.exports=i},{"./lib/js-yaml.js":1}]},{},[])("/")});
  return module.exports;
})();

var fs = require('fs');
var execSync = require('child_process').execSync;

var repoName = process.argv[2];
var branchName = process.argv[3];
var tagName = process.argv[4];
if (!repoName || !branchName) {
  throw new Error('Repo ('+repoName+') or branch ('+branchName+') not valid.');
}

tagName = tagName ? ':'+tagName : '';

var stackName = repoName+'-'+branchName.replace(/\./g, '-').replace(/\//g, '-');
var data;

try {
  data = fs.readFileSync('docker-compose.yml', 'utf8');
  console.log("Using docker-compose.yml");
}
catch (e) {

}

data = data.replace(/\${CIRCLE_PROJECT_REPONAME}/g, repoName);
data = data.replace(/\${CIRCLE_BRANCH}/g, branchName);

var json;
try {
  json = yaml.safeLoad(data);
}
catch (e) {
  throw e;
}

console.log('Checking for exising stack...');
var stackUuid = checkForStack(stackName);

var loggedIn = false;
Object.keys(json).forEach(function(containerName) {
  var container = json[containerName];
  if (container.build) {
    if (!loggedIn) {
      console.log('Logging in...');
      dockerLogIn();
      loggedIn = true;
    }

    console.log('Processing '+containerName);

    if (stackUuid && container.labels && container.labels.indexOf('singleton') >= 0 && checkForService(containerName, stackUuid)) {
      console.log('Container exists and is a singleton, skipping');
      return;
    }

    console.log('Creating '+stackName+'-'+containerName+' registry...');
    createRegistry(stackName, containerName);

    console.log('Building '+containerName+'...');
    buildImage(stackName, containerName);

    console.log('Tagging '+containerName+'...');
    tagImage(stackName, containerName, tagName);

    console.log('Pushing '+containerName+'...');
    pushImage(stackName, containerName, tagName);
  }
});

if (stackUuid) {
  console.log('Stack found, updating existing stack...');
  updateStack(stackName, stackUuid, json);
  redeployStack(stackUuid);
  console.log('  > Update complete.');
}
else {
  console.log('Stack not found, creating new stack...');
  stackUuid = createStack(stackName, json);
  startStack(stackUuid);
  console.log('  > Creation complete.');
}

console.log('Waiting for redeploy...');
var stack = waitForStack(stackUuid);

console.log('Fetching container ports...');
var proxies = {};
for (var i=0; i<stack.services.length; i++) {
  var servicePath = stack.services[i];
  var service = apiCmd('GET', servicePath);
  if (json[service.name] && json[service.name].labels) {
    for (var j=0; j<service.containers.length; j++) {
      var container = apiCmd('GET', service.containers[j]);
      var ports = container.container_ports;
      for (var k=0; k<ports.length; k++) {
        if (ports[k].endpoint_uri) {
          for (var l=0; l< json[service.name].labels.length; l++) {
            var proxy = json[service.name].labels[l];
            if (proxy.substring(0, 9) == 'upstream.') {
              proxies[proxy+':'+ports[k].inner_port] = ports[k].endpoint_uri;
            }
            if (process.env.SLACK_API_URL) {
              runCurl('POST', {"text":"Code was just deployed to "+json[service.name].proxy[l]}, process.env.SLACK_API_URL);
            }
          }
        }
      }
    }
  }
}

console.log('Updating proxy...');
Object.keys(proxies).forEach(function(key) {
  console.log('  - '+key+' => '+proxies[key]);
});
var proxy = updateProxy(proxies);
console.log('Done!');

function apiCmd(method, uri, body)
{
  body = body ? body : '';
  body = JSON.stringify(body).replace(/[\\']/g, '\\$&').replace(/\u0000/g, '\\0');
  var cmd = 'curl -s -H "Authorization: ApiKey happycog:eb031873a51f69d1da882f9e561968a2009447ed" -H "User-Agent: node-request" -H "Content-Type: application/json" -X '+method+' -d \''+body+'\' https://dashboard.tutum.co'+uri;
  var res = execSync(cmd).toString();
  res = JSON.parse(res);
  if (res.error) {
    throw new Error(res.error);
  }
  return res;
}

function runCurl(method, body, url)
{
  body = JSON.stringify(body).replace(/[\\']/g, '\\$&').replace(/\u0000/g, '\\0');
  var cmd = 'curl -s -H "Content-Type: application/json" -X '+method+' -d \''+body+'\' '+url;
  return execSync(cmd).toString();
}

function createRegistry(stackName, containerName)
{
  apiCmd('POST', '/api/v1/image/', {
    "name": "tutum.co/happycog/"+stackName+'-'+containerName
  });
}

function buildImage(stackName, containerName)
{
  var projectName = stackName.replace(/-/g, '');
  var cmd = 'COMPOSE_PROJECT_NAME='+stackName+' docker-compose build '+containerName;
  execSync(cmd);
}

function tagImage(stackName, containerName, tagName)
{
  var projectName = stackName.replace(/-/g, '');
  var cmd = 'docker tag '+projectName+'_'+containerName+' tutum.co/happycog/'+stackName+'-'+containerName+tagName;
  execSync(cmd);
}

function dockerLogIn()
{
  var cmd = 'docker login -e dev@happycog.com -u happycog -p hTbuYzrov7kvv4 tutum.co';
  execSync(cmd);
}

function pushImage(stackName, containerName, tagName)
{
  var cmd = 'docker push tutum.co/happycog/'+stackName+'-'+containerName+tagName;
  execSync(cmd);
}

function checkForStack(stackName)
{
  var res = apiCmd('GET', '/api/v1/stack/?name='+stackName);
  for (var i=0; i<res.objects.length; i++) {
    var stack = res.objects[i];
    if (stack.state != 'Terminated') {
      return stack.uuid;
    }
  }

  return false;
}

function checkForService(serviceName, stackUuid)
{
  var res = apiCmd('GET', '/api/v1/service/?name='+serviceName+'&stack=/api/v1/stack/'+stackUuid+'/');
  return res.objects.length > 0;
}

function defineStack(stackName, stack)
{
  var def = {
    name: stackName,
    services: []
  };

  Object.keys(stack).forEach(function(containerName) {
    var container = stack[containerName];
    var service = {
      "name": containerName
    };

    Object.keys(container).forEach(function(containerKey) {
      if (containerKey == 'build') {
        service.image = 'tutum.co/happycog/'+stackName+'-'+containerName;
        return;
      }

      if (containerKey == 'dockerfile') {
        return;
      }

      service[containerKey] = container[containerKey];
    });

    def.services.push(service);
  });

  return def;
}

function createStack(stackName, stack)
{
  var def = defineStack(stackName, stack);
  var res = apiCmd('POST', '/api/v1/stack/', def);
  return res.uuid;
}

function startStack(stackUuid)
{
  var res = apiCmd('POST', '/api/v1/stack/'+stackUuid+'/start/');
  return res;
}

function updateStack(stackName, stackUuid, stack)
{
  var def = defineStack(stackName, stack);
  delete def.name;
  var res = apiCmd('PATCH', '/api/v1/stack/'+stackUuid+'/', def);
  return res.uuid;
}

function redeployStack(stackUuid)
{
  var res = apiCmd('POST', '/api/v1/stack/'+stackUuid+'/redeploy/');
  return res;
}

function waitForStack(stackUuid)
{
  while (true) {
    var stack = apiCmd('GET', '/api/v1/stack/'+stackUuid+'/');
    if (stack.state == 'Running') {
      return stack;
    }
  }
}

function updateProxy(body)
{
  return JSON.parse(runCurl('POST', body, 'http://web.cogclient-proxy.happycog.svc.tutum.io:26542/'));
}
