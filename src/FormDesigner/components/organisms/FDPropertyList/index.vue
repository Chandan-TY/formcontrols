<template>
  <div v-if="isTableVisible===false">
    <div>
      <div class="sideheader">
        <span class="sideheader1">
          <span>Properties - {{userformData[userFormId][userFormId].properties.Name}}</span>
          <div id="mdiv" v-on:click="hideShowTable">
            <div class="mdiv">
              <div class="md"></div>
            </div>
          </div>
        </span>
      </div>
    </div>
    <div class="form-group">
       <select
        class="form-control"
        name="selectedUserForm"
        id="selectedUserForm"
        v-if="userFormId"
        @change="updateSelected($event)"
      >
        <option
          :value="userFormId"
          :selected="true"
        >{{ userformData[userFormId][this.selectedContainer[0]].properties.Name}} {{userformData[userFormId][this.selectedContainer[0]].type}}</option>
         <option  v-for="control in userformData[userFormId][this.selectedContainer[0]].controls" :value="control" :key="userformData[userFormId][control].properties.Name">
          <b>{{ userformData[userFormId][control].properties.Name }} {{userformData[userFormId][control].type}}</b>
        </option>
      </select>

    </div>
    <!-- <FDPropertyTable
      :tableData="propertyTableData"
      @updateProperty="updateProperty"/> -->
    <FDTable :tableData="propertyTableData" @updateProperty="updateProperty" @updateExtraProperty="updateExtraProperty" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'
import FDTable from '@/FormDesigner/components/organisms/FDTable/index.vue'
import FDPropertyTable, { tableDatas } from '@/FormDesigner/components/organisms/FDPropertyTable/index.vue'
import { LabelData } from '../../../models/ControlsTableProperties/LabelTableProperties'
import { PropertyListDefine } from '@/FormDesigner/models/ControlsTableProperties/propertyList'
import { IselectControl, IupdateControl, IupdateControlExtraData, IupdatedSelectedControl } from '@/storeModules/fd/actions'

@Component({
  name: 'PropertiesList',
  components: {
    FDPropertyTable,
    FDTable
  }
})
export default class PropertiesList extends Vue {
  @Action('fd/updateControl') updateControl!: (payload: IupdateControl) => void;
 @Action('fd/updateControlExtraData') updateControlExtraData!: (
    payload: IupdateControlExtraData
  ) => void;
  @State(state => state.fd.userformData) userformData!: userformData
  @State((state) => state.fd.selectedControls) selectedControls!: fdState['selectedControls'];
  @State(state => state.fd.groupedControls) groupedControls!: fdState['groupedControls']
  @Prop({ required: true, type: String }) public readonly userFormId! : string
  @Action('fd/selectControl') selectControl!: (payload: IselectControl) => void;

  propList = new PropertyListDefine();

  isTableVisible = false;
  hideShowTable () {
    this.isTableVisible = true
  }

  selectedOption: Object= {}

  get getSelectedControlsDatas () {
    if (this.selectedSelect.length > 0 && this.selectedContainer.length > 0) {
      if (this.selectedControls[this.userFormId].selected.length === 1 && !this.selectedControls[this.userFormId].selected[0].startsWith('group')) {
        return this.selectedControls[this.userFormId].selected
      } else {
        const filteredSelectedControls = []
        const controls = this.userformData[this.userFormId][this.selectedControls[this.userFormId].container[0]].controls
        const selControls = this.selectedControls[this.userFormId].selected
        for (let i = 0; i < selControls.length; i++) {
          if (selControls[i].startsWith('group')) {
            for (let j = 0; j < controls.length; j++) {
              if (this.userformData[this.userFormId][controls[j]].properties.GroupID === selControls[i]) {
                filteredSelectedControls.push(controls[j])
              }
            }
          } else {
            filteredSelectedControls.push(selControls[i])
          }
        }
        console.log('222', filteredSelectedControls)
        return filteredSelectedControls
      }
    }
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
  updateProperty (arg: IupdateControl) {
    const selected = this.getSelectedControlsDatas!
    for (let i = 0; i < selected.length; i++) {
      if (arg.propertyName === 'TabIndex') {
        this.updateTabIndexValue(parseInt(arg.value))
      } else if (arg.propertyName === 'Index') {
        this.updatePageIndex(parseInt(arg.value))
      } else {
        this.updatePropValue(selected[i], arg.propertyName, arg.value)
      }
    }
    // if (arg.target === null) {
    //   if (this.selectedControls.main instanceof Array) {
    //     for (const vueInstance of this.selectedControls.main) {
    //       arg.target = vueInstance
    //       this.updateControl(arg)
    //     }
    //   } else {
    //     arg.target = this.selectedControls.main
    //     this.updateControl(arg)
    //   }
    // }
  }
  updatePropValue (id: string, propName: keyof controlProperties, propValue: string|number) {
    this.updateControl({
      userFormId: this.userFormId,
      controlId: id,
      propertyName: propName,
      value: propValue
    })
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

  get propertyTableData () : tableDatas {
    const result : tableDatas = {}
    if (this.selectedSelect.length > 0 && this.selectedContainer.length > 0) {
      if (this.getSelectedControlsDatas!.length === 1) {
        const controlData = this.userformData[this.userFormId][this.getSelectedControlsDatas![0]]
        const defineList = this.propList.data[controlData.type]
        for (const propName in defineList) {
          const propValue = controlData!.properties[propName]
          if (propValue !== undefined) {
            result[propName] = {
              ...defineList[propName],
              value: propValue
            }
          }
        }
      }
    }
    return result
  }

  updateSelected (e: MouseEvent) {
    if (e.target instanceof HTMLSelectElement) {
      if (e.target.options.selectedIndex > -1) {
        const controlName = e.target.options[e.target.options.selectedIndex].text.split(' ')[0]
        const controlsArray = this.userformData[this.userFormId][this.selectedContainer[0]].controls
        const value = Object.keys(this.userformData[this.userFormId]).filter(val => {
          return this.userformData[this.userFormId][val].properties.Name === controlName
        })
        this.selectControl({
          userFormId: this.userFormId,
          select: {
            container: this.selectedContainer,
            selected: value
          }
        })
      }
    }
  }
  get selectedSelect () {
    return this.selectedControls[this.userFormId].selected
  }
  get selectedContainer () {
    return this.selectedControls[this.userFormId].container
  }
}
</script>

<style scoped>
.sideheader1 {
   display: grid;
  grid-template-columns: 1fr 25px;
  background-color: rgb(142, 191, 231);
  margin-bottom: 8px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.sideheader {
  height: 22px;
  text-align: left;
  padding: 0pc;
  background-color: #99b4d1;
}
.form-control {
  float: left;
  width: 100%;
  cursor: pointer;
  background-color: white;
}
#mdiv {
  float: right;
  margin: initial;
  position: relative;
  top: 0px;
  width: 20px;
  height: 16px;
  background-color: lightgray;
  border: outset;
}

.mdiv {
  height: 17px;
  width: 2px;
  margin-left: 60px;
  background-color: black;
  transform: rotate(45deg);
  z-index: 1;
  position: absolute;
  right: 8px;
}

.md {
  height: 17px;
  width: 2px;
  background-color: black;
  transform: rotate(90deg);
  z-index: 2;
  position: absolute;
  right: 0px;
}
</style>
