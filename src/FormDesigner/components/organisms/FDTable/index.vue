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
        @emitFont="emitFont"
        @colorPaletteProp="colorPaletteProp"
      />
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

  @Emit('updateProperty')
  emitUpdateProperty (
    propertyName: string,
    value: string | number | object | null | undefined | boolean
  ) {
    return { target: null, propertyName: propertyName, value: value }
  }

  @Emit('updateExtraProperty')
  emitUpdateExtraProperty (
    propertyName: string,
    value: string | number | object | null | undefined | boolean
  ) {
    return { target: null, propertyName: propertyName, value: value }
  }

  updateAppearance (e: Event) {
    const propertyName = (e.target as HTMLInputElement).name
    const inputType = this.tableData[propertyName].type
    let propertyValue = (e.target as HTMLInputElement).value
    if (inputType === 'file') {
      if (propertyName === 'MouseIcon' || propertyName === 'Picture') {
        this.handleConvertionImageToBase64(e)
      }
    } else if (inputType === 'String') {
      if (propertyName === 'Accelerator') {
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
      this.emitUpdateProperty(
        propertyName,
        parseInt((e.target as HTMLInputElement).value)
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

  emitFont (tempVal: font) {
    this.emitUpdateProperty('Font', tempVal)
  }
  colorPaletteProp (selectedValue: ISelectedColoPaletteValue) {
    this.emitUpdateProperty(selectedValue.propertyName, selectedValue.propertyValue)
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
