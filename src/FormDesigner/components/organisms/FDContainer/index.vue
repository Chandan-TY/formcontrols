<template>
  <div @mouseup="onMouseUp">
    <div
      id="right-click-menu"
      :style="contextMenuStyle"
      ref="contextmenu"
      tabindex="0"
      @blur.stop="closeMenu"
    >
      <ContextMenu
        ref="refContextMenu"
        :userFormId="userFormId"
        :containerId="containerId"
        :controlId="controlId"
        :values="contextMenuType ? userformContextMenu : controlContextMenu"
        @createGroup="createGroup"
        @closeMenu="closeMenu"
      />
    </div>
    <drag-selector
      :class="[!isEditMode ? 'dragSelector' : '']"
      ref="dragSelector"
      :style="dragSelectorStyle"
      @mousedown.stop.self="handleMouseDown"
    >
      <GroupControl
        :containerId="containerId"
        :userFormId="userFormId"
        ref="groupRef"
        class="group"
        :controlRef="$refs"
        :currentSelectedGroup="filterSelected"
      />
      <div
        v-for="control in propControlData.controls"
        :key="control"
        class="resize"
      >
        <ResizeControl
          ref="resizeControl"
          :name="control"
          @openMenu="
            (e, parentID, controlID) => openContextMenu(e, parentID, controlID)
          "
          :controlId="control"
          :containerId="controlId"
          :userFormId="userFormId"
          :currentSelectedGroup.sync="currentSelectedGroup"
          @createGroup="createGroup"
          @dragControl="dragControl"
          @muldragControl="muldragControl"
        >
        </ResizeControl>
      </div>
    </drag-selector>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Ref, Watch } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import ResizeControl from '@/FormDesigner/components/organisms/FDResizeControl/index.vue'
import ContextMenu from '@/FormDesigner/components/atoms/FDContextMenu/index.vue'
import { controlContextMenu } from '@/FormDesigner/models/controlContextMenuData'
import { userformContextMenu } from '../../../models/userformContextMenuData'
import GroupControl from '@/FormDesigner/components/organisms/FDGroupControl/index.vue'
import {
  IsetChildControls,
  IaddChildControls,
  IselectControl,
  IupdateControl,
  IupdateGroup
} from '@/storeModules/fd/actions'
import { EventBus } from '../../../event-bus'
@Component({
  name: 'Container',
  components: {
    ContextMenu,
    GroupControl,
    ResizeControl
  }
})
export default class Container extends Vue {
  $el!: HTMLDivElement;
  currentSelectedGroup: string = '';

  @Prop({ required: true, type: String }) public controlId!: string;
  @Prop({ required: true, type: String }) userFormId!: string;
  @Prop({ required: true, type: String }) containerId!: string;
  @Prop() mouseCursorData: string;

  @State((state) => state.fd.selectedControls)
  selectedControls!: fdState['selectedControls'];
  @State((state) => state.fd.userformData) userformData!: userformData;
  @State((state) => state.fd.groupedControls)
  groupedControls!: fdState['groupedControls'];

  @Action('fd/updateGroup') updateGroup!: (payload: IupdateGroup) => void;
  @Action('fd/updateControl') updateControl!: (payload: IupdateControl) => void;
  @Action('fd/setChildControls') setChildControls!: (
    payload: IsetChildControls
  ) => void;
  @Action('fd/addChildControls') addChildControls!: (
    payload: IaddChildControls
  ) => void;
  @Action('fd/selectControl') selectControl!: (payload: IselectControl) => void;

  @Prop({ required: true, type: Boolean }) viewMenu: boolean;
  @Prop({ required: true, type: Boolean }) contextMenuType: boolean;
  @Prop({ required: true, type: String }) top: string;
  @Prop({ required: true, type: String }) left: string;
  @Prop() isEditMode: boolean;

  @Ref('groupRef') readonly groupRef!: GroupControl;
  @Ref('refContextMenu') readonly refContextMenu!: ContextMenu;
  @Ref('dragSelector') readonly dragSelector: dragselector;
  @Ref('contextmenu') readonly contextmenu: HTMLDivElement;

  controlContextMenu: Array<IcontextMenu> = controlContextMenu;
  userformContextMenu: Array<IcontextMenu> = userformContextMenu;
  handler: string = '';
  grouphandler: string = '';

  onMouseUp (event: MouseEvent) {
    if (document.onmousemove && document.onmouseup && this.handler === 'drag') {
      const selectedContainer = [
        ...this.selectedControls[this.userFormId].container
      ][0]
      const selectedSelect = this.selectedControls[this.userFormId].selected
      if (!selectedSelect.find((id) => id === selectedContainer)) {
        const fromContainerControls = [
          ...this.userformData[this.userFormId][selectedContainer].controls
        ]
        for (let i = 0; i < selectedSelect.length; i++) {
          let tragetId: undefined | string = selectedSelect[i]
          let targetIndex = fromContainerControls.findIndex(
            (id) => id === tragetId
          )
          if (targetIndex !== -1) {
            fromContainerControls.splice(targetIndex, 1)
          }
        }

        let moveValueX = 0
        let moveValueY = 0
        let mainSelect = ''
        EventBus.$emit(
          'getMoveValue',
          (offsetX: number, offsetY: number, id: string) => {
            moveValueX = offsetX
            moveValueY = offsetY
            mainSelect = id
          }
        )
        if (mainSelect) {
          console.warn('getMoveValue', moveValueX, moveValueY, mainSelect)
          const currentControlsData = this.userformData[this.userFormId]
          const mainSelectData = currentControlsData[mainSelect]
          const mainSelectX = mainSelectData.properties.Left
          const mainSelectY = mainSelectData.properties.Top
          const containerX = event.clientX - this.$el.getClientRects()[0].x
          const containerY = event.clientY - this.$el.getClientRects()[0].y
          const mainSelectGroup: string = mainSelectData.properties.GroupID!
          if (
            typeof mainSelectX === 'number' &&
            typeof mainSelectY === 'number'
          ) {
            selectedSelect.forEach((id) => {
              const targetData = currentControlsData[id].properties
              const targetLeft = targetData.Left
              const targetTop = targetData.Top
              if (
                typeof targetTop === 'number' &&
                typeof targetLeft === 'number'
              ) {
                this.updateControl({
                  userFormId: this.userFormId,
                  controlId: id,
                  propertyName: 'Left',
                  value: containerX + targetLeft - mainSelectX - moveValueX
                })
                this.updateControl({
                  userFormId: this.userFormId,
                  controlId: id,
                  propertyName: 'Top',
                  value: containerY + targetTop - mainSelectY - moveValueY
                })
                if (
                  mainSelectGroup !== '' &&
                  selectedContainer !== this.containerId
                ) {
                  this.updateControl({
                    userFormId: this.userFormId,
                    controlId: id,
                    propertyName: 'GroupID',
                    value: ''
                  })
                  const presenetControl: string[] = []
                  if (mainSelectGroup && mainSelectGroup !== '') {
                    for (let control in this.userformData[this.userFormId]) {
                      const controlGroupId = this.userformData[this.userFormId][control].properties.GroupID!
                      if (
                        controlGroupId &&
                        controlGroupId === mainSelectGroup
                      ) {
                        presenetControl.push(control)
                      }
                    }
                  }
                  if (presenetControl.length === 1) {
                    const groupArray: string[] = [
                      ...this.groupedControls[this.userFormId]!.groupArray!
                    ]
                    const index = groupArray.findIndex(
                      (val) => val === mainSelectGroup
                    )
                    groupArray.splice(index, 1)
                    this.updateGroup({
                      userFormId: this.userFormId,
                      groupArray: groupArray
                    })

                    this.updateControl({
                      userFormId: this.userFormId,
                      controlId: presenetControl[0],
                      propertyName: 'GroupID',
                      value: ''
                    })
                  }
                }
              }
            })
          }

          // remove
          this.setChildControls({
            userFormId: this.userFormId,
            containerId: selectedContainer,
            targetControls: fromContainerControls
          })

          // add
          this.addChildControls({
            userFormId: this.userFormId,
            containerId: this.containerId,
            targetControls: selectedSelect
          })

          this.selectControl({
            userFormId: this.userFormId,
            select: {
              container: this.getContainerList(selectedSelect[0]),
              selected: selectedSelect
            }
          })
          event.stopPropagation()
          document.onmouseup(event)
        }
      }
      // this.handler = 'notDrag'
    }
    if (
      document.onmousemove &&
      document.onmouseup &&
      this.handler === 'frameDrag'
    ) {
      const selectedContainer = [...this.selectedControls[this.userFormId].container]
      const type = this.userformData[this.userFormId][selectedContainer[0]].type
      const controls = this.userformData[this.userFormId][selectedContainer[0]].controls
      let selectedSelect = this.selectedControls[this.userFormId].selected
      const fromContainerControls = [...this.userformData[this.userFormId][selectedContainer[0]].controls]
      for (let i = 0; i < selectedSelect.length; i++) {
        let tragetId: undefined | string = selectedSelect[i]
        let targetIndex = fromContainerControls.findIndex(
          (id) => id === tragetId
        )
        if (targetIndex !== -1) {
          fromContainerControls.splice(targetIndex, 1)
        }
      }

      let moveValueX: number = 0
      let moveValueY: number = 0
      let mainSelect: string = ''
      let parentConatiner = ''
      EventBus.$emit(
        'getMoveValue',
        (offsetX: number, offsetY: number, id: string, parentControl: string) => {
          moveValueX = offsetX
          moveValueY = offsetY
          mainSelect = id
          parentConatiner = parentControl
        }
      )
      const containerList: string[] = []
      if (mainSelect) {
        const findControlChild = (mainSelect: string) => {
          for (let i in this.userformData[this.userFormId]) {
            if (i === mainSelect) {
              const controlData = this.userformData[this.userFormId][i]
              if (controlData.controls && controlData.controls.length > 0) {
                for (let j of controlData.controls) {
                  containerList.push(j)
                  findControlChild(j)
                }
              }
            }
          }
        }

        findControlChild(mainSelect)
        const isChild = containerList.includes(this.containerId) || this.containerId === mainSelect
        if ((isChild === false && parentConatiner === this.containerId) ||
         (isChild === false && this.selectedControls[this.userFormId].selected.includes(mainSelect))) {
          const currentControlsData = this.userformData[this.userFormId]
          const mainSelectData = currentControlsData[mainSelect]
          const mainSelectX = mainSelectData.properties.Left
          const mainSelectY = mainSelectData.properties.Top
          const containerX = event.clientX - this.$el.getClientRects()[0].x
          const containerY = event.clientY - this.$el.getClientRects()[0].y
          selectedSelect = selectedSelect.includes(mainSelect)
            ? selectedSelect
            : [mainSelect]
          const mainSelectGroup: string = mainSelectData.properties.GroupID!
          if (
            typeof mainSelectX === 'number' &&
            typeof mainSelectY === 'number'
          ) {
            selectedSelect.forEach((id) => {
              const targetData = currentControlsData[id].properties
              const targetLeft = targetData.Left
              const targetTop = targetData.Top
              if (
                typeof targetTop === 'number' &&
                typeof targetLeft === 'number'
              ) {
                this.updateControl({
                  userFormId: this.userFormId,
                  controlId: id,
                  propertyName: 'Left',
                  value: containerX + targetLeft - mainSelectX - moveValueX
                })
                this.updateControl({
                  userFormId: this.userFormId,
                  controlId: id,
                  propertyName: 'Top',
                  value: containerY + targetTop - mainSelectY - moveValueY
                })
                if (
                  mainSelectGroup !== '' &&
                  selectedContainer[0] !== this.containerId
                ) {
                  this.updateControl({
                    userFormId: this.userFormId,
                    controlId: id,
                    propertyName: 'GroupID',
                    value: ''
                  })
                  const presenetControl: string[] = []
                  if (mainSelectGroup && mainSelectGroup !== '') {
                    for (let control in this.userformData[this.userFormId]) {
                      const controlGroupId = this.userformData[this.userFormId][control].properties.GroupID!
                      if (
                        controlGroupId &&
                        controlGroupId === mainSelectGroup
                      ) {
                        presenetControl.push(control)
                      }
                    }
                  }
                  if (presenetControl.length === 1) {
                    const groupArray: string[] = [
                      ...this.groupedControls[this.userFormId]!.groupArray!
                    ]
                    const index = groupArray.findIndex(
                      (val) => val === mainSelectGroup
                    )
                    groupArray.splice(index, 1)
                    this.updateGroup({
                      userFormId: this.userFormId,
                      groupArray: groupArray
                    })

                    this.updateControl({
                      userFormId: this.userFormId,
                      controlId: presenetControl[0],
                      propertyName: 'GroupID',
                      value: ''
                    })
                  }
                }
              }
            })
          }
          if (this.userformData[this.userFormId][this.containerId].controls.includes(mainSelect)) {
            event.stopPropagation()
            document.onmouseup(event)
          } else {
            this.setChildControls({
              userFormId: this.userFormId,
              containerId: selectedContainer[0],
              targetControls: fromContainerControls
            })

            // add
            this.addChildControls({
              userFormId: this.userFormId,
              containerId: this.containerId,
              targetControls: selectedSelect
            })
            this.selectControl({
              userFormId: this.userFormId,
              select: {
                container: this.getContainerList(selectedSelect[0]),
                selected: selectedSelect
              }
            })
            event.stopPropagation()
            document.onmouseup(event)
          }
        }
      }
    }
    if (
      document.onmousemove &&
      document.onmouseup &&
      this.grouphandler === 'groupdrag'
    ) {
      const selectedContainer = [
        ...this.selectedControls[this.userFormId].container
      ][0]
      const selectedGroup = this.selectedControls[this.userFormId].selected
      const selectedSelect = []
      for (let k = 0; k < selectedGroup.length; k++) {
        if (selectedGroup[k].startsWith('group')) {
          for (const i in this.userformData[this.userFormId]) {
            if (!i.startsWith('ID_USERFORM')) {
              const userdata = this.userformData[this.userFormId]
              if (userdata[i].properties.GroupID === selectedGroup[k]) {
                selectedSelect.push(i)
              }
            }
          }
        } else {
          selectedSelect.push(selectedGroup[k])
        }
      }
      console.log('selected group', selectedSelect)
      if (!selectedSelect.find((id) => id === selectedContainer)) {
        const fromContainerControls = [
          ...this.userformData[this.userFormId][selectedContainer].controls
        ]
        for (let i = 0; i < selectedSelect.length; i++) {
          let tragetId: undefined | string = selectedSelect[i]
          let targetIndex = fromContainerControls.findIndex(
            (id) => id === tragetId
          )
          if (targetIndex !== -1) {
            fromContainerControls.splice(targetIndex, 1)
          }
        }

        let moveValueX = 0
        let moveValueY = 0
        let mainSelect = ''
        EventBus.$emit(
          'getGroupMoveValue',
          (offsetX: number, offsetY: number, id: string) => {
            moveValueX = offsetX
            moveValueY = offsetY
          }
        )
        if (selectedContainer === this.containerId) {
          EventBus.$emit('getClientValue', event)
        } else {
          mainSelect = selectedSelect[0]
          console.warn('getGroupMoveValue', moveValueX, moveValueY)
          const currentControlsData = this.userformData[this.userFormId]
          const mainSelectData = currentControlsData[mainSelect]
          const mainSelectX = mainSelectData.properties.Left
          const mainSelectY = mainSelectData.properties.Top
          const containerX = event.clientX - this.$el.getClientRects()[0].x
          const containerY = event.clientY - this.$el.getClientRects()[0].y
          if (
            typeof mainSelectX === 'number' &&
            typeof mainSelectY === 'number'
          ) {
            selectedSelect.forEach((id) => {
              const targetData = currentControlsData[id].properties
              const targetLeft = targetData.Left
              const targetTop = targetData.Top
              if (
                typeof targetTop === 'number' &&
                typeof targetLeft === 'number'
              ) {
                this.updateControl({
                  userFormId: this.userFormId,
                  controlId: id,
                  propertyName: 'Left',
                  value: containerX + targetLeft - mainSelectX - moveValueX
                })
                this.updateControl({
                  userFormId: this.userFormId,
                  controlId: id,
                  propertyName: 'Top',
                  value: containerY + targetTop - mainSelectY - moveValueY
                })
              }
            })
          }
        }

        // remove
        this.setChildControls({
          userFormId: this.userFormId,
          containerId: selectedContainer,
          targetControls: fromContainerControls
        })

        // add
        this.addChildControls({
          userFormId: this.userFormId,
          containerId: this.containerId,
          targetControls: selectedSelect
        })
        for (let k = 0; k < selectedGroup.length; k++) {
          if (selectedGroup[k].startsWith('group')) {
            this.createGroup(selectedGroup[k])
          }
        }
        const selected = this.selectedControls[this.userFormId].selected
        this.selectControl({
          userFormId: this.userFormId,
          select: {
            container: this.getContainerList(selected[0]),
            selected: selected
          }
        })
        event.stopPropagation()
        document.onmouseup(event)
      }
    }
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
    return containerList || [this.userFormId]
  }
  /**
   * @description style object to dynamically changing the styles of  the contextMenu component based on propControlData
   * @function styleObject
   *
   */
  get contextMenuStyle () {
    return {
      top: this.top,
      left: this.left,
      display: this.viewMenu ? 'block' : 'none'
    }
  }
  get filterSelected () {
    const result =
      this.currentSelectedGroup === ''
        ? this.selectedControls[this.userFormId].selected.filter((Id) => {
          if (typeof Id === 'string') {
            return Id.startsWith('group')
          }
        })
        : [this.currentSelectedGroup]
    return result
  }
  createGroup (groupId: string) {
    this.groupRef.groupStyle(groupId)
  }
  muldragControl (val: IDragResizeGroup) {
    this.groupRef.handleMouseDown(val.event, val.handler)
  }
  dragControl (event: MouseEvent) {
    this.groupRef.handleMouseDown(event, 'drag')
  }
  /**
   * @description style object to dynamically changing the styles of  the darg-selctor component based on propControlData
   * @function dragSelectorStyle
   *
   */
  get dragSelectorStyle () {
    const ph = this.propControlData.properties.Height!
    const pw = this.propControlData.properties.Width!
    const sh = this.propControlData.properties.ScrollHeight!
    const sw = this.propControlData.properties.ScrollWidth!
    return {
      height: ph > sh ? `${ph - 50}px` : `${sh! - 50}px`,
      width: pw > sw ? `${pw - 20}px` : `${sw! - 20}px`,
      cursor:
        this.propControlData.properties.MousePointer !== 0 ||
        this.propControlData.properties.MouseIcon !== ''
          ? `${this.mouseCursorData} !important`
          : 'default !important'
    }
  }

  /**
   * @description propControlData is abstract class providing implementation in FDContainer by passing
   * userFormId and controlId which is taken as props from parent Component
   * @function propControlData
   *
   */
  get propControlData (): controlData {
    return this.userformData[this.userFormId][this.controlId]
  }

  /**
   * @description To display contextmenu of control
   * @function openContextMenu
   * @param e it is type of mouseEvent
   * @param parentID is the UserFormId in which the control resides
   * @param controlId is the selected control of which context has to be displayed
   */
  openContextMenu (e: MouseEvent, parentID: string, controlID: string) {
    this.$emit('openMenu', e, parentID, controlID)
  }
  created () {
    EventBus.$on('handleName', (handler: string) => {
      this.handler = handler
    })
    EventBus.$on('groupDrag', (handler: string) => {
      this.grouphandler = handler
    })
  }
  // destroyed () {
  //   EventBus.$off('handleName')
  //   EventBus.$off('groupDrag')
  // }
}
</script>

<style scoped>
#right-click-menu {
  background: #fafafa;
  border: 1px solid #bdbdbd;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  display: block;
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  width: 100px;
  z-index: 999999;
}

#right-click-menu li {
  border-bottom: 1px solid #e0e0e0;
  margin: 0;
  padding: 5px 5px;
}

#right-click-menu li:last-child {
  border-bottom: none;
}

#right-click-menu li:hover {
  background: #1e88e5;
  color: #fafafa;
}
:focus {
  outline: none;
}
.dragSelector {
  visibility: hidden;
}
.dragSelector > .resize {
  visibility: visible;
}
.dragSelector > .group {
  visibility: visible;
}
</style>
