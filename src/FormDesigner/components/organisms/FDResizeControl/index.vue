<template>
  <div>
    <div
      :class="
        mainSelected && isEditMode && !isRunMode
          ? 'controlEditStyle'
          : canDragMainDiv
          ? 'controlSelectStyle'
          : 'controlStyle'
      "
      :style="resizeControlStyle"
      :ref="'draRef'.concat(controlId)"
      @mousedown.stop="
        mainSelected && !isRunMode
          ? handleDrag($event)
          : !isRunMode && dragGroupControl($event)
      "
      @contextmenu.stop="openContextMenu($event, containerId, controlId)"
    >
      <ResizeHandler
        v-if="!isRunMode"
        ref="resize"
        @updateResize="updateResize"
        :controlId="controlId"
        :userFormId="userFormId"
        controlType="control"
        @createGroup="createGroup"
        @muldragControl="muldragControl"
        @updateEditMode="updateEditMode"
        :size="{
          width: propControlData.properties.Width,
          height: propControlData.properties.Height,
        }"
      />
      <component
        :is="propControlData.type"
        :controlId="propControlData.properties.ID"
        :userFormId="getUserFormId"
        :data="propControlData"
        :isActivated="
          this.selectedControls[this.userFormId].selected.includes(
            this.controlId
          )
        "
        :isRunMode="isRunMode"
        :isEditMode="isEditMode"
        :containerId="containerId"
        @setEditMode="setEditMode"
        @selectedItem="selectedItem"
        @deleteItem="deleteItem"
        @updateModel="updateModelHandle"
        @updateModelExtraData="updateModelExtraDataHandle"
        @controlEditMode="controlEditMode"
      >
        {{ propControlData.properties.Caption }}
      </component>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Prop,
  Vue,
  Ref,
  PropSync,
  Watch
} from 'vue-property-decorator'
import { State, Action } from 'vuex-class'

import Label from '@/FormDesigner/components/atoms/FDLabel/index.vue'
import CommandButton from '@/FormDesigner/components/atoms/FDCommandButton/index.vue'
import ToggleButton from '@/FormDesigner/components/atoms/FDToggleButton/index.vue'
import TextBox from '@/FormDesigner/components/atoms/FDTextBox/index.vue'
import SpinButton from '@/FormDesigner/components/atoms/FDSpinButton/index.vue'
import ScrollBar from '@/FormDesigner/components/atoms/FDScrollBar/index.vue'
import OptionButton from '@/FormDesigner/components/atoms/FDOptionButton/index.vue'
import CheckBox from '@/FormDesigner/components/atoms/FDCheckBox/index.vue'
import ComboBox from '@/FormDesigner/components/atoms/FDComboBox/index.vue'
import ListBox from '@/FormDesigner/components/atoms/FDListBox/index.vue'
import FDImage from '@/FormDesigner/components/atoms/FDImage/index.vue'
import Frame from '@/FormDesigner/components/atoms/FDFrame/index.vue'
import TabStrip from '@/FormDesigner/components/atoms/FDTabStrip/index.vue'
import MultiPage from '@/FormDesigner/components/atoms/FDMultiPage/index.vue'
import ResizeHandler from '@/FormDesigner/components/molecules/FDResizeHandler/index.vue'
import FdSelectVue from '@/api/abstract/FormDesigner/FdSelectVue'
import Container from '../FDContainer/index.vue'
@Component({
  name: 'ResizeControl',
  components: {
    ResizeHandler,
    Label,
    CommandButton,
    ToggleButton,
    TextBox,
    SpinButton,
    ScrollBar,
    CheckBox,
    OptionButton,
    FDImage,
    Frame,
    ComboBox,
    ListBox,
    TabStrip,
    MultiPage
  }
})
export default class ResizeControl extends FdSelectVue {
  @PropSync('currentSelectedGroup') public syncCurrentSelectedGroup!: string;
  @Prop({ required: true, type: String }) public containerId!: string;
  @Ref('resize') readonly resize!: ResizeHandler;

  handleDrag (event: MouseEvent) {
    if (this.selectedControls[this.userFormId].selected.length > 1) {
      this.selectedItem(event)
    }
    this.isMoveWhenMouseDown = false
    this.resize.handleMouseDown(event, 'drag', 'control', this.controlId)
  }
  @Emit('muldragControl')
  private muldragControl (val: IDragResizeGroup) {
    return val
  }

  @Emit('dragControl')
  dragControl (event: MouseEvent) {
    return event
  }

  dragGroupControl (event: MouseEvent) {
    if (this.selectedControls[this.userFormId].selected.length > 1) {
      this.selectedItem(event)
    }
    this.propControlData.properties.GroupID && this.dragControl(event)
  }
  @Emit('openMenu')
  openMenu (e: MouseEvent, parentID: string, controlID: string) {
    return {
      e,
      parentID,
      controlID
    }
  }

  get canDragMainDiv (): boolean {
    return this.mainSelected && !this.isEditMode && !this.isRunMode
  }

  get propControlData (): controlData {
    return this.userformData[this.userFormId][this.controlId]
  }
  openContextMenu (e: MouseEvent, parentID: string, controlID: string) {
    this.$emit('openMenu', e, parentID, controlID)
  }
  get resizeControlStyle () {
    const currentProperties = this.propControlData.properties
    const extraData = this.propControlData.extraDatas!
    const bs = currentProperties.BorderStyle!
    const isRotate = currentProperties.Width! > currentProperties.Height!
    const type = this.propControlData.type
    const tempOrient = currentProperties.Orientation
    let tempOrientBoolean = false
    if (this.propControlData.type === 'ScrollBar') {
      if (tempOrient === 1) {
        tempOrientBoolean = false
      } else if (tempOrient === -1) {
        if (currentProperties.Height! >= currentProperties.Width!) {
          console.log(
            'heightwidth',
            currentProperties.Height,
            currentProperties.Width
          )
          tempOrientBoolean = true
        } else {
          console.log(
            'heightwidth',
            currentProperties.Height,
            currentProperties.Width
          )
          tempOrientBoolean = false
        }
      } else {
        tempOrientBoolean = true
      }
    }
    return {
      left: `${currentProperties.Left}px`,
      top: `${currentProperties.Top}px`,
      /* border width(5) * 2 = 10 */
      width: this.propControlData.type === 'Frame' ? `${currentProperties.Width! + 25}px` : `${currentProperties.Width! + 10}px`,
      height: `${currentProperties.Height! + 10}px`,
      display:
        this.isRunMode && currentProperties.Visible === false
          ? 'none'
          : 'block',
      cursor: !this.isRunMode ? 'move' : 'default',
      zIndex: extraData.zIndex!
    }
  }
  get mainSelected () {
    return (
      this.selectedControls[this.userFormId].selected.includes(
        this.controlId
      ) ||
      (this.selectedControls[this.userFormId].container.includes(
        this.controlId
      ) &&
        this.selectedControls[this.userFormId].selected.includes(
          this.controlId
        ) !==
          this.selectedControls[this.userFormId].container.includes(
            this.controlId
          ))
    )
  }
  deleteItem (event: KeyboardEventInit) {
    if (event.key !== 'Backspace') {
      this.deleteZIndex(this.controlId)
      this.deleteTabIndex(this.controlId)
      this.deleteControl({
        userFormId: this.userFormId,
        parentId: this.containerId!,
        targetId: this.controlId
      })
    }
  }
  selectedItem (e: MouseEvent) {
    const userData = this.userformData[this.userFormId]
    const groupId = this.propControlData.properties.GroupID
      ? this.propControlData.properties.GroupID
      : ''
    const currentSelect = this.selectedControls[this.userFormId].selected
    if (currentSelect.length === 1 && currentSelect[0] === this.controlId) {
      if (
        this.isMoveWhenMouseDown !== true &&
        this.propControlData.type !== 'FDImage' &&
        this.propControlData.type !== 'Frame'
      ) {
        this.isEditMode = true
        this.isMoveWhenMouseDown = false
      }
    } else {
      if (currentSelect.length > 1) {
        if (currentSelect.includes(this.controlId)) {
          this.exchangeSelect()
        } else {
          if (
            this.userformData[this.userFormId][this.controlId].properties
              .GroupID !== ''
          ) {
            const selGrpName = this.userformData[this.userFormId][this.controlId].properties.GroupID!
            this.groupExchange(selGrpName)
          }
        }
      } else {
        let selectTarget = null
        let currentGroup = ''
        if (groupId !== '') {
          if (
            this.syncCurrentSelectedGroup === groupId &&
            currentSelect[0] === groupId
          ) {
            selectTarget = this.controlId
          } else {
            selectTarget = groupId
          }
          currentGroup = groupId
        } else {
          selectTarget = this.controlId
        }

        this.selectControl({
          userFormId: this.userFormId,
          select: { container: this.getContainerList(selectTarget), selected: [selectTarget] }
        })
        this.syncCurrentSelectedGroup = currentGroup
      }
    }
    if ((this.propControlData.type === 'Frame' || this.propControlData.type === 'MultiPage') && currentSelect.length === 1) {
      this.isMoving = true
      this.isEditMode = true
      this.bringFront()
      e.stopPropagation()
    }
  }

  exchangeSelect () {
    const sel = [...this.selectedControls[this.userFormId].selected]
    const controlIndex = this.selectedControls[this.userFormId].selected.findIndex((val) => val === this.controlId)
    sel.splice(controlIndex, 1)
    sel.unshift(this.controlId)
    this.selectControl({
      userFormId: this.userFormId,
      select: { container: this.getContainerList(sel[0]), selected: [...sel] }
    })
  }
  groupExchange (groupName: string) {
    const sel = [...this.selectedControls[this.userFormId].selected]
    const controlIndex = this.selectedControls[this.userFormId].selected.findIndex((val) => val === groupName)
    sel.splice(controlIndex, 1)
    sel.unshift(groupName)
    this.selectControl({
      userFormId: this.userFormId,
      select: { container: this.getContainerList(sel[0]), selected: [...sel] }
    })
  }
  get getModeStyle () {
    return this.mainSelected ? 'controlSelectStyle' : 'controlStyle'
  }

  @Watch('selectedControls', { deep: true })
  updateSelectedControls () {
    if (this.isMoving === false) {
      this.isEditMode = false
    } else {
      this.isMoving = false
    }
  }

  get getUserFormId () {
    if (
      this.propControlData.type === 'Frame' ||
      this.propControlData.type === 'MultiPage' ||
      this.propControlData.type === 'TabStrip'
    ) {
      return this.userFormId
    } else {
      return null
    }
  }
}
</script>

<style scoped>
.controlSelectStyle {
  box-sizing: border-box;
  position: absolute;
  --border-width: 5;
  --stripe-distance: 2px;
  border: calc(var(--border-width) * 1px) solid transparent;
  border-image: repeating-linear-gradient(
      -110deg,
      black,
      transparent 1px,
      transparent var(--stripe-distance),
      black calc(var(--stripe-distance) + 0.2px)
    )
    var(--border-width);
}
.controlEditStyle {
  box-sizing: border-box;
  position: absolute;
  --border-width: 5;
  --stripe-distance: 2px;
  border: calc(var(--border-width) * 1px) solid transparent;
  border-image: repeating-linear-gradient(
      -45deg,
      black,
      transparent 2px,
      transparent var(--stripe-distance),
      black calc(var(--stripe-distance) + 0.2px)
    )
    var(--border-width);
}
.controlStyle {
  box-sizing: border-box;
  position: absolute;
  cursor: default !important;
}
:focus {
  outline: none;
}
</style>
