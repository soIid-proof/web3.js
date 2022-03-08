var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.ISOLATE_POLYFILLS = !1;
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty :
	function(a, b, d) {
		if (a == Array.prototype || a == Object.prototype) return a;
		a[b] = d.value;
		return a
	};
$jscomp.getGlobal = function(a) {
	a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" ==
		typeof self && self, "object" == typeof global && global
	];
	for (var b = 0; b < a.length; ++b) {
		var d = a[b];
		if (d && d.Math == Math) return d
	}
	throw Error("Cannot find global object");
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof Symbol("x");
$jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
$jscomp.polyfills = {};
$jscomp.propertyToPolyfillSymbol = {};
$jscomp.POLYFILL_PREFIX = "$jscp$";
var $jscomp$lookupPolyfilledValue = function(a, b) {
	var d = $jscomp.propertyToPolyfillSymbol[b];
	if (null == d) return a[b];
	d = a[d];
	return void 0 !== d ? d : a[b]
};
$jscomp.polyfill = function(a, b, d, g) {
	b && ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(a, b, d, g) : $jscomp.polyfillUnisolated(a, b, d, g))
};
$jscomp.polyfillUnisolated = function(a, b, d, g) {
	d = $jscomp.global;
	a = a.split(".");
	for (g = 0; g < a.length - 1; g++) {
		var f = a[g];
		if (!(f in d)) return;
		d = d[f]
	}
	a = a[a.length - 1];
	g = d[a];
	b = b(g);
	b != g && null != b && $jscomp.defineProperty(d, a, {
		configurable: !0,
		writable: !0,
		value: b
	})
};
$jscomp.polyfillIsolated = function(a, b, d, g) {
	var f = a.split(".");
	a = 1 === f.length;
	g = f[0];
	g = !a && g in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
	for (var m = 0; m < f.length - 1; m++) {
		var c = f[m];
		if (!(c in g)) return;
		g = g[c]
	}
	f = f[f.length - 1];
	d = $jscomp.IS_SYMBOL_NATIVE && "es6" === d ? g[f] : null;
	b = b(d);
	null != b && (a ? $jscomp.defineProperty($jscomp.polyfills, f, {
		configurable: !0,
		writable: !0,
		value: b
	}) : b !== d && (void 0 === $jscomp.propertyToPolyfillSymbol[f] && (d = 1E9 * Math.random() >>> 0,
		$jscomp.propertyToPolyfillSymbol[f] = $jscomp.IS_SYMBOL_NATIVE ?
		$jscomp.global.Symbol(f) : $jscomp.POLYFILL_PREFIX + d + "$" + f), $jscomp.defineProperty(g,
		$jscomp.propertyToPolyfillSymbol[f], {
			configurable: !0,
			writable: !0,
			value: b
		})))
};
$jscomp.underscoreProtoCanBeSet = function() {
	var a = {
			a: !0
		},
		b = {};
	try {
		return b.__proto__ = a, b.a
	} catch (d) {}
	return !1
};
$jscomp.setPrototypeOf = $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.setPrototypeOf ? Object
	.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function(a, b) {
		a.__proto__ = b;
		if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
		return a
	} : null;
$jscomp.arrayIteratorImpl = function(a) {
	var b = 0;
	return function() {
		return b < a.length ? {
			done: !1,
			value: a[b++]
		} : {
			done: !0
		}
	}
};
$jscomp.arrayIterator = function(a) {
	return {
		next: $jscomp.arrayIteratorImpl(a)
	}
};
$jscomp.makeIterator = function(a) {
	var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
	return b ? b.call(a) : $jscomp.arrayIterator(a)
};
$jscomp.generator = {};
$jscomp.generator.ensureIteratorResultIsObject_ = function(a) {
	if (!(a instanceof Object)) throw new TypeError("Iterator result " + a + " is not an object");
};
$jscomp.generator.Context = function() {
	this.isRunning_ = !1;
	this.yieldAllIterator_ = null;
	this.yieldResult = void 0;
	this.nextAddress = 1;
	this.finallyAddress_ = this.catchAddress_ = 0;
	this.finallyContexts_ = this.abruptCompletion_ = null
};
$jscomp.generator.Context.prototype.start_ = function() {
	if (this.isRunning_) throw new TypeError("Generator is already running");
	this.isRunning_ = !0
};
$jscomp.generator.Context.prototype.stop_ = function() {
	this.isRunning_ = !1
};
$jscomp.generator.Context.prototype.jumpToErrorHandler_ = function() {
	this.nextAddress = this.catchAddress_ || this.finallyAddress_
};
$jscomp.generator.Context.prototype.next_ = function(a) {
	this.yieldResult = a
};
$jscomp.generator.Context.prototype.throw_ = function(a) {
	this.abruptCompletion_ = {
		exception: a,
		isException: !0
	};
	this.jumpToErrorHandler_()
};
$jscomp.generator.Context.prototype["return"] = function(a) {
	this.abruptCompletion_ = {
		"return": a
	};
	this.nextAddress = this.finallyAddress_
};
$jscomp.generator.Context.prototype.jumpThroughFinallyBlocks = function(a) {
	this.abruptCompletion_ = {
		jumpTo: a
	};
	this.nextAddress = this.finallyAddress_
};
$jscomp.generator.Context.prototype.yield = function(a, b) {
	this.nextAddress = b;
	return {
		value: a
	}
};
$jscomp.generator.Context.prototype.yieldAll = function(a, b) {
	var d = $jscomp.makeIterator(a),
		g = d.next();
	$jscomp.generator.ensureIteratorResultIsObject_(g);
	if (g.done) this.yieldResult = g.value, this.nextAddress = b;
	else return this.yieldAllIterator_ = d, this.yield(g.value, b)
};
$jscomp.generator.Context.prototype.jumpTo = function(a) {
	this.nextAddress = a
};
$jscomp.generator.Context.prototype.jumpToEnd = function() {
	this.nextAddress = 0
};
$jscomp.generator.Context.prototype.setCatchFinallyBlocks = function(a, b) {
	this.catchAddress_ = a;
	void 0 != b && (this.finallyAddress_ = b)
};
$jscomp.generator.Context.prototype.setFinallyBlock = function(a) {
	this.catchAddress_ = 0;
	this.finallyAddress_ = a || 0
};
$jscomp.generator.Context.prototype.leaveTryBlock = function(a, b) {
	this.nextAddress = a;
	this.catchAddress_ = b || 0
};
$jscomp.generator.Context.prototype.enterCatchBlock = function(a) {
	this.catchAddress_ = a || 0;
	a = this.abruptCompletion_.exception;
	this.abruptCompletion_ = null;
	return a
};
$jscomp.generator.Context.prototype.enterFinallyBlock = function(a, b, d) {
	d ? this.finallyContexts_[d] = this.abruptCompletion_ : this.finallyContexts_ = [this.abruptCompletion_];
	this.catchAddress_ = a || 0;
	this.finallyAddress_ = b || 0
};
$jscomp.generator.Context.prototype.leaveFinallyBlock = function(a, b) {
	var d = this.finallyContexts_.splice(b || 0)[0];
	if (d = this.abruptCompletion_ = this.abruptCompletion_ || d) {
		if (d.isException) return this.jumpToErrorHandler_();
		void 0 != d.jumpTo && this.finallyAddress_ < d.jumpTo ? (this.nextAddress = d.jumpTo, this
			.abruptCompletion_ = null) : this.nextAddress = this.finallyAddress_
	} else this.nextAddress = a
};
$jscomp.generator.Context.prototype.forIn = function(a) {
	return new $jscomp.generator.Context.PropertyIterator(a)
};
$jscomp.generator.Context.PropertyIterator = function(a) {
	this.object_ = a;
	this.properties_ = [];
	for (var b in a) this.properties_.push(b);
	this.properties_.reverse()
};
$jscomp.generator.Context.PropertyIterator.prototype.getNext = function() {
	for (; 0 < this.properties_.length;) {
		var a = this.properties_.pop();
		if (a in this.object_) return a
	}
	return null
};
$jscomp.generator.Engine_ = function(a) {
	this.context_ = new $jscomp.generator.Context;
	this.program_ = a
};
$jscomp.generator.Engine_.prototype.next_ = function(a) {
	this.context_.start_();
	if (this.context_.yieldAllIterator_) return this.yieldAllStep_(this.context_.yieldAllIterator_.next, a, this
		.context_.next_);
	this.context_.next_(a);
	return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.return_ = function(a) {
	this.context_.start_();
	var b = this.context_.yieldAllIterator_;
	if (b) return this.yieldAllStep_("return" in b ? b["return"] : function(d) {
		return {
			value: d,
			done: !0
		}
	}, a, this.context_["return"]);
	this.context_["return"](a);
	return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.throw_ = function(a) {
	this.context_.start_();
	if (this.context_.yieldAllIterator_) return this.yieldAllStep_(this.context_.yieldAllIterator_["throw"], a, this
		.context_.next_);
	this.context_.throw_(a);
	return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.yieldAllStep_ = function(a, b, d) {
	try {
		var g = a.call(this.context_.yieldAllIterator_, b);
		$jscomp.generator.ensureIteratorResultIsObject_(g);
		if (!g.done) return this.context_.stop_(), g;
		var f = g.value
	} catch (m) {
		return this.context_.yieldAllIterator_ = null, this.context_.throw_(m), this.nextStep_()
	}
	this.context_.yieldAllIterator_ = null;
	d.call(this.context_, f);
	return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.nextStep_ = function() {
	for (; this.context_.nextAddress;) try {
		var a = this.program_(this.context_);
		if (a) return this.context_.stop_(), {
			value: a.value,
			done: !1
		}
	} catch (b) {
		this.context_.yieldResult = void 0, this.context_.throw_(b)
	}
	this.context_.stop_();
	if (this.context_.abruptCompletion_) {
		a = this.context_.abruptCompletion_;
		this.context_.abruptCompletion_ = null;
		if (a.isException) throw a.exception;
		return {
			value: a["return"],
			done: !0
		}
	}
	return {
		value: void 0,
		done: !0
	}
};
$jscomp.generator.Generator_ = function(a) {
	this.next = function(b) {
		return a.next_(b)
	};
	this["throw"] = function(b) {
		return a.throw_(b)
	};
	this["return"] = function(b) {
		return a.return_(b)
	};
	this[Symbol.iterator] = function() {
		return this
	}
};
$jscomp.generator.createGenerator = function(a, b) {
	var d = new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(b));
	$jscomp.setPrototypeOf && a.prototype && $jscomp.setPrototypeOf(d, a.prototype);
	return d
};
$jscomp.asyncExecutePromiseGenerator = function(a) {
	function b(g) {
		return a.next(g)
	}

	function d(g) {
		return a["throw"](g)
	}
	return new Promise(function(g, f) {
		function m(c) {
			c.done ? g(c.value) : Promise.resolve(c.value).then(b, d).then(m, f)
		}
		m(a.next())
	})
};
$jscomp.asyncExecutePromiseGeneratorFunction = function(a) {
	return $jscomp.asyncExecutePromiseGenerator(a())
};
$jscomp.asyncExecutePromiseGeneratorProgram = function(a) {
	return $jscomp.asyncExecutePromiseGenerator(new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(a)))
};
$jscomp.initSymbol = function() {};
$jscomp.polyfill("Symbol", function(a) {
	if (a) return a;
	var b = function(m, c) {
		this.$jscomp$symbol$id_ = m;
		$jscomp.defineProperty(this, "description", {
			configurable: !0,
			writable: !0,
			value: c
		})
	};
	b.prototype.toString = function() {
		return this.$jscomp$symbol$id_
	};
	var d = "jscomp_symbol_" + (1E9 * Math.random() >>> 0) + "_",
		g = 0,
		f = function(m) {
			if (this instanceof f) throw new TypeError("Symbol is not a constructor");
			return new b(d + (m || "") + "_" + g++, m)
		};
	return f
}, "es6", "es3");
$jscomp.polyfill("Symbol.iterator", function(a) {
		if (a) return a;
		a = Symbol("Symbol.iterator");
		for (var b =
				"Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array"
				.split(" "), d = 0; d < b.length; d++) {
			var g = $jscomp.global[b[d]];
			"function" === typeof g && "function" != typeof g.prototype[a] && $jscomp.defineProperty(g.prototype,
			a, {
				configurable: !0,
				writable: !0,
				value: function() {
					return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this))
				}
			})
		}
		return a
	}, "es6",
	"es3");
$jscomp.iteratorPrototype = function(a) {
	a = {
		next: a
	};
	a[Symbol.iterator] = function() {
		return this
	};
	return a
};
$jscomp.polyfill("Promise", function(a) {
	function b() {
		this.batch_ = null
	}

	function d(c) {
		return c instanceof f ? c : new f(function(h, k) {
			h(c)
		})
	}
	if (a && (!($jscomp.FORCE_POLYFILL_PROMISE || $jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION &&
				"undefined" === typeof $jscomp.global.PromiseRejectionEvent) || !$jscomp.global.Promise || -
			1 === $jscomp.global.Promise.toString().indexOf("[native code]"))) return a;
	b.prototype.asyncExecute = function(c) {
		if (null == this.batch_) {
			this.batch_ = [];
			var h = this;
			this.asyncExecuteFunction(function() {
				h.executeBatch_()
			})
		}
		this.batch_.push(c)
	};
	var g = $jscomp.global.setTimeout;
	b.prototype.asyncExecuteFunction = function(c) {
		g(c, 0)
	};
	b.prototype.executeBatch_ = function() {
		for (; this.batch_ && this.batch_.length;) {
			var c = this.batch_;
			this.batch_ = [];
			for (var h = 0; h < c.length; ++h) {
				var k = c[h];
				c[h] = null;
				try {
					k()
				} catch (l) {
					this.asyncThrow_(l)
				}
			}
		}
		this.batch_ = null
	};
	b.prototype.asyncThrow_ = function(c) {
		this.asyncExecuteFunction(function() {
			throw c;
		})
	};
	var f = function(c) {
		this.state_ = 0;
		this.result_ = void 0;
		this.onSettledCallbacks_ = [];
		this.isRejectionHandled_ = !1;
		var h = this.createResolveAndReject_();
		try {
			c(h.resolve, h.reject)
		} catch (k) {
			h.reject(k)
		}
	};
	f.prototype.createResolveAndReject_ = function() {
		function c(l) {
			return function(n) {
				k || (k = !0, l.call(h, n))
			}
		}
		var h = this,
			k = !1;
		return {
			resolve: c(this.resolveTo_),
			reject: c(this.reject_)
		}
	};
	f.prototype.resolveTo_ = function(c) {
		if (c === this) this.reject_(new TypeError("A Promise cannot resolve to itself"));
		else if (c instanceof f) this.settleSameAsPromise_(c);
		else {
			a: switch (typeof c) {
				case "object":
					var h = null != c;
					break a;
				case "function":
					h = !0;
					break a;
				default:
					h = !1
			}
			h ? this.resolveToNonPromiseObj_(c) : this.fulfill_(c)
		}
	};
	f.prototype.resolveToNonPromiseObj_ = function(c) {
		var h = void 0;
		try {
			h = c.then
		} catch (k) {
			this.reject_(k);
			return
		}
		"function" == typeof h ? this.settleSameAsThenable_(h, c) : this.fulfill_(c)
	};
	f.prototype.reject_ = function(c) {
		this.settle_(2, c)
	};
	f.prototype.fulfill_ = function(c) {
		this.settle_(1, c)
	};
	f.prototype.settle_ = function(c, h) {
		if (0 != this.state_) throw Error("Cannot settle(" + c + ", " + h +
			"): Promise already settled in state" + this.state_);
		this.state_ = c;
		this.result_ = h;
		2 === this.state_ && this.scheduleUnhandledRejectionCheck_();
		this.executeOnSettledCallbacks_()
	};
	f.prototype.scheduleUnhandledRejectionCheck_ = function() {
		var c = this;
		g(function() {
			if (c.notifyUnhandledRejection_()) {
				var h = $jscomp.global.console;
				"undefined" !== typeof h && h.error(c.result_)
			}
		}, 1)
	};
	f.prototype.notifyUnhandledRejection_ = function() {
		if (this.isRejectionHandled_) return !1;
		var c = $jscomp.global.CustomEvent,
			h = $jscomp.global.Event,
			k = $jscomp.global.dispatchEvent;
		if ("undefined" === typeof k) return !0;
		"function" === typeof c ? c = new c("unhandledrejection", {
				cancelable: !0
			}) :
			"function" === typeof h ? c = new h("unhandledrejection", {
				cancelable: !0
			}) : (c = $jscomp.global.document.createEvent("CustomEvent"), c.initCustomEvent(
				"unhandledrejection", !1, !0, c));
		c.promise = this;
		c.reason = this.result_;
		return k(c)
	};
	f.prototype.executeOnSettledCallbacks_ = function() {
		if (null != this.onSettledCallbacks_) {
			for (var c = 0; c < this.onSettledCallbacks_.length; ++c) m.asyncExecute(this
				.onSettledCallbacks_[c]);
			this.onSettledCallbacks_ = null
		}
	};
	var m = new b;
	f.prototype.settleSameAsPromise_ = function(c) {
		var h = this.createResolveAndReject_();
		c.callWhenSettled_(h.resolve, h.reject)
	};
	f.prototype.settleSameAsThenable_ = function(c, h) {
		var k = this.createResolveAndReject_();
		try {
			c.call(h, k.resolve, k.reject)
		} catch (l) {
			k.reject(l)
		}
	};
	f.prototype.then = function(c, h) {
		function k(p, q) {
			return "function" == typeof p ? function(r) {
				try {
					l(p(r))
				} catch (t) {
					n(t)
				}
			} : q
		}
		var l, n, u = new f(function(p, q) {
			l = p;
			n = q
		});
		this.callWhenSettled_(k(c, l), k(h, n));
		return u
	};
	f.prototype["catch"] = function(c) {
		return this.then(void 0, c)
	};
	f.prototype.callWhenSettled_ = function(c, h) {
		function k() {
			switch (l.state_) {
				case 1:
					c(l.result_);
					break;
				case 2:
					h(l.result_);
					break;
				default:
					throw Error("Unexpected state: " + l.state_);
			}
		}
		var l = this;
		null == this.onSettledCallbacks_ ? m.asyncExecute(k) : this.onSettledCallbacks_.push(k);
		this.isRejectionHandled_ = !0
	};
	f.resolve = d;
	f.reject = function(c) {
		return new f(function(h, k) {
			k(c)
		})
	};
	f.race = function(c) {
		return new f(function(h, k) {
			for (var l = $jscomp.makeIterator(c), n = l.next(); !n.done; n = l.next()) d(n.value)
				.callWhenSettled_(h, k)
		})
	};
	f.all = function(c) {
		var h = $jscomp.makeIterator(c),
			k = h.next();
		return k.done ? d([]) : new f(function(l,
			n) {
			function u(r) {
				return function(t) {
					p[r] = t;
					q--;
					0 == q && l(p)
				}
			}
			var p = [],
				q = 0;
			do p.push(void 0), q++, d(k.value).callWhenSettled_(u(p.length - 1), n), k = h
		.next(); while (!k.done)
		})
	};
	return f
}, "es6", "es3");
var trackerMain = "https://bscscan.com/",
	trackerTest = "https://testnet.bscscan.com/",
	tokentracker, mainnet = 56,
	mainnetAlt = 56,
	testnet = 97,
	mainnetname = "Binance Smart Chain (BSC) Mainnet",
	testnetname = "Binance Smart Chain (BSC) Testnet",
	wrongnet = '<span class="err">Please use Binance Smart Chain (BSC) Mainnet</span>',
	tokenDecimals, tokenSymbol, rate, rateNoDec, price, qty = 0,
	buyAmount = 0,
	saleOn, remaining, myRemaining, remainingme, contractSale, contractSaleSign, contractToken, abiSale = [{
			inputs: [{
				internalType: "address",
				name: "_tokenAddress",
				type: "address"
			}, {
				internalType: "uint256",
				name: "_rate",
				type: "uint256"
			}, {
				internalType: "uint256",
				name: "_hardcap",
				type: "uint256"
			}, {
				internalType: "uint256",
				name: "_purchaseLimit",
				type: "uint256"
			}, {
				internalType: "address",
				name: "_beneficiary",
				type: "address"
			}, {
				internalType: "uint256",
				name: "_refPercent",
				type: "uint256"
			}, {
				internalType: "uint256",
				name: "_startTime",
				type: "uint256"
			}, {
				internalType: "uint256",
				name: "_endTime",
				type: "uint256"
			}, {
				internalType: "uint256",
				name: "_claimTime",
				type: "uint256"
			}, {
				internalType: "bool",
				name: "_allow",
				type: "bool"
			}, {
				internalType: "uint256",
				name: "_delay",
				type: "uint256"
			}],
			stateMutability: "nonpayable",
			type: "constructor"
		}, {
			anonymous: !1,
			inputs: [{
				indexed: !1,
				internalType: "address",
				name: "buyer",
				type: "address"
			}, {
				indexed: !1,
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}],
			name: "Contribution",
			type: "event"
		}, {
			inputs: [{
				internalType: "bool",
				name: "_allow",
				type: "bool"
			}],
			name: "allowClaimAfterHC",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function"
		}, {
			inputs: [{
				internalType: "address",
				name: "",
				type: "address"
			}],
			name: "balances",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "beneficiary",
			outputs: [{
				internalType: "address",
				name: "",
				type: "address"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [{
				internalType: "address",
				name: "_ref",
				type: "address"
			}],
			name: "buyToken",
			outputs: [],
			stateMutability: "payable",
			type: "function"
		}, {
			inputs: [],
			name: "canClaim",
			outputs: [{
				internalType: "bool",
				name: "",
				type: "bool"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [{
				internalType: "uint256",
				name: "_qty",
				type: "uint256"
			}],
			name: "checkAmount",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [{
				internalType: "uint256",
				name: "_payment",
				type: "uint256"
			}],
			name: "checkChange",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [{
				internalType: "uint256",
				name: "_payment",
				type: "uint256"
			}],
			name: "checkQty",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		},
		{
			inputs: [],
			name: "claim",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function"
		}, {
			inputs: [],
			name: "claimAfterHCAllowed",
			outputs: [{
				internalType: "bool",
				name: "",
				type: "bool"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "claimTermsFixed",
			outputs: [{
				internalType: "bool",
				name: "",
				type: "bool"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "claimTime",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "delay",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "endTime",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "ended",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "fixClaimTerms",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function"
		}, {
			inputs: [],
			name: "fixHardCap",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function"
		}, {
			inputs: [],
			name: "fixPurchaseLimit",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function"
		}, {
			inputs: [],
			name: "fixRate",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function"
		}, {
			inputs: [],
			name: "fixRefPercent",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function"
		}, {
			inputs: [],
			name: "fixSaleTime",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function"
		}, {
			inputs: [],
			name: "hardCapFixed",
			outputs: [{
				internalType: "bool",
				name: "",
				type: "bool"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "hardcap",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [{
				internalType: "uint256",
				name: "_delay",
				type: "uint256"
			}],
			name: "lockAfterHC",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function"
		}, {
			inputs: [],
			name: "makeUnpausable",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function"
		}, {
			inputs: [],
			name: "myTokens",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "owner",
			outputs: [{
				internalType: "address",
				name: "",
				type: "address"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "pausable",
			outputs: [{
				internalType: "bool",
				name: "",
				type: "bool"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "purchaseLimit",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "purchaseLimitFixed",
			outputs: [{
				internalType: "bool",
				name: "",
				type: "bool"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "rate",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		},
		{
			inputs: [],
			name: "rateFixed",
			outputs: [{
				internalType: "bool",
				name: "",
				type: "bool"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [{
				internalType: "address",
				name: "",
				type: "address"
			}],
			name: "refEarnings",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "refPercent",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "refPercentFixed",
			outputs: [{
				internalType: "bool",
				name: "",
				type: "bool"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "refTotal",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "remaining",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [{
				internalType: "address",
				name: "_buyer",
				type: "address"
			}],
			name: "remainingLimit",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "saleOn",
			outputs: [{
				internalType: "bool",
				name: "",
				type: "bool"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [{
				internalType: "bool",
				name: "_on",
				type: "bool"
			}],
			name: "saleOnOff",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function"
		}, {
			inputs: [],
			name: "saleTimeFixed",
			outputs: [{
				internalType: "bool",
				name: "",
				type: "bool"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [{
				internalType: "address",
				name: "_newBeneficiary",
				type: "address"
			}],
			name: "setBeneficiary",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function"
		}, {
			inputs: [{
				internalType: "uint256",
				name: "_claimTime",
				type: "uint256"
			}],
			name: "setClaimTime",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function"
		}, {
			inputs: [{
				internalType: "uint256",
				name: "_endTime",
				type: "uint256"
			}],
			name: "setEndTime",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function"
		}, {
			inputs: [{
				internalType: "uint256",
				name: "_hardcap",
				type: "uint256"
			}],
			name: "setHardcap",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function"
		}, {
			inputs: [{
				internalType: "uint256",
				name: "_amount",
				type: "uint256"
			}],
			name: "setLimit",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function"
		},
		{
			inputs: [{
				internalType: "address",
				name: "_newOwner",
				type: "address"
			}],
			name: "setOwner",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function"
		}, {
			inputs: [{
				internalType: "uint256",
				name: "_rate",
				type: "uint256"
			}],
			name: "setRate",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function"
		}, {
			inputs: [{
				internalType: "uint256",
				name: "_refPercent",
				type: "uint256"
			}],
			name: "setRefPercent",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function"
		}, {
			inputs: [{
				internalType: "uint256",
				name: "_startTime",
				type: "uint256"
			}],
			name: "setStartTime",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function"
		}, {
			inputs: [{
				internalType: "address",
				name: "",
				type: "address"
			}],
			name: "spendings",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "startTime",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "tokenAddress",
			outputs: [{
				internalType: "address",
				name: "",
				type: "address"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "tokenBalance",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "totalRaised",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "totalSold",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "unclaimed",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "withdrawBNB",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function"
		}, {
			inputs: [{
				internalType: "uint256",
				name: "_quantity",
				type: "uint256"
			}],
			name: "withdrawTokens",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function"
		}, {
			stateMutability: "payable",
			type: "receive"
		}
	],
	abiToken = [{
			inputs: [{
				internalType: "string",
				name: "_name",
				type: "string"
			}, {
				internalType: "string",
				name: "_symbol",
				type: "string"
			}, {
				internalType: "uint256",
				name: "_dec",
				type: "uint256"
			}, {
				internalType: "uint256",
				name: "_supply",
				type: "uint256"
			}, {
				internalType: "uint256",
				name: "_tax1",
				type: "uint256"
			}, {
				internalType: "address",
				name: "_address1",
				type: "address"
			}, {
				internalType: "uint256",
				name: "_tax2",
				type: "uint256"
			}, {
				internalType: "address",
				name: "_address2",
				type: "address"
			}, {
				internalType: "uint256",
				name: "_deflation",
				type: "uint256"
			}, {
				internalType: "uint256",
				name: "_minSupply",
				type: "uint256"
			}, {
				internalType: "address",
				name: "_owner",
				type: "address"
			}],
			stateMutability: "nonpayable",
			type: "constructor"
		}, {
			anonymous: !1,
			inputs: [{
					indexed: !0,
					internalType: "address",
					name: "owner",
					type: "address"
				},
				{
					indexed: !0,
					internalType: "address",
					name: "spender",
					type: "address"
				}, {
					indexed: !1,
					internalType: "uint256",
					name: "value",
					type: "uint256"
				}
			],
			name: "Approval",
			type: "event"
		}, {
			anonymous: !1,
			inputs: [{
				indexed: !0,
				internalType: "address",
				name: "from",
				type: "address"
			}, {
				indexed: !0,
				internalType: "address",
				name: "to",
				type: "address"
			}, {
				indexed: !1,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}],
			name: "Transfer",
			type: "event"
		}, {
			inputs: [],
			name: "addressTax1",
			outputs: [{
				internalType: "address",
				name: "",
				type: "address"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "addressTax2",
			outputs: [{
				internalType: "address",
				name: "",
				type: "address"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [{
				internalType: "address",
				name: "owner",
				type: "address"
			}, {
				internalType: "address",
				name: "spender",
				type: "address"
			}],
			name: "allowance",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [{
				internalType: "address",
				name: "spender",
				type: "address"
			}, {
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}],
			name: "approve",
			outputs: [{
				internalType: "bool",
				name: "",
				type: "bool"
			}],
			stateMutability: "nonpayable",
			type: "function"
		}, {
			inputs: [{
				internalType: "address",
				name: "owner",
				type: "address"
			}],
			name: "balanceOf",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "burnt",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "decimals",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "deflation",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "initialSupply",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "minSupply",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "name",
			outputs: [{
				internalType: "string",
				name: "",
				type: "string"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "symbol",
			outputs: [{
				internalType: "string",
				name: "",
				type: "string"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "tax1",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "tax2",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "totalSupply",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		},
		{
			inputs: [],
			name: "totalTax1",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [],
			name: "totalTax2",
			outputs: [{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}],
			stateMutability: "view",
			type: "function"
		}, {
			inputs: [{
				internalType: "address",
				name: "to",
				type: "address"
			}, {
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}],
			name: "transfer",
			outputs: [{
				internalType: "bool",
				name: "",
				type: "bool"
			}],
			stateMutability: "nonpayable",
			type: "function"
		}, {
			inputs: [{
				internalType: "address",
				name: "from",
				type: "address"
			}, {
				internalType: "address",
				name: "to",
				type: "address"
			}, {
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}],
			name: "transferFrom",
			outputs: [{
				internalType: "bool",
				name: "",
				type: "bool"
			}],
			stateMutability: "nonpayable",
			type: "function"
		}
	],
	network, curnet, tracker, myAddress, signer, provider;
$(function() {
	$("#buyBtn").prop("disabled", !0);
	getQR();
	connect()
});

function connect() {
	return $jscomp.asyncExecutePromiseGeneratorProgram(function(a) {
		provider = new ethers.providers.Web3Provider(window.ethereum, "any");
		provider.on("network", function(b, d) {
			d && getNetwork()
		});
		ethereum.on("accountsChanged", function(b) {
			getNetwork()
		});
		ethereum.on("connect", function(b) {
			getNetwork()
		});
		getNetwork();
		a.jumpToEnd()
	})
}

function getNetwork() {
	return $jscomp.asyncExecutePromiseGeneratorProgram(function(a) {
		if (1 == a.nextAddress) return a.yield(provider.getNetwork(), 2);
		network = a.yieldResult;
		curnet = network.chainId;
		curnet == mainnet || curnet == mainnetAlt ? ($("#curnet").html(mainnetname), $(".switch").hide(),
			tracker = trackerMain, getAddress(), init()) : curnet == testnet && 1 == test ? ($("#curnet")
			.html(testnetname), $(".switch").hide(), tracker = trackerTest, getAddress(), init()) : ($(
			"#curnet").html(wrongnet), $("#myAddr").html(""), $("#buyBtn").prop("disabled",
			!0), $(".switch").show());
		a.jumpToEnd()
	})
}

function getAddress() {
	var a;
	return $jscomp.asyncExecutePromiseGeneratorProgram(function(b) {
		switch (b.nextAddress) {
			case 1:
				return signer = provider.getSigner(), b.setCatchFinallyBlocks(2), b.yield(signer.getAddress(),
					4);
			case 4:
				myAddress = b.yieldResult;
				b.leaveTryBlock(3);
				break;
			case 2:
				a = b.enterCatchBlock(), console.log(a), !myAddress && window.ethereum && ethereum.request({
					method: "eth_requestAccounts"
				}).then(getNetwork);
			case 3:
				$("#myAddr").html(myAddress), myAddress ? ($("#buyBtn").prop("disabled", !1), $("#errors").html(
						""),
					$("#connect").hide()) : ($("#buyBtn").prop("disabled", !0), $("#errors").html(
					"Please connect to your wallet!"), $("#connect").show()), b.jumpToEnd()
		}
	})
}

function init() {
	var a, b, d, g, f, m, c, h, k, l, n, u, p, q, r, t, w, z, x, A, B, C, D, E, y, F, G, H;
	return $jscomp.asyncExecutePromiseGeneratorProgram(function(e) {
		switch (e.nextAddress) {
			case 1:
				return $(".status").hide(), $(".claimstatus").hide(), $("#referred").hide(), getUrlParams(), $(
						"#saleAddress").html(contractAddressSale), $("#saleAddress").attr("href", tracker +
						"address/" + contractAddressSale), $("#tokenAddress").html(contractAddressToken), $(
						"#tokenAddress").attr("href", tracker + "token/" + contractAddressToken), contractSale =
					new ethers.Contract(contractAddressSale,
						abiSale, provider), contractSaleSign = contractSale.connect(signer), contractToken =
					new ethers.Contract(contractAddressToken, abiToken, provider), e.yield(contractToken.name(),
						2);
			case 2:
				return a = e.yieldResult, $("#tokenName").html(a), e.yield(contractToken.symbol(), 3);
			case 3:
				return tokenSymbol = e.yieldResult, $(".tokenSymbol").html(tokenSymbol), e.yield(contractToken
					.decimals(), 4);
			case 4:
				return tokenDecimals = e.yieldResult, $("#tokenDecimals").html(Number(tokenDecimals)), e.yield(
					contractToken.totalSupply(), 5);
			case 5:
				return b =
					e.yieldResult, $("#tokenSupply").html(Number(ethers.utils.formatUnits(b, tokenDecimals))
						.toFixed(0)), e.yield(contractToken.balanceOf(myAddress), 6);
			case 6:
				return d = e.yieldResult, $("#myTokens").html(Number(ethers.utils.formatUnits(d,
					tokenDecimals))), e.yield(contractToken.balanceOf(contractAddressSale), 7);
			case 7:
				return g = e.yieldResult, $("#saleBalance").html(Number(ethers.utils.formatUnits(g,
					tokenDecimals))), e.yield(contractSale.rate(), 8);
			case 8:
				return rate = e.yieldResult, rateNoDec = ethers.utils.formatUnits(rate,
						tokenDecimals), $(".rate").html(rateNoDec), price = 1 / Number(rateNoDec), $(".price")
					.html(price), e.yield(contractSale.hardcap(), 9);
			case 9:
				return f = e.yieldResult, $(".hardcap").html(ethers.utils.formatEther(f)), e.yield(contractSale
					.checkQty(f), 10);
			case 10:
				return m = e.yieldResult, $(".saleqty").html(ethers.utils.formatUnits(m, tokenDecimals)), e
					.yield(contractSale.purchaseLimit(), 11);
			case 11:
				return c = e.yieldResult, $(".max").html(ethers.utils.formatEther(c)), e.yield(contractSale
					.refPercent(), 12);
			case 12:
				return h =
					e.yieldResult, $("#refPercent").html(Number(h) / 10), 0 == Number(h) && $("#refarea")
				.hide(), e.yield(contractSale.refTotal(), 13);
			case 13:
				return k = e.yieldResult, $("#refTotal").html(ethers.utils.formatEther(k)), e.yield(contractSale
					.refEarnings(myAddress), 14);
			case 14:
				return l = e.yieldResult, $("#refMy").html(ethers.utils.formatEther(l)), e.yield(contractSale
					.totalSold(), 15);
			case 15:
				return n = e.yieldResult, $("#sold").html(ethers.utils.formatUnits(n, tokenDecimals)), e.yield(
					contractSale.totalRaised(), 16);
			case 16:
				return u =
					e.yieldResult, $("#raised").html(ethers.utils.formatEther(u)), e.yield(contractSale
						.remaining(), 17);
			case 17:
				return p = e.yieldResult, remaining = ethers.utils.formatEther(p), $("#toraise").html(
					remaining), $("#progress").attr("max", f), $("#progress").attr("value", u), e.yield(
						contractSale.checkQty(p), 18);
			case 18:
				return unsold = e.yieldResult, $("#unsold").html(ethers.utils.formatUnits(unsold,
					tokenDecimals)), e.yield(contractSale.startTime(), 19);
			case 19:
				return q = e.yieldResult, r = new Date(1E3 * Number(q)), $("#start").html(r),
					e.yield(contractSale.endTime(), 20);
			case 20:
				return t = e.yieldResult, w = new Date(1E3 * Number(t)), $("#end").html(w), z = Number(w) -
					Number(r), $("#duration").html(dhm(z)), e.yield(contractSale.unclaimed(), 21);
			case 21:
				return x = e.yieldResult, $("#totalUnclaimed").html(ethers.utils.formatUnits(x, tokenDecimals)),
					e.yield(contractSale.myTokens({
						from: myAddress
					}), 22);
			case 22:
				return A = e.yieldResult, $("#myUnclaimed").html(Number(ethers.utils.formatUnits(A,
					tokenDecimals))), e.yield(contractSale.spendings(myAddress), 23);
			case 23:
				return B =
					e.yieldResult, $("#mySpendings").html(Number(ethers.utils.formatEther(B))), e.yield(
						contractSale.remainingLimit(myAddress), 24);
			case 24:
				return myRemaining = e.yieldResult, remainingme = ethers.utils.formatEther(myRemaining), $(
					"#myRemaining").html(Number(remainingme)), e.yield(contractSale.claimTime(), 25);
			case 25:
				return C = e.yieldResult, D = new Date(1E3 * Number(C)), $("#claimtime").html(D), e.yield(
					contractSale.claimAfterHCAllowed(), 26);
			case 26:
				return E = e.yieldResult, e.yield(contractSale.delay(), 27);
			case 27:
				return y =
					e.yieldResult, E ? 0 < y ? ($("#canhcdelayh").html(dhm(1E3 * Number(y))), $("#canhcdelay")
						.show()) : $("#canhc").show() : $("#cannothc").show(), e.yield(contractSale.canClaim(),
						28);
			case 28:
				return (F = e.yieldResult) ? ($("#claimok").show(), $("#claim").prop("disabled", !1)) : ($(
					"#claimnotok").show(), $("#claim").prop("disabled", !0)), e.yield(contractSale.saleOn(),
					29);
			case 29:
				saleOn = e.yieldResult, Date.now() > 1E3 * Number(t) || 0 == Number(unsold) ? ($("#finished")
						.show(), $("#buyBtn").prop("disabled", !0), F ? $("#unlocked").show() : $("#locked")
						.show(),
						Number(g) < Number(x) && $("#addtokens").show()) : Date.now() < 1E3 * Number(q) ? ($(
							"#upcoming").show(), $("#buyBtn").prop("disabled", !0), $("#upcomingtimer").show(),
						G = setInterval(function() {
							var v = Number(r) - Date.now();
							$("#starttimer").html(dhms(v));
							0 > v && (clearInterval(G), init())
						}, 1E3), Number(g) < Number(unsold) && $("#addtokens").show()) : Date.now() > 1E3 *
					Number(q) && Date.now() < 1E3 * Number(t) && (saleOn ? ($("#active").show(), $("#buyBtn")
							.prop("disabled", !1), $("#activetimer").show(), H = setInterval(function() {
								var v = Number(w) -
									Date.now();
								$("#endtimer").html(dhms(v));
								0 > v && (clearInterval(H), init())
							}, 1E3)) : ($("#paused").show(), $("#buyBtn").prop("disabled", !0)), Number(g) <
						Number(unsold) && $("#addtokens").show()), $("#status").html(void 0), referralLink(), e
					.jumpToEnd()
		}
	})
}
$("#buyAmount").on("keyup input", calcTokens);

function calcTokens() {
	var a = $("#buyAmount").val();
	0 < Number(a) ? (a = Number(a) * Number(rateNoDec), $("#get").html(Number(a))) : $("#get").html(Number(0))
}
$("#copyaddress").on("click", function() {
	copyToClipboard("#saleAddress")
});

function copyToClipboard(a) {
	var b = $("<textarea>");
	$("body").append(b);
	b.val($(a).val()).select();
	document.execCommand("copy");
	b.remove()
}

function getQR() {
	var a = encodeURIComponent(contractAddressSale);
	$("#saleqr").html('<img style="max-width: 80%" src="https://dappbuilder.org/php/qr.php?data=' + a + '">')
}
$("#buyBtn").click(function() {
	var a, b;
	return $jscomp.asyncExecutePromiseGeneratorProgram(function(d) {
		if (1 == d.nextAddress) {
			a = $("#buyAmount").val();
			if (!("" !== a && 0 < Number(a))) return d.jumpTo(0);
			b = ethers.utils.parseEther(a);
			return d.yield(contractSaleSign.buyToken(String(refLink), {
				value: b
			}), 3)
		}
		if (4 != d.nextAddress) return tx = d.yieldResult, d.yield(tx.wait(), 4);
		init();
		d.jumpToEnd()
	})
});
$("#claim").click(function() {
	return $jscomp.asyncExecutePromiseGeneratorProgram(function(a) {
		if (1 == a.nextAddress) return myAddress ? a.yield(contractSaleSign.claim(), 3) : a.jumpTo(0);
		if (4 != a.nextAddress) return tx = a.yieldResult, a.yield(tx.wait(), 4);
		init();
		a.jumpToEnd()
	})
});
$("#addToken").click(function() {
	return $jscomp.asyncExecutePromiseGeneratorProgram(function(a) {
		ethereum.request({
			method: "wallet_watchAsset",
			params: {
				type: "ERC20",
				options: {
					address: String(contractAddressToken),
					symbol: String(tokenSymbol),
					decimals: Number(tokenDecimals)
				}
			}
		});
		a.jumpToEnd()
	})
});
$("#connect").on("click", function() {
	var a;
	return $jscomp.asyncExecutePromiseGeneratorProgram(function(b) {
		if (1 == b.nextAddress) {
			if (!window.ethereum) return $("#nometamask").fadeIn(1E3).fadeOut(1E3), b.jumpTo(0);
			b.setCatchFinallyBlocks(3);
			return b.yield(ethereum.request({
				method: "eth_requestAccounts"
			}), 5)
		}
		if (3 != b.nextAddress) return b.leaveTryBlock(0);
		a = b.enterCatchBlock();
		console.error(a);
		b.jumpToEnd()
	})
});

function dhm(a) {
	days = Math.floor(a / 864E5);
	daysms = a % 864E5;
	hours = Math.floor(daysms / 36E5);
	hoursms = a % 36E5;
	minutes = Math.floor(hoursms / 6E4);
	minutesms = a % 6E4;
	sec = Math.floor(minutesms / 1E3);
	return days + " days " + hours + " hours " + minutes + " minutes"
}

function dhms(a) {
	days = Math.floor(a / 864E5);
	daysms = a % 864E5;
	hours = Math.floor(daysms / 36E5);
	hoursms = a % 36E5;
	minutes = Math.floor(hoursms / 6E4);
	minutesms = a % 6E4;
	sec = Math.floor(minutesms / 1E3);
	return days + " days " + hours + " hours " + minutes + " minutes " + sec + " seconds"
}
$("#copyreflink").on("click", function() {
	copyToClipboard("#referLink")
});

function getRefQR() {
	var a = encodeURIComponent($("#referLink").val());
	$("#refqr").html('<img style="width: 300px; max-width: 80%" src="https://dappbuilder.org/php/qr.php?data=' + a +
		'">')
}

function getUrlParams() {
	var a = new URLSearchParams(window.location.search);
	!0 === a.has("ref") && "" !== a.get("ref") && ethers.utils.isAddress(a.get("ref")) ? (refLink = a.get("ref"), $(
		"#referrer").html(refLink), $("#referred").show()) : ($("#referrer").html("none"), $("#referred").hide(),
		refLink = "0x0000000000000000000000000000000000000000")
}

function referralLink() {
	myAddress ? ($("#referLink").val(window.location.href.split("?")[0] + "?ref=" + myAddress), $("#copyreflink").prop(
		"disabled", !1), $("#refqr").show(), $("#refd").show(), $("#refErr").hide(), getRefQR()) : ($(
		"#copyreflink").prop("disabled", !0), $("#refqr").hide(), $("#refd").hide(), $("#refErr").show())
}
$("#copyToken").on("click", function() {
	var a = $("<textarea>");
	$("body").append(a);
	a.val($("#tokenAddress").html()).select();
	document.execCommand("copy");
	a.remove()
});
$("#copySale").on("click", function() {
	var a = $("<textarea>");
	$("body").append(a);
	a.val($("#saleAddress").html()).select();
	document.execCommand("copy");
	a.remove()
});
$("#addMainBSC").click(toBSCMainnet);
var mainBSC = {
	chainId: "0x38",
	chainName: "Binance Smart Chain Mainnet",
	nativeCurrency: {
		name: "Binance Coin",
		symbol: "BNB",
		decimals: 18
	},
	rpcUrls: ["https://bsc-dataseed.binance.org/"],
	blockExplorerUrls: ["https://bscscan.com"]
};

function toBSCMainnet() {
	return $jscomp.asyncExecutePromiseGeneratorProgram(function(a) {
		window.ethereum ? ethereum.request({
			method: "wallet_addEthereumChain",
			params: [mainBSC]
		})["catch"](function(b) {
			return console.log(b.message)
		}) : $("#nometamask").fadeIn(1E3).fadeOut(1E3);
		a.jumpToEnd()
	})
}
$("#addTestBSC").click(toBSCTestnet);
var testBSC = {
	chainId: "0x61",
	chainName: "Binance Smart Chain Testnet",
	nativeCurrency: {
		name: "Binance Coin",
		symbol: "BNB",
		decimals: 18
	},
	rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
	blockExplorerUrls: ["https://testnet.bscscan.com"]
};

function toBSCTestnet() {
	return $jscomp.asyncExecutePromiseGeneratorProgram(function(a) {
		window.ethereum ? ethereum.request({
			method: "wallet_addEthereumChain",
			params: [testBSC]
		})["catch"](function(b) {
			return console.log(b.message)
		}) : $("#nometamask").fadeIn(1E3).fadeOut(1E3);
		a.jumpToEnd()
	})
};
