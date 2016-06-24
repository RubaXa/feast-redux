import feast from 'feast'
import TodoTextInput from './TodoTextInput'

const Header = feast.Block.extend({
  name: 'header',

  blocks: {
    'todo-text-input': TodoTextInput
  },
  
  events: {
    'add': 'handleAdd'
  },

  template: `<header class="header">
    <h1>todos</h1>
    <b:todo-text-input
      new-todo
      remit:save="add"
      placeholder="What needs to be done?"
    />
  </header>
  `,

  handleAdd(evt) {
    const text = evt.details.value;
    
    if (text.length !== 0) {
      this.attrs['add-todo'](text)
    }
  }
})

export default Header
