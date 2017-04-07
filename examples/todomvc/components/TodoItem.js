import { configure, Block } from 'feast'
import TodoTextInput from './TodoTextInput'

@configure({
  name: 'todo-item',
  blocks: {
    'todo-text-input': TodoTextInput
  },
  template: `<li>
    <fn:add-class name="completed" test="attrs.todo.completed"/>
    <fn:add-class name="editing" test="attrs.editing"/>
    <fn:choose>
      <!-- Edit mode -->
      <fn:when test="attrs.editing">
        <b:todo-text-input
          editing
          value="{attrs.todo.text}"
          on-save="_this.handleSave(attrs.todo.id, evt.details.value)"
        />
      </fn:when>
      
      <!-- View mode -->
      <fn:otherwise>
        <div class="view">
          <input
            class="toggle"
            type="checkbox"
            checked="{attrs.todo.completed}"
            remit:change="complete"
          />
          
          <label on-dblclick="_this.handleDoubleClick()">
            <fn:value>attrs.todo.text</fn:value>
          </label>
          
          <button class="destroy" remit:click="delete" />
        </div>
      </fn:otherwise>
    </fn:choose>
  </li>`,
})
export default class TodoItem extends Block {
  handleDoubleClick() {
    this.set({ editing: true })
  }

  handleSave(id, value) {
    if (value.length === 0) {
      this.broadcast('delete')
    } else {
      this.broadcast('update', {value})
    }
    this.set({ editing: false })
  }
}
