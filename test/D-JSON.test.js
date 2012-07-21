/*global JSOND, QUnit */

QUnit.module('JSOND');

QUnit.test('parse', function (assert) {
	var tmp, val;
	//QUnit.expect(4);

	val = JSOND.parse('{"key":"value"}');

	assert.deepEqual(
		val,
		{ key: 'value' },
		'Single-key object'
	);

	val = JSOND.parse('{"tilde ~ key":"value ~ with ~ tildes ~~~~."}');

	assert.deepEqual(
		val,
		{ 'tilde ~ key': 'value ~ with ~ tildes ~~~~.' },
		'Single-key object containing tilde characters'
	);

	val = JSOND.parse('{ "a" : "spacey string" }');

	assert.deepEqual(
		val,
		{ a: 'spacey string' },
		'Single-key object with liberal syntax spacing'
	);

	val = JSOND.parse('{"foo":"one", "bar": "two", "baz": "three" }')
;
	assert.deepEqual(
		val,
		{
			foo: 'one',
			bar: 'two',
			baz: 'three'
		},
		'Multi-key object with liberal syntax spacing'
	);

	tmp = JSOND.parse('{"foo":"bar",~id1a~');
	val = JSOND.parse('~id1a~"baz":"quux"}');

	assert.deepEqual(
		val,
		{
			foo: 'bar',
			baz: 'quux'
		},
		'Object in 2 parts'
	);

	tmp = JSOND.parse('{"foo":"bar",~id2a~');
	tmp = JSOND.parse('~id2a~"baz~id2b~');
	val = JSOND.parse('~id2b~":"quux"}');

	assert.deepEqual(
		val,
		{
			foo: 'bar',
			baz: 'quux'
		},
		'Object in 3 parts'
	);

	tmp = JSOND.parse('{"foo":"b~id4a~');
	tmp = JSOND.parse('~id4a~ar",~id4b~');
	tmp = JSOND.parse('~id4b~"baz~id4c~');
	val = JSOND.parse('~id4c~":"quux"}');

	assert.deepEqual(
		val,
		{
			foo: 'bar',
			baz: 'quux'
		},
		'Object in 4 parts'
	);

	assert.throws(function () {

		val = JSOND.parse('{foo}');

	}, 'Throw error for invalid JSON');

	assert.throws(function () {

		// On their own, these are valid JSON
		tmp = JSOND.parse('["foo"]~x~');
		val = JSOND.parse('~x~{"bar":"baz"}');

	}, 'Throw error for invalid JSON as result of (valid) parts coming together');

	assert.throws(function () {

		val = JSOND.parse('~bla~":"quux"}');

	}, 'Throw error for unknown ID');

	assert.throws(function () {

		val = JSOND.parse('~id4c~":"quux"}');

	}, 'Throw error for (previously known, now) unknown ID');

});
