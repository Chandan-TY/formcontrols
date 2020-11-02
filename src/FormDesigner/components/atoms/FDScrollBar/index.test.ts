// @ts-nocheck
import { shallowMount } from '@vue/test-utils'
import FDScrollBar from './index.vue'
import store from '@/store/index.ts'
import { ControlPropertyData } from '../../../models/ControlsTableProperties/ControlPropertyData'

const controlObj = new ControlPropertyData()
const scrollBar1 = controlObj.data.ScrollBar
const propsObj = {
  userFormId: 'ID_USERFORM1',
  controlId: 'ID_ScrollBar1',
  containerId: 'ID_USERFORM1'
}

const factory = (propsArg: Object) => {
  return shallowMount(FDScrollBar, {
    propsData: {
      ...propsObj,
      ...propsArg
    },
    store
  })
}

describe('FDScrollBar.vue', () => {
  describe('render and default test', () => {
    const testWrapper = factory({ data: scrollBar1 })
    it('instance test', () => {
      expect(testWrapper.isVueInstance()).toBe(true)
    })
  })
  describe('necessary things check test', () => {
    const testWrapper = factory({ data: scrollBar1 })
    it('name test', () => {
      expect(testWrapper.name()).toBe('FDScrollBar')
    })
    it('propControlData test', () => {
      expect(testWrapper.props().data).not.toBeUndefined()
    })
    it('ButtonClick()', () => {
      expect(testWrapper.vm.isClicked).toBe(false)
    })
  })
})
describe('button prop test', () => {
  const testWrapper = factory({ data: scrollBar1 })
  it('controlId test', () => {
    expect(testWrapper.props().controlId).toMatch(`ID_ScrollBar1`)
    expect(testWrapper.props().controlId).toBeDefined()
    expect(testWrapper.props().controlId).not.toBeNull()
  })
  const otherScrollBar = { ...scrollBar1 }
  // otherScrollBar.properties.ControlTipText = 'ScrollBar'
  otherScrollBar.properties.Enabled = !otherScrollBar.properties.Enabled
  otherScrollBar.properties.Visible = !otherScrollBar.properties.Visible
  testWrapper.setProps({ data: otherScrollBar })
  // it('ControlTipText test', () => {
  //   expect(testWrapper.props().ControlTipText).toBe('ScrollBar')
  // })
})
