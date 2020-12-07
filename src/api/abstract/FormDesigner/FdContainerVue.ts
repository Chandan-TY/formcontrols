import { Prop, Vue } from 'vue-property-decorator'
import { controlProperties } from '@/FormDesigner/controls-properties'
import FdControlVue from './FdControlVue'
import { Action, State } from 'vuex-class'
import { IaddControl, IchangeToolBoxSelect, IdeleteControl, IselectControl, IupdateControl, IupdateControlExtraData, IupdateCopyControlList, IupdateGroup } from '@/storeModules/fd/actions'

import { controlContextMenu } from '@/FormDesigner/models/controlContextMenuData'
import { userformContextMenu } from '@/FormDesigner/models/userformContextMenuData'
import { ControlPropertyData } from '@/FormDesigner/models/ControlsTableProperties/ControlPropertyData.ts'

export default abstract class FdContainerVue extends FdControlVue {
    @Prop({ required: true, type: String }) public readonly userFormId! : string
    @Prop({ required: true, type: String }) public readonly containerId! : string
    @State((state: rootState) => state.fd.toolBoxSelect) toolBoxSelect!: fdState['toolBoxSelect'];
    @State((state) => state.fd.copyControlList) copyControl!: copyControl;
    @State((state) => state.fd.userformData) userformData!: userformData;
    @State((state) => state.fd.selectedControls) selectedControls!: fdState['selectedControls'];
    @State(state => state.fd.groupedControls) groupedControls!: fdState['groupedControls']
    @State((state) => state.fd.copiedControl) copiedControl!: userformData;

    @Action('fd/changeToolBoxSelect') changeToolBoxSelect!: (payload: IchangeToolBoxSelect) => void;
    @Action('fd/selectControl') selectControl!: (payload: IselectControl) => void;
    @Action('fd/addControl') addControl!: (payload: IaddControl) => void;
    @Action('fd/updateCopyControlList') updateCopyControlList!: (payload: IupdateCopyControlList) => void
    @Action('fd/deleteControl') deleteControl!: (payload: IdeleteControl) => void
    @Action('fd/updateGroup') updateGroup!: (payload: IupdateGroup) => void
    @Action('fd/updateControl') updateControl!: (payload: IupdateControl) => void;
    @Action('fd/updateControlExtraData') updateControlExtraData!: (payload: IupdateControlExtraData) => void;

    // containerId: string = this.controlId
    contextMenuType: boolean = false;
    viewMenu?: boolean = false
    top: string= '0px'
    left: string ='0px'

    controlContextMenu: Array<IcontextMenu> = controlContextMenu;
    userformContextMenu: Array<IcontextMenu> = userformContextMenu;
    selectedControlArray: Array<string> = [];
    selectedAreaStyle: ISelectedArea | undefined
    /**
   * @description  close the contextMenu
   * @function closeMenu
   * @param this  - container Vue Component
   * @event click
   */
    closeMenu (this: this) {
      this.viewMenu = false
    }

    get selConatiner () {
      return this.selectedControls[this.userFormId].container
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
        const controlId = selectTarget.startsWith('group') ? getControlId(selectTarget) : selectTarget
        if (controlId) {
          controlContainer(controlId)
        }
      }
      return containerList || [this.userFormId]
    }

    generateControlId (controlName: string) {
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
      let controlObj = controlName.startsWith('Page') ? controlPropData.data['Page'] : controlPropData.data[controlName]
      const item = JSON.parse(JSON.stringify(controlObj!))
      lastControlId += 1
      item.properties.ID = `ID_${controlName}${lastControlId}`
      item.properties.Caption = `${controlName}${lastControlId}`
      item.properties.Name = `${controlName}${lastControlId}`
      return item
    }

    updateNewControl (parentId: string, newControlId: string, newControlData: controlData) {
      this.addControl({
        userFormId: this.userFormId,
        controlId!: parentId,
        addId: newControlId,
        item: newControlData
      })
    }
    updateZIndex (id: string) {
      const container = this.getContainerList(id)[0]
      const userData = this.userformData[this.userFormId]
      this.updateControlExtraData({
        userFormId: this.userFormId,
        controlId: id,
        propertyName: 'zIndex',
        value: userData[container].controls.length
      })
    }
    updateTabIndex (id: string) {
      const container = this.getContainerList(id)[0]
      const userData = this.userformData[this.userFormId]
      this.updateControl({
        userFormId: this.userFormId,
        controlId: id,
        propertyName: 'TabIndex',
        value: userData[container].controls.length - 1
      })
    }
    /**
   * @description  add the control to its respective  container
   * @function addControlObj
   * @param event  - it is of type MouseEvent
   * @param userFormId - selected Userform
   * @event click
   */
    addControlObj (e: MouseEvent, pageId: string) {
      if (this.toolBoxSelect !== 'Select' && this.toolBoxSelect !== '') {
        const type = this.userformData[this.userFormId][this.controlId].type
        const item = this.generateControlId(this.toolBoxSelect)
        const sw = parseInt(this.selectedAreaStyle!.width!)
        const sh = parseInt(this.selectedAreaStyle!.height)

        item.properties.Left = sw! === 0 ? e.offsetX : parseInt(this.selectedAreaStyle!.left)
        item.properties.Top = sw! === 0 ? e.offsetY : parseInt(this.selectedAreaStyle!.top)
        item.properties.Width = sw! === 0 ? item.properties.Width : sw
        item.properties.Height = sw! === 0 ? item.properties.Height : sh
        const controls = item.controls
        item.controls = item.type === 'MultiPage' ? [] : item.controls
        const newControlId = type === 'MultiPage' ? pageId : this.controlId
        this.updateNewControl(newControlId, item.properties.ID, item)
        this.updateTabIndex(item.properties.ID)
        this.updateZIndex(item.properties.ID)

        if (item.type === 'MultiPage' && controls.length > 0) {
          for (let i = 0; i < controls.length; i++) {
            const parentId = item.properties.ID.split('MultiPage').pop()
            const controlName = `Page${parentId}_`
            const pageObj = this.generateControlId(controlName)
            pageObj.properties.Caption = `Page${i + 1}`
            pageObj.properties.Name = `Page${i + 1}`
            pageObj.properties.Index = i
            this.updateNewControl(item.properties.ID, pageObj.properties.ID, pageObj)
          }
        }
        this.selectControl({
          userFormId: this.userFormId,
          select: {
            container: this.getContainerList(item.properties.ID),
            selected: [item.properties.ID]
          }
        })
      }
      this.changeToolBoxSelect('Select')
    }

    /**
   * @description  deactivate the all control present in container
   * @function deActiveControl
   * @param this  - VueComponent of container
   * @event mousedown
   */
    deActiveControl (this: this) {
      const controlType: string = this.userformData[this.userFormId][this.controlId].type
      this.selectControl({
        userFormId: this.userFormId,
        select: { container: controlType === 'Userform' ? [this.controlId] : this.getContainerList(this.controlId), selected: [this.controlId] }
      })
    }

    /**
   * @description  open the contextMenu
   * @function openMenu
   * @param  e -> it is of type MouseEvent
   * @param  parentID -> ContainerId
   * @param  parentID -> controlId
   * @event contextmenu
   */
    openMenu (e: MouseEvent, parentID: string, controlID: string) {
      e.preventDefault()
      if (!this.selectedControls[this.userFormId].selected.includes(controlID)) {
        let groupId = controlID
        if (
          this.userformData[this.userFormId][controlID].properties.GroupID !== ''
        ) {
          groupId = this.userformData[this.userFormId][controlID].properties
            .GroupID!
        }
        if (!this.selectedControls[this.userFormId].selected.includes(groupId)) {
          this.selectControl({
            userFormId: this.userFormId,
            select: { container: this.getContainerList(groupId), selected: [groupId] }
          })
        }
      }
      const controlType = this.userformData[this.userFormId][controlID].type
      const containerType = this.userformData[this.userFormId][this.containerId].type
      if (
        controlType === 'Userform' ||
        controlType === 'Frame' ||
        controlType === 'MultiPage'
      ) {
        this.contextMenuType = true
      } else {
        this.contextMenuType = false
      }
      const controlLeft: number | undefined = this.userformData[this.userFormId][controlID].properties.Left
      const controlTop: number | undefined = this.userformData[this.userFormId][controlID].properties.Top
      this.top = controlType === 'Frame' || controlType === 'MultiPage' ? `${e.offsetY}px` : (containerType === 'Frame' || containerType === 'MultiPage') ? `${e.offsetY + controlTop!}px` : `${e.offsetY + controlTop! + 30}px`
      this.left = controlType === 'Frame' || controlType === 'MultiPage' ? `${e.offsetX}px` : `${e.offsetX + controlLeft!}px`
      this.viewMenu = true
      const controlLength = this.userformData[this.userFormId][parentID].controls
        .length
      const contextMenuData = this.contextMenuType
        ? this.userformContextMenu
        : this.controlContextMenu
      for (const val of contextMenuData) {
        if (val.id === 'ID_SELECTALL') {
          val.disabled = controlLength === 0
        }
        if (val.id === 'ID_DELETE' && this.contextMenuType) {
          val.disabled = !(this.selectedControls[this.userFormId].selected.length === 1 &&
           this.userformData[this.userFormId][controlID].type === 'Frame' &&
           controlID === this.selectedControls[this.userFormId].selected[0])
        }
        if (val.id === 'ID_PASTE') {
          val.disabled = Object.keys(this.copiedControl[this.userFormId]).length === 1
        }
        if (val.id === 'ID_GROUP' || val.id === 'ID_UNGROUP') {
          const selected = this.selectedControls[this.userFormId].selected
          let groupId: boolean = false
          for (const key of selected) {
            if (!key.startsWith('group') && !key.startsWith('ID_USERFORM')) {
              groupId =
              this.userformData[this.userFormId][key].properties.GroupID === ''
            }
          }
          const selectedGroupArray = selected.filter(
            (val: string) => val.startsWith('group') && val
          )
          if (!groupId && selectedGroupArray.length <= 1) {
            val.text = '<u>U</u>ngroup'
            val.id = 'ID_UNGROUP'
          } else {
            val.text = '<u>G</u>roup'
            val.id = 'ID_GROUP'
            val.disabled =
            this.selectedControls[this.userFormId].selected.length <= 1
          }
        }
        if (val.id === 'ID_ALIGN') {
          for (let index = 0; index < val.values.length; index++) {
            val.values[index].disabled = this.selectedControls[this.userFormId].selected.length <= 1
          }
        }
      }
    }

    /**
   * @description to drag and select  the contol in container
   * @function calSelectedAreaStyle
   * @param event  - it is of type MouseEvent
   * @event mouseup
   */
    calSelectedAreaStyle (event: MouseEvent, pageData: controlData) {
      const type = this.userformData[this.userFormId][this.controlId].type
      const controlData: controlData = type === 'MultiPage' ? pageData : this.data
      const left = parseInt(this.selectedAreaStyle!.left)
      const right =
    parseInt(this.selectedAreaStyle!.left) +
    parseInt(this.selectedAreaStyle!.width)
      const top = parseInt(this.selectedAreaStyle!.top)
      const bottom =
    parseInt(this.selectedAreaStyle!.top) +
    parseInt(this.selectedAreaStyle!.height)
      const leftArray: Array<number> = []
      if (left !== right || top !== bottom) {
        for (let i in controlData.controls) {
          const key: string = controlData.controls[i]
          const controlProp: controlProperties = this.userformData[this.userFormId][key].properties
          if (
            left <= controlProp!.Left! + controlProp!.Width! &&
      right >= controlProp!.Left! &&
      top <= controlProp!.Top! + controlProp!.Height! &&
      bottom >= controlProp!.Top!
          ) {
            this.selectedControlArray.push(key)
          }
        }
        const selectedGroup = []
        for (const val of this.selectedControlArray) {
          const controlGroupId: string = this.userformData[this.userFormId][val]
            .properties.GroupID!
          if (controlGroupId && controlGroupId !== '') {
            !selectedGroup.includes(controlGroupId)! &&
        selectedGroup.push(controlGroupId)
          } else {
            selectedGroup.push(val)
          }
        }
        if (this.selectedControlArray.length !== 0) {
          this.selectControl({
            userFormId: this.userFormId,
            select: {
              container: this.getContainerList(selectedGroup[0]),
              selected: [...selectedGroup]
            }
          })
        }
      }
    }
}
