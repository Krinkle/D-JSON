/**
 * D-JSON: Distributed JSON
 *
 * @author Timo Tijhof, 2012
 * @license Public domain
 * @license WTFPL v2
 *
 * @example
 * {"foo~x~
 * ~x~":"bar"}
 *
 * @example
 * {"foo~y1~
 * ~y1~":"ba~y2~
 * ~y2~r"}
 */
(function () {
	var
		/**
		 * Storage of parts by their ID.
		 */
		store = {},
		/**
		 * Regex used to check and extract messages that need an additional
		 * part to be parsable. The ^~ is especially important for the case
		 * where the message may contain a "~" symbol somewhere inside the
		 * JSON, as well as in case the message both provides and needs a part.
		 * Check the unit tests for more info and examples.
		 */
		rProvidesPart = /^~([^~]+)~(.*)$/,
		rNeedsPart = /^(.*)~([^~]+)~$/;

	/**
	 * Parses a D-JSON message.
	 *
	 * @param String input
	 * @return Mixed|null: The parsed JSON value or null if
	 * the incoming message is invalid or needs more parts.
	 * @throws Error: For invalid input.
	 */
	function parseJSOND(msg) {
		var obj, matches, id;

		// First see if this is a provider for an earlier received partial message.
		// This must run before the rNeedsPart check, because if a messsage is
		// devided into 3 parts, the first needs to be prepended to the second, then
		// the result is stored which is then prepended to the third and final part.
		// Also scales for messages devided into more than 3 parts. 
		matches = rProvidesPart.exec(msg);
		if (matches && matches.length === 3) {
			id = matches[1];
			if (store[id] === undefined) {
				throw new Error('Illegal use of unknown ID: ' + id);
			} else {
				msg = store[id] + matches[2];
				// Clean up garbage
				delete store[id];
			}
		}

		matches = rNeedsPart.exec(msg);
		if (matches && matches.length === 3) {
			id = matches[2];
			if (store[id] !== undefined) {
				throw new Error("Illegal use of previously defined ID: " + id );
			}
			store[id] = matches[1];
			return null;
		}

		// Do the r checks before JSON.parse check, because a message could be
		// split into such a way that an indivual part is also valid JSON.
		// e.g. {"foo": "bar"} split as ['{"foo: ', '"bar"', '}'], where the second item
		// is valid JSON for a string.
		// Or {"foo: {"bar":"quux"}} as ['{"foo: ',  '{"bar":"quux"}', '}'] where the
		// second item is valid JSON for an object.
		try {
			obj = JSON.parse(msg);
		} catch (e) {
			obj = false;
		}

		if (obj === false) {
			throw new Error("Messages not needing parts must be valid JSON.");
		}

		return obj;
	}

	var JSOND = {
		parse: parseJSOND
	};

	// Expose: Server or browser
	if (typeof module !== 'undefined' && module.exports) {
		/*jshint node:true*/
		module.exports = JSOND;
	} else {
		this.JSOND = JSOND;
	}

}());