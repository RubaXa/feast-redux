import feast from 'feast'
import TodoItem from './TodoItem'
import Footer from './Footer'
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters'

const TODO_FILTERS = {
  [SHOW_ALL]: () => true,
  [SHOW_ACTIVE]: todo => !todo.completed,
  [SHOW_COMPLETED]: todo => todo.completed
}

const MainSection = feast.Block.extend({
  name: 'main-section',

  TODO_FILTERS,

  blocks: {
    'todo-item': TodoItem,
    'footer': Footer
  },

  defaults: {
    filter: SHOW_ALL
  },

  events: {
    'show': 'handleShow',
    'clear-completed': 'handleClearCompleted'
  },

  template: `<section class="main">
    <fn:var name="completedCount" value="{_this.getCompletedCount()}"/>
    <fn:var name="activeCount" value="{attrs.todos.length - completedCount}"/>
    
    <input
      fn:if="attrs.todos.length > 0"
      class="toggle-all"
      type="checkbox"
      checked="{completedCount === attrs.todos.length}"
      on-change="attrs.actions.completeAll()"
     />
    
    <ul class="todo-list">
      <fn:for data="attrs.todos" as="todo" filter="_this.TODO_FILTERS[attrs.filter]">
        <b:todo-item
          key="{todo.id}"
          todo="{todo}"
          on-update="attrs.actions.editTodo(todo.id, evt.details.value)"
          on-complete="attrs.actions.completeTodo(todo.id)"
          on-delete="attrs.actions.deleteTodo(todo.id)"
        />
      </fn:for>
    </ul>
    
    <b:footer
        active-count="{activeCount}"
        completed-count="{completedCount}"
        filter="{attrs.filter}"
        on-setfilter="_this.handleShow(evt.details.name)"
        on-clearcompleted="_this.handleClearCompleted()"
     />
  </section>`,

  handleClearCompleted() {
    this.attrs.actions.clearCompleted()
  },

  handleShow(filter) {
    this.set({ filter })
  },

  getCompletedCount() {
    return this.attrs.todos.reduce((count, todo) => todo.completed ? count + 1 : count, 0);
  }
})

export default MainSection
