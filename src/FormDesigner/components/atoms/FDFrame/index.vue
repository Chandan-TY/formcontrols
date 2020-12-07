<template>
  <fieldset
    class="fieldset"
    :style="cssStyleProperty"
    :title="properties.ControlTipText"
    :tabindex="properties.TabIndex"
    @keydown.ctrl.exact.stop="handleKeyDown"
    @keydown.delete.stop.exact="deleteFrame"
    @keydown.enter.exact="setContentEditable($event, true)"
    @click.stop="!isEditMode ? selectedItem : addControlObj($event)"
    @contextmenu.stop="showContextMenu($event, userFormId, controlId)"
    @mousedown="frameMouseDown"
    @mouseup="dragSelectorControl($event)"
    ref="frame"
  >
    <legend :style="legendCssStyleProperty">{{ properties.Caption }}</legend>
    <Container
      :contextMenuType="contextMenuType"
      :viewMenu="viewMenu"
      :userFormId="userFormId"
      :controlId="controlId"
      :containerId="controlId"
      :isEditMode="isEditMode"
      :left="left"
      :top="top"
      ref="containerRef"
      @closeMenu="closeMenu"
      @openMenu="(e, parentID, controlID) => showContextMenu(e, parentID, controlID)"
    />
  </fieldset>
</template>

<script lang="ts">
import { Component, Prop, Ref, Watch } from 'vue-property-decorator'
import FdControlVue from '@/api/abstract/FormDesigner/FdControlVue'
import { Action } from 'vuex-class'
import Vue from 'vue'
import FdContainerVue from '@/api/abstract/FormDesigner/FdContainerVue'
import Container from '@/FormDesigner/components/organisms/FDContainer/index.vue'
import { controlProperties } from '@/FormDesigner/controls-properties'
@Component({
  name: 'FDFrame',
  components: {
    Container: () =>
      import('@/FormDesigner/components/organisms/FDContainer/index.vue')
  }
})
export default class FDFrame extends FdContainerVue {
  @Ref('containerRef') readonly containerRef!: Container;
  @Ref('frame') readonly frame!: FDFrame;
  @Prop({ required: true, type: Boolean }) public readonly isEditMode: boolean;
  mode: boolean = false;

  /**
   * @description Returns string value for CSS background style
   * @function createBackgroundString
   */
  protected get createBackgroundString () {
    return `url(${this.properties.Picture})`
  }
  /**
   * @description Returns string value for CSS background style for dotted patten
   * @function getSampleDotPattern
   */
  protected get getSampleDotPattern () {
    const dotSize = 1
    const dotSpace = 10
    return {
      backgroundPosition: `7px 7px`,
      backgroundImage: `radial-gradient(${this.properties.ForeColor} 11%, transparent 10%)`,
      backgroundSize: `${dotSpace}px ${dotSpace}px`
    }
  }

  mounted () {
    this.scrollLeftTop(this.data)
  }

  @Watch('properties.ScrollLeft', { deep: true })
  updateScrollLeft () {
    this.scrollLeftTop(this.data)
  }

  @Watch('properties.ScrollTop', { deep: true })
  updateScrollTop () {
    this.scrollLeftTop(this.data)
  }

  /**
   * @description sets scrollbar left and top position
   * @function scrollLeftTop
   * @param controlData propControlData passed as input
   */
  scrollLeftTop (controlData: controlData) {
    const scrollLeft: number = this.properties.ScrollLeft!
    const scrollTop: number = this.properties.ScrollTop!
    if (scrollLeft > 0) {
      (this.frame as IScrollRef).scrollLeft = scrollLeft
    }
    if (scrollTop > 0) {
      (this.frame as IScrollRef).scrollLeft = scrollTop
    }
  }

  /**
   * @description style object is passed to :style attribute in fieldset tag
   * dynamically changing the styles of the component based on propControlData
   * @function cssStyleProperty
   *
   */
  protected get cssStyleProperty (): Partial<CSSStyleDeclaration> {
    const controlProp = this.data.properties
    const font: font = this.properties.Font
      ? this.properties.Font
      : {
        FontName: 'Arial',
        FontSize: 10,
        FontItalic: true,
        FontBold: true,
        FontUnderline: true,
        FontStrikethrough: true,
        FontStyle: 'Arial'
      }
    return {
      left: `${controlProp.Left}px`,
      width: `${controlProp!.Width!}px`,
      height: `${controlProp.Height}px`,
      cursor: controlProp.MousePointer !== 0 || controlProp.MouseIcon !== ''
        ? `${this.getMouseCursorData} !important`
        : 'default !important',
      fontFamily: font.FontStyle! !== '' ? this.setFontStyle : font.FontName!,
      fontSize: `${font.FontSize}px`,
      fontStyle: font.FontItalic || this.isItalic ? 'italic' : '',
      textDecoration: font.FontStrikethrough === true && font.FontUnderline === true
        ? 'underline line-through'
        : font.FontUnderline
          ? 'underline'
          : font.FontStrikethrough
            ? 'line-through'
            : '',
      fontWeight: font.FontBold ? 'bold'
        : font.FontStyle !== ''
          ? this.tempWeight
          : '',
      fontStretch: font.FontStyle !== '' ? this.tempStretch : '',
      border: controlProp.BorderStyle
        ? `1px solid ${controlProp.BorderColor}`
        : '2px solid gray',
      backgroundImage: controlProp.Picture === ''
        ? this.getSampleDotPattern.backgroundImage
        : this.createBackgroundString,
      backgroundSize: controlProp.Picture === ''
        ? this.getSampleDotPattern.backgroundSize
        : this.getSizeMode,
      backgroundColor: controlProp.Picture !== '' ? '' : controlProp.BackColor,
      backgroundRepeat: this.getRepeatData,
      backgroundPosition: controlProp.Picture !== ''
        ? this.getPosition
        : this.getSampleDotPattern.backgroundPosition,
      overflowX: this.getScrollBarX,
      overflowY: this.getScrollBarY,
      top: `${controlProp.Top}px`,
      boxShadow: controlProp.SpecialEffect ? this.getSpecialEffectData : 'none',
      display: controlProp.Visible ? 'block' : 'none',
      zoom: `${controlProp.Zoom}%`
    }
  }
  /**
   * @description style object is passed to :style attribute in legend tag
   * dynamically changing the styles of the component based on propControlData
   * @function legendCssStyleProperty
   *
   */
  protected get legendCssStyleProperty (): Partial<CSSStyleDeclaration> {
    const controlProp = this.data.properties
    return {
      color:
        controlProp.Enabled === true ? controlProp.ForeColor : this.getEnabled,
      background: controlProp.BackColor
    }
  }

  showContextMenu (e: MouseEvent, parentID: string, controlID: string) {
    this.openMenu(e, parentID, controlID)
    Vue.nextTick(() => this.containerRef.contextmenu.focus())
  }
  closeMenu () {
    this.viewMenu = false
  }

  dragSelectorControl (event: MouseEvent) {
    this.selectedControlArray = []
    this.selectedAreaStyle = this.containerRef.dragSelector.selectAreaStyle
    this.calSelectedAreaStyle(event, this.data)
  }

  frameMouseDown (e: MouseEvent) {
    this.selectedItem(e)
    const selContainer = this.selectedControls[this.userFormId].container[0]
    if (selContainer === this.controlId) {
      this.deActiveControl()
    } else {
      return null
    }
  }

  /**
   * @description To perform ContextMenu actions(for example: selectAll, paste etc.) on UserForm  and Control
   * @function handleKeyDown
   * @param event  - it is of type MouseEvent
   * @event keydown
   */
  handleKeyDown (event: KeyboardEvent) {
    this.containerRef.refContextMenu.updateAction(event)
  }

  deleteFrame (event: KeyboardEvent) {
    if (this.controlId === this.selectedControls[this.userFormId].selected[0]) {
      this.deleteItem(event)
    } else {
      this.handleKeyDown(event)
    }
  }
}
</script>

<style scoped>
.fieldset {
  box-sizing: border-box;
  margin: 0px;
  user-select: none;
}
</style>
