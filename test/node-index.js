var qunit = require('qunit');

qunit.run({
    code: {
		path: './lib/D-JSON.js',
		namespace: 'JSOND'
    },
    tests: [
		'./test/D-JSON.test.js'
	]
});
