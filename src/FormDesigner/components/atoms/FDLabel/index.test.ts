// @ts-nocheck
import { shallowMount } from '@vue/test-utils'
import FDLabel from './index.vue'
import store from '@/store/index.ts'
import { label1 } from '@/FormDesigner/models/LabelDataSample'

const propsObj = {
  userFormId: 'ID_USERFORM1',
  controlId: 'ID_Label1',
  containerId: 'ID_USERFORM1'
}

const factory = (propsArg: Object) => {
  return shallowMount(FDLabel, {
    propsData: {
      ...propsObj,
      ...propsArg
    },
    store
  })
}

describe('FDLabel.vue', () => {
  describe('render and default test', () => {
    const testWrapper = factory({ data: label1 })
    it('instance test', () => {
      expect(testWrapper.isVueInstance()).toBe(true)
    })
  })
  describe('necessary things check test', () => {
    const testWrapper = factory({ data: label1 })
    it('name test', () => {
      expect(testWrapper.name()).toBe('FDLabel')
    })
    it('propControlData test', () => {
      expect(testWrapper.props().data).not.toBeUndefined()
    })
  })
  describe('event test', () => {
    const testWrapper = factory({ data: label1 })
    it('click test', () => {
      testWrapper.trigger('click')
    })
    it('delete test', () => {
      testWrapper.trigger('keydown.delete')
    })

    it('updateCaption test', () => {
      const label = testWrapper.find('label')
      label.element.innerText = 'Hello'
      label.trigger('input')
      // expect(testWrapper.props().Caption).toBe('Hello')
    })
    it('setContentEditable test', () => {
      testWrapper.trigger('keydown.enter')
    })
  })
  describe('label prop test', () => {
    const testWrapper = factory({ data: label1 })
    it('controlId test', () => {
      expect(testWrapper.props().controlId).toMatch(`ID_Label1`)
      expect(testWrapper.props().controlId).toBeDefined()
      expect(testWrapper.props().controlId).not.toBeNull()
    })
    const otherLabel = { ...label1 }
    delete otherLabel.properties.Font
    otherLabel.properties.BackStyle = 0
    otherLabel.properties.SpecialEffect = 1
    otherLabel.properties.WordWrap = !otherLabel.properties.WordWrap
    otherLabel.properties.Enabled = !otherLabel.properties.Enabled
    otherLabel.properties.Visible = !otherLabel.properties.Visible
    otherLabel.properties.AutoSize = !otherLabel.properties.AutoSize

    testWrapper.setProps({ data: otherLabel })
    it('autoSize test', () => {
      expect(testWrapper.props().data.properties.AutoSize).toBe(true)
    })
    it('autoSizeMethod', () => {
      testWrapper.vm.updateAutoSize()
      expect(testWrapper.props().data.properties.Height).toBe(5)
    })
  })
})
