<template>
  <div>
    <div
      id="right-click-menu"
      :style="contextMenuStyle"
      tabindex="0"
      @blur.stop="closeMenu"
      ref="contextmenu"
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
      :class="[!isEditMode?'dragSelector':'']"
      :ref="'dragSelector'.concat(containerId)"
      :style="dragSelectorStyle"
      @mousedown.stop.self="handleMouseDown"
    >
      <GroupControl
        :containerId="controlId"
        :userFormId="userFormId"
        ref="groupRef"
        class="group"
        :controlRef="$refs"
        :currentSelectedGroup="filterSelected"
      />
      <div v-for="control in propControlData.controls" :key="control" class="resize">
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

@Component({
  name: 'Container',
  components: {
    ContextMenu,
    GroupControl,
    ResizeControl
  }
})
export default class Container extends Vue {
  currentSelectedGroup: string = '';

  @Prop({ required: true, type: String }) public controlId!: string;
  @Prop({ required: true, type: String }) userFormId!: string;
  @Prop({ required: true, type: String }) containerId!: string;

  @State((state) => state.fd.selectedControls)
  selectedControls!: fdState['selectedControls'];
  @State((state) => state.fd.userformData) userformData!: userformData;

  @Prop({ required: true, type: Boolean }) viewMenu: boolean;
  @Prop({ required: true, type: Boolean }) contextMenuType: boolean;
  @Prop({ required: true, type: String }) top: string;
  @Prop({ required: true, type: String }) left: string;
  @Prop() isEditMode: boolean

  @Ref('groupRef') readonly groupRef!: GroupControl;
  @Ref('refContextMenu') readonly refContextMenu!: ContextMenu;

  controlContextMenu: Array<IcontextMenu> = controlContextMenu;
  userformContextMenu: Array<IcontextMenu> = userformContextMenu;

  @Emit('closeMenu')
  closeMenu () {
    return 0
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
          return Id.startsWith('group')
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
    console.log()
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
          ? `${(this as any).$parent.getMouseCursorData} !important`
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

  handleMouseDown () {
    console.log('hhhhhhh')
  }
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
.dragSelector{
  visibility: hidden;
}
.dragSelector>.resize
{
  visibility: visible;
}
.dragSelector>.group
{
  visibility: visible;
}
</style>
