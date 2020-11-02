// @ts-nocheck
import { shallowMount, createLocalVue } from '@vue/test-utils'
import FDTabStrip from './index.vue'
import { TabStrip } from '@/FormDesigner/models/TabStrip.ts'
import store from '@/store/index.ts'

const propsObj = {
  userFormId: 'ID_USERFORM1',
  controlData: TabStrip,
  controlId: 'ID_TabStrip1',
  containerId: 'ID_USERFORM1'
}

const factory = (propsArg: Object) => {
  return shallowMount(FDTabStrip, {
    propsData: {
      ...propsObj,
      ...propsArg
    },
    store
  })
}

describe('FDTabStrip.vue', () => {
  describe('render and default test', () => {
    const testWrapper = factory(propsObj)
    it('instance test', () => {
      expect(testWrapper.isVueInstance()).toBe(true)
    })
  })
  describe('necessary things check test', () => {
    const testWrapper = factory(propsObj)
    it('name test', () => {
      expect(testWrapper.name()).toBe('FDTabStrip')
    })
    it('propControlData test', () => {
      expect(testWrapper.vm.propControlData).not.toBeUndefined()
    })
  })
  describe('event test', () => {
    const testWrapper = factory(propsObj)
    it('click test', () => {
      testWrapper.trigger('click')
    })
    it('keydown delete test', () => {
      testWrapper.trigger('keydown.delete')
    })
  })
  describe('tabStrip prop test', () => {
    factory(propsObj)
  })
})
