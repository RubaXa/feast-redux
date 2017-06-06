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
		const HOC = class ReduxConnectDecorator extends UIFeastClass {
			constructor(attrs, context) {
				super(prepareAttrs(attrs, context.store), context);

				const eventsToActions = (this.constructor.eventsToActions || this.eventsToActions || {});

				Object.keys(eventsToActions).forEach((eventName) => {
					this.on(eventName, (evt) => {
						const decl = eventsToActions[eventName];
						const args = decl.arguments ? [].concat(decl.arguments(this, evt)) : [];

						this.context.store.dispatch(decl.action.apply(null, args));
					});
				});

				this.unsibscribeHandleReduxStoreChanged = context.store.subscribe(this.handleReduxStoreChanged.bind(this));
			}

			handleReduxStoreChanged() {
				this.set({});
			}

			set(attrs) {
				super.set(prepareAttrs(attrs, this.context.store));
			}

			destroy() {
				super.destroy.apply(this, arguments);
				this.unsibscribeHandleReduxStoreChanged();
			}
		};

		HOC.prototype.name = `${UIFeastClass.blockName || UIFeastClass.prototype.name}Connect`;

		return HOC;
	}
}
