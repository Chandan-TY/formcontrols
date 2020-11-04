import { Vue, Component, Prop, Emit, Watch, PropSync } from 'vue-property-decorator'
import { controlProperties } from '@/FormDesigner/controls-properties'
import {
  PositionXYData,
  ScrollBarData
} from '@/FormDesigner/controls-properties-types'
import { PropType } from 'vue'

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

  @Emit('selectedItem')
  selectedItem (event: Event) {
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
  /* updateCaption (event : KeyboardEvent) {
    const targetElement = event.target as HTMLSpanElement
    const captionValue = targetElement.innerText
    this.updateDataModel({ propertyName: 'Caption', value: captionValue })
  } */

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
    ref.checked = checked;
    ((ref.parentNode as HTMLLabelElement).childNodes[1] as HTMLSpanElement).style.backgroundColor = bgColor
    ref.disabled = disabled
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
      if (propData.properties.ControlSource !== '') {
        this.updateDataModel({ propertyName: 'Value', value: propData.extraDatas!.ControlSourceValue })
      }
    } else if (propData.properties.ControlSource !== '') {
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
  * @description watches text and value properties are same when component is mounted/changed
  * @function textAndValueUpdateProp
  * @param oldVal previous properties data
  * @param newVal  new/changed properties data
  */
 @Watch('properties.Value', { deep: true })
  textAndValueUpdateProp (newVal:controlData, oldVal:controlData) {
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
   if (this.tripleState % 3 === 0) {
     this.tripleState++
     if (this.properties.TripleState) {
       this.setStyle(targetRef, true, false, 'rgba(220, 220, 220, 1)')
     }
   } else {
     this.tripleState++
     const el = (event.target as HTMLInputElement).checked
     this.updateDataModel({ propertyName: 'Value', value: el })
     this.setStyle(targetRef, el, false, 'white')
   }
 }
 /**
   * @description getRepeat returns string value from
   * controlProperties.extraDataRepeatProp or controlProperties.pictureTilingProp
   * @function getRepeat
   */
 protected get getRepeatData (): string {
   if (this.properties.Picture === '') {
     return controlProperties.extraDataRepeatProp(this.data)
   } else {
     return controlProperties.pictureTilingProp(this.data)
   }
 }
 /**
   * @description computedCaption returns object value from
   * with acceleratorCaption, afterbeginCaption, beforeendCaption values
   * @function computedCaption
   * @returns object value
   */
 protected get computedCaption () {
   let afterbeginCaption:string = ''
   let acceleratorCaption:string = ''
   let beforeendCaption:string = ''

   let caption = this.properties.Caption
   let accelerator = this.properties.Accelerator!.charAt(0)
   let isPresent:boolean = false
   if (caption && accelerator) {
     for (var i = 0; i < caption.length; i++) {
       if (caption[i] === accelerator) {
         isPresent = true
         break
       }
     }
     if (isPresent && accelerator !== '') {
       const postion:number = caption.indexOf(accelerator)
       acceleratorCaption = accelerator
       afterbeginCaption = caption.substring(0, postion)
       beforeendCaption = caption.substring(postion + 1, caption.length)
     } else {
       afterbeginCaption = caption
     }
   } else {
     afterbeginCaption = caption!
   }
   return {
     afterbeginCaption: afterbeginCaption,
     acceleratorCaption: acceleratorCaption,
     beforeendCaption: beforeendCaption
   }
 }
}
