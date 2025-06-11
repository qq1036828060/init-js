/**
 * v-color  
 * 颜色指令
 */
import { Directive, DirectiveBinding } from "vue";

const color = {
  mounted(el, binding) {
    const { value } = binding;
    el.style.color = value;
  }
};

export default color;
