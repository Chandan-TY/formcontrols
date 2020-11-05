<template>
  <div>
    <div
      :class="
        mainSelected && isEditMode && !isRunMode
          ? 'mainDiv2'
          : mainSelected && !isEditMode && !isRunMode
          ? 'mainDiv'
          : 'mainDiv1'
      "
      :style="resizeControlStyle"
      :ref="'draRef'.concat(controlId)"
      @mousedown.stop="
        mainSelected && !isEditMode
          ? handleDrag($event)
          : !isEditMode
          ? dragGroupControl($event)
          : ''
      "
      @mousedown.self.stop="
        mainSelected && isEditMode
          ? handleDrag($event)
          : isEditMode
          ? dragGroupControl($event)
          : ''
      "
      @contextmenu.stop="openContextMenu($event, userFormId, controlId)"
      @click.stop
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
        @setEditMode="setEditMode"
        @selectedItem="selectedItem"
        @dragGroup="dragGroup"
        @deleteItem="deleteItem"
        @updateModel="updateModelHandle"
        @updateModelExtraData="updateModelExtraDataHandle"
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
import ResizeHandler from '@/FormDesigner/components/molecules/FDResizeHandler/index.vue'
import FdSelectVue from '@/api/abstract/FormDesigner/FdSelectVue'
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
    TabStrip
  }
})
export default class ResizeControl extends FdSelectVue {
  // @Prop({ required: true, type: Array }) public currentSelectedGroup!: string[]
  @PropSync('currentSelectedGroup') public syncCurrentSelectedGroup!: string;
  @Prop({ required: true, type: String }) public containerId!: string;
  @Ref('resize') readonly resize!: ResizeHandler;

  handleDrag (event: MouseEvent) {
    if (this.selectedControls[this.userFormId].selected.length > 1) {
      this.exchangeSelect()
    }
    this.resize.handleMouseDown(event, 'drag', 'control')
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
  get propControlData (): controlData {
    return this.userformData[this.userFormId][this.controlId]
  }
  openContextMenu (e: MouseEvent, parentID: string, controlID: string) {
    this.$emit('openMenu', e, parentID, controlID)
  }
  get resizeControlStyle () {
    debugger
    const currentProperties = this.propControlData.properties
    const bs = currentProperties.BorderStyle!
    const type = this.propControlData.type
    return {
      paddingRight:
        (type === 'Label' && (bs ? '4px' : '2px')) ||
        (type === 'TextBox' && (bs ? '6px' : '4px')) ||
        (type === 'FDImage' && (bs ? '2px' : '1px')) ||
        (type === 'Frame' && (bs ? '20px' : '18px')),
      paddingBottom:
        (type === 'Label' && (bs ? '2px' : '0px')) ||
        (type === 'TextBox' && (bs ? '6px' : '4px')) ||
        (type === 'FDImage' && (bs ? '2px' : '1px')) ||
        (type === 'Frame' && (bs ? '13px' : '18px')),
      left: `${currentProperties.Left}px`,
      top: `${currentProperties.Top}px`,
      width: `${currentProperties.Width!}px`,
      height: `${currentProperties.Height!}px`,
      display:
        this.isRunMode && currentProperties.Visible === false
          ? 'none'
          : 'block'
    }
  }
  get mainSelected () {
    return this.selectedControls[this.userFormId].selected.includes(
      this.controlId
    )
  }
  dragGroup () {
    const groupId = this.propControlData.properties.GroupID
      ? this.propControlData.properties.GroupID
      : ''
    const currentSelect = this.selectedControls[this.userFormId].selected
    if (groupId !== '') {
      let selectTarget = null
      let currentGroup = ''
      if (groupId !== '') {
        if (
          this.syncCurrentSelectedGroup === groupId ||
          currentSelect.includes(groupId)
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
        select: { container: [this.containerId], selected: [selectTarget] }
      })
      this.syncCurrentSelectedGroup = currentGroup
    }
  }
  deleteItem (event: KeyboardEventInit) {
    if (event.key !== 'Backspace') {
      this.deleteControl({
        userFormId: this.userFormId,
        parentId: this.containerId!,
        targetId: this.controlId
      })
    }
  }
  selectedItem () {
    debugger
    const groupId = this.propControlData.properties.GroupID ? this.propControlData.properties.GroupID : ''
    const currentSelect = this.selectedControls[this.userFormId].selected
    if (currentSelect.length === 1 && currentSelect[0] === this.controlId) {
      this.isEditMode = true
    } else {
      if (currentSelect.length > 1) {
        this.exchangeSelect()
      } else {
        let selectTarget = null
        let currentGroup = ''
        if (groupId !== '') {
          if (this.syncCurrentSelectedGroup === groupId && currentSelect[0] === groupId) {
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
          select: { container: [this.containerId], selected: [selectTarget] }
        })
        this.syncCurrentSelectedGroup = currentGroup
      }
    }
  }
  exchangeSelect () {
    const sel = [...this.selectedControls[this.userFormId].selected]
    const controlIndex = this.selectedControls[this.userFormId].selected.findIndex((val) => val === this.controlId)
    sel.splice(controlIndex, 1)
    sel.unshift(this.controlId)
    this.selectControl({
      userFormId: this.userFormId,
      select: { container: [this.containerId], selected: [...sel] }
    })
  }
  get getModeStyle () {
    return this.mainSelected ? 'mainDiv' : 'mainDiv1'
  }

  @Watch('selectedControls', { deep: true })
  updateSelectedControls () {
    this.isEditMode = false
  }
  get getUserFormId () {
    if (
      this.propControlData.type === 'Frame' || this.propControlData.type === 'MultiPage') {
      return this.userFormId
    } else {
      return null
    }
  }
}
</script>

<style scoped>
.mainDiv {
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
.mainDiv2 {
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
.mainDiv1 {
  position: absolute;
}
:focus {
  outline: none;
}
</style>
