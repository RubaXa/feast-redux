import { configure, Block } from 'feast'
import TodoTextInput from './TodoTextInput'

@configure({
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
  </header>`,
})
export default class Header extends Block {
  handleAdd(evt) {
    const text = evt.details.value;
    
    if (text.length !== 0) {
      this.attrs['add-todo'](text)
    }
  }
}


