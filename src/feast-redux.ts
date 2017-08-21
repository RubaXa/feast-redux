import { Block, BlockConstructor, IFeastBlockContext } from 'feast';
import * as Redux from 'redux';

export declare type DispatchAttrs<S> = {
	dispatch: Redux.Dispatch<S>;
};

export declare type StoreContext<S> = {
	store: Redux.Store<S>;
}

export declare type MapStateToAttrs = <S>(state: S, ownAttrs: any) => S;
export declare type MapDispatchToAttrs = <S>(dispatch: Redux.Dispatch<S>, ownAttrs: any) => DispatchAttrs<S>;
export declare type MergeAttrs = <S>(stateAttrs: any, dispatchAttrs: any, ownAttrs: any) => S;

function defaultMapStateToAttrs<S> (state: S): S {
	return state;
}

function defaultMapDispatchToAttrs<S> (dispatch: Redux.Dispatch<S>): DispatchAttrs<S> {
	return {dispatch};
}

function defaultMergeAttrs<S> (stateAttrs: any, dispatchAttrs: any, ownAttrs: any): S {
	return {
		...ownAttrs,
		...stateAttrs,
		...dispatchAttrs
	};
}

export declare interface ReduxedBlock<A, S> extends Block<A & DispatchAttrs<S>> {
	readonly dispatch: Redux.Dispatch<S>;
	unsibscribeHandleReduxStoreChanged: Function;
	eventsToActions?: { [event: string]: any };
}

export declare interface ReduxedBlockConstructor<A> {
	new<S>(attrs: Partial<A>, context: StoreContext<S>): ReduxedBlock<A, S>;
}

export function connect (mapStateToAttrs?: MapStateToAttrs | null, mapDispatchToAttrs?: MapDispatchToAttrs | null, mergeAttrs?: MergeAttrs | null): <A>(UIFeastClass: BlockConstructor<A>) => ReduxedBlockConstructor<A> {
	const mapStateToAttrsReal: MapStateToAttrs = mapStateToAttrs || defaultMapStateToAttrs;
	const mapDispatchToAttrsReal: MapDispatchToAttrs = mapDispatchToAttrs || defaultMapDispatchToAttrs;
	const mergeAttrsReal = mergeAttrs || defaultMergeAttrs;

	function prepareAttrs<S> (ownAttrs: any, store: Redux.Store<S>) {
		return mergeAttrsReal(
			mapStateToAttrsReal(store.getState(), ownAttrs),
			mapDispatchToAttrsReal(store.dispatch, ownAttrs),
			ownAttrs
		);
	}

	return function ConnectDecorator<A> (UIFeastClass: BlockConstructor<A>): ReduxedBlockConstructor<A> {
		const HOC: ReduxedBlockConstructor<A> = class ReduxConnectDecorator<S> extends UIFeastClass {
			unsibscribeHandleReduxStoreChanged: Function;
			eventsToActions?: { [event: string]: any };
			context: StoreContext<S> & IFeastBlockContext;
			attrs: A & DispatchAttrs<S>;
			defaults: A & DispatchAttrs<S>;
			props: A & DispatchAttrs<S>;
			readonly dispatch: Redux.Dispatch<S>;

			constructor (attrs: A, context: StoreContext<S>) {
				super(prepareAttrs(attrs, context.store), context);

				this.dispatch = context.store.dispatch.bind(context.store);

				const eventsToActions = ((this.constructor as any).eventsToActions || this.eventsToActions || {});

				Object.keys(eventsToActions).forEach((eventName) => {
					this.on(eventName, (evt) => {
						const decl = eventsToActions[eventName];
						const args = decl.arguments ? [].concat(decl.arguments(this, evt)) : [];

						this.context.store.dispatch(decl.action.apply(null, args));
					});
				});

				this.unsibscribeHandleReduxStoreChanged = context.store.subscribe(this.handleReduxStoreChanged.bind(this));
			}

			handleReduxStoreChanged () {
				this.set({});
			}

			set (attrs: Partial<A>) {
				super.set(prepareAttrs(attrs, this.context.store));
				return this;
			}

			destroy () {
				super.destroy.apply(this, arguments);
				this.unsibscribeHandleReduxStoreChanged();
			}
		};

		const name = (UIFeastClass as any).blockName || UIFeastClass.prototype.name;
		(HOC.prototype as any).name = `${name}ReduxConnected`;
		(HOC.prototype as any).rootClassName = name;

		return HOC;
	}
}
