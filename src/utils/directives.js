export const clickaway = {
  bind (el, binding) {
    console.log('clickaway init', binding)
    binding.event = function (event) {
      console.log('clickaway')
      binding.value()
    }
    el.addEventListener('click', binding.stopProp)
    document.body.addEventListener('click', binding.event)
  },
  unbind (el, binding) {
    el.removeEventListener('click', binding.stopProp)
    document.body.removeEventListener('click', binding.event)
  },
  stopProp (event) { event.stopPropagation() }
}
