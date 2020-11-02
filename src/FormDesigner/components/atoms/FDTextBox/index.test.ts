// @ts-nocheck
import { shallowMount, createLocalVue } from '@vue/test-utils'
import FDLabel from './index.vue'
import store from '@/store/index.ts'
import { ControlPropertyData } from '../../../models/ControlsTableProperties/ControlPropertyData'

const controlObj = new ControlPropertyData()

const propsObj = {
  userFormId: 'ID_USERFORM1',
  controlId: 'ID_TextBox1',
  containerId: 'ID_USERFORM1'
}

const textbox1 = controlObj.data.TextBox

const factory = (propsArg: Object) => {
  return shallowMount(FDLabel, {
    propsData: {
      ...propsObj,
      ...propsArg
    },
    store
  })
}

describe('FDTextBox.vue', () => {
  describe('render and default test', () => {
    const testWrapper = factory({ data: controlObj.data.TextBox })
    it('instance test', () => {
      expect(testWrapper.isVueInstance()).toBe(true)
    })
  })
  describe('necessary things check test', () => {
    const testWrapper = factory({ data: controlObj.data.TextBox })
    it('name test', () => {
      expect(testWrapper.name()).toBe('FDTextBox')
    })
  })
  describe('event test', () => {
    const testWrapper = factory({ data: controlObj.data.TextBox })
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
  describe('TextBox prop test', () => {
    const testWrapper = factory({ data: controlObj.data.TextBox })
    it('controlId test', () => {
      expect(testWrapper.props().controlId).toMatch(`ID_TextBox1`)
      expect(testWrapper.props().controlId).toBeDefined()
      expect(testWrapper.props().controlId).not.toBeNull()
    })
    it('data test', () => {
      expect(testWrapper.props().data).toStrictEqual(controlObj.data.TextBox)
      expect(testWrapper.props().data).toBeDefined()
      expect(testWrapper.props().data).not.toBeNull()
    })
  })

  describe('method test', () => {
    const testWrapper = factory({ data: textbox1 })
    it('instance test', () => {
      expect(testWrapper.isVueInstance()).toBe(true)
    })
    it('updateCaption test', () => {
      const textbox = testWrapper.find('textarea')
      textbox.element.innerText = 'Hi'
      textbox.trigger('input')
    })
  })

  describe('prop data test', () => {
    const testWrapper = factory({ data: controlObj.data.TextBox })
    const textbox = { ...textbox1 }
    textbox.properties.TabKeyBehavior = !textbox1.properties.TabKeyBehavior
    textbox.properties.AutoSize = !textbox1.properties.AutoSize
    textbox.properties.AutoTab = !textbox1.properties.AutoTab
    textbox.properties.TabStop = !textbox1.properties.TabStop
    textbox.properties.EnterKeyBehavior = !textbox1.properties.EnterKeyBehavior
    textbox.properties.Locked = !textbox1.properties.Locked
    textbox.properties.MultiLine = !textbox1.properties.MultiLine
    textbox.properties.Value = 'text'
    textbox.properties.Text = 'text'
    testWrapper.setProps({ data: textbox })
    it('autoSize test', () => {
      expect(testWrapper.props().data.properties.AutoSize).toBe(true)
    })
    it('autoTab test', () => {
      expect(testWrapper.props().data.properties.AutoTab).toBe(true)
    })
    it('autoWordSelect test', () => {
      expect(testWrapper.props().data.properties.AutoWordSelect).toBe(true)
    })
    it('enterKeyBehavior test', () => {
      expect(testWrapper.props().data.properties.EnterKeyBehavior).toBe(true)
    })
    it('hideSelection test', () => {
      expect(testWrapper.props().data.properties.HideSelection).toBe(true)
    })
    it('integralHeight test', () => {
      expect(testWrapper.props().data.properties.IntegralHeight).toBe(true)
    })
    it('locked test', () => {
      expect(testWrapper.props().data.properties.Locked).toBe(true)
    })
    it('MultiLine test', () => {
      expect(testWrapper.props().data.properties.MultiLine).toBe(true)
    })
    it('selectionMargin test', () => {
      expect(testWrapper.props().data.properties.SelectionMargin).toBe(true)
    })
    it('TabStop test', () => {
      expect(testWrapper.props().data.properties.TabStop).toBe(false)
    })
    it('TabKeyBehavior test', () => {
      expect(testWrapper.props().data.properties.TabKeyBehavior).toBe(true)
    })
    it('Visible test', () => {
      expect(testWrapper.props().data.properties.Visible).toBe(true)
    })
    it('wordWrap test', () => {
      expect(testWrapper.props().data.properties.WordWrap).toBe(true)
    })
    it('Name test', () => {
      expect(testWrapper.props().data.properties.Name).toMatch('TextBox')
    })
    it('BackColor test', () => {
      expect(testWrapper.props().data.properties.BackColor).toMatch('#ffffff')
    })
    it('BorderColor test', () => {
      expect(testWrapper.props().data.properties.BorderColor).toMatch('#ffffff')
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

  describe('value test', () => {
    const testWrapper = factory({ data: textbox1 })
    const textbox = { ...textbox1 }
    textbox.properties.PasswordChar = 'A'
    textbox.properties.FontStyle = true
    testWrapper.setProps({ data: textbox })
    it('textbox value test', () => {
      const textbox = testWrapper.find('textarea')
      textbox.element.value = 'AAAA'
      expect(textbox.element.value).toEqual('AAAA')
    })
    it('textbox font test', () => {
      const textbox = testWrapper.find('textarea')
      textbox.element.style.fontFamily = 'arial'
      expect(textbox.element.style.fontFamily).toEqual('arial')
    })
  })

  describe('created() test', () => {
    const testWrapper = factory({ data: textbox1 })

    it('created() test', () => {
      const textbox = { ...textbox1 }
      textbox.properties.ControlSource = 'a1'
      textbox.extraDatas.ControlSourceValue = 'hi'
      textbox.properties.PasswordChar = ''
      testWrapper.setProps({ data: textbox })
      const textarea = testWrapper.find('textarea')
      expect(textbox.properties.ControlSource).toEqual('a1')
      expect(textarea.element.value).toEqual('text')
    })
  })

  describe(' test', () => {
    const testWrapper = factory({ data: textbox1 })

    it('created() test', () => {
      const textbox = { ...textbox1 }
      textbox.properties.ControlSource = 'a1'
      textbox.extraDatas.ControlSourceValue = 'hi'
      textbox.properties.PasswordChar = ''
      testWrapper.setProps({ data: textbox })
      const textarea = testWrapper.find('textarea')
      expect(textbox.properties.ControlSource).toEqual('a1')
      expect(textarea.element.value).toEqual('text')
    })
  })
})
