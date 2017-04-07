import { configure, Block } from 'feast'

const ENTER_KEY = 13;

@configure({
  name: 'todo-text-input',
  events: {
    'typing': 'handleTyping',
    'submit': 'handleSubmit'
  },
  template: `<input
      type="text"
      autofocus
      placeholder="{attrs.placeholder}"
      value="{attrs.value}"
      remit:input="typing"
      remit:keydown="submit"
    >
    <fn:add-class name="edit" test="attrs.editing"/>
    <fn:add-class name="new-todo" test="attrs['new-todo']"/>
  </input>`
})
export default class TodoTextInput extends  Block {
  handleTyping(evt) {
    this.set('value', evt.target.value.trim())
  }

  handleSubmit(evt) {
    const value = this.attrs.value

    if (evt.originalEvent.which === ENTER_KEY) {
      this.broadcast('save', { value }, evt)
      this.set('value', '')
    }

    return true
  }
}
