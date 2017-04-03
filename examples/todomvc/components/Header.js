import { Block } from 'feast'
import TodoTextInput from './TodoTextInput'

export default class Header extends Block {
  static blockName = 'header'
  static blocks = {
    'todo-text-input': TodoTextInput
  }
  
  static events = {
    'add': 'handleAdd'
  }

  static template = `<header class="header">
    <h1>todos</h1>
    <b:todo-text-input
      new-todo
      remit:save="add"
      placeholder="What needs to be done?"
    />
  </header>
  `

  handleAdd(evt) {
    const text = evt.details.value;
    
    if (text.length !== 0) {
      this.attrs['add-todo'](text)
    }
  }
}


