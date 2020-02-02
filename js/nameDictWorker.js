(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.bC.aF === region.bX.aF)
	{
		return 'on line ' + region.bC.aF;
	}
	return 'on lines ' + region.bC.aF + ' through ' + region.bX.aF;
}



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList === 'function' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.d8,
		impl.fd,
		impl.eU,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_enqueueEffects(managers, result.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}


// BYTES

function _Bytes_width(bytes)
{
	return bytes.byteLength;
}

var _Bytes_getHostEndianness = F2(function(le, be)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(new Uint8Array(new Uint32Array([1]))[0] === 1 ? le : be));
	});
});


// ENCODERS

function _Bytes_encode(encoder)
{
	var mutableBytes = new DataView(new ArrayBuffer($elm$bytes$Bytes$Encode$getWidth(encoder)));
	$elm$bytes$Bytes$Encode$write(encoder)(mutableBytes)(0);
	return mutableBytes;
}


// SIGNED INTEGERS

var _Bytes_write_i8  = F3(function(mb, i, n) { mb.setInt8(i, n); return i + 1; });
var _Bytes_write_i16 = F4(function(mb, i, n, isLE) { mb.setInt16(i, n, isLE); return i + 2; });
var _Bytes_write_i32 = F4(function(mb, i, n, isLE) { mb.setInt32(i, n, isLE); return i + 4; });


// UNSIGNED INTEGERS

var _Bytes_write_u8  = F3(function(mb, i, n) { mb.setUint8(i, n); return i + 1 ;});
var _Bytes_write_u16 = F4(function(mb, i, n, isLE) { mb.setUint16(i, n, isLE); return i + 2; });
var _Bytes_write_u32 = F4(function(mb, i, n, isLE) { mb.setUint32(i, n, isLE); return i + 4; });


// FLOATS

var _Bytes_write_f32 = F4(function(mb, i, n, isLE) { mb.setFloat32(i, n, isLE); return i + 4; });
var _Bytes_write_f64 = F4(function(mb, i, n, isLE) { mb.setFloat64(i, n, isLE); return i + 8; });


// BYTES

var _Bytes_write_bytes = F3(function(mb, offset, bytes)
{
	for (var i = 0, len = bytes.byteLength, limit = len - 4; i <= limit; i += 4)
	{
		mb.setUint32(offset + i, bytes.getUint32(i));
	}
	for (; i < len; i++)
	{
		mb.setUint8(offset + i, bytes.getUint8(i));
	}
	return offset + len;
});


// STRINGS

function _Bytes_getStringWidth(string)
{
	for (var width = 0, i = 0; i < string.length; i++)
	{
		var code = string.charCodeAt(i);
		width +=
			(code < 0x80) ? 1 :
			(code < 0x800) ? 2 :
			(code < 0xD800 || 0xDBFF < code) ? 3 : (i++, 4);
	}
	return width;
}

var _Bytes_write_string = F3(function(mb, offset, string)
{
	for (var i = 0; i < string.length; i++)
	{
		var code = string.charCodeAt(i);
		offset +=
			(code < 0x80)
				? (mb.setUint8(offset, code)
				, 1
				)
				:
			(code < 0x800)
				? (mb.setUint16(offset, 0xC080 /* 0b1100000010000000 */
					| (code >>> 6 & 0x1F /* 0b00011111 */) << 8
					| code & 0x3F /* 0b00111111 */)
				, 2
				)
				:
			(code < 0xD800 || 0xDBFF < code)
				? (mb.setUint16(offset, 0xE080 /* 0b1110000010000000 */
					| (code >>> 12 & 0xF /* 0b00001111 */) << 8
					| code >>> 6 & 0x3F /* 0b00111111 */)
				, mb.setUint8(offset + 2, 0x80 /* 0b10000000 */
					| code & 0x3F /* 0b00111111 */)
				, 3
				)
				:
			(code = (code - 0xD800) * 0x400 + string.charCodeAt(++i) - 0xDC00 + 0x10000
			, mb.setUint32(offset, 0xF0808080 /* 0b11110000100000001000000010000000 */
				| (code >>> 18 & 0x7 /* 0b00000111 */) << 24
				| (code >>> 12 & 0x3F /* 0b00111111 */) << 16
				| (code >>> 6 & 0x3F /* 0b00111111 */) << 8
				| code & 0x3F /* 0b00111111 */)
			, 4
			);
	}
	return offset;
});


// DECODER

var _Bytes_decode = F2(function(decoder, bytes)
{
	try {
		return $elm$core$Maybe$Just(A2(decoder, bytes, 0).b);
	} catch(e) {
		return $elm$core$Maybe$Nothing;
	}
});

var _Bytes_read_i8  = F2(function(      bytes, offset) { return _Utils_Tuple2(offset + 1, bytes.getInt8(offset)); });
var _Bytes_read_i16 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 2, bytes.getInt16(offset, isLE)); });
var _Bytes_read_i32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getInt32(offset, isLE)); });
var _Bytes_read_u8  = F2(function(      bytes, offset) { return _Utils_Tuple2(offset + 1, bytes.getUint8(offset)); });
var _Bytes_read_u16 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 2, bytes.getUint16(offset, isLE)); });
var _Bytes_read_u32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getUint32(offset, isLE)); });
var _Bytes_read_f32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getFloat32(offset, isLE)); });
var _Bytes_read_f64 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 8, bytes.getFloat64(offset, isLE)); });

var _Bytes_read_bytes = F3(function(len, bytes, offset)
{
	return _Utils_Tuple2(offset + len, new DataView(bytes.buffer, bytes.byteOffset + offset, len));
});

var _Bytes_read_string = F3(function(len, bytes, offset)
{
	var string = '';
	var end = offset + len;
	for (; offset < end;)
	{
		var byte = bytes.getUint8(offset++);
		string +=
			(byte < 128)
				? String.fromCharCode(byte)
				:
			((byte & 0xE0 /* 0b11100000 */) === 0xC0 /* 0b11000000 */)
				? String.fromCharCode((byte & 0x1F /* 0b00011111 */) << 6 | bytes.getUint8(offset++) & 0x3F /* 0b00111111 */)
				:
			((byte & 0xF0 /* 0b11110000 */) === 0xE0 /* 0b11100000 */)
				? String.fromCharCode(
					(byte & 0xF /* 0b00001111 */) << 12
					| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 6
					| bytes.getUint8(offset++) & 0x3F /* 0b00111111 */
				)
				:
				(byte =
					((byte & 0x7 /* 0b00000111 */) << 18
						| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 12
						| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 6
						| bytes.getUint8(offset++) & 0x3F /* 0b00111111 */
					) - 0x10000
				, String.fromCharCode(Math.floor(byte / 0x400) + 0xD800, byte % 0x400 + 0xDC00)
				);
	}
	return _Utils_Tuple2(offset, string);
});

var _Bytes_decodeFailure = F2(function() { throw 0; });



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.dV.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.dV.b, xhr)); });
		$elm$core$Maybe$isJust(request.c2) && _Http_track(router, xhr, request.c2.a);

		try {
			xhr.open(request.ei, request.fe, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.fe));
		}

		_Http_configureRequest(xhr, request);

		request.dy.a && xhr.setRequestHeader('Content-Type', request.dy.a);
		xhr.send(request.dy.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.b4; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.e8.a || 0;
	xhr.responseType = request.dV.d;
	xhr.withCredentials = request.dq;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		fe: xhr.responseURL,
		eN: xhr.status,
		eO: xhr.statusText,
		b4: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			eF: event.loaded,
			cY: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			ew: event.loaded,
			cY: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}

// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.el) { flags += 'm'; }
	if (options.dH) { flags += 'i'; }

	try
	{
		return $elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return $elm$core$Maybe$Nothing;
	}
});


// USE

var _Regex_contains = F2(function(re, string)
{
	return string.match(re) !== null;
});


var _Regex_findAtMost = F3(function(n, re, str)
{
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex == re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		out.push(A4($elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _List_fromArray(out);
});


var _Regex_replaceAtMost = F4(function(n, re, replacer, string)
{
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		return replacer(A4($elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
	}
	return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function(n, re, str)
{
	var string = str;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		var result = re.exec(string);
		if (!result) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _List_fromArray(out);
});

var _Regex_infinity = Infinity;




// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$False = 1;
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$append = _Utils_append;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$String$length = _String_length;
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)),
			string);
	});
var $author$project$NameDictWorker$dataPath = function (id) {
	return '/data/names' + (A3(
		$elm$core$String$padLeft,
		2,
		'0',
		$elm$core$String$fromInt(id)) + '.dat');
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $author$project$NameDictWorker$nbrFiles = 60;
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.j) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.n),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.n);
		} else {
			var treeLen = builder.j * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.o) : builder.o;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.j);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.n) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.n);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{o: nodeList, j: (len / $elm$core$Array$branchFactor) | 0, n: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$NameDictWorker$init = function (flags) {
	var ids = A2($elm$core$List$range, 0, $author$project$NameDictWorker$nbrFiles - 1);
	return _Utils_Tuple2(
		{
			aY: 'loading indexedDb...',
			T: 0,
			ad: '',
			J: $elm$core$Set$fromList(
				A2($elm$core$List$map, $author$project$NameDictWorker$dataPath, ids)),
			a4: false
		},
		$elm$core$Platform$Cmd$none);
};
var $author$project$NameDictWorker$Broadcast = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $author$project$NameDictWorker$GetData = {$: 1};
var $author$project$NameDictWorker$GotDataFromIndexedDb = function (a) {
	return {$: 3, a: a};
};
var $author$project$NameDictWorker$GotIndexedDbStatus = function (a) {
	return {$: 0, a: a};
};
var $author$project$NameDictWorker$NoOp = {$: 5};
var $author$project$NameDictWorker$Search = function (a) {
	return {$: 4, a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $miniBill$elm_codec$Codec$decoder = function (_v0) {
	var m = _v0;
	return m.f;
};
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {cH: processes, c0: taggers};
	});
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 1) {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.cH;
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.c0);
		if (_v0.$ === 1) {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$NameDictWorker$inbound = _Platform_incomingPort('inbound', $elm$json$Json$Decode$value);
var $author$project$NameDictWorker$indexedDbStatus = _Platform_incomingPort('indexedDbStatus', $elm$json$Json$Decode$value);
var $author$project$NameDictWorker$loadedFromIndexedDb = _Platform_incomingPort('loadedFromIndexedDb', $elm$json$Json$Decode$value);
var $author$project$Common$LoadAssets = {$: 1};
var $author$project$Common$SearchCmd = function (a) {
	return {$: 0, a: a};
};
var $miniBill$elm_codec$Codec$Codec = $elm$core$Basics$identity;
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $miniBill$elm_codec$Codec$buildCustom = function (_v0) {
	var am = _v0;
	return {
		f: A2(
			$elm$json$Json$Decode$andThen,
			function (tag) {
				var error = 'tag ' + (tag + 'did not match');
				return A2(
					$elm$json$Json$Decode$field,
					'args',
					A2(
						am.f,
						tag,
						$elm$json$Json$Decode$fail(error)));
			},
			A2($elm$json$Json$Decode$field, 'tag', $elm$json$Json$Decode$string)),
		h: function (v) {
			return am.eh(v);
		}
	};
};
var $miniBill$elm_codec$Codec$CustomCodec = $elm$core$Basics$identity;
var $miniBill$elm_codec$Codec$custom = function (match) {
	return {
		f: function (_v0) {
			return $elm$core$Basics$identity;
		},
		eh: match
	};
};
var $miniBill$elm_codec$Codec$build = F2(
	function (encoder_, decoder_) {
		return {f: decoder_, h: encoder_};
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $miniBill$elm_codec$Codec$string = A2($miniBill$elm_codec$Codec$build, $elm$json$Json$Encode$string, $elm$json$Json$Decode$string);
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $miniBill$elm_codec$Codec$variant = F4(
	function (name, matchPiece, decoderPiece, _v0) {
		var am = _v0;
		var enc = function (v) {
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'tag',
						$elm$json$Json$Encode$string(name)),
						_Utils_Tuple2(
						'args',
						A2($elm$json$Json$Encode$list, $elm$core$Basics$identity, v))
					]));
		};
		var decoder_ = F2(
			function (tag, orElse) {
				return _Utils_eq(tag, name) ? decoderPiece : A2(am.f, tag, orElse);
			});
		return {
			f: decoder_,
			eh: am.eh(
				matchPiece(enc))
		};
	});
var $miniBill$elm_codec$Codec$variant0 = F2(
	function (name, ctor) {
		return A3(
			$miniBill$elm_codec$Codec$variant,
			name,
			function (c) {
				return c(_List_Nil);
			},
			$elm$json$Json$Decode$succeed(ctor));
	});
var $miniBill$elm_codec$Codec$encoder = function (_v0) {
	var m = _v0;
	return m.h;
};
var $elm$json$Json$Decode$index = _Json_decodeIndex;
var $elm$json$Json$Decode$map = _Json_map1;
var $miniBill$elm_codec$Codec$variant1 = F3(
	function (name, ctor, m1) {
		return A3(
			$miniBill$elm_codec$Codec$variant,
			name,
			F2(
				function (c, v) {
					return c(
						_List_fromArray(
							[
								A2($miniBill$elm_codec$Codec$encoder, m1, v)
							]));
				}),
			A2(
				$elm$json$Json$Decode$map,
				ctor,
				A2(
					$elm$json$Json$Decode$index,
					0,
					$miniBill$elm_codec$Codec$decoder(m1))));
	});
var $author$project$Common$workerCmdCodec = $miniBill$elm_codec$Codec$buildCustom(
	A3(
		$miniBill$elm_codec$Codec$variant0,
		'LoadAssets',
		$author$project$Common$LoadAssets,
		A4(
			$miniBill$elm_codec$Codec$variant1,
			'SearchCmd',
			$author$project$Common$SearchCmd,
			$miniBill$elm_codec$Codec$string,
			$miniBill$elm_codec$Codec$custom(
				F3(
					function (fSearchCmd, fLoadAssets, value) {
						if (!value.$) {
							var s = value.a;
							return fSearchCmd(s);
						} else {
							return fLoadAssets;
						}
					})))));
var $author$project$NameDictWorker$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$author$project$NameDictWorker$loadedFromIndexedDb($author$project$NameDictWorker$GotDataFromIndexedDb),
				$author$project$NameDictWorker$indexedDbStatus($author$project$NameDictWorker$GotIndexedDbStatus),
				$author$project$NameDictWorker$inbound(
				function (c) {
					var _v0 = A2(
						$elm$json$Json$Decode$decodeValue,
						$miniBill$elm_codec$Codec$decoder($author$project$Common$workerCmdCodec),
						c);
					if (!_v0.$) {
						if (!_v0.a.$) {
							var s = _v0.a.a;
							return $author$project$NameDictWorker$Search(s);
						} else {
							var _v1 = _v0.a;
							return $author$project$NameDictWorker$GetData;
						}
					} else {
						return $author$project$NameDictWorker$NoOp;
					}
				}),
				A2(
				$elm$time$Time$every,
				2000,
				$author$project$NameDictWorker$Broadcast('')),
				A2(
				$elm$time$Time$every,
				1000,
				$author$project$NameDictWorker$Broadcast('worker alive'))
			]));
};
var $author$project$NameDictWorker$IndexedDbData = function (a) {
	return {$: 0, a: a};
};
var $author$project$Common$LoadingStatusMsg = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Common$NameDictResult = function (a) {
	return {$: 0, a: a};
};
var $author$project$Common$NameDictWorker = 0;
var $author$project$NameDictWorker$NoData = function (a) {
	return {$: 1, a: a};
};
var $author$project$Common$Pending = 1;
var $author$project$Common$SearchResultMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Common$Success = 2;
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$Basics$not = _Basics_not;
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$String$contains = _String_contains;
var $elm$bytes$Bytes$Encode$getWidth = function (builder) {
	switch (builder.$) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 4;
		case 3:
			return 1;
		case 4:
			return 2;
		case 5:
			return 4;
		case 6:
			return 4;
		case 7:
			return 8;
		case 8:
			var w = builder.a;
			return w;
		case 9:
			var w = builder.a;
			return w;
		default:
			var bs = builder.a;
			return _Bytes_width(bs);
	}
};
var $elm$bytes$Bytes$LE = 0;
var $elm$bytes$Bytes$Encode$write = F3(
	function (builder, mb, offset) {
		switch (builder.$) {
			case 0:
				var n = builder.a;
				return A3(_Bytes_write_i8, mb, offset, n);
			case 1:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_i16, mb, offset, n, !e);
			case 2:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_i32, mb, offset, n, !e);
			case 3:
				var n = builder.a;
				return A3(_Bytes_write_u8, mb, offset, n);
			case 4:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_u16, mb, offset, n, !e);
			case 5:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_u32, mb, offset, n, !e);
			case 6:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_f32, mb, offset, n, !e);
			case 7:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_f64, mb, offset, n, !e);
			case 8:
				var bs = builder.b;
				return A3($elm$bytes$Bytes$Encode$writeSequence, bs, mb, offset);
			case 9:
				var s = builder.b;
				return A3(_Bytes_write_string, mb, offset, s);
			default:
				var bs = builder.a;
				return A3(_Bytes_write_bytes, mb, offset, bs);
		}
	});
var $elm$bytes$Bytes$Encode$writeSequence = F3(
	function (builders, mb, offset) {
		writeSequence:
		while (true) {
			if (!builders.b) {
				return offset;
			} else {
				var b = builders.a;
				var bs = builders.b;
				var $temp$builders = bs,
					$temp$mb = mb,
					$temp$offset = A3($elm$bytes$Bytes$Encode$write, b, mb, offset);
				builders = $temp$builders;
				mb = $temp$mb;
				offset = $temp$offset;
				continue writeSequence;
			}
		}
	});
var $elm$bytes$Bytes$Decode$decode = F2(
	function (_v0, bs) {
		var decoder = _v0;
		return A2(_Bytes_decode, decoder, bs);
	});
var $elm$bytes$Bytes$Decode$Decoder = $elm$core$Basics$identity;
var $elm$bytes$Bytes$Decode$string = function (n) {
	return _Bytes_read_string(n);
};
var $elm$bytes$Bytes$width = _Bytes_width;
var $author$project$NameDictWorker$decodeAsString = function (buffer) {
	var decoder = $elm$bytes$Bytes$Decode$string(
		$elm$bytes$Bytes$width(buffer));
	return A2($elm$bytes$Bytes$Decode$decode, decoder, buffer);
};
var $folkertdev$elm_flate$Flate$Dynamic = function (a) {
	return {$: 1, a: a};
};
var $folkertdev$elm_flate$Flate$WithWindowSize = function (a) {
	return {$: 1, a: a};
};
var $elm$bytes$Bytes$Decode$Done = function (a) {
	return {$: 1, a: a};
};
var $elm$bytes$Bytes$Decode$Loop = function (a) {
	return {$: 0, a: a};
};
var $elm$bytes$Bytes$Decode$bytes = function (n) {
	return _Bytes_read_bytes(n);
};
var $elm$bytes$Bytes$Decode$map = F2(
	function (func, _v0) {
		var decodeA = _v0;
		return F2(
			function (bites, offset) {
				var _v1 = A2(decodeA, bites, offset);
				var aOffset = _v1.a;
				var a = _v1.b;
				return _Utils_Tuple2(
					aOffset,
					func(a));
			});
	});
var $elm$bytes$Bytes$Decode$succeed = function (a) {
	return F2(
		function (_v0, offset) {
			return _Utils_Tuple2(offset, a);
		});
};
var $folkertdev$elm_flate$Deflate$Internal$chunksHelp = F2(
	function (chunkSize, _v0) {
		var sizeRemaining = _v0.a;
		var accum = _v0.b;
		return (!sizeRemaining) ? $elm$bytes$Bytes$Decode$succeed(
			$elm$bytes$Bytes$Decode$Done(_List_Nil)) : ((_Utils_cmp(chunkSize, sizeRemaining) > 0) ? A2(
			$elm$bytes$Bytes$Decode$map,
			function (_new) {
				return $elm$bytes$Bytes$Decode$Done(
					$elm$core$List$reverse(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(true, _new),
							accum)));
			},
			$elm$bytes$Bytes$Decode$bytes(sizeRemaining)) : A2(
			$elm$bytes$Bytes$Decode$map,
			function (_new) {
				return $elm$bytes$Bytes$Decode$Loop(
					_Utils_Tuple2(
						sizeRemaining - chunkSize,
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(false, _new),
							accum)));
			},
			$elm$bytes$Bytes$Decode$bytes(chunkSize)));
	});
var $elm$bytes$Bytes$Encode$encode = _Bytes_encode;
var $elm$bytes$Bytes$Decode$loopHelp = F4(
	function (state, callback, bites, offset) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var decoder = _v0;
			var _v1 = A2(decoder, bites, offset);
			var newOffset = _v1.a;
			var step = _v1.b;
			if (!step.$) {
				var newState = step.a;
				var $temp$state = newState,
					$temp$callback = callback,
					$temp$bites = bites,
					$temp$offset = newOffset;
				state = $temp$state;
				callback = $temp$callback;
				bites = $temp$bites;
				offset = $temp$offset;
				continue loopHelp;
			} else {
				var result = step.a;
				return _Utils_Tuple2(newOffset, result);
			}
		}
	});
var $elm$bytes$Bytes$Decode$loop = F2(
	function (state, callback) {
		return A2($elm$bytes$Bytes$Decode$loopHelp, state, callback);
	});
var $elm$bytes$Bytes$Encode$Seq = F2(
	function (a, b) {
		return {$: 8, a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$getWidths = F2(
	function (width, builders) {
		getWidths:
		while (true) {
			if (!builders.b) {
				return width;
			} else {
				var b = builders.a;
				var bs = builders.b;
				var $temp$width = width + $elm$bytes$Bytes$Encode$getWidth(b),
					$temp$builders = bs;
				width = $temp$width;
				builders = $temp$builders;
				continue getWidths;
			}
		}
	});
var $elm$bytes$Bytes$Encode$sequence = function (builders) {
	return A2(
		$elm$bytes$Bytes$Encode$Seq,
		A2($elm$bytes$Bytes$Encode$getWidths, 0, builders),
		builders);
};
var $folkertdev$elm_flate$Deflate$Internal$chunks = F2(
	function (chunkSize, buffer) {
		var _v0 = A2(
			$elm$bytes$Bytes$Decode$decode,
			A2(
				$elm$bytes$Bytes$Decode$loop,
				_Utils_Tuple2(
					$elm$bytes$Bytes$width(buffer),
					_List_Nil),
				$folkertdev$elm_flate$Deflate$Internal$chunksHelp(chunkSize)),
			buffer);
		if (_v0.$ === 1) {
			return _List_fromArray(
				[
					_Utils_Tuple2(
					true,
					$elm$bytes$Bytes$Encode$encode(
						$elm$bytes$Bytes$Encode$sequence(_List_Nil)))
				]);
		} else {
			if (!_v0.a.b) {
				return _List_fromArray(
					[
						_Utils_Tuple2(
						true,
						$elm$bytes$Bytes$Encode$encode(
							$elm$bytes$Bytes$Encode$sequence(_List_Nil)))
					]);
			} else {
				var value = _v0.a;
				return value;
			}
		}
	});
var $folkertdev$elm_flate$Deflate$Internal$default_block_size = 1024 * 1024;
var $folkertdev$elm_flate$Deflate$BitWriter$empty = {L: 0, M: _List_Nil, X: 0};
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $folkertdev$elm_flate$Deflate$Symbol$code = function (symbol) {
	switch (symbol.$) {
		case 1:
			var _byte = symbol.a;
			return _byte;
		case 0:
			return 256;
		default:
			var length = symbol.a;
			return ((length >= 3) && (length <= 10)) ? ((257 + length) - 3) : (((length >= 11) && (length <= 18)) ? (265 + (((length - 11) / 2) | 0)) : (((length >= 19) && (length <= 34)) ? (269 + (((length - 19) / 4) | 0)) : (((length >= 35) && (length <= 66)) ? (273 + (((length - 35) / 8) | 0)) : (((length >= 67) && (length <= 130)) ? (277 + (((length - 67) / 16) | 0)) : (((length >= 131) && (length <= 257)) ? (281 + (((length - 131) / 32) | 0)) : ((length === 258) ? 285 : (-1)))))));
	}
};
var $elm$core$Basics$modBy = _Basics_modBy;
var $folkertdev$elm_flate$Deflate$Symbol$distance = function (symbol) {
	if (symbol.$ === 2) {
		var distance_ = symbol.b;
		if (distance_ <= 4) {
			return $elm$core$Maybe$Just(
				_Utils_Tuple3(distance_ - 1, 0, 0));
		} else {
			var go = F3(
				function (extraBits, code_, base) {
					go:
					while (true) {
						if (_Utils_cmp(base * 2, distance_) < 0) {
							var $temp$extraBits = extraBits + 1,
								$temp$code_ = code_ + 2,
								$temp$base = base * 2;
							extraBits = $temp$extraBits;
							code_ = $temp$code_;
							base = $temp$base;
							continue go;
						} else {
							return _Utils_Tuple3(extraBits, code_, base);
						}
					}
				});
			var _v1 = A3(go, 1, 4, 4);
			var extraBits = _v1.a;
			var code_ = _v1.b;
			var base = _v1.c;
			var delta = (distance_ - base) - 1;
			var half = (base / 2) | 0;
			return (_Utils_cmp(distance_, base + half) < 1) ? $elm$core$Maybe$Just(
				_Utils_Tuple3(
					code_,
					extraBits,
					A2($elm$core$Basics$modBy, half, delta))) : $elm$core$Maybe$Just(
				_Utils_Tuple3(
					code_ + 1,
					extraBits,
					A2($elm$core$Basics$modBy, half, delta)));
		}
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (!_v0.$) {
			var subTree = _v0.a;
			var newSub = A4($elm$core$Array$setHelp, shift - $elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _v0.a;
			var newLeaf = A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, values);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var $elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, tail)) : A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4($elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var $folkertdev$elm_flate$Deflate$Symbol$update = F3(
	function (index, tagger, array) {
		var _v0 = A2($elm$core$Array$get, index, array);
		if (_v0.$ === 1) {
			return array;
		} else {
			var value = _v0.a;
			return A3(
				$elm$core$Array$set,
				index,
				tagger(value),
				array);
		}
	});
var $folkertdev$elm_flate$Deflate$Symbol$dynamicFindFrequencies = F2(
	function (symbol, _v0) {
		var literalCounts = _v0.a;
		var distanceCounts = _v0.b;
		var emptyDistanceCount = _v0.c;
		var _v1 = $folkertdev$elm_flate$Deflate$Symbol$distance(symbol);
		if (_v1.$ === 1) {
			return _Utils_Tuple3(
				A3(
					$folkertdev$elm_flate$Deflate$Symbol$update,
					$folkertdev$elm_flate$Deflate$Symbol$code(symbol),
					function (v) {
						return v + 1;
					},
					literalCounts),
				distanceCounts,
				emptyDistanceCount);
		} else {
			var _v2 = _v1.a;
			var d = _v2.a;
			return _Utils_Tuple3(
				A3(
					$folkertdev$elm_flate$Deflate$Symbol$update,
					$folkertdev$elm_flate$Deflate$Symbol$code(symbol),
					function (v) {
						return v + 1;
					},
					literalCounts),
				A3(
					$folkertdev$elm_flate$Deflate$Symbol$update,
					d,
					function (v) {
						return v + 1;
					},
					distanceCounts),
				false);
		}
	});
var $elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var $elm$core$Array$foldl = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldl, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldl,
			func,
			A3($elm$core$Elm$JsArray$foldl, helper, baseCase, tree),
			tail);
	});
var $elm$core$List$sortWith = _List_sortWith;
var $folkertdev$elm_flate$Huffman$calcOptimalMaxBitWidth = function (frequencies) {
	var heapModificationLoop = function (heap) {
		heapModificationLoop:
		while (true) {
			if (!heap.b) {
				return 0;
			} else {
				if (!heap.b.b) {
					var _v1 = heap.a;
					var value = _v1.b;
					return A2($elm$core$Basics$max, 1, value);
				} else {
					var _v2 = heap.a;
					var weight1 = _v2.a;
					var width1 = _v2.b;
					var _v3 = heap.b;
					var _v4 = _v3.a;
					var weight2 = _v4.a;
					var width2 = _v4.b;
					var rest = _v3.b;
					var $temp$heap = A2(
						$elm$core$List$sortWith,
						F2(
							function (a, b) {
								return A2($elm$core$Basics$compare, b, a);
							}),
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								weight1 + weight2,
								1 + A2($elm$core$Basics$max, width1, width2)),
							rest));
					heap = $temp$heap;
					continue heapModificationLoop;
				}
			}
		}
	};
	var createHeapFolder = F2(
		function (freq, heap) {
			return (freq > 0) ? A2(
				$elm$core$List$cons,
				_Utils_Tuple2(-freq, 0),
				heap) : heap;
		});
	var createHeap = A3($elm$core$Array$foldl, createHeapFolder, _List_Nil, frequencies);
	return heapModificationLoop(createHeap);
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{o: nodeList, j: nodeListSize, n: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $elm$core$Array$filter = F2(
	function (isGood, array) {
		return $elm$core$Array$fromList(
			A3(
				$elm$core$Array$foldr,
				F2(
					function (x, xs) {
						return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
					}),
				_List_Nil,
				array));
	});
var $elm$core$Elm$JsArray$indexedMap = _JsArray_indexedMap;
var $elm$core$Array$indexedMap = F2(
	function (func, _v0) {
		var len = _v0.a;
		var tree = _v0.c;
		var tail = _v0.d;
		var initialBuilder = {
			o: _List_Nil,
			j: 0,
			n: A3(
				$elm$core$Elm$JsArray$indexedMap,
				func,
				$elm$core$Array$tailIndex(len),
				tail)
		};
		var helper = F2(
			function (node, builder) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, builder, subTree);
				} else {
					var leaf = node.a;
					var offset = builder.j * $elm$core$Array$branchFactor;
					var mappedLeaf = $elm$core$Array$Leaf(
						A3($elm$core$Elm$JsArray$indexedMap, func, offset, leaf));
					return {
						o: A2($elm$core$List$cons, mappedLeaf, builder.o),
						j: builder.j + 1,
						n: builder.n
					};
				}
			});
		return A2(
			$elm$core$Array$builderToArray,
			true,
			A3($elm$core$Elm$JsArray$foldl, helper, initialBuilder, tree));
	});
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $elm$core$Elm$JsArray$map = _JsArray_map;
var $elm$core$Array$map = F2(
	function (func, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = function (node) {
			if (!node.$) {
				var subTree = node.a;
				return $elm$core$Array$SubTree(
					A2($elm$core$Elm$JsArray$map, helper, subTree));
			} else {
				var values = node.a;
				return $elm$core$Array$Leaf(
					A2($elm$core$Elm$JsArray$map, func, values));
			}
		};
		return A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A2($elm$core$Elm$JsArray$map, helper, tree),
			A2($elm$core$Elm$JsArray$map, func, tail));
	});
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.n)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.n, tail);
		return (notAppended < 0) ? {
			o: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.o),
			j: builder.j + 1,
			n: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			o: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.o),
			j: builder.j + 1,
			n: $elm$core$Elm$JsArray$empty
		} : {o: builder.o, j: builder.j, n: appended});
	});
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!value.$) {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$appendHelpTree = F2(
	function (toAppend, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		var itemsToAppend = $elm$core$Elm$JsArray$length(toAppend);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(tail)) - itemsToAppend;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, tail, toAppend);
		var newArray = A2($elm$core$Array$unsafeReplaceTail, appended, array);
		if (notAppended < 0) {
			var nextTail = A3($elm$core$Elm$JsArray$slice, notAppended, itemsToAppend, toAppend);
			return A2($elm$core$Array$unsafeReplaceTail, nextTail, newArray);
		} else {
			return newArray;
		}
	});
var $elm$core$Array$builderFromArray = function (_v0) {
	var len = _v0.a;
	var tree = _v0.c;
	var tail = _v0.d;
	var helper = F2(
		function (node, acc) {
			if (!node.$) {
				var subTree = node.a;
				return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
			} else {
				return A2($elm$core$List$cons, node, acc);
			}
		});
	return {
		o: A3($elm$core$Elm$JsArray$foldl, helper, _List_Nil, tree),
		j: (len / $elm$core$Array$branchFactor) | 0,
		n: tail
	};
};
var $elm$core$Array$append = F2(
	function (a, _v0) {
		var aTail = a.d;
		var bLen = _v0.a;
		var bTree = _v0.c;
		var bTail = _v0.d;
		if (_Utils_cmp(bLen, $elm$core$Array$branchFactor * 4) < 1) {
			var foldHelper = F2(
				function (node, array) {
					if (!node.$) {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, array, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpTree, leaf, array);
					}
				});
			return A2(
				$elm$core$Array$appendHelpTree,
				bTail,
				A3($elm$core$Elm$JsArray$foldl, foldHelper, a, bTree));
		} else {
			var foldHelper = F2(
				function (node, builder) {
					if (!node.$) {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, builder, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpBuilder, leaf, builder);
					}
				});
			return A2(
				$elm$core$Array$builderToArray,
				true,
				A2(
					$elm$core$Array$appendHelpBuilder,
					bTail,
					A3(
						$elm$core$Elm$JsArray$foldl,
						foldHelper,
						$elm$core$Array$builderFromArray(a),
						bTree)));
		}
	});
var $elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			$elm$core$Array$unsafeReplaceTail,
			A2($elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$mergeLoop = F3(
	function (xarr, yarr, accum) {
		mergeLoop:
		while (true) {
			var _v0 = _Utils_Tuple2(xarr, yarr);
			if (!_v0.a.b) {
				return A2(
					$elm$core$Array$append,
					accum,
					$elm$core$Array$fromList(yarr));
			} else {
				if (!_v0.b.b) {
					return A2(
						$elm$core$Array$append,
						accum,
						$elm$core$Array$fromList(xarr));
				} else {
					var _v1 = _v0.a;
					var x = _v1.a;
					var xrest = _v1.b;
					var _v2 = _v0.b;
					var y = _v2.a;
					var yrest = _v2.b;
					if (_Utils_cmp(x.Q, y.Q) < 0) {
						var $temp$xarr = xrest,
							$temp$yarr = yarr,
							$temp$accum = A2($elm$core$Array$push, x, accum);
						xarr = $temp$xarr;
						yarr = $temp$yarr;
						accum = $temp$accum;
						continue mergeLoop;
					} else {
						var $temp$xarr = xarr,
							$temp$yarr = yrest,
							$temp$accum = A2($elm$core$Array$push, y, accum);
						xarr = $temp$xarr;
						yarr = $temp$yarr;
						accum = $temp$accum;
						continue mergeLoop;
					}
				}
			}
		}
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$merge = F2(
	function (x, y) {
		return A3(
			$folkertdev$elm_flate$LengthLimitedHuffmanCodes$mergeLoop,
			$elm$core$Array$toList(x),
			$elm$core$Array$toList(y),
			$elm$core$Array$empty);
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$mergeNodes = F2(
	function (node1, node2) {
		return {
			ar: A2($elm$core$Array$append, node1.ar, node2.ar),
			Q: node1.Q + node2.Q
		};
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$package = function (nodes) {
	if ($elm$core$Array$length(nodes) >= 2) {
		var newLen = ($elm$core$Array$length(nodes) / 2) | 0;
		var loop = F2(
			function (currentNodes, accum) {
				loop:
				while (true) {
					if (currentNodes.b && currentNodes.b.b) {
						var self = currentNodes.a;
						var _v1 = currentNodes.b;
						var other = _v1.a;
						var rest = _v1.b;
						var $temp$currentNodes = rest,
							$temp$accum = A2(
							$elm$core$List$cons,
							A2($folkertdev$elm_flate$LengthLimitedHuffmanCodes$mergeNodes, self, other),
							accum);
						currentNodes = $temp$currentNodes;
						accum = $temp$accum;
						continue loop;
					} else {
						return $elm$core$Array$fromList(
							$elm$core$List$reverse(accum));
					}
				}
			});
		return A2(
			loop,
			$elm$core$Array$toList(nodes),
			_List_Nil);
	} else {
		return nodes;
	}
};
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$core$Array$repeat = F2(
	function (n, e) {
		return A2(
			$elm$core$Array$initialize,
			n,
			function (_v0) {
				return e;
			});
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$singletonNode = F2(
	function (symbol, weight) {
		return {
			ar: A2($elm$core$Array$repeat, 1, symbol),
			Q: weight
		};
	});
var $elm_community$list_extra$List$Extra$stableSortWith = F2(
	function (pred, list) {
		var predWithIndex = F2(
			function (_v1, _v2) {
				var a1 = _v1.a;
				var i1 = _v1.b;
				var a2 = _v2.a;
				var i2 = _v2.b;
				var result = A2(pred, a1, a2);
				if (result === 1) {
					return A2($elm$core$Basics$compare, i1, i2);
				} else {
					return result;
				}
			});
		var listWithIndex = A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, a) {
					return _Utils_Tuple2(a, i);
				}),
			list);
		return A2(
			$elm$core$List$map,
			$elm$core$Tuple$first,
			A2($elm$core$List$sortWith, predWithIndex, listWithIndex));
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$update = F3(
	function (index, tagger, array) {
		var _v0 = A2($elm$core$Array$get, index, array);
		if (_v0.$ === 1) {
			return array;
		} else {
			var value = _v0.a;
			return A3(
				$elm$core$Array$set,
				index,
				tagger(value),
				array);
		}
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$calculate = F2(
	function (maxBitWidth, frequencies) {
		var source = $elm$core$Array$fromList(
			A2(
				$elm_community$list_extra$List$Extra$stableSortWith,
				F2(
					function (a, b) {
						return A2($elm$core$Basics$compare, a.Q, b.Q);
					}),
				$elm$core$Array$toList(
					A2(
						$elm$core$Array$map,
						function (_v3) {
							var symbol = _v3.a;
							var weight = _v3.b;
							return A2($folkertdev$elm_flate$LengthLimitedHuffmanCodes$singletonNode, symbol, weight);
						},
						A2(
							$elm$core$Array$filter,
							function (_v2) {
								var f = _v2.b;
								return f > 0;
							},
							A2($elm$core$Array$indexedMap, $elm$core$Tuple$pair, frequencies))))));
		var weighted = A3(
			$elm$core$List$foldl,
			F2(
				function (_v1, w) {
					return A2(
						$folkertdev$elm_flate$LengthLimitedHuffmanCodes$merge,
						$folkertdev$elm_flate$LengthLimitedHuffmanCodes$package(w),
						source);
				}),
			source,
			A2($elm$core$List$range, 0, maxBitWidth - 2));
		var loop = F2(
			function (symbols, accum) {
				loop:
				while (true) {
					if (!symbols.b) {
						return accum;
					} else {
						var symbol = symbols.a;
						var rest = symbols.b;
						var $temp$symbols = rest,
							$temp$accum = A3(
							$folkertdev$elm_flate$LengthLimitedHuffmanCodes$update,
							symbol,
							function (v) {
								return v + 1;
							},
							accum);
						symbols = $temp$symbols;
						accum = $temp$accum;
						continue loop;
					}
				}
			});
		var allSymbols = A2(
			$elm$core$List$concatMap,
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.ar;
				},
				$elm$core$Array$toList),
			$elm$core$Array$toList(
				$folkertdev$elm_flate$LengthLimitedHuffmanCodes$package(weighted)));
		return A2(
			loop,
			allSymbols,
			A2(
				$elm$core$Array$repeat,
				$elm$core$Array$length(frequencies),
				0));
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $folkertdev$elm_flate$Huffman$Tree = $elm$core$Basics$identity;
var $folkertdev$elm_flate$Huffman$Code = $elm$core$Basics$identity;
var $folkertdev$elm_flate$Huffman$codeFromRecord = $elm$core$Basics$identity;
var $folkertdev$elm_flate$Huffman$new = function (n) {
	return A2(
		$elm$core$Array$repeat,
		n,
		$folkertdev$elm_flate$Huffman$codeFromRecord(
			{a: 0, c9: 0}));
};
var $elm$core$Bitwise$or = _Bitwise_or;
var $folkertdev$elm_flate$Huffman$inverseEndianLoop = F4(
	function (i, limit, f, t) {
		inverseEndianLoop:
		while (true) {
			if (_Utils_cmp(i, limit) < 0) {
				var $temp$i = i + 1,
					$temp$limit = limit,
					$temp$f = f >> 1,
					$temp$t = (f & 1) | (t << 1);
				i = $temp$i;
				limit = $temp$limit;
				f = $temp$f;
				t = $temp$t;
				continue inverseEndianLoop;
			} else {
				return t;
			}
		}
	});
var $folkertdev$elm_flate$Huffman$inverseEndian = function (_v0) {
	var width = _v0.c9;
	var bits = _v0.a;
	var inverseBits = A4($folkertdev$elm_flate$Huffman$inverseEndianLoop, 0, width, bits, 0);
	return {a: inverseBits, c9: width};
};
var $folkertdev$elm_flate$Huffman$setMapping = F3(
	function (symbol, code, _v0) {
		var array = _v0;
		return A3(
			$elm$core$Array$set,
			symbol,
			$folkertdev$elm_flate$Huffman$inverseEndian(code),
			array);
	});
var $folkertdev$elm_flate$Huffman$restoreCanonicalHuffmanCodes = F2(
	function (bitWidths, tree) {
		var symbols = A2(
			$elm_community$list_extra$List$Extra$stableSortWith,
			F2(
				function (_v4, _v5) {
					var a = _v4.b;
					var b = _v5.b;
					return A2($elm$core$Basics$compare, a, b);
				}),
			$elm$core$Array$toList(
				A2(
					$elm$core$Array$filter,
					function (_v3) {
						var codeBitWidth = _v3.b;
						return codeBitWidth > 0;
					},
					A2($elm$core$Array$indexedMap, $elm$core$Tuple$pair, bitWidths))));
		var loop = F2(
			function (_v1, _v2) {
				var symbol = _v1.a;
				var bitWidth = _v1.b;
				var code = _v2.a;
				var prevWidth = _v2.b;
				var currentTree = _v2.c;
				var newBits = code << (bitWidth - prevWidth);
				var nextCode = {a: newBits, c9: bitWidth};
				return _Utils_Tuple3(
					newBits + 1,
					bitWidth,
					A3($folkertdev$elm_flate$Huffman$setMapping, symbol, nextCode, currentTree));
			});
		return function (_v0) {
			var x = _v0.c;
			return x;
		}(
			A3(
				$elm$core$List$foldl,
				loop,
				_Utils_Tuple3(0, 0, tree),
				symbols));
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $folkertdev$elm_flate$Huffman$fromBitWidths = function (bitWidths) {
	var symbolCount = function (v) {
		return v + 1;
	}(
		A2(
			$elm$core$Maybe$withDefault,
			0,
			A2(
				$elm$core$Maybe$map,
				$elm$core$Tuple$first,
				function (a) {
					return A2(
						$elm$core$Array$get,
						$elm$core$Array$length(a) - 1,
						a);
				}(
					A2(
						$elm$core$Array$filter,
						function (e) {
							return e.b > 0;
						},
						A2($elm$core$Array$indexedMap, $elm$core$Tuple$pair, bitWidths))))));
	return A2(
		$folkertdev$elm_flate$Huffman$restoreCanonicalHuffmanCodes,
		bitWidths,
		$folkertdev$elm_flate$Huffman$new(symbolCount));
};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $folkertdev$elm_flate$Huffman$fromFrequencies = F2(
	function (symbolFrequencies, maxBitWidth_) {
		var maxBitWidth = A2(
			$elm$core$Basics$min,
			maxBitWidth_,
			$folkertdev$elm_flate$Huffman$calcOptimalMaxBitWidth(symbolFrequencies));
		var codeBitWidhts = A2($folkertdev$elm_flate$LengthLimitedHuffmanCodes$calculate, maxBitWidth, symbolFrequencies);
		return $folkertdev$elm_flate$Huffman$fromBitWidths(codeBitWidhts);
	});
var $folkertdev$elm_flate$Deflate$Symbol$buildDynamicHuffmanCodec = function (symbols) {
	var _v0 = A3(
		$elm$core$Array$foldl,
		$folkertdev$elm_flate$Deflate$Symbol$dynamicFindFrequencies,
		_Utils_Tuple3(
			A2($elm$core$Array$repeat, 286, 0),
			A2($elm$core$Array$repeat, 30, 0),
			true),
		symbols);
	var literalCounts = _v0.a;
	var distanceCounts = _v0.b;
	var emptyDistanceCount = _v0.c;
	return {
		aj: emptyDistanceCount ? A2(
			$folkertdev$elm_flate$Huffman$fromFrequencies,
			A3($elm$core$Array$set, 0, 1, distanceCounts),
			15) : A2($folkertdev$elm_flate$Huffman$fromFrequencies, distanceCounts, 15),
		am: A2($folkertdev$elm_flate$Huffman$fromFrequencies, literalCounts, 15)
	};
};
var $folkertdev$elm_flate$Deflate$Symbol$EndOfBlock = {$: 0};
var $folkertdev$elm_flate$Deflate$Symbol$Literal = function (a) {
	return {$: 1, a: a};
};
var $folkertdev$elm_flate$Deflate$Symbol$Share = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $folkertdev$elm_flate$Deflate$Internal$codeToSymbol = function (code) {
	if (!code.$) {
		var v = code.a;
		return $folkertdev$elm_flate$Deflate$Symbol$Literal(v);
	} else {
		var length = code.a;
		var backwardDistance = code.b;
		return A2($folkertdev$elm_flate$Deflate$Symbol$Share, length, backwardDistance);
	}
};
var $folkertdev$elm_flate$LZ77$Literal = function (a) {
	return {$: 0, a: a};
};
var $folkertdev$elm_flate$LZ77$Pointer = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $folkertdev$elm_flate$PrefixTable$Small = function (a) {
	return {$: 0, a: a};
};
var $folkertdev$elm_flate$PrefixTable$Large = function (a) {
	return {$: 1, a: a};
};
var $folkertdev$elm_flate$PrefixTable$LargePrefixTable = $elm$core$Basics$identity;
var $folkertdev$elm_flate$PrefixTable$insertInList = F6(
	function (i, array, p2, position, remaining, accum) {
		insertInList:
		while (true) {
			if (!remaining.b) {
				var newPositions = A2(
					$elm$core$List$cons,
					_Utils_Tuple2(p2, position),
					accum);
				return _Utils_Tuple2(
					$folkertdev$elm_flate$PrefixTable$Large(
						A3($elm$core$Array$set, i, newPositions, array)),
					$elm$core$Maybe$Nothing);
			} else {
				var current = remaining.a;
				var key = current.a;
				var oldValue = current.b;
				var rest = remaining.b;
				if (!(key - p2)) {
					var newPositions = _Utils_ap(
						accum,
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(key, position),
							rest));
					return _Utils_Tuple2(
						$folkertdev$elm_flate$PrefixTable$Large(
							A3($elm$core$Array$set, i, newPositions, array)),
						$elm$core$Maybe$Just(oldValue));
				} else {
					var $temp$i = i,
						$temp$array = array,
						$temp$p2 = p2,
						$temp$position = position,
						$temp$remaining = rest,
						$temp$accum = A2($elm$core$List$cons, current, accum);
					i = $temp$i;
					array = $temp$array;
					p2 = $temp$p2;
					position = $temp$position;
					remaining = $temp$remaining;
					accum = $temp$accum;
					continue insertInList;
				}
			}
		}
	});
var $folkertdev$elm_flate$PrefixTable$insert = F3(
	function (_v0, position, ptable) {
		var prefix_ = _v0;
		var prefix = 16777215 & (prefix_ >>> 0);
		if (!ptable.$) {
			var dict = ptable.a;
			var _v2 = A2($elm$core$Dict$get, prefix, dict);
			if (_v2.$ === 1) {
				return _Utils_Tuple2(
					$folkertdev$elm_flate$PrefixTable$Small(
						A3($elm$core$Dict$insert, prefix, position, dict)),
					$elm$core$Maybe$Nothing);
			} else {
				var oldValue = _v2.a;
				return _Utils_Tuple2(
					$folkertdev$elm_flate$PrefixTable$Small(
						A3($elm$core$Dict$insert, prefix, position, dict)),
					$elm$core$Maybe$Just(oldValue));
			}
		} else {
			var array = ptable.a;
			var index = prefix >> 8;
			var _v3 = A2($elm$core$Array$get, index, array);
			if (_v3.$ === 1) {
				return _Utils_Tuple2(ptable, $elm$core$Maybe$Nothing);
			} else {
				var positions = _v3.a;
				return A6($folkertdev$elm_flate$PrefixTable$insertInList, index, array, 255 & prefix, position, positions, _List_Nil);
			}
		}
	});
var $folkertdev$elm_flate$Experimental$ByteArray$length = function (_v0) {
	var array = _v0.a;
	var finalSize = _v0.b;
	var finalBytes = _v0.c;
	var _v1 = $elm$core$Array$length(array) * 4;
	if (!_v1) {
		return finalSize;
	} else {
		var l = _v1;
		return l + finalSize;
	}
};
var $folkertdev$elm_flate$Experimental$ByteArray$get = F2(
	function (index, _v0) {
		var array = _v0.a;
		var finalSize = _v0.b;
		var finalBytes = _v0.c;
		var offset = index % 4;
		if (_Utils_cmp(
			index,
			($elm$core$Array$length(array) * 4) + finalSize) > -1) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (_Utils_cmp(
				index,
				$elm$core$Array$length(array) * 4) > -1) {
				return $elm$core$Maybe$Just(255 & (finalBytes >>> (8 * (3 - offset))));
			} else {
				var internalIndex = (index / 4) | 0;
				var _v1 = A2($elm$core$Array$get, internalIndex, array);
				if (_v1.$ === 1) {
					return $elm$core$Maybe$Nothing;
				} else {
					var int32 = _v1.a;
					return $elm$core$Maybe$Just(255 & (int32 >>> (8 * (3 - offset))));
				}
			}
		}
	});
var $folkertdev$elm_flate$LZ77$longestCommonPrefixLoop = F5(
	function (i, j, limit, accum, array) {
		longestCommonPrefixLoop:
		while (true) {
			if (_Utils_cmp(i, limit) < 0) {
				var _v0 = A2($folkertdev$elm_flate$Experimental$ByteArray$get, i, array);
				if (_v0.$ === 1) {
					return accum;
				} else {
					var value1 = _v0.a;
					var _v1 = A2($folkertdev$elm_flate$Experimental$ByteArray$get, j, array);
					if (_v1.$ === 1) {
						return accum;
					} else {
						var value2 = _v1.a;
						if (!(value1 - value2)) {
							var $temp$i = i + 1,
								$temp$j = j + 1,
								$temp$limit = limit,
								$temp$accum = accum + 1,
								$temp$array = array;
							i = $temp$i;
							j = $temp$j;
							limit = $temp$limit;
							accum = $temp$accum;
							array = $temp$array;
							continue longestCommonPrefixLoop;
						} else {
							return accum;
						}
					}
				}
			} else {
				return accum;
			}
		}
	});
var $folkertdev$elm_flate$LZ77$max_length = 258;
var $folkertdev$elm_flate$LZ77$longestCommonPrefix = F3(
	function (i, j, array) {
		var remaining = A2(
			$elm$core$Basics$min,
			$folkertdev$elm_flate$LZ77$max_length - 3,
			$folkertdev$elm_flate$Experimental$ByteArray$length(array) - j);
		return A5($folkertdev$elm_flate$LZ77$longestCommonPrefixLoop, i, j, i + remaining, 0, array);
	});
var $folkertdev$elm_flate$PrefixTable$OutOfBounds = {$: 3};
var $folkertdev$elm_flate$PrefixTable$Prefix = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $folkertdev$elm_flate$PrefixTable$PrefixCode = $elm$core$Basics$identity;
var $folkertdev$elm_flate$PrefixTable$Trailing1 = function (a) {
	return {$: 1, a: a};
};
var $folkertdev$elm_flate$PrefixTable$Trailing2 = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $folkertdev$elm_flate$Experimental$ByteArray$getInt32 = F2(
	function (index, _v0) {
		var array = _v0.a;
		var finalBytes = _v0.c;
		var size = $elm$core$Array$length(array);
		return (!(index - size)) ? $elm$core$Maybe$Just(finalBytes) : A2($elm$core$Array$get, index, array);
	});
var $folkertdev$elm_flate$PrefixTable$prefixAt = F2(
	function (k, input) {
		var size = $folkertdev$elm_flate$Experimental$ByteArray$length(input);
		if (_Utils_cmp(k + 2, size) > -1) {
			if (_Utils_cmp(k, size) > -1) {
				return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
			} else {
				if (_Utils_cmp(k + 1, size) > -1) {
					var _v0 = A2($folkertdev$elm_flate$Experimental$ByteArray$get, k, input);
					if (_v0.$ === 1) {
						return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
					} else {
						var value = _v0.a;
						return $folkertdev$elm_flate$PrefixTable$Trailing1(value);
					}
				} else {
					var _v1 = A2($folkertdev$elm_flate$Experimental$ByteArray$get, k, input);
					if (_v1.$ === 1) {
						return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
					} else {
						var v1 = _v1.a;
						var _v2 = A2($folkertdev$elm_flate$Experimental$ByteArray$get, k + 1, input);
						if (_v2.$ === 1) {
							return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
						} else {
							var v2 = _v2.a;
							return A2($folkertdev$elm_flate$PrefixTable$Trailing2, v1, v2);
						}
					}
				}
			}
		} else {
			var offset = k % 4;
			var internalIndex = (k / 4) | 0;
			switch (offset) {
				case 0:
					var _v4 = A2($folkertdev$elm_flate$Experimental$ByteArray$getInt32, internalIndex, input);
					if (_v4.$ === 1) {
						return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
					} else {
						var int32 = _v4.a;
						var first = 255 & ((int32 >> 24) >>> 0);
						var code = int32 >> 8;
						return A2($folkertdev$elm_flate$PrefixTable$Prefix, first, code);
					}
				case 1:
					var _v5 = A2($folkertdev$elm_flate$Experimental$ByteArray$getInt32, internalIndex, input);
					if (_v5.$ === 1) {
						return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
					} else {
						var int32 = _v5.a;
						var first = 255 & ((255 & (int32 >> 16)) >>> 0);
						var code = 16777215 & int32;
						return A2($folkertdev$elm_flate$PrefixTable$Prefix, first, code);
					}
				case 2:
					var _v6 = A2($folkertdev$elm_flate$Experimental$ByteArray$getInt32, internalIndex, input);
					if (_v6.$ === 1) {
						return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
					} else {
						var int32 = _v6.a;
						var _v7 = A2($folkertdev$elm_flate$Experimental$ByteArray$getInt32, internalIndex + 1, input);
						if (_v7.$ === 1) {
							return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
						} else {
							var nextInt32 = _v7.a;
							var first = 255 & ((255 & (int32 >> 8)) >>> 0);
							var code = 16777215 & (((255 & (nextInt32 >> 24)) | ((65535 & int32) << 8)) >>> 0);
							return A2($folkertdev$elm_flate$PrefixTable$Prefix, first, code);
						}
					}
				default:
					var _v8 = A2($folkertdev$elm_flate$Experimental$ByteArray$getInt32, internalIndex, input);
					if (_v8.$ === 1) {
						return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
					} else {
						var int32 = _v8.a;
						var _v9 = A2($folkertdev$elm_flate$Experimental$ByteArray$getInt32, internalIndex + 1, input);
						if (_v9.$ === 1) {
							return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
						} else {
							var nextInt32 = _v9.a;
							var first = 255 & ((255 & int32) >>> 0);
							var code = (65535 & (nextInt32 >> 16)) | ((255 & int32) << 16);
							return A2($folkertdev$elm_flate$PrefixTable$Prefix, first, code);
						}
					}
			}
		}
	});
var $folkertdev$elm_flate$LZ77$updatePrefixTableLoop = F4(
	function (k, limit, buffer, prefixTable) {
		updatePrefixTableLoop:
		while (true) {
			if (_Utils_cmp(k, limit) < 0) {
				var _v0 = A2($folkertdev$elm_flate$PrefixTable$prefixAt, k, buffer);
				if (!_v0.$) {
					var code = _v0.b;
					var _v1 = A3($folkertdev$elm_flate$PrefixTable$insert, code, k, prefixTable);
					var newPrefixTable = _v1.a;
					var $temp$k = k + 1,
						$temp$limit = limit,
						$temp$buffer = buffer,
						$temp$prefixTable = newPrefixTable;
					k = $temp$k;
					limit = $temp$limit;
					buffer = $temp$buffer;
					prefixTable = $temp$prefixTable;
					continue updatePrefixTableLoop;
				} else {
					return prefixTable;
				}
			} else {
				return prefixTable;
			}
		}
	});
var $folkertdev$elm_flate$LZ77$flushLoop = F5(
	function (i, windowSize, buffer, prefixTable, encoders) {
		flushLoop:
		while (true) {
			var _v0 = A2($folkertdev$elm_flate$PrefixTable$prefixAt, i, buffer);
			switch (_v0.$) {
				case 3:
					return encoders;
				case 1:
					var p1 = _v0.a;
					return A2(
						$elm$core$Array$push,
						$folkertdev$elm_flate$LZ77$Literal(p1),
						encoders);
				case 2:
					var p1 = _v0.a;
					var p2 = _v0.b;
					return A2(
						$elm$core$Array$push,
						$folkertdev$elm_flate$LZ77$Literal(p2),
						A2(
							$elm$core$Array$push,
							$folkertdev$elm_flate$LZ77$Literal(p1),
							encoders));
				default:
					var p1 = _v0.a;
					var key = _v0.b;
					var _v1 = A3($folkertdev$elm_flate$PrefixTable$insert, key, i, prefixTable);
					var newPrefixTable = _v1.a;
					var matched = _v1.b;
					if (!matched.$) {
						var j = matched.a;
						var distance = i - j;
						if ((distance - windowSize) <= 0) {
							var length = 3 + A3($folkertdev$elm_flate$LZ77$longestCommonPrefix, i + 3, j + 3, buffer);
							var newEncoders = A2(
								$elm$core$Array$push,
								A2($folkertdev$elm_flate$LZ77$Pointer, length, distance),
								encoders);
							var newerPrefixTable = A4($folkertdev$elm_flate$LZ77$updatePrefixTableLoop, i + 1, i + length, buffer, newPrefixTable);
							var $temp$i = i + length,
								$temp$windowSize = windowSize,
								$temp$buffer = buffer,
								$temp$prefixTable = newerPrefixTable,
								$temp$encoders = newEncoders;
							i = $temp$i;
							windowSize = $temp$windowSize;
							buffer = $temp$buffer;
							prefixTable = $temp$prefixTable;
							encoders = $temp$encoders;
							continue flushLoop;
						} else {
							var $temp$i = i + 1,
								$temp$windowSize = windowSize,
								$temp$buffer = buffer,
								$temp$prefixTable = newPrefixTable,
								$temp$encoders = A2(
								$elm$core$Array$push,
								$folkertdev$elm_flate$LZ77$Literal(p1),
								encoders);
							i = $temp$i;
							windowSize = $temp$windowSize;
							buffer = $temp$buffer;
							prefixTable = $temp$prefixTable;
							encoders = $temp$encoders;
							continue flushLoop;
						}
					} else {
						var $temp$i = i + 1,
							$temp$windowSize = windowSize,
							$temp$buffer = buffer,
							$temp$prefixTable = newPrefixTable,
							$temp$encoders = A2(
							$elm$core$Array$push,
							$folkertdev$elm_flate$LZ77$Literal(p1),
							encoders);
						i = $temp$i;
						windowSize = $temp$windowSize;
						buffer = $temp$buffer;
						prefixTable = $temp$prefixTable;
						encoders = $temp$encoders;
						continue flushLoop;
					}
			}
		}
	});
var $folkertdev$elm_flate$PrefixTable$max_distance = 32768;
var $folkertdev$elm_flate$PrefixTable$max_window_size = $folkertdev$elm_flate$PrefixTable$max_distance;
var $folkertdev$elm_flate$PrefixTable$newLargePrefixTable = A2($elm$core$Array$repeat, 65535, _List_Nil);
var $folkertdev$elm_flate$PrefixTable$new = function (nbytes) {
	return (_Utils_cmp(nbytes, $folkertdev$elm_flate$PrefixTable$max_window_size) < 0) ? $folkertdev$elm_flate$PrefixTable$Small($elm$core$Dict$empty) : $folkertdev$elm_flate$PrefixTable$Large($folkertdev$elm_flate$PrefixTable$newLargePrefixTable);
};
var $folkertdev$elm_flate$LZ77$flush = F2(
	function (windowSize, buffer) {
		var codes = A5(
			$folkertdev$elm_flate$LZ77$flushLoop,
			0,
			windowSize,
			buffer,
			$folkertdev$elm_flate$PrefixTable$new(
				$folkertdev$elm_flate$Experimental$ByteArray$length(buffer)),
			$elm$core$Array$empty);
		return codes;
	});
var $folkertdev$elm_flate$Experimental$ByteArray$ByteArray = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $folkertdev$elm_flate$Experimental$ByteArray$empty = A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, $elm$core$Array$empty, 0, 0);
var $elm$bytes$Bytes$BE = 1;
var $elm$bytes$Bytes$Decode$andThen = F2(
	function (callback, _v0) {
		var decodeA = _v0;
		return F2(
			function (bites, offset) {
				var _v1 = A2(decodeA, bites, offset);
				var newOffset = _v1.a;
				var a = _v1.b;
				var _v2 = callback(a);
				var decodeB = _v2;
				return A2(decodeB, bites, newOffset);
			});
	});
var $elm$bytes$Bytes$Decode$map2 = F3(
	function (func, _v0, _v1) {
		var decodeA = _v0;
		var decodeB = _v1;
		return F2(
			function (bites, offset) {
				var _v2 = A2(decodeA, bites, offset);
				var aOffset = _v2.a;
				var a = _v2.b;
				var _v3 = A2(decodeB, bites, aOffset);
				var bOffset = _v3.a;
				var b = _v3.b;
				return _Utils_Tuple2(
					bOffset,
					A2(func, a, b));
			});
	});
var $elm$bytes$Bytes$Decode$map5 = F6(
	function (func, _v0, _v1, _v2, _v3, _v4) {
		var decodeA = _v0;
		var decodeB = _v1;
		var decodeC = _v2;
		var decodeD = _v3;
		var decodeE = _v4;
		return F2(
			function (bites, offset) {
				var _v5 = A2(decodeA, bites, offset);
				var aOffset = _v5.a;
				var a = _v5.b;
				var _v6 = A2(decodeB, bites, aOffset);
				var bOffset = _v6.a;
				var b = _v6.b;
				var _v7 = A2(decodeC, bites, bOffset);
				var cOffset = _v7.a;
				var c = _v7.b;
				var _v8 = A2(decodeD, bites, cOffset);
				var dOffset = _v8.a;
				var d = _v8.b;
				var _v9 = A2(decodeE, bites, dOffset);
				var eOffset = _v9.a;
				var e = _v9.b;
				return _Utils_Tuple2(
					eOffset,
					A5(func, a, b, c, d, e));
			});
	});
var $elm$bytes$Bytes$Decode$unsignedInt16 = function (endianness) {
	return _Bytes_read_u16(!endianness);
};
var $elm$bytes$Bytes$Decode$unsignedInt32 = function (endianness) {
	return _Bytes_read_u32(!endianness);
};
var $elm$bytes$Bytes$Decode$unsignedInt8 = _Bytes_read_u8;
var $folkertdev$elm_flate$Experimental$ByteArray$fromBytesHelp = function (_v0) {
	var remaining = _v0.a;
	var array = _v0.b;
	if (remaining >= 40) {
		return A2(
			$elm$bytes$Bytes$Decode$andThen,
			$elm$core$Basics$identity,
			A6(
				$elm$bytes$Bytes$Decode$map5,
				F5(
					function (a, b, c, d, e) {
						return A6(
							$elm$bytes$Bytes$Decode$map5,
							F5(
								function (f, g, h, i, j) {
									return $elm$bytes$Bytes$Decode$Loop(
										_Utils_Tuple2(
											remaining - 40,
											A2(
												$elm$core$Array$append,
												array,
												$elm$core$Array$fromList(
													_List_fromArray(
														[a, b, c, d, e, f, g, h, i, j])))));
								}),
							$elm$bytes$Bytes$Decode$unsignedInt32(1),
							$elm$bytes$Bytes$Decode$unsignedInt32(1),
							$elm$bytes$Bytes$Decode$unsignedInt32(1),
							$elm$bytes$Bytes$Decode$unsignedInt32(1),
							$elm$bytes$Bytes$Decode$unsignedInt32(1));
					}),
				$elm$bytes$Bytes$Decode$unsignedInt32(1),
				$elm$bytes$Bytes$Decode$unsignedInt32(1),
				$elm$bytes$Bytes$Decode$unsignedInt32(1),
				$elm$bytes$Bytes$Decode$unsignedInt32(1),
				$elm$bytes$Bytes$Decode$unsignedInt32(1)));
	} else {
		if (remaining >= 20) {
			return A6(
				$elm$bytes$Bytes$Decode$map5,
				F5(
					function (a, b, c, d, e) {
						return $elm$bytes$Bytes$Decode$Loop(
							_Utils_Tuple2(
								remaining - 20,
								A2(
									$elm$core$Array$push,
									e,
									A2(
										$elm$core$Array$push,
										d,
										A2(
											$elm$core$Array$push,
											c,
											A2(
												$elm$core$Array$push,
												b,
												A2($elm$core$Array$push, a, array)))))));
					}),
				$elm$bytes$Bytes$Decode$unsignedInt32(1),
				$elm$bytes$Bytes$Decode$unsignedInt32(1),
				$elm$bytes$Bytes$Decode$unsignedInt32(1),
				$elm$bytes$Bytes$Decode$unsignedInt32(1),
				$elm$bytes$Bytes$Decode$unsignedInt32(1));
		} else {
			if (remaining >= 4) {
				return A2(
					$elm$bytes$Bytes$Decode$map,
					function (a) {
						return $elm$bytes$Bytes$Decode$Loop(
							_Utils_Tuple2(
								remaining - 4,
								A2($elm$core$Array$push, a, array)));
					},
					$elm$bytes$Bytes$Decode$unsignedInt32(1));
			} else {
				switch (remaining) {
					case 0:
						return $elm$bytes$Bytes$Decode$succeed(
							$elm$bytes$Bytes$Decode$Done(
								_Utils_Tuple3(0, 0, array)));
					case 1:
						return A2(
							$elm$bytes$Bytes$Decode$map,
							function (_byte) {
								return $elm$bytes$Bytes$Decode$Done(
									_Utils_Tuple3(1, _byte << 24, array));
							},
							$elm$bytes$Bytes$Decode$unsignedInt8);
					case 2:
						return A2(
							$elm$bytes$Bytes$Decode$map,
							function (_byte) {
								return $elm$bytes$Bytes$Decode$Done(
									_Utils_Tuple3(2, _byte << 16, array));
							},
							$elm$bytes$Bytes$Decode$unsignedInt16(1));
					default:
						return A3(
							$elm$bytes$Bytes$Decode$map2,
							F2(
								function (bytes, _byte) {
									return $elm$bytes$Bytes$Decode$Done(
										_Utils_Tuple3(3, (bytes << 16) | (_byte << 8), array));
								}),
							$elm$bytes$Bytes$Decode$unsignedInt16(1),
							$elm$bytes$Bytes$Decode$unsignedInt8);
				}
			}
		}
	}
};
var $folkertdev$elm_flate$Experimental$ByteArray$fromBytes = function (buffer) {
	var _v0 = A2(
		$elm$bytes$Bytes$Decode$decode,
		A2(
			$elm$bytes$Bytes$Decode$loop,
			_Utils_Tuple2(
				$elm$bytes$Bytes$width(buffer),
				$elm$core$Array$empty),
			$folkertdev$elm_flate$Experimental$ByteArray$fromBytesHelp),
		buffer);
	if (_v0.$ === 1) {
		return $folkertdev$elm_flate$Experimental$ByteArray$empty;
	} else {
		var _v1 = _v0.a;
		var finalSize = _v1.a;
		var finalBytes = _v1.b;
		var array = _v1.c;
		return A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, array, finalSize, finalBytes);
	}
};
var $folkertdev$elm_flate$LZ77$encodeWithOptions = F2(
	function (_v0, buffer) {
		var windowSize = _v0.ff;
		return A2(
			$folkertdev$elm_flate$LZ77$flush,
			windowSize,
			$folkertdev$elm_flate$Experimental$ByteArray$fromBytes(buffer));
	});
var $folkertdev$elm_flate$ByteArray$decodeByteArrayHelp = function (_v0) {
	var remaining = _v0.a;
	var accum = _v0.b;
	return (remaining >= 4) ? A2(
		$elm$bytes$Bytes$Decode$map,
		function (_new) {
			var byte4 = 255 & (_new >>> 0);
			var byte3 = 255 & ((_new >> 8) >>> 0);
			var byte2 = 255 & ((_new >> 16) >>> 0);
			var byte1 = 255 & ((_new >> 24) >>> 0);
			var newAccum = A2(
				$elm$core$Array$push,
				byte4,
				A2(
					$elm$core$Array$push,
					byte3,
					A2(
						$elm$core$Array$push,
						byte2,
						A2($elm$core$Array$push, byte1, accum))));
			return $elm$bytes$Bytes$Decode$Loop(
				_Utils_Tuple2(remaining - 4, newAccum));
		},
		$elm$bytes$Bytes$Decode$unsignedInt32(1)) : ((remaining > 0) ? A2(
		$elm$bytes$Bytes$Decode$map,
		function (_new) {
			return $elm$bytes$Bytes$Decode$Loop(
				_Utils_Tuple2(
					remaining - 1,
					A2($elm$core$Array$push, _new, accum)));
		},
		$elm$bytes$Bytes$Decode$unsignedInt8) : $elm$bytes$Bytes$Decode$succeed(
		$elm$bytes$Bytes$Decode$Done(accum)));
};
var $folkertdev$elm_flate$ByteArray$decoder = function (n) {
	return A2(
		$elm$bytes$Bytes$Decode$loop,
		_Utils_Tuple2(n, $elm$core$Array$empty),
		$folkertdev$elm_flate$ByteArray$decodeByteArrayHelp);
};
var $folkertdev$elm_flate$ByteArray$fromBytes = function (buffer) {
	var _v0 = A2(
		$elm$bytes$Bytes$Decode$decode,
		$folkertdev$elm_flate$ByteArray$decoder(
			$elm$bytes$Bytes$width(buffer)),
		buffer);
	if (_v0.$ === 1) {
		return $elm$core$Array$empty;
	} else {
		var value = _v0.a;
		return value;
	}
};
var $folkertdev$elm_flate$Deflate$Internal$compress = F2(
	function (maybeWindowSize, buf) {
		if (maybeWindowSize.$ === 1) {
			return A2(
				$elm$core$Array$push,
				$folkertdev$elm_flate$Deflate$Symbol$EndOfBlock,
				A2(
					$elm$core$Array$map,
					$folkertdev$elm_flate$Deflate$Symbol$Literal,
					$folkertdev$elm_flate$ByteArray$fromBytes(buf)));
		} else {
			var windowSize = maybeWindowSize.a;
			return A2(
				$elm$core$Array$push,
				$folkertdev$elm_flate$Deflate$Symbol$EndOfBlock,
				A2(
					$elm$core$Array$map,
					$folkertdev$elm_flate$Deflate$Internal$codeToSymbol,
					A2(
						$folkertdev$elm_flate$LZ77$encodeWithOptions,
						{ff: windowSize},
						buf)));
		}
	});
var $elm$bytes$Bytes$Encode$U16 = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$unsignedInt16 = $elm$bytes$Bytes$Encode$U16;
var $folkertdev$elm_flate$Deflate$BitWriter$flushIfNeeded = F3(
	function (tag, bitsWritten, encoders) {
		return (bitsWritten >= 16) ? {
			L: bitsWritten - 16,
			M: A2(
				$elm$core$List$cons,
				A2($elm$bytes$Bytes$Encode$unsignedInt16, 0, tag),
				encoders),
			X: tag >> 16
		} : {L: bitsWritten, M: encoders, X: tag};
	});
var $folkertdev$elm_flate$Deflate$BitWriter$writeBits = F3(
	function (bitwidth, bits, state) {
		return A3($folkertdev$elm_flate$Deflate$BitWriter$flushIfNeeded, state.X | (bits << state.L), state.L + bitwidth, state.M);
	});
var $folkertdev$elm_flate$Huffman$encode = F2(
	function (symbol, _v0) {
		var table = _v0;
		var _v1 = A2($elm$core$Array$get, symbol, table);
		if (_v1.$ === 1) {
			return A2($folkertdev$elm_flate$Deflate$BitWriter$writeBits, 0, 0);
		} else {
			var width = _v1.a.c9;
			var bits = _v1.a.a;
			return A2($folkertdev$elm_flate$Deflate$BitWriter$writeBits, width, bits);
		}
	});
var $folkertdev$elm_flate$Deflate$Symbol$extraLength = function (symbol) {
	if (symbol.$ === 2) {
		var length = symbol.a;
		return (((length >= 3) && (length <= 10)) || (length === 258)) ? $elm$core$Maybe$Nothing : (((length >= 11) && (length <= 18)) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(
				1,
				A2($elm$core$Basics$modBy, 2, length - 11))) : (((length >= 19) && (length <= 34)) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(
				2,
				A2($elm$core$Basics$modBy, 4, length - 19))) : (((length >= 35) && (length <= 66)) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(
				3,
				A2($elm$core$Basics$modBy, 8, length - 35))) : (((length >= 67) && (length <= 130)) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(
				4,
				A2($elm$core$Basics$modBy, 16, length - 67))) : (((length >= 131) && (length <= 257)) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(
				5,
				A2($elm$core$Basics$modBy, 32, length - 131))) : $elm$core$Maybe$Nothing)))));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $folkertdev$elm_flate$Deflate$Symbol$encode = F3(
	function (symbol, htrees, bitWriter) {
		var maybeExtra = function () {
			var _v2 = $folkertdev$elm_flate$Deflate$Symbol$extraLength(symbol);
			if (_v2.$ === 1) {
				return $elm$core$Basics$identity;
			} else {
				var _v3 = _v2.a;
				var bits = _v3.a;
				var extra = _v3.b;
				return A2($folkertdev$elm_flate$Deflate$BitWriter$writeBits, bits, extra);
			}
		}();
		var maybeDistance = function () {
			var _v0 = $folkertdev$elm_flate$Deflate$Symbol$distance(symbol);
			if (_v0.$ === 1) {
				return $elm$core$Basics$identity;
			} else {
				var _v1 = _v0.a;
				var code_ = _v1.a;
				var bits = _v1.b;
				var extra = _v1.c;
				return A2(
					$elm$core$Basics$composeR,
					A2($folkertdev$elm_flate$Huffman$encode, code_, htrees.aj),
					(bits > 0) ? A2($folkertdev$elm_flate$Deflate$BitWriter$writeBits, bits, extra) : $elm$core$Basics$identity);
			}
		}();
		return maybeDistance(
			maybeExtra(
				A3(
					$folkertdev$elm_flate$Huffman$encode,
					$folkertdev$elm_flate$Deflate$Symbol$code(symbol),
					htrees.am,
					bitWriter)));
	});
var $folkertdev$elm_flate$Deflate$Symbol$bitwidth_code_order = _List_fromArray(
	[16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var $folkertdev$elm_flate$Deflate$Symbol$calculateCodes = function (runLengths) {
	var loop2 = F3(
		function (r, c, codes) {
			loop2:
			while (true) {
				if (c >= 3) {
					var n = A2($elm$core$Basics$min, 6, c);
					var $temp$r = r,
						$temp$c = c - n,
						$temp$codes = A2(
						$elm$core$Array$push,
						_Utils_Tuple3(16, 2, n - 3),
						codes);
					r = $temp$r;
					c = $temp$c;
					codes = $temp$codes;
					continue loop2;
				} else {
					return A2(
						$elm$core$Array$append,
						codes,
						A2(
							$elm$core$Array$repeat,
							c,
							_Utils_Tuple3(r.Y, 0, 0)));
				}
			}
		});
	var loop1 = F2(
		function (c, codes) {
			loop1:
			while (true) {
				if (c >= 11) {
					var n = A2($elm$core$Basics$min, 138, c);
					var $temp$c = c - n,
						$temp$codes = A2(
						$elm$core$Array$push,
						_Utils_Tuple3(18, 7, n - 11),
						codes);
					c = $temp$c;
					codes = $temp$codes;
					continue loop1;
				} else {
					if (c >= 3) {
						return A2(
							$elm$core$Array$push,
							_Utils_Tuple3(17, 3, c - 3),
							codes);
					} else {
						return A2(
							$elm$core$Array$append,
							codes,
							A2(
								$elm$core$Array$repeat,
								c,
								_Utils_Tuple3(0, 0, 0)));
					}
				}
			}
		});
	var folder = F2(
		function (r, codes) {
			return (!r.Y) ? A2(loop1, r.ah, codes) : A3(
				loop2,
				r,
				r.ah - 1,
				A2(
					$elm$core$Array$push,
					_Utils_Tuple3(r.Y, 0, 0),
					codes));
		});
	return A3($elm$core$Array$foldl, folder, $elm$core$Array$empty, runLengths);
};
var $folkertdev$elm_flate$Huffman$getWidth = function (_v0) {
	var width = _v0.c9;
	return width;
};
var $folkertdev$elm_flate$Huffman$lookup = F2(
	function (symbol, _v0) {
		var array = _v0;
		return A2($elm$core$Array$get, symbol, array);
	});
var $folkertdev$elm_flate$Deflate$Symbol$calculateRunLengths = F2(
	function (lengths, accum) {
		calculateRunLengths:
		while (true) {
			if (!lengths.b) {
				return A3($elm$core$List$foldr, $elm$core$Array$push, $elm$core$Array$empty, accum);
			} else {
				var _v1 = lengths.a;
				var e = _v1.a;
				var size = _v1.b;
				var rest = lengths.b;
				var list = A2(
					$elm$core$List$indexedMap,
					$elm$core$Tuple$pair,
					A2(
						$elm$core$List$map,
						function (x) {
							return A2(
								$elm$core$Maybe$withDefault,
								0,
								A2(
									$elm$core$Maybe$map,
									$folkertdev$elm_flate$Huffman$getWidth,
									A2($folkertdev$elm_flate$Huffman$lookup, x, e)));
						},
						A2($elm$core$List$range, 0, size - 1)));
				var folder = F2(
					function (_v3, runLengths) {
						var i = _v3.a;
						var c = _v3.b;
						if (!runLengths.b) {
							return A2(
								$elm$core$List$cons,
								{ah: 1, Y: c},
								runLengths);
						} else {
							var last = runLengths.a;
							var remaining = runLengths.b;
							return _Utils_eq(last.Y, c) ? A2(
								$elm$core$List$cons,
								{ah: last.ah + 1, Y: last.Y},
								remaining) : A2(
								$elm$core$List$cons,
								{ah: 1, Y: c},
								runLengths);
						}
					});
				var $temp$lengths = rest,
					$temp$accum = A3($elm$core$List$foldl, folder, accum, list);
				lengths = $temp$lengths;
				accum = $temp$accum;
				continue calculateRunLengths;
			}
		}
	});
var $folkertdev$elm_flate$Deflate$Symbol$buildBitWidthCodes = F3(
	function (literalCodeCount, distanceCodeCount, trees) {
		var runLengths = A2(
			$folkertdev$elm_flate$Deflate$Symbol$calculateRunLengths,
			_List_fromArray(
				[
					_Utils_Tuple2(trees.am, literalCodeCount),
					_Utils_Tuple2(trees.aj, distanceCodeCount)
				]),
			_List_Nil);
		return $folkertdev$elm_flate$Deflate$Symbol$calculateCodes(runLengths);
	});
var $folkertdev$elm_flate$Deflate$Symbol$positionLoop = F3(
	function (predicate, i, elements) {
		positionLoop:
		while (true) {
			if (!elements.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var x = elements.a;
				var xs = elements.b;
				if (predicate(x)) {
					return $elm$core$Maybe$Just(i);
				} else {
					var $temp$predicate = predicate,
						$temp$i = i + 1,
						$temp$elements = xs;
					predicate = $temp$predicate;
					i = $temp$i;
					elements = $temp$elements;
					continue positionLoop;
				}
			}
		}
	});
var $folkertdev$elm_flate$Deflate$Symbol$position = F2(
	function (predicate, elements) {
		return A3($folkertdev$elm_flate$Deflate$Symbol$positionLoop, predicate, 0, elements);
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $folkertdev$elm_flate$Huffman$positionFromTheEnd = F2(
	function (predicated, array) {
		var folder = F2(
			function (element, _v1) {
				var index = _v1.a;
				var accum = _v1.b;
				if (!accum.$) {
					return _Utils_Tuple2(index, accum);
				} else {
					return predicated(element) ? _Utils_Tuple2(
						index,
						$elm$core$Maybe$Just(index)) : _Utils_Tuple2(index - 1, $elm$core$Maybe$Nothing);
				}
			});
		var finalIndex = $elm$core$Array$length(array) - 1;
		return A2(
			$elm$core$Maybe$map,
			function (v) {
				return finalIndex - v;
			},
			A3(
				$elm$core$Array$foldr,
				folder,
				_Utils_Tuple2(finalIndex, $elm$core$Maybe$Nothing),
				array).b);
	});
var $folkertdev$elm_flate$Huffman$usedMaxSymbol = function (_v0) {
	var array = _v0;
	return A2(
		$elm$core$Maybe$map,
		function (trailingZeros) {
			return ($elm$core$Array$length(array) - 1) - trailingZeros;
		},
		A2(
			$folkertdev$elm_flate$Huffman$positionFromTheEnd,
			function (_v1) {
				var value = _v1;
				return value.c9 > 0;
			},
			array));
};
var $folkertdev$elm_flate$Deflate$Symbol$writeDynamicHuffmanCodec = F2(
	function (trees, bitWriter) {
		var literal_code_count = A2(
			$elm$core$Basics$max,
			257,
			A2(
				$elm$core$Maybe$withDefault,
				0,
				$folkertdev$elm_flate$Huffman$usedMaxSymbol(trees.am)) + 1);
		var distance_code_count = A2(
			$elm$core$Basics$max,
			1,
			A2(
				$elm$core$Maybe$withDefault,
				0,
				$folkertdev$elm_flate$Huffman$usedMaxSymbol(trees.aj)) + 1);
		var codes = A3(
			$folkertdev$elm_flate$Deflate$Symbol$buildBitWidthCodes,
			literal_code_count,
			distance_code_count,
			{aj: trees.aj, am: trees.am});
		var codeCounts = A3(
			$elm$core$Array$foldl,
			function (_v2) {
				var i = _v2.a;
				return A2(
					$folkertdev$elm_flate$Deflate$Symbol$update,
					i,
					function (v) {
						return v + 1;
					});
			},
			A2($elm$core$Array$repeat, 19, 0),
			codes);
		var bitWidthEncoder = A2($folkertdev$elm_flate$Huffman$fromFrequencies, codeCounts, 7);
		var bitwidthCodeCount = A2(
			$elm$core$Basics$max,
			4,
			A2(
				$elm$core$Maybe$withDefault,
				0,
				A2(
					$elm$core$Maybe$map,
					function (trailingZeros) {
						return 19 - trailingZeros;
					},
					A2(
						$folkertdev$elm_flate$Deflate$Symbol$position,
						function (i) {
							var _v1 = A2($folkertdev$elm_flate$Huffman$lookup, i, bitWidthEncoder);
							if (_v1.$ === 1) {
								return false;
							} else {
								var value = _v1.a;
								return $folkertdev$elm_flate$Huffman$getWidth(value) > 0;
							}
						},
						$elm$core$List$reverse($folkertdev$elm_flate$Deflate$Symbol$bitwidth_code_order)))));
		var v1 = function (writer) {
			return A3(
				$elm$core$List$foldl,
				F2(
					function (i, current) {
						var width = _Utils_eq(
							A2($elm$core$Array$get, i, codeCounts),
							$elm$core$Maybe$Just(0)) ? 0 : A2(
							$elm$core$Maybe$withDefault,
							0,
							A2(
								$elm$core$Maybe$map,
								$folkertdev$elm_flate$Huffman$getWidth,
								A2($folkertdev$elm_flate$Huffman$lookup, i, bitWidthEncoder)));
						return A3($folkertdev$elm_flate$Deflate$BitWriter$writeBits, 3, width, current);
					}),
				writer,
				A2($elm$core$List$take, bitwidthCodeCount, $folkertdev$elm_flate$Deflate$Symbol$bitwidth_code_order));
		};
		var v2 = function (writer) {
			return A3(
				$elm$core$Array$foldl,
				F2(
					function (_v0, current) {
						var code_ = _v0.a;
						var bits = _v0.b;
						var extra = _v0.c;
						return (bits > 0) ? A3(
							$folkertdev$elm_flate$Deflate$BitWriter$writeBits,
							bits,
							extra,
							A3($folkertdev$elm_flate$Huffman$encode, code_, bitWidthEncoder, current)) : A3($folkertdev$elm_flate$Huffman$encode, code_, bitWidthEncoder, current);
					}),
				writer,
				codes);
		};
		return v2(
			v1(
				A3(
					$folkertdev$elm_flate$Deflate$BitWriter$writeBits,
					4,
					bitwidthCodeCount - 4,
					A3(
						$folkertdev$elm_flate$Deflate$BitWriter$writeBits,
						5,
						distance_code_count - 1,
						A3($folkertdev$elm_flate$Deflate$BitWriter$writeBits, 5, literal_code_count - 257, bitWriter)))));
	});
var $folkertdev$elm_flate$Deflate$Internal$encodeCompressDynamic = F3(
	function (maybeWindowSize, buf, bitWriter) {
		var compressed = A2($folkertdev$elm_flate$Deflate$Internal$compress, maybeWindowSize, buf);
		var huffmanTree = $folkertdev$elm_flate$Deflate$Symbol$buildDynamicHuffmanCodec(compressed);
		var huffmanTreeWriter = A2($folkertdev$elm_flate$Deflate$Symbol$writeDynamicHuffmanCodec, huffmanTree, bitWriter);
		return A3(
			$elm$core$Array$foldl,
			F2(
				function (symbol, first) {
					return A3($folkertdev$elm_flate$Deflate$Symbol$encode, symbol, huffmanTree, first);
				}),
			huffmanTreeWriter,
			compressed);
	});
var $elm$bytes$Bytes$Encode$U8 = function (a) {
	return {$: 3, a: a};
};
var $elm$bytes$Bytes$Encode$unsignedInt8 = $elm$bytes$Bytes$Encode$U8;
var $folkertdev$elm_flate$Deflate$BitWriter$flushLoop = F3(
	function (tag, bitsWritten, encoders) {
		flushLoop:
		while (true) {
			if (bitsWritten > 0) {
				var $temp$tag = tag >> 8,
					$temp$bitsWritten = A2($elm$core$Basics$max, 0, bitsWritten - 8),
					$temp$encoders = A2(
					$elm$core$List$cons,
					$elm$bytes$Bytes$Encode$unsignedInt8(tag),
					encoders);
				tag = $temp$tag;
				bitsWritten = $temp$bitsWritten;
				encoders = $temp$encoders;
				continue flushLoop;
			} else {
				return {L: bitsWritten, M: encoders, X: tag};
			}
		}
	});
var $folkertdev$elm_flate$Deflate$BitWriter$flush = function (state) {
	return A3($folkertdev$elm_flate$Deflate$BitWriter$flushLoop, state.X, state.L, state.M);
};
var $folkertdev$elm_flate$Deflate$BitWriter$writeBit = function (b) {
	if (!b) {
		return A2($folkertdev$elm_flate$Deflate$BitWriter$writeBits, 1, 0);
	} else {
		return A2($folkertdev$elm_flate$Deflate$BitWriter$writeBits, 1, 1);
	}
};
var $folkertdev$elm_flate$Deflate$Internal$encodeDynamicBlock = F3(
	function (windowSize, _v0, bitWriter) {
		var isLastBlock = _v0.a;
		var buffer = _v0.b;
		return $folkertdev$elm_flate$Deflate$BitWriter$flush(
			A3(
				$folkertdev$elm_flate$Deflate$Internal$encodeCompressDynamic,
				windowSize,
				buffer,
				A3(
					$folkertdev$elm_flate$Deflate$BitWriter$writeBits,
					2,
					2,
					A2($folkertdev$elm_flate$Deflate$BitWriter$writeBit, isLastBlock, bitWriter))));
	});
var $folkertdev$elm_flate$Deflate$BitWriter$run = function (state) {
	return $elm$core$List$reverse(state.M);
};
var $folkertdev$elm_flate$Deflate$Internal$encodeDynamic = F2(
	function (windowSize, buffer) {
		var encodedChunks = A2(
			$elm$core$List$map,
			$folkertdev$elm_flate$Deflate$Internal$encodeDynamicBlock(windowSize),
			A2($folkertdev$elm_flate$Deflate$Internal$chunks, $folkertdev$elm_flate$Deflate$Internal$default_block_size, buffer));
		return $elm$bytes$Bytes$Encode$encode(
			$elm$bytes$Bytes$Encode$sequence(
				$folkertdev$elm_flate$Deflate$BitWriter$run(
					A3(
						$elm$core$List$foldl,
						F2(
							function (chunk, first) {
								return chunk(first);
							}),
						$folkertdev$elm_flate$Deflate$BitWriter$empty,
						encodedChunks))));
	});
var $elm$bytes$Bytes$Encode$Bytes = function (a) {
	return {$: 10, a: a};
};
var $elm$bytes$Bytes$Encode$bytes = $elm$bytes$Bytes$Encode$Bytes;
var $elm$core$Bitwise$complement = _Bitwise_complement;
var $folkertdev$elm_flate$Deflate$Internal$max_non_compressed_block_size = 65535;
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$Array$sliceLeft = F2(
	function (from, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		if (!from) {
			return array;
		} else {
			if (_Utils_cmp(
				from,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					len - from,
					$elm$core$Array$shiftStep,
					$elm$core$Elm$JsArray$empty,
					A3(
						$elm$core$Elm$JsArray$slice,
						from - $elm$core$Array$tailIndex(len),
						$elm$core$Elm$JsArray$length(tail),
						tail));
			} else {
				var skipNodes = (from / $elm$core$Array$branchFactor) | 0;
				var helper = F2(
					function (node, acc) {
						if (!node.$) {
							var subTree = node.a;
							return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
						} else {
							var leaf = node.a;
							return A2($elm$core$List$cons, leaf, acc);
						}
					});
				var leafNodes = A3(
					$elm$core$Elm$JsArray$foldr,
					helper,
					_List_fromArray(
						[tail]),
					tree);
				var nodesToInsert = A2($elm$core$List$drop, skipNodes, leafNodes);
				if (!nodesToInsert.b) {
					return $elm$core$Array$empty;
				} else {
					var head = nodesToInsert.a;
					var rest = nodesToInsert.b;
					var firstSlice = from - (skipNodes * $elm$core$Array$branchFactor);
					var initialBuilder = {
						o: _List_Nil,
						j: 0,
						n: A3(
							$elm$core$Elm$JsArray$slice,
							firstSlice,
							$elm$core$Elm$JsArray$length(head),
							head)
					};
					return A2(
						$elm$core$Array$builderToArray,
						true,
						A3($elm$core$List$foldl, $elm$core$Array$appendHelpBuilder, initialBuilder, rest));
				}
			}
		}
	});
var $elm$core$Array$fetchNewTail = F4(
	function (shift, end, treeEnd, tree) {
		fetchNewTail:
		while (true) {
			var pos = $elm$core$Array$bitMask & (treeEnd >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var sub = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$end = end,
					$temp$treeEnd = treeEnd,
					$temp$tree = sub;
				shift = $temp$shift;
				end = $temp$end;
				treeEnd = $temp$treeEnd;
				tree = $temp$tree;
				continue fetchNewTail;
			} else {
				var values = _v0.a;
				return A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, values);
			}
		}
	});
var $elm$core$Array$hoistTree = F3(
	function (oldShift, newShift, tree) {
		hoistTree:
		while (true) {
			if ((_Utils_cmp(oldShift, newShift) < 1) || (!$elm$core$Elm$JsArray$length(tree))) {
				return tree;
			} else {
				var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, 0, tree);
				if (!_v0.$) {
					var sub = _v0.a;
					var $temp$oldShift = oldShift - $elm$core$Array$shiftStep,
						$temp$newShift = newShift,
						$temp$tree = sub;
					oldShift = $temp$oldShift;
					newShift = $temp$newShift;
					tree = $temp$tree;
					continue hoistTree;
				} else {
					return tree;
				}
			}
		}
	});
var $elm$core$Array$sliceTree = F3(
	function (shift, endIdx, tree) {
		var lastPos = $elm$core$Array$bitMask & (endIdx >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, lastPos, tree);
		if (!_v0.$) {
			var sub = _v0.a;
			var newSub = A3($elm$core$Array$sliceTree, shift - $elm$core$Array$shiftStep, endIdx, sub);
			return (!$elm$core$Elm$JsArray$length(newSub)) ? A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree) : A3(
				$elm$core$Elm$JsArray$unsafeSet,
				lastPos,
				$elm$core$Array$SubTree(newSub),
				A3($elm$core$Elm$JsArray$slice, 0, lastPos + 1, tree));
		} else {
			return A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree);
		}
	});
var $elm$core$Array$sliceRight = F2(
	function (end, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		if (_Utils_eq(end, len)) {
			return array;
		} else {
			if (_Utils_cmp(
				end,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					startShift,
					tree,
					A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, tail));
			} else {
				var endIdx = $elm$core$Array$tailIndex(end);
				var depth = $elm$core$Basics$floor(
					A2(
						$elm$core$Basics$logBase,
						$elm$core$Array$branchFactor,
						A2($elm$core$Basics$max, 1, endIdx - 1)));
				var newShift = A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep);
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					newShift,
					A3(
						$elm$core$Array$hoistTree,
						startShift,
						newShift,
						A3($elm$core$Array$sliceTree, startShift, endIdx, tree)),
					A4($elm$core$Array$fetchNewTail, startShift, end, endIdx, tree));
			}
		}
	});
var $elm$core$Array$translateIndex = F2(
	function (index, _v0) {
		var len = _v0.a;
		var posIndex = (index < 0) ? (len + index) : index;
		return (posIndex < 0) ? 0 : ((_Utils_cmp(posIndex, len) > 0) ? len : posIndex);
	});
var $elm$core$Array$slice = F3(
	function (from, to, array) {
		var correctTo = A2($elm$core$Array$translateIndex, to, array);
		var correctFrom = A2($elm$core$Array$translateIndex, from, array);
		return (_Utils_cmp(correctFrom, correctTo) > 0) ? $elm$core$Array$empty : A2(
			$elm$core$Array$sliceLeft,
			correctFrom,
			A2($elm$core$Array$sliceRight, correctTo, array));
	});
var $elm$bytes$Bytes$Encode$U32 = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$unsignedInt32 = $elm$bytes$Bytes$Encode$U32;
var $folkertdev$elm_flate$ByteArray$fasterEncodeFolderR = F2(
	function (_byte, _v0) {
		var bytesOnAccum = _v0.a;
		var accum = _v0.b;
		var encoders = _v0.c;
		switch (bytesOnAccum) {
			case 0:
				var value = 255 & _byte;
				return _Utils_Tuple3(1, value, encoders);
			case 1:
				var value = accum | ((255 & _byte) << 8);
				return _Utils_Tuple3(2, value, encoders);
			case 2:
				var value = accum | ((255 & _byte) << 16);
				return _Utils_Tuple3(3, value, encoders);
			default:
				var value = accum | ((255 & _byte) << 24);
				return _Utils_Tuple3(
					0,
					0,
					A2(
						$elm$core$List$cons,
						A2($elm$bytes$Bytes$Encode$unsignedInt32, 1, value),
						encoders));
		}
	});
var $folkertdev$elm_flate$ByteArray$fasterEncodeR = function (_v0) {
	var bytesOnAccum = _v0.a;
	var accum = _v0.b;
	var otherEncoders = _v0.c;
	var encoders = function () {
		switch (bytesOnAccum) {
			case 0:
				return otherEncoders;
			case 1:
				return A2(
					$elm$core$List$cons,
					$elm$bytes$Bytes$Encode$unsignedInt8(accum),
					otherEncoders);
			case 2:
				return A2(
					$elm$core$List$cons,
					A2($elm$bytes$Bytes$Encode$unsignedInt16, 1, accum),
					otherEncoders);
			default:
				var otherBytes = accum >> 8;
				var firstByte = 255 & accum;
				return A2(
					$elm$core$List$cons,
					A2($elm$bytes$Bytes$Encode$unsignedInt16, 1, otherBytes),
					A2(
						$elm$core$List$cons,
						$elm$bytes$Bytes$Encode$unsignedInt8(firstByte),
						otherEncoders));
		}
	}();
	return encoders;
};
var $folkertdev$elm_flate$ByteArray$toBytes = function (array) {
	return $elm$bytes$Bytes$Encode$encode(
		$elm$bytes$Bytes$Encode$sequence(
			$folkertdev$elm_flate$ByteArray$fasterEncodeR(
				A3(
					$elm$core$Array$foldr,
					$folkertdev$elm_flate$ByteArray$fasterEncodeFolderR,
					_Utils_Tuple3(0, 0, _List_Nil),
					array))));
};
var $folkertdev$elm_flate$Deflate$BitWriter$writeEncoder = F2(
	function (encoder, state) {
		return {
			L: state.L,
			M: A2($elm$core$List$cons, encoder, state.M),
			X: state.X
		};
	});
var $folkertdev$elm_flate$Deflate$Internal$encodeRawBlock = F2(
	function (_v0, bitWriter) {
		var isLastBlock = _v0.a;
		var buffer = _v0.b;
		var byteArray = $folkertdev$elm_flate$ByteArray$fromBytes(buffer);
		var size = A2(
			$elm$core$Basics$min,
			$elm$core$Array$length(byteArray),
			$folkertdev$elm_flate$Deflate$Internal$max_non_compressed_block_size);
		var sliced = A3($elm$core$Array$slice, 0, size, byteArray);
		return A2(
			$folkertdev$elm_flate$Deflate$BitWriter$writeEncoder,
			$elm$bytes$Bytes$Encode$bytes(
				$folkertdev$elm_flate$ByteArray$toBytes(sliced)),
			A2(
				$folkertdev$elm_flate$Deflate$BitWriter$writeEncoder,
				A2($elm$bytes$Bytes$Encode$unsignedInt16, 0, ~size),
				A2(
					$folkertdev$elm_flate$Deflate$BitWriter$writeEncoder,
					A2($elm$bytes$Bytes$Encode$unsignedInt16, 0, size),
					$folkertdev$elm_flate$Deflate$BitWriter$flush(
						A3(
							$folkertdev$elm_flate$Deflate$BitWriter$writeBits,
							2,
							0,
							A2($folkertdev$elm_flate$Deflate$BitWriter$writeBit, isLastBlock, bitWriter))))));
	});
var $folkertdev$elm_flate$Deflate$Internal$encodeRaw = function (buffer) {
	return $elm$bytes$Bytes$Encode$encode(
		$elm$bytes$Bytes$Encode$sequence(
			$folkertdev$elm_flate$Deflate$BitWriter$run(
				A3(
					$elm$core$List$foldl,
					F2(
						function (chunk, first) {
							return A2($folkertdev$elm_flate$Deflate$Internal$encodeRawBlock, chunk, first);
						}),
					$folkertdev$elm_flate$Deflate$BitWriter$empty,
					A2(
						$folkertdev$elm_flate$Deflate$Internal$chunks,
						A2($elm$core$Basics$min, $folkertdev$elm_flate$Deflate$Internal$max_non_compressed_block_size, $folkertdev$elm_flate$Deflate$Internal$default_block_size),
						buffer)))));
};
var $folkertdev$elm_flate$Huffman$fromList = A2(
	$elm$core$Basics$composeL,
	A2($elm$core$Basics$composeL, $elm$core$Basics$identity, $elm$core$Array$fromList),
	$elm$core$List$map($folkertdev$elm_flate$Huffman$codeFromRecord));
var $folkertdev$elm_flate$Huffman$hardcodedStaticHuffmanTree = {
	aj: $folkertdev$elm_flate$Huffman$fromList(
		_List_fromArray(
			[
				{a: 0, c9: 5},
				{a: 16, c9: 5},
				{a: 8, c9: 5},
				{a: 24, c9: 5},
				{a: 4, c9: 5},
				{a: 20, c9: 5},
				{a: 12, c9: 5},
				{a: 28, c9: 5},
				{a: 2, c9: 5},
				{a: 18, c9: 5},
				{a: 10, c9: 5},
				{a: 26, c9: 5},
				{a: 6, c9: 5},
				{a: 22, c9: 5},
				{a: 14, c9: 5},
				{a: 30, c9: 5},
				{a: 1, c9: 5},
				{a: 17, c9: 5},
				{a: 9, c9: 5},
				{a: 25, c9: 5},
				{a: 5, c9: 5},
				{a: 21, c9: 5},
				{a: 13, c9: 5},
				{a: 29, c9: 5},
				{a: 3, c9: 5},
				{a: 19, c9: 5},
				{a: 11, c9: 5},
				{a: 27, c9: 5},
				{a: 7, c9: 5},
				{a: 23, c9: 5}
			])),
	am: $folkertdev$elm_flate$Huffman$fromList(
		_List_fromArray(
			[
				{a: 12, c9: 8},
				{a: 140, c9: 8},
				{a: 76, c9: 8},
				{a: 204, c9: 8},
				{a: 44, c9: 8},
				{a: 172, c9: 8},
				{a: 108, c9: 8},
				{a: 236, c9: 8},
				{a: 28, c9: 8},
				{a: 156, c9: 8},
				{a: 92, c9: 8},
				{a: 220, c9: 8},
				{a: 60, c9: 8},
				{a: 188, c9: 8},
				{a: 124, c9: 8},
				{a: 252, c9: 8},
				{a: 2, c9: 8},
				{a: 130, c9: 8},
				{a: 66, c9: 8},
				{a: 194, c9: 8},
				{a: 34, c9: 8},
				{a: 162, c9: 8},
				{a: 98, c9: 8},
				{a: 226, c9: 8},
				{a: 18, c9: 8},
				{a: 146, c9: 8},
				{a: 82, c9: 8},
				{a: 210, c9: 8},
				{a: 50, c9: 8},
				{a: 178, c9: 8},
				{a: 114, c9: 8},
				{a: 242, c9: 8},
				{a: 10, c9: 8},
				{a: 138, c9: 8},
				{a: 74, c9: 8},
				{a: 202, c9: 8},
				{a: 42, c9: 8},
				{a: 170, c9: 8},
				{a: 106, c9: 8},
				{a: 234, c9: 8},
				{a: 26, c9: 8},
				{a: 154, c9: 8},
				{a: 90, c9: 8},
				{a: 218, c9: 8},
				{a: 58, c9: 8},
				{a: 186, c9: 8},
				{a: 122, c9: 8},
				{a: 250, c9: 8},
				{a: 6, c9: 8},
				{a: 134, c9: 8},
				{a: 70, c9: 8},
				{a: 198, c9: 8},
				{a: 38, c9: 8},
				{a: 166, c9: 8},
				{a: 102, c9: 8},
				{a: 230, c9: 8},
				{a: 22, c9: 8},
				{a: 150, c9: 8},
				{a: 86, c9: 8},
				{a: 214, c9: 8},
				{a: 54, c9: 8},
				{a: 182, c9: 8},
				{a: 118, c9: 8},
				{a: 246, c9: 8},
				{a: 14, c9: 8},
				{a: 142, c9: 8},
				{a: 78, c9: 8},
				{a: 206, c9: 8},
				{a: 46, c9: 8},
				{a: 174, c9: 8},
				{a: 110, c9: 8},
				{a: 238, c9: 8},
				{a: 30, c9: 8},
				{a: 158, c9: 8},
				{a: 94, c9: 8},
				{a: 222, c9: 8},
				{a: 62, c9: 8},
				{a: 190, c9: 8},
				{a: 126, c9: 8},
				{a: 254, c9: 8},
				{a: 1, c9: 8},
				{a: 129, c9: 8},
				{a: 65, c9: 8},
				{a: 193, c9: 8},
				{a: 33, c9: 8},
				{a: 161, c9: 8},
				{a: 97, c9: 8},
				{a: 225, c9: 8},
				{a: 17, c9: 8},
				{a: 145, c9: 8},
				{a: 81, c9: 8},
				{a: 209, c9: 8},
				{a: 49, c9: 8},
				{a: 177, c9: 8},
				{a: 113, c9: 8},
				{a: 241, c9: 8},
				{a: 9, c9: 8},
				{a: 137, c9: 8},
				{a: 73, c9: 8},
				{a: 201, c9: 8},
				{a: 41, c9: 8},
				{a: 169, c9: 8},
				{a: 105, c9: 8},
				{a: 233, c9: 8},
				{a: 25, c9: 8},
				{a: 153, c9: 8},
				{a: 89, c9: 8},
				{a: 217, c9: 8},
				{a: 57, c9: 8},
				{a: 185, c9: 8},
				{a: 121, c9: 8},
				{a: 249, c9: 8},
				{a: 5, c9: 8},
				{a: 133, c9: 8},
				{a: 69, c9: 8},
				{a: 197, c9: 8},
				{a: 37, c9: 8},
				{a: 165, c9: 8},
				{a: 101, c9: 8},
				{a: 229, c9: 8},
				{a: 21, c9: 8},
				{a: 149, c9: 8},
				{a: 85, c9: 8},
				{a: 213, c9: 8},
				{a: 53, c9: 8},
				{a: 181, c9: 8},
				{a: 117, c9: 8},
				{a: 245, c9: 8},
				{a: 13, c9: 8},
				{a: 141, c9: 8},
				{a: 77, c9: 8},
				{a: 205, c9: 8},
				{a: 45, c9: 8},
				{a: 173, c9: 8},
				{a: 109, c9: 8},
				{a: 237, c9: 8},
				{a: 29, c9: 8},
				{a: 157, c9: 8},
				{a: 93, c9: 8},
				{a: 221, c9: 8},
				{a: 61, c9: 8},
				{a: 189, c9: 8},
				{a: 125, c9: 8},
				{a: 253, c9: 8},
				{a: 19, c9: 9},
				{a: 275, c9: 9},
				{a: 147, c9: 9},
				{a: 403, c9: 9},
				{a: 83, c9: 9},
				{a: 339, c9: 9},
				{a: 211, c9: 9},
				{a: 467, c9: 9},
				{a: 51, c9: 9},
				{a: 307, c9: 9},
				{a: 179, c9: 9},
				{a: 435, c9: 9},
				{a: 115, c9: 9},
				{a: 371, c9: 9},
				{a: 243, c9: 9},
				{a: 499, c9: 9},
				{a: 11, c9: 9},
				{a: 267, c9: 9},
				{a: 139, c9: 9},
				{a: 395, c9: 9},
				{a: 75, c9: 9},
				{a: 331, c9: 9},
				{a: 203, c9: 9},
				{a: 459, c9: 9},
				{a: 43, c9: 9},
				{a: 299, c9: 9},
				{a: 171, c9: 9},
				{a: 427, c9: 9},
				{a: 107, c9: 9},
				{a: 363, c9: 9},
				{a: 235, c9: 9},
				{a: 491, c9: 9},
				{a: 27, c9: 9},
				{a: 283, c9: 9},
				{a: 155, c9: 9},
				{a: 411, c9: 9},
				{a: 91, c9: 9},
				{a: 347, c9: 9},
				{a: 219, c9: 9},
				{a: 475, c9: 9},
				{a: 59, c9: 9},
				{a: 315, c9: 9},
				{a: 187, c9: 9},
				{a: 443, c9: 9},
				{a: 123, c9: 9},
				{a: 379, c9: 9},
				{a: 251, c9: 9},
				{a: 507, c9: 9},
				{a: 7, c9: 9},
				{a: 263, c9: 9},
				{a: 135, c9: 9},
				{a: 391, c9: 9},
				{a: 71, c9: 9},
				{a: 327, c9: 9},
				{a: 199, c9: 9},
				{a: 455, c9: 9},
				{a: 39, c9: 9},
				{a: 295, c9: 9},
				{a: 167, c9: 9},
				{a: 423, c9: 9},
				{a: 103, c9: 9},
				{a: 359, c9: 9},
				{a: 231, c9: 9},
				{a: 487, c9: 9},
				{a: 23, c9: 9},
				{a: 279, c9: 9},
				{a: 151, c9: 9},
				{a: 407, c9: 9},
				{a: 87, c9: 9},
				{a: 343, c9: 9},
				{a: 215, c9: 9},
				{a: 471, c9: 9},
				{a: 55, c9: 9},
				{a: 311, c9: 9},
				{a: 183, c9: 9},
				{a: 439, c9: 9},
				{a: 119, c9: 9},
				{a: 375, c9: 9},
				{a: 247, c9: 9},
				{a: 503, c9: 9},
				{a: 15, c9: 9},
				{a: 271, c9: 9},
				{a: 143, c9: 9},
				{a: 399, c9: 9},
				{a: 79, c9: 9},
				{a: 335, c9: 9},
				{a: 207, c9: 9},
				{a: 463, c9: 9},
				{a: 47, c9: 9},
				{a: 303, c9: 9},
				{a: 175, c9: 9},
				{a: 431, c9: 9},
				{a: 111, c9: 9},
				{a: 367, c9: 9},
				{a: 239, c9: 9},
				{a: 495, c9: 9},
				{a: 31, c9: 9},
				{a: 287, c9: 9},
				{a: 159, c9: 9},
				{a: 415, c9: 9},
				{a: 95, c9: 9},
				{a: 351, c9: 9},
				{a: 223, c9: 9},
				{a: 479, c9: 9},
				{a: 63, c9: 9},
				{a: 319, c9: 9},
				{a: 191, c9: 9},
				{a: 447, c9: 9},
				{a: 127, c9: 9},
				{a: 383, c9: 9},
				{a: 255, c9: 9},
				{a: 511, c9: 9},
				{a: 0, c9: 7},
				{a: 64, c9: 7},
				{a: 32, c9: 7},
				{a: 96, c9: 7},
				{a: 16, c9: 7},
				{a: 80, c9: 7},
				{a: 48, c9: 7},
				{a: 112, c9: 7},
				{a: 8, c9: 7},
				{a: 72, c9: 7},
				{a: 40, c9: 7},
				{a: 104, c9: 7},
				{a: 24, c9: 7},
				{a: 88, c9: 7},
				{a: 56, c9: 7},
				{a: 120, c9: 7},
				{a: 4, c9: 7},
				{a: 68, c9: 7},
				{a: 36, c9: 7},
				{a: 100, c9: 7},
				{a: 20, c9: 7},
				{a: 84, c9: 7},
				{a: 52, c9: 7},
				{a: 116, c9: 7},
				{a: 3, c9: 8},
				{a: 131, c9: 8},
				{a: 67, c9: 8},
				{a: 195, c9: 8},
				{a: 35, c9: 8},
				{a: 163, c9: 8},
				{a: 99, c9: 8},
				{a: 227, c9: 8}
			]))
};
var $folkertdev$elm_flate$Deflate$Internal$encodeCompressStatic = F3(
	function (maybeWindowSize, buf, bitWriter) {
		var huffmanTrees = $folkertdev$elm_flate$Huffman$hardcodedStaticHuffmanTree;
		var compressed = A2($folkertdev$elm_flate$Deflate$Internal$compress, maybeWindowSize, buf);
		return A3(
			$elm$core$Array$foldl,
			F2(
				function (symbol, first) {
					return A3($folkertdev$elm_flate$Deflate$Symbol$encode, symbol, huffmanTrees, first);
				}),
			bitWriter,
			compressed);
	});
var $folkertdev$elm_flate$Deflate$Internal$encodeStaticBlock = F3(
	function (windowSize, _v0, bitWriter) {
		var isLastBlock = _v0.a;
		var buffer = _v0.b;
		return $folkertdev$elm_flate$Deflate$BitWriter$flush(
			A3(
				$folkertdev$elm_flate$Deflate$Internal$encodeCompressStatic,
				windowSize,
				buffer,
				A3(
					$folkertdev$elm_flate$Deflate$BitWriter$writeBits,
					2,
					1,
					A2($folkertdev$elm_flate$Deflate$BitWriter$writeBit, isLastBlock, bitWriter))));
	});
var $folkertdev$elm_flate$Deflate$Internal$encodeStatic = F2(
	function (windowSize, buffer) {
		return $elm$bytes$Bytes$Encode$encode(
			$elm$bytes$Bytes$Encode$sequence(
				$folkertdev$elm_flate$Deflate$BitWriter$run(
					A3(
						$elm$core$List$foldl,
						F2(
							function (chunk, first) {
								return A3($folkertdev$elm_flate$Deflate$Internal$encodeStaticBlock, windowSize, chunk, first);
							}),
						$folkertdev$elm_flate$Deflate$BitWriter$empty,
						A2($folkertdev$elm_flate$Deflate$Internal$chunks, $folkertdev$elm_flate$Deflate$Internal$default_block_size, buffer)))));
	});
var $folkertdev$elm_flate$Flate$deflateWithOptions = F2(
	function (encoding, buffer) {
		switch (encoding.$) {
			case 0:
				return $folkertdev$elm_flate$Deflate$Internal$encodeRaw(buffer);
			case 2:
				if (!encoding.a.$) {
					var _v1 = encoding.a;
					return A2($folkertdev$elm_flate$Deflate$Internal$encodeStatic, $elm$core$Maybe$Nothing, buffer);
				} else {
					var w = encoding.a.a;
					return A2(
						$folkertdev$elm_flate$Deflate$Internal$encodeStatic,
						$elm$core$Maybe$Just(w),
						buffer);
				}
			default:
				if (!encoding.a.$) {
					var _v2 = encoding.a;
					return A2($folkertdev$elm_flate$Deflate$Internal$encodeDynamic, $elm$core$Maybe$Nothing, buffer);
				} else {
					var w = encoding.a.a;
					return A2(
						$folkertdev$elm_flate$Deflate$Internal$encodeDynamic,
						$elm$core$Maybe$Just(w),
						buffer);
				}
		}
	});
var $folkertdev$elm_flate$LZ77$max_distance = 32768;
var $folkertdev$elm_flate$LZ77$maxWindowSize = $folkertdev$elm_flate$LZ77$max_distance;
var $folkertdev$elm_flate$Flate$deflate = $folkertdev$elm_flate$Flate$deflateWithOptions(
	$folkertdev$elm_flate$Flate$Dynamic(
		$folkertdev$elm_flate$Flate$WithWindowSize($folkertdev$elm_flate$LZ77$maxWindowSize)));
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $danfishgold$base64_bytes$Decode$lowest6BitsMask = 63;
var $elm$core$Char$fromCode = _Char_fromCode;
var $danfishgold$base64_bytes$Decode$unsafeToChar = function (n) {
	if (n <= 25) {
		return $elm$core$Char$fromCode(65 + n);
	} else {
		if (n <= 51) {
			return $elm$core$Char$fromCode(97 + (n - 26));
		} else {
			if (n <= 61) {
				return $elm$core$Char$fromCode(48 + (n - 52));
			} else {
				switch (n) {
					case 62:
						return '+';
					case 63:
						return '/';
					default:
						return '\u0000';
				}
			}
		}
	}
};
var $danfishgold$base64_bytes$Decode$bitsToChars = F2(
	function (bits, missing) {
		var s = $danfishgold$base64_bytes$Decode$unsafeToChar(bits & $danfishgold$base64_bytes$Decode$lowest6BitsMask);
		var r = $danfishgold$base64_bytes$Decode$unsafeToChar((bits >>> 6) & $danfishgold$base64_bytes$Decode$lowest6BitsMask);
		var q = $danfishgold$base64_bytes$Decode$unsafeToChar((bits >>> 12) & $danfishgold$base64_bytes$Decode$lowest6BitsMask);
		var p = $danfishgold$base64_bytes$Decode$unsafeToChar(bits >>> 18);
		switch (missing) {
			case 0:
				return A2(
					$elm$core$String$cons,
					p,
					A2(
						$elm$core$String$cons,
						q,
						A2(
							$elm$core$String$cons,
							r,
							$elm$core$String$fromChar(s))));
			case 1:
				return A2(
					$elm$core$String$cons,
					p,
					A2(
						$elm$core$String$cons,
						q,
						A2($elm$core$String$cons, r, '=')));
			case 2:
				return A2(
					$elm$core$String$cons,
					p,
					A2($elm$core$String$cons, q, '=='));
			default:
				return '';
		}
	});
var $danfishgold$base64_bytes$Decode$bitsToCharSpecialized = F4(
	function (bits1, bits2, bits3, accum) {
		var z = $danfishgold$base64_bytes$Decode$unsafeToChar((bits3 >>> 6) & $danfishgold$base64_bytes$Decode$lowest6BitsMask);
		var y = $danfishgold$base64_bytes$Decode$unsafeToChar((bits3 >>> 12) & $danfishgold$base64_bytes$Decode$lowest6BitsMask);
		var x = $danfishgold$base64_bytes$Decode$unsafeToChar(bits3 >>> 18);
		var w = $danfishgold$base64_bytes$Decode$unsafeToChar(bits3 & $danfishgold$base64_bytes$Decode$lowest6BitsMask);
		var s = $danfishgold$base64_bytes$Decode$unsafeToChar(bits1 & $danfishgold$base64_bytes$Decode$lowest6BitsMask);
		var r = $danfishgold$base64_bytes$Decode$unsafeToChar((bits1 >>> 6) & $danfishgold$base64_bytes$Decode$lowest6BitsMask);
		var q = $danfishgold$base64_bytes$Decode$unsafeToChar((bits1 >>> 12) & $danfishgold$base64_bytes$Decode$lowest6BitsMask);
		var p = $danfishgold$base64_bytes$Decode$unsafeToChar(bits1 >>> 18);
		var d = $danfishgold$base64_bytes$Decode$unsafeToChar(bits2 & $danfishgold$base64_bytes$Decode$lowest6BitsMask);
		var c = $danfishgold$base64_bytes$Decode$unsafeToChar((bits2 >>> 6) & $danfishgold$base64_bytes$Decode$lowest6BitsMask);
		var b = $danfishgold$base64_bytes$Decode$unsafeToChar((bits2 >>> 12) & $danfishgold$base64_bytes$Decode$lowest6BitsMask);
		var a = $danfishgold$base64_bytes$Decode$unsafeToChar(bits2 >>> 18);
		return A2(
			$elm$core$String$cons,
			x,
			A2(
				$elm$core$String$cons,
				y,
				A2(
					$elm$core$String$cons,
					z,
					A2(
						$elm$core$String$cons,
						w,
						A2(
							$elm$core$String$cons,
							a,
							A2(
								$elm$core$String$cons,
								b,
								A2(
									$elm$core$String$cons,
									c,
									A2(
										$elm$core$String$cons,
										d,
										A2(
											$elm$core$String$cons,
											p,
											A2(
												$elm$core$String$cons,
												q,
												A2(
													$elm$core$String$cons,
													r,
													A2($elm$core$String$cons, s, accum))))))))))));
	});
var $danfishgold$base64_bytes$Decode$decode18Help = F5(
	function (a, b, c, d, e) {
		var combined6 = ((255 & d) << 16) | e;
		var combined5 = d >>> 8;
		var combined4 = 16777215 & c;
		var combined3 = ((65535 & b) << 8) | (c >>> 24);
		var combined2 = ((255 & a) << 16) | (b >>> 16);
		var combined1 = a >>> 8;
		return A4(
			$danfishgold$base64_bytes$Decode$bitsToCharSpecialized,
			combined3,
			combined2,
			combined1,
			A4($danfishgold$base64_bytes$Decode$bitsToCharSpecialized, combined6, combined5, combined4, ''));
	});
var $danfishgold$base64_bytes$Decode$u16BE = $elm$bytes$Bytes$Decode$unsignedInt16(1);
var $danfishgold$base64_bytes$Decode$u32BE = $elm$bytes$Bytes$Decode$unsignedInt32(1);
var $danfishgold$base64_bytes$Decode$decode18Bytes = A6($elm$bytes$Bytes$Decode$map5, $danfishgold$base64_bytes$Decode$decode18Help, $danfishgold$base64_bytes$Decode$u32BE, $danfishgold$base64_bytes$Decode$u32BE, $danfishgold$base64_bytes$Decode$u32BE, $danfishgold$base64_bytes$Decode$u32BE, $danfishgold$base64_bytes$Decode$u16BE);
var $elm$bytes$Bytes$Decode$map3 = F4(
	function (func, _v0, _v1, _v2) {
		var decodeA = _v0;
		var decodeB = _v1;
		var decodeC = _v2;
		return F2(
			function (bites, offset) {
				var _v3 = A2(decodeA, bites, offset);
				var aOffset = _v3.a;
				var a = _v3.b;
				var _v4 = A2(decodeB, bites, aOffset);
				var bOffset = _v4.a;
				var b = _v4.b;
				var _v5 = A2(decodeC, bites, bOffset);
				var cOffset = _v5.a;
				var c = _v5.b;
				return _Utils_Tuple2(
					cOffset,
					A3(func, a, b, c));
			});
	});
var $danfishgold$base64_bytes$Decode$loopHelp = function (_v0) {
	var remaining = _v0.a1;
	var string = _v0.a5;
	if (remaining >= 18) {
		return A2(
			$elm$bytes$Bytes$Decode$map,
			function (result) {
				return $elm$bytes$Bytes$Decode$Loop(
					{
						a1: remaining - 18,
						a5: _Utils_ap(string, result)
					});
			},
			$danfishgold$base64_bytes$Decode$decode18Bytes);
	} else {
		if (remaining >= 3) {
			var helper = F3(
				function (a, b, c) {
					var combined = ((a << 16) | (b << 8)) | c;
					return $elm$bytes$Bytes$Decode$Loop(
						{
							a1: remaining - 3,
							a5: _Utils_ap(
								string,
								A2($danfishgold$base64_bytes$Decode$bitsToChars, combined, 0))
						});
				});
			return A4($elm$bytes$Bytes$Decode$map3, helper, $elm$bytes$Bytes$Decode$unsignedInt8, $elm$bytes$Bytes$Decode$unsignedInt8, $elm$bytes$Bytes$Decode$unsignedInt8);
		} else {
			if (!remaining) {
				return $elm$bytes$Bytes$Decode$succeed(
					$elm$bytes$Bytes$Decode$Done(string));
			} else {
				if (remaining === 2) {
					var helper = F2(
						function (a, b) {
							var combined = (a << 16) | (b << 8);
							return $elm$bytes$Bytes$Decode$Done(
								_Utils_ap(
									string,
									A2($danfishgold$base64_bytes$Decode$bitsToChars, combined, 1)));
						});
					return A3($elm$bytes$Bytes$Decode$map2, helper, $elm$bytes$Bytes$Decode$unsignedInt8, $elm$bytes$Bytes$Decode$unsignedInt8);
				} else {
					return A2(
						$elm$bytes$Bytes$Decode$map,
						function (a) {
							return $elm$bytes$Bytes$Decode$Done(
								_Utils_ap(
									string,
									A2($danfishgold$base64_bytes$Decode$bitsToChars, a << 16, 2)));
						},
						$elm$bytes$Bytes$Decode$unsignedInt8);
				}
			}
		}
	}
};
var $danfishgold$base64_bytes$Decode$decoder = function (width) {
	return A2(
		$elm$bytes$Bytes$Decode$loop,
		{a1: width, a5: ''},
		$danfishgold$base64_bytes$Decode$loopHelp);
};
var $danfishgold$base64_bytes$Decode$fromBytes = function (bytes) {
	return A2(
		$elm$bytes$Bytes$Decode$decode,
		$danfishgold$base64_bytes$Decode$decoder(
			$elm$bytes$Bytes$width(bytes)),
		bytes);
};
var $danfishgold$base64_bytes$Base64$fromBytes = $danfishgold$base64_bytes$Decode$fromBytes;
var $author$project$NameDictWorker$GotRemoteData = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 2};
var $elm$http$Http$Receiving = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$Timeout_ = {$: 1};
var $elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			$elm$core$Basics$identity,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $elm$http$Http$BadBody = function (a) {
	return {$: 4, a: a};
};
var $elm$http$Http$BadStatus = function (a) {
	return {$: 3, a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$NetworkError = {$: 2};
var $elm$http$Http$Timeout = {$: 1};
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$http$Http$resolve = F2(
	function (toResult, response) {
		switch (response.$) {
			case 0:
				var url = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadUrl(url));
			case 1:
				return $elm$core$Result$Err($elm$http$Http$Timeout);
			case 2:
				return $elm$core$Result$Err($elm$http$Http$NetworkError);
			case 3:
				var metadata = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadStatus(metadata.eN));
			default:
				var body = response.b;
				return A2(
					$elm$core$Result$mapError,
					$elm$http$Http$BadBody,
					toResult(body));
		}
	});
var $elm$http$Http$expectString = function (toMsg) {
	return A2(
		$elm$http$Http$expectStringResponse,
		toMsg,
		$elm$http$Http$resolve($elm$core$Result$Ok));
};
var $elm$http$Http$emptyBody = _Http_emptyBody;
var $elm$http$Http$Request = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {cM: reqs, c$: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (!cmd.$) {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 1) {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.c2;
							if (_v4.$ === 1) {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.cM));
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.c$)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (!cmd.$) {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					dq: r.dq,
					dy: r.dy,
					dV: A2(_Http_mapExpect, func, r.dV),
					b4: r.b4,
					ei: r.ei,
					e8: r.e8,
					c2: r.c2,
					fe: r.fe
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{dq: false, dy: r.dy, dV: r.dV, b4: r.b4, ei: r.ei, e8: r.e8, c2: r.c2, fe: r.fe}));
};
var $elm$http$Http$get = function (r) {
	return $elm$http$Http$request(
		{dy: $elm$http$Http$emptyBody, dV: r.dV, b4: _List_Nil, ei: 'GET', e8: $elm$core$Maybe$Nothing, c2: $elm$core$Maybe$Nothing, fe: r.fe});
};
var $author$project$NameDictWorker$getData = function (path) {
	return $elm$http$Http$get(
		{
			dV: $elm$http$Http$expectString(
				$author$project$NameDictWorker$GotRemoteData(path)),
			fe: path
		});
};
var $elm$core$String$indexes = _String_indexes;
var $folkertdev$elm_flate$Inflate$BitReader$decode = F2(
	function (bytes, _v0) {
		var reader = _v0;
		var initialState = {l: 0, x: bytes, u: 0, p: 0, X: 0};
		var _v1 = reader(initialState);
		if (!_v1.$) {
			var _v2 = _v1.a;
			var value = _v2.a;
			return $elm$core$Result$Ok(value);
		} else {
			var e = _v1.a;
			return $elm$core$Result$Err(e);
		}
	});
var $folkertdev$elm_flate$Inflate$BitReader$BitReader = $elm$core$Basics$identity;
var $folkertdev$elm_flate$Inflate$BitReader$loopHelp = F3(
	function (accum, callback, state) {
		loopHelp:
		while (true) {
			var _v0 = callback(accum);
			var decoder = _v0;
			var _v1 = decoder(state);
			if (_v1.$ === 1) {
				var e = _v1.a;
				return $elm$core$Result$Err(e);
			} else {
				if (!_v1.a.a.$) {
					var _v2 = _v1.a;
					var newAccum = _v2.a.a;
					var newState = _v2.b;
					var $temp$accum = newAccum,
						$temp$callback = callback,
						$temp$state = newState;
					accum = $temp$accum;
					callback = $temp$callback;
					state = $temp$state;
					continue loopHelp;
				} else {
					var _v3 = _v1.a;
					var result = _v3.a.a;
					var newState = _v3.b;
					return $elm$core$Result$Ok(
						_Utils_Tuple2(result, newState));
				}
			}
		}
	});
var $folkertdev$elm_flate$Inflate$BitReader$loop = F2(
	function (state, callback) {
		return A2($folkertdev$elm_flate$Inflate$BitReader$loopHelp, state, callback);
	});
var $folkertdev$elm_flate$Inflate$BitReader$map = F2(
	function (f, _v0) {
		var g = _v0;
		return function (s) {
			var _v1 = g(s);
			if (!_v1.$) {
				var _v2 = _v1.a;
				var value = _v2.a;
				var newState = _v2.b;
				return $elm$core$Result$Ok(
					_Utils_Tuple2(
						f(value),
						newState));
			} else {
				var e = _v1.a;
				return $elm$core$Result$Err(e);
			}
		};
	});
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $folkertdev$elm_flate$Experimental$ByteArray$toBytes = function (_v0) {
	var array = _v0.a;
	var finalSize = _v0.b;
	var finalBytes = _v0.c;
	var initial = function () {
		var finalInt32 = finalBytes >>> ((4 - finalSize) * 8);
		switch (finalSize) {
			case 4:
				return _List_fromArray(
					[
						A2($elm$bytes$Bytes$Encode$unsignedInt32, 1, finalBytes)
					]);
			case 1:
				return _List_fromArray(
					[
						$elm$bytes$Bytes$Encode$unsignedInt8(finalInt32)
					]);
			case 2:
				return _List_fromArray(
					[
						A2($elm$bytes$Bytes$Encode$unsignedInt16, 1, finalInt32)
					]);
			case 3:
				return _List_fromArray(
					[
						A2($elm$bytes$Bytes$Encode$unsignedInt16, 1, finalInt32 >> 8),
						$elm$bytes$Bytes$Encode$unsignedInt8(255 & finalInt32)
					]);
			default:
				return _List_Nil;
		}
	}();
	var folder = F2(
		function (element, accum) {
			return A2(
				$elm$core$List$cons,
				A2($elm$bytes$Bytes$Encode$unsignedInt32, 1, element),
				accum);
		});
	return $elm$bytes$Bytes$Encode$encode(
		$elm$bytes$Bytes$Encode$sequence(
			A3($elm$core$Array$foldr, folder, initial, array)));
};
var $folkertdev$elm_flate$Inflate$BitReader$andThen = F2(
	function (f, _v0) {
		var g = _v0;
		return function (s) {
			var _v1 = g(s);
			if (!_v1.$) {
				var _v2 = _v1.a;
				var value = _v2.a;
				var newState = _v2.b;
				var _v3 = f(value);
				var h = _v3;
				return h(newState);
			} else {
				var e = _v1.a;
				return $elm$core$Result$Err(e);
			}
		};
	});
var $folkertdev$elm_flate$Experimental$ByteArray$push = F2(
	function (value, input) {
		var array = input.a;
		var finalSize = input.b;
		var finalBytes = input.c;
		if (finalSize === 4) {
			return A3(
				$folkertdev$elm_flate$Experimental$ByteArray$ByteArray,
				A2($elm$core$Array$push, finalBytes, array),
				1,
				value << 24);
		} else {
			if (!finalSize) {
				return A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, array, 1, value << 24);
			} else {
				var offset = finalSize;
				var internalIndex = $elm$core$Array$length(array) - 1;
				var _new = ((255 & value) << ((3 - offset) * 8)) | finalBytes;
				var mask = 4278190080 >>> (offset * 8);
				return A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, array, finalSize + 1, _new);
			}
		}
	});
var $folkertdev$elm_flate$Experimental$ByteArray$pushMany = F3(
	function (nbytes, value_, input) {
		var array = input.a;
		var finalSize = input.b;
		var finalBytes = input.c;
		var value = (nbytes === 4) ? value_ : (((1 << (nbytes * 8)) - 1) & value_);
		if (!nbytes) {
			return input;
		} else {
			if (finalSize === 4) {
				return A3(
					$folkertdev$elm_flate$Experimental$ByteArray$ByteArray,
					A2($elm$core$Array$push, finalBytes, array),
					nbytes,
					value << ((4 - nbytes) * 8));
			} else {
				if (!finalSize) {
					return A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, array, nbytes, value << ((4 - nbytes) * 8));
				} else {
					var freeSpace = 4 - finalSize;
					if (_Utils_cmp(nbytes, freeSpace) > 0) {
						var bytesLeftOver = (finalSize + nbytes) - 4;
						var forFinal = value >>> (bytesLeftOver * 8);
						var newFinal = finalBytes | forFinal;
						var amount = ((8 - finalSize) - nbytes) * 8;
						var forNextFinal = (((1 << (bytesLeftOver * 8)) - 1) & value) << amount;
						return A3(
							$folkertdev$elm_flate$Experimental$ByteArray$ByteArray,
							A2($elm$core$Array$push, newFinal, array),
							nbytes - freeSpace,
							forNextFinal);
					} else {
						var amount = (4 - (finalSize + nbytes)) * 8;
						var forFinal = value << amount;
						var newFinal = finalBytes | forFinal;
						return A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, array, finalSize + nbytes, newFinal);
					}
				}
			}
		}
	});
var $folkertdev$elm_flate$Experimental$ByteArray$appendBytesHelp = function (_v0) {
	var remaining = _v0.a;
	var bytearray = _v0.b;
	var array = bytearray.a;
	var finalSize = bytearray.b;
	var finalBytes = bytearray.c;
	return (remaining >= 4) ? A2(
		$elm$bytes$Bytes$Decode$map,
		function (_new) {
			return $elm$bytes$Bytes$Decode$Loop(
				_Utils_Tuple2(
					remaining - 4,
					A3($folkertdev$elm_flate$Experimental$ByteArray$pushMany, 4, _new, bytearray)));
		},
		$elm$bytes$Bytes$Decode$unsignedInt32(1)) : ((remaining >= 1) ? A2(
		$elm$bytes$Bytes$Decode$map,
		function (_new) {
			return $elm$bytes$Bytes$Decode$Loop(
				_Utils_Tuple2(
					remaining - 1,
					A2($folkertdev$elm_flate$Experimental$ByteArray$push, _new, bytearray)));
		},
		$elm$bytes$Bytes$Decode$unsignedInt8) : $elm$bytes$Bytes$Decode$succeed(
		$elm$bytes$Bytes$Decode$Done(bytearray)));
};
var $folkertdev$elm_flate$Experimental$ByteArray$appendBytes = F2(
	function (bytes, barray) {
		var array = barray.a;
		var finalSize = barray.b;
		var finalBytes = barray.c;
		var decoder = A2(
			$elm$bytes$Bytes$Decode$loop,
			_Utils_Tuple2(
				$elm$bytes$Bytes$width(bytes),
				barray),
			$folkertdev$elm_flate$Experimental$ByteArray$appendBytesHelp);
		var _v0 = A2($elm$bytes$Bytes$Decode$decode, decoder, bytes);
		if (!_v0.$) {
			var v = _v0.a;
			return v;
		} else {
			return barray;
		}
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $folkertdev$elm_flate$Inflate$Internal$buildTree = F3(
	function (lengths, offset, num) {
		var tableDict = function () {
			var updater = function (maybeValue) {
				if (maybeValue.$ === 1) {
					return $elm$core$Maybe$Just(1);
				} else {
					var v = maybeValue.a;
					return $elm$core$Maybe$Just(v + 1);
				}
			};
			var folder = F3(
				function (key, value, accum) {
					return ((_Utils_cmp(key, offset) > -1) && (_Utils_cmp(key, num + offset) < 0)) ? A3($elm$core$Dict$update, value, updater, accum) : accum;
				});
			return A3($elm$core$Dict$foldl, folder, $elm$core$Dict$empty, lengths);
		}();
		var offsetsDict = A3(
			$elm$core$Dict$foldl,
			F3(
				function (key, value, _v4) {
					var sum = _v4.a;
					var dict = _v4.b;
					return _Utils_Tuple2(
						sum + value,
						A3($elm$core$Dict$insert, key, sum, dict));
				}),
			_Utils_Tuple2(0, $elm$core$Dict$empty),
			tableDict);
		var newTable = function () {
			var helper = F4(
				function (key, value, i, array) {
					helper:
					while (true) {
						if (_Utils_cmp(i, key) > 0) {
							var $temp$key = key,
								$temp$value = value,
								$temp$i = i - 1,
								$temp$array = A2($elm$core$List$cons, 0, array);
							key = $temp$key;
							value = $temp$value;
							i = $temp$i;
							array = $temp$array;
							continue helper;
						} else {
							return A2($elm$core$List$cons, value, array);
						}
					}
				});
			var foldHelp = F3(
				function (key, value, _v3) {
					var i = _v3.a;
					var array = _v3.b;
					return _Utils_Tuple2(
						key - 1,
						A4(helper, key, value, i, array));
				});
			var anotherGo = F2(
				function (i, array) {
					anotherGo:
					while (true) {
						if (i >= 0) {
							var $temp$i = i - 1,
								$temp$array = A2($elm$core$List$cons, 0, array);
							i = $temp$i;
							array = $temp$array;
							continue anotherGo;
						} else {
							return array;
						}
					}
				});
			return function (_v2) {
				var a = _v2.a;
				var b = _v2.b;
				return A2(anotherGo, a, b);
			}(
				A3(
					$elm$core$Dict$foldr,
					foldHelp,
					_Utils_Tuple2(15, _List_Nil),
					tableDict));
		}();
		var go2 = F3(
			function (i, currentTranslation, currentOffsets) {
				go2:
				while (true) {
					if ((i - num) < 0) {
						var _v0 = A2($elm$core$Dict$get, offset + i, lengths);
						if (_v0.$ === 1) {
							var $temp$i = i + 1,
								$temp$currentTranslation = currentTranslation,
								$temp$currentOffsets = currentOffsets;
							i = $temp$i;
							currentTranslation = $temp$currentTranslation;
							currentOffsets = $temp$currentOffsets;
							continue go2;
						} else {
							var v = _v0.a;
							if (!(!v)) {
								var _v1 = A2($elm$core$Dict$get, v, currentOffsets);
								if (_v1.$ === 1) {
									return currentTranslation;
								} else {
									var w = _v1.a;
									var $temp$i = i + 1,
										$temp$currentTranslation = A3($elm$core$Array$set, w, i, currentTranslation),
										$temp$currentOffsets = A3($elm$core$Dict$insert, v, w + 1, currentOffsets);
									i = $temp$i;
									currentTranslation = $temp$currentTranslation;
									currentOffsets = $temp$currentOffsets;
									continue go2;
								}
							} else {
								var $temp$i = i + 1,
									$temp$currentTranslation = currentTranslation,
									$temp$currentOffsets = currentOffsets;
								i = $temp$i;
								currentTranslation = $temp$currentTranslation;
								currentOffsets = $temp$currentOffsets;
								continue go2;
							}
						}
					} else {
						return currentTranslation;
					}
				}
			});
		var translation2 = A3(
			go2,
			0,
			A2($elm$core$Array$repeat, num, 0),
			offsetsDict.b);
		return {as: newTable, aL: translation2};
	});
var $folkertdev$elm_flate$Inflate$Internal$clcIndices = _List_fromArray(
	[16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var $folkertdev$elm_flate$Inflate$BitSet$BitSet320 = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (f) {
						return function (g) {
							return function (h) {
								return function (i) {
									return function (j) {
										return {$: 0, a: a, b: b, c: c, d: d, e: e, f: f, g: g, h: h, i: i, j: j};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $folkertdev$elm_flate$Inflate$BitSet$insert = F2(
	function (n, input) {
		var b1 = input.a;
		var b2 = input.b;
		var b3 = input.c;
		var b4 = input.d;
		var b5 = input.e;
		var b6 = input.f;
		var b7 = input.g;
		var b8 = input.h;
		var b9 = input.i;
		var b10 = input.j;
		if (n >= 320) {
			return input;
		} else {
			var bit = 1 << (n % 32);
			var _v0 = (n / 32) | 0;
			switch (_v0) {
				case 0:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(bit | b1)(b2)(b3)(b4)(b5)(b6)(b7)(b8)(b9)(b10);
				case 1:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(bit | b2)(b3)(b4)(b5)(b6)(b7)(b8)(b9)(b10);
				case 2:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(bit | b3)(b4)(b5)(b6)(b7)(b8)(b9)(b10);
				case 3:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(bit | b4)(b5)(b6)(b7)(b8)(b9)(b10);
				case 4:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(b4)(bit | b5)(b6)(b7)(b8)(b9)(b10);
				case 5:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(b4)(b5)(bit | b6)(b7)(b8)(b9)(b10);
				case 6:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(b4)(b5)(b6)(bit | b7)(b8)(b9)(b10);
				case 7:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(b4)(b5)(b6)(b7)(bit | b8)(b9)(b10);
				case 8:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(b4)(b5)(b6)(b7)(b8)(bit | b9)(b10);
				case 9:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(b4)(b5)(b6)(b7)(b8)(b9)(bit | b10);
				default:
					return input;
			}
		}
	});
var $folkertdev$elm_flate$Inflate$BitSet$member = F2(
	function (n, input) {
		var b1 = input.a;
		var b2 = input.b;
		var b3 = input.c;
		var b4 = input.d;
		var b5 = input.e;
		var b6 = input.f;
		var b7 = input.g;
		var b8 = input.h;
		var b9 = input.i;
		var b10 = input.j;
		if (n >= 320) {
			return false;
		} else {
			var bit = 1 << (n % 32);
			var _v0 = (n / 32) | 0;
			switch (_v0) {
				case 0:
					return (bit & b1) > 0;
				case 1:
					return (bit & b2) > 0;
				case 2:
					return (bit & b3) > 0;
				case 3:
					return (bit & b4) > 0;
				case 4:
					return (bit & b5) > 0;
				case 5:
					return (bit & b6) > 0;
				case 6:
					return (bit & b7) > 0;
				case 7:
					return (bit & b8) > 0;
				case 8:
					return (bit & b9) > 0;
				case 9:
					return (bit & b10) > 0;
				default:
					return false;
			}
		}
	});
var $folkertdev$elm_flate$Inflate$BitSet$remove = F2(
	function (n, input) {
		var b1 = input.a;
		var b2 = input.b;
		var b3 = input.c;
		var b4 = input.d;
		var b5 = input.e;
		var b6 = input.f;
		var b7 = input.g;
		var b8 = input.h;
		var b9 = input.i;
		var b10 = input.j;
		if (n >= 320) {
			return input;
		} else {
			var bit = ~(1 << (n % 32));
			var _v0 = (n / 32) | 0;
			switch (_v0) {
				case 0:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(bit & b1)(b2)(b3)(b4)(b5)(b6)(b7)(b8)(b9)(b10);
				case 1:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(bit & b2)(b3)(b4)(b5)(b6)(b7)(b8)(b9)(b10);
				case 2:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(bit & b3)(b4)(b5)(b6)(b7)(b8)(b9)(b10);
				case 3:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(bit & b4)(b5)(b6)(b7)(b8)(b9)(b10);
				case 4:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(b4)(bit & b5)(b6)(b7)(b8)(b9)(b10);
				case 5:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(b4)(b5)(bit & b6)(b7)(b8)(b9)(b10);
				case 6:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(b4)(b5)(b6)(bit & b7)(b8)(b9)(b10);
				case 7:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(b4)(b5)(b6)(b7)(bit & b8)(b9)(b10);
				case 8:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(b4)(b5)(b6)(b7)(b8)(bit & b9)(b10);
				case 9:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(b4)(b5)(b6)(b7)(b8)(b9)(bit & b10);
				default:
					return input;
			}
		}
	});
var $folkertdev$elm_flate$Inflate$Internal$copySegment = F5(
	function (i, value, bitset, lengths, length) {
		var end = i + length;
		var go = F3(
			function (j, currentBitSet, accum) {
				go:
				while (true) {
					if ((j - end) < 0) {
						if (!(!value)) {
							var $temp$j = j + 1,
								$temp$currentBitSet = A2($folkertdev$elm_flate$Inflate$BitSet$insert, j, currentBitSet),
								$temp$accum = A3($elm$core$Dict$insert, j, value, accum);
							j = $temp$j;
							currentBitSet = $temp$currentBitSet;
							accum = $temp$accum;
							continue go;
						} else {
							if (A2($folkertdev$elm_flate$Inflate$BitSet$member, j, currentBitSet)) {
								var $temp$j = j + 1,
									$temp$currentBitSet = A2($folkertdev$elm_flate$Inflate$BitSet$remove, j, currentBitSet),
									$temp$accum = A2($elm$core$Dict$remove, j, accum);
								j = $temp$j;
								currentBitSet = $temp$currentBitSet;
								accum = $temp$accum;
								continue go;
							} else {
								var $temp$j = j + 1,
									$temp$currentBitSet = currentBitSet,
									$temp$accum = accum;
								j = $temp$j;
								currentBitSet = $temp$currentBitSet;
								accum = $temp$accum;
								continue go;
							}
						}
					} else {
						return _Utils_Tuple2(currentBitSet, accum);
					}
				}
			});
		var _v0 = A3(go, i, bitset, lengths);
		var newBitSet = _v0.a;
		var newLengths = _v0.b;
		return _Utils_Tuple3(i + length, newBitSet, newLengths);
	});
var $folkertdev$elm_flate$Inflate$Internal$decodeSymbolInnerLoop = F5(
	function (table, cur, tag, bitsAvailable, sum) {
		decodeSymbolInnerLoop:
		while (true) {
			var newTag = tag >>> 1;
			if (!table.b) {
				return {l: bitsAvailable, bf: cur, bF: sum, X: tag};
			} else {
				var value = table.a;
				var rest = table.b;
				var newerCur = ((cur << 1) + (tag & 1)) - value;
				var newSum = sum + value;
				if (newerCur >= 0) {
					var $temp$table = rest,
						$temp$cur = newerCur,
						$temp$tag = newTag,
						$temp$bitsAvailable = bitsAvailable - 1,
						$temp$sum = newSum;
					table = $temp$table;
					cur = $temp$cur;
					tag = $temp$tag;
					bitsAvailable = $temp$bitsAvailable;
					sum = $temp$sum;
					continue decodeSymbolInnerLoop;
				} else {
					return {l: bitsAvailable - 1, bf: newerCur, bF: newSum, X: newTag};
				}
			}
		}
	});
var $folkertdev$elm_flate$Inflate$BitReader$moveFromReserve = F2(
	function (nbits, state) {
		var masked = (nbits === 32) ? (state.u << state.l) : ((((1 << nbits) - 1) & state.u) << state.l);
		return {l: state.l + nbits, x: state.x, u: state.u >>> nbits, p: state.p - nbits, X: masked | state.X};
	});
var $folkertdev$elm_flate$Inflate$BitReader$runDecoder = F3(
	function (width, valueDecoder, state) {
		var decoder = A3(
			$elm$bytes$Bytes$Decode$map2,
			$elm$core$Tuple$pair,
			valueDecoder,
			$elm$bytes$Bytes$Decode$bytes(
				$elm$bytes$Bytes$width(state.x) - width));
		var _v0 = A2($elm$bytes$Bytes$Decode$decode, decoder, state.x);
		if (!_v0.$) {
			var value = _v0.a;
			return $elm$core$Result$Ok(value);
		} else {
			return $elm$core$Result$Err('BitReader.runDecoder: Unexpected end of Bytes');
		}
	});
var $folkertdev$elm_flate$Inflate$BitReader$unsignedInt24 = function (endianness) {
	if (!endianness) {
		return A3(
			$elm$bytes$Bytes$Decode$map2,
			F2(
				function (b2, b1) {
					return (b1 << 16) | b2;
				}),
			$elm$bytes$Bytes$Decode$unsignedInt16(endianness),
			$elm$bytes$Bytes$Decode$unsignedInt8);
	} else {
		return A3(
			$elm$bytes$Bytes$Decode$map2,
			F2(
				function (b1, b2) {
					return (b1 << 16) | b2;
				}),
			$elm$bytes$Bytes$Decode$unsignedInt16(endianness),
			$elm$bytes$Bytes$Decode$unsignedInt8);
	}
};
var $folkertdev$elm_flate$Inflate$BitReader$readMoreBits = function (state) {
	readMoreBits:
	while (true) {
		var freeSpaceOnTag = 32 - state.l;
		if ((_Utils_cmp(freeSpaceOnTag, state.p) < 1) && (state.p > 0)) {
			return $elm$core$Result$Ok(
				A2($folkertdev$elm_flate$Inflate$BitReader$moveFromReserve, freeSpaceOnTag, state));
		} else {
			if (!$elm$bytes$Bytes$width(state.x)) {
				return $elm$core$Result$Ok(
					A2($folkertdev$elm_flate$Inflate$BitReader$moveFromReserve, state.p, state));
			} else {
				var state1 = A2($folkertdev$elm_flate$Inflate$BitReader$moveFromReserve, state.p, state);
				var _v0 = function () {
					var _v1 = $elm$bytes$Bytes$width(state.x);
					switch (_v1) {
						case 0:
							return _Utils_Tuple3(
								0,
								0,
								$elm$bytes$Bytes$Decode$succeed(0));
						case 1:
							return _Utils_Tuple3(1, 8, $elm$bytes$Bytes$Decode$unsignedInt8);
						case 2:
							return _Utils_Tuple3(
								2,
								16,
								$elm$bytes$Bytes$Decode$unsignedInt16(0));
						case 3:
							return _Utils_Tuple3(
								3,
								24,
								$folkertdev$elm_flate$Inflate$BitReader$unsignedInt24(0));
						default:
							return _Utils_Tuple3(
								4,
								32,
								$elm$bytes$Bytes$Decode$unsignedInt32(0));
					}
				}();
				var width = _v0.a;
				var additionallyAvailable = _v0.b;
				var decoder = _v0.c;
				var _v2 = A3($folkertdev$elm_flate$Inflate$BitReader$runDecoder, width, decoder, state1);
				if (_v2.$ === 1) {
					var e = _v2.a;
					return $elm$core$Result$Err(e);
				} else {
					var _v3 = _v2.a;
					var newReserve = _v3.a;
					var newBuffer = _v3.b;
					var $temp$state = {l: state1.l, x: newBuffer, u: newReserve, p: additionallyAvailable, X: state1.X};
					state = $temp$state;
					continue readMoreBits;
				}
			}
		}
	}
};
var $folkertdev$elm_flate$Inflate$Internal$decodeSymbol = F2(
	function (table, tree) {
		return function (state) {
			var _v0 = (state.l < 16) ? $folkertdev$elm_flate$Inflate$BitReader$readMoreBits(state) : $elm$core$Result$Ok(state);
			if (_v0.$ === 1) {
				var e = _v0.a;
				return $elm$core$Result$Err(e);
			} else {
				var d = _v0.a;
				var _v1 = A5($folkertdev$elm_flate$Inflate$Internal$decodeSymbolInnerLoop, table, 0, d.X, d.l, 0);
				var cur = _v1.bf;
				var tag = _v1.X;
				var bitsAvailable = _v1.l;
				var sum = _v1.bF;
				var _v2 = A2($elm$core$Array$get, sum + cur, tree.aL);
				if (_v2.$ === 1) {
					return $elm$core$Result$Err('Index into trans tree out of bounds');
				} else {
					var result = _v2.a;
					return $elm$core$Result$Ok(
						_Utils_Tuple2(
							result,
							{l: bitsAvailable, x: d.x, u: d.u, p: d.p, X: tag}));
				}
			}
		};
	});
var $folkertdev$elm_flate$Inflate$BitReader$readBits = F2(
	function (numberOfBits, base) {
		return function (state) {
			if (!numberOfBits) {
				return $elm$core$Result$Ok(
					_Utils_Tuple2(base, state));
			} else {
				var _v0 = (_Utils_cmp(state.l, numberOfBits) < 0) ? $folkertdev$elm_flate$Inflate$BitReader$readMoreBits(state) : $elm$core$Result$Ok(state);
				if (_v0.$ === 1) {
					var e = _v0.a;
					return $elm$core$Result$Err(e);
				} else {
					var d = _v0.a;
					var val = d.X & (65535 >>> (16 - numberOfBits));
					var newTag = d.X >>> numberOfBits;
					return $elm$core$Result$Ok(
						_Utils_Tuple2(
							val + base,
							{l: d.l - numberOfBits, x: d.x, u: d.u, p: d.p, X: newTag}));
				}
			}
		};
	});
var $folkertdev$elm_flate$Inflate$BitReader$succeed = function (x) {
	return function (s) {
		return $elm$core$Result$Ok(
			_Utils_Tuple2(x, s));
	};
};
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $folkertdev$elm_flate$Inflate$Internal$decodeDynamicTreeLength = F4(
	function (codeTree, hlit, hdist, _v0) {
		var i = _v0.a;
		var bitset = _v0.b;
		var lengths = _v0.c;
		if (_Utils_cmp(i, hlit + hdist) < 0) {
			var table = A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				$elm$core$List$tail(codeTree.as));
			return A2(
				$folkertdev$elm_flate$Inflate$BitReader$andThen,
				function (sym) {
					switch (sym) {
						case 16:
							var prev = A2(
								$elm$core$Maybe$withDefault,
								0,
								A2($elm$core$Dict$get, i - 1, lengths));
							return A2(
								$folkertdev$elm_flate$Inflate$BitReader$map,
								A2(
									$elm$core$Basics$composeR,
									A4($folkertdev$elm_flate$Inflate$Internal$copySegment, i, prev, bitset, lengths),
									$elm$bytes$Bytes$Decode$Loop),
								A2($folkertdev$elm_flate$Inflate$BitReader$readBits, 2, 3));
						case 17:
							return A2(
								$folkertdev$elm_flate$Inflate$BitReader$map,
								A2(
									$elm$core$Basics$composeR,
									A4($folkertdev$elm_flate$Inflate$Internal$copySegment, i, 0, bitset, lengths),
									$elm$bytes$Bytes$Decode$Loop),
								A2($folkertdev$elm_flate$Inflate$BitReader$readBits, 3, 3));
						case 18:
							return A2(
								$folkertdev$elm_flate$Inflate$BitReader$map,
								A2(
									$elm$core$Basics$composeR,
									A4($folkertdev$elm_flate$Inflate$Internal$copySegment, i, 0, bitset, lengths),
									$elm$bytes$Bytes$Decode$Loop),
								A2($folkertdev$elm_flate$Inflate$BitReader$readBits, 7, 11));
						case 0:
							return A2($folkertdev$elm_flate$Inflate$BitSet$member, i, bitset) ? $folkertdev$elm_flate$Inflate$BitReader$succeed(
								$elm$bytes$Bytes$Decode$Loop(
									_Utils_Tuple3(
										i + 1,
										bitset,
										A2($elm$core$Dict$remove, i, lengths)))) : $folkertdev$elm_flate$Inflate$BitReader$succeed(
								$elm$bytes$Bytes$Decode$Loop(
									_Utils_Tuple3(i + 1, bitset, lengths)));
						default:
							return $folkertdev$elm_flate$Inflate$BitReader$succeed(
								$elm$bytes$Bytes$Decode$Loop(
									_Utils_Tuple3(
										i + 1,
										A2($folkertdev$elm_flate$Inflate$BitSet$insert, i, bitset),
										A3($elm$core$Dict$insert, i, sym, lengths))));
					}
				},
				A2($folkertdev$elm_flate$Inflate$Internal$decodeSymbol, table, codeTree));
		} else {
			return $folkertdev$elm_flate$Inflate$BitReader$succeed(
				$elm$bytes$Bytes$Decode$Done(lengths));
		}
	});
var $folkertdev$elm_flate$Inflate$BitSet$empty = $folkertdev$elm_flate$Inflate$BitSet$BitSet320(0)(0)(0)(0)(0)(0)(0)(0)(0)(0);
var $folkertdev$elm_flate$Inflate$Internal$decodeTreeLengths = F4(
	function (hlit, hdist, hclen, codeLengths) {
		var clcs = A2($elm$core$List$take, hclen, $folkertdev$elm_flate$Inflate$Internal$clcIndices);
		var initialLengths = function () {
			var go = F3(
				function (xs, ys, accum) {
					go:
					while (true) {
						if (!xs.b) {
							return accum;
						} else {
							var index = xs.a;
							var restIndex = xs.b;
							if (!ys.b) {
								return accum;
							} else {
								var codeLength = ys.a;
								var restCodeLength = ys.b;
								if (!(!codeLength)) {
									var $temp$xs = restIndex,
										$temp$ys = restCodeLength,
										$temp$accum = A3($elm$core$Dict$insert, index, codeLength, accum);
									xs = $temp$xs;
									ys = $temp$ys;
									accum = $temp$accum;
									continue go;
								} else {
									var $temp$xs = restIndex,
										$temp$ys = restCodeLength,
										$temp$accum = accum;
									xs = $temp$xs;
									ys = $temp$ys;
									accum = $temp$accum;
									continue go;
								}
							}
						}
					}
				});
			return A3(go, clcs, codeLengths, $elm$core$Dict$empty);
		}();
		var codeTree = A3($folkertdev$elm_flate$Inflate$Internal$buildTree, initialLengths, 0, 19);
		var initialBitSet = A3(
			$elm$core$Dict$foldl,
			F2(
				function (i, _v0) {
					return $folkertdev$elm_flate$Inflate$BitSet$insert(i);
				}),
			$folkertdev$elm_flate$Inflate$BitSet$empty,
			initialLengths);
		return A2(
			$folkertdev$elm_flate$Inflate$BitReader$loop,
			_Utils_Tuple3(0, initialBitSet, initialLengths),
			A3($folkertdev$elm_flate$Inflate$Internal$decodeDynamicTreeLength, codeTree, hlit, hdist));
	});
var $folkertdev$elm_flate$Inflate$BitReader$exactly = F2(
	function (tableCount, decoder) {
		var helper = function (_v0) {
			var n = _v0.a;
			var xs = _v0.b;
			return (n <= 0) ? $folkertdev$elm_flate$Inflate$BitReader$succeed(
				$elm$bytes$Bytes$Decode$Done(
					$elm$core$List$reverse(xs))) : A2(
				$folkertdev$elm_flate$Inflate$BitReader$map,
				function (x) {
					return $elm$bytes$Bytes$Decode$Loop(
						_Utils_Tuple2(
							n - 1,
							A2($elm$core$List$cons, x, xs)));
				},
				decoder);
		};
		return A2(
			$folkertdev$elm_flate$Inflate$BitReader$loop,
			_Utils_Tuple2(tableCount, _List_Nil),
			helper);
	});
var $folkertdev$elm_flate$Inflate$Internal$cont = F3(
	function (hlit, hdist, hclen) {
		var buildTrees = function (lengths) {
			return _Utils_Tuple2(
				A3($folkertdev$elm_flate$Inflate$Internal$buildTree, lengths, 0, hlit),
				A3($folkertdev$elm_flate$Inflate$Internal$buildTree, lengths, hlit, hdist));
		};
		return A2(
			$folkertdev$elm_flate$Inflate$BitReader$map,
			buildTrees,
			A2(
				$folkertdev$elm_flate$Inflate$BitReader$andThen,
				A3($folkertdev$elm_flate$Inflate$Internal$decodeTreeLengths, hlit, hdist, hclen),
				A2(
					$folkertdev$elm_flate$Inflate$BitReader$exactly,
					hclen,
					A2($folkertdev$elm_flate$Inflate$BitReader$readBits, 3, 0))));
	});
var $folkertdev$elm_flate$Inflate$BitReader$map2 = F3(
	function (f, _v0, _v1) {
		var fa = _v0;
		var fb = _v1;
		return function (state) {
			var _v2 = fa(state);
			if (_v2.$ === 1) {
				var e = _v2.a;
				return $elm$core$Result$Err(e);
			} else {
				var _v3 = _v2.a;
				var a = _v3.a;
				var newState = _v3.b;
				var _v4 = fb(newState);
				if (_v4.$ === 1) {
					var e = _v4.a;
					return $elm$core$Result$Err(e);
				} else {
					var _v5 = _v4.a;
					var b = _v5.a;
					var newerState = _v5.b;
					return $elm$core$Result$Ok(
						_Utils_Tuple2(
							A2(f, a, b),
							newerState));
				}
			}
		};
	});
var $folkertdev$elm_flate$Inflate$BitReader$andMap = F2(
	function (a, f) {
		return A3($folkertdev$elm_flate$Inflate$BitReader$map2, $elm$core$Basics$apL, f, a);
	});
var $folkertdev$elm_flate$Inflate$BitReader$map3 = F4(
	function (f, a, b, c) {
		return A2(
			$folkertdev$elm_flate$Inflate$BitReader$andMap,
			c,
			A2(
				$folkertdev$elm_flate$Inflate$BitReader$andMap,
				b,
				A2(
					$folkertdev$elm_flate$Inflate$BitReader$andMap,
					a,
					$folkertdev$elm_flate$Inflate$BitReader$succeed(f))));
	});
var $folkertdev$elm_flate$Inflate$Internal$decodeTrees = A2(
	$folkertdev$elm_flate$Inflate$BitReader$andThen,
	$elm$core$Basics$identity,
	A4(
		$folkertdev$elm_flate$Inflate$BitReader$map3,
		$folkertdev$elm_flate$Inflate$Internal$cont,
		A2($folkertdev$elm_flate$Inflate$BitReader$readBits, 5, 257),
		A2($folkertdev$elm_flate$Inflate$BitReader$readBits, 5, 1),
		A2($folkertdev$elm_flate$Inflate$BitReader$readBits, 4, 4)));
var $folkertdev$elm_flate$Inflate$BitReader$error = function (e) {
	return function (s) {
		return $elm$core$Result$Err(e);
	};
};
var $folkertdev$elm_flate$Inflate$BitReader$getBit = A2($folkertdev$elm_flate$Inflate$BitReader$readBits, 1, 0);
var $folkertdev$elm_flate$Experimental$ByteArray$copyToBackInternal = F5(
	function (startIndex, size, array, finalSize, finalBytes) {
		copyToBackInternal:
		while (true) {
			var offset = startIndex % 4;
			var internalIndex = (startIndex / 4) | 0;
			if (size <= 0) {
				return A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, array, finalSize, finalBytes);
			} else {
				if (_Utils_cmp(
					startIndex + 4,
					(($elm$core$Array$length(array) - 1) * 4) + finalSize) > -1) {
					var _v0 = A2(
						$folkertdev$elm_flate$Experimental$ByteArray$get,
						startIndex,
						A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, array, finalSize, finalBytes));
					if (_v0.$ === 1) {
						return A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, array, finalSize, finalBytes);
					} else {
						var value = _v0.a;
						var _v1 = A2(
							$folkertdev$elm_flate$Experimental$ByteArray$push,
							value,
							A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, array, finalSize, finalBytes));
						var newArray = _v1.a;
						var newFinalSize = _v1.b;
						var newFinalBytes = _v1.c;
						var $temp$startIndex = startIndex + 1,
							$temp$size = size - 1,
							$temp$array = newArray,
							$temp$finalSize = newFinalSize,
							$temp$finalBytes = newFinalBytes;
						startIndex = $temp$startIndex;
						size = $temp$size;
						array = $temp$array;
						finalSize = $temp$finalSize;
						finalBytes = $temp$finalBytes;
						continue copyToBackInternal;
					}
				} else {
					var _v2 = A2($elm$core$Array$get, internalIndex, array);
					if (_v2.$ === 1) {
						return A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, array, finalSize, finalBytes);
					} else {
						var value = _v2.a;
						var written = A2($elm$core$Basics$min, 4 - offset, size);
						var maskedFront = value << (8 * offset);
						var maskedBack = function () {
							if (_Utils_cmp(4 - offset, size) > 0) {
								var bytesWeNeedToRemove = 4 - size;
								var bytesWeHave = (3 - offset) + 1;
								return maskedFront >> (bytesWeNeedToRemove * 8);
							} else {
								return maskedFront >> (offset * 8);
							}
						}();
						var _v3 = A3(
							$folkertdev$elm_flate$Experimental$ByteArray$pushMany,
							written,
							maskedBack,
							A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, array, finalSize, finalBytes));
						var x = _v3.a;
						var y = _v3.b;
						var z = _v3.c;
						var $temp$startIndex = startIndex + written,
							$temp$size = size - written,
							$temp$array = x,
							$temp$finalSize = y,
							$temp$finalBytes = z;
						startIndex = $temp$startIndex;
						size = $temp$size;
						array = $temp$array;
						finalSize = $temp$finalSize;
						finalBytes = $temp$finalBytes;
						continue copyToBackInternal;
					}
				}
			}
		}
	});
var $folkertdev$elm_flate$Experimental$ByteArray$copyToBack = F3(
	function (startIndex, size, _v0) {
		var array = _v0.a;
		var finalSize = _v0.b;
		var finalBytes = _v0.c;
		return A5($folkertdev$elm_flate$Experimental$ByteArray$copyToBackInternal, startIndex, size, array, finalSize, finalBytes);
	});
var $folkertdev$elm_flate$Inflate$Internal$HuffmanTable = $elm$core$Basics$identity;
var $folkertdev$elm_flate$Inflate$Internal$buildBitsBase = F2(
	function (delta, first) {
		var initializer = function (i) {
			return (_Utils_cmp(i, delta) < 0) ? 0 : (((i - delta) / delta) | 0);
		};
		var folder = F2(
			function (bit, _v0) {
				var sum = _v0.a;
				var accum = _v0.b;
				return _Utils_Tuple2(
					sum + (1 << bit),
					A2(
						$elm$core$Array$push,
						{bc: sum, a: bit},
						accum));
			});
		var bits = A2($elm$core$Array$initialize, 30, initializer);
		var base = A3(
			$elm$core$Array$foldl,
			folder,
			_Utils_Tuple2(first, $elm$core$Array$empty),
			bits).b;
		return base;
	});
var $folkertdev$elm_flate$Inflate$Internal$hardcodedDistanceTable = A2($folkertdev$elm_flate$Inflate$Internal$buildBitsBase, 2, 1);
var $folkertdev$elm_flate$Inflate$Internal$hardcodedLengthTable = function (_v0) {
	var array = _v0;
	return A3(
		$elm$core$Array$set,
		28,
		{bc: 258, a: 0},
		array);
}(
	A2($folkertdev$elm_flate$Inflate$Internal$buildBitsBase, 4, 3));
var $folkertdev$elm_flate$Inflate$Internal$readHuffmanTable = F2(
	function (index, _v0) {
		var table = _v0;
		return A2($elm$core$Array$get, index, table);
	});
var $folkertdev$elm_flate$Inflate$Internal$decodeLength = function (symbol) {
	var _v0 = A2($folkertdev$elm_flate$Inflate$Internal$readHuffmanTable, symbol - 257, $folkertdev$elm_flate$Inflate$Internal$hardcodedLengthTable);
	if (_v0.$ === 1) {
		return $folkertdev$elm_flate$Inflate$BitReader$error(
			function () {
				var _v1 = $folkertdev$elm_flate$Inflate$Internal$hardcodedDistanceTable;
				var internal = _v1;
				return 'index out of bounds in hardcodedLengthTable: requested index ' + ($elm$core$String$fromInt(symbol - 257) + ('but hardcodedLengthTable has length ' + $elm$core$String$fromInt(
					$elm$core$Array$length(internal))));
			}());
	} else {
		var entry = _v0.a;
		return A2($folkertdev$elm_flate$Inflate$BitReader$readBits, entry.a, entry.bc);
	}
};
var $folkertdev$elm_flate$Inflate$Internal$decodeOffset = F2(
	function (outputLength, dt) {
		var table_ = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			$elm$core$List$tail(dt.as));
		return A2(
			$folkertdev$elm_flate$Inflate$BitReader$andThen,
			function (distance) {
				var _v0 = A2($folkertdev$elm_flate$Inflate$Internal$readHuffmanTable, distance, $folkertdev$elm_flate$Inflate$Internal$hardcodedDistanceTable);
				if (_v0.$ === 1) {
					return $folkertdev$elm_flate$Inflate$BitReader$error(
						function () {
							var _v1 = $folkertdev$elm_flate$Inflate$Internal$hardcodedDistanceTable;
							var internal = _v1;
							return 'index out of bounds in hardcodedDistanceTable: requested index ' + ($elm$core$String$fromInt(distance) + ('but hardcodedLengthTable has length ' + $elm$core$String$fromInt(
								$elm$core$Array$length(internal))));
						}());
				} else {
					var entry = _v0.a;
					return A2(
						$folkertdev$elm_flate$Inflate$BitReader$map,
						function (v) {
							return outputLength - v;
						},
						A2($folkertdev$elm_flate$Inflate$BitReader$readBits, entry.a, entry.bc));
				}
			},
			A2($folkertdev$elm_flate$Inflate$Internal$decodeSymbol, table_, dt));
	});
var $folkertdev$elm_flate$Inflate$Internal$inflateBlockDataHelp = F2(
	function (trees, _v0) {
		var outputLength = _v0.a;
		var output = _v0.b;
		var table = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			$elm$core$List$tail(trees.am.as));
		return A2(
			$folkertdev$elm_flate$Inflate$BitReader$andThen,
			function (symbol) {
				return (symbol === 256) ? $folkertdev$elm_flate$Inflate$BitReader$succeed(
					$elm$bytes$Bytes$Decode$Done(output)) : ((symbol < 256) ? $folkertdev$elm_flate$Inflate$BitReader$succeed(
					$elm$bytes$Bytes$Decode$Loop(
						_Utils_Tuple2(
							outputLength + 1,
							A2($folkertdev$elm_flate$Experimental$ByteArray$push, symbol, output)))) : A3(
					$folkertdev$elm_flate$Inflate$BitReader$map2,
					F2(
						function (length, offset) {
							return $elm$bytes$Bytes$Decode$Loop(
								_Utils_Tuple2(
									outputLength + length,
									A3($folkertdev$elm_flate$Experimental$ByteArray$copyToBack, offset, length, output)));
						}),
					$folkertdev$elm_flate$Inflate$Internal$decodeLength(symbol),
					A2($folkertdev$elm_flate$Inflate$Internal$decodeOffset, outputLength, trees.aj)));
			},
			A2($folkertdev$elm_flate$Inflate$Internal$decodeSymbol, table, trees.am));
	});
var $folkertdev$elm_flate$Inflate$Internal$inflateBlockData = F3(
	function (trees, outputLength, output) {
		return A2(
			$folkertdev$elm_flate$Inflate$BitReader$loop,
			_Utils_Tuple2(outputLength, output),
			$folkertdev$elm_flate$Inflate$Internal$inflateBlockDataHelp(trees));
	});
var $folkertdev$elm_flate$Inflate$BitReader$flushHelp = function (state0) {
	var availableSpace = 32 - state0.l;
	var state = A2(
		$folkertdev$elm_flate$Inflate$BitReader$moveFromReserve,
		A2($elm$core$Basics$min, availableSpace, state0.p),
		state0);
	var reserveEncoder = (state.p > 24) ? _List_fromArray(
		[
			A2($elm$bytes$Bytes$Encode$unsignedInt32, 0, state.u)
		]) : ((state.p > 16) ? _List_fromArray(
		[
			A2($elm$bytes$Bytes$Encode$unsignedInt16, 0, state.u),
			$elm$bytes$Bytes$Encode$unsignedInt8(state.u >> 16)
		]) : ((state.p > 8) ? _List_fromArray(
		[
			A2($elm$bytes$Bytes$Encode$unsignedInt16, 0, state.u)
		]) : ((state.p > 1) ? _List_fromArray(
		[
			$elm$bytes$Bytes$Encode$unsignedInt8(state.u)
		]) : _List_Nil)));
	var tagEncoder = (state.l > 24) ? _List_fromArray(
		[
			A2($elm$bytes$Bytes$Encode$unsignedInt32, 0, state.X)
		]) : ((state.l > 16) ? _List_fromArray(
		[
			A2($elm$bytes$Bytes$Encode$unsignedInt16, 0, state.X),
			$elm$bytes$Bytes$Encode$unsignedInt8(state.X >> 16)
		]) : ((state.l > 8) ? _List_fromArray(
		[
			A2($elm$bytes$Bytes$Encode$unsignedInt16, 0, state.X)
		]) : ((state.l > 1) ? _List_fromArray(
		[
			$elm$bytes$Bytes$Encode$unsignedInt8(state.X)
		]) : _List_Nil)));
	return $elm$bytes$Bytes$Encode$encode(
		$elm$bytes$Bytes$Encode$sequence(
			_Utils_ap(
				tagEncoder,
				_Utils_ap(
					reserveEncoder,
					_List_fromArray(
						[
							$elm$bytes$Bytes$Encode$bytes(state.x)
						])))));
};
var $folkertdev$elm_flate$Inflate$BitReader$flush = function (state) {
	return {
		l: 0,
		x: $folkertdev$elm_flate$Inflate$BitReader$flushHelp(state),
		u: 0,
		p: 0,
		X: 0
	};
};
var $elm$bytes$Bytes$Decode$fail = _Bytes_decodeFailure;
var $folkertdev$elm_flate$Inflate$Internal$uncompressedBlockDecoder = function (bufferWidth) {
	var decodeLengths = A3(
		$elm$bytes$Bytes$Decode$map2,
		$elm$core$Tuple$pair,
		$elm$bytes$Bytes$Decode$unsignedInt16(0),
		$elm$bytes$Bytes$Decode$unsignedInt16(0));
	return A2(
		$elm$bytes$Bytes$Decode$andThen,
		function (_v0) {
			var length = _v0.a;
			var invlength = _v0.b;
			if (!_Utils_eq(length, (~invlength) & 65535)) {
				return $elm$bytes$Bytes$Decode$fail;
			} else {
				var remainingSize = (bufferWidth - 4) - length;
				return A3(
					$elm$bytes$Bytes$Decode$map2,
					$elm$core$Tuple$pair,
					$elm$bytes$Bytes$Decode$bytes(length),
					$elm$bytes$Bytes$Decode$bytes(remainingSize));
			}
		},
		decodeLengths);
};
var $folkertdev$elm_flate$Inflate$Internal$inflateUncompressedBlock = function (state_) {
	var state = $folkertdev$elm_flate$Inflate$BitReader$flush(state_);
	var _v0 = A2(
		$elm$bytes$Bytes$Decode$decode,
		$folkertdev$elm_flate$Inflate$Internal$uncompressedBlockDecoder(
			$elm$bytes$Bytes$width(state.x)),
		state.x);
	if (_v0.$ === 1) {
		return $elm$core$Result$Err('inflateUncompressedBlock: ran out of bounds');
	} else {
		var _v1 = _v0.a;
		var block = _v1.a;
		var newBuffer = _v1.b;
		return $elm$core$Result$Ok(
			_Utils_Tuple2(
				block,
				_Utils_update(
					state,
					{x: newBuffer})));
	}
};
var $folkertdev$elm_flate$Inflate$Internal$sdtree = {
	as: _List_fromArray(
		[0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
	aL: A2(
		$elm$core$Array$append,
		$elm$core$Array$fromList(
			_List_fromArray(
				[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])),
		A2($elm$core$Array$repeat, 288 - 32, 0))
};
var $folkertdev$elm_flate$Inflate$Internal$sltree = {
	as: _List_fromArray(
		[0, 0, 0, 0, 0, 0, 0, 24, 152, 112, 0, 0, 0, 0, 0, 0]),
	aL: $elm$core$Array$fromList(
		_List_fromArray(
			[256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 280, 281, 282, 283, 284, 285, 286, 287, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255]))
};
var $folkertdev$elm_flate$Inflate$Internal$uncompressHelp = function (output) {
	var uncompressBlock = function (btype) {
		switch (btype) {
			case 0:
				return A2(
					$folkertdev$elm_flate$Inflate$BitReader$map,
					function (bytes) {
						return A2($folkertdev$elm_flate$Experimental$ByteArray$appendBytes, bytes, output);
					},
					A2(
						$folkertdev$elm_flate$Inflate$BitReader$andThen,
						function (_v1) {
							return $folkertdev$elm_flate$Inflate$Internal$inflateUncompressedBlock;
						},
						A2($folkertdev$elm_flate$Inflate$BitReader$exactly, 5, $folkertdev$elm_flate$Inflate$BitReader$getBit)));
			case 1:
				return A3(
					$folkertdev$elm_flate$Inflate$Internal$inflateBlockData,
					{aj: $folkertdev$elm_flate$Inflate$Internal$sdtree, am: $folkertdev$elm_flate$Inflate$Internal$sltree},
					$folkertdev$elm_flate$Experimental$ByteArray$length(output),
					output);
			case 2:
				return A2(
					$folkertdev$elm_flate$Inflate$BitReader$andThen,
					function (_v2) {
						var ltree = _v2.a;
						var dtree = _v2.b;
						return A3(
							$folkertdev$elm_flate$Inflate$Internal$inflateBlockData,
							{aj: dtree, am: ltree},
							$folkertdev$elm_flate$Experimental$ByteArray$length(output),
							output);
					},
					$folkertdev$elm_flate$Inflate$Internal$decodeTrees);
			default:
				return $folkertdev$elm_flate$Inflate$BitReader$error(
					'invalid block type: ' + ($elm$core$String$fromInt(btype) + ' (only 0, 1 and 2 are valid block types)'));
		}
	};
	var readTwoBits = A3(
		$folkertdev$elm_flate$Inflate$BitReader$map2,
		F2(
			function (b1, b2) {
				return b1 + (2 * b2);
			}),
		$folkertdev$elm_flate$Inflate$BitReader$getBit,
		$folkertdev$elm_flate$Inflate$BitReader$getBit);
	var go = F2(
		function (isFinal, blockType) {
			return (!(!isFinal)) ? A2(
				$folkertdev$elm_flate$Inflate$BitReader$map,
				$elm$bytes$Bytes$Decode$Done,
				uncompressBlock(blockType)) : A2(
				$folkertdev$elm_flate$Inflate$BitReader$map,
				$elm$bytes$Bytes$Decode$Loop,
				uncompressBlock(blockType));
		});
	return A2(
		$folkertdev$elm_flate$Inflate$BitReader$andThen,
		$elm$core$Basics$identity,
		A3($folkertdev$elm_flate$Inflate$BitReader$map2, go, $folkertdev$elm_flate$Inflate$BitReader$getBit, readTwoBits));
};
var $folkertdev$elm_flate$Inflate$Internal$uncompress = A2(
	$folkertdev$elm_flate$Inflate$BitReader$map,
	A2($elm$core$Basics$composeR, $folkertdev$elm_flate$Experimental$ByteArray$toBytes, $elm$core$List$singleton),
	A2($folkertdev$elm_flate$Inflate$BitReader$loop, $folkertdev$elm_flate$Experimental$ByteArray$empty, $folkertdev$elm_flate$Inflate$Internal$uncompressHelp));
var $folkertdev$elm_flate$Inflate$Internal$inflate = function (buffer) {
	var _v0 = A2($folkertdev$elm_flate$Inflate$BitReader$decode, buffer, $folkertdev$elm_flate$Inflate$Internal$uncompress);
	if (_v0.$ === 1) {
		var e = _v0.a;
		return $elm$core$Result$Err(e);
	} else {
		var values = _v0.a;
		return $elm$core$Result$Ok(
			$elm$bytes$Bytes$Encode$encode(
				$elm$bytes$Bytes$Encode$sequence(
					A2($elm$core$List$map, $elm$bytes$Bytes$Encode$bytes, values))));
	}
};
var $folkertdev$elm_flate$Inflate$Inflate$inflate = function (buffer) {
	var _v0 = $folkertdev$elm_flate$Inflate$Internal$inflate(buffer);
	if (_v0.$ === 1) {
		return $elm$core$Maybe$Nothing;
	} else {
		var newBuffer = _v0.a;
		return $elm$core$Maybe$Just(newBuffer);
	}
};
var $folkertdev$elm_flate$Flate$inflate = $folkertdev$elm_flate$Inflate$Inflate$inflate;
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {d7: index, eh: match, en: number, eT: submatches};
	});
var $elm$regex$Regex$findAtMost = _Regex_findAtMost;
var $elm_community$string_extra$String$Extra$firstResultHelp = F2(
	function (_default, list) {
		firstResultHelp:
		while (true) {
			if (!list.b) {
				return _default;
			} else {
				if (!list.a.$) {
					var a = list.a.a;
					return a;
				} else {
					var _v1 = list.a;
					var rest = list.b;
					var $temp$default = _default,
						$temp$list = rest;
					_default = $temp$default;
					list = $temp$list;
					continue firstResultHelp;
				}
			}
		}
	});
var $elm_community$string_extra$String$Extra$firstResult = function (list) {
	return A2($elm_community$string_extra$String$Extra$firstResultHelp, '', list);
};
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $elm$regex$Regex$fromString = function (string) {
	return A2(
		$elm$regex$Regex$fromStringWith,
		{dH: false, el: false},
		string);
};
var $elm$regex$Regex$never = _Regex_never;
var $elm_community$string_extra$String$Extra$regexFromString = A2(
	$elm$core$Basics$composeR,
	$elm$regex$Regex$fromString,
	$elm$core$Maybe$withDefault($elm$regex$Regex$never));
var $elm$regex$Regex$replace = _Regex_replaceAtMost(_Regex_infinity);
var $elm_community$string_extra$String$Extra$regexEscape = A2(
	$elm$regex$Regex$replace,
	$elm_community$string_extra$String$Extra$regexFromString('[-/\\^$*+?.()|[\\]{}]'),
	function (_v0) {
		var match = _v0.eh;
		return '\\' + match;
	});
var $elm_community$string_extra$String$Extra$leftOf = F2(
	function (pattern, string) {
		return A2(
			$elm$core$String$join,
			'',
			A2(
				$elm$core$List$map,
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.eT;
					},
					$elm_community$string_extra$String$Extra$firstResult),
				A3(
					$elm$regex$Regex$findAtMost,
					1,
					$elm_community$string_extra$String$Extra$regexFromString(
						'^(.*?)' + $elm_community$string_extra$String$Extra$regexEscape(pattern)),
					string)));
	});
var $elm$core$String$lines = _String_lines;
var $author$project$NameDictWorker$loadFromIndexedDb = _Platform_outgoingPort('loadFromIndexedDb', $elm$json$Json$Encode$string);
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $author$project$NameDictWorker$outbound = _Platform_outgoingPort('outbound', $elm$core$Basics$identity);
var $author$project$Common$NameDictEntry = F5(
	function (key, reading, kind, meaning, abr) {
		return {bJ: abr, ay: key, ch: kind, co: meaning, a0: reading};
	});
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = $elm$core$Basics$identity;
var $elm$parser$Parser$Advanced$backtrackable = function (_v0) {
	var parse = _v0;
	return function (s0) {
		var _v1 = parse(s0);
		if (_v1.$ === 1) {
			var x = _v1.b;
			return A2($elm$parser$Parser$Advanced$Bad, false, x);
		} else {
			var a = _v1.b;
			var s1 = _v1.c;
			return A3($elm$parser$Parser$Advanced$Good, false, a, s1);
		}
	};
};
var $elm$parser$Parser$backtrackable = $elm$parser$Parser$Advanced$backtrackable;
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.b);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.c, offset) < 0,
					0,
					{bT: col, e: s0.e, g: s0.g, c: offset, cS: row, b: s0.b});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return function (s) {
		return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.c, s.cS, s.bT, s);
	};
};
var $elm$parser$Parser$chompWhile = $elm$parser$Parser$Advanced$chompWhile;
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					A2(
						func,
						A3($elm$core$String$slice, s0.c, s1.c, s0.b),
						a),
					s1);
			}
		};
	});
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $elm$parser$Parser$getChompedString = $elm$parser$Parser$Advanced$getChompedString;
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0;
		var parseB = _v1;
		return function (s0) {
			var _v2 = parseA(s0);
			if (_v2.$ === 1) {
				var p = _v2.a;
				var x = _v2.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v2.a;
				var a = _v2.b;
				var s1 = _v2.c;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p1 || p2,
						A2(func, a, b),
						s2);
				}
			}
		};
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$keeper = $elm$parser$Parser$Advanced$keeper;
var $elm$parser$Parser$Advanced$Empty = {$: 0};
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (!_v1.$) {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
	};
};
var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$Good, false, a, s);
	};
};
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $elm$parser$Parser$ExpectingSymbol = function (a) {
	return {$: 8, a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {bT: col, dN: contextStack, cF: problem, cS: row};
	});
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.cS, s.bT, x, s.e));
	});
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.c, s.cS, s.bT, s.b);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return _Utils_eq(newOffset, -1) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
			$elm$parser$Parser$Advanced$Good,
			progress,
			0,
			{bT: newCol, e: s.e, g: s.g, c: newOffset, cS: newRow, b: s.b});
	};
};
var $elm$parser$Parser$Advanced$symbol = $elm$parser$Parser$Advanced$token;
var $elm$parser$Parser$symbol = function (str) {
	return $elm$parser$Parser$Advanced$symbol(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$ExpectingSymbol(str)));
};
var $author$project$NameDictWorker$abrParser = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			$elm$parser$Parser$backtrackable(
			A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed($elm$core$Maybe$Just),
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$getChompedString(
						A2(
							$elm$parser$Parser$ignorer,
							$elm$parser$Parser$succeed(0),
							$elm$parser$Parser$chompWhile(
								function (c) {
									return (c !== '/') && (c !== '\n');
								}))),
					$elm$parser$Parser$symbol('/')))),
			$elm$parser$Parser$succeed($elm$core$Maybe$Nothing)
		]));
var $elm$parser$Parser$Advanced$spaces = $elm$parser$Parser$Advanced$chompWhile(
	function (c) {
		return (c === ' ') || ((c === '\n') || (c === '\r'));
	});
var $elm$parser$Parser$spaces = $elm$parser$Parser$Advanced$spaces;
var $author$project$NameDictWorker$keyParser = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($elm$core$Basics$identity),
		$elm$parser$Parser$spaces),
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$getChompedString(
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(0),
				$elm$parser$Parser$chompWhile(
					function (c) {
						return (c !== ' ') && ((c !== '/') && ((c !== '[') && (c !== ']')));
					}))),
		$elm$parser$Parser$spaces));
var $author$project$Common$Company = 9;
var $author$project$Common$Female = 1;
var $author$project$Common$Fullname = 3;
var $author$project$Common$Given = 4;
var $author$project$Common$Organisation = 7;
var $author$project$Common$Person = 0;
var $author$project$Common$Place = 5;
var $author$project$Common$Product = 8;
var $author$project$Common$Station = 6;
var $author$project$Common$Surname = 2;
var $author$project$Common$Unknown = 10;
var $author$project$Common$stringToKing = function (s) {
	switch (s) {
		case 'o':
			return 7;
		case 'pr':
			return 8;
		case 'c':
			return 9;
		case 'f':
			return 1;
		case 'p':
			return 5;
		case 'st':
			return 6;
		case 'u':
			return 0;
		case 'h':
			return 3;
		case 's':
			return 2;
		case 'g':
			return 4;
		default:
			return 10;
	}
};
var $author$project$NameDictWorker$kindParser = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(
			function (res) {
				return A2(
					$elm$core$List$map,
					$author$project$Common$stringToKing,
					A2($elm$core$String$split, ',', res));
			}),
		$elm$parser$Parser$symbol('(')),
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$getChompedString(
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(0),
				$elm$parser$Parser$chompWhile(
					function (c) {
						return $elm$core$Char$isAlphaNum(c) || (c === ',');
					}))),
		$elm$parser$Parser$symbol(')')));
var $author$project$NameDictWorker$meaningParser = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($elm$core$Basics$identity),
		$elm$parser$Parser$spaces),
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$getChompedString(
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(0),
				$elm$parser$Parser$chompWhile(
					function (c) {
						return (c !== '/') && (c !== '\n');
					}))),
		$elm$parser$Parser$spaces));
var $author$project$NameDictWorker$readingParser = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			$elm$parser$Parser$backtrackable(
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed($elm$core$Maybe$Just),
						$elm$parser$Parser$symbol('[')),
					$elm$parser$Parser$spaces),
				A2(
					$elm$parser$Parser$ignorer,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$getChompedString(
							A2(
								$elm$parser$Parser$ignorer,
								$elm$parser$Parser$succeed(0),
								$elm$parser$Parser$chompWhile(
									function (c) {
										return c !== ']';
									}))),
						$elm$parser$Parser$symbol(']')),
					$elm$parser$Parser$spaces))),
			$elm$parser$Parser$succeed($elm$core$Maybe$Nothing)
		]));
var $author$project$NameDictWorker$entryParser = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					$elm$parser$Parser$succeed($author$project$Common$NameDictEntry),
					$author$project$NameDictWorker$keyParser),
				A2(
					$elm$parser$Parser$ignorer,
					$author$project$NameDictWorker$readingParser,
					$elm$parser$Parser$symbol('/'))),
			$author$project$NameDictWorker$kindParser),
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$NameDictWorker$meaningParser,
			$elm$parser$Parser$symbol('/'))),
	$author$project$NameDictWorker$abrParser);
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {bT: col, cF: problem, cS: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.cS, p.bT, p.cF);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 0:
					return list;
				case 1:
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0;
		var _v1 = parse(
			{bT: 1, e: _List_Nil, g: 1, c: 0, cS: 1, b: src});
		if (!_v1.$) {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $elm$parser$Parser$run = F2(
	function (parser, source) {
		var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
		if (!_v0.$) {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $author$project$NameDictWorker$parseNameDictEntry = function (e) {
	return A2($elm$parser$Parser$run, $author$project$NameDictWorker$entryParser, e);
};
var $elm$core$Set$remove = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$remove, key, dict);
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm_community$string_extra$String$Extra$rightOfBack = F2(
	function (pattern, string) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$elm$core$Maybe$map,
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Basics$add(
						$elm$core$String$length(pattern)),
					function (a) {
						return A2($elm$core$String$dropLeft, a, string);
					}),
				$elm$core$List$head(
					$elm$core$List$reverse(
						A2($elm$core$String$indexes, pattern, string)))));
	});
var $elm$core$Basics$round = _Basics_round;
var $author$project$NameDictWorker$saveToIndexedDb = _Platform_outgoingPort('saveToIndexedDb', $elm$core$Basics$identity);
var $rluiten$stringdistance$StringDistance$maxl = F2(
	function (xs, ys) {
		return (_Utils_cmp(
			$elm$core$List$length(xs),
			$elm$core$List$length(ys)) > 0) ? xs : ys;
	});
var $rluiten$stringdistance$StringDistance$lcsLimit_ = F4(
	function (offset, maxLookAhead, xs_, ys_) {
		if (_Utils_cmp(offset, maxLookAhead) > 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(xs_, ys_);
			if (_v0.a.b && _v0.b.b) {
				var _v1 = _v0.a;
				var x = _v1.a;
				var xs = _v1.b;
				var _v2 = _v0.b;
				var y = _v2.a;
				var ys = _v2.b;
				return _Utils_eq(x, y) ? A2(
					$elm$core$List$cons,
					x,
					A4($rluiten$stringdistance$StringDistance$lcsLimit_, 0, maxLookAhead, xs, ys)) : A2(
					$rluiten$stringdistance$StringDistance$maxl,
					A4($rluiten$stringdistance$StringDistance$lcsLimit_, offset + 1, maxLookAhead, xs_, ys),
					A4($rluiten$stringdistance$StringDistance$lcsLimit_, offset + 1, maxLookAhead, xs, ys_));
			} else {
				return _List_Nil;
			}
		}
	});
var $rluiten$stringdistance$StringDistance$lcsLimit = $rluiten$stringdistance$StringDistance$lcsLimit_(0);
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $rluiten$stringdistance$StringDistance$sift3Distance = F2(
	function (s1, s2) {
		var s2Len = $elm$core$String$length(s2);
		var s1Len = $elm$core$String$length(s1);
		var lcs_ = $rluiten$stringdistance$StringDistance$lcsLimit(5);
		if (!s1Len) {
			return s2Len;
		} else {
			if (!s2Len) {
				return s1Len;
			} else {
				var common = A2(
					lcs_,
					$elm$core$String$toList(s1),
					$elm$core$String$toList(s2));
				return ((s1Len + s2Len) / 2) - $elm$core$List$length(common);
			}
		}
	});
var $elm$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			if (dict.$ === -2) {
				return n;
			} else {
				var left = dict.d;
				var right = dict.e;
				var $temp$n = A2($elm$core$Dict$sizeHelp, n + 1, right),
					$temp$dict = left;
				n = $temp$n;
				dict = $temp$dict;
				continue sizeHelp;
			}
		}
	});
var $elm$core$Dict$size = function (dict) {
	return A2($elm$core$Dict$sizeHelp, 0, dict);
};
var $elm$core$Set$size = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$size(dict);
};
var $elm$core$List$sortBy = _List_sortBy;
var $elm$bytes$Bytes$Encode$Utf8 = F2(
	function (a, b) {
		return {$: 9, a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$string = function (str) {
	return A2(
		$elm$bytes$Bytes$Encode$Utf8,
		_Bytes_getStringWidth(str),
		str);
};
var $danfishgold$base64_bytes$Encode$isValidChar = function (c) {
	if ($elm$core$Char$isAlphaNum(c)) {
		return true;
	} else {
		switch (c) {
			case '+':
				return true;
			case '/':
				return true;
			default:
				return false;
		}
	}
};
var $danfishgold$base64_bytes$Encode$unsafeConvertChar = function (_char) {
	var key = $elm$core$Char$toCode(_char);
	if ((key >= 65) && (key <= 90)) {
		return key - 65;
	} else {
		if ((key >= 97) && (key <= 122)) {
			return (key - 97) + 26;
		} else {
			if ((key >= 48) && (key <= 57)) {
				return ((key - 48) + 26) + 26;
			} else {
				switch (_char) {
					case '+':
						return 62;
					case '/':
						return 63;
					default:
						return -1;
				}
			}
		}
	}
};
var $danfishgold$base64_bytes$Encode$encodeCharacters = F4(
	function (a, b, c, d) {
		if ($danfishgold$base64_bytes$Encode$isValidChar(a) && $danfishgold$base64_bytes$Encode$isValidChar(b)) {
			var n2 = $danfishgold$base64_bytes$Encode$unsafeConvertChar(b);
			var n1 = $danfishgold$base64_bytes$Encode$unsafeConvertChar(a);
			if ('=' === d) {
				if ('=' === c) {
					var n = (n1 << 18) | (n2 << 12);
					var b1 = n >> 16;
					return $elm$core$Maybe$Just(
						$elm$bytes$Bytes$Encode$unsignedInt8(b1));
				} else {
					if ($danfishgold$base64_bytes$Encode$isValidChar(c)) {
						var n3 = $danfishgold$base64_bytes$Encode$unsafeConvertChar(c);
						var n = ((n1 << 18) | (n2 << 12)) | (n3 << 6);
						var combined = n >> 8;
						return $elm$core$Maybe$Just(
							A2($elm$bytes$Bytes$Encode$unsignedInt16, 1, combined));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}
			} else {
				if ($danfishgold$base64_bytes$Encode$isValidChar(c) && $danfishgold$base64_bytes$Encode$isValidChar(d)) {
					var n4 = $danfishgold$base64_bytes$Encode$unsafeConvertChar(d);
					var n3 = $danfishgold$base64_bytes$Encode$unsafeConvertChar(c);
					var n = ((n1 << 18) | (n2 << 12)) | ((n3 << 6) | n4);
					var combined = n >> 8;
					var b3 = n;
					return $elm$core$Maybe$Just(
						$elm$bytes$Bytes$Encode$sequence(
							_List_fromArray(
								[
									A2($elm$bytes$Bytes$Encode$unsignedInt16, 1, combined),
									$elm$bytes$Bytes$Encode$unsignedInt8(b3)
								])));
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $danfishgold$base64_bytes$Encode$encodeChunks = F2(
	function (input, accum) {
		encodeChunks:
		while (true) {
			var _v0 = $elm$core$String$toList(
				A2($elm$core$String$left, 4, input));
			_v0$4:
			while (true) {
				if (!_v0.b) {
					return $elm$core$Maybe$Just(accum);
				} else {
					if (_v0.b.b) {
						if (_v0.b.b.b) {
							if (_v0.b.b.b.b) {
								if (!_v0.b.b.b.b.b) {
									var a = _v0.a;
									var _v1 = _v0.b;
									var b = _v1.a;
									var _v2 = _v1.b;
									var c = _v2.a;
									var _v3 = _v2.b;
									var d = _v3.a;
									var _v4 = A4($danfishgold$base64_bytes$Encode$encodeCharacters, a, b, c, d);
									if (!_v4.$) {
										var enc = _v4.a;
										var $temp$input = A2($elm$core$String$dropLeft, 4, input),
											$temp$accum = A2($elm$core$List$cons, enc, accum);
										input = $temp$input;
										accum = $temp$accum;
										continue encodeChunks;
									} else {
										return $elm$core$Maybe$Nothing;
									}
								} else {
									break _v0$4;
								}
							} else {
								var a = _v0.a;
								var _v5 = _v0.b;
								var b = _v5.a;
								var _v6 = _v5.b;
								var c = _v6.a;
								var _v7 = A4($danfishgold$base64_bytes$Encode$encodeCharacters, a, b, c, '=');
								if (_v7.$ === 1) {
									return $elm$core$Maybe$Nothing;
								} else {
									var enc = _v7.a;
									return $elm$core$Maybe$Just(
										A2($elm$core$List$cons, enc, accum));
								}
							}
						} else {
							var a = _v0.a;
							var _v8 = _v0.b;
							var b = _v8.a;
							var _v9 = A4($danfishgold$base64_bytes$Encode$encodeCharacters, a, b, '=', '=');
							if (_v9.$ === 1) {
								return $elm$core$Maybe$Nothing;
							} else {
								var enc = _v9.a;
								return $elm$core$Maybe$Just(
									A2($elm$core$List$cons, enc, accum));
							}
						}
					} else {
						break _v0$4;
					}
				}
			}
			return $elm$core$Maybe$Nothing;
		}
	});
var $danfishgold$base64_bytes$Encode$encoder = function (string) {
	return A2(
		$elm$core$Maybe$map,
		A2($elm$core$Basics$composeR, $elm$core$List$reverse, $elm$bytes$Bytes$Encode$sequence),
		A2($danfishgold$base64_bytes$Encode$encodeChunks, string, _List_Nil));
};
var $danfishgold$base64_bytes$Encode$toBytes = function (string) {
	return A2(
		$elm$core$Maybe$map,
		$elm$bytes$Bytes$Encode$encode,
		$danfishgold$base64_bytes$Encode$encoder(string));
};
var $danfishgold$base64_bytes$Base64$toBytes = $danfishgold$base64_bytes$Encode$toBytes;
var $elm$core$String$toLower = _String_toLower;
var $elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$member, key, dict);
	});
var $elm_community$list_extra$List$Extra$uniqueHelp = F4(
	function (f, existing, remaining, accumulator) {
		uniqueHelp:
		while (true) {
			if (!remaining.b) {
				return $elm$core$List$reverse(accumulator);
			} else {
				var first = remaining.a;
				var rest = remaining.b;
				var computedFirst = f(first);
				if (A2($elm$core$Set$member, computedFirst, existing)) {
					var $temp$f = f,
						$temp$existing = existing,
						$temp$remaining = rest,
						$temp$accumulator = accumulator;
					f = $temp$f;
					existing = $temp$existing;
					remaining = $temp$remaining;
					accumulator = $temp$accumulator;
					continue uniqueHelp;
				} else {
					var $temp$f = f,
						$temp$existing = A2($elm$core$Set$insert, computedFirst, existing),
						$temp$remaining = rest,
						$temp$accumulator = A2($elm$core$List$cons, first, accumulator);
					f = $temp$f;
					existing = $temp$existing;
					remaining = $temp$remaining;
					accumulator = $temp$accumulator;
					continue uniqueHelp;
				}
			}
		}
	});
var $elm_community$list_extra$List$Extra$unique = function (list) {
	return A4($elm_community$list_extra$List$Extra$uniqueHelp, $elm$core$Basics$identity, $elm$core$Set$empty, list, _List_Nil);
};
var $elm$core$String$words = _String_words;
var $miniBill$elm_codec$Codec$buildObject = function (_v0) {
	var om = _v0;
	return {
		f: om.f,
		h: function (v) {
			return $elm$json$Json$Encode$object(
				om.h(v));
		}
	};
};
var $miniBill$elm_codec$Codec$ObjectCodec = $elm$core$Basics$identity;
var $miniBill$elm_codec$Codec$field = F4(
	function (name, getter, codec, _v0) {
		var ocodec = _v0;
		return {
			f: A3(
				$elm$json$Json$Decode$map2,
				F2(
					function (f, x) {
						return f(x);
					}),
				ocodec.f,
				A2(
					$elm$json$Json$Decode$field,
					name,
					$miniBill$elm_codec$Codec$decoder(codec))),
			h: function (v) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(
						name,
						A2(
							$miniBill$elm_codec$Codec$encoder,
							codec,
							getter(v))),
					ocodec.h(v));
			}
		};
	});
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Encode$int = _Json_wrap;
var $miniBill$elm_codec$Codec$int = A2($miniBill$elm_codec$Codec$build, $elm$json$Json$Encode$int, $elm$json$Json$Decode$int);
var $miniBill$elm_codec$Codec$object = function (ctor) {
	return {
		f: $elm$json$Json$Decode$succeed(ctor),
		h: function (_v0) {
			return _List_Nil;
		}
	};
};
var $author$project$Common$SearchResultMeta = F2(
	function (searchString, result) {
		return {cQ: result, cV: searchString};
	});
var $author$project$Common$DictResult = function (a) {
	return {$: 1, a: a};
};
var $author$project$Common$KanjiDictResult = function (a) {
	return {$: 2, a: a};
};
var $author$project$Common$DictEntry = F3(
	function (key, reading, meanings) {
		return {ay: key, a_: meanings, a0: reading};
	});
var $miniBill$elm_codec$Codec$composite = F3(
	function (enc, dec, _v0) {
		var codec = _v0;
		return {
			f: dec(codec.f),
			h: enc(codec.h)
		};
	});
var $elm$json$Json$Decode$list = _Json_decodeList;
var $miniBill$elm_codec$Codec$list = A2($miniBill$elm_codec$Codec$composite, $elm$json$Json$Encode$list, $elm$json$Json$Decode$list);
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $miniBill$elm_codec$Codec$maybe = function (codec) {
	return {
		f: $elm$json$Json$Decode$maybe(
			$miniBill$elm_codec$Codec$decoder(codec)),
		h: function (v) {
			if (v.$ === 1) {
				return $elm$json$Json$Encode$null;
			} else {
				var x = v.a;
				return A2($miniBill$elm_codec$Codec$encoder, codec, x);
			}
		}
	};
};
var $author$project$Common$dictEntryCodec = $miniBill$elm_codec$Codec$buildObject(
	A4(
		$miniBill$elm_codec$Codec$field,
		'meanings',
		function ($) {
			return $.a_;
		},
		$miniBill$elm_codec$Codec$list($miniBill$elm_codec$Codec$string),
		A4(
			$miniBill$elm_codec$Codec$field,
			'reading',
			function ($) {
				return $.a0;
			},
			$miniBill$elm_codec$Codec$maybe($miniBill$elm_codec$Codec$string),
			A4(
				$miniBill$elm_codec$Codec$field,
				'key',
				function ($) {
					return $.ay;
				},
				$miniBill$elm_codec$Codec$string,
				$miniBill$elm_codec$Codec$object($author$project$Common$DictEntry)))));
var $author$project$Common$KanjiDictEntry = F6(
	function (key, meta, onYomi, kunYomi, nanori, meanings) {
		return {ay: key, ci: kunYomi, a_: meanings, cq: meta, cs: nanori, cw: onYomi};
	});
var $author$project$Common$KanjiMeta = function (radical) {
	return function (grade) {
		return function (strokes) {
			return function (frequency) {
				return function (classicNelson) {
					return function (newNelson) {
						return function (halpern) {
							return function (henshall) {
								return function (skip) {
									return function (pinyin) {
										return function (kanjiKentei) {
											return {be: classicNelson, bh: frequency, bi: grade, bk: halpern, bo: henshall, bp: kanjiKentei, bs: newNelson, bu: pinyin, bw: radical, bB: skip, bE: strokes};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $elm$json$Json$Decode$map3 = _Json_map3;
var $miniBill$elm_codec$Codec$triple = F3(
	function (m1, m2, m3) {
		return {
			f: A4(
				$elm$json$Json$Decode$map3,
				F3(
					function (a, b, c) {
						return _Utils_Tuple3(a, b, c);
					}),
				A2(
					$elm$json$Json$Decode$index,
					0,
					$miniBill$elm_codec$Codec$decoder(m1)),
				A2(
					$elm$json$Json$Decode$index,
					1,
					$miniBill$elm_codec$Codec$decoder(m2)),
				A2(
					$elm$json$Json$Decode$index,
					2,
					$miniBill$elm_codec$Codec$decoder(m3))),
			h: function (_v0) {
				var v1 = _v0.a;
				var v2 = _v0.b;
				var v3 = _v0.c;
				return A2(
					$elm$json$Json$Encode$list,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2($miniBill$elm_codec$Codec$encoder, m1, v1),
							A2($miniBill$elm_codec$Codec$encoder, m2, v2),
							A2($miniBill$elm_codec$Codec$encoder, m3, v3)
						]));
			}
		};
	});
var $miniBill$elm_codec$Codec$tuple = F2(
	function (m1, m2) {
		return {
			f: A3(
				$elm$json$Json$Decode$map2,
				F2(
					function (a, b) {
						return _Utils_Tuple2(a, b);
					}),
				A2(
					$elm$json$Json$Decode$index,
					0,
					$miniBill$elm_codec$Codec$decoder(m1)),
				A2(
					$elm$json$Json$Decode$index,
					1,
					$miniBill$elm_codec$Codec$decoder(m2))),
			h: function (_v0) {
				var v1 = _v0.a;
				var v2 = _v0.b;
				return A2(
					$elm$json$Json$Encode$list,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2($miniBill$elm_codec$Codec$encoder, m1, v1),
							A2($miniBill$elm_codec$Codec$encoder, m2, v2)
						]));
			}
		};
	});
var $author$project$Common$kanjiMetaCodec = $miniBill$elm_codec$Codec$buildObject(
	A4(
		$miniBill$elm_codec$Codec$field,
		'kanjiKentei',
		function ($) {
			return $.bp;
		},
		$miniBill$elm_codec$Codec$maybe($miniBill$elm_codec$Codec$int),
		A4(
			$miniBill$elm_codec$Codec$field,
			'pinyin',
			function ($) {
				return $.bu;
			},
			$miniBill$elm_codec$Codec$maybe(
				A2($miniBill$elm_codec$Codec$tuple, $miniBill$elm_codec$Codec$string, $miniBill$elm_codec$Codec$int)),
			A4(
				$miniBill$elm_codec$Codec$field,
				'skip',
				function ($) {
					return $.bB;
				},
				$miniBill$elm_codec$Codec$maybe(
					A3($miniBill$elm_codec$Codec$triple, $miniBill$elm_codec$Codec$int, $miniBill$elm_codec$Codec$int, $miniBill$elm_codec$Codec$int)),
				A4(
					$miniBill$elm_codec$Codec$field,
					'henshall',
					function ($) {
						return $.bo;
					},
					$miniBill$elm_codec$Codec$maybe($miniBill$elm_codec$Codec$int),
					A4(
						$miniBill$elm_codec$Codec$field,
						'halpern',
						function ($) {
							return $.bk;
						},
						$miniBill$elm_codec$Codec$maybe($miniBill$elm_codec$Codec$int),
						A4(
							$miniBill$elm_codec$Codec$field,
							'newNelson',
							function ($) {
								return $.bs;
							},
							$miniBill$elm_codec$Codec$maybe($miniBill$elm_codec$Codec$int),
							A4(
								$miniBill$elm_codec$Codec$field,
								'classicNelson',
								function ($) {
									return $.be;
								},
								$miniBill$elm_codec$Codec$maybe($miniBill$elm_codec$Codec$int),
								A4(
									$miniBill$elm_codec$Codec$field,
									'frequency',
									function ($) {
										return $.bh;
									},
									$miniBill$elm_codec$Codec$maybe($miniBill$elm_codec$Codec$int),
									A4(
										$miniBill$elm_codec$Codec$field,
										'strokes',
										function ($) {
											return $.bE;
										},
										$miniBill$elm_codec$Codec$maybe($miniBill$elm_codec$Codec$int),
										A4(
											$miniBill$elm_codec$Codec$field,
											'grade',
											function ($) {
												return $.bi;
											},
											$miniBill$elm_codec$Codec$maybe($miniBill$elm_codec$Codec$int),
											A4(
												$miniBill$elm_codec$Codec$field,
												'radical',
												function ($) {
													return $.bw;
												},
												$miniBill$elm_codec$Codec$maybe($miniBill$elm_codec$Codec$int),
												$miniBill$elm_codec$Codec$object($author$project$Common$KanjiMeta)))))))))))));
var $author$project$Common$kanjiDictEntryCodec = $miniBill$elm_codec$Codec$buildObject(
	A4(
		$miniBill$elm_codec$Codec$field,
		'meanings',
		function ($) {
			return $.a_;
		},
		$miniBill$elm_codec$Codec$list($miniBill$elm_codec$Codec$string),
		A4(
			$miniBill$elm_codec$Codec$field,
			'nanori',
			function ($) {
				return $.cs;
			},
			$miniBill$elm_codec$Codec$list($miniBill$elm_codec$Codec$string),
			A4(
				$miniBill$elm_codec$Codec$field,
				'kunYomi',
				function ($) {
					return $.ci;
				},
				$miniBill$elm_codec$Codec$list($miniBill$elm_codec$Codec$string),
				A4(
					$miniBill$elm_codec$Codec$field,
					'onYomi',
					function ($) {
						return $.cw;
					},
					$miniBill$elm_codec$Codec$list($miniBill$elm_codec$Codec$string),
					A4(
						$miniBill$elm_codec$Codec$field,
						'meta',
						function ($) {
							return $.cq;
						},
						$author$project$Common$kanjiMetaCodec,
						A4(
							$miniBill$elm_codec$Codec$field,
							'key',
							function ($) {
								return $.ay;
							},
							$miniBill$elm_codec$Codec$string,
							$miniBill$elm_codec$Codec$object($author$project$Common$KanjiDictEntry))))))));
var $author$project$Common$nameKindCodec = $miniBill$elm_codec$Codec$buildCustom(
	A3(
		$miniBill$elm_codec$Codec$variant0,
		'Unknown',
		10,
		A3(
			$miniBill$elm_codec$Codec$variant0,
			'Company',
			9,
			A3(
				$miniBill$elm_codec$Codec$variant0,
				'Product',
				8,
				A3(
					$miniBill$elm_codec$Codec$variant0,
					'Organisation',
					7,
					A3(
						$miniBill$elm_codec$Codec$variant0,
						'Station',
						6,
						A3(
							$miniBill$elm_codec$Codec$variant0,
							'Place',
							5,
							A3(
								$miniBill$elm_codec$Codec$variant0,
								'Given',
								4,
								A3(
									$miniBill$elm_codec$Codec$variant0,
									'Fullname',
									3,
									A3(
										$miniBill$elm_codec$Codec$variant0,
										'Surname',
										2,
										A3(
											$miniBill$elm_codec$Codec$variant0,
											'Female',
											1,
											A3(
												$miniBill$elm_codec$Codec$variant0,
												'Person',
												0,
												$miniBill$elm_codec$Codec$custom(
													function (fPerson) {
														return function (fFemale) {
															return function (fSurname) {
																return function (fFullname) {
																	return function (fGiven) {
																		return function (fPlace) {
																			return function (fStation) {
																				return function (fOrganisation) {
																					return function (fProduct) {
																						return function (fCompany) {
																							return function (fUnknown) {
																								return function (value) {
																									switch (value) {
																										case 0:
																											return fPerson;
																										case 1:
																											return fFemale;
																										case 2:
																											return fSurname;
																										case 3:
																											return fFullname;
																										case 4:
																											return fGiven;
																										case 5:
																											return fPlace;
																										case 6:
																											return fStation;
																										case 7:
																											return fOrganisation;
																										case 8:
																											return fProduct;
																										case 9:
																											return fCompany;
																										default:
																											return fUnknown;
																									}
																								};
																							};
																						};
																					};
																				};
																			};
																		};
																	};
																};
															};
														};
													})))))))))))));
var $author$project$Common$nameDictEntryCodec = $miniBill$elm_codec$Codec$buildObject(
	A4(
		$miniBill$elm_codec$Codec$field,
		'abr',
		function ($) {
			return $.bJ;
		},
		$miniBill$elm_codec$Codec$maybe($miniBill$elm_codec$Codec$string),
		A4(
			$miniBill$elm_codec$Codec$field,
			'meaning',
			function ($) {
				return $.co;
			},
			$miniBill$elm_codec$Codec$string,
			A4(
				$miniBill$elm_codec$Codec$field,
				'kind',
				function ($) {
					return $.ch;
				},
				$miniBill$elm_codec$Codec$list($author$project$Common$nameKindCodec),
				A4(
					$miniBill$elm_codec$Codec$field,
					'reading',
					function ($) {
						return $.a0;
					},
					$miniBill$elm_codec$Codec$maybe($miniBill$elm_codec$Codec$string),
					A4(
						$miniBill$elm_codec$Codec$field,
						'key',
						function ($) {
							return $.ay;
						},
						$miniBill$elm_codec$Codec$string,
						$miniBill$elm_codec$Codec$object($author$project$Common$NameDictEntry)))))));
var $author$project$Common$searchResultCodec = $miniBill$elm_codec$Codec$buildCustom(
	A4(
		$miniBill$elm_codec$Codec$variant1,
		'KanjiDictResult',
		$author$project$Common$KanjiDictResult,
		$miniBill$elm_codec$Codec$list($author$project$Common$kanjiDictEntryCodec),
		A4(
			$miniBill$elm_codec$Codec$variant1,
			'DictResult',
			$author$project$Common$DictResult,
			$miniBill$elm_codec$Codec$list($author$project$Common$dictEntryCodec),
			A4(
				$miniBill$elm_codec$Codec$variant1,
				'NameDictResult',
				$author$project$Common$NameDictResult,
				$miniBill$elm_codec$Codec$list($author$project$Common$nameDictEntryCodec),
				$miniBill$elm_codec$Codec$custom(
					F4(
						function (fNameDictResult, fDictResult, fKanjiDictResult, value) {
							switch (value.$) {
								case 0:
									var xs = value.a;
									return fNameDictResult(xs);
								case 1:
									var xs = value.a;
									return fDictResult(xs);
								default:
									var xs = value.a;
									return fKanjiDictResult(xs);
							}
						}))))));
var $author$project$Common$searchResultMetaCodec = $miniBill$elm_codec$Codec$buildObject(
	A4(
		$miniBill$elm_codec$Codec$field,
		'result',
		function ($) {
			return $.cQ;
		},
		$author$project$Common$searchResultCodec,
		A4(
			$miniBill$elm_codec$Codec$field,
			'searchString',
			function ($) {
				return $.cV;
			},
			$miniBill$elm_codec$Codec$string,
			$miniBill$elm_codec$Codec$object($author$project$Common$SearchResultMeta))));
var $author$project$Common$Failure = 3;
var $author$project$Common$Initial = 0;
var $author$project$Common$statusCodec = $miniBill$elm_codec$Codec$buildCustom(
	A3(
		$miniBill$elm_codec$Codec$variant0,
		'Failure',
		3,
		A3(
			$miniBill$elm_codec$Codec$variant0,
			'Success',
			2,
			A3(
				$miniBill$elm_codec$Codec$variant0,
				'Pending',
				1,
				A3(
					$miniBill$elm_codec$Codec$variant0,
					'Initial',
					0,
					$miniBill$elm_codec$Codec$custom(
						F5(
							function (fInitial, fPending, fSuccess, fFailure, value) {
								switch (value) {
									case 0:
										return fInitial;
									case 1:
										return fPending;
									case 2:
										return fSuccess;
									default:
										return fFailure;
								}
							})))))));
var $miniBill$elm_codec$Codec$variant2 = F4(
	function (name, ctor, m1, m2) {
		return A3(
			$miniBill$elm_codec$Codec$variant,
			name,
			F3(
				function (c, v1, v2) {
					return c(
						_List_fromArray(
							[
								A2($miniBill$elm_codec$Codec$encoder, m1, v1),
								A2($miniBill$elm_codec$Codec$encoder, m2, v2)
							]));
				}),
			A3(
				$elm$json$Json$Decode$map2,
				ctor,
				A2(
					$elm$json$Json$Decode$index,
					0,
					$miniBill$elm_codec$Codec$decoder(m1)),
				A2(
					$elm$json$Json$Decode$index,
					1,
					$miniBill$elm_codec$Codec$decoder(m2))));
	});
var $author$project$Common$DictWorker = 1;
var $author$project$Common$KanjiDictWorker = 2;
var $author$project$Common$workerCodec = $miniBill$elm_codec$Codec$buildCustom(
	A3(
		$miniBill$elm_codec$Codec$variant0,
		'KanjiDictWorker',
		2,
		A3(
			$miniBill$elm_codec$Codec$variant0,
			'DictWorker',
			1,
			A3(
				$miniBill$elm_codec$Codec$variant0,
				'NameDictWorker',
				0,
				$miniBill$elm_codec$Codec$custom(
					F4(
						function (fNameDictWorker, fDictWorker, fKanjiDictWorker, value) {
							switch (value) {
								case 0:
									return fNameDictWorker;
								case 1:
									return fDictWorker;
								default:
									return fKanjiDictWorker;
							}
						}))))));
var $author$project$Common$workerMsgCodec = $miniBill$elm_codec$Codec$buildCustom(
	A4(
		$miniBill$elm_codec$Codec$variant1,
		'SearchResultMsg',
		$author$project$Common$SearchResultMsg,
		$author$project$Common$searchResultMetaCodec,
		A5(
			$miniBill$elm_codec$Codec$variant2,
			'LoadingStatusMsg',
			$author$project$Common$LoadingStatusMsg,
			$author$project$Common$workerCodec,
			$miniBill$elm_codec$Codec$buildObject(
				A4(
					$miniBill$elm_codec$Codec$field,
					'status',
					function ($) {
						return $.c_;
					},
					$author$project$Common$statusCodec,
					A4(
						$miniBill$elm_codec$Codec$field,
						'message',
						function ($) {
							return $.cp;
						},
						$miniBill$elm_codec$Codec$string,
						A4(
							$miniBill$elm_codec$Codec$field,
							'progress',
							function ($) {
								return $.cI;
							},
							$miniBill$elm_codec$Codec$int,
							$miniBill$elm_codec$Codec$object(
								F3(
									function (p, m, s) {
										return {cp: m, cI: p, c_: s};
									})))))),
			$miniBill$elm_codec$Codec$custom(
				F3(
					function (fLoadingStatusMsg, fSearchResultMsg, value) {
						if (!value.$) {
							var w = value.a;
							var s = value.b;
							return A2(fLoadingStatusMsg, w, s);
						} else {
							var m = value.a;
							return fSearchResultMsg(m);
						}
					})))));
var $author$project$NameDictWorker$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var value = msg.a;
				var statusDecoder = A2($elm$json$Json$Decode$field, 'indexedDbReady', $elm$json$Json$Decode$bool);
				var _v1 = A2($elm$json$Json$Decode$decodeValue, statusDecoder, value);
				if ((!_v1.$) && _v1.a) {
					return model.a4 ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : _Utils_Tuple2(
						_Utils_update(
							model,
							{aY: 'indexedDb is ready', a4: true}),
						$elm$core$Platform$Cmd$batch(
							A2(
								$elm$core$List$map,
								$author$project$NameDictWorker$loadFromIndexedDb,
								$elm$core$Set$toList(model.J))));
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aY: 'indexedDb error'}),
						$elm$core$Platform$Cmd$none);
				}
			case 1:
				var ids = A2($elm$core$List$range, 0, $author$project$NameDictWorker$nbrFiles - 1);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							J: $elm$core$Set$fromList(
								A2($elm$core$List$map, $author$project$NameDictWorker$dataPath, ids))
						}),
					$elm$core$Platform$Cmd$batch(
						A2(
							$elm$core$List$map,
							$author$project$NameDictWorker$loadFromIndexedDb,
							A2($elm$core$List$map, $author$project$NameDictWorker$dataPath, ids))));
			case 2:
				var path = msg.a;
				var res = msg.b;
				if (!res.$) {
					var str = res.a;
					var requested = A2($elm$core$Set$remove, path, model.J);
					var maxLineLength = A3(
						$elm$core$List$foldr,
						F2(
							function (s, acc) {
								return A2(
									$elm$core$Basics$max,
									$elm$core$String$length(s),
									acc);
							}),
						model.T,
						$elm$core$String$lines(str));
					var filename = A2($elm_community$string_extra$String$Extra$rightOfBack, '/', path);
					var compressed = A2(
						$elm$core$Maybe$withDefault,
						'',
						$danfishgold$base64_bytes$Base64$fromBytes(
							$folkertdev$elm_flate$Flate$deflate(
								$elm$bytes$Bytes$Encode$encode(
									$elm$bytes$Bytes$Encode$string(str)))));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								T: maxLineLength,
								ad: _Utils_ap(
									model.ad,
									A2($elm$core$String$cons, '\n', str)),
								J: requested
							}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$NameDictWorker$saveToIndexedDb(
									$elm$json$Json$Encode$object(
										_List_fromArray(
											[
												_Utils_Tuple2(
												'filename',
												$elm$json$Json$Encode$string(path)),
												_Utils_Tuple2(
												'content',
												$elm$json$Json$Encode$string(compressed))
											]))),
									$author$project$NameDictWorker$outbound(
									A2(
										$miniBill$elm_codec$Codec$encoder,
										$author$project$Common$workerMsgCodec,
										A2(
											$author$project$Common$LoadingStatusMsg,
											0,
											{
												cp: 'Loaded ' + (filename + ' from network'),
												cI: $elm$core$Basics$round(
													(100 * ($author$project$NameDictWorker$nbrFiles - $elm$core$Set$size(requested))) / $author$project$NameDictWorker$nbrFiles),
												c_: _Utils_eq(requested, $elm$core$Set$empty) ? 2 : 1
											})))
								])));
				} else {
					return _Utils_Tuple2(
						model,
						$author$project$NameDictWorker$outbound(
							A2(
								$miniBill$elm_codec$Codec$encoder,
								$author$project$Common$workerMsgCodec,
								A2(
									$author$project$Common$LoadingStatusMsg,
									0,
									{
										cp: 'Network Error: ' + path,
										cI: $elm$core$Basics$round(
											(100 * ($author$project$NameDictWorker$nbrFiles - $elm$core$Set$size(model.J))) / $author$project$NameDictWorker$nbrFiles),
										c_: 1
									}))));
				}
			case 3:
				var value = msg.a;
				var dataFromIndexedDbSecoder = $elm$json$Json$Decode$oneOf(
					_List_fromArray(
						[
							A3(
							$elm$json$Json$Decode$map2,
							F2(
								function (f, c) {
									return $author$project$NameDictWorker$IndexedDbData(
										{bV: c, b_: f});
								}),
							A2($elm$json$Json$Decode$field, 'filename', $elm$json$Json$Decode$string),
							A2($elm$json$Json$Decode$field, 'content', $elm$json$Json$Decode$string)),
							A2(
							$elm$json$Json$Decode$map,
							$author$project$NameDictWorker$NoData,
							A2($elm$json$Json$Decode$field, 'noData', $elm$json$Json$Decode$string))
						]));
				var _v3 = A2($elm$json$Json$Decode$decodeValue, dataFromIndexedDbSecoder, value);
				if (!_v3.$) {
					if (!_v3.a.$) {
						var filename = _v3.a.a.b_;
						var content = _v3.a.a.bV;
						var requested = A2($elm$core$Set$remove, filename, model.J);
						var filename_ = A2($elm_community$string_extra$String$Extra$rightOfBack, '/', filename);
						var content_ = A2(
							$elm$core$Maybe$withDefault,
							'',
							A2(
								$elm$core$Maybe$andThen,
								$author$project$NameDictWorker$decodeAsString,
								A2(
									$elm$core$Maybe$andThen,
									$folkertdev$elm_flate$Flate$inflate,
									$danfishgold$base64_bytes$Base64$toBytes(content))));
						var maxLineLength = A3(
							$elm$core$List$foldr,
							F2(
								function (s, acc) {
									return A2(
										$elm$core$Basics$max,
										$elm$core$String$length(s),
										acc);
								}),
							model.T,
							$elm$core$String$lines(content_));
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									T: maxLineLength,
									ad: _Utils_ap(
										model.ad,
										A2($elm$core$String$cons, '\n', content_)),
									J: requested
								}),
							$author$project$NameDictWorker$outbound(
								A2(
									$miniBill$elm_codec$Codec$encoder,
									$author$project$Common$workerMsgCodec,
									A2(
										$author$project$Common$LoadingStatusMsg,
										0,
										{
											cp: 'Loaded ' + (filename_ + ' from local backup'),
											cI: $elm$core$Basics$round(
												(100 * ($author$project$NameDictWorker$nbrFiles - $elm$core$Set$size(requested))) / $author$project$NameDictWorker$nbrFiles),
											c_: _Utils_eq(requested, $elm$core$Set$empty) ? 2 : 1
										}))));
					} else {
						var path = _v3.a.a;
						return _Utils_Tuple2(
							model,
							$author$project$NameDictWorker$getData(path));
					}
				} else {
					var e = _v3.a;
					return _Utils_Tuple2(
						model,
						$author$project$NameDictWorker$outbound(
							A2(
								$miniBill$elm_codec$Codec$encoder,
								$author$project$Common$workerMsgCodec,
								A2(
									$author$project$Common$LoadingStatusMsg,
									0,
									{
										cp: 'IndexedDB Error: ' + $elm$json$Json$Decode$errorToString(e),
										cI: $elm$core$Basics$round(
											(100 * ($author$project$NameDictWorker$nbrFiles - $elm$core$Set$size(model.J))) / $author$project$NameDictWorker$nbrFiles),
										c_: 1
									}))));
				}
			case 4:
				var s = msg.a;
				var getMatch = F2(
					function (n, s_) {
						var rigthStr = A2(
							$elm_community$string_extra$String$Extra$leftOf,
							'\n',
							A2($elm$core$String$dropLeft, n, s_));
						var leftStr = A2(
							$elm_community$string_extra$String$Extra$rightOfBack,
							'\n',
							A2($elm$core$String$left, n, s_));
						return _Utils_ap(leftStr, rigthStr);
					});
				var searchResult = A2(
					$elm$core$List$sortBy,
					function (e) {
						return A2($rluiten$stringdistance$StringDistance$sift3Distance, e.ay, s);
					},
					(A2(
						$elm$core$List$all,
						$elm$core$Char$isAlphaNum,
						$elm$core$String$toList(s)) ? $elm$core$List$filter(
						function (e) {
							return A2(
								$elm$core$List$member,
								$elm$core$String$toLower(s),
								$elm$core$String$words(
									$elm$core$String$toLower(e.co)));
						}) : $elm$core$List$filter(
						function (e) {
							return A2($elm$core$String$contains, s, e.ay);
						}))(
						A2(
							$elm$core$List$filterMap,
							$elm$core$Basics$identity,
							A2(
								$elm$core$List$map,
								A2($elm$core$Basics$composeR, $author$project$NameDictWorker$parseNameDictEntry, $elm$core$Result$toMaybe),
								$elm_community$list_extra$List$Extra$unique(
									A2(
										$elm$core$List$map,
										getMatch(model.T),
										A2(
											$elm$core$List$map,
											function (n) {
												return A3($elm$core$String$slice, n - model.T, n + model.T, model.ad);
											},
											A2($elm$core$String$indexes, s, model.ad))))))));
				return _Utils_Tuple2(
					model,
					$author$project$NameDictWorker$outbound(
						A2(
							$miniBill$elm_codec$Codec$encoder,
							$author$project$Common$workerMsgCodec,
							$author$project$Common$SearchResultMsg(
								{
									cQ: $author$project$Common$NameDictResult(searchResult),
									cV: s
								}))));
			case 5:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			default:
				var s = msg.a;
				return _Utils_Tuple2(
					model,
					$author$project$NameDictWorker$outbound(
						A2(
							$miniBill$elm_codec$Codec$encoder,
							$author$project$Common$workerMsgCodec,
							A2(
								$author$project$Common$LoadingStatusMsg,
								0,
								{
									cp: s,
									cI: $elm$core$Basics$round(
										(100 * ($author$project$NameDictWorker$nbrFiles - $elm$core$Set$size(model.J))) / $author$project$NameDictWorker$nbrFiles),
									c_: 1
								}))));
		}
	});
var $elm$core$Platform$worker = _Platform_worker;
var $author$project$NameDictWorker$main = $elm$core$Platform$worker(
	{d8: $author$project$NameDictWorker$init, eU: $author$project$NameDictWorker$subscriptions, fd: $author$project$NameDictWorker$update});
_Platform_export({'NameDictWorker':{'init':$author$project$NameDictWorker$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));