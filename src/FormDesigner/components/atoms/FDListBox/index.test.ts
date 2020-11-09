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
  describe('necessary things check test', () => {
    const testWrapper = factory({ data: listBox1 })
    it('name test', () => {
      expect(testWrapper.name()).toBe('FDListBox')
    })
    it('Data test', () => {
      expect(testWrapper.props().data).not.toBeUndefined()
    })
  })
  describe('event test', () => {
    const testWrapper = factory({ data: listBox1 })
    it('clearMatchEntry blur', () => {
      testWrapper.trigger('blur')
    })
    it('clearMatchEntry()', () => {
      testWrapper.vm.clearMatchEntry()
    })
    it('tableClick()', () => {
      testWrapper.vm.tableClick()
    })
    it('ValueData()', () => {
      testWrapper.vm.ValueData()
    })
    it('textColumnChange()', () => {
      testWrapper.vm.textColumnChange()
    })
    it('multiSelectCheck()', () => {
      testWrapper.vm.multiSelectCheck()
    })
    it('listCheck()', () => {
      testWrapper.vm.listCheck()
    })
  })
  describe('button prop test', () => {
    const testWrapper = factory({ data: listBox1 })
    it('controlId test', () => {
      expect(testWrapper.props().controlId).toMatch(`ID_ListBox1`)
      expect(testWrapper.props().controlId).toBeDefined()
      expect(testWrapper.props().controlId).not.toBeNull()
    })
  })
})
