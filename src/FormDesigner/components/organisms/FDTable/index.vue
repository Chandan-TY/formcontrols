<template>
  <div>
    <div class="btn-group">
      <button class="button" default>Alphabetic</button>
      <button class="button">Categorized</button>
    </div>
    <div
      style="
        position: absolute;
        height: calc(100% - 59px);
        overflow-y: auto;
        overflow-x: hidden;
        width: 100%;
      "
    >
      <FDTableItems
        v-for="(value, propertyName, index) in tableData"
        :key="index"
        @input="updateAppearance"
        :controlPropertyData="value"
        :propertyName="propertyName"
      />
        <!-- @FontProp="fontProp"
        @colorPaletteProp="colorPaletteProp" -->
        <!-- @change="handleChange" -->
        <!-- @change="updateAppearance" -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import FDTableItems from '../../molecules/FDTableItems/index.vue'

export interface tableData {
  [key: string]: number | string | null | undefined | font | Array<string>;
  type: string;
}
export interface PicturePosition {
  [key: string]: string;
  backgroundPositionX: string;
  backgroundPositionY: string;
}

@Component({
  name: 'FDTable',
  filters: {
    sizeFilter (value: string) {
      return parseInt(value, 10)
    }
  },
  components: {
    FDTableItems
  }
})
export default class FDTable extends Vue {
  @Prop({ type: Object, required: true }) tableData!: tableData;
  @State((state) => state.fd.userformData) userformData!: userformData;

  handleChange (e: any) {
    console.log(e)
  }
  @Emit('updateProperty')
  emitUpdateProperty (
    proprtyName: string,
    value: string | number | object | null | undefined | boolean
  ) {
    // debugger
    return { target: null, proprtyName: proprtyName, value: value }
  }

  @Emit('updateExtraProperty')
  emitUpdateExtraProperty (
    proprtyName: string,
    value: string | number | object | null | undefined | boolean
  ) {
    return { target: null, proprtyName: proprtyName, value: value }
  }

  updateAppearance (e: Event) {
    debugger
    const propertyName = (e.target as HTMLInputElement).name
    const inputType = this.tableData[propertyName].type
    let propertyValue = (e.target as HTMLInputElement).value
    if (inputType === 'String') {
      if (propertyName === 'MouseIcon' || propertyName === 'Picture') {
        this.handleConvertionImageToBase64(e)
      } else if (propertyName === 'Accelerator') {
        this.emitUpdateProperty(
          propertyName,
          propertyValue !== '' ? propertyValue[0] : propertyValue
        )
      } else {
        this.emitUpdateProperty(propertyName, propertyValue)
      }
    } else if (inputType === 'number' || inputType === 'float') {
      this.emitUpdateProperty(
        propertyName,
        propertyValue.includes('.')
          ? parseFloat(propertyValue)
          : parseInt(propertyValue)
      )
    } else if (inputType === 'Boolean') {
      if (propertyName === 'AutoSize') {
        this.emitUpdateProperty(
          propertyName,
          (e.target as HTMLInputElement).value === 'true'
        )
      } else {
        this.emitUpdateProperty(
          propertyName,
          (e.target as HTMLInputElement).value === 'true'
        )
      }
    } else if (inputType === 'array') {
      if (propertyName === 'PicturePosition') {
        let result: PicturePosition = this.handlePicturePosition(e)
        for (const key in result) {
          if (result.hasOwnProperty(key)) {
            const element = result[key]
            this.emitUpdateExtraProperty(key, element)
          }
        }
      } else {
        this.emitUpdateProperty(
          propertyName,
          parseInt((e.target as HTMLInputElement).value)
        )
      }
    } else if (inputType === 'font') {
      this.emitUpdateProperty(
        propertyName,
        (e.target as HTMLInputElement).value
      )
    } else if (inputType === 'color') {
      this.emitUpdateProperty(
        propertyName,
        (e.target as HTMLInputElement).value
      )
    }
  }

  handleConvertionImageToBase64 (e: Event) {
    let that = this
    var file = (e.target as HTMLInputElement).files![0]
    var reader = new FileReader()
    reader.onloadend = function () {
      console.log('RESULT', reader.result)
      that.emitUpdateProperty(
        (e.target as HTMLInputElement).name,
        reader.result
      )
    }
    reader.readAsDataURL(file)
  }

  handlePicturePosition (e: Event): PicturePosition {
    switch (parseInt((e.target as HTMLInputElement).value)) {
      case 0:
        return { backgroundPositionX: 'left', backgroundPositionY: 'top' }
      case 1:
        return { backgroundPositionX: 'left', backgroundPositionY: 'center' }
      case 2:
        return { backgroundPositionX: 'left', backgroundPositionY: 'bottom' }
      case 3:
        return { backgroundPositionX: 'right', backgroundPositionY: 'top' }
      case 4:
        return { backgroundPositionX: 'right', backgroundPositionY: 'center' }
      case 5:
        return { backgroundPositionX: 'right', backgroundPositionY: 'bottom' }
      case 6:
        return { backgroundPositionX: 'center', backgroundPositionY: 'top' }
      case 7:
        return { backgroundPositionX: 'center', backgroundPositionY: 'bottom' }
      case 8:
        return { backgroundPositionX: 'center', backgroundPositionY: 'center' }
      case 9:
        return { backgroundPositionX: 'center', backgroundPositionY: '20%' }
      case 10:
        return { backgroundPositionX: 'center', backgroundPositionY: 'center' }
      case 11:
        return { backgroundPositionX: 'center', backgroundPositionY: 'bottom' }
      case 12:
        return { backgroundPositionX: 'center', backgroundPositionY: 'center' }
      default:
        return { backgroundPositionX: '', backgroundPositionY: '' }
    }
  }

  fontProp (tempVal: font) {
    this.emitUpdateProperty('Font', tempVal)
  }
  colorPaletteProp (selectedValue: string, name: string) {
    this.emitUpdateProperty(name, selectedValue)
  }
}
</script>

<style scoped>
.node {
  text-align: left;
}
table {
  margin-right: 0%;
  width: 100%;
  border: 1px solid black;
  border-collapse: collapse;
  color: black;
}
th,
td {
  text-align: left;
  font-size: 11px;
  margin-right: 0%;
  width: fit-content;
  border: 1px solid black;
  border-collapse: collapse;
  color: black;
}
th {
  width: 120%;
  font-size: 12px;
}
.form-control {
  float: left;
  width: 280px;
  cursor: pointer;
  background-color: rgb(190, 185, 185);
}
label {
  float: left;
}
select {
  width: 100%;
  padding: 1px 2px;
}
input {
  width: 100%;
}

/* Must be added as style for the new data */
.btn-group .button {
  border: none;
  color: black;

  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  cursor: pointer;
}
.btn-group .button {
  border: none;
  color: black;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 12px;
  cursor: pointer;
}
.lefttd {
  width: 120px;
}
</style>
