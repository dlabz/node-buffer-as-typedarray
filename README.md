# node-buffer-as-typedarray
No copy wrap node Buffer as one of the typed array views 

This is a simple wrapper for node Buffer, that will simply add array like getters and setters, allowing you to use Buffer with existing js libraries, without need to copy entire Buffer.

This library uses Little Endian only.

It's unlikely anyone will need this.

#installation
```bash
$ npm install node-buffer-as-typedarray
```


```js
var fs = require('fs');
var wrapper = require('node-buffer-as-typedarray');
var uint32Array = new wrapper.Uint32Array(10);

uint32Array[0] = 10;
console.log(uint32Array[0]); //10
```
