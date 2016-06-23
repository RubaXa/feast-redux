Feast Redux
-----------

Experimental Feast bindings for [Redux](https://github.com/reactjs/redux).


```js
// ./blocks/app.js
import feast from 'feast';
import {connect} from 'feast-redux';
import template from './app.html';
import {singin} from '../path/to/actions';

const UIApp = feast.Block.extend({
	name: 'app',
	template,
	eventsToActions: {
		'remited-event-name': {
			action: singin,
			arguments: (app, evt) => [app.refs.login.value, app.refs.password.value]
		}
	}
});

export default connect(
	(state) => state, // mapStateToAttrs
	(dispatch) => ({dispatch}) // mapDispatchToProps
)(UIApp);
```
