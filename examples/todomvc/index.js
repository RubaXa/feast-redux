import 'babel-polyfill'
import App from './containers/App'
import configureStore from './store/configureStore'
import 'todomvc-app-css/index.css'

const store = configureStore()

new App({}, {store}).renderTo(document.getElementById('root'))
