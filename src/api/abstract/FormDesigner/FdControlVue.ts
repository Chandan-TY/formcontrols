import { controlProperties } from '@/FormDesigner/controls-properties'
import {
  PositionXYData,
  ScrollBarData
} from '@/FormDesigner/controls-properties-types'
import { PropType } from 'vue'
import { Component, Emit, Prop, PropSync, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'FdControlVue'
})
export default class FdControlVue extends Vue {
  @Prop({ required: true, type: Boolean }) public isRunMode!: boolean
  @Prop({ required: true, type: Boolean }) public isEditMode!: boolean
  @PropSync('isEditMode') public syncIsEditMode!: boolean

  @Prop({ required: true, type: Object as PropType<controlData> }) public data! : controlData
  @Prop({ required: true, type: String }) public controlId! : string
  @Prop({ default: false }) isActivated: boolean
  isContentEditable: boolean = false
  selectionData :Array<string> = [];
  matchEntry: Array<number> = [];
  matchIndex = -1;
  isDropdownVisible: boolean = true;
  isItalic: boolean = false;
  tempWeight: string = '400';
  tempStretch: string = 'normal';
  isVisible: boolean = false;
  tempListBoxComboBoxEvent: Event

   // global variable to keep track of TripleState when enabled
   protected tripleState:number = 0

  // dynamic ref form textbox component
  protected autoSizeTextarea: HTMLLabelElement

  // dynamic ref from checkbox component
  protected autoSizecheckbox: HTMLDivElement

  // dynamic ref from optionButton component
  protected autoSizeOptionButton! : HTMLDivElement

  // ref of respective components
  protected checkboxRef: HTMLDivElement
  protected optionBtnRef: HTMLDivElement
  protected textareaRef: HTMLTextAreaElement

  preventClickOnce: boolean = false
  addEventCustomCallback (e: CustomMouseEvent) {
    this.controlEditMode(e)
    const self = this
    e.customCallBack = () => {
      self.preventClickOnce = true
    }
  }

  selectedItem (event: Event) {
    if (this.preventClickOnce) {
      this.preventClickOnce = false
    } else {
      this.emitSelectedItem(event)
    }
  }

  @Emit('selectedItem')
  emitSelectedItem (event: Event) {
    return event
  }

  @Emit('dragGroup')
  dragGroup (event: Event) {
    return event
  }

  @Emit('deleteItem')
  deleteItem (event: Event) {
    return event
  }

  @Emit('setEditMode')
  setEditMode (contentEditable: boolean) {
    return contentEditable
  }

  @Emit('controlEditMode')
  controlEditMode (event: MouseEvent) {
    return event
  }

  updateCaption (updateValue : string) {
    this.updateDataModel({ propertyName: 'Caption', value: updateValue })
  }

  /**
   * @description userFormId and controlId which is taken as props from parent Component
   * @abstract propControlData
   */
  public get properties () :controlProperties {
    return this.data.properties
  }

  public get extraDatas () : extraDatas {
    return this.data.extraDatas!
  }
  public get controls () : string[] {
    return this.data.controls
  }

  protected get renderSize () :Partial<CSSStyleDeclaration> {
    return {
      width: `${this.properties.Width}px`,
      height: `${this.properties.Height}px`
    }
  }

  protected get baseStyle () :Partial<CSSStyleDeclaration> {
    return {
      backgroundColor: this.properties.BackColor,
      display: 'block'
    }
  }

  /**
   * @description getSpecialEffectData returns string value from
   * controlProperties.specialEffectProp
   * @function getSpecialEffectData
   * @returns string value
   */
  protected get getSpecialEffectData (): string {
    return controlProperties.specialEffectProp(this.data)
  }
  /**
   * @description getBorderStyle returns string value from
   * controlProperties.borderStyleProp
   * @function getBorderStyle
   * @returns string value
   */
  protected get getBorderStyle (): string {
    return controlProperties.borderStyleProp(this.data)
  }
  /**
   * @description getMouseCursorData returns string value from
   * controlProperties.mousePointerProp
   * @function getMouseCursorData
   * @returns string value
   */
  protected get getMouseCursorData (): string {
    return controlProperties.mousePointerProp(this.data)
  }
  /**
   * @description getEnabled returns string value from
   * controlProperties.enabledProp
   * @function getEnabled
   * @returns string value
   */
  protected get getEnabled (): string {
    return controlProperties.enabledProp(this.data)
  }
  /**
   * @description getRepeat returns string value from
   * controlProperties.extraDataRepeatProp
   * @function getRepeat
   * @returns string value
   */
  protected get getRepeat (): string {
    return controlProperties.extraDataRepeatProp(this.data)
  }
  /**
   * @description getPosition returns string value from
   * controlProperties.picturePositionProp
   * @function getPosition
   * @returns string value
   */
  protected get getPosition (): string {
    return controlProperties.picturePositionProp(this.data)
  }
  /**
   * @description getPositionX returns string value from
   * controlProperties.pictureXYPositionProp
   * @function getPositionX
   * @returns string value
   */
  protected get getPositionX (): string {
    const posX: PositionXYData = controlProperties.pictureXYPositionProp(
      this.data
    )
    return posX.backgroundPositionX
  }
  /**
   * @description getPositionY returns string value from
   * controlProperties.pictureXYPositionProp
   * @function getPositionY
   * @returns string value
   */
  protected get getPositionY (): string {
    const posY: PositionXYData = controlProperties.pictureXYPositionProp(
      this.data
    )
    return posY.backgroundPositionY
  }
  /**
   * @description getSizeMode returns string value from
   * controlProperties.pictureSizeModeProp
   * @function getSizeMode
   * @returns string value
   */
  protected get getSizeMode (): string {
    return controlProperties.pictureSizeModeProp(this.data)
  }
  /**
   * @description getScrollBarX returns string value from
   * controlProperties.scrollBarProp / controlProperties.scrollBarTextBoxProp
   * @function getScrollBarX
   * @returns string value
   */
  protected get getScrollBarX (): string {
    if (this.data.type === 'TextBox') {
      const scrollYData = controlProperties.scrollBarTextBoxProp(this.data)
      return scrollYData.overflowY
    }
    const scrollX: ScrollBarData = controlProperties.scrollBarProp(
      this.data
    )
    return scrollX.overflowX
  }

  /**
   * @description getScrollBarY returns string value from
   * controlProperties.scrollBarProp / controlProperties.scrollBarTextBoxProp
   * @function getScrollBarY
   * @returns string value
   */
  protected get getScrollBarY (): string {
    if (this.data.type === 'TextBox') {
      const scrollYData = controlProperties.scrollBarTextBoxProp(this.data)
      return scrollYData.overflowY
    }
    const scrollY: ScrollBarData = controlProperties.scrollBarProp(
      this.data
    )
    return scrollY.overflowY
  }
  /**
   * @description getScrollingHeight returns string value from
   * controlProperties.scrollBarWidthAndHeightProp
   * @function getScrollingHeight
   * @returns string value
   */
  protected get getScrollingHeight (): string {
    const scrollingHeight = controlProperties.scrollBarWidthAndHeightProp(
      this.data
    )
    return scrollingHeight.scrollHeight
  }
  /**
   * @description getScrollingWidth returns string value from
   * controlProperties.scrollBarWidthAndHeightProp
   * @function getScrollingWidth
   * @returns string value
   */
  protected get getScrollingWidth (): string {
    const scrollingWidth = controlProperties.scrollBarWidthAndHeightProp(
      this.data
    )
    return scrollingWidth.scrollWidth
  }

  /**
   * @description checkOtherOrientations returns string value from
   * controlProperties.controlsOrientationProp
   * @function checkOtherOrientations
   * @returns boolean value
   */
  protected checkOtherOrientations () : boolean {
    throw new Error('checkOtherOrientations Not Implemented')
  }

  /**
   * @description getForeColorValue returns string value from
   * controlProperties.getForeColor
   * @function getForeColorValue
   * @returns string value
   */
  protected get getForeColorValue () : string {
    return controlProperties.getForeColor(this.data)
  }

  /**
   * @description increaseTheValue calls Vuex Actions to update object and Value Property
   * @function increaseTheValue
   */
  protected increaseTheValue () {
    let tempVal, tempMax
    tempVal = (this.properties.Value as number)!
    tempMax = this.properties.Max!
    if (
      tempVal <= tempMax &&
        tempMax - tempVal > this.properties.SmallChange!
    ) {
      tempVal = tempVal + this.properties.SmallChange!
    } else if (tempVal <= tempMax) {
      tempVal = tempMax
    } else {
      tempVal = tempMax
    }
    this.updateDataModel({ propertyName: 'Value', value: tempVal })
  }

  /**
   * @description decreaseTheValue calls Vuex Actions to update object and Value Property
   * @function decreaseTheValue
   */
  protected decreaseTheValue () {
    let tempVal, tempMin
    tempVal = (this.properties.Value as number)!
    tempMin = this.properties.Min!
    if (
      tempVal >= tempMin &&
        tempVal - tempMin > this.properties.SmallChange!
    ) {
      tempVal = tempVal - this.properties.SmallChange!
    } else if (tempVal >= tempMin) {
      tempVal = tempMin
    } else {
      tempVal = tempMin
    }
    this.updateDataModel({ propertyName: 'Value', value: tempVal })
  }
  /**
   * @description transformScrollButtonStyle returns string value from
   * knobProperties.transformScrollButtonStyle
   * @function transformScrollButtonStyle
   * @returns string value
   */
  protected get transformScrollButtonStyle () : string {
    return controlProperties.transformScrollButtonStyle(this.data)
  }

  /**
  * @description update the isContentEditable to make the Button content editable
  * or noneditable on click of enter key
  * @function setContentEditable
  * @param event
  * @param contentEditable
  */
  setContentEditable (event : KeyboardEvent, contentEditable : boolean) {
    this.setEditMode(contentEditable)
  }

  /**
   * @description  sets Styles to checkbox/optionButton and label based on control Value property
   * @function setStyle
   *@param ref
   *@param checked
   *@param disabled
   *@param bgColor
   */
  setStyle (ref:HTMLInputElement, checked:boolean, disabled:boolean, bgColor:string) {
    if (ref) {
      ref.checked = checked;
      ((ref.parentNode as HTMLLabelElement).childNodes[1] as HTMLSpanElement).style.backgroundColor = bgColor
      ref.disabled = disabled
    }
  }

  /**
   * @description  style object is passed to :style attribute in span tag in checkbox/OptionButton
   * dynamically changing the styles of the component based on properties
   * @function styleForBtn
   *
   */
  get styleForBtn () {
    const style = { border: '1px inset grey', backgroundColor: 'inherit', top: '0px', position: 'relative' }
    if (!this.properties.Enabled) {
      style.backgroundColor = 'rgba(220, 220, 220, 1)'
    }
    if (this.properties.SpecialEffect === 0) {
      return style
    } else {
      style.border = '2px groove grey'
      return style
    }
  }

  /**
   * @description  sets controlSource if present and updates Value property
   * @function controlSource
   */
  @Watch('properties.ControlSource', { deep: true })
  controlSource () {
    const propData: controlData = this.data
    if (this.data.type === 'SpinButton' || this.data.type === 'ScrollBar') {
      if (propData.properties.ControlSource) {
        this.updateDataModel({ propertyName: 'Value', value: propData.extraDatas!.ControlSourceValue })
      }
    } else if (propData.properties.ControlSource) {
      const controlSourceValue = propData.extraDatas!.ControlSourceValue!.toLowerCase()
      const isBoolean:boolean | string = (controlSourceValue === 'true') ? true : (controlSourceValue === 'false') ? false : ''
      this.updateDataModel({ propertyName: 'Value', value: isBoolean.toString() })
    }
  }
  /**
   * @description  update the value of control properties
   * @function updateDataModel
   * @param updateData
   */
  @Emit('updateModel')
  updateDataModel (updateData: IupdateDataModel) {
    return updateData
  }

  /**
   * @description  update the value of control extraDatas properties
   * @function updateDataModelExtraData
   * @param updateData
   */
  @Emit('updateModelExtraData')
  updateDataModelExtraData (updateData: IupdateDataModelExtraData) {
    return updateData
  }

  /**
  * @description watches text properties
  * @function valueUpdateProp
  * @param oldVal previous string value
  * @param newVal  new/changed string value
  */
 @Watch('properties.Text', { deep: true })
  valueUpdateProp (newVal:string, oldVal:string) {
    if (this.data.type!.includes('TextBox')) {
      const propData: controlProperties = this.properties
      this.updateDataModel({ propertyName: 'Value', value: newVal })
    }
  }

 /**
  * @description watches text and value properties are same when component is mounted/changed
  * @function textAndValueUpdateProp
  * @param oldVal previous properties data
  * @param newVal  new/changed properties data
  */
 @Watch('properties.Value', { deep: true })
 textAndValueUpdateProp (newVal:string, oldVal:string) {
   if (this.data.type!.includes('TextBox')) {
     const propData: controlProperties = this.properties
     if (propData.Text !== propData.Value && propData.ControlSource === '') {
       const propText: number = propData.Text!.length
       const propValue: number = (propData.Value as string).length
       this.updateDataModel({ propertyName: propText > propValue ? 'Value' : 'Text',
         value: propText > propValue
           ? this.properties.Text!
           : this.properties.Value! })
     }
   } else if (this.data.type!.includes('CheckBox') || this.data.type!.includes('OptionButton')) {
     const value = this.properties.Value
     const valueType:boolean | string = typeof value
     let isBoolean:boolean | string = ''
     if (valueType === 'boolean') {
       isBoolean = (value as boolean)
     } else if (valueType === 'string') {
       isBoolean = ((value as string).toLowerCase() === 'true') ? true : ((value as string).toLowerCase() === 'false') ? false : ''
     }
     const ref = this.data.type!.includes('CheckBox') ? this.checkboxRef : this.optionBtnRef
     if (isBoolean !== '') {
       if (isBoolean) {
         this.setStyle((ref as HTMLInputElement), (isBoolean as boolean), !(isBoolean as boolean), 'white')
       } else {
         this.setStyle((ref as HTMLInputElement), false, false, 'white')
       }
     } else {
       this.setStyle((ref as HTMLInputElement), true, true, 'rgba(220, 220, 220, 1)')
     }
   }
 }

 /**
  * @description changing width and height of textarea tag by replicating style of
  * textarea with label tag to making the property work in textarea
  * @function updateAutoSize
  * @param oldVal previous properties data
  * @param newVal  new/changed properties data
  */
 updateAutoSize (newVal:boolean, oldVal:boolean) {
   throw new Error('updateAutosize Not Implemented')
 }
 /**
   * @description  sets checked or unchecked when checkbox is clicked
   * if TripleState is True, Null state will be visible
   * @function handleChange
   * @param event it is of type MouseEvent
   */
 handleChange (event: MouseEvent, targetRef: HTMLInputElement) {
   if (event.target instanceof HTMLInputElement) {
     const el = event.target.checked
     if (this.properties.TripleState) {
       this.tripleState++
       if (this.tripleState % 3 === 0) {
         this.setStyle(targetRef, true, false, 'rgba(220, 220, 220, 1)')
       } else {
         this.setStyle(targetRef, el, false, 'white')
         this.updateDataModel({ propertyName: 'Value', value: el })
       }
     } else {
       this.tripleState++
       this.updateDataModel({ propertyName: 'Value', value: el })
       this.setStyle(targetRef, el, false, 'white')
     }
   }
 }
 /**
   * @description getRepeat returns string value from
   * controlProperties.extraDataRepeatProp
   * @function getRepeat
   */
 protected get getRepeatData (): string {
   //  if (this.properties.Picture === '') {
   return controlProperties.extraDataRepeatProp(this.data)
   //  } else {
   //    return controlProperties.pictureTilingProp(this.data)
   //  }
 }
 /**
   * @description computedCaption returns object value from
   * with acceleratorCaption, afterbeginCaption, beforeendCaption values
   * @function computedCaption
   * @returns object value
   */
 protected get computedCaption () {
   let accelerator = ''
   if (this.properties.Accelerator) {
     accelerator = this.properties.Accelerator!.charAt(0)
   }
   return controlProperties.acceleratorProp(this.properties.Caption!, accelerator)
 } updateColumnWidths (index: number) {
   const controlProp = this.properties
   const updateColWidth = controlProp.ColumnWidths!.split(';')
   const colChangeCheck: boolean = controlProp.ColumnCount! - 1 < index
   return {
     textAlign: controlProp.TextAlign === 0 ? 'left' : controlProp.TextAlign === 2 ? 'right' : 'center',
     width: colChangeCheck ? '0px' : ((updateColWidth[index]) ? parseInt(updateColWidth[index]) + 'px' : controlProp.ColumnCount! > index ? '100px' : '0px'),
     overflow: 'hidden'
   }
 }
 updateColHeads (index: number) {
   const controlProp = this.properties
   const updateColWidth = controlProp.ColumnWidths!.split(';')
   return {
     textAlign: controlProp.TextAlign === 0 ? 'left' : controlProp.TextAlign === 2 ? 'right' : 'center',
     borderRight: (index < controlProp.ColumnCount! - 1) ? '1px solid' : '',
     width: (updateColWidth[index]) ? parseInt(updateColWidth[index]) + 'px' : '100px',
     overflow: 'hidden'
   }
 }

/**
 * @description watches changes in properties for BoundColumn
 * @function boundColumnValue
 * @param oldVal previous properties data
 * @param newVal  new/changed properties data
 */
@Watch('properties.BoundColumn', { deep: true })
 boundColumnValue (newVal:number, oldVal:number) {
   if (this.properties.BoundColumn! > 0 && this.properties.BoundColumn! < this.extraDatas.RowSourceData!.length) {
     let tempData = [...this.extraDatas.RowSourceData!]
    tempData![0][0] = tempData![0][newVal - 1]
    let tempValue = tempData![0][newVal - 1]
    this.updateDataModelExtraData({ propertyName: 'RowSourceData', value: tempData })
    this.updateDataModel({ propertyName: 'Value', value: tempValue })
   }
 }

/**
 * @description watches changes in properties for TextColumn
 * @function textColumnChange
 * @param oldVal previous properties data
 * @param newVal  new/changed properties data
 */
@Watch('properties.TextColumn', { deep: true })
textColumnChange (newVal:number, oldVal:number) {
  if (newVal > 0 && newVal < this.extraDatas.RowSourceData!.length) {
    let tempData = [...this.extraDatas.RowSourceData!]
    let tempValue = tempData![0][newVal - 1]
    this.updateDataModel({ propertyName: 'Text', value: tempValue })
  } else {
    this.updateDataModel({ propertyName: 'Text', value: '' })
  }
}

/**
 * @description watches changes in properties for TopIndex
 * @function topIndexCheck
 * @param oldVal previous properties data
 * @param newVal  new/changed properties data
 */
@Watch('properties.TopIndex', { deep: true })
topIndexCheck (newVal:number, oldVal:number) {
  if (this.extraDatas.RowSourceData!.length === 0) {
    this.updateDataModel({ propertyName: 'TopIndex', value: -1 })
  } else {
    this.updateDataModel({ propertyName: 'TopIndex', value: 0 })
  }
}

/**
 * @description updates the dataModel listBox object properties when user clicks
 * @function handleMultiSelect
 * @param event its of type MouseEvent
 * @event click
 *
 */
handleMultiSelect (e: MouseEvent) {
  debugger
  if (e.target instanceof HTMLTableCellElement || e.target instanceof HTMLTableRowElement) {
    this.tempListBoxComboBoxEvent = e
    const targetElement = e.target
    const tempData = targetElement.parentElement!.children[0] as HTMLTableElement
    const tempDataOption = targetElement.parentElement!.children[1] as HTMLTableElement
    const tempPath = e.composedPath()
    targetElement.focus()
    let data = targetElement.innerText
    let splitData = data.replace(/\t/g, ' ').split(' ')
    // this.selectionData[0] = this.data.properties.ListStyle === 0 ? tempData.innerText : tempDataOption.innerText
    if (this.data.properties.ListStyle === 0) {
      this.selectionData[0] = tempData.innerText
    } else {
      this.selectionData[0] = tempDataOption.innerText
    }
    if (this.properties.Enabled && this.properties.Locked === false) {
      if (this.properties.MultiSelect === 0) {
        if (this.properties.ControlSource !== '') {
          this.updateDataModel({ propertyName: 'Text', value: this.selectionData[0] })
          this.updateDataModel({ propertyName: 'Value', value: this.selectionData[0] })
          this.updateDataModelExtraData({ propertyName: 'ControlSourceValue', value: this.selectionData[0] })
        }
        this.clearOptionBGColorAndChecked(e)
        this.setOptionBGColorAndChecked(e)
        let isListStyle = 0
        if (this.properties.TextColumn === -1 || this.properties.TextColumn === 1) {
        // 0th index is empty string
          if (this.properties.ListStyle === 0) {
            isListStyle = -1
          }
          this.updateDataModel({ propertyName: 'Text', value: splitData[1 - isListStyle] })
          this.updateDataModel({ propertyName: 'Value', value: splitData[1 - isListStyle] })
        } else if (this.properties.TextColumn === 0) {
          this.updateDataModel({ propertyName: 'Text', value: splitData[2 - isListStyle] })
          this.updateDataModel({ propertyName: 'Value', value: splitData[1 - isListStyle] })
        } else {
          this.updateDataModel({ propertyName: 'Text', value: splitData[this.properties.TextColumn!] })
          this.updateDataModel({ propertyName: 'Value', value: splitData[1 - isListStyle] })
        }
      } else if (this.properties.MultiSelect === 1) {
        if (targetElement.tagName === 'INPUT') {
          this.setOptionBGColorAndChecked(e)
        } else {
          this.setOptionBGColorAndChecked(e)
        }
      } else if (this.properties.MultiSelect === 2) {
        if (e.ctrlKey === true) {
          if (targetElement.tagName === 'INPUT') {
            this.setOptionBGColorAndChecked(e)
          } else {
            this.setOptionBGColorAndChecked(e)
          }
        } else if (e.shiftKey === true && this.properties.Value !== '') {
          let startPoint = 0
          let endPoint = 0
          for (let i = 0; i < tempPath.length; i++) {
            const ele = tempPath[i] as HTMLTableElement
            if (ele.className === 'table-body') {
            // extend points start and end
              for (let j = 0; j < ele.childNodes.length; j++) {
                const cd = ele.childNodes[j] as HTMLTableElement
                if (cd.innerText === this.properties.Value) {
                  startPoint = j + 1
                }
                if (cd.innerText === targetElement.innerText) {
                  endPoint = j
                }
              }
              // upward selection start and end swap
              if (startPoint > endPoint) {
                let temp = startPoint
                startPoint = endPoint
                endPoint = temp
              }
              // setting selection
              for (let k = startPoint; k <= endPoint; k++) {
                const node = ele.childNodes[k] as HTMLTableElement
                const tempNode = node.childNodes[0].childNodes[0] as HTMLInputElement
                node.style.backgroundColor = 'rgb(59, 122, 231)'
                if (
                  this.properties.ListStyle === 1 &&
             !tempNode.checked
                ) {
                // tempNode.checked = !tempNode.checked
                  tempNode.checked = true
                }
              }
              break
            }
          }
        } else {
          this.clearOptionBGColorAndChecked(e)
          this.setOptionBGColorAndChecked(e)
          this.updateDataModel({ propertyName: 'Value', value: targetElement.innerText })
        }
      } else {
        if (this.properties.ControlSource !== '') {
          this.updateDataModel({ propertyName: 'Text', value: this.selectionData[0] })
          this.updateDataModel({ propertyName: 'Value', value: this.selectionData[0] })
          this.updateDataModelExtraData({ propertyName: 'ControlSourceValue', value: this.selectionData[0] })
        }
        this.clearOptionBGColorAndChecked(e)
        this.setOptionBGColorAndChecked(e)
        let isListStyle = 0
        if (this.properties.TextColumn === -1 || this.properties.TextColumn === 1) {
        // 0th index is empty string
          if (this.properties.ListStyle === 0) {
            isListStyle = -1
          }
          this.updateDataModel({ propertyName: 'Text', value: splitData[1 - isListStyle] })
          this.updateDataModel({ propertyName: 'Value', value: splitData[1 - isListStyle] })
        } else if (this.properties.TextColumn === 0) {
          this.updateDataModel({ propertyName: 'Text', value: splitData[2 - isListStyle] })
          this.updateDataModel({ propertyName: 'Value', value: splitData[1 - isListStyle] })
        } else {
          this.updateDataModel({ propertyName: 'Text', value: splitData[this.properties.TextColumn!] })
          this.updateDataModel({ propertyName: 'Value', value: splitData[1 - isListStyle] })
        }
      }
    }
  } else {
    if (this.properties.MultiSelect !== 1) {
      this.clearOptionBGColorAndChecked(e)
    }
    this.setOptionBGColorAndChecked(e)
  }
}
/**
 * @description updates the dataModel listBox object properties when keydown
 * @function handleExtendArrowKeySelect
 * @param event its of type KeyboardEvent
 * @event keydown
 *
 */
handleExtendArrowKeySelect (e: KeyboardEvent) {
  // if (e.target instanceof HTMLTableRowElement) {
  const tempPath = e.composedPath()
  const eventTarget = e.target as HTMLTableRowElement
  const nextSiblingEvent = eventTarget.nextSibling as HTMLTableElement
  const prevSiblingEvent = eventTarget.previousSibling as HTMLTableElement
  if (
   this.properties.MatchEntry! === 0 &&
   e.keyCode >= 48 && e.keyCode <= 90
  ) {
    this.matchEntry = []
    const prevMatchData =
   this.extraDatas.MatchData === '' ? e.key : this.extraDatas.MatchData
    this.updateDataModelExtraData({ propertyName: 'MatchData', value: prevMatchData !== e.key ? e.key : prevMatchData })

    for (let index = 0; index < tempPath.length; index++) {
      const element = tempPath[index] as HTMLTableElement
      if (element.className === 'table-body') {
        for (let index = 0; index < element.childNodes.length; index++) {
          const ei = element.childNodes[index] as HTMLTableElement
          let splitData = ei.innerText.replace(/\t/g, ' ').split(' ')
          let si = 0
          if (this.properties.ListStyle === 0) {
            si = -1
          }
          if (splitData[si + 1][0].includes(this.extraDatas.MatchData!)) {
            this.matchEntry.push(index)
          }
        }

        if (
         this.extraDatas.MatchData![0] !== undefined &&
         this.extraDatas.MatchData![0] === e.key &&
         this.extraDatas.MatchData!.length > 0
        ) {
          const tempChildNode = element.childNodes[this.matchEntry[this.matchIndex]] as HTMLTableElement
          this.matchIndex++
          if (
            this.matchIndex === this.matchEntry.length &&
           prevMatchData === this.extraDatas.MatchData
          ) {
            this.matchIndex = 0
            this.clearOptionBGColorAndChecked(e)
            this.setBGandCheckedForMatch(
              tempChildNode
            )
            break
          } else if (prevMatchData !== this.extraDatas.MatchData) {
            this.matchIndex = 0
            this.clearOptionBGColorAndChecked(e)
            this.setBGandCheckedForMatch(
              tempChildNode
            )
            break
          } else {
            if (this.matchEntry.length === 0) {
              this.matchEntry.push(0)
              this.matchIndex = 0
            }
            this.clearOptionBGColorAndChecked(e)
            this.setBGandCheckedForMatch(
              tempChildNode
            )
            break
          }
        }
        break
      }
    }
  } else if (
    this.properties.MatchEntry === 1 &&
   e.keyCode >= 48 && e.keyCode <= 90
  ) {
    let temp = this.extraDatas.MatchData + e.key
    this.updateDataModelExtraData({ propertyName: 'MatchData', value: temp })

    for (let point = 0; point < tempPath.length; point++) {
      const tbody = tempPath[point] as HTMLTableElement
      if (tbody.className === 'table-body') {
        this.matchEntry = []
        for (let p = 0; p < tbody.childNodes.length; p++) {
          const ei = tbody.childNodes[p] as HTMLTableElement
          let matchEntryComplete = ei.innerText
            .replace(/\t/g, ' ')
            .split(' ')
          let sii = 0
          if (this.properties.ListStyle === 0) {
            sii = -1
          }
          if (
            matchEntryComplete[sii + 1][0].includes(this.extraDatas.MatchData!) &&
           this.extraDatas.MatchData!.length < 2
          ) {
            this.matchEntry.push(p)
          } else if (
            matchEntryComplete[sii + 1].includes(this.extraDatas.MatchData!) &&
           this.extraDatas.MatchData!.length > 1
          ) {
            this.matchEntry.push(p)
          }
        }

        if (this.extraDatas.MatchData!.length <= 1) {
          let singleMatch = tbody.childNodes[this.matchEntry[0]] as HTMLTableElement
          this.clearOptionBGColorAndChecked(e)
          this.setBGandCheckedForMatch(singleMatch)
          break
        } else if (
         this.extraDatas.MatchData!.length > 1 &&
         this.matchEntry.length !== 0
        ) {
          let completeAutoMatch = tbody.childNodes[this.matchEntry[0]] as HTMLTableElement
          this.clearOptionBGColorAndChecked(e)
          this.setBGandCheckedForMatch(completeAutoMatch)
        }
        break
      }
    }
  }

  if (
    e.key === 'ArrowDown' &&
   e.shiftKey === true &&
   eventTarget.nextSibling !== null
  ) {
    if (eventTarget.style.backgroundColor !== 'rgb(59, 122, 231)') {
      this.setOptionBGColorAndChecked(e)
    } else if (
      eventTarget.style.backgroundColor === 'rgb(59, 122, 231)' &&
     nextSiblingEvent.style.backgroundColor !== ''
    ) {
      this.setOptionBGColorAndChecked(e)
    } else if (eventTarget.nextSibling.nextSibling !== null) {
      this.setBGColorForNextSibling(e)
    } else if (
      eventTarget.nextSibling.nextSibling === null &&
     nextSiblingEvent.style.backgroundColor !== 'rgb(59, 122, 231)'
    ) {
      this.setBGColorForNextSibling(e)
    }

    nextSiblingEvent.focus()
  } else if (
    e.key === 'ArrowUp' &&
   e.shiftKey === true &&
   eventTarget.previousSibling !== null
  ) {
    if (
      eventTarget.style.backgroundColor === 'rgb(59, 122, 231)' &&
     prevSiblingEvent.style.backgroundColor !== ''
    ) {
      this.setOptionBGColorAndChecked(e)
    } else if (eventTarget.previousSibling.previousSibling !== null) {
      this.setBGColorForPreviousSibling(e)
    } else if (
      eventTarget.previousSibling.previousSibling === null &&
     prevSiblingEvent.style.backgroundColor !== 'rgb(59, 122, 231)'
    ) {
      this.setBGColorForPreviousSibling(e)
    }
    prevSiblingEvent.focus()
  }
  // }
}

/**
* @description updates the dataModel listBox object properties when mouseenter
* @function handleDrag
* @param event its of type MouseEvent
* @event mouseenter
*
*/
handleDrag (e: MouseEvent) {
  if (this.properties.MultiSelect === 2) {
    // this.setOptionBGColorAndChecked(e)
    if (e.which === 1) {
      // if (e.type === 'mouseenter') {
      this.setOptionBGColorAndChecked(e)
    }
    // }
   window.getSelection()!.removeAllRanges()
  }
}

/**
* @description set Background Color for next siblings
* @function setBGColorForNextSibling
* @param event its of type MouseEvent or KeyboardEvent
*/
setBGColorForNextSibling (e: MouseEvent | KeyboardEvent) {
  if (e.target instanceof HTMLTableCellElement) {
    const targetEvent = e.target
    const nextSiblingEvent = targetEvent.nextSibling as HTMLTableElement
    const nextSiblingCheckedEvent = nextSiblingEvent.children[0].childNodes[0] as HTMLInputElement
    nextSiblingEvent.style.backgroundColor =
   nextSiblingEvent.style.backgroundColor === 'rgb(59, 122, 231)'
     ? ''
     : 'rgb(59, 122, 231)'
    if (
      this.properties.ListStyle === 1 &&
   this.properties.MultiSelect === 2
    ) {
      nextSiblingCheckedEvent.checked = !nextSiblingCheckedEvent.checked
    }
  }
}

/**
* @description set Background Color foe previous siblings
* @function setBGColorForNextSibling
* @param event its of type MouseEvent or KeyboardEvent
*/
setBGColorForPreviousSibling (e: KeyboardEvent) {
  if (e.target instanceof HTMLTableCellElement) {
    const targetEvent = e.target
    const prevSiblingEvent = targetEvent.previousSibling as HTMLTableElement
    const prevSiblingCheckedEvent = prevSiblingEvent.children[0].childNodes[0] as HTMLInputElement
    prevSiblingEvent.style.backgroundColor =
   prevSiblingEvent.style.backgroundColor === 'rgb(59, 122, 231)'
     ? ''
     : 'rgb(59, 122, 231)'
    if (
      this.properties.ListStyle === 1 &&
   this.properties.MultiSelect === 2
    ) {
      prevSiblingCheckedEvent.checked = !prevSiblingCheckedEvent.checked
    }
  }
}

/**
* @description clear selected option for SingleSelection
* @function clearOptionBGColorAndChecked
* @param event
*/
clearOptionBGColorAndChecked (e: any) {
  const tempPath = e.path
  if (tempPath && tempPath.length > 0) {
    for (let index = 0; index < tempPath.length; index++) {
      const element = tempPath[index] as HTMLTableElement
      if (element.className === 'table-body') {
        for (
          let childIndex = 0;
          childIndex < element.childNodes.length;
          childIndex++
        ) {
          const childNode = element.childNodes[childIndex] as HTMLTableElement
          childNode.style.backgroundColor = ''
          const ChildChecked = childNode.childNodes[0].childNodes[0] as HTMLInputElement
          if (ChildChecked && this.properties.ListStyle === 1) {
            ChildChecked.checked = false
          }
        }
        break
      }
    }
  }
}

/**
* @description handle setting backgroundColor and option checked/not
* @function setOptionBGColorAndChecked
* @param event KeyboardEvent or MouseEvent
*/
setOptionBGColorAndChecked (e: KeyboardEvent | MouseEvent) {
  const currentTargetElement = e.currentTarget as HTMLTableElement
  const childNodeChecked = currentTargetElement.children[0].childNodes[0] as HTMLInputElement
  currentTargetElement.style.backgroundColor =
   currentTargetElement.style.backgroundColor === 'rgb(59, 122, 231)'
     ? ''
     : 'rgb(59, 122, 231)'
  if ((e.target instanceof HTMLTableCellElement || e.target instanceof HTMLTableRowElement)) {
    const targetEvent = e.target
    if (this.data.type === 'ComboBox') {
      currentTargetElement.style.backgroundColor = ''
    }
    if (
      this.properties.ListStyle === 1 &&
   this.properties.MultiSelect === 0
    ) {
      childNodeChecked.checked = !childNodeChecked.checked
    } else if (
      this.properties.ListStyle === 1 &&
   this.properties.MultiSelect === 1 &&
   targetEvent.tagName === 'INPUT'
    ) {
    } else if (this.properties.MultiSelect === 2) {
      currentTargetElement.style.backgroundColor = 'rgb(59, 122, 231)'
      childNodeChecked.checked = true
    } else {
      childNodeChecked.checked = !childNodeChecked.checked
    }
  } else if (this.properties.MultiSelect === 2) {
    currentTargetElement.style.backgroundColor = 'rgb(59, 122, 231)'
  }
}

/**
* @description set BGColor and Checked matchEntry
* @function setBGandCheckedForMatch
* @param singleMatch which is an HTMLTableElement
*/
setBGandCheckedForMatch (singleMatch: HTMLTableElement) {
  if (singleMatch !== undefined) {
    singleMatch.style.backgroundColor = 'rgb(59, 122, 231)'
    if ((this.properties.ListStyle === 1)) {
      const tempNode = singleMatch.childNodes[0].childNodes[0] as HTMLInputElement
      tempNode.checked = !tempNode.checked
    }
  }
}

get setFontStyle () {
  const tempFontStyle = this.properties.Font!.FontStyle!.toLowerCase()
  if (tempFontStyle.includes(this.properties.Font!.FontName!.toLowerCase())) {
    if (tempFontStyle.includes('italic')) {
      this.isItalic = true
    } else {
      this.isItalic = false
    }
    if (tempFontStyle.split(' ').indexOf('bold') > -1) {
      this.tempWeight = 'bold'
    } else if (tempFontStyle.includes('black')) {
      this.tempWeight = '900'
    } else if (tempFontStyle.split(' ').indexOf('light') > -1) {
      this.tempWeight = 'lighter'
    } else if (tempFontStyle.includes('semibold')) {
      this.tempWeight = '540'
    } else if (tempFontStyle.includes('semilight')) {
      this.tempWeight = '300'
    } else {
      this.tempWeight = '400'
    }
    if (tempFontStyle.split(' ').indexOf('condensed') > -1) {
      this.tempStretch = 'condensed'
    } else if (tempFontStyle.includes('semicondensed')) {
      this.tempStretch = 'semi-condensed'
    } else if (tempFontStyle.includes('narrow')) {
      this.tempStretch = 'ultra-condensed'
    } else {
      this.tempStretch = 'normal'
    }
    return this.properties.Font!.FontName!
  } else {
    this.isItalic = false
    this.tempWeight = '400'
    this.tempStretch = 'normal'
    return this.properties.Font!.FontName!
  }
}
setInitial (e: Event) {
  this.tempListBoxComboBoxEvent = e
}
}
