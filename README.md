Feast Redux
-----------

Experimental Feast bindings for [Redux](https://github.com/reactjs/redux).


### Examples

 - [TodoMVC](./examples/todomvc/) — [redux/todomvc](https://github.com/reactjs/redux/tree/master/examples/todomvc)—port


### Usage

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
	(dispatch) => ({dispatch}) // mapDispatchToAttrs
)(UIApp);

// index.js
import App from './blocks/app.js';
import configureStore from './store/configureStore';

const store = configureStore();

new App({}, {store}).renderTo(document.getElementById('root'));
```
