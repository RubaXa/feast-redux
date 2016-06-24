import feast from 'feast'
import { bindActionCreators } from 'redux'
import { connect } from 'feast-redux'
import Header from '../components/Header'
import MainSection from '../components/MainSection'
import * as TodoActions from '../actions'

const App = feast.Block.extend({
  name: 'app',
  performanceTrace: true,
  
  blocks: {
    'header': Header,
    'main-section': MainSection
  },
  
  template: `<div>
    <b:header add-todo="{attrs.actions.addTodo}" />
    <b:main-section todos="{attrs.todos}" actions="{attrs.actions}" />
  </div>`
});

function mapStateToAttrs(state) {
  return {
    todos: state.todos
  }
}

function mapDispatchToAttrs(dispatch) {
  return {
    actions: bindActionCreators(TodoActions, dispatch)
  }
}

export default connect(
  mapStateToAttrs,
  mapDispatchToAttrs
)(App)
