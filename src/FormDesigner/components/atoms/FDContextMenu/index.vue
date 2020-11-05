<template>
<div>
  <div class="outercontext-div">
    <div class="wrapper-context" v-for="(value,i) in values" :key="i">
      <button
        class="wrapper1-context"
        v-if="value.values.length===0"
        :style="{'border': value.text==='none'?'0.3px solid white':'',
                  'background':value.text==='none'?'white':'',
                  'height': value.text==='none'?'4px':'' ,
                  'padding-top': value.text==='none'?'0px':'',
                  'outline': value.text==='none'?'none':''
                }"
        @mousedown.stop="value.disabled === false? controlAction(value.id): ''"
      >
        <div>
         <FDSVGImage v-if="value.icon" :name="value.icon" />
        </div>
        <span v-if="value.text==='none'">
          <hr />
        </span>
        <span v-else class="set-context" v-html="value.text" :style="{opacity: value.disabled? 0.5: 1}">{{value.text}}</span>
      </button>
      <button class="wrapper1-context wrapper21" v-else>
        <div></div>
        <ul class="set-context top-level-menu">
          <li>
            <a href="#" v-html="value.text">{{value.text}}</a>
            <ul class="third-level-menu">
              <li
                class="wrapper1-context"
                v-for="(subVal,i) in value.values"
                :key="i"
                :style="{'border': subVal.text==='none'?'0.3px solid white':'',
                          'background':subVal.text==='none'?'white':'',
                          'height': subVal.text==='none'?'4px':'' ,
                          'padding-top': subVal.text==='none'?'0px':'',
                          'outline': subVal.text==='none'?'none':''
                        }"
              >
                <div>
                  <FDSVGImage  v-if="subVal.icon" :name="subVal.icon" />
                </div>
                <a v-if="subVal.text==='none'">
                  <hr />
                </a>
                <a v-else href="#" v-html="subVal.text">{{subVal.text}}</a>
              </li>
            </ul>
          </li>
        </ul>
        <div class="triangle-right"></div>
      </button>
    </div>
  </div>
  <div>
</div>
<div>
</div>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import FDSVGImage from '@/FormDesigner/components/atoms/FDSVGImage/index.vue'
import { Action, State } from 'vuex-class'
import { IaddControl, IdeleteControl, IselectControl, IupdateControl, IupdateControlExtraData, IupdateCopyControlList, IupdateGroup } from '@/storeModules/fd/actions'
import { EventBus } from '@/FormDesigner/event-bus'

@Component({
  name: 'ContextMenu',
  components: {
    FDSVGImage
  }
})
export default class ContextMenu extends Vue {
  @Prop() values: Array<IControlContextMenu>
  @Prop() userFormId: string
  @Prop() containerId: string
  @Prop() keyEventName: string
  @Prop() controlId: string
  @Prop() selectedTab: number
  @Prop() data: controlData

  @State(state => state.fd.selectedControls) selectedControls!: fdState['selectedControls']
  @State((state:rootState) => state.fd.copyControlList) copyControlList!: fdState['copyControlList']
  @State(state => state.fd.userformData) userformData!: userformData
  @State(state => state.fd.groupedControls) groupedControls!: fdState['groupedControls']

  @Action('fd/deleteControl') deleteControl!: (payload: IdeleteControl) => void
  @Action('fd/updateCopyControlList') updateCopyControlList!: (payload: IupdateCopyControlList) => void
  @Action('fd/addControl') addControl!: (payload: IaddControl) => void;
  @Action('fd/selectControl') selectControl!: (payload: IselectControl) => void;
  @Action('fd/updateGroup') updateGroup!: (payload: IupdateGroup) => void
  @Action('fd/updateControlExtraData') updateControlExtraData!: (payload: IupdateControlExtraData) => void;
  @Action('fd/updateControl') updateControl!: (payload: IupdateControl) => void;

  controlAction (controlActionName: string) {
    if (controlActionName === 'ID_COPY') {
      this.copyControl()
    } else if (controlActionName === 'ID_DELETE') {
      this.clickDelete()
    } else if (controlActionName === 'ID_PASTE') {
      this.pasteControl()
    } else if (controlActionName === 'ID_CUT') {
      this.cutControl()
    } else if (controlActionName === 'ID_SELECTALL') {
      this.selectAll()
    } else if (controlActionName === 'ID_GROUP') {
      this.groupControl()
    } else if (controlActionName === 'ID_UNGROUP') {
      this.unGroupControl()
    } else if (controlActionName === 'ID_NEWPAGE') {
      this.addNewPage()
    } else if (controlActionName === 'ID_DELETEPAGE') {
      this.deleteCurrentPage(this.selectedTab)
    } else if (controlActionName === 'ID_RENAME') {
      // Instead of 'ID_USERFORM1' this.userFormId should be passed
      EventBus.$emit('renamePage', 'ID_USERFORM1', this.controlId, this.selectedTab)
    } else if (controlActionName === 'ID_MOVE') {
      // Instead of 'ID_USERFORM1' this.userFormId should be passed
      EventBus.$emit('tabStripTabOrder', 'ID_USERFORM1', this.controlId)
    } else if (controlActionName === 'ID_TABORDER') {
      // console.log('containerId', this.containerId)
      // EventBus.$emit('userFormTabOrder', this.userFormId, this.containerId)
      // second parameter should be this.controlId
      EventBus.$emit('userFormTabOrder', this.userFormId, this.containerId)
    }
    this.closeMenu()
  }
  @Emit('closeMenu')
  closeMenu () {
    return 0
  }
  @Emit('addNewPage')
  addNewPage () {
    return 0
  }
  @Emit('deleteCurrentPage')
  deleteCurrentPage (selectedTab: number) {
    return selectedTab
  }
  updateControlProperty (propertyName: keyof controlProperties, propertyValue: number|string, controlId: string) {
    this.updateControl({
      userFormId: this.userFormId,
      controlId: controlId,
      propertyName: propertyName,
      value: propertyValue
    })
  }

  unGroupControl () {
    const isGroup = this.selectedControls[this.userFormId].selected[0].startsWith('group')
    const selControl = this.selectedControls[this.userFormId].selected[0]
    const selected = isGroup ? selControl : this.userformData[this.userFormId][selControl].properties.GroupID!

    const controlList = []
    for (const key in this.userformData[this.userFormId]) {
      const type = this.userformData[this.userFormId][key].type
      if (type !== 'Userform' && this.userformData[this.userFormId][key].properties.GroupID === selected) {
        controlList.push(key)
      }
    }
    const groupArray = [...this.groupedControls[this.userFormId]!.groupArray!]
    this.updateControlGroupID(selected, '')
    const index = this.groupedControls[this.userFormId]!.groupArray!.findIndex(val => val === selected)
    groupArray.splice(index, 1)
    this.updateGroup({ userFormId: this.userFormId, groupArray: groupArray })
    this.selectControl({
      userFormId: this.userFormId,
      select: { container: [this.userFormId], selected: isGroup ? controlList : [selControl] }
    })
  }

  /**
  * @description To generate new GroupID
  * @function createGroupId
  */
  createGroupId () {
    let lastControlId = 0
    for (let i of this.groupedControls[this.userFormId]!.groupArray!) {
      if (i.indexOf('group') !== -1) {
        const IdNum =
            i.split('group').pop() || '-1'
        const pasreId = parseInt(IdNum, 10)
        if (!isNaN(pasreId) && lastControlId < pasreId) {
          lastControlId = pasreId
        }
      }
    }
    return `group${lastControlId + 1}`
  }

  @Emit('createGroup')
  createGroup (groupId: string) {
    return groupId
  }

  updateControlGroupID (groupName: string, updateGroupId: string) {
    for (const val in this.userformData[this.userFormId]) {
      if (!val.startsWith('ID_USERFORM')) {
        const controlGrpId = this.userformData[this.userFormId][val].properties.GroupID
        if (controlGrpId === groupName) {
          this.updateControlProperty('GroupID', updateGroupId, val)
        }
      }
    }
  }
  /**
  * @description To update the group Information in main data
  * @function groupControl
  */
  groupControl () {
    let updateGroupId: string = ''
    const selected = this.selectedControls[this.userFormId].selected

    const selectedGroupArray = selected.filter((val: string) => val.startsWith('group') && val)
    updateGroupId = selectedGroupArray[0]
    if (selectedGroupArray.length >= 2) {
      const groupArray = [...this.groupedControls[this.userFormId]!.groupArray!]
      for (let i = 0; i < groupArray.length; i++) {
        for (let j = 0; j < selectedGroupArray.length; j++) {
          if (selectedGroupArray[j] === groupArray[i]) {
            this.updateControlGroupID(groupArray[i], selectedGroupArray[0])
            groupArray.splice(i, 1)
          }
        }
      }
      this.updateGroup({ userFormId: this.userFormId, groupArray: [...groupArray, selectedGroupArray[0]] })
      updateGroupId = selectedGroupArray[0]!
    } else if (selectedGroupArray.length === 0) {
      updateGroupId = this.createGroupId()
      const groupArray = [...this.groupedControls[this.userFormId]!.groupArray!, updateGroupId]
      this.updateGroup({ userFormId: this.userFormId, groupArray: groupArray })
    }

    for (let val of selected) {
      if (!val.startsWith('group')) {
        this.updateControlProperty('GroupID', updateGroupId, val)
      }
    }
    this.selectControl({
      userFormId: this.userFormId,
      select: { container: [this.userFormId], selected: [updateGroupId] }
    })
    this.createGroup(updateGroupId)
  }

  /**
  * @description To select all the controls in respective container present in respective userform
  * @function selectAll
  */
  selectAll () {
    const controlObjectList = [...this.userformData[this.userFormId][this.containerId].controls]
    const selecedGroup = []
    for (const val of controlObjectList) {
      const controlGroupId: string = this.userformData[this.userFormId][val].properties.GroupID!
      if (controlGroupId && controlGroupId !== '') {
        !selecedGroup.includes(controlGroupId)! && selecedGroup.push(controlGroupId)
      } else {
        selecedGroup.push(val)
      }
    }

    if (controlObjectList.length !== 0) {
      this.selectControl({
        userFormId: this.userFormId,
        select: {
          container: [this.userFormId],
          selected: [...selecedGroup]
        }
      })
    }
  }

  /**
  * @description To update the cutted controls in respective container present in respective userform
  * @function cutControl
  */
  cutControl () {
    this.copyControl()
    this.clickDelete()
  }

  /**
  * @description To update the copied controls in respective container present in respective userform
  * @function copyControl
  */
  copyControl () {
    const targetControlObj: Array<controlData> = []
    const targetId: string[] = []
    const selected = this.selectedControls[this.userFormId].selected
    for (let i of selected) {
      if (i.startsWith('group')) {
        for (const j in this.userformData[this.userFormId]) {
          if (!i.startsWith('ID_USERFORM') && this.userformData[this.userFormId][j].properties.GroupID === i) {
            targetControlObj.push(this.userformData[this.userFormId][j])
            targetId.push(j)
          }
        }
      } else {
        targetControlObj.push(this.userformData[this.userFormId][i])
        targetId.push(i)
      }
    }
    this.updateCopyControlList({
      userFormId: this.userFormId,
      parentId: this.selectedControls[this.userFormId].container[0],
      targetId: targetId,
      targetObject: JSON.parse(JSON.stringify(targetControlObj))
    })
  }

  /**
  * @description To paste controls in respective container present in respective userform
  * @function pasteControl
  */
  pasteControl () {
    let lastControlId = -1
    let updateSeelctedControl: string[] = []
    let oldGroupId: string[] = []
    let newGroupId: string[] = []
    for (let i = 0; i < this.copyControlList.targetObject.length; i++) {
      if (this.copyControlList.targetObject[i].properties.GroupID && !oldGroupId.includes(this.copyControlList.targetObject[i].properties.GroupID!)) {
        oldGroupId.push(this.copyControlList.targetObject[i].properties.GroupID!)
      }
    }
    for (let j in oldGroupId) {
      const newId = this.createGroupId()
      newGroupId.push(newId)
      let groupArray: string[] = [...this.groupedControls[this.userFormId]!.groupArray!, newId]
      this.updateGroup({ userFormId: this.userFormId, groupArray: groupArray! })
    }

    for (let i = 0; i < this.copyControlList.targetId.length; i++) {
      let lastControlId = -1
      const selectedControlName: string|undefined = this.copyControlList.targetId[i].replace(/[0-9]/g, '').split('_').pop()
      const userformControlIds = Object.keys(this.userformData[this.userFormId])
      for (let i = 0; i < userformControlIds.length; i++) {
        if (userformControlIds[i].indexOf(selectedControlName!) !== -1) {
          const IdNum = userformControlIds[i].split(selectedControlName!).pop() || '-1'
          const pasreId = parseInt(IdNum, 10)
          if (!isNaN(pasreId) && lastControlId < pasreId) {
            lastControlId = pasreId
          }
        }
      }

      const controlObj = this.copyControlList.targetObject[i]
      const selCtrlIndex = oldGroupId.findIndex((val) => val === controlObj.properties.GroupID)
      lastControlId += 1
      const controlID: string|undefined = `ID_${selectedControlName}${lastControlId}`
      const item: controlData = { ...controlObj,
        properties: {
          ...controlObj.properties,
          ID: controlID!,
          Left: controlObj.properties.Left! + 10,
          Top: controlObj.properties.Top! + 10,
          GroupID: selCtrlIndex !== -1 ? newGroupId[selCtrlIndex] : ''
        }
      }
      if (item.properties.GroupID === '') {
        updateSeelctedControl.push(controlID)
      } else {
        if (!updateSeelctedControl.includes(item.properties.GroupID!)) {
          updateSeelctedControl.push(item.properties.GroupID!)
        }
      }
      this.addControl({
        userFormId: this.userFormId,
        controlId: this.containerId,
        addId: controlID,
        item: item
      })
    }
    for (let j of updateSeelctedControl) {
      if (j.startsWith('group')) { this.createGroup(j) }
    }
    this.selectControl({
      userFormId: this.userFormId,
      select: { container: [this.containerId], selected: updateSeelctedControl }
    })
  }

  /**
  * @description To delete controls in respective container present in respective userform
  * @function pasteControl
  */
  clickDelete () {
    this.closeMenu()
    const selControl = []
    const selected = this.selectedControls[this.userFormId].selected
    for (const control of selected) {
      if (!control.startsWith('ID_USERFORM')) {
        if (control.startsWith('group')) {
          for (const key in this.userformData[this.userFormId]) {
            if (this.userformData[this.userFormId][key].properties.GroupID === control) {
              selControl.push(key)
            }
          }
        } else {
          selControl.push(control)
        }
      }
    }
    console.log(selControl)

    for (let i = 0; i < selControl.length; i++) {
      this.deleteControl({
        userFormId: this.userFormId,
        parentId: this.selectedControls[this.userFormId].container[0],
        targetId: selControl[i]
      })
    }
    this.selectControl({
      userFormId: this.userFormId,
      select: { container: [this.containerId],
        selected: [this.containerId] }
    })
  }
  updateAction (event: KeyboardEvent) {
    let controlActionName = ''
    if (event.ctrlKey && event.code === 'KeyA') {
      controlActionName = 'ID_SELECTALL'
    } else if (event.ctrlKey && event.code === 'KeyC') {
      controlActionName = 'ID_COPY'
    } else if (event.keyCode === 46) {
      controlActionName = 'ID_DELETE'
    } else if (event.ctrlKey && event.code === 'KeyV') {
      controlActionName = 'ID_PASTE'
    } else if (event.keyCode && event.code === 'KeyX') {
      controlActionName = 'ID_CUT'
    }
    this.controlAction(controlActionName)
  }
}
</script>

<style scoped>
.outercontext-div {
  border: 0.3px solid black;
  box-shadow: 2px 2px lightgray;
  width: 150px;
  height: auto;
  font-size: 13px;
  position: fixed;
  z-index: 1000;
}
.wrapper-context {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  height: 100%;
}
.wrapper1-context {
  display: grid;
  grid-template-columns: 10% 90%;
  border: 0.3px solid white;
  background: white;
  height: 24px;
  padding-top: 5px;
  outline: none;
}
.wrapper1-context:hover {
  background-color: rgb(155, 215, 255);
  border: 0.3px solid rgb(0, 153, 255);
}
.wrapper21 {
  display: grid;
  grid-template-columns: 10% 85% 5%;
}
.triangle-right {
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-left: 5px solid black;
  border-bottom: 5px solid transparent;
  padding-top: 2px;
}
.iset-context {
  text-align: left;
  padding-left: 15px;
  font-size: 12px;
}
.set-context {
  text-align: left;
  padding-left: 15px;
  font-size: 12px;
}
hr {
  margin: 0px;
}
ul {
  list-style-type: none;
  margin-block-start: 0em;
  margin-block-end: 0em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
}

/* testing submenu */

.top-level-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.top-level-menu > li {
  position: absolute;
  float: left;
  height: 30px;
  width: 143px;
}

.top-level-menu li:hover > ul {
  /* On hover, display the next level's menu */
  display: inline;
}

/* Menu Link Styles */

.top-level-menu a /* Apply to all links inside the multi-level menu */ {
  font-size: 12px;
  color: black;
  text-decoration: none;
  padding: 0 0 0 10px;
  padding-left: 15px;

  /* Make the link cover the entire list item-container */
  display: block;
}
.top-level-menu a:hover {
  color: black;
}
.third-level-menu {
  position: absolute;
  top: 0;
  right: -100px;
  width: 110px;
  list-style: none;
  padding: 0;
  margin: 0;
  display: none;
  border: 1px solid black;
  background-color: white;
}

.third-level-menu > li {
  height: 20px;
  padding-top: 5px;
  /* margin: 1px; */
}
.third-level-menu > li:hover {
  background-color: rgb(155, 215, 255);
  border: 0.2px solid rgb(0, 153, 255);
}
.top-level-menu1 {
  list-style: none;
  padding: 0;
  margin: 0;
}

.top-level-menu1 > li {
  position: absolute;
  float: left;
  height: 30px;
  width: 143px;
}

.top-level-menu1 li:hover > ul {
  /* On hover, display the next level's menu */
  display: inline;
}

/* Menu Link Styles */

.top-level-menu1 a /* Apply to all links inside the multi-level menu */ {
  font-size: 12px;
  color: black;
  text-decoration: none;
  padding: 0 0 0 10px;
  padding-left: 15px;

  /* Make the link cover the entire list item-container */
  display: block;
}
.top-level-menu1 a:hover {
  color: black;
}
.third {
  padding-left: 5px;
}
.third > a {
  padding-left: 10px;
}
.icons {
  margin-left: 3px;
}
</style>
