var qunit = require('qunit');

qunit.run({
    code: {
		path: './src/D-JSON.js',
		namespace: 'JSOND'
    },
    tests: [
		'./test/D-JSON.test.js'
	]
});
