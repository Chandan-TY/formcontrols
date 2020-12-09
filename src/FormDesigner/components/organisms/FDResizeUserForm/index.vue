<template>
  <div
    @keydown.ctrl="handleKeyDown"
    @keydown.delete.exact="handleKeyDown"
    @keydown.tab.exact="tabAction"
    tabindex="0"
  >
    <div
      :class="[
        isInnerWindowClicked ? 'inner-window-border' : 'inner-window-border1',
      ]"
      :style="resizeUserformStyle"
    >
      <ResizeHandler
        v-if="isInnerWindowClicked"
        :controlId="controlId"
        :userFormId="userFormId"
        controlType="userform"
        @updateUserFormResize="updateUserFormResize"
      />
      <Userform
        :userFormId="userFormId"
        :controlId="controlId"
        :containerId="controlId"
        :data="propControlData"
        :isRunMode="isRunMode"
        :isEditMode="isEditMode"
        ref="userFormRef"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Ref } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'

import Userform from '@/FormDesigner/components/molecules/FDUserform/index.vue'
import ResizeHandler from '@/FormDesigner/components/molecules/FDResizeHandler/index.vue'
import FdSelectVue from '@/api/abstract/FormDesigner/FdSelectVue'
import FdContainerVue from '@/api/abstract/FormDesigner/FdContainerVue'

@Component({
  name: 'ResizeUserForm',
  components: {
    Userform,
    ResizeHandler
  }
})
export default class ResizeUserForm extends FdSelectVue {
  @Prop({ required: true, type: String }) public containerId!: string;
  @Ref('userFormRef') readonly userFormRef!: Userform;

  tabCounter = 0;
  /**
   * @description To perform ContextMenu actions(for example: selectAll, paste etc.) on UserForm  and Control
   * @function handleKeyDown
   * @param event  - it is of type MouseEvent
   * @event keydown
   */
  handleKeyDown (event: KeyboardEvent) {
    this.userFormRef.containerRef.refContextMenu.updateAction(event)
  }

  /**
   * @description propControlData is abstract class providing implementation in FDResizeUserForm by passing
   * userFormId and controlId which is taken as props from parent Component
   * @function propControlData
   *
   */
  get propControlData (): controlData {
    return this.userformData[this.userFormId][this.controlId]
  }

  /**
   * @description style object to dynamically changing the styles to resize the useform  based on propControlData
   * @function resizeUserformStyle
   *
   */
  get resizeUserformStyle () {
    return {
      width: `${this.propControlData!.properties!.Width! + 10}px`,
      height: `${this.propControlData!.properties!.Height! + 10}px`
    }
  }
  get isInnerWindowClicked () {
    return this.selectedControls[this.userFormId].selected.includes(
      this.controlId
    )
  }
  tabAction (event: KeyboardEvent) {
    event.preventDefault()
    const userData = this.userformData[this.userFormId]
    let selected = this.selectedControls[this.userFormId].selected[0]
    const container = this.selectedControls[this.userFormId].container[0]
    const containerControls = userData[container].controls
    if (containerControls.length > 0) {
      let type = userData[selected].type
      let selectedTab = -1
      if (type === 'Userform') {
        selectedTab = 0
      } else if (type === 'FDImage') {
        selectedTab = userData[selected].extraDatas!.TabIndex! + 1
      } else {
        selectedTab = userData[selected].properties!.TabIndex! + 1
      }
      if (selectedTab > containerControls.length - 1) {
        selectedTab = 0
      }
      const nextControlId = containerControls.findIndex((val) => {
        const type = userData[val].type
        if (type === 'FDImage') {
          return userData[val].extraDatas!.TabIndex! === selectedTab
        } else {
          return userData[val].properties!.TabIndex! === selectedTab
        }
      })
      console.log('nextControlId', nextControlId)
      this.selectControl({
        userFormId: this.userFormId,
        select: {
          container: [container],
          selected: [containerControls[nextControlId]]
        }
      })
    }
  }
}
</script>

<style scoped>
.inner-window-border {
  width: 610px;
  height: 310px;
  --border-width: 8;
  --stripe-distance: 1px;
  position: absolute;
  border: calc(var(--border-width) * 1px) solid transparent;
  border-image: repeating-linear-gradient(
      -18deg,
      black,
      transparent 0.1px,
      transparent var(--stripe-distance),
      black calc(var(--stripe-distance) + 0.9px)
    )
    var(--border-width);
}
.inner-window-border1 {
  width: 610px;
  height: 310px;
  padding: 0px;
  --border-width: 8;
  --stripe-distance: 1px;
  position: absolute;
  border: calc(var(--border-width) * 1px) solid transparent;
}
:focus {
  outline: none;
}
</style>
