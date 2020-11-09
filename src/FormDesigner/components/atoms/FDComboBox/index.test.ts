// @ts-nocheck
import { shallowMount } from '@vue/test-utils'
import FDComboBox from './index.vue'
import store from '@/store/index.ts'
import { ControlPropertyData } from '../../../models/ControlsTableProperties/ControlPropertyData'

const controlObj = new ControlPropertyData()
const comboBox1 = controlObj.data.ComboBox
const propsObj = {
  userFormId: 'ID_USERFORM1',
  controlId: 'ID_ComboBox1',
  containerId: 'ID_USERFORM1'
}

const factory = (propsArg: Object) => {
  return shallowMount(FDComboBox, {
    propsData: {
      ...propsObj,
      ...propsArg
    },
    store
  })
}

describe('FDComboBox.vue', () => {
  describe('render and default test', () => {
    const testWrapper = factory({ data: comboBox1 })
    it('instance test', () => {
      expect(testWrapper.isVueInstance()).toBe(true)
    })
  })
  describe('necessary things check test', () => {
    const testWrapper = factory({ data: comboBox1 })
    it('name test', () => {
      expect(testWrapper.name()).toBe('FDComboBox')
    })
    it('Data test', () => {
      expect(testWrapper.props().data).not.toBeUndefined()
    })
  })
  describe('event test', () => {
    const testWrapper = factory({ data: comboBox1 })
    it('clearMatchEntry blur', () => {
      testWrapper.trigger('blur')
    })
    it('clearMatchEntry()', () => {
      testWrapper.vm.clearMatchEntry()
    })
    it('handleBlur()', () => {
      let x = testWrapper.find('textarea')
      x.trigger('blur')
    })
    it('handleClick()', () => {
      let x = testWrapper.find('textarea')
      x.trigger('click')
    })
    it('handleTextInput()', () => {
      let x = testWrapper.find('textarea')
      x.trigger('input')
    })
    it('setSelection()', () => {
      testWrapper.vm.setSelection()
    })
    it('ValueData()', () => {
      testWrapper.vm.ValueData()
    })
    it('clearMatchEntry()', () => {
      testWrapper.vm.clearMatchEntry()
    })
    it('ListRowsValue()', () => {
      testWrapper.vm.ListRowsValue()
    })
    it('checkSelectionMargin()', () => {
      testWrapper.vm.checkSelectionMargin()
    })
    it('expandWidth()', () => {
      testWrapper.vm.expandWidth()
    })
    it('changeDropButtonStyle()', () => {
      testWrapper.vm.changeDropButtonStyle()
    })
    it('enabledCheck()', () => {
      testWrapper.vm.enabledCheck()
    })
    it('setSelection trigger()', () => {
      let y = testWrapper.find('span')
      y.trigger('click')
    })
    it('dragBehavior trigger()', () => {
      let y = testWrapper.find('textarea')
      y.trigger('dragstart')
    })
    it('enabledCheck trigger()', () => {
      let y = testWrapper.find('div')
      y.trigger('click')
    })
    it('divHide trigger()', () => {
      let y = testWrapper.find('div')
      y.trigger('click')
    })
  })
  describe('button prop test', () => {
    const testWrapper = factory({ data: comboBox1 })
    it('controlId test', () => {
      expect(testWrapper.props().controlId).toMatch(`ID_ComboBox1`)
      expect(testWrapper.props().controlId).toBeDefined()
      expect(testWrapper.props().controlId).not.toBeNull()
    })
    const othercomboBox = { ...comboBox1 }
    othercomboBox.properties.Font = comboBox1.properties.Font
    othercomboBox.properties.BackStyle = 1
    othercomboBox.properties.FontBold = ''
    othercomboBox.properties.BackColor = '#eeeeee'
    othercomboBox.properties.WordWrap = !othercomboBox.properties.WordWrap
    othercomboBox.properties.Enabled = !othercomboBox.properties.Enabled
    othercomboBox.properties.Locked = false
    testWrapper.setProps({ data: othercomboBox })
  })
})
