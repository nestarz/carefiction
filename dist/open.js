var Gun=typeof window!=="undefined"?window.Gun:require("../gun");Gun.chain.open=function(b,a,d){return a=a||{},a.doc=a.doc||{},a.ids=a.ids||{},a.any=a.any||b,a.meta=a.meta||!1,a.ev=a.ev||{off:function(){Gun.obj.map(a.ev.s,function(c){c&&c.off()}),a.ev.s={}},s:{}},this.on(function(c,l,r,s){a.meta!==!0&&delete((c=Gun.obj.copy(c))||{})._,clearTimeout(a.to),a.to=setTimeout(function(){if(!a.any)return;a.any.call(a.at.$,a.doc,a.key,a,a.ev),a.off&&(a.ev.off(),a.any=null)},a.wait||1),a.at=a.at||r,a.key=a.key||l,a.ev.s[this._.id]=s;if(Gun.val.is(c)){d?d[l]=c:a.doc=c;return}var t=this,e;Gun.obj.map(c,function(m,f){var g=d||a.doc;if(!g)return;if(!(e=Gun.val.link.is(m))){g[f]=m;return}if(a.ids[e]){g[f]=a.ids[e];return}t.get(f).open(a.any,a,a.ids[e]=g[f]={})})})};
