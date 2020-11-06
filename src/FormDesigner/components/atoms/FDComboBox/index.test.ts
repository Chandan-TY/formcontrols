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
  // describe('necessary things check test', () => {
  //   const testWrapper = factory({ data: comboBox1 })
  //   it('name test', () => {
  //     expect(testWrapper.name()).toBe('FDComboBox')
  //   })
  //   it('Data test', () => {
  //     expect(testWrapper.props().data).not.toBeUndefined()
  //   })
  // })
  // describe('event test', () => {
  //   const testWrapper = factory({ data: comboBox1 })
  //   it('keydown delete test', () => {
  //     testWrapper.trigger('click')
  //   })
  //   it('click test', () => {
  //     testWrapper.props().data.properties.ID = 'ID_ComboBox1'
  //     testWrapper.trigger('keydown')
  //   })
  //   it('setContentEditable enter test', () => {
  //     testWrapper.trigger('mouseenter')
  //   })
  //   it('setContentEditable blur', () => {
  //     testWrapper.trigger('blur')
  //   })
  //   // it('comboBoxClick()', () => {
  //   //   testWrapper.vm.comboBoxClick()
  //   // })
  // })
  // describe('button prop test', () => {
  //   const testWrapper = factory({ data: comboBox1 })
  //   it('controlId test', () => {
  //     expect(testWrapper.props().controlId).toMatch(`ID_ComboBox1`)
  //     expect(testWrapper.props().controlId).toBeDefined()
  //     expect(testWrapper.props().controlId).not.toBeNull()
  //   })
  //   const otherComboBox = { ...comboBox1 }
  //   delete otherComboBox.properties.Font
  //   otherComboBox.properties.BackStyle = 1
  //   otherComboBox.properties.BoundColumn = 1
  //   otherComboBox.properties.ColumnCount = 1
  //   otherComboBox.properties.ColumnHeads = false
  //   otherComboBox.properties.FontBold = ''
  //   otherComboBox.properties.BackColor = '#eeeeee'
  //   otherComboBox.properties.Locked = !otherComboBox.properties.Locked
  //   otherComboBox.properties.Enabled = !otherComboBox.properties.Enabled
  //   otherComboBox.properties.Visible = !otherComboBox.properties.Visible
  //   testWrapper.setProps({ data: otherComboBox })
  // })
})
