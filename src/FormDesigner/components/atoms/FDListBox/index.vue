<template>
    <div class="listStyle" :style="listStyleObj" :title="properties.ControlTipText" @click="selectedItem" @mousedown="controlEditMode">
    <table
    class="table-style"
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
              :style="updateColHeads(columnIndex)"
            >{{a}}</td>
              <!-- :style="[tdStyleObj,{borderRight: (columnIndex<properties.ColumnCount-1)?'1px solid':'',width:(columnIndex==0 && properties.ColumnWidths!=='')?parseInt(properties.ColumnWidths)+'px':'auto',overflow:'hidden'}]" -->
          </template>
        </tr>
      </thead>
      <thead v-else></thead>
      <tbody ref="style" class="table-body" :style="tableBodyObj">
        <tr
          :tabindex="index"
          class="tr"
          v-for="(item,index) of extraDatas.RowSourceData"
          :key="index"
          @mouseenter="handleDrag"
          @keydown="handleExtendArrowKeySelect"
          @blur="clearMatchEntry"
          @click="isRunMode||isEditMode?handleMultiSelect($event):''"
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
            :style="updateColumnWidths(index)"
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
  // selectionData :Array<string> = [];
  // matchEntry: Array<number> = [];
  // matchIndex = -1;
  tempEvent: Event;

  clearMatchEntry () {
    this.updateDataModelExtraData({ propertyName: 'MatchData', value: '' })
  }

  tableClick (e: Event) {
    console.log('EVENT', e)
    this.tempEvent = e
  }

  get getDisableValue () {
    if (this.isRunMode || this.isEditMode) {
      return (
        this.properties.Enabled === false
      )
    } else {
      return true
    }
  }

  /**
  * @description style object is passed to :style attribute in div tag
  * dynamically changing the styles of the component based on properties
  * @function listStyleObj
  */
  protected get listStyleObj () :Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    let display = ''
    if (this.isRunMode) {
      display = controlProp.Visible ? 'inline-block' : 'none'
    } else {
      display = 'inline-block'
    }
    return {
      backgroundColor: controlProp.BackColor,
      borderColor: controlProp.BorderColor,
      border: this.properties.BorderStyle ? `1px solid ${this.properties.BorderColor}` : 'none',
      cursor: (controlProp.MousePointer !== 0 || controlProp.MouseIcon !== '') ? this.getMouseCursorData : 'default',
      boxShadow: controlProp.SpecialEffect ? this.getSpecialEffectData : 'none',
      height: `${controlProp.Height}px`,
      width: `${controlProp.Width}px`,
      display: display
    }
  }

  /**
  * @description style object is passed to :style attribute in table tag
  * dynamically changing the styles of the component based on properties
  * @function tableStyleObj
  */
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
      textDecoration:
        font.FontStrikethrough === true && font.FontUnderline === true
          ? 'underline line-through'
          : font.FontUnderline
            ? 'underline'
            : font.FontStrikethrough
              ? 'line-through'
              : '',
      fontWeight: font.FontBold ? 'bold' : '',
      width: (controlProp.ColumnWidths === '') ? `${controlProp.Width}px` : (`${controlProp.Width}px` + parseInt(controlProp.ColumnWidths!)) + 'px'
    }
  }

  protected get tableBodyObj () :Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      width: `${controlProp.Width}px !important`
    }
  }
  /**
  * @description style object is passed to :style attribute in td tag
  * dynamically changing the styles of the component based on properties
  * @function tdStyleObj
  */
  protected get tdStyleObj () :Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      textAlign: controlProp.TextAlign === 0 ? 'left' : controlProp.TextAlign === 2 ? 'right' : 'center'
    }
  }

  /**
  * @description watches changes in properties for Value
  * @function ValueData
  * @param oldVal previous properties data
  * @param newVal  new/changed properties data
  */
  @Watch('properties.Value', { deep: true })
  ValueData (newVal:string, oldVal:string) {
    if (this.properties.BoundColumn! > 0 && this.properties.BoundColumn! < this.extraDatas.RowSourceData!.length) {
      let tempData = [...this.extraDatas.RowSourceData!]
      if (tempData![0][this.properties.BoundColumn! - 1] === newVal) {
        this.updateDataModel({ propertyName: 'Value', value: newVal })
      } else {
        this.updateDataModel({ propertyName: 'Value', value: '' })
      }
    }
  }

  /**
   * @description mounted initializes the values which are required for the component
   */
  mounted () {
    const initialRowSourceData = this.extraDatas.RowSourceData!
    this.updateDataModel({ propertyName: 'ControlSource', value: '' })
    if (initialRowSourceData && initialRowSourceData.length === 0) {
      this.updateDataModel({ propertyName: 'TopIndex', value: -1 })
    } else {
      this.updateDataModel({ propertyName: 'TopIndex', value: 0 })
    }
  }

  /**
  * @description watches changes in properties for MultiSelect
  * @function multiSelectCheck
  * @param oldVal previous properties data
  * @param newVal  new/changed properties data
  */
  @Watch('properties.MultiSelect', { deep: true })
  multiSelectCheck (newVal:number, oldVal:number) {
    this.clearOptionBGColorAndChecked(this.tempEvent)
  }

  /**
  * @description watches changes in properties for ListStyle
  * @function listCheck
  * @param oldVal previous properties data
  * @param newVal  new/changed properties data
  */
  @Watch('properties.ListStyle', { deep: true })
  listCheck (newVal:number, oldVal:number) {
    this.clearOptionBGColorAndChecked(this.tempEvent)
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
.table-style {
  width: 100px;
}
</style>
