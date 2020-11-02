// @ts-nocheck
import { shallowMount, createLocalVue } from '@vue/test-utils'
import ToolBox from './index.vue'
import store from '@/store/index.ts'

const propsObj = {
  userFormId: 'ID_USERFORM1',
  controlId: 'ID_Label1',
  containerId: 'ID_USERFORM1'
}

const factory = (propsArg: Object) => {
  return shallowMount(ToolBox, {
    propsData: {
      ...propsObj,
      ...propsArg
    },
    store
  })
}

describe('FDToolBox', () => {
  describe('render and default test', () => {
    const testWrapper = factory(propsObj)
    it('instance test', () => {
      expect(testWrapper.isVueInstance()).toBe(true)
    })
  })
  describe('necessary things check test', () => {
    const testWrapper = factory(propsObj)
    it('name test', () => {
      expect(testWrapper.name()).toBe('FDLabel')
    })
    it('propControlData test', () => {
      expect(testWrapper.vm.propControlData).not.toBeUndefined()
    })
  })
  describe('event test', () => {
    const testWrapper = factory(propsObj)
    it('keydown delete test', () => {
      testWrapper.trigger('click')
    })
    it('click test', () => {
      testWrapper.trigger('keydown.delete')
    })
  })

  describe('label prop test', () => {
    const testWrapper = factory(propsObj)
    it('propControlData null test', () => {
      expect(testWrapper.vm.propControlData).not.toBeNull()
    })
  })
})
