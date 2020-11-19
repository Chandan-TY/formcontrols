<template>
  <div
    class="custom-select"
    :tabindex="tabindex"
    :style="customSelectObj"
    :title="properties.ControlTipText"
    @click="selectedItem"
  >
    <div
      class="combobox"
      :style="boxStyleObj"
      @mousedown="controlEditMode"
      @click="toFocus"
    >
      <div :class="properties.SelectionMargin ? 'selectionDiv' : ''">
        <span
          v-if="properties.SelectionMargin"
          class="selectionSpan"
          :style="selectionSpanObj"
          @click="setSelection"
        ></span>
        <textarea
          ref="textareaRef"
          :style="cssStyleProperty"
          wrap="off"
          :tabindex="properties.TabIndex"
          :readonly="getDisableValue || properties.Style === 2"
          @blur="handleBlur($event, textareaRef, hideSelectionDiv)"
          @click="handleClick($event, textareaRef, hideSelectionDiv)"
          @input="handleTextInput($event)"
          :maxlength="properties.MaxLength !== 0 ? properties.MaxLength : ''"
          class="text-box-design"
          :value="selectionData[0]"
          @dragstart="dragBehavior"
        />

        <div
          ref="hideSelectionDiv"
          id="div1"
          @click="divHide($event, textareaRef)"
          :style="divcssStyleProperty"
          :title="properties.ControlTipText"
          class="text-box-design"
        >
          {{ selectionData[0] }}
        </div>
        <label
          ref="autoSizeTextarea"
          class="labelStyle"
          :class="[labelStyleObj]"
        ></label>
      </div>
      <div
        class="selected"
        @click="enabledCheck"
        :style="selectedStyleObj"
      ></div>
      <div class="items" :class="{ selectHide: !open }" :style="itemsStyleObj">
        <div class="listStyle" :title="properties.ControlTipText" >
          <table :style="tableStyleObj" class="table-style" @click="tableClick" ref="comboRef" @blur="toBlur" tabindex="1">
            <thead v-if="properties.ColumnHeads === true" class="theadClass">
              <tr>
                <td
                  :style="tdStyleObj"
                  v-if="properties.ListStyle === 1"
                  class="tdClass"
                ></td>
                <template
                  v-for="(a, columnIndex) in extraDatas.ColumnHeadsValues"
                >
                  <td
                    v-if="columnIndex < properties.ColumnCount"
                    :key="columnIndex"
                    :style="updateColHeads(columnIndex)"
                  >
                    {{ a }}
                  </td>
                </template>
              </tr>
            </thead>
            <thead v-else></thead>
            <tbody
              ref="style"
              class="table-body"
              :style="tableBodyObj"
              @click="open = false"
            >
              <tr
                :tabindex="index"
                class="tr"
                v-for="(item, index) of tempArray"
                :key="index"
                @mouseenter="handleDrag"
                @keydown="handleExtendArrowKeySelect"
                @blur="clearMatchEntry"
                @mousedown="
                  isRunMode || isEditMode ? handleMultiSelect($event) : ''
                "
              >
                <td
                  :style="tdStyleObj"
                  class="tdClassIn"
                  v-if="
                    properties.ListStyle === 1 && properties.ColumnCount > 0
                  "
                >
                <input name="radio" type="radio" class="inputClass" />
                </td>
                <td
                  class="column-item"
                  v-for="(i, index) in item"
                  :key="index"
                  :style="updateColumnWidths(index)"
                >
                  <template v-if="index < properties.ColumnCount">{{
                    i
                  }}</template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Mixins,
  Watch,
  Ref
} from 'vue-property-decorator'
import FdControlVue from '@/api/abstract/FormDesigner/FdControlVue'
import { Mutation, Action, Getter } from 'vuex-class'

@Component({
  name: 'FDComboBox'
})
export default class FDComboBox extends Mixins(FdControlVue) {
  $el!: HTMLDivElement;
  @Ref('textareaRef') textareaRef: HTMLTextAreaElement;
  @Ref('autoSizeTextarea') readonly autoSizeTextarea!: HTMLLabelElement;
  @Ref('hideSelectionDiv') readonly hideSelectionDiv!: HTMLDivElement;
  @Ref('comboRef') comboRef!: HTMLDivElement
  private options = ['hello'];
  private tabindex = 0;
  tempArray: Array<Array<string>> = [];
  open: boolean = false;
  isVisible: boolean = false;
  // selected = this.options.length > 0 ? '' : null;
  //  matchIndex: number = 0;
  multiselect = [];
  //  selectionData: Array<string> = [];
  selectionStart: number = 0;
  selectionEnd: number = 0;
  //  matchEntry: Array<number> = [];
  tempInputValue: string = '';
  tempEvent: Event;

  get getDisableValue () {
    if (this.isRunMode || this.isEditMode) {
      return this.properties.Enabled === false || this.properties.Locked
    } else {
      return true
    }
  }

  toBlur () {
    // this.isDropdownVisible = false
    // if (!this.isDropdownVisible) {
    this.open = false
    // }
  }
  toFocus () {
    //
    this.comboRef.focus()
  }
  tableClick (e: Event) {
    this.tempEvent = e
  }
  handleTextInput (e: Event) {
    if (e.target instanceof HTMLTextAreaElement) {
      const tempEvent = e.target
      this.tempInputValue = tempEvent!.value
    } else {
      throw new Error('target is not instance of div element')
    }
  }
  setSelection () {
    const setSelectionRef = this.textareaRef
    setSelectionRef.focus()
    setSelectionRef.select()
  }
  // MatchEntryComplete
  clearMatchEntry () {
    this.updateDataModelExtraData({ propertyName: 'MatchData', value: '' })
  }

  protected get selectionSpanObj (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      background: controlProp.BackStyle ? controlProp.BackColor : 'transparent'
    }
  }
  protected get tableBodyObj (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      width: `${controlProp.Width}px !important`
    }
  }

  /**
   * @description  show selection when TextBox loses focus
   * when HideSelection is false selection is show if user selects any text
   * @function handleBlur
   * @event blur
   *
   */
  handleBlur (
    event: TextEvent,
    textareaRef: HTMLTextAreaElement,
    hideSelectionDiv: HTMLDivElement
  ) {
    if (this.properties.EnterFieldBehavior === 1 && event.target instanceof HTMLTextAreaElement) {
      const eventTarget = event.target
      let tempField = this.tempInputValue.slice(
        eventTarget.selectionStart - eventTarget.selectionEnd
      )
      this.selectionStart = eventTarget.selectionStart
      this.selectionEnd = eventTarget.selectionEnd
    }
    if (!this.properties.HideSelection && textareaRef && event.target instanceof HTMLTextAreaElement) {
      const eventTarget = event.target

      hideSelectionDiv.style.display = 'block'
      hideSelectionDiv.style.height = this.properties.Height! + 2 + 'px'
      hideSelectionDiv.style.width = this.properties.Width! + 2 + 'px'
      textareaRef.style.display = 'none'
      let textarea = eventTarget.value
      let firstPart =
        textarea.slice(0, eventTarget.selectionEnd) +
        '</span>' +
        textarea.slice(eventTarget.selectionEnd + Math.abs(0))
      let text =
        firstPart.slice(0, eventTarget.selectionStart) +
        "<span style='background-color:lightblue'>" +
        firstPart.slice(eventTarget.selectionStart + Math.abs(0))
      hideSelectionDiv.innerHTML = text
    }
    if (this.properties.MatchRequired && textareaRef) {
      const arrayCheck = this.extraDatas.RowSourceData!.findIndex(
        (element) => element[0] === this.tempInputValue
      )
      if (arrayCheck === -1) {
        this.textareaRef.focus()
      } else {
        return undefined
      }
    }
  }
  /**
   *@description hides the div when focus comes to textarea when hideSelection
   * properties is false
   * @function handleClick
   * @param event its of FocusEvent
   * @event click
   */
  handleClick (
    event: TextEvent,
    textareaRef: HTMLTextAreaElement,
    hideSelectionDiv: HTMLDivElement
  ) {
    if (!this.properties.HideSelection) {
      hideSelectionDiv.style.display = 'none'
    } else {
      return undefined
    }
    if (this.properties.EnterFieldBehavior === 0) {
      this.textareaRef.focus()
      this.textareaRef.select()
    } else if (this.properties.EnterFieldBehavior === 1) {
    } else {
      return undefined
    }
  }
  /**
   * @description hides div instead of textarea when hideSelection is false
   * when hideSelection properties is true textarea is shown
   * when hideSelection properties is false div is shown
   * @function divHide
   * @param event its of type MouseEvent
   * @event click
   */
  divHide (event: MouseEvent, textareaRef: HTMLTextAreaElement) {
    debugger
    if (event.target instanceof HTMLSpanElement || event.target instanceof HTMLDivElement) {
      (event.target).style.display = 'none'
      textareaRef.style.display = 'block'
      if (
        (event.target).tagName === 'SPAN' &&
      (event.target).parentNode!.nodeName === 'DIV'
      ) {
        ((event.target)
          .parentNode as HTMLElement).style.display = 'none'
      }
      textareaRef.focus()
      textareaRef.selectionStart = textareaRef.selectionEnd
    } else {
      throw new Error('event.target is not an instance of Span or Div Element')
    }
  }
  /**
   * @description dragBehavior - if true when dragging
   *  if false the cursor remains in same place
   * @function dragBehavior
   * @param event its of type KeyboardEvent
   * @event dragStart
   */
  dragBehavior (e: Event) {
    if (this.properties.DragBehavior) {
      return true
    }
    e.preventDefault()
  }

  /**
   * @override
   */
  @Watch('properties.AutoSize', { deep: true })
  updateAutoSize (newVal: boolean, oldVal: boolean) {
    if (this.properties.AutoSize === true) {
      this.updateDataModel({ propertyName: 'SelectionMargin', value: false })
      this.$nextTick(() => {
        const textareaRef: HTMLTextAreaElement = this.textareaRef
        // replication of stype attribute to Label tag for autoSize property to work
        let tempLabel: HTMLLabelElement = this.autoSizeTextarea
        tempLabel.style.display = 'inline'
        tempLabel.style.fontStyle = textareaRef.style.fontStyle
        tempLabel.style.fontSize = parseInt(textareaRef.style.fontSize) + 'px'
        tempLabel.style.whiteSpace = textareaRef.style.whiteSpace
        tempLabel.style.wordBreak = textareaRef.style.wordBreak
        tempLabel.style.fontWeight = textareaRef.style.fontWeight
        tempLabel.style.width = textareaRef.style.width
        tempLabel.style.height = textareaRef.style.height
        tempLabel.innerText = textareaRef.value
        this.updateDataModel({
          propertyName: 'Width',
          value: tempLabel.offsetWidth + 5
        })
        this.updateDataModel({
          propertyName: 'Height',
          value: tempLabel.offsetHeight + 5
        })
        tempLabel.innerText = ''
        tempLabel.style.display = 'none'
        this.selectionData[0] = this.tempInputValue
      })
    } else {
      return undefined
    }
  }

  protected get tableStyleObj (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    const font: font = controlProp.Font
      ? controlProp.Font
      : {
        FontName: 'Arial',
        FontSize: 20,
        FontItalic: true,
        FontBold: true,
        FontUnderline: true,
        FontStrikethrough: true
      }
    return {
      borderCollapse: 'collapse',
      tableLayout: 'fixed',
      background: controlProp.BackStyle ? controlProp.BackColor : 'transparent',
      color: controlProp.ForeColor,
      fontFamily: font.FontStyle ? font.FontStyle : font.FontName,
      fontSize: `${font.FontSize}px`,
      fontStyle: font.FontItalic ? 'italic' : '',
      textDecoration:
        font.FontStrikethrough === true && font.FontUnderline === true
          ? 'underline line-through'
          : font.FontUnderline
            ? 'underline'
            : font.FontStrikethrough
              ? 'line-through'
              : '',
      fontWeight: font.FontBold ? 'bold' : '',
      width:
        controlProp.ColumnWidths === ''
          ? `${controlProp.Width}px`
          : `${controlProp.Width}px` +
            parseInt(controlProp.ColumnWidths!) +
            'px'
    }
  }

  protected get cssStyleProperty (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    const font: font = controlProp.Font
      ? controlProp.Font
      : {
        FontName: 'Arial',
        FontSize: 20,
        FontItalic: true,
        FontBold: true,
        FontUnderline: true,
        FontStrikethrough: true
      }
    return {
      height: `${controlProp.Height}px`,
      width: `${controlProp.Width}px`,
      fontFamily: font.FontStyle ? font.FontStyle : font.FontName,
      fontSize: `${font.FontSize}px`,
      fontStyle: font.FontItalic ? 'italic' : '',
      textDecoration:
        font.FontStrikethrough === true && font.FontUnderline === true
          ? 'underline line-through'
          : font.FontUnderline
            ? 'underline'
            : font.FontStrikethrough
              ? 'line-through'
              : '',
      fontWeight: font.FontBold ? 'bold' : '',
      background: controlProp.BackStyle ? controlProp.BackColor : 'transparent',
      color: controlProp.ForeColor
    }
  }
  /**
   * @description style object is passed to :style attribute in div tag
   * dynamically changing the styles of the component based on cssStyleProperty of
   * textarea
   * @function divcssStyleProperty
   *
   */
  get divcssStyleProperty () {
    const styleObject = this.cssStyleProperty
    return {
      ...styleObject,
      display: 'none',
      paddingTop: '2px',
      paddingLeft: '2px',
      whiteSpace: 'break-spaces'
    }
  }

  protected get customSelectObj (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    let display = ''
    if (this.isRunMode) {
      display = controlProp.Visible ? 'inline-block' : 'none'
    } else {
      display = 'inline-block'
    }
    return {
      display: display
    }
  }
  protected get tdStyleObj (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      textAlign:
        controlProp.TextAlign === 0
          ? 'left'
          : controlProp.TextAlign === 2
            ? 'right'
            : 'center'
    }
  }
  @Watch('properties.Value', { deep: true })
  ValueData (newVal: string, oldVal: string) {
    if (
      this.properties.BoundColumn! > 0 &&
      this.properties.BoundColumn! < this.extraDatas.RowSourceData!.length
    ) {
      let tempData = [...this.extraDatas.RowSourceData!]
      if (tempData![0][this.properties.BoundColumn! - 1] === newVal) {
        this.updateDataModel({ propertyName: 'Value', value: newVal })
      } else {
        this.updateDataModel({ propertyName: 'Value', value: '' })
      }
    }
  }

  @Watch('properties.ListRows', { deep: true })
  ListRowsValue (newVal: number, oldVal: number) {
    this.tempArray = []
    for (let i = 0; i < newVal; i++) {
      this.tempArray[i] = this.extraDatas.RowSourceData![i]
    }
  }
  @Watch('properties.SelectionMargin', { deep: true })
  checkSelectionMargin (newVal: boolean, oldVal: boolean) {
    this.selectionData[0] = this.tempInputValue
  }
  mounted () {
    const initialRowSourceData = this.extraDatas.RowSourceData!
    for (let i = 0; i < this.properties.ListRows!; i++) {
      this.tempArray[i] = this.extraDatas.RowSourceData![i]
    }
    this.updateDataModel({ propertyName: 'ControlSource', value: '' })
    if (initialRowSourceData && initialRowSourceData.length === 0) {
      this.updateDataModel({ propertyName: 'TopIndex', value: -1 })
    } else {
      this.updateDataModel({ propertyName: 'TopIndex', value: 0 })
    }
  }
  // ListRows
  // get computedOptions () {
  //   return this.properties.ListRows! < 1
  //     ? this.options
  //     : this.options.slice(0, this.properties.ListRows!)
  // }
  expandWidth () {
    if (this.properties.ShowDropButtonWhen === 0) {
      return 'none'
    } else if (this.properties.ShowDropButtonWhen === 1) {
      if (this.isVisible) {
        return 'block'
      } else {
        return 'none'
      }
    }
  }

  changeDropButtonStyle () {
    if (this.properties.DropButtonStyle === 1) {
      return `url('https://img.icons8.com/android/24/000000/sort-down.png')`
    } else if (this.properties.DropButtonStyle === 2) {
      return `url('https://img.icons8.com/ios-glyphs/30/000000/ellipsis.png')`
    } else if (this.properties.DropButtonStyle === 3) {
      return `url('https://img.icons8.com/android/24/000000/minus.png')`
    }
  }

  protected get labelStyleObj (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    const font: font = controlProp.Font
      ? controlProp.Font
      : {
        FontName: 'Arial',
        FontSize: 20,
        FontItalic: true,
        FontBold: true,
        FontUnderline: true,
        FontStrikethrough: true
      }
    return {
      fontFamily: font.FontStyle ? font.FontStyle : font.FontName,
      fontSize: `${font.FontSize}px`,
      fontStyle: font.FontItalic ? 'italic' : '',
      textDecoration:
        font.FontStrikethrough === true && font.FontUnderline === true
          ? 'underline line-through'
          : font.FontUnderline
            ? 'underline'
            : font.FontStrikethrough
              ? 'line-through'
              : '',
      fontWeight: font.FontBold ? 'bold' : ''
    }
  }

  protected get boxStyleObj (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      border:
        controlProp.BorderStyle === 0
          ? 'none'
          : '1px solid ' + controlProp.BorderColor,
      width: `${controlProp.Width! + 25}px`,
      cursor:
        controlProp.MousePointer !== 0 || controlProp.MouseIcon !== ''
          ? this.getMouseCursorData
          : 'default',
      boxShadow: controlProp.SpecialEffect
        ? this.getSpecialEffectData
        : '-1px -1px lightgray',
      display: 'grid',
      gridTemplateColumns: `${controlProp.Width! + 5}px` + ' 20px'
    }
  }

  protected get itemsStyleObj (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      width: `${controlProp.ListWidth}px`
    }
  }
  protected get selectedStyleObj (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      display:
        controlProp.ShowDropButtonWhen === 2 ? 'block' : this.expandWidth(),
      backgroundImage:
        controlProp.DropButtonStyle === 0
          ? 'none'
          : this.changeDropButtonStyle(),
      backgroundPosition:
        controlProp.DropButtonStyle === 1 ? 'center' : 'bottom',
      cursor:
        controlProp.MousePointer !== 0 || controlProp.MouseIcon !== ''
          ? this.getMouseCursorData
          : 'default'
    }
  }
  enabledCheck () {
    if (this.isRunMode || this.isEditMode) {
      if (this.properties.Enabled) {
        if (!this.properties.Locked) {
          this.open = !this.open
        }
      } else {
        this.open = false
      }
    } else {
      this.open = false
    }
    this.toFocus()
  }
}
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 100px;
  text-align: left;
  outline: none;
  height: 47px;
  box-sizing: border-box;
  /* line-height: 10px; specify the drop down height */
}
.selectionSpan {
  width: 5px;
}
.selectionDiv {
  display: grid;
  grid-template-columns: 5px auto;
}
.selected {
  background-color: lightgray;
  /* border-radius: 6px; */
  border: 1px solid #858586;
  border-left: 0px;
  color: black;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50" border="1px solid red"><polygon points="0,0 100,0 50,50" style="fill:%23666666;stroke-width:3;stroke:rgb(0,0,250)" /></svg>');
  background-size: 40%;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  /* user-select: none; */
  width: 20px;
  height: calc(100% - 2px);
}

.items {
  color: black;
  background-color: white;
  overflow: hidden;
  left: 0;
  right: 0;
  width: calc(100% + 20px);
}
.item {
  color: black;
  /* padding-left: 8px; */
  cursor: pointer;
  border-left: 1px solid black;
  border-right: 1px solid black;
}
.item:hover {
  background-color: #0380fc;
  color: white;
  border: 1px dotted black;
}
.selectHide {
  display: none;
}
.combobox {
  display: grid;
  grid-template-columns: auto 20px;
}
.columnHeads {
  height: 19.2px;
  border: 1px solid black;
  border-top: 0px;
  display: grid;
  grid-template-columns: 100%;
}
.listStyle {
  width: 100%;
  height: 100%;
  background-color: lightgray;
  border: 1px solid gray;
  overflow: auto;
  /* box-shadow: -1px -1px lightgray; */
}
.list-outer {
  border: 0.1px solid lightgray;
  width: 164px;
  height: 130px;
  overflow-y: auto;
  box-shadow: -1px -1px grey;
}
.tr {
  outline: none;
}
.tr:hover {
  background-color: rgb(59, 122, 231);
}
.ul {
  display: grid;
  grid-template-columns: 100%;
  list-style-type: none;
  margin-block-start: 0em;
  margin-block-end: 0em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 0px;
}
.li {
  /* padding: 3px; */
  margin: 1px;
  text-align: left;
  font-size: 14px;
  height: 16px;
  border: 0.5px solid white;
  cursor: pointer;
}
.li:hover {
  margin: 1px;
  border-color: rgb(52, 52, 255);
  border-radius: 2px;
  background-color: rgb(59, 122, 231);
}
.fa {
  margin-left: 4px;
  margin-top: 3px;
}
.span {
  /* margin: 4px;  */
  margin-left: 7px;
  margin-top: 0px;
  font-family: Arial, Helvetica, sans-serif;
}
.labelStyle {
  white-space: nowrap;
}
.div {
  display: grid;
  grid-template-columns: 1fr;
}
.listbox {
  display: grid;
  grid-template-columns: 100%;
  height: 100px;
  width: 300px;
  background-color: lightgray;
  border: 1px solid gray;
}
.columnHeads {
  height: 19.2px;
  border: 1px solid black;
  display: grid;
  grid-template-columns: 100%;
}
.optionsItems {
  display: grid;
  grid-template-columns: 100%;
}
.text-box-design {
  /* border: 0.2px solid gray; */
  /* box-shadow: -1px -1px gray; */
  /* width: 100px; */
  /* height: 20px; */
  resize: none;
  overflow: hidden;
  border: none;
  font-family: monospace;
}
.text-box-design:focus {
  outline: none;
}
.text-box-design::selection {
  background: lightblue;
}
.table-style {
  width: 100%;
}
.theadClass {
  border-bottom: 1px solid;
  white-space: nowrap;
}
.tdClass {
  width: 15px;
  border-right: 1px solid;
}
.tdClassIn {
  width: 10px;
}
.inputClass {
  margin: 0;
}
</style>
