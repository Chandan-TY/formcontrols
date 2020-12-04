// @ts-nocheck
import { shallowMount } from '@vue/test-utils'
import FDFrame from './index.vue'
import store from '@/store/index.ts'
import { ControlPropertyData } from '../../../models/ControlsTableProperties/ControlPropertyData'

const controlObj = new ControlPropertyData()
const frame2 = controlObj.data.Frame
const propsObj = {
  userFormId: 'ID_USERFORM1',
  controlId: 'ID_Frame1',
  containerId: 'ID_USERFORM1'
}

const factory = (propsArg: Object) => {
  return shallowMount(FDFrame, {
    propsData: {
      ...propsObj,
      ...propsArg
    },
    store
  })
}

describe('FDFrame.vue', () => {
  describe('render and default test', () => {
    const testWrapper = factory({ data: frame2 })
    it('instance test', () => {
      expect(testWrapper.isVueInstance()).toBe(true)
    })
  })
  describe('necessary things check test', () => {
    const testWrapper = factory({ data: frame2 })
    it('name test', () => {
      expect(testWrapper.name()).toBe('FDFrame')
    })
    it('propControlData test', () => {
      expect(testWrapper.props().data).not.toBeUndefined()
    })
  })
  describe('event test', () => {
    const testWrapper = factory({ data: frame2 })
    it('click test', () => {
      testWrapper.trigger('click')
    })
    it('delete test', () => {
      testWrapper.trigger('keydown.delete')
    })
  })
  describe('frame prop test', () => {
    const testWrapper = factory({ data: frame2 })
    it('controlId test', () => {
      expect(testWrapper.props().controlId).toMatch(`ID_Frame1`)
      expect(testWrapper.props().controlId).toBeDefined()
      expect(testWrapper.props().controlId).not.toBeNull()
    })
    const otherFrame = { ...frame2 }
    otherFrame.properties.SpecialEffect = 1
    otherFrame.properties.BorderStyle = 1
    otherFrame.properties.BorderColor = '#eeeeee'
    otherFrame.properties.BackColor = '#eeeeee'
    otherFrame.properties.Enabled = !otherFrame.properties.Enabled
    // otherFrame.properties.Visible = !otherFrame.properties.Visible
    otherFrame.properties.Picture = 'url("")'
    testWrapper.setProps({ data: otherFrame })
  })
})
