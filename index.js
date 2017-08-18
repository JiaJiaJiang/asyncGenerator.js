/*
Copyright luojia@luojia.me
MIT LICENSE
*/
'use strict';

class asyncContainer{
	constructor(gen,callback){//callback参数为[err,函数返回值]
		this._cb=(callback instanceof Function)?callback:null;
		this.flowFun=this.flow.bind(this);
		this.gen=gen;
		this.data={};
	}
	flow(...args){
		if(this.data.done)return;
		try{
			this.data=this._g.next(args);
			if(this.data.done){
				this._cb&&setImmediate(this._cb,null,this.data.value);
			}
		}catch(e){
			this._cb&&setImmediate(this._cb,e);
		}
	}
	init(...args){
		this._g=this.gen(this.flowFun,...args);
		return this;
	}
	start(...args){
		this.init(...args).flow();
	}
}

exports.Async=function(gen,callback){
	return new asyncContainer(gen,callback);
};

exports.runAsync=function runAsync(gen,callback){//回调函数参数(error,最后一个异步操作的返回值)
	let A=Async(gen,callback);
	setImmediate(()=>{A.start()});
	return A;
}
