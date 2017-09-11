import Vue from 'vue'
import writer from '@/components/writer'

describe('writer.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(writer)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('#content').to.equal(''))
  })
})
