(function (enyo, scope) {

	enyo.singleton(
		/** @lends enyo.System */ {

		/**
		* @private
		*/
		name: 'enyo.System',

		/**
		* @private
		*/
		kind: 'enyo.Object',

		/**
		* @private
		*/
		idleThreshold: 2000,

		/**
		* @private
		*/
		userEvents: [
			'onmousemove',
			'ontap'
		],

		/**
		* @private
		*/
		activityHandlers: [],

		/**
		* @private
		*/
		components: [
			{kind: 'enyo.Signals', onkeydown: 'handleUserAction'}
		],

		/**
		* Starts observing the system for idleness.
		*
		* @public
		*/
		startIdleCheck: function () {
			this.previewDomEvent = this.checkEvent;
		},

		/**
		* Ends observation of the system for idleness.
		*
		* @public
		*/
		stopIdleCheck: function () {
			this.previewDomEvent = this.nop;
		},

		/**
		* Add a callback to be run when the system is no longer idle.
		*
		* @param {Function} handler - The callback that will be run when the system is no longer
		*	idle.
		* @public
		*/
		addActivityHandler: function (handler) {
			this.activityHandlers.push(handler);
		},

		/**
		* Determine if the system is idle or not.
		*
		* @return {Boolean} If `true`, the system is idle, `false` otherwise.
		* @public
		*/
		isIdle: function () {
			// TODO check framerate, mouse movement, etc.
			// check last idle time with some sensible threshold
			return enyo.perfNow() - this._lastIdle > this.idleThreshold;
		},

		/**
		* @private
		*/
		handleUserAction: function () {
			this._idleCheckJob = scope.setTimeout(function () {
				// execute any interrupt handlers
				for (var idx = 0; idx < this.activityHandlers.length; idx++) {
					this.activityHandlers[idx]();
				}
				this.lastIdle = enyo.perfNow();
				this._idleCheckJob = null;
			}, 32);
		},

		/**
		* @private
		*/
		previewDomEvent: enyo.nop,

		/**
		* @private
		*/
		checkEvent: function (ev) {
			if (this.userEvents.indexOf(ev.type) >= 0) {
				this.lastIdle = enyo.perfNow();
			}
		}

	});

})(enyo, this);