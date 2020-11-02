<template>
  <div v-if="isTableVisible===false">
    <div>
      <div class="sideheader">
        <span class="sideheader1">
          <span>Properties - VBAProject</span>
          <div id="mdiv" v-on:click="hideShowTable">
            <div class="mdiv">
              <div class="md"></div>
            </div>
          </div>
        </span>
      </div>
    </div>
    <div class="form-group">
      <label for="userForm"></label>

       <select
        class="form-control"
        name="selectedUserForm"
        id="selectedUserForm"
        v-model="selectedOption"
        v-if="Object.keys(selectedUserForm).length>0"
      >
        <option
          :value="selectedUserForm"
          :selected="true"
        >{{ selectedUserForm.properties.Name}} {{selectedUserForm.type}}</option>
         <option v-for="control in selectedUserForm.controls" :value="control" :key="control.id">
          <b>{{ control.properties.Name }} {{control.type}}</b>
        </option>
      </select>

    </div>
    <!-- <FDPropertyTable
      :tableData="propertyTableData"
      @updateProperty="updateProperty"/> -->
    <FDTable  @FontProp="fontProp" :tableData="propertyTableData" @updateProperty="updateProperty" @updateExtraProperty="updateExtraProperty"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'
import FDTable from '@/FormDesigner/components/organisms/FDTable/index.vue'
import FDPropertyTable, { tableDatas } from '@/FormDesigner/components/organisms/FDPropertyTable/index.vue'
// import { EventBus } from '../../../event-bus'
import { LabelData } from '../../../models/ControlsTableProperties/LabelTableProperties'
import { PropertyListDefine } from '@/FormDesigner/models/ControlsTableProperties/propertyList'
import { IupdateControl, IupdatedSelectedControl } from '@/storeModules/fd/actions'

interface SelectedUserForm{
  controls: Array<string>,
  extraDatas: Object,
  properties: Object,
  type : string
}

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
  @State(state => state.fd.selectedControls) selectedControls!: updatedSelectedControls
  propList = new PropertyListDefine();

  isTableVisible = false;
  hideShowTable () {
    this.isTableVisible = true
  }

  selectedUserForm: Object = {}
  selectedOption: Object= {}
  // created () {
  //   EventBus.$on('userFormClicked', (selectedUserForm: Object, selectedOption: Object) => {
  //     this.selectedUserForm = selectedUserForm
  //     this.selectedOption = selectedOption

  //     console.log('SUF', this.selectedUserForm)
  //     console.log('SO', this.selectedOption)
  //   })
  // }

  updateProperty (arg: IupdatedSelectedControl) {
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

  // get selCtrl () {
  //   return this.userformData['ID_USERFORM1']['ID_Label1'].properties
  // }

  // get propertyTableData () : tableDatas {
  //   const result : tableDatas = {}
  //   for (const controlType in this.propList.data) {
  //     if (this.selCtrl.selected[0].controlData.type === controlType) {
  //       const defineList = this.propList.data[controlType]
  //       for (const propName in defineList) {
  //         const propValue = this.selCtrl.selected[0].controlData.properties[propName]
  //         if (propValue !== undefined) {
  //           result[propName] = {
  //             ...defineList[propName],
  //             value: propValue
  //           }
  //         }
  //       }
  //       break
  //     }
  //   }
  //   return result
  // }
  // destoryed () {
  //   EventBus.$off('userFormClicked')
  // }
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
