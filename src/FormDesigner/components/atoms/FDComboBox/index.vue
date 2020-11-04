<template>
  <div class="custom-select" :tabindex="tabindex" :style="customSelectObj"
   :title="properties.ControlTipText">
    <div class="combobox" :style="boxStyleObj">
      <div :class="properties.SelectionMargin?'selectionDiv':''">
        <span v-if="properties.SelectionMargin" :style="[selectionSpan,{backgroundColor:properties.BackColor}]" @click="setSelection"></span>
        <textarea
        ref="textareaRef"
        :style="cssStyleProperty"
        wrap="off"
        :tabindex="properties.TabIndex"
        :readonly="properties.Locked"
        @keydown.enter="enterFieldBehavior"
        @blur="handleBlur($event, textareaRef, hideSelectionDiv)"
        @click="handleClick(hideSelectionDiv)"
        @input="handleTextInput($event)"
        :maxlength="properties.MaxLength!==0?properties.MaxLength:''"
        class="text-box-design"
        :value="
          selectionData[0]
        "
        @dragstart="dragBehavior"
      />
      <div
        ref="hideSelectionDiv"
        @click="divHide($event, textareaRef)"
        :style="divcssStyleProperty"
        :title="properties.ControlTipText"
        class="text-box-design"
      >
        {{
          selectionData[0]
        }}
      </div>
    <label ref="autoSizeTextarea"></label>
    </div>
      <div class="selected" @click="enabledCheck" :style="selectedStyleObj"></div>
      <div class="items" :class="{ selectHide: !open }" v-if="open">
        <div class="listStyle" :title="properties.ControlTipText">
    <table
      :style="tableStyleObj"
    >
      <thead
        v-if="properties.ColumnHeads === true"
        style="border-bottom:1px solid;white-space: nowrap;"
      >
        <tr>
          <td :style="tdStyleObj"
            v-if="properties.ListStyle === 1"
            style="width:15px;border-right: 1px solid;"
          ></td>
          <template v-for="(a,columnIndex) in extraDatas.ColumnHeadsValues">
              <!-- v-if="(columnIndex<properties.ColumnCount)" -->
            <td
              v-if="(columnIndex<properties.ColumnCount)"
              :key="columnIndex"
              :style="[tdStyleObj,{borderRight: (columnIndex<properties.ColumnCount-1)?'1px solid':'',width:(columnIndex==0 && properties.ColumnWidths!=='')?properties.ColumnWidths+'px':'auto',overflow:'hidden'}]"
            >{{a}}</td>
          </template>
        </tr>
      </thead>
      <thead v-else></thead>
      <tbody ref="style" class="table-body">
        <tr
          :tabindex="index"
          class="tr"
          v-for="(item,index) of extraDatas.RowSourceData"
          :key="index"
          @mouseenter="handleDrag"
          @keydown="handleExtendArrowKeySelect"
          @blur="clearMatchEntry"
          @click="handleMultiSelect"
        >
          <td :style="tdStyleObj"
            style="width:10px"
            v-if="(properties.ListStyle === 1 && properties.ColumnCount>0)"
          >
            <input
              name="radio"
              type="radio"
              style="margin:0"
            />
          </td>
          <td
            class="column-item"
            v-for="(i,index) in item"
            :key="index"
            :style="[tdStyleObj,{width:(index==0 && properties.ColumnWidths!=='')?properties.ColumnWidths+'px':'100%',overflow:'hidden'}]"
          >
            <template v-if="(index<properties.ColumnCount)">{{i}}</template>
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
import { Component, Vue, Prop, Mixins, Watch, Ref } from 'vue-property-decorator'
import FdControlVue from '@/api/abstract/FormDesigner/FdControlVue'
import { Mutation, Action, Getter } from 'vuex-class'

@Component({
  name: 'FDComboBox'
})
export default class FDComboBox extends Mixins(FdControlVue) {
  $el!: HTMLDivElement
  @Ref('textareaRef') textareaRef: HTMLTextAreaElement
  @Ref('autoSizeTextarea') readonly autoSizeTextarea! : HTMLLabelElement
  @Ref('hideSelectionDiv') readonly hideSelectionDiv! : HTMLDivElement

   private options = ['hello'];
   private tabindex = 0;
  open: boolean = false;
  isVisible: boolean = false
  selected = this.options.length > 0 ? '' : null;
  // MatchEntryFirstLetter
  matchFirstLetter: any;
  matchIndex: number = 0;
   multiselect = [];
  // textColumn
  selectionData: Array<string> = [];

  // MatchFirstCharacter
  matchEntry: any = [];
  // matchIndex = -1;
  tempInputValue: string = ''

  handleTextInput (e: any) {
    this.tempInputValue = e.target!.value
  }

  setSelection () {
    console.log('Im selecting all the text');
    (this as any).$refs['textareaRef'].focus();
    (this as any).$refs['textareaRef'].select()
  }
  enterFieldBehavior (e: any) {
    if (this.properties.EnterFieldBehavior === 0) {
      e.preventDefault();
      (this as any).$refs['textareaRef'].focus();
      (this as any).$refs['textareaRef'].select()
    } else {

    }
  }
  // MatchEntryComplete
  clearMatchEntry (e: any) {
    // this.extraDatas.MatchData = ''
    this.updateDataModelExtraData({ propertyName: 'MatchData', value: '' })
  }

  checkMaxLength () {
    if (this.properties.MaxLength === 0) {} else {
      return this.properties.MaxLength
    }
  }

  /**
  * @description  show selection when TextBox loses focus
  * when HideSelection is false selection is show if user selects any text
  * @function handleBlur
  * @event blur
  *
  */
  handleBlur (event: TextEvent, textareaRef: HTMLTextAreaElement, hideSelectionDiv: HTMLDivElement) {
    if (!this.properties.HideSelection && textareaRef) {
      const eventTarget = event.target as HTMLTextAreaElement
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
      const arrayCheck = this.extraDatas.RowSourceData!.findIndex(element => element[0] === this.tempInputValue)
      if (arrayCheck === -1) {
        (this as any).$refs['textareaRef'].focus()
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
  handleClick (hideSelectionDiv:HTMLDivElement) {
    if (!this.properties.HideSelection) {
      hideSelectionDiv.style.display = 'none'
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
    (event.target as HTMLDivElement).style.display = 'none'
    textareaRef.style.display = 'block'
    if ((event.target as HTMLDivElement).tagName === 'SPAN' && (event.target as HTMLDivElement).parentNode!.nodeName === 'DIV') {
      ((event.target as HTMLDivElement).parentNode as HTMLElement).style.display = 'none'
    }
    textareaRef.focus()
    textareaRef.selectionStart = textareaRef.selectionEnd
  }
  /**
  * @description dragBehavior - if true when dragging
  *  if false the cursor remains in same place
  * @function dragBehavior
  * @param event its of type KeyboardEvent
  * @event dragStart
  */
  dragBehavior (e:Event) {
    if (this.properties.DragBehavior) {
      return true
    }
    e.preventDefault()
  }
  // protected get listStyleObj () :Partial<CSSStyleDeclaration> {
  //   const controlProp = this.properties
  //   return {
  //     backgroundColor: controlProp.BackColor,
  //     borderColor: controlProp.BorderColor,
  //     border: this.properties.BorderStyle ? `1px solid ${this.properties.BorderColor}` : 'none',
  //     cursor: (controlProp.MousePointer !== 0 || controlProp.MouseIcon !== '') ? this.getMouseCursorData : 'default',
  //     boxShadow: controlProp.SpecialEffect ? this.getSpecialEffectData : 'none',
  //     height: `${controlProp.Height}px`,
  //     width: `${controlProp.Width}px`,
  //     display: controlProp.Visible ? 'inline-block' : 'none'

  //   }
  // }

  /**
   * @override
   */
  @Watch('properties.AutoSize', { deep: true })
  updateAutoSize (newVal:boolean, oldVal:boolean) {
    if (this.properties.AutoSize === true) {
      debugger
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
        this.updateDataModel({ propertyName: 'Width', value: tempLabel.offsetWidth + 5 })
        this.updateDataModel({ propertyName: 'Height', value: tempLabel.offsetHeight + 5 })
        tempLabel.innerText = ''
        tempLabel.style.display = 'none'
        this.selectionData[0] = this.tempInputValue
      })
    }
  }

  protected get tableStyleObj () :Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    const font: font = controlProp.Font ? controlProp.Font : {
      FontName: 'Arial',
      FontSize: 10
    }
    return {
      borderCollapse: 'collapse',
      tableLayout: 'fixed',
      backgroundColor: controlProp.BackColor,
      color: controlProp.ForeColor,
      fontFamily: font.FontStyle ? font.FontStyle : font.FontName,
      fontSize: `${font.FontSize}px`,
      fontStyle: font.FontItalic ? 'italic' : '',
      textDecoration: (font.FontStrikethrough === true && font.FontUnderline === true) ? 'underline line-through' : font.FontUnderline ? 'underline' : font.FontStrikethrough ? 'line-through' : '',
      fontWeight: font.FontBold ? 'bold' : '',
      width: (controlProp.ColumnWidths === '') ? `${controlProp.Width}` : (`${controlProp.Width}` + parseInt(controlProp.ColumnWidths!)) + 'px'
    }
  }

  protected get cssStyleProperty () :Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      height: `${controlProp.Height}px`,
      width: `${controlProp.Width}px`
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
    return { ...styleObject, display: 'none', paddingTop: '2px', paddingLeft: '2px' }
  }

  protected get customSelectObj () :Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      display: controlProp.Visible ? 'inline-block' : 'none'
    }
  }
  protected get tdStyleObj () :Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      textAlign: controlProp.TextAlign === 0 ? 'left' : controlProp.TextAlign === 2 ? 'right' : 'center'
    }
  }

  @Watch('properties.BoundColumn', { deep: true })
  boundColumnValue (newVal:number, oldVal:number) {
    if (this.properties.BoundColumn! > 0 && this.properties.BoundColumn! < this.extraDatas.RowSourceData!.length) {
      let tempData = [...this.extraDatas.RowSourceData!]
      tempData![0][0] = tempData![0][newVal - 1]
      let tempValue = tempData![0][newVal - 1]
      this.updateDataModelExtraData({ propertyName: 'RowSourceData', value: tempData })
      this.updateDataModel({ propertyName: 'Value', value: tempValue })
      console.log('New Val', this.extraDatas.RowSourceData)
      console.log('tempValue', this.properties.Value)
    }
  }
  @Watch('properties.Value', { deep: true })
  ValueData (newVal:string, oldVal:string) {
    if (this.properties.BoundColumn! > 0 && this.properties.BoundColumn! < this.extraDatas.RowSourceData!.length) {
      let tempData = [...this.extraDatas.RowSourceData!]
      if (tempData![0][this.properties.BoundColumn! - 1] === newVal) {
        this.updateDataModel({ propertyName: 'Value', value: newVal })
        console.log('tempValue', this.properties.Value)
      } else {
        this.updateDataModel({ propertyName: 'Value', value: '' })
        console.log('tempValueSpace', this.properties.Value)
      }
    }
  }

  @Watch('properties.TextColumn', { deep: true })
  textColumnChange (newVal:number, oldVal:number) {
    if (newVal > 0 && newVal < this.extraDatas.RowSourceData!.length) {
      let tempData = [...this.extraDatas.RowSourceData!]
      let tempValue = tempData![0][newVal - 1]
      // this.updateDataModel({ propertyName: 'Value', value: tempValue })
      this.updateDataModel({ propertyName: 'Text', value: tempValue })
      // console.log('NewVal', this.properties.Value)
      console.log('NewText', this.properties.Text)
    } else {
      // this.updateDataModel({ propertyName: 'Value', value: '' })
      this.updateDataModel({ propertyName: 'Text', value: '' })
    }
  }
  @Watch('properties.SelectionMargin', { deep: true })
  checkSelectionMargin (newVal:boolean, oldVal:boolean) {
    this.selectionData[0] = this.tempInputValue
  }
  // @Watch('properties.Text', { deep: true })
  // textChange (newVal:Text, oldVal:Text) {
  //   this.updateDataModel({ propertyName: 'Value', value: newVal })
  //   console.log('NewVal', this.properties.Value)
  // }
  // @Watch('properties.Value', { deep: true })
  // valueChange (newVal:Text, oldVal:Text) {
  //   this.updateDataModel({ propertyName: 'Text', value: newVal })
  //   console.log('NewText', this.properties.Text)
  // }
  mounted () {
    this.updateDataModel({ propertyName: 'ControlSource', value: '' })
    if (this.extraDatas.RowSourceData!.length === 0) {
      this.updateDataModel({ propertyName: 'TopIndex', value: -1 })
    } else {
      this.updateDataModel({ propertyName: 'TopIndex', value: 0 })
    }
    console.log('TopIndexValue', this.properties.TopIndex)
  }

  handleMultiSelect (e: any) {
    e.target.focus()
    console.log('e.target', e.currentTarget.innerText[0])
    let data = e.currentTarget.innerText
    let splitData = data.replace(/\t/g, ' ').split(' ')
    this.selectionData = splitData
    this.clearOptionBGColorAndChecked(e)
    this.setOptionBGColorAndChecked(e)
    if (this.properties.ControlSource !== '') {
      console.log('selection DATA', this.selectionData[0])
      this.updateDataModel({ propertyName: 'Text', value: this.selectionData[0] })
      this.updateDataModel({ propertyName: 'Value', value: this.selectionData[0] })
      this.updateDataModelExtraData({ propertyName: 'ControlSourceValue', value: this.selectionData[0] })
    }
    // this.open = false
    // if (this.properties.Enabled && this.properties.Locked === false) {
    //   if (this.properties.MultiSelect === 0) {
    //     if (this.properties.ControlSource !== '') {
    //       console.log('selection DATA', this.selectionData[0])
    //       this.updateDataModel({ propertyName: 'Text', value: this.selectionData[0] })
    //       this.updateDataModel({ propertyName: 'Value', value: this.selectionData[0] })
    //       this.updateDataModelExtraData({ propertyName: 'ControlSourceValue', value: this.selectionData[0] })
    //     }
    //     this.clearOptionBGColorAndChecked(e)
    //     this.setOptionBGColorAndChecked(e)
    //     let isListStyle = 0
    //     if (this.properties.TextColumn === -1 || this.properties.TextColumn === 1) {
    //     // 0th index is empty string
    //       if (this.properties.ListStyle === 0) {
    //         isListStyle = -1
    //       }
    //       // this.properties.Text = splitData[1 - isListStyle]
    //       this.updateDataModel({ propertyName: 'Text', value: splitData[1 - isListStyle] })
    //       this.updateDataModel({ propertyName: 'Value', value: splitData[1 - isListStyle] })
    //     // this.properties.Value = splitData[1 - isListStyle]
    //     } else if (this.properties.TextColumn === 0) {
    //     // this.properties.Text = splitData[2 - isListStyle]
    //       this.updateDataModel({ propertyName: 'Text', value: splitData[2 - isListStyle] })
    //       this.updateDataModel({ propertyName: 'Value', value: splitData[1 - isListStyle] })
    //     // this.properties.Value = splitData[1 - isListStyle]
    //     } else {
    //     // this.properties.Text = splitData[this.properties.TextColumn!]
    //     // this.properties.Value = splitData[1 - isListStyle]
    //       this.updateDataModel({ propertyName: 'Text', value: splitData[this.properties.TextColumn!] })
    //       this.updateDataModel({ propertyName: 'Value', value: splitData[1 - isListStyle] })
    //     }

    //   // this.properties.value = e.currentTarget.innerText;
    //   } else if (this.properties.MultiSelect === 1) {
    //     if (e.target.tagName === 'INPUT') {
    //       this.setOptionBGColorAndChecked(e)
    //     // this.multiSelectOptions(e);
    //     } else {
    //       this.setOptionBGColorAndChecked(e)
    //     // this.multiSelectOptions(e);
    //     }
    //   } else if (this.properties.MultiSelect === 2) {
    //     if (e.ctrlKey === true) {
    //       if (e.target.tagName === 'INPUT') {
    //         this.setOptionBGColorAndChecked(e)
    //       // this.multiSelectOptions(e);
    //       } else {
    //         this.setOptionBGColorAndChecked(e)
    //       // this.multiSelectOptions(e);
    //       }
    //     } else if (e.shiftKey === true && this.properties.Value !== '') {
    //       let startPoint = 0
    //       let endPoint = 0
    //       for (let i = 0; i < e.path.length; i++) {
    //         const ele = e.path[i]
    //         if (ele.className === 'table-body') {
    //         // extend points start and end
    //           for (let j = 0; j < ele.childNodes.length; j++) {
    //             const cd = ele.childNodes[j]
    //             if (cd.innerText === this.properties.Value) {
    //               startPoint = j + 1
    //             }
    //             if (cd.innerText === e.currentTarget.innerText) {
    //               endPoint = j
    //             }
    //           }
    //           // upward selection start and end swap
    //           if (startPoint > endPoint) {
    //             let temp = startPoint
    //             startPoint = endPoint
    //             endPoint = temp
    //           }
    //           // setting selection
    //           for (let k = startPoint; k <= endPoint; k++) {
    //             const node = ele.childNodes[k]
    //             node.style.backgroundColor = 'rgb(59, 122, 231)'
    //             if (
    //               this.properties.ListStyle === 1 &&
    //             !node.childNodes[0].childNodes[0].checked
    //             ) {
    //               node.childNodes[0].childNodes[0].checked = !node.childNodes[0]
    //                 .childNodes[0].checked
    //             }
    //           }
    //           break
    //         }
    //       }
    //     } else {
    //       this.clearOptionBGColorAndChecked(e)
    //       this.setOptionBGColorAndChecked(e)
    //       // this.properties.Value = e.currentTarget.innerText
    //       this.updateDataModel({ propertyName: 'Value', value: e.currentTarget.innerText })
    //     }
    //   }
    // }
  }

  // 2 - fmMultiSelectExtend
  handleExtendArrowKeySelect (e: any) {
    debugger
    if (
      this.properties.MatchEntry! === 0 &&
      e.keyCode >= 48 && e.keyCode <= 90
    ) {
      this.matchEntry = []
      const prevMatchData =
      this.extraDatas.MatchData === '' ? e.key : this.extraDatas.MatchData
      // this.extraDatas.MatchData = prevMatchData !== e.key ? e.key : prevMatchData
      this.updateDataModelExtraData({ propertyName: 'MatchData', value: prevMatchData !== e.key ? e.key : prevMatchData })

      console.log(this.matchEntry)
      for (let index = 0; index < e.path.length; index++) {
        const element = e.path[index]
        if (element.className === 'table-body') {
          for (let index = 0; index < element.childNodes.length; index++) {
            const ei = element.childNodes[index]
            let splitData = ei.innerText.replace(/\t/g, ' ').split(' ')
            let si = 0
            if (this.properties.ListStyle === 0) {
              si = -1
            }
            if (splitData[si + 1][0].includes(this.extraDatas.MatchData)) {
              this.matchEntry.push(index)
            }
          }

          if (
            this.extraDatas.MatchData![0] !== undefined &&
            this.extraDatas.MatchData![0] === e.key &&
            this.extraDatas.MatchData!.length > 0
          ) {
            this.matchIndex++
            if (
              this.matchIndex === this.matchEntry.length &&
              prevMatchData === this.extraDatas.MatchData
            ) {
              this.matchIndex = 0
              this.clearOptionBGColorAndChecked(e)
              this.setBGandCheckedForMatch(
                element.childNodes[this.matchEntry[this.matchIndex]]
              )
              break
            } else if (prevMatchData !== this.extraDatas.MatchData) {
              this.matchIndex = 0
              this.clearOptionBGColorAndChecked(e)
              this.setBGandCheckedForMatch(
                element.childNodes[this.matchEntry[this.matchIndex]]
              )
              break
            } else {
              if (this.matchEntry.length === 0) {
                this.matchEntry.push(0)
                this.matchIndex = 0
              }
              this.clearOptionBGColorAndChecked(e)
              this.setBGandCheckedForMatch(
                element.childNodes[this.matchEntry[this.matchIndex]]
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
      // this.extraDatas.MatchData += e.key
      this.updateDataModelExtraData({ propertyName: 'MatchData', value: temp })
      console.log(this.extraDatas.MatchData)

      for (let point = 0; point < e.path.length; point++) {
        const tbody = e.path[point]
        if (tbody.className === 'table-body') {
          this.matchEntry = []
          for (let p = 0; p < tbody.childNodes.length; p++) {
            const ei = tbody.childNodes[p]
            let matchEntryComplete = ei.innerText
              .replace(/\t/g, ' ')
              .split(' ')
            let sii = 0
            if (this.properties.ListStyle === 0) {
              sii = -1
            }
            if (
              matchEntryComplete[sii + 1][0].includes(this.extraDatas.MatchData) &&
              this.extraDatas.MatchData!.length < 2
            ) {
              this.matchEntry.push(p)
            } else if (
              matchEntryComplete[sii + 1].includes(this.extraDatas.MatchData) &&
              this.extraDatas.MatchData!.length > 1
            ) {
              this.matchEntry.push(p)
            }
          }
          console.log(this.matchEntry)

          if (this.extraDatas.MatchData!.length <= 1) {
            let singleMatch = tbody.childNodes[this.matchEntry[0]]
            this.clearOptionBGColorAndChecked(e)
            this.setBGandCheckedForMatch(singleMatch)
            break
          } else if (
            this.extraDatas.MatchData!.length > 1 &&
            this.matchEntry.length !== 0
          ) {
            let completeAutoMatch = tbody.childNodes[this.matchEntry[0]]
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
      e.target.nextSibling !== null
    ) {
      if (e.target.style.backgroundColor !== 'rgb(59, 122, 231)') {
        this.setOptionBGColorAndChecked(e)
      } else if (
        e.target.style.backgroundColor === 'rgb(59, 122, 231)' &&
        e.target.nextSibling.style.backgroundColor !== ''
      ) {
        this.setOptionBGColorAndChecked(e)
      } else if (e.target.nextSibling.nextSibling !== null) {
        this.setBGColorForNextSibling(e)
      } else if (
        e.target.nextSibling.nextSibling === null &&
        e.target.nextSibling.style.backgroundColor !== 'rgb(59, 122, 231)'
      ) {
        this.setBGColorForNextSibling(e)
      }

      e.target.nextSibling.focus()
    } else if (
      e.key === 'ArrowUp' &&
      e.shiftKey === true &&
      e.target.previousSibling !== null
    ) {
      if (
        e.target.style.backgroundColor === 'rgb(59, 122, 231)' &&
        e.target.previousSibling.style.backgroundColor !== ''
      ) {
        this.setOptionBGColorAndChecked(e)
      } else if (e.target.previousSibling.previousSibling !== null) {
        this.setBGColorForPreviousSibling(e)
      } else if (
        e.target.previousSibling.previousSibling === null &&
        e.target.previousSibling.style.backgroundColor !== 'rgb(59, 122, 231)'
      ) {
        this.setBGColorForPreviousSibling(e)
      }
      e.target.previousSibling.focus()
    }
  }

  handleDrag (e: any) {
    if (this.properties.MultiSelect === 2) {
      if (e.which === 1) {
        this.setOptionBGColorAndChecked(e)
      }
      window.getSelection()!.removeAllRanges()
    }
  }

  // set BGColor for Nextsibilings
  setBGColorForNextSibling (e: any) {
    e.target.nextSibling.style.backgroundColor =
      e.target.nextSibling.style.backgroundColor === 'rgb(59, 122, 231)'
        ? ''
        : 'rgb(59, 122, 231)'
    if (
      this.properties.ListStyle === 1 &&
      this.properties.MultiSelect === 2
    ) {
      e.target.nextSibling.children[0].childNodes[0].checked = !e.target
        .nextSibling.children[0].childNodes[0].checked
    }
  }
  // set BGColor for PreviousSiblings
  setBGColorForPreviousSibling (e: any) {
    e.target.previousSibling.style.backgroundColor =
      e.target.previousSibling.style.backgroundColor === 'rgb(59, 122, 231)'
        ? ''
        : 'rgb(59, 122, 231)'
    if (
      this.properties.ListStyle === 1 &&
      this.properties.MultiSelect === 2
    ) {
      e.target.previousSibling.children[0].childNodes[0].checked = !e.target
        .previousSibling.children[0].childNodes[0].checked
    }
  }

  // clear selected option for SingleSelection
  clearOptionBGColorAndChecked (e: any) {
    for (let index = 0; index < e.path.length; index++) {
      const element = e.path[index]
      if (element.className === 'table-body') {
        for (
          let childIndex = 0;
          childIndex < element.childNodes.length;
          childIndex++
        ) {
          const childNode = element.childNodes[childIndex]
          childNode.style.backgroundColor = ''
          if (this.properties.ListStyle === 1) {
            childNode.childNodes[0].childNodes[0].checked = false
          }
        }
        break
      }
    }
  }

  // handle setting backgroundColor and option checked/not
  setOptionBGColorAndChecked (e: any) {
    e.currentTarget.style.backgroundColor =
      e.currentTarget.style.backgroundColor === 'rgb(59, 122, 231)'
        ? ''
        : 'rgb(59, 122, 231)'
    if (
      this.properties.ListStyle === 1 &&
      this.properties.MultiSelect === 0
    ) {
      e.currentTarget.children[0].childNodes[0].checked = !e.currentTarget
        .children[0].childNodes[0].checked
    } else if (
      this.properties.ListStyle === 1 &&
      this.properties.MultiSelect === 1 &&
      e.target.tagName === 'INPUT'
    ) {
      // e.target.checked = e.target.checked
    } else {
      e.currentTarget.children[0].childNodes[0].checked = !e.currentTarget
        .children[0].childNodes[0].checked
    }
  }

  // set BGColor and Checked matchEntry
  setBGandCheckedForMatch (singleMatch: any) {
    console.log('SingleMatch', singleMatch)
    if (singleMatch !== undefined) {
      singleMatch.style.backgroundColor = 'rgb(59, 122, 231)'
      if ((this.properties.ListStyle === 1)) {
        singleMatch.childNodes[0].childNodes[0].checked = !singleMatch
          .childNodes[0].childNodes[0].checked
      }
    }
  }

  // protected get customSelectObj () :Partial<CSSStyleDeclaration> {
  //   const controlProp = this.properties
  //   return { lineHeight: (controlProp.ColumnCount !== 1) ? '50px' : '15px' }
  // }
  // ListRows
  get computedOptions () {
    return this.properties.ListRows! < 1
      ? this.options
      : this.options.slice(0, this.properties.ListRows!)
  }
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
  handleInput (e: any) {
    let match: string|any[]
    let optionsItems = this.options
    if (e.target.value === '' || e.inputType === 'deleteContentBackward') {
      this.selected = e.target.value
      return this.selected
    } else if (this.properties.MatchEntry === 1) {
      match = optionsItems.filter((item) => {
        if (e.target.value.length > 1) {
          return item.toLowerCase().includes(e.target.value.toLowerCase())
        }
        return item[0].toLowerCase().includes(e.target.value.toLowerCase())
      })
    } else if (this.properties.MatchEntry === 1) {
      match = optionsItems.filter((item) => {
        return item[0].toLowerCase().includes(e.target.value[0].toLowerCase())
      })
      this.matchFirstLetter = match.length > 1 ? match : []
      this.selected = match[0]
      if (
        e.target.value[1] !== undefined &&
        e.target.value[0] === e.data &&
        this.matchFirstLetter.length > 0
      ) {
        this.matchIndex++
        if (this.matchIndex === this.matchFirstLetter.length) {
          this.matchIndex = 0
          e.target.value = this.matchFirstLetter[this.matchIndex]
          this.selected = e.target.value
        } else {
          e.target.value = this.matchFirstLetter[this.matchIndex]
          this.selected = e.target.value
        }
      }
      e.target.value =
        this.selected === undefined ? e.target.value : this.selected
    }

    if (
      match![0] !== undefined &&
      this.properties.MatchEntry === 1
    ) {
      this.selected = match![0]
      let start = e.target.value.length
      e.target.value = this.selected
      e.target.setSelectionRange(start, this.selected!.length, 'forward')
    } else if (
      match![0] !== undefined &&
      this.properties.MatchEntry === 1
    ) {
      //  e.target.setSelectionRange(0,this.selected.length,"forward")
    } else {
      this.selected = e.target.value
      return this.selected
    }
  }

  // mounted () {
  //   this.$emit('input', this.selected)
  // }

  // handleOptionInput (e: any, option: any) {
  //   e.target.checked = true
  // }

  // handleMouseClick (e: any, option: any) {
  //   debugger
  //   e.target.checked = true
  //   this.selected = option
  //   this.open = false
  //   this.$emit('input', option)
  // }

  // handleMouseLeave (e: any) {
  //   e.target.checked = false
  // }
  changeDropButtonStyle () {
    if (this.properties.DropButtonStyle === 1) {
      return `url('https://img.icons8.com/android/24/000000/sort-down.png')`
    } else if (
      this.properties.DropButtonStyle === 2
    ) {
      return `url('https://img.icons8.com/ios-glyphs/30/000000/ellipsis.png')`
    } else if (this.properties.DropButtonStyle === 3) {
      return `url('https://img.icons8.com/android/24/000000/minus.png')`
    }
  }
  protected get inputStyleObj () :Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    const font: font = controlProp.Font ? controlProp.Font : {
      FontName: 'Arial',
      FontSize: 10
    }
    return {
      outline: 'none',
      backgroundColor: controlProp.BackColor,
      border: 'none',
      fontFamily: font.FontStyle ? font.FontStyle : font.FontName,
      fontSize: `${font.FontSize}px`,
      fontStyle: font.FontItalic ? 'italic' : '',
      textDecoration: (font.FontStrikethrough === true && font.FontUnderline === true) ? 'underline line-through' : font.FontUnderline ? 'underline' : font.FontStrikethrough ? 'line-through' : '',
      cursor: (controlProp.MousePointer !== 0 || controlProp.MouseIcon !== '') ? this.getMouseCursorData : 'default',
      fontWeight: font.FontBold ? 'bold' : '',
      color: controlProp.ForeColor,
      width: `${controlProp.Width!}px`,
      background: controlProp.BackStyle ? controlProp.BackColor : 'transparent',
      height: `${controlProp.Height}px`

    }
  }
  protected get boxStyleObj () :Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      border: controlProp.BorderStyle === 0 ? 'none' : '1px solid ' + controlProp.BorderColor,
      width: `${controlProp.Width! + 25}px`,
      cursor: (controlProp.MousePointer !== 0 || controlProp.MouseIcon !== '') ? this.getMouseCursorData : 'default',
      boxShadow: controlProp.SpecialEffect ? this.getSpecialEffectData : '-1px -1px lightgray'

    }
  }
  protected get selectedStyleObj () :Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    const font: font = controlProp.Font ? controlProp.Font : {
      FontName: 'Arial',
      FontSize: 10
    }
    return {
      display: controlProp.ShowDropButtonWhen === 2 ? 'block' : this.expandWidth(),
      backgroundImage: controlProp.DropButtonStyle === 0 ? 'none' : this.changeDropButtonStyle(),
      backgroundPosition: controlProp.DropButtonStyle === 1 ? 'center' : 'bottom',
      // height: `${controlProp.Height}px`,
      cursor: (controlProp.MousePointer !== 0 || controlProp.MouseIcon !== '') ? this.getMouseCursorData : 'default'

    }
  }
  enabledCheck () {
    if (this.properties.Enabled) {
      if (!this.properties.Locked) {
        this.open = !this.open
      }
    } else {
      this.open = false
    }
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
  /* line-height: 10px; specify the drop down height */
}
.selectionSpan{
  width: 5px;
}
.selectionDiv{
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
.listStyle{
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
  outline: none
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
  border:1px solid gray;
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
}
.text-box-design:focus {
  outline: none;
}
.text-box-design::selection {
  background: lightblue;
}
</style>
