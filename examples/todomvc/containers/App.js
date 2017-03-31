import feast, { Block } from 'feast'
import { bindActionCreators } from 'redux'
import { connect } from 'feast-redux'
import Header from '../components/Header'
import MainSection from '../components/MainSection'
import * as TodoActions from '../actions'

class App extends Block {
  static blockName = 'app'

  static blocks = {
    'header': Header,
    'main-section': MainSection
  }
  
  static template = `<div>
    <b:header add-todo="{attrs.actions.addTodo}" />
    <b:main-section todos="{attrs.todos}" actions="{attrs.actions}" />
  </div>`
}

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
