<template>
  <div>
    <div class="outercontext-div">
      <div class="wrapper-context" v-for="(value, i) in values" :key="i">
        <button
          class="wrapper1-context"
          v-if="value.values.length === 0"
          :style="{
            border: value.text === 'none' ? '0.3px solid white' : '',
            background: value.text === 'none' ? 'white' : '',
            height: value.text === 'none' ? '4px' : '',
            'padding-top': value.text === 'none' ? '0px' : '',
            outline: value.text === 'none' ? 'none' : '',
          }"
          @mousedown.stop="
            value.disabled === false ? controlAction(value.id) : ''
          "
        >
          <div>
            <FDSVGImage v-if="value.icon" :name="value.icon" />
          </div>
          <span v-if="value.text === 'none'">
            <hr />
          </span>
          <span
            v-else
            class="set-context"
            v-html="value.text"
            :style="{ opacity: value.disabled ? 0.5 : 1 }"
            >{{ value.text }}
          </span>
        </button>
        <button class="wrapper1-context wrapper21" v-else>
          <div></div>
          <ul class="set-context top-level-menu">
            <li>
              <a href="#" v-html="value.text">{{ value.text }}</a>
              <ul class="third-level-menu">
                <li
                  class="wrapper1-context"
                  v-for="(subVal, i) in value.values"
                  :key="i"
                  :style="{
                    border: subVal.text === 'none' ? '0.3px solid white' : '',
                    background: subVal.text === 'none' ? 'white' : '',
                    height: subVal.text === 'none' ? '4px' : '',
                    'padding-top': subVal.text === 'none' ? '0px' : '',
                    outline: subVal.text === 'none' ? 'none' : '',
                  }"
                  @mousedown.stop="
                    value.disabled === false
                      ? controlAction(value.id, subVal.id)
                      : ''
                  "
                >
                  <div>
                    <FDSVGImage v-if="subVal.icon" :name="subVal.icon" />
                  </div>
                  <a v-if="subVal.text === 'none'">
                    <hr />
                  </a>
                  <a
                    v-else
                    href="#"
                    v-html="subVal.text"
                    :style="{ opacity: subVal.disabled ? 0.5 : 1 }"
                    >{{ subVal.text }}</a
                  >
                </li>
              </ul>
            </li>
          </ul>
          <div class="triangle-right"></div>
        </button>
      </div>
    </div>
    <div></div>
    <div></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import FDSVGImage from '@/FormDesigner/components/atoms/FDSVGImage/index.vue'
import { ControlPropertyData } from '@/FormDesigner/models/ControlsTableProperties/ControlPropertyData.ts'

import { Action, State } from 'vuex-class'
import {
  IaddChildControls,
  IaddControl,
  IdeleteControl,
  IselectControl,
  IsetChildControls,
  IupdateControl,
  IupdateControlExtraData,
  IupdateCopyControlList,
  IupdateGroup
} from '@/storeModules/fd/actions'
import { EventBus } from '@/FormDesigner/event-bus'

@Component({
  name: 'ContextMenu',
  components: {
    FDSVGImage
  }
})
export default class ContextMenu extends Vue {
  @Prop() values: Array<IControlContextMenu>;
  @Prop() userFormId: string;
  @Prop() containerId: string;
  @Prop() keyEventName: string;
  @Prop() controlId: string;
  @Prop() selectedTab: number;
  @Prop() data: controlData;

  @State((state) => state.fd.selectedControls)
  selectedControls!: fdState['selectedControls'];
  @State((state: rootState) => state.fd.copyControlList)
  copyControlList!: fdState['copyControlList'];
  @State((state) => state.fd.userformData) userformData!: userformData;
  @State((state) => state.fd.copiedControl) copiedControl!: userformData;
  @State((state) => state.fd.groupedControls)
  groupedControls!: fdState['groupedControls'];

  @Action('fd/deleteControl') deleteControl!: (payload: IdeleteControl) => void;
  @Action('fd/updateCopyControlList') updateCopyControlList!: (
    payload: IupdateCopyControlList
  ) => void;
  @Action('fd/addControl') addControl!: (payload: IaddControl) => void;
  @Action('fd/addCopiedControl') addCopiedControl!: (
    payload: IaddControl
  ) => void;
  @Action('fd/selectControl') selectControl!: (payload: IselectControl) => void;
  @Action('fd/updateGroup') updateGroup!: (payload: IupdateGroup) => void;
  @Action('fd/updateControlExtraData') updateControlExtraData!: (
    payload: IupdateControlExtraData
  ) => void;
  @Action('fd/updateControl') updateControl!: (payload: IupdateControl) => void;
  @Action('fd/setChildControls') setChildControls!: (
    payload: IsetChildControls
  ) => void;
  @Action('fd/addChildControls') addChildControls!: (
    payload: IaddChildControls
  ) => void;
  controlAction (controlActionName: string, subVal: string) {
    if (controlActionName === 'ID_COPY') {
      this.copyControl('copy')
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
      this.deleteCurrentPage()
    } else if (controlActionName === 'ID_RENAME') {
      const selectedPageID = this.selectedControls[this.userFormId].selected[0]
      EventBus.$emit(
        'renamePage',
        this.userFormId,
        selectedPageID,
        this.selectedTab,
        this.userformData[this.userFormId][selectedPageID].type
      )
    } else if (controlActionName === 'ID_MOVE') {
      const type = this.userformData[this.userFormId][this.controlId].type
      if (type === 'MultiPage') {
        EventBus.$emit('userFormTabOrder', this.userFormId, this.controlId, type)
      } else {
        EventBus.$emit('tabStripTabOrder', this.userFormId, this.containerId)
      }
    } else if (controlActionName === 'ID_TABORDER') {
      EventBus.$emit('userFormTabOrder', this.userFormId, this.containerId, '')
    } else if (
      controlActionName === 'ID_ALIGN' ||
      controlActionName === 'ID_MAKESAMESIZE'
    ) {
      this.controlAlignMent(subVal)
    }
    this.closeMenu()
  }
  @Emit('closeMenu')
  closeMenu () {
    return 0
  }

  /**
   * @description  To get the selected ContainerList
   * @function getContainerList
   * @param selectTarget  - selcted control or group
   */
  getContainerList (selectTarget: string) {
    const containerList: string[] = []
    const controlContainer = (selectTarget: string) => {
      for (let i in this.userformData[this.userFormId]) {
        const controlData = this.userformData[this.userFormId][i]
        if (
          controlData.controls.length > 0 &&
          controlData.controls.includes(selectTarget)
        ) {
          containerList.push(i)
          controlContainer(i)
        }
      }
    }
    const getControlId = (selectTarget: string) => {
      const userData = this.userformData[this.userFormId]
      for (let i in userData) {
        const controlData = userData[i]
        if (controlData.properties.GroupID === selectTarget) {
          return i
        }
      }
    }
    if (selectTarget) {
      const controlId = selectTarget.startsWith('group')
        ? getControlId(selectTarget)
        : selectTarget
      if (controlId) {
        controlContainer(controlId)
      }
    }
    return containerList
  }

  addNewPage () {
    const type = this.userformData[this.userFormId][this.controlId].type
    if (type === 'TabStrip') {
      const tabControlData = JSON.parse(
        JSON.stringify(this.userformData[this.userFormId][this.controlId])
      ).extraDatas.Tabs
      let prevTabId = -1
      const initialTabData: tabsItems = {
        Name: '',
        Caption: '',
        ToolTip: '',
        Accelerator: ''
      }
      if (tabControlData.length > 0) {
        for (let i = 0; i < tabControlData.length; i++) {
          const id = tabControlData[i].Name.split('Tab').pop() || '-1'
          const parseId = parseInt(id, 10)
          if (!isNaN(parseId) && prevTabId < parseId) {
            prevTabId = parseId
          }
        }
        prevTabId += 1
        initialTabData.Name = `Tab${prevTabId}`
        initialTabData.Caption = `Tab${prevTabId}`
      } else {
        initialTabData.Name = `Tab${1}`
        initialTabData.Caption = `Tab${1}`
      }
      tabControlData.push(initialTabData)
      this.updateControlExtraData({
        userFormId: this.userFormId,
        controlId: this.controlId,
        propertyName: 'Tabs',
        value: tabControlData
      })
    } else if (type === 'MultiPage') {
      const parentId = this.controlId.split('MultiPage').pop()
      const controlName = `Page${parentId}_`

      let lastControlId = 0
      const userformControlIds = Object.keys(this.userformData[this.userFormId])
      for (let i = 0; i < userformControlIds.length; i++) {
        if (userformControlIds[i].indexOf(controlName) !== -1) {
          const IdNum =
          userformControlIds[i].split(controlName).pop() || '-1'
          const pasreId = parseInt(IdNum, 10)
          if (!isNaN(pasreId) && lastControlId < pasreId) {
            lastControlId = pasreId
          }
        }
      }
      const controlPropData = new ControlPropertyData()
      let controlObj = controlPropData.data['Page']
      const item = JSON.parse(JSON.stringify(controlObj!))
      lastControlId += 1
      item.properties.ID = `ID_${controlName}${lastControlId}`
      item.properties.Caption = `Page${lastControlId}`
      item.properties.Name = `Page${lastControlId}`
      this.addControl({
        userFormId: this.userFormId,
        controlId: this.controlId,
        addId: item.properties.ID,
        item: item
      })
      this.selectControl({
        userFormId: this.userFormId,
        select: {
          container: this.getContainerList(item.properties.ID),
          selected: [item.properties.ID]
        }
      })
    }
  }
  updateTabIndex (id: string) {
    let newTabIndex = -1
    const containerControls = this.userformData[this.userFormId][id].controls
    for (const index in containerControls) {
      const cntrlData = this.userformData[this.userFormId][containerControls[index]]
      if ('TabIndex' in cntrlData.properties) {
        newTabIndex = newTabIndex + 1
        this.updateControl({
          userFormId: this.userFormId,
          controlId: containerControls[index],
          propertyName: 'TabIndex',
          value: newTabIndex
        })
      }
    }
  }
  deleteCurrentPage () {
    const type = this.userformData[this.userFormId][this.controlId].type
    if (type === 'TabStrip') {
      const tabControlData = JSON.parse(
        JSON.stringify(this.userformData[this.userFormId][this.controlId])
      ).extraDatas.Tabs
      if (tabControlData && tabControlData.length > 0) {
        tabControlData.splice(this.selectedTab, 1)
        this.updateControlExtraData({
          userFormId: this.userFormId,
          controlId: this.controlId,
          propertyName: 'Tabs',
          value: tabControlData
        })
      }
    } else if (type === 'MultiPage') {
      const controls = this.userformData[this.userFormId][this.controlId].controls
      if (controls.length > 0) {
        this.deleteControl({
          userFormId: this.userFormId,
          parentId: this.selectedControls[this.userFormId].container[0],
          targetId: this.selectedControls[this.userFormId].selected[0]
        })
      }
    }
  }
  updateControlProperty (
    propertyName: keyof controlProperties,
    propertyValue: number | string,
    controlId: string
  ) {
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
    const selected = isGroup
      ? selControl
      : this.userformData[this.userFormId][selControl].properties.GroupID!

    const controlList = []
    for (const key in this.userformData[this.userFormId]) {
      const type = this.userformData[this.userFormId][key].type
      if (
        type !== 'Userform' &&
        this.userformData[this.userFormId][key].properties.GroupID === selected
      ) {
        controlList.push(key)
      }
    }
    const groupArray = [...this.groupedControls[this.userFormId]!.groupArray!]
    this.updateControlGroupID(selected, '')
    const index = this.groupedControls[this.userFormId]!.groupArray!.findIndex(
      (val) => val === selected
    )
    groupArray.splice(index, 1)
    this.updateGroup({ userFormId: this.userFormId, groupArray: groupArray })
    this.selectControl({
      userFormId: this.userFormId,
      select: {
        container: isGroup
          ? this.getContainerList(controlList[0])
          : this.getContainerList(selControl[0]),
        selected: isGroup ? controlList : [selControl]
      }
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
        const IdNum = i.split('group').pop() || '-1'
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
        const controlGrpId = this.userformData[this.userFormId][val].properties
          .GroupID
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

    const selectedGroupArray = selected.filter(
      (val: string) => val.startsWith('group') && val
    )
    updateGroupId = selectedGroupArray[0]
    if (selectedGroupArray.length >= 2) {
      const groupArray = [
        ...this.groupedControls[this.userFormId]!.groupArray!
      ]
      for (let i = 0; i < groupArray.length; i++) {
        for (let j = 0; j < selectedGroupArray.length; j++) {
          if (selectedGroupArray[j] === groupArray[i]) {
            this.updateControlGroupID(groupArray[i], selectedGroupArray[0])
            groupArray.splice(i, 1)
          }
        }
      }
      this.updateGroup({
        userFormId: this.userFormId,
        groupArray: [...groupArray, selectedGroupArray[0]]
      })
      updateGroupId = selectedGroupArray[0]!
    } else if (selectedGroupArray.length === 0) {
      updateGroupId = this.createGroupId()
      const groupArray = [
        ...this.groupedControls[this.userFormId]!.groupArray!,
        updateGroupId
      ]
      this.updateGroup({ userFormId: this.userFormId, groupArray: groupArray })
    }

    for (let val of selected) {
      if (!val.startsWith('group')) {
        this.updateControlProperty('GroupID', updateGroupId, val)
      }
    }
    this.selectControl({
      userFormId: this.userFormId,
      select: {
        container: this.getContainerList(updateGroupId),
        selected: [updateGroupId]
      }
    })
    this.createGroup(updateGroupId)
  }

  /**
   * @description To select all the controls in respective container present in respective userform
   * @function selectAll
   */
  selectAll () {
    const controlObjectList = [
      ...this.userformData[this.userFormId][this.containerId].controls
    ]
    const selecedGroup: string[] = []
    for (const val of controlObjectList) {
      const controlGroupId: string = this.userformData[this.userFormId][val]
        .properties.GroupID!
      if (controlGroupId && controlGroupId !== '') {
        !selecedGroup.includes(controlGroupId)! &&
          selecedGroup.push(controlGroupId)
      } else {
        selecedGroup.push(val)
      }
    }

    if (controlObjectList.length !== 0) {
      this.selectControl({
        userFormId: this.userFormId,
        select: {
          container: this.getContainerList(selecedGroup[0]),
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
    this.copyControl('cut')
    this.clickDelete()
  }

  /**
   * @description To update the copied controls in respective container present in respective userform
   * @function copyControl
   */
  copyControl (type: string) {
    const selContainer = this.selectedControls[this.userFormId].container[0]
    const selSelected = this.selectedControls[this.userFormId].selected
    const userFormData = this.userformData[this.userFormId]

    this.updateCopyControlList({
      userFormId: this.userFormId,
      parentId: selContainer,
      targetId: selSelected,
      type: type
    })

    const recCopyControl = (daTarget: string) => {
      const daTargetControls = userFormData[daTarget].controls
      if (daTargetControls.length > 0) {
        for (let i = 0, limit = daTargetControls.length; i < limit; i++) {
          const controlObject = JSON.parse(
            JSON.stringify(userFormData[daTargetControls[i]])
          )
          const ctrlObj = { ...controlObject, controls: [] }
          this.addCopiedControl({
            userFormId: this.userFormId,
            controlId: daTarget,
            addId: daTargetControls[i],
            item: ctrlObj
          })
          recCopyControl(daTargetControls[i])
        }
      }
    }

    for (const key of selSelected) {
      if (!key.startsWith('group')) {
        const controlObject = JSON.parse(JSON.stringify(userFormData[key]))
        const ctrlObj = { ...controlObject, controls: [] }
        this.addCopiedControl({
          userFormId: this.userFormId,
          controlId: this.userFormId,
          addId: key,
          item: ctrlObj
        })
        recCopyControl(key)
      } else {
        for (let ctrlId in userFormData) {
          const controlProp = userFormData[ctrlId].properties.GroupID
          if (controlProp) {
            if (controlProp === key) {
              const controlObject = JSON.parse(
                JSON.stringify(userFormData[ctrlId])
              )
              const ctrlObj = { ...controlObject, controls: [] }
              this.addCopiedControl({
                userFormId: this.userFormId,
                controlId: this.userFormId,
                addId: ctrlId,
                item: ctrlObj
              })
              recCopyControl(ctrlId)
            }
          }
        }
      }
    }
  }

  /**
   * @description To paste controls in respective container present in respective userform
   * @function pasteControl
   */
  pasteControl () {
    if (this.copyControlList.type === 'copy') {
      const selContainer = this.copyControlList.parentId
      const selSelected = this.copyControlList.targetId
      const userFormData = this.userformData[this.userFormId]
      const presentGroupId: string[] = []
      const newGroupId: string[] = []
      const oldControlId: string[] = []
      const newControlId: string[] = []

      for (const key in this.copiedControl[this.userFormId]) {
        const controlProp = this.copiedControl[this.userFormId][key].properties
          .GroupID
        if (controlProp && !presentGroupId.includes(controlProp)) {
          presentGroupId.push(controlProp)
        }
      }
      for (let j in presentGroupId) {
        const newId = this.createGroupId()
        newGroupId.push(newId)
      }

      const recCopyControl = (daTarget: string) => {
        const daTargetControls = userFormData[daTarget].controls
        if (daTargetControls.length > 0) {
          for (let i = 0, limit = daTargetControls.length; i < limit; i++) {
            const key = daTargetControls[i]
            let lastControlId = -1
            const selectedControlName: string | undefined = key
              .replace(/[0-9]/g, '')
              .split('_')
              .pop()
            const userformControlIds = Object.keys(userFormData)
            for (let i = 0; i < userformControlIds.length; i++) {
              if (userformControlIds[i].indexOf(selectedControlName!) !== -1) {
                const IdNum =
                  userformControlIds[i].split(selectedControlName!).pop() ||
                  '-1'
                const pasreId = parseInt(IdNum, 10)
                if (!isNaN(pasreId) && lastControlId < pasreId) {
                  lastControlId = pasreId
                }
              }
            }
            const controlObj = this.copiedControl[this.userFormId][key]
            lastControlId += 1
            const controlID:
              | string
              | undefined = `ID_${selectedControlName}${lastControlId}`
            let groupIdIndex = -1
            groupIdIndex = presentGroupId.findIndex(
              (val) => controlObj.properties.GroupID
            )
            const item: controlData = {
              ...controlObj,
              properties: {
                ...controlObj.properties,
                ID: controlID!,
                GroupID: groupIdIndex !== -1 ? newGroupId[groupIdIndex] : ''
              }
            }
            const removeControl = [
              ...this.userformData[this.userFormId][daTarget].controls
            ]
            const removeIndex = removeControl.findIndex((val) => val === key)
            removeControl.splice(removeIndex, 1)
            this.setChildControls({
              userFormId: this.userFormId,
              containerId: daTarget,
              targetControls: removeControl
            })
            this.addControl({
              userFormId: this.userFormId,
              controlId: daTarget,
              addId: controlID,
              item: item
            })
            this.updateTabIndex(daTarget)
            recCopyControl(controlID)
          }
        }
      }

      for (const key of selSelected) {
        if (!key.startsWith('group')) {
          oldControlId.push(key)
          let lastControlId = -1
          const selectedControlName: string | undefined = key
            .replace(/[0-9]/g, '')
            .split('_')
            .pop()
          const userformControlIds = Object.keys(userFormData)
          for (let i = 0; i < userformControlIds.length; i++) {
            if (userformControlIds[i].indexOf(selectedControlName!) !== -1) {
              const IdNum =
                userformControlIds[i].split(selectedControlName!).pop() || '-1'
              const pasreId = parseInt(IdNum, 10)
              if (!isNaN(pasreId) && lastControlId < pasreId) {
                lastControlId = pasreId
              }
            }
          }
          const controlObj = this.copiedControl[this.userFormId][key]
          lastControlId += 1
          const controlID:
            | string
            | undefined = `ID_${selectedControlName}${lastControlId}`
          newControlId.push(controlID)
          let groupIdIndex = -1
          groupIdIndex = presentGroupId.findIndex(
            (val) => controlObj.properties.GroupID
          )
          const item: controlData = {
            ...controlObj,
            properties: {
              ...controlObj.properties,
              ID: controlID!,
              Left: controlObj.properties.Left! + 10,
              Top: controlObj.properties.Top! + 10,
              GroupID: groupIdIndex !== -1 ? newGroupId[groupIdIndex] : ''
            }
          }
          this.addControl({
            userFormId: this.userFormId,
            controlId: this.containerId,
            addId: controlID,
            item: item
          })
          this.updateTabIndex(this.containerId)
          recCopyControl(controlID)
        } else {
          for (let ctrlId in this.copiedControl[this.userFormId]) {
            const controlProp = this.copiedControl[this.userFormId][ctrlId]
              .properties.GroupID
            if (controlProp) {
              if (controlProp === key) {
                let lastControlId = -1
                const selectedControlName: string | undefined = ctrlId
                  .replace(/[0-9]/g, '')
                  .split('_')
                  .pop()
                const userformControlIds = Object.keys(userFormData)
                for (let i = 0; i < userformControlIds.length; i++) {
                  if (
                    userformControlIds[i].indexOf(selectedControlName!) !== -1
                  ) {
                    const IdNum =
                      userformControlIds[i].split(selectedControlName!).pop() ||
                      '-1'
                    const pasreId = parseInt(IdNum, 10)
                    if (!isNaN(pasreId) && lastControlId < pasreId) {
                      lastControlId = pasreId
                    }
                  }
                }
                const controlObj = this.copiedControl[this.userFormId][ctrlId]
                lastControlId += 1
                const controlID:
                  | string
                  | undefined = `ID_${selectedControlName}${lastControlId}`
                let groupIdIndex = -1
                groupIdIndex = presentGroupId.findIndex(
                  (val) => controlObj.properties.GroupID
                )
                const item: controlData = {
                  ...controlObj,
                  properties: {
                    ...controlObj.properties,
                    ID: controlID!,
                    Left: controlObj.properties.Left! + 10,
                    Top: controlObj.properties.Top! + 10,
                    GroupID:
                      groupIdIndex !== -1 ? newGroupId[groupIdIndex] : ''
                  }
                }
                this.addControl({
                  userFormId: this.userFormId,
                  controlId: this.containerId,
                  addId: controlID,
                  item: item
                })
                this.updateTabIndex(this.containerId)
                recCopyControl(controlID)
              }
            }
          }
        }
      }
      for (let j in presentGroupId) {
        const newId = this.createGroupId()
        let groupArray: string[] = [
          ...this.groupedControls[this.userFormId]!.groupArray!,
          newId
        ]
        this.updateGroup({
          userFormId: this.userFormId,
          groupArray: groupArray!
        })
      }
      for (let j of newGroupId) {
        this.createGroup(j)
      }
      const newSelected: string[] = []
      for (const control of selSelected) {
        if (control.startsWith('group')) {
          const index = presentGroupId.findIndex((val) => val === control)
          newSelected.push(newGroupId[index])
        } else {
          const index = oldControlId.findIndex((val) => val === control)
          newSelected.push(newControlId[index])
        }
      }
      this.selectControl({
        userFormId: this.userFormId,
        select: {
          container: this.getContainerList(newSelected[0]),
          selected: newSelected
        }
      })
    } else if (this.copyControlList.type === 'cut') {
      const selContainer = this.copyControlList.parentId
      const selSelected = this.copyControlList.targetId
      if (this.containerId === selContainer) {
        const userFormData = this.copiedControl[this.userFormId]
        const recCopyControl = (daTarget: string) => {
          const daTargetControls = userFormData[daTarget].controls
          if (daTargetControls.length > 0) {
            for (let i = 0, limit = daTargetControls.length; i < limit; i++) {
              const key = daTargetControls[i]
              const controlObj = JSON.parse(
                JSON.stringify(this.copiedControl[this.userFormId][key])
              )
              const item: controlData = {
                ...controlObj
              }
              const removeControl = [
                ...this.userformData[this.userFormId][daTarget].controls
              ]
              const removeIndex = removeControl.findIndex((val) => val === key)
              removeControl.splice(removeIndex, 1)
              this.setChildControls({
                userFormId: this.userFormId,
                containerId: daTarget,
                targetControls: removeControl
              })
              this.addControl({
                userFormId: this.userFormId,
                controlId: daTarget,
                addId: key,
                item: item
              })
              this.updateTabIndex(this.containerId)
              recCopyControl(key)
            }
          }
        }
        for (const key of selSelected) {
          if (!key.startsWith('group')) {
            const controlObj = JSON.parse(
              JSON.stringify(this.copiedControl[this.userFormId][key])
            )
            const item: controlData = {
              ...controlObj
            }
            this.addControl({
              userFormId: this.userFormId,
              controlId: this.containerId,
              addId: key,
              item: item
            })
            this.updateTabIndex(this.containerId)
            recCopyControl(key)
          } else {
            for (let ctrlId in userFormData) {
              const controlProp = userFormData[ctrlId].properties.GroupID
              if (controlProp) {
                if (controlProp === key) {
                  const controlObj = JSON.parse(
                    JSON.stringify(this.copiedControl[this.userFormId][ctrlId])
                  )
                  const item: controlData = {
                    ...controlObj
                  }
                  this.addControl({
                    userFormId: this.userFormId,
                    controlId: this.containerId,
                    addId: ctrlId,
                    item: item
                  })
                  this.updateTabIndex(this.containerId)
                  recCopyControl(ctrlId)
                }
              }
            }
          }
        }
        this.selectControl({
          userFormId: this.userFormId,
          select: {
            container: this.getContainerList(selSelected[0]),
            selected: selSelected
          }
        })
      } else {
        this.updateCopyControlList({
          userFormId: this.userFormId,
          parentId: this.containerId,
          targetId: selSelected,
          type: 'copy'
        })
        this.pasteControl()
      }
    }
  }

  /**
   * @description To delete controls in respective container present in respective userform
   * @function clickDelete
   */
  clickDelete () {
    const selControl = []
    const selected = this.selectedControls[this.userFormId].selected
    for (const control of selected) {
      if (!control.startsWith('ID_USERFORM')) {
        if (control.startsWith('group')) {
          for (const key in this.userformData[this.userFormId]) {
            if (
              this.userformData[this.userFormId][key].properties.GroupID ===
              control
            ) {
              selControl.push(key)
            }
          }
        } else {
          selControl.push(control)
        }
      }
    }
    for (let i = 0; i < selControl.length; i++) {
      this.deleteControl({
        userFormId: this.userFormId,
        parentId: this.selectedControls[this.userFormId].container[0],
        targetId: selControl[i]
      })
    }
    this.updateTabIndex(this.selectedControls[this.userFormId].container[0])
    this.selectControl({
      userFormId: this.userFormId,
      select: {
        container: this.getContainerList(
          this.selectedControls[this.userFormId].container[0]
        ),
        selected: [this.selectedControls[this.userFormId].container[0]]
      }
    })
  }
  updateAction (event: KeyboardEvent) {
    let controlActionName = ''
    if (event.ctrlKey && event.code === 'KeyA') {
      controlActionName = 'ID_SELECTALL'
    } else if (event.ctrlKey && event.code === 'KeyC') {
      if (
        this.selectedControls[this.userFormId].selected[0] !== this.userFormId
      ) {
        controlActionName = 'ID_COPY'
      }
    } else if (event.keyCode === 46) {
      controlActionName = 'ID_DELETE'
    } else if (event.ctrlKey && event.code === 'KeyV') {
      controlActionName = 'ID_PASTE'
    } else if (event.keyCode && event.code === 'KeyX') {
      controlActionName = 'ID_CUT'
    }
    this.controlAction(controlActionName, '')
  }
  updatePropVal (propName: string, propValue: number) {
    const ctrlSel = this.selectedControls[this.userFormId].selected
    const usrFrmData = this.userformData[this.userFormId]
    for (let index = 1; index < ctrlSel.length; index++) {
      const curProp = usrFrmData[ctrlSel[index]].properties
      if (!ctrlSel[index].startsWith('group')) {
        if (propName === 'selRight') {
          const curRight = curProp.Width! + curProp.Left!
          const value = curProp.Left! + (propValue - curRight)
          this.updateControlProperty('Left', value, ctrlSel[index])
        } else if (propName === 'selBottom') {
          const curBottom = curProp.Height! + curProp.Top!
          const value = curProp.Top! + (propValue - curBottom)
          this.updateControlProperty('Top', value, ctrlSel[index])
        }
        if (propName === 'selCenter') {
          const curCenter = curProp.Width! / 2
          const value = propValue - curCenter
          this.updateControlProperty('Left', value, ctrlSel[index])
        }
        if (propName === 'selMiddle') {
          const curMiddle = curProp.Height! / 2
          const value = propValue - curMiddle
          this.updateControlProperty('Top', value, ctrlSel[index])
        } else {
          const propertyname: keyof controlProperties = propName as keyof controlProperties
          this.updateControlProperty(propertyname, propValue, ctrlSel[index])
        }
      }
    }
  }
  controlAlignMent (subVal: string) {
    const mainSel = this.selectedControls[this.userFormId].selected[0]
    const usrFrmData = this.userformData[this.userFormId]
    const ctrlProp = usrFrmData[mainSel].properties
    if (subVal === 'ID_ALIGNLEFT') {
      this.updatePropVal('Left', ctrlProp.Left!)
    } else if (subVal === 'ID_ALIGNTOP') {
      this.updatePropVal('Top', ctrlProp.Top!)
    } else if (subVal === 'ID_ALIGNRIGHT') {
      const selRight = ctrlProp.Width! + ctrlProp.Left!
      this.updatePropVal('selRight', selRight)
    } else if (subVal === 'ID_ALIGNBOTTOM') {
      const selBottom = ctrlProp.Height! + ctrlProp.Top!
      this.updatePropVal('selBottom', selBottom)
    } else if (subVal === 'ID_ALIGNCENTER') {
      const selCenter = ctrlProp.Left! + ctrlProp.Width! / 2
      this.updatePropVal('selCenter', selCenter)
    } else if (subVal === 'ID_ALIGNMIDDLE') {
      const selMiddle = ctrlProp.Top! + ctrlProp.Height! / 2
      this.updatePropVal('selMiddle', selMiddle)
    } else if (subVal === 'ID_WIDTH') {
      this.updatePropVal('Width', ctrlProp.Width!)
    } else if (subVal === 'ID_HEIGHT') {
      this.updatePropVal('Height', ctrlProp.Height!)
    } else if (subVal === 'ID_BOTH') {
      this.updatePropVal('Height', ctrlProp.Height!)
      this.updatePropVal('Width', ctrlProp.Width!)
    }
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
