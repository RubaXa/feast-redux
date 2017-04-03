import { Block } from 'feast'
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters'

const FILTER_TITLES = {
  [SHOW_ALL]: 'All',
  [SHOW_ACTIVE]: 'Active',
  [SHOW_COMPLETED]: 'Completed'
}

export default class Footer extends Block {
  static blockName = 'footer'
  static template =`<footer class="footer">
    <span class="todo-count">
       <strong><fn:value>attrs['active-count'] || 'No'</fn:value></strong>
       <fn:value>' '</fn:value>
       <fn:value>attrs['active-count'] === 1 ? 'item' : 'items'</fn:value> left
    </span>
      
    <ul class="filters">
      <fn:for data="_this.FILTER_TITLES" key="filter">
        <li key="{filter}">
          <a style="cursor: pointer" remit:click="setfilter" event:details="{name: filter}">
            <fn:add-class name="selected" test="filter === attrs.filter"/>
            <fn:value>_this.FILTER_TITLES[filter]</fn:value>
          </a>
        </li>
      </fn:for>
    </ul>
    
    <button
       fn:if="attrs['completed-count'] > 0"
       class="clear-completed"
       remit:click="clearcompleted"
    >
         Clear completed
    </button>
  </footer>`

  FILTER_TITLES = FILTER_TITLES
}
