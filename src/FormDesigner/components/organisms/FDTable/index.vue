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
        @change="updateAppearance"
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
import { IselectControl, IupdateControl, IupdateControlExtraData, IupdatedSelectedControl } from '@/storeModules/fd/actions'
import { EventBus } from '@/FormDesigner/event-bus'

interface IPropControl {
  propertyName: keyof controlProperties
  value : any
}

@Component({
  name: 'FDTable',
  components: {
    FDTableItems
  }
})
export default class FDTable extends Vue {
  @Prop({ type: Object, required: true }) tableData!: tableDatas;
  @State((state) => state.fd.userformData) userformData!: userformData;
  @Prop({ required: true, type: String }) public readonly userFormId! : string
  @Prop({ required: true }) public readonly getSelectedControlsDatas: any
  @Action('fd/updateControl') updateControl!: (payload: IupdateControl) => void;
  @Action('fd/updateControlExtraData') updateControlExtraData!: (
    payload: IupdateControlExtraData
  ) => void;
  @State((state) => state.fd.selectedControls) selectedControls!: fdState['selectedControls'];

  emitUpdateProperty (
    propertyName: keyof controlProperties,
    value: any
  ) {
    this.updateProperty({ propertyName: propertyName, value: value })
  }

  emitUpdateExtraProperty (
    propertyName: keyof controlProperties,
    value: any
  ) {
    this.updateProperty({ propertyName: propertyName, value: value })
  }
  updatePageIndex (propValue: number) {
    const userData = this.userformData[this.userFormId]
    const selected = this.selectedControls[this.userFormId].selected[0]
    const swapTabIndex = userData[selected].properties.Index!
    const container = this.selectedControls[this.userFormId].container[0]

    if (propValue < userData[container].controls.length) {
      const index = userData[container].controls.findIndex(val => userData[val].properties.Index === propValue)
      this.updatePropValue(userData[container].controls[index], 'Index', swapTabIndex)
      this.updatePropValue(selected, 'Index', propValue)
    }
  }
  getLowestIndex (tempControls: string[], controlLength: number, propertyType: boolean) {
    let lastControlId = controlLength
    const userData = this.userformData[this.userFormId]
    for (let i = 0; i < tempControls.length; i++) {
      const propetyName = propertyType ? userData[tempControls[i]].extraDatas!.zIndex! : userData[tempControls[i]].extraDatas!.TabIndex!
      if (propetyName !== -1) {
        const IdNum = propetyName
        if (!isNaN(IdNum) && lastControlId > IdNum) {
          lastControlId = IdNum
        }
      }
    }
    return lastControlId
  }
  swapTabIndex (tempZIndex: number) {
    const userData = this.userformData[this.userFormId]
    const container = this.selectedControls[this.userFormId].container[0]
    const selected = this.selectedControls[this.userFormId].selected[0]
    const swapTabIndex = userData[selected].properties!.TabIndex!
    if (tempZIndex <= userData[container].controls.length - 1 && tempZIndex > -1) {
      const index = userData[container].controls.findIndex(
        (val) => userData[val].properties!.TabIndex === tempZIndex
      )
      this.updatePropValue(userData[container].controls[index], 'TabIndex', swapTabIndex)
      this.updatePropValue(selected, 'TabIndex', tempZIndex)
    }
  }
  updateTabIndexValue (val: number) {
    const userData = this.userformData[this.userFormId]
    const container = this.selectedControls[this.userFormId].container[0]
    const selected = this.selectedControls[this.userFormId].selected[0]
    const containerControls = this.userformData[this.userFormId][container].controls
    const controlType = userData[selected].type
    if (controlType !== 'FDImage') {
      const tempControls = []
      for (const index in containerControls) {
        const cntrlData = this.userformData[this.userFormId][containerControls[index]]
        if (cntrlData.type === 'FDImage') {
          tempControls.push(containerControls[index])
        }
      }
      const lastControlId = tempControls.length > 0 ? this.getLowestIndex(tempControls, userData[container].controls.length - 1, false)
        : this.userformData[this.userFormId][container].controls.length - 1
      if (val <= lastControlId) {
        this.swapTabIndex(val)
      }
    }
  }

  updateExtraProperty (arg: IupdateControlExtraData) {
    const selected = this.getSelectedControlsDatas!
    for (let i = 0; i < selected.length; i++) {
      this.updateControlExtraData({
        userFormId: this.userFormId,
        controlId: selected[i],
        propertyName: arg.propertyName,
        value: arg.value
      })
    }
  }
  updateProperty (arg: IPropControl) {
    const selected = this.getSelectedControlsDatas!
    for (let i = 0; i < selected.length; i++) {
      if (arg.propertyName === 'TabIndex') {
        this.updateTabIndexValue(parseInt(arg.value))
      } else if (arg.propertyName === 'Index') {
        this.updatePageIndex(parseInt(arg.value))
      } else if (arg.propertyName === 'Name') {
        return this.updateName(selected[i], arg.value)
      } else {
        this.updatePropValue(selected[i], arg.propertyName, arg.value)
      }
    }
  }
  updatePropValue (id: string, propName: keyof controlProperties, propValue: string|number) {
    this.updateControl({
      userFormId: this.userFormId,
      controlId: id,
      propertyName: propName,
      value: propValue
    })
  }
  updateName (id: string, value: string) {
    const userData = Object.keys(this.userformData[this.userFormId])
    const isUnique = userData.findIndex(val => this.userformData[this.userFormId][val].properties.Name === value)
    if (isUnique === -1 && value !== '') {
      this.updatePropValue(id, 'Name', value)
      return true
    } else {
      return false
    }
  }
  updateAppearance (e: Event) {
    const propertyName: keyof controlProperties = (e.target as HTMLInputElement).name as keyof controlProperties
    const inputType = this.tableData[propertyName]!.type
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
      } else if (propertyName === 'Name') {
        const isSuccess = this.updateProperty({ propertyName: propertyName, value: propertyValue })
        if (!isSuccess) {
          (e.target as HTMLInputElement).value = this.tableData!.Name!.value! as string
          EventBus.$emit('showErrorPopup', true, 'invalid', 'Could not set the Name property. Ambiguous name.')
        }
      } else {
        this.emitUpdateProperty(propertyName, propertyValue)
      }
    } else if (inputType === 'number' || inputType === 'float') {
      const value = propertyValue.includes('.') ? parseFloat(propertyValue) : parseInt(propertyValue)
      if (propertyName === 'Height' || propertyName === 'Width') {
        if (value >= 0 && value <= 32767) {
          this.emitUpdateProperty(propertyName, value)
        } else {
          (e.target as HTMLInputElement).value = this.tableData![propertyName]!.value! as string
          EventBus.$emit('showErrorPopup', true, 'overflow', 'Overflow')
        }
      } else if (propertyName === 'Top' || propertyName === 'Left') {
        console.log(value)
        if (value > -32767 && value <= 32767) {
          this.emitUpdateProperty(propertyName, value)
        } else {
          (e.target as HTMLInputElement).value = this.tableData![propertyName]!.value! as string
          EventBus.$emit('showErrorPopup', true, 'invalid', `Could not set the ${propertyName} property. Invalid property value.`)
        }
      } else {
        this.emitUpdateProperty(propertyName, value)
      }
    } else if (inputType === 'Boolean') {
      this.emitUpdateProperty(
        propertyName,
        (e.target as HTMLInputElement).value === 'true'
      )
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
        (e.target as HTMLInputElement).name as keyof controlProperties,
        reader.result
      )
    }
    reader.readAsDataURL(file)
  }

  emitFont (tempVal: font) {
    this.emitUpdateProperty('Font', tempVal)
  }
  colorPaletteProp (selectedValue: ISelectedColoPaletteValue) {
    this.emitUpdateProperty(selectedValue.propertyName as keyof controlProperties, selectedValue.propertyValue)
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
