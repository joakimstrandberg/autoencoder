(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{108:function(e,t,a){e.exports=a(213)},113:function(e,t,a){},115:function(e,t,a){},119:function(e,t){},121:function(e,t){},154:function(e,t){},155:function(e,t){},201:function(e,t){},202:function(e,t){},203:function(e,t){},213:function(e,t,a){"use strict";a.r(t);var n=a(1),o=a.n(n),r=a(103),c=a.n(r),i=(a(113),a(28)),l=(a(47),a(45)),s=a(19),d=a(20),u=a(25),p=a(23),h=a(24),m=a(46),f=a.n(m),g="http://localhost:5000/",v=g+"models/mnist/",E=g+"models/faces/light_model/",y=a(214),b=a(215),I=a(216),O=a(217),w=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(u.a)(this,Object(p.a)(t).call(this,e))).reshape=function(e){for(var t=[],n=0;n<a.state.width;n++){t[n]=[];for(var o=0;o<a.state.height;o++)t[n][o]="rgb("+Math.floor(255*e[a.state.height*o+n])+","+Math.floor(255*e[a.state.height*o+n])+","+Math.floor(255*e[a.state.height*o+n])+")"}return t},a.showImage=function(e){if(void 0!==e){var t=a.reshape(e),n=document.getElementById(a.props.id);n.width=a.state.width*a.state.scale,n.height=a.state.height*a.state.scale;for(var o=n.getContext("2d"),r=0;r<a.state.width;r++)for(var c=0;c<a.state.height;c++)o.fillStyle=t[r][c],o.fillRect(r*a.state.scale,c*a.state.scale,a.state.scale,a.state.scale)}},a.state={scale:10,height:28,width:28},a}return Object(h.a)(t,e),Object(d.a)(t,[{key:"componentDidUpdate",value:function(e){this.props.data!==e.data&&this.showImage(this.props.data)}},{key:"componentDidMount",value:function(){null!==this.props.data&&this.showImage(this.props.data)}},{key:"render",value:function(){return o.a.createElement("div",{style:S},o.a.createElement("h4",null,this.props.name),o.a.createElement("canvas",{id:this.props.id,style:{border:"1px solid #d3d3d3"},height:this.state.height*this.state.scale,width:this.state.width*this.state.scale}))}}]),t}(n.Component),S={border:"1px solid #d3d3d3",borderRadius:"5px",padding:"0.5em"},k=w,j=(a(115),function(e){return o.a.createElement("div",{className:"slider-div"},o.a.createElement("div",null,o.a.createElement("b",{style:{display:"inline",float:"left"}},"PC ",e.pc),o.a.createElement("p",{style:{display:"inline",float:"right"},className:"slider-value"},parseFloat(e.value).toFixed(2))),o.a.createElement("input",{type:"range",step:e.step,min:e.min,max:e.max,value:e.value,onChange:function(t){return e.onSlide(e.id,t)},className:"slider",id:e.id}))}),x=a(17),D=function(){function e(){Object(s.a)(this,e),this.autoencoder=null,this.encoder=null,this.decoder=null,this.inputShape=null}return Object(d.a)(e,[{key:"getInputShape",value:function(){var e=this.autoencoder.getLayer("input_1").batchInputShape.slice(1);this.inputShape=e}},{key:"loadModel",value:function(e,t){var a=this;Promise.all([x.b(e+"autoencoder/model.json",{strict:!0}).then(function(e){a.autoencoder=e,a.getInputShape()}),x.b(e+"decoder/model.json",{strict:!0}).then(function(e){a.decoder=e}),x.b(e+"encoder/model.json",{strict:!0}).then(function(e){a.encoder=e})]).then(function(){t()}).catch(function(e){console.log(e)})}},{key:"deleteModel",value:function(){x.a()}},{key:"predict",value:function(e){var t=this;return x.d(function(){t.inputShape.slice().unshift(1);var a=x.c([e]);return t.autoencoder.predict(a).arraySync()[0]})}},{key:"predictEncoder",value:function(e){var t=this;return x.d(function(){var a=x.c([e]);return t.encoder.predict(a).arraySync()[0]})}},{key:"predictDecoder",value:function(e){var t=this;return x.d(function(){var a=x.c(e,[1,e.length]);return t.decoder.predict(a).arraySync()[0]})}}]),e}(),M=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(u.a)(this,Object(p.a)(t).call(this,e))).fetchPcInfo=function(){fetch(g+"api/mnist/fetch-pc-info").then(function(e){return e.json()}).then(function(e){a.setState({pcOrder:e.order,minValues:e.min,maxValues:e.max,step:e.step})}).catch(function(e){console.log(e)})},a.fetchDigit=function(){fetch(g+"api/mnist/fetch-digit").then(function(e){return e.json()}).then(function(e){a.setState({digit:e[0]},function(){a.predictDigit()})}).catch(function(e){console.log(e)})},a.predictDigit=function(){var e=a.state.model.predict(a.state.digit);a.setState({predDigit:e}),a.getEncoderOutput()},a.getEncoderOutput=function(){var e=a.state.model.predictEncoder(a.state.digit);a.setState({encoderOutout:e},a.setState({decoderInput:e}))},a.updateDecoderInput=function(e,t){var n=f()(a.state.decoderInput,Object(l.a)({},e,{$set:parseFloat(t.target.value)}));a.setState({decoderInput:n},function(){var e=a.state.model.predictDecoder(a.state.decoderInput);a.setState({predDigit:e})})},a.createSliders=function(){for(var e=Math.ceil(a.state.decoderInput.length/8),t=[],n=0;n<e;n++){for(var r=[],c=8*n;c<8*(n+1);c++)c>a.state.decoderInput.length?r.push(o.a.createElement(y.a,{key:-c,className:"slider-col"})):r.push(o.a.createElement(y.a,{key:c,className:"slider-col"},o.a.createElement(j,{id:a.state.pcOrder[c],pc:c+1,value:a.state.decoderInput[a.state.pcOrder[c]],onSlide:a.updateDecoderInput,min:a.state.minValues[c],max:a.state.maxValues[c],step:a.state.step[c]})));t.push(o.a.createElement(b.a,{key:n.toString()+"_row"},r))}return t},a.state={digit:null,predDigit:null,model:null,modelIsLoaded:!1,decoderInput:null,encoderOutout:null,pcOrder:null,minValues:null,maxValues:null,step:null},a}return Object(h.a)(t,e),Object(d.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=new D;t.loadModel(v,function(){return e.setState({model:t},function(){e.setState({modelIsLoaded:!0},function(){e.fetchPcInfo()})})})}},{key:"componentWillUnmount",value:function(){this.state.model.deleteModel()}},{key:"render",value:function(){var e,t=this;return e=this.state.decoderInput?this.createSliders():null,o.a.createElement("div",{className:"App"},o.a.createElement("h1",null,"Autoencoder"),o.a.createElement("div",{className:"container",style:C},o.a.createElement(I.a,null,o.a.createElement(b.a,null,o.a.createElement(y.a,null,o.a.createElement(k,{id:"inputCanvas",name:"Input image",data:this.state.digit})),o.a.createElement(y.a,null,o.a.createElement(k,{id:"predCanvas",name:"Output image",data:this.state.predDigit}))),o.a.createElement(b.a,null,o.a.createElement(y.a,{style:{margin:"1em auto"}},o.a.createElement(O.a,{onClick:function(){return t.fetchDigit()},color:"danger",disabled:!this.state.modelIsLoaded},"New Input")),o.a.createElement(y.a,{style:{margin:"1em auto"}},o.a.createElement(O.a,{onClick:function(){return t.predictDigit()},color:"primary",disabled:!this.state.digit},"Reset"))),e)))}}]),t}(n.Component),C={border:"1px solid #d3d3d3",padding:"1em"},N=M,V=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(u.a)(this,Object(p.a)(t).call(this,e))).reshape=function(e){for(var t=[],n=0;n<e.length;n++){t[n]=[],console.log(e[0]);for(var o=0;o<a.props.height;o++)t[n][o]="rgb("+Math.floor(255*e[0][n][o][0])+","+Math.floor(255*e[0][n][o][1])+","+Math.floor(255*e[0][n][o][2])+")"}return t},a.showImage=function(e){if(void 0!==e){var t=document.getElementById(a.props.id);t.width=a.props.width*a.props.scale,t.height=a.props.height*a.props.scale;for(var n=t.getContext("2d"),o=0;o<a.state.width;o++)for(var r=0;r<a.props.height;r++)n.fillStyle="rgb("+Math.floor(255*e[r][o][0])+","+Math.floor(255*e[r][o][1])+","+Math.floor(255*e[r][o][2])+")",n.fillRect(o*a.props.scale,r*a.props.scale,a.props.scale,a.props.scale)}},a.state={scale:10,height:64,width:64},a}return Object(h.a)(t,e),Object(d.a)(t,[{key:"componentDidUpdate",value:function(e){this.props.data!==e.data&&this.showImage(this.props.data)}},{key:"componentDidMount",value:function(){null!==this.props.data&&this.showImage(this.props.data)}},{key:"render",value:function(){return o.a.createElement("div",{style:L},o.a.createElement("h4",null,this.props.name),o.a.createElement("canvas",{id:this.props.id,style:{border:"1px solid #d3d3d3"},height:this.props.height*this.props.scale,width:this.props.width*this.props.scale}))}}]),t}(n.Component),L={border:"1px solid #d3d3d3",borderRadius:"5px",padding:"0.5em"},P=V,R=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(u.a)(this,Object(p.a)(t).call(this,e))).fetchPcInfo=function(){fetch(g+"api/faces/fetch-pc-info").then(function(e){return e.json()}).then(function(e){a.setState({pcOrder:e.order,minValues:e.min,maxValues:e.max,step:e.step})}).catch(function(e){console.log(e)})},a.fetchData=function(){fetch(g+"api/faces/fetch-face").then(function(e){return e.json()}).then(function(e){a.setState({sample:e[0]},function(){a.predict()})}).catch(function(e){console.log(e)})},a.predict=function(){var e=a.state.model.predict(a.state.sample);a.setState({decoderOutput:e},function(){}),a.getEncoderOutput()},a.getEncoderOutput=function(){var e=a.state.model.predictEncoder(a.state.sample);a.setState({encoderOutput:e}),a.setState({decoderInput:e})},a.updateDecoderInput=function(e,t){var n=f()(a.state.decoderInput,Object(l.a)({},e,{$set:parseFloat(t.target.value)}));a.setState({decoderInput:n},function(){var e=a.state.model.predictDecoder(a.state.decoderInput);a.setState({decoderOutput:e},function(){})})},a.createSliders=function(){for(var e=Math.ceil(a.state.decoderInput.length/8),t=[],n=0;n<e;n++){for(var r=[],c=8*n;c<8*(n+1);c++)c>=a.state.decoderInput.length?r.push(o.a.createElement(y.a,{key:-c,className:"slider-col"})):r.push(o.a.createElement(y.a,{key:c,className:"slider-col"},o.a.createElement(j,{id:a.state.pcOrder[c],pc:c+1,value:a.state.decoderInput[a.state.pcOrder[c]],onSlide:a.updateDecoderInput,min:a.state.minValues[c],max:a.state.maxValues[c],step:a.state.step[c]})));t.push(o.a.createElement(b.a,{key:n.toString()+"_row"},r))}return t},a.state={sample:null,decoderOutput:null,model:null,modelIsLoaded:!1,decoderInput:null,encoderOutput:null,pcOrder:null,minValues:null,maxValues:null,step:null},a}return Object(h.a)(t,e),Object(d.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=new D;t.loadModel(E,function(){return e.setState({model:t},function(){e.setState({modelIsLoaded:!0},function(){e.fetchPcInfo()})})})}},{key:"componentWillUnmount",value:function(){this.state.model.deleteModel()}},{key:"render",value:function(){var e,t=this;return e=this.state.decoderInput?this.createSliders():null,o.a.createElement("div",{className:"App"},o.a.createElement("h1",null,"Autoencoder"),o.a.createElement("div",{className:"container",style:A},o.a.createElement(I.a,null,o.a.createElement(b.a,null,o.a.createElement(y.a,null,o.a.createElement(P,{id:"inputCanvas",name:"Input image",data:this.state.sample,width:64,height:64,channels:3,scale:5})),o.a.createElement(y.a,null,o.a.createElement(P,{id:"predCanvas",name:"Output image",data:this.state.decoderOutput,width:64,height:64,channels:3,scale:5}))),o.a.createElement(b.a,null,o.a.createElement(y.a,{style:{margin:"1em auto"}},o.a.createElement(O.a,{onClick:function(){return t.fetchData()},color:"danger",disabled:!this.state.modelIsLoaded},"New input")),o.a.createElement(y.a,{style:{margin:"1em auto"}},o.a.createElement(O.a,{onClick:function(){return t.predict()},color:"primary",disabled:!this.state.sample},"Reset"))),e)))}}]),t}(n.Component),A={border:"1px solid #d3d3d3",padding:"1em"},B=R,F=a(218),U=a(219),W=a(220),_=a(31),$=function(){return o.a.createElement("div",null,o.a.createElement(F.a,null,o.a.createElement(U.a,null,o.a.createElement(W.a,{tag:_.b,style:{textDecoration:"none"},to:"/mnist"},"mnist")),o.a.createElement(U.a,null,o.a.createElement(W.a,{tag:_.b,style:{textDecoration:"none"},to:"/faces"},"Celebrity faces dataset"))))},J=function(){return o.a.createElement("div",null,o.a.createElement("div",null,o.a.createElement($,null)),o.a.createElement(i.c,null,o.a.createElement(i.a,{path:"/faces",exact:!0,component:B}),o.a.createElement(i.a,{path:"/mnist",exact:!0,component:N}),o.a.createElement(i.a,{path:"/",exact:!0,component:N})))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a(212);c.a.render(o.a.createElement(_.a,null,o.a.createElement(J,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},47:function(e,t,a){}},[[108,1,2]]]);
//# sourceMappingURL=main.e5fad505.chunk.js.map