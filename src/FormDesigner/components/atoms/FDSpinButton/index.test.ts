// @ts-nocheck
import { shallowMount } from '@vue/test-utils'
import FDSpinButton from './index.vue'
import store from '@/store/index.ts'
import { ControlPropertyData } from '../../../models/ControlsTableProperties/ControlPropertyData'

const controlObj = new ControlPropertyData()
const spinButton1 = controlObj.data.SpinButton
const propsObj = {
  userFormId: 'ID_USERFORM1',
  controlId: 'ID_SpinButton1',
  containerId: 'ID_USERFORM1'
}

const factory = (propsArg: Object) => {
  return shallowMount(FDSpinButton, {
    propsData: {
      ...propsObj,
      ...propsArg
    },
    store
  })
}

describe('FDSpinButton.vue', () => {
  describe('render and default test', () => {
    const testWrapper = factory({ data: spinButton1 })
    it('instance test', () => {
      expect(testWrapper.isVueInstance()).toBe(true)
    })
  })
  describe('necessary things check test', () => {
    const testWrapper = factory({ data: spinButton1 })
    it('name test', () => {
      expect(testWrapper.name()).toBe('FDSpinButton')
    })
    it('propControlData test', () => {
      expect(testWrapper.props().data).not.toBeUndefined()
    })
    it('ButtonClick()', () => {
      expect(testWrapper.vm.isClicked).toBe(false)
    })
    it('orientedValue check', () => {
      testWrapper.vm.orientedValue = true
      expect(testWrapper.vm.classStyle).toMatch('spin')
    })
  })
})
describe('button prop test', () => {
  const testWrapper = factory({ data: spinButton1 })
  it('controlId test', () => {
    expect(testWrapper.props().controlId).toMatch(`ID_SpinButton1`)
    expect(testWrapper.props().controlId).toBeDefined()
    expect(testWrapper.props().controlId).not.toBeNull()
  })
  const otherSpinButton = { ...spinButton1 }
  otherSpinButton.properties.Enabled = !otherSpinButton.properties.Enabled
  otherSpinButton.properties.Visible = !otherSpinButton.properties.Visible
  testWrapper.setProps({ data: otherSpinButton })
})
