// @ts-nocheck
import { shallowMount } from '@vue/test-utils'
import FDToggleButton from './index.vue'
import store from '@/store/index.ts'
import { ControlPropertyData } from '../../../models/ControlsTableProperties/ControlPropertyData'

const controlObj = new ControlPropertyData()
const toggleButton1 = controlObj.data.ToggleButton
const propsObj = {
  userFormId: 'ID_USERFORM1',
  controlId: 'ID_ToggleButton1',
  containerId: 'ID_USERFORM1'
}

const factory = (propsArg: Object) => {
  return shallowMount(FDToggleButton, {
    propsData: {
      ...propsObj,
      ...propsArg
    },
    store
  })
}

describe('FDToggleButton.vue', () => {
  describe('render and default test', () => {
    const testWrapper = factory({ data: toggleButton1 })
    it('instance test', () => {
      expect(testWrapper.isVueInstance()).toBe(true)
    })
  })
  describe('necessary things check test', () => {
    const testWrapper = factory({ data: toggleButton1 })
    it('name test', () => {
      expect(testWrapper.name()).toBe('FDToggleButton')
    })
    it('propControlData test', () => {
      expect(testWrapper.props().data).not.toBeUndefined()
    })
  })
  describe('event test', () => {
    const testWrapper = factory({ data: toggleButton1 })
    it('keydown delete test', () => {
      testWrapper.trigger('click')
    })
    it('click test', () => {
      testWrapper.props().data.properties.ID = 'ID_ToggleButton1'
      testWrapper.trigger('keydown.delete')
    })
    it('setContentEditable enter test', () => {
      testWrapper.trigger('keydown.enter')
      expect(testWrapper.vm.isContentEditable).toBe(false)
    })
    it('setContentEditable blur', () => {
      testWrapper.trigger('blur')
      expect(testWrapper.vm.isContentEditable).toBe(false)
    })
    it('toggleButtonClick()', () => {
      testWrapper.vm.toggleButtonClick()
      expect(testWrapper.vm.isClicked).toBe(true)
    })
    it('updateAutoSize()', () => {
      testWrapper.vm.updateAutoSize()
      expect(testWrapper.props().data.properties.Height).toBe(60)
      expect(testWrapper.props().data.properties.Width).toBe(55)
    })
    it('updateCaption()', () => {
      const button = testWrapper.find('button')
      button.element.innerText = 'toggleButton1'
      button.trigger('input')
      expect(testWrapper.props().data.properties.Caption).toBe('ToggleButton1')
    })
    it('Locked test', () => {
      expect(testWrapper.props().data.properties.Locked).toBe(false)
    })
  })
  describe('button prop test', () => {
    const testWrapper = factory({ data: toggleButton1 })
    it('controlId test', () => {
      expect(testWrapper.props().controlId).toMatch(`ID_ToggleButton1`)
      expect(testWrapper.props().controlId).toBeDefined()
      expect(testWrapper.props().controlId).not.toBeNull()
    })
    it('isClicked', () => {
      expect(testWrapper.vm.isClicked).toBe(true)
    })
    const otherToggleButton = { ...toggleButton1 }
    delete otherToggleButton.properties.Font
    otherToggleButton.properties.BackStyle = 1
    otherToggleButton.properties.ControlSource = 'True'
    otherToggleButton.properties.WordWrap = !otherToggleButton.properties.WordWrap
    otherToggleButton.properties.Enabled = !otherToggleButton.properties.Enabled
    otherToggleButton.properties.Visible = !otherToggleButton.properties.Visible
    otherToggleButton.properties.TripleState = !otherToggleButton.properties.TripleState
    otherToggleButton.properties.AutoSize = !otherToggleButton.properties.AutoSize
    otherToggleButton.properties.TakeFocusOnClick = !otherToggleButton.properties.TakeFocusOnClick
    testWrapper.setProps({ data: otherToggleButton })
    it('autoSize test', () => {
      expect(testWrapper.props().data.properties.AutoSize).toBe(true)
    })
  })
})
