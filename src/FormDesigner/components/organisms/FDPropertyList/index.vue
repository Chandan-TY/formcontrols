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
      >
        <option
          :value="userFormId"
          :selected="true"
        >{{ userformData[userFormId][userFormId].properties.Name}} {{userformData[userFormId][userFormId].type}}</option>
         <option v-for="control in userformData[userFormId][userFormId].controls" :value="control" :key="userformData[userFormId][control].properties.Name">
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
import { IupdateControl, IupdatedSelectedControl } from '@/storeModules/fd/actions'

@Component({
  name: 'PropertiesList',
  components: {
    FDPropertyTable,
    FDTable
  }
})
export default class PropertiesList extends Vue {
  @Action('fd/updateControl') updateControl!: (payload: IupdatedSelectedControl) => void
  @Action('fd/updateControlExtraData') updateControlExtraData!: (payload: IupdatedSelectedControl) => void
  @State(state => state.fd.userformData) userformData!: userformData
  @State((state) => state.fd.selectedControls) selectedControls!: fdState['selectedControls'];
  @State(state => state.fd.groupedControls) groupedControls!: fdState['groupedControls']
  @Prop({ required: true, type: String }) public readonly userFormId! : string

  propList = new PropertyListDefine();

  isTableVisible = false;
  hideShowTable () {
    this.isTableVisible = true
  }

  selectedOption: Object= {}

  get getSelectedControlsDatas () {
    return this.selectedControls[this.userFormId]
  }
  updateProperty (arg: IupdatedSelectedControl) {
    // debugger
    const selected = this.getSelectedControlsDatas.selected
    console.log(selected)
    console.log(arg)
    // for (let i = 0; i < selected.length; i++) {
    //   this.updateControl({
    //     userFormId: this.userFormId,
    //     controlId: selected[i],
    //     propertyName: this.testPropName,
    //     value: this.testPropValue
    //   })
    // }
    if (arg.target === null) {
      if (this.selectedControls.main instanceof Array) {
        for (const vueInstance of this.selectedControls.main) {
          arg.target = vueInstance
          this.updateControl(arg)
        }
      } else {
        arg.target = this.selectedControls.main
        this.updateControl(arg)
      }
    }
  }

  updateExtraProperty (arg: IupdatedSelectedControl) {
    if (arg.target === null) {
      if (this.selectedControls.main instanceof Array) {
        for (const vueInstance of this.selectedControls.main) {
          arg.target = vueInstance
          this.updateControlExtraData(arg)
        }
      } else {
        arg.target = this.selectedControls.main
        this.updateControlExtraData(arg)
      }
    }
  }

  get propertyTableData () : tableDatas {
    // debugger
    console.log('SSS', this.getSelectedControlsDatas.selected)
    console.log('GGG', this.groupedControls[this.userFormId])
    const result : tableDatas = {}
    for (const controlType in this.propList.data) {
      if (this.getSelectedControlsDatas.selected.length === 1) {
        const controlData = this.userformData[this.userFormId][this.getSelectedControlsDatas.selected[0]]
        if (controlData.type === controlType) {
          const defineList = this.propList.data[controlType]
          for (const propName in defineList) {
            const propValue = controlData.properties[propName]
            if (propValue !== undefined) {
              result[propName] = {
                ...defineList[propName],
                value: propValue
              }
            }
          }
          break
        }
      }
    }
    return result
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
