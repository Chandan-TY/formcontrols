// @ts-nocheck
import { shallowMount, createLocalVue } from '@vue/test-utils'
import FDOptionButton from './index.vue'
import store from '@/store/index.ts'
import { ControlPropertyData } from '../../../models/ControlsTableProperties/ControlPropertyData'

const controlObj = new ControlPropertyData()

const propsObj = {
  controlId: 'ID_OptionButton1'
}

const optionButton1 = controlObj.data.OptionButton

const factory = (propsArg: Object) => {
  return shallowMount(FDOptionButton, {
    propsData: {
      ...propsObj,
      ...propsArg
    },
    store
  })
}

describe('FDOptionButton.vue', () => {
  describe('render and default test', () => {
    const testWrapper = factory({ data: controlObj.data.OptionButton })
    it('instance test', () => {
      expect(testWrapper.isVueInstance()).toBe(true)
    })
  })
  describe('necessary things check test', () => {
    const testWrapper = factory({ data: controlObj.data.OptionButton })
    it('name test', () => {
      expect(testWrapper.name()).toBe('FDOptionButton')
    })
  })
  describe('event test', () => {
    const testWrapper = factory({ data: controlObj.data.OptionButton })
    it('keydown test', () => {
      testWrapper.trigger('keydown')
    })
    it('click test', () => {
      testWrapper.trigger('click')
    })
    it('keydown.tab test', () => {
      testWrapper.trigger('keydown', {
        key: 'a'
      })
    })
    it('keydown.enter test', () => {
      testWrapper.trigger('keydown', {
        key: 'enter'
      })
    })
    it('blur test', () => {
      testWrapper.trigger('blur')
    })
    it('input test', () => {
      testWrapper.trigger('input')
    })
    it('dragstart test', () => {
      testWrapper.trigger('dragstart')
    })
  })
  describe('OptionButton prop test', () => {
    const testWrapper = factory({ data: controlObj.data.OptionButton })
    it('controlId test', () => {
      expect(testWrapper.props().controlId).toMatch(`ID_OptionButton1`)
      expect(testWrapper.props().controlId).toBeDefined()
      expect(testWrapper.props().controlId).not.toBeNull()
    })
    it('data test', () => {
      expect(testWrapper.props().data).toStrictEqual(controlObj.data.OptionButton)
      expect(testWrapper.props().data).toBeDefined()
      expect(testWrapper.props().data).not.toBeNull()
    })
  })

  describe('method test', () => {
    const testWrapper = factory({ data: controlObj.data.OptionButton })
    it('instance test', () => {
      expect(testWrapper.isVueInstance()).toBe(true)
    })
    it('updateCaption test', () => {
      const optionButton = testWrapper.find('input')
      optionButton.checked = true
      expect(optionButton.checked).toBe(true)
      optionButton.trigger('input')
    })
  })

  describe('prop data test', () => {
    const testWrapper = factory({ data: controlObj.data.OptionButton })
    const optionButton = { ...optionButton1 }
    optionButton.properties.TabKeyBehavior = !optionButton1.properties.TabKeyBehavior
    optionButton.properties.AutoSize = !optionButton1.properties.AutoSize
    optionButton.properties.AutoTab = !optionButton1.properties.AutoTab
    optionButton.properties.TabStop = !optionButton1.properties.TabStop
    optionButton.properties.EnterKeyBehavior = !optionButton1.properties.EnterKeyBehavior
    optionButton.properties.Locked = !optionButton1.properties.Locked
    optionButton.properties.MultiLine = !optionButton1.properties.MultiLine
    optionButton.properties.Value = 'text'
    optionButton.properties.Text = 'text'
    testWrapper.setProps({ data: optionButton })
    it('autoSize test', () => {
      expect(testWrapper.props().data.properties.AutoSize).toBe(true)
    })
    it('locked test', () => {
      expect(testWrapper.props().data.properties.Locked).toBe(true)
    })
    it('TabStop test', () => {
      expect(testWrapper.props().data.properties.TabStop).toBe(false)
    })
    it('Visible test', () => {
      expect(testWrapper.props().data.properties.Visible).toBe(true)
    })
    it('wordWrap test', () => {
      expect(testWrapper.props().data.properties.WordWrap).toBe(true)
    })
    it('Name test', () => {
      expect(testWrapper.props().data.properties.Name).toMatch('OptionButton')
    })
    it('BackColor test', () => {
      expect(testWrapper.props().data.properties.BackColor).toMatch('#ffffff')
    })
    it('ForeColor test', () => {
      expect(testWrapper.props().data.properties.ForeColor).toMatch('#000000')
    })
    it('Value test', () => {
      expect(testWrapper.props().data.properties.Value).toMatch('text')
    })
    it('Text test', () => {
      expect(testWrapper.props().data.properties.Text).toMatch('text')
    })
  })
})
