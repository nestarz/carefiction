var Gun=typeof window!=="undefined"?window.Gun:require("../gun");Gun.chain.open||require("./open"),Gun.chain.load=function(a,b,c){return(b=b||{}).off=!0,this.open(a,b,c)};
