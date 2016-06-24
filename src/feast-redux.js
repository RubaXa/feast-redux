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

	function prepareAttrs(ownAttrs, store) {
		return mergeAttrs(
			mapStateToAttrs(store.getState(), ownAttrs),
			mapDispatchToAttrs(store.dispatch, ownAttrs),
			ownAttrs
		);
	}

	return function ConnectDecorator(UIFeastClass) {
		const _super = UIFeastClass.prototype;

		return UIFeastClass.extend({
			name: UIFeastClass.prototype.name,

			constructor(attrs, context) {
				_super.constructor.call(this, prepareAttrs(attrs, context.store), context);
				this.unsibscribeHandleReduxStoreChanged = context.store.subscribe(this.handleReduxStoreChanged.bind(this));
				
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

			handleReduxStoreChanged() {
				this.set({});
			},

			destroy() {
				_super.destroy.apply(this, arguments);
				this.unsibscribeHandleReduxStoreChanged();
			}
		});
	}
}
