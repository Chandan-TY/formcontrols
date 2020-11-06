// @ts-nocheck
import { shallowMount } from '@vue/test-utils'
import FDListBox from './index.vue'
import store from '@/store/index.ts'
import { ControlPropertyData } from '../../../models/ControlsTableProperties/ControlPropertyData'

const controlObj = new ControlPropertyData()
const listBox1 = controlObj.data.ListBox
const propsObj = {
  userFormId: 'ID_USERFORM1',
  controlId: 'ID_ListBox1',
  containerId: 'ID_USERFORM1'
}

const factory = (propsArg: Object) => {
  return shallowMount(FDListBox, {
    propsData: {
      ...propsObj,
      ...propsArg
    },
    store
  })
}

describe('FDListBox.vue', () => {
  describe('render and default test', () => {
    const testWrapper = factory({ data: listBox1 })
    it('instance test', () => {
      expect(testWrapper.isVueInstance()).toBe(true)
    })
  })
  // describe('necessary things check test', () => {
  //   const testWrapper = factory({ data: listBox1 })
  //   it('name test', () => {
  //     expect(testWrapper.name()).toBe('FDListBox')
  //   })
  //   it('Data test', () => {
  //     expect(testWrapper.props().data).not.toBeUndefined()
  //   })
  // })
  // describe('event test', () => {
  //   const testWrapper = factory({ data: listBox1 })
  //   it('keydown delete test', () => {
  //     testWrapper.trigger('click')
  //   })
  //   it('click test', () => {
  //     testWrapper.props().data.properties.ID = 'ID_ListBox1'
  //     testWrapper.trigger('keydown')
  //   })
  //   it('setContentEditable enter test', () => {
  //     testWrapper.trigger('mouseenter')
  //   })
  //   it('setContentEditable blur', () => {
  //     testWrapper.trigger('blur')
  //   })
  //   // it('listBoxClick()', () => {
  //   //   testWrapper.vm.listBoxClick()
  //   // })
  // })
  // describe('button prop test', () => {
  //   const testWrapper = factory({ data: listBox1 })
  //   it('controlId test', () => {
  //     expect(testWrapper.props().controlId).toMatch(`ID_ListBox1`)
  //     expect(testWrapper.props().controlId).toBeDefined()
  //     expect(testWrapper.props().controlId).not.toBeNull()
  //   })
  //   const otherListBox = { ...listBox1 }
  //   delete otherListBox.properties.Font
  //   otherListBox.properties.BackStyle = 1
  //   otherListBox.properties.BoundColumn = 1
  //   otherListBox.properties.ColumnCount = 1
  //   otherListBox.properties.ColumnHeads = false
  //   otherListBox.properties.FontBold = ''
  //   otherListBox.properties.BackColor = '#eeeeee'
  //   otherListBox.properties.Locked = !otherListBox.properties.Locked
  //   otherListBox.properties.Enabled = !otherListBox.properties.Enabled
  //   otherListBox.properties.Visible = !otherListBox.properties.Visible
  //   testWrapper.setProps({ data: otherListBox })
  // })
})
