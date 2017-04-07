import { configure, Block } from 'feast'
import { bindActionCreators } from 'redux'
import { connect } from 'feast-redux'
import Header from '../components/Header'
import MainSection from '../components/MainSection'
import * as TodoActions from '../actions'

@configure({
  name: 'app',
  blocks: {
    'header': Header,
    'main-section': MainSection,
  },
  template: `<div>
    <b:header add-todo="{attrs.actions.addTodo}" />
    <b:main-section todos="{attrs.todos}" actions="{attrs.actions}" />
  </div>`,
})
class App extends Block { }

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
