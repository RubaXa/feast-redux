function defaultMapStateToAttrs(state) {
	return state;
}

function defaultMapDispatchToAttrs(dispatch) {
	return {dispatch};
}

function defaultMergeAttrs(stateAttrs, dispatchAttrs, ownAttrs) {
	return {
		...ownAttrs,
		...stateAttrs,
		...dispatchAttrs
	};
}

export function connect(mapStateToAttrs, mapDispatchToAttrs, mergeAttrs) {
	mapStateToAttrs = mapStateToAttrs || defaultMapStateToAttrs;
	mapDispatchToAttrs = mapDispatchToAttrs || defaultMapDispatchToAttrs;
	mergeAttrs = mergeAttrs || defaultMergeAttrs;

	function prepareAttrs(attrs, store) {
		return mergeAttrs(
			mapStateToAttrs(store.getState()),
			mapDispatchToAttrs(store.dispatch),
			attrs
		);
	}

	return function ConnectDecorator(UIFeastClass) {
		const _super = UIFeastClass.prototype;

		return UIFeastClass.extend({
			name: UIFeastClass.prototype.name,

			constructor(attrs, context) {
				_super.constructor.call(this, prepareAttrs(attrs, context.store), context);
				this.unsibscribeHandleStoreChnaged = context.store.subscribe(this.handleStoreChnaged.bind(this));
				
				const eventsToActions = this.eventsToActions || {};

				Object.keys(eventsToActions).forEach((eventName) => {
					this.on(eventName, (evt) => {
						const decl = eventsToActions[eventName];
						const args = decl.arguments ? [].concat(decl.arguments(this, evt)) : [];
						
						this.context.store.dispatch(decl.action.apply(null, args));
					});
				});
			},

			set(attrs) {
				_super.set.call(this, prepareAttrs(attrs, this.context.store));
			},

			handleStoreChnaged() {
				this.set({});
			},

			destroy() {
				this.unsibscribeHandleStoreChnaged();
			}
		});
	}
}
