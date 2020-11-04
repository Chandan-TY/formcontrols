<template>
    <div class="listStyle" :style="listStyleObj" :title="properties.ControlTipText" ref="listBoxRef">
    <table
      :style="tableStyleObj"
      @click="tableClick"
    >
      <thead
        v-if="properties.ColumnHeads === true"
        style="border-bottom:1px solid;white-space: nowrap;"
      >
        <tr>
          <td :style="tdStyleObj"
            v-if="properties.ListStyle === 1"
            style="width:15px;border-right: 1px solid"
          ></td>
          <template v-for="(a,columnIndex) in extraDatas.ColumnHeadsValues">
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
            style="width:20px"
            v-if="properties.ListStyle === 1 && properties.ColumnCount>0"
          >
            <input
              :name="properties.MultiSelect === 2? 'checkbox' : 'radio'"
              :type="
                properties.MultiSelect === 1 ||
                properties.MultiSelect === 2 ? 'checkbox' : 'radio'"
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
</template>

<script lang="ts">
import { Component, Prop, Model, Emit, Mixins, Watch, Ref } from 'vue-property-decorator'
import FdControlVue from '@/api/abstract/FormDesigner/FdControlVue'

@Component({
  name: 'FDListBox'
})
export default class FDListBox extends Mixins(FdControlVue) {
  @Ref('listBoxRef') listBoxRef: HTMLDivElement

  multiselect = [];
  // textColumn
  selectionData :Array<string> = [];

  // MatchFirstCharacter
  matchEntry: Array<number> = [];
  matchIndex = -1;
  tempEvent: any = {};

  // MatchEntryComplete
  clearMatchEntry () {
    debugger
    this.updateDataModelExtraData({ propertyName: 'MatchData', value: '' })
  }
  tableClick (e: any) {
    console.log('table event', e)
    this.tempEvent = e
  }

  protected get listStyleObj () :Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      backgroundColor: controlProp.BackColor,
      borderColor: controlProp.BorderColor,
      border: this.properties.BorderStyle ? `1px solid ${this.properties.BorderColor}` : 'none',
      cursor: (controlProp.MousePointer !== 0 || controlProp.MouseIcon !== '') ? this.getMouseCursorData : 'default',
      boxShadow: controlProp.SpecialEffect ? this.getSpecialEffectData : 'none',
      height: `${controlProp.Height}px`,
      width: `${controlProp.Width}px`,
      display: controlProp.Visible ? 'inline-block' : 'none'

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
      color: controlProp.ForeColor,
      fontFamily: font.FontStyle ? font.FontStyle : font.FontName,
      fontSize: `${font.FontSize}px`,
      fontStyle: font.FontItalic ? 'italic' : '',
      textDecoration: (font.FontStrikethrough === true && font.FontUnderline === true) ? 'underline line-through' : font.FontUnderline ? 'underline' : font.FontStrikethrough ? 'line-through' : '',
      fontWeight: font.FontBold ? 'bold' : '',
      width: (controlProp.ColumnWidths === '') ? `${controlProp.Width}` : (`${controlProp.Width}` + parseInt(controlProp.ColumnWidths!)) + 'px'
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

  @Watch('properties.MultiSelect', { deep: true })
  multiSelectCheck (newVal:number, oldVal:number) {
    this.clearOptionBGColorAndChecked(this.tempEvent)
  }

  @Watch('properties.ListStyle', { deep: true })
  listCheck (newVal:number, oldVal:number) {
    this.clearOptionBGColorAndChecked(this.tempEvent)
  }

  @Watch('properties.TopIndex', { deep: true })
  topIndexCheck (newVal:number, oldVal:number) {
    if (this.extraDatas.RowSourceData!.length === 0) {
      this.updateDataModel({ propertyName: 'TopIndex', value: -1 })
    } else {
      this.updateDataModel({ propertyName: 'TopIndex', value: 0 })
    }
    console.log('TopIndexValue after change', this.properties.TopIndex)
  }

  handleMultiSelect (e: MouseEvent) {
    const targetElement = (e.target as HTMLTableElement)
    const tempPath = e.composedPath()
    targetElement.focus()
    let data = targetElement.innerText
    let splitData = data.replace(/\t/g, ' ').split(' ')
    this.selectionData = splitData
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
          // this.properties.Text = splitData[1 - isListStyle]
          this.updateDataModel({ propertyName: 'Text', value: splitData[1 - isListStyle] })
          this.updateDataModel({ propertyName: 'Value', value: splitData[1 - isListStyle] })
        // this.properties.Value = splitData[1 - isListStyle]
        } else if (this.properties.TextColumn === 0) {
        // this.properties.Text = splitData[2 - isListStyle]
          this.updateDataModel({ propertyName: 'Text', value: splitData[2 - isListStyle] })
          this.updateDataModel({ propertyName: 'Value', value: splitData[1 - isListStyle] })
        // this.properties.Value = splitData[1 - isListStyle]
        } else {
        // this.properties.Text = splitData[this.properties.TextColumn!]
        // this.properties.Value = splitData[1 - isListStyle]
          this.updateDataModel({ propertyName: 'Text', value: splitData[this.properties.TextColumn!] })
          this.updateDataModel({ propertyName: 'Value', value: splitData[1 - isListStyle] })
        }

      // this.properties.value = e.currentTarget.innerText;
      } else if (this.properties.MultiSelect === 1) {
        if (targetElement.tagName === 'INPUT') {
          this.setOptionBGColorAndChecked(e)
        // this.multiSelectOptions(e);
        } else {
          this.setOptionBGColorAndChecked(e)
        // this.multiSelectOptions(e);
        }
      } else if (this.properties.MultiSelect === 2) {
        debugger
        if (e.ctrlKey === true) {
          if (targetElement.tagName === 'INPUT') {
            this.setOptionBGColorAndChecked(e)
          // this.multiSelectOptions(e);
          } else {
            this.setOptionBGColorAndChecked(e)
          // this.multiSelectOptions(e);
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
                  tempNode.checked = !tempNode.checked
                }
              }
              break
            }
          }
        } else {
          this.clearOptionBGColorAndChecked(e)
          this.setOptionBGColorAndChecked(e)
          // this.properties.Value = e.currentTarget.innerText
          this.updateDataModel({ propertyName: 'Value', value: targetElement.innerText })
        }
      }
    }
  }

  // 2 - fmMultiSelectExtend
  handleExtendArrowKeySelect (e: KeyboardEvent) {
    debugger
    const tempPath = e.composedPath()
    const eventTarget = e.target as HTMLTableElement
    const nextSiblingEvent = eventTarget.nextSibling as HTMLTableElement
    const prevSiblingEvent = eventTarget.previousSibling as HTMLTableElement

    if (
      this.properties.MatchEntry! === 0 &&
      e.keyCode >= 48 && e.keyCode <= 90
    ) {
      this.matchEntry = []
      const prevMatchData =
      this.extraDatas.MatchData === '' ? e.key : this.extraDatas.MatchData
      // this.extraDatas.MatchData = prevMatchData !== e.key ? e.key : prevMatchData
      this.updateDataModelExtraData({ propertyName: 'MatchData', value: prevMatchData !== e.key ? e.key : prevMatchData })

      console.log('Match Entry value', this.matchEntry)
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
      // this.extraDatas.MatchData += e.key
      this.updateDataModelExtraData({ propertyName: 'MatchData', value: temp })
      console.log(this.extraDatas.MatchData)

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
          console.log(this.matchEntry)

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
  }

  handleDrag (e: MouseEvent) {
    if (this.properties.MultiSelect === 2) {
      if (e.which === 1) {
        this.setOptionBGColorAndChecked(e)
      }
      window.getSelection()!.removeAllRanges()
    }
  }

  // set BGColor for Nextsibilings
  setBGColorForNextSibling (e: MouseEvent | KeyboardEvent) {
    const targetEvent = e.target as HTMLTableElement
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
  // set BGColor for PreviousSiblings
  setBGColorForPreviousSibling (e: KeyboardEvent) {
    const targetEvent = e.target as HTMLTableElement
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

  // clear selected option for SingleSelection
  clearOptionBGColorAndChecked (e: any) {
    debugger
    const tempPath = e.path
    console.log('this tempPath', tempPath)
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

  // handle setting backgroundColor and option checked/not
  setOptionBGColorAndChecked (e: KeyboardEvent | MouseEvent) {
    const currentTargetElement = e.currentTarget as HTMLTableElement
    const targetEvent = e.target as HTMLTableElement
    const childNodeChecked = currentTargetElement.children[0].childNodes[0] as HTMLInputElement
    currentTargetElement.style.backgroundColor =
      currentTargetElement.style.backgroundColor === 'rgb(59, 122, 231)'
        ? ''
        : 'rgb(59, 122, 231)'
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
      // e.target.checked = e.target.checked
    } else {
      childNodeChecked.checked = !childNodeChecked.checked
    }
  }

  // set BGColor and Checked matchEntry
  setBGandCheckedForMatch (singleMatch: HTMLTableElement) {
    console.log('SingleMatch', singleMatch)
    if (singleMatch !== undefined) {
      singleMatch.style.backgroundColor = 'rgb(59, 122, 231)'
      if ((this.properties.ListStyle === 1)) {
        const tempNode = singleMatch.childNodes[0].childNodes[0] as HTMLInputElement
        tempNode.checked = !tempNode.checked
      }
    }
  }
}

</script>

<style scoped>
.listStyle{
  width: 200px;
  height: 200px;
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
</style>
