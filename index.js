var Proxy = require('node-proxy');
var fs = require('fs');

function handlerMaker(obj) {
  return {
   getOwnPropertyDescriptor: function(name) {
     var desc = Object.getOwnPropertyDescriptor(obj, name);
     // a trapping proxy's properties must always be configurable
     if (desc !== undefined) { desc.configurable = true; }
     return desc;
   },
   getPropertyDescriptor:  function(name) {
     var desc = Object.getPropertyDescriptor(obj, name); // not in ES5
     // a trapping proxy's properties must always be configurable
     if (desc !== undefined) { desc.configurable = true; }
     return desc;
   },
   getOwnPropertyNames: function() {
     return Object.getOwnPropertyNames(obj);
   },
   getPropertyNames: function() {
     return Object.getPropertyNames(obj);                // not in ES5
   },
   defineProperty: function(name, desc) {
     Object.defineProperty(obj, name, desc);
   },
   delete:       function(name) { return delete obj[name]; },   
   fix:          function() {
     if (Object.isFrozen(obj)) {
       var result = {};
       Object.getOwnPropertyNames(obj).forEach(function(name) {
         result[name] = Object.getOwnPropertyDescriptor(obj, name);
       });
       return result;
     }
     // As long as obj is not frozen, the proxy won't allow itself to be fixed
     return undefined; // will cause a TypeError to be thrown
   },
 
   has:          function(name) { return name in obj; },
   hasOwn:       function(name) { return ({}).hasOwnProperty.call(obj, name); },
   get:          function(receiver, name) { 
					if(name in obj){
						var prop = obj[name];
						return (typeof prop) === "function" ? prop.bind(obj) : prop;
					}else if(Number.isInteger(name) && name >= 0 && name < obj.length){
						return obj.getter(name);
					}
				},
   set:          function(receiver, name, val) { 
   					if(name in obj){
						var prop = obj[name];
						return (typeof prop) === "function" ? prop.bind(obj).call(val) : prop = val; 
					}else if(Number.isInteger(name) && name >= 0 && name < obj.length){
						return obj.setter(val,name);
					}
				}, 
   enumerate:    function() {
     var result = [];
     for (var name in obj) { result.push(name); };
     return result;
   },
   keys: function() { return Object.keys(obj); }
 
  };
}

function ArrayBuffer(bytes){
	if(bytes instanceof Buffer){
		this.buffer = bytes;
		this.byteLength = bytes.length;
	}else{
		this.buffer = Buffer.alloc(bytes * this.BYTES_PER_ELEMENT);
		this.byteLength = bytes * this.BYTES_PER_ELEMENT;
	}
	this.BYTES_PER_ELEMENT = 1;
}
ArrayBuffer.prototype.getter = function(i){return this.buffer[i];};//;
ArrayBuffer.prototype.setter = function(x,i){return this.buffer[i] = x;};
ArrayBuffer.prototype.BYTES_PER_ELEMENT = 1;

module.exports.ArrayBuffer = function (length){
	var target = new ArrayBuffer(length);
	var handler = handlerMaker(target);	
	return Proxy.create(handler,target);
}
//Int8Array

function Int8Array(length){
	ArrayBuffer.apply(this, arguments);
	this.BYTES_PER_ELEMENT=1;
	this.length = this.byteLength / this.BYTES_PER_ELEMENT;
}
Int8Array.prototype.getter = function(i){return this.buffer.readInt8(i)};
Int8Array.prototype.setter = function(x,i){return this.buffer.writeInt8(x,i)};
Int8Array.prototype.BYTES_PER_ELEMENT=1;

module.exports.Int8Array = function (length){
	var target = new Int8Array(length);
	var handler = handlerMaker(target);	
	return Proxy.create(handler,target);
}

//Uint8Array


function Uint8Array(length){
	ArrayBuffer.apply(this, arguments);
	this.length = length;
	this.BYTES_PER_ELEMENT=1;
	this.length = this.byteLength / this.BYTES_PER_ELEMENT;

}
Uint8Array.prototype.getter = function(i){return this.buffer.readInt8(i)};//;
Uint8Array.prototype.setter = function(x,i){return this.buffer.writeInt8(x,i)};//'writeInt32LE';
Uint8Array.prototype.BYTES_PER_ELEMENT=1;

module.exports.Uint8Array = function (length){
	var target = new Uint8Array(length);
	var handler = handlerMaker(target);	
	return Proxy.create(handler,target);
}


//Uint8Array
function Uint8ClampedArray(length){
	ArrayBuffer.apply(this, arguments);
	this.length = length;
	this.BYTES_PER_ELEMENT=1;
	this.length = this.byteLength / this.BYTES_PER_ELEMENT;
}
Uint8ClampedArray.prototype.getter = function(i){return this.buffer.readInt8(i)};
Uint8ClampedArray.prototype.setter = function(x,i){
	x = (x>255)?255:x;
	x = (x<0)?0:x;
	return this.buffer.writeInt8(x,i)
};
Uint8ClampedArray.prototype.BYTES_PER_ELEMENT=1;

module.exports.Uint8ClampedArray = function (length){
	var target = new Uint8ClampedArray(length);
	var handler = handlerMaker(target);	
	return Proxy.create(handler,target);
}

//Int16Array

function Int16Array(length){
	ArrayBuffer.apply(this, arguments);
	this.length = length;
	this.BYTES_PER_ELEMENT=2;
	this.length = this.byteLength / this.BYTES_PER_ELEMENT;
}
Int16Array.prototype.getter = function(i){return this.buffer.readInt16LE(i)};
Int16Array.prototype.setter = function(x,i){return this.buffer.writeInt16LE(x,i)};
Int16Array.prototype.BYTES_PER_ELEMENT=2;

module.exports.Int16Array = function (length){
	var target = new Int16Array(length);
	var handler = handlerMaker(target);	
	return Proxy.create(handler,target);
}

//Int16Array
function Uint16Array(length){
	ArrayBuffer.apply(this, arguments);
	this.length = length;
	this.BYTES_PER_ELEMENT=2;
	this.length = this.byteLength / this.BYTES_PER_ELEMENT;
}
Uint16Array.prototype.getter = function(i){return this.buffer.readUInt16LE(i)};
Uint16Array.prototype.setter = function(x,i){return this.buffer.writeUInt16LE(x,i)};
Uint16Array.prototype.BYTES_PER_ELEMENT=2;

module.exports.Uint16Array = function (length){
	var target = new Uint16Array(length);
	var handler = handlerMaker(target);	
	return Proxy.create(handler,target);
}



//Int32Array
function Int32Array(length){
	ArrayBuffer.apply(this, arguments);
	this.length = length;
	this.BYTES_PER_ELEMENT=4;
	this.length = this.byteLength / this.BYTES_PER_ELEMENT;
}
Int32Array.prototype.getter = function(i){return this.buffer.readInt32LE(i)};//;
Int32Array.prototype.setter = function(x,i){return this.buffer.writeInt32LE(x,i)};//'writeInt32LE';
Int32Array.prototype.BYTES_PER_ELEMENT=4;

module.exports.Int32Array = function (length){
	var target = new Int32Array(length);
	var handler = handlerMaker(target);	
	return Proxy.create(handler,target);
}

//Uint32Array
function Uint32Array(length){
	ArrayBuffer.apply(this, arguments);
	this.BYTES_PER_ELEMENT=4;
	this.length = this.byteLength / this.BYTES_PER_ELEMENT;
}
Uint32Array.prototype.getter = function(i){return this.buffer.readUInt32LE(i)};//;
Uint32Array.prototype.setter = function(x,i){return this.buffer.writeUInt32LE(x,i)};//'writeInt32LE';
Uint32Array.prototype.BYTES_PER_ELEMENT=4;

module.exports.Uint32Array = function (length){
	var target = new Uint32Array(length);
	var handler = handlerMaker(target);	
	return Proxy.create(handler,target);
}

//Float32Array
function Float32Array(length){
	ArrayBuffer.apply(this, arguments);
	this.BYTES_PER_ELEMENT=4;
	this.length = this.byteLength / this.BYTES_PER_ELEMENT;
}
Float32Array.prototype.getter = function(i){return this.buffer.readFloatLE(i)};//;
Float32Array.prototype.setter = function(x,i){return this.buffer.writeFloatLE(x,i)};//'writeInt32LE';
Float32Array.prototype.BYTES_PER_ELEMENT=4;

module.exports.Float32Array = function (length){
	var target = new Float32Array(length);
	var handler = handlerMaker(target);	
	return Proxy.create(handler,target);
}

//Float64Array
function Float64Array(length){
	ArrayBuffer.apply(this, arguments);
	this.length = length;
	this.BYTES_PER_ELEMENT=8;
	this.length = this.byteLength / this.BYTES_PER_ELEMENT;
}
Float64Array.prototype.getter = function(i){return this.buffer.readDoubleLE(i)};//;
Float64Array.prototype.setter = function(x,i){return this.buffer.writeDoubleLE(x,i)};//'writeInt32LE';
Float64Array.prototype.BYTES_PER_ELEMENT=8;

module.exports.Float64Array = function (length){
	var target = new Float64Array(length);
	var handler = handlerMaker(target);	
	return Proxy.create(handler,target);
}










