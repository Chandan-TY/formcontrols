<template>
  <div class="inner-userform-window" :style="innerWindowStyle">
    <div class="inner-userform-header">
      <div>
        <span :style="innerWindowHeaderStyle">
          {{ properties.Caption }}
        </span>
      </div>
      <div>
        <button class="ui-btn close closeButton">
          <FDSVGImage name="close-button.svg" />
        </button>
      </div>
    </div>
    <div
      class="inner-window-content"
      :style="innerWindowBodyStyle"
      @click="addControlObj($event)"
      @mousedown="deActiveControl(this)"
      @contextmenu.stop="openMenu($event, userFormId, controlId)"
      @mouseup="calSelectedAreaStyle($event)"
      ref="innerUserForm"
      @scroll="updateScrollingLeftTop"
    >
      <Container
        class="container"
        :contextMenuType="contextMenuType"
        :viewMenu="viewMenu"
        :userFormId="userFormId"
        :controlId="controlId"
        :containerId="controlId"
        :left="left"
        :top="top"
        ref="containerRef"
        @closeMenu="closeMenu"
        @openMenu="(e, parentID, controlID) => openMenu(e, parentID, controlID)"
      >
      </Container>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Ref, Watch } from 'vue-property-decorator'
import Container from '@/FormDesigner/components/organisms/FDContainer/index.vue'
import { State, Action } from 'vuex-class'
import FDSVGImage from '@/FormDesigner/components/atoms/FDSVGImage/index.vue'
import { controlProperties } from '@/FormDesigner/controls-properties'
import FdContainerVue from '@/api/abstract/FormDesigner/FdContainerVue'
import { IupdateControl } from '@/storeModules/fd/actions'
@Component({
  name: 'UserForm',
  components: {
    FDSVGImage,
    Container
  }
})
export default class UserForm extends FdContainerVue {
  @Ref('containerRef') readonly containerRef!: Container;
  @Action('fd/updateControl') updateControl!: (payload: IupdateControl) => void;

  innerWindowFocused: boolean = false;
  innerWindowFocus (value: boolean) {
    this.innerWindowFocused = value
  }

  closeMenu () {
    this.viewMenu = false
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
   * @description Returns string value for CSS background style
   * @function createBackgroundString
   *
   */
  protected get createBackgroundString (): string {
    const data = this.properties.Picture
    if (typeof data === 'object' && data !== null) {
      return `url(${this.properties.Picture})`
    }
    return this.getSampleDotPattern
    // return `linear-gradient(-90deg, ${this.properties.ForeColor} 1px, transparent 1px), linear-gradient(${this.properties.ForeColor} 1px, transparent 1px)`
  }

  protected get getSampleDotPattern (): any {
    const dotSize = 1
    const dotSpace = 10
    return {
      backgroundPosition: `7px 7px`,
      backgroundImage: `radial-gradient(${this.properties.ForeColor} 11%, transparent 10%)`,
      backgroundSize: `${dotSpace}px ${dotSpace}px`
    }
  }

  /**
   * @description sets scrollbar left and top position
   * @function scrollLeftTop
   * @param controlData propControlData passed as input
   */
  scrollLeftTop (controlData: controlData) {
    const refName: any = this.$refs.innerUserForm
    const scrollLeft: number = this.properties.ScrollLeft!
    const scrollTop: number = this.properties.ScrollTop!
    if (scrollLeft > 0) {
      refName.scrollLeft = scrollLeft
    }
    if (scrollTop > 0) {
      refName.scrollTop = scrollTop
    }
  }

  /**
   * @description style object to dynamically changing the styles of the component based on propControlData
   * @function innerWindowStyle
   *
   */
  protected get innerWindowStyle (): Partial<CSSStyleDeclaration> {
    return {
      boxShadow:
        this.properties.SpecialEffect! > 0 ? this.getSpecialEffectData : 'none',
      margin: '5px',
      left: `${this.properties.Left}px`,
      width: `${this.properties.Width}px`,
      height: `${this.properties.Height}px`,
      top: `${this.properties.Top}px`
    }
  }
  protected get innerWindowBodyStyle (): Partial<CSSStyleDeclaration> {
    const font: font = this.properties.Font
      ? this.properties.Font
      : {
        FontName: 'Arial',
        FontSize: 10
      }
    const scale = (this.properties.Zoom! * 10) / 100
    return {
      ...this.getSampleDotPattern,
      cursor:
        this.properties.MousePointer !== 0 || this.properties.MouseIcon !== ''
          ? `${this.getMouseCursorData} !important`
          : 'default !important',
      fontFamily: font.FontStyle ? font.FontStyle : font.FontName,
      fontSize: `${font.FontSize}px`,
      fontStyle: font.FontItalic ? 'italic' : '',
      textDecoration:
        font.FontStrikethrough === true && font.FontUnderline === true
          ? 'underline line-through'
          : font.FontUnderline
            ? 'underline'
            : font.FontStrikethrough
              ? 'line-through'
              : '',
      fontWeight: font.FontBold ? 'bold' : '',
      border: this.properties.BorderStyle
        ? `1px solid ${this.properties.BorderColor}`
        : 'none',
      backgroundImage:
        this.properties.Picture === ''
          ? this.getSampleDotPattern.backgroundImage
          : this.createBackgroundString,
      backgroundSize:
        this.properties.Picture === ''
          ? this.getSampleDotPattern.backgroundSize
          : this.getSizeMode,
      backgroundColor: this.properties.Picture !== '' ? '' : this.properties.BackColor,
      backgroundRepeat: this.getRepeatData,
      backgroundPosition:
        this.properties.Picture !== ''
          ? this.getPosition
          : this.getSampleDotPattern.backgroundPosition,
      // backgroundPositionX: this.getPositionX,
      // backgroundPositionY: this.getPositionY,
      overflowX: this.getScrollBarX,
      overflowY: this.getScrollBarY
    }
  }
  protected get innerWindowHeaderStyle (): Partial<CSSStyleDeclaration> {
    return { float: this.properties.RightToLeft === true ? 'right' : 'left' }
  }

  updateScrollingLeftTop (e: MouseEvent) {
    const refName: any = this.$refs.innerUserForm
    this.updateControl({
      userFormId: this.userFormId,
      controlId: this.controlId,
      propertyName: 'ScrollLeft',
      value: refName.scrollLeft
    })
    this.updateControl({
      userFormId: this.userFormId,
      controlId: this.controlId,
      propertyName: 'ScrollTop',
      value: refName.scrollTop
    })
    console.log('scroll', this.userformData[this.userFormId][this.userFormId].properties)
  }
  /**
   * @description to drag and select  the contol in container
   * @function calSelectedAreaStyle
   * @param event  - it is of type MouseEvent
   * @event mouseup
   */
  calSelectedAreaStyle (event: MouseEvent) {
    this.selectedControlArray = []
    // getting static error
    const refName = 'dragSelector'
    this.selectedAreaStyle = (this as any).containerRef.$refs[refName].selectAreaStyle
    const left = parseInt(this.selectedAreaStyle!.left)
    const right =
      parseInt(this.selectedAreaStyle!.left) +
      parseInt(this.selectedAreaStyle!.width)
    const top = parseInt(this.selectedAreaStyle!.top)
    const bottom =
      parseInt(this.selectedAreaStyle!.top) +
      parseInt(this.selectedAreaStyle!.height)
    const leftArray: Array<number> = []
    for (let i in this.data.controls) {
      const key: string = this.data.controls[i]
      const controlProp: controlProperties = this.userformData[this.userFormId][key].properties
      if (
        left <= controlProp!.Left! + controlProp!.Width! &&
        right >= controlProp!.Left! &&
        top <= controlProp!.Top! + controlProp!.Height! &&
        bottom >= controlProp!.Top!
      ) {
        this.selectedControlArray.push(key)
      }
      leftArray.push(controlProp!.Left!)
    }
    const selecedGroup = []
    for (const val of this.selectedControlArray) {
      const controlGroupId: string = this.userformData[this.userFormId][val]
        .properties.GroupID!
      if (controlGroupId && controlGroupId !== '') {
        !selecedGroup.includes(controlGroupId)! &&
          selecedGroup.push(controlGroupId)
      } else {
        selecedGroup.push(val)
      }
    }

    if (this.selectedControlArray.length !== 0) {
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
          select: { container: [parentID], selected: [groupId] }
        })
      }
    }
    if (
      controlID.startsWith('ID_USERFORM') ||
      controlID.startsWith('ID_Frame')
    ) {
      this.contextMenuType = true
    } else {
      this.contextMenuType = false
    }
    const controlLeft: number | undefined = this.userformData[parentID][controlID].properties.Left
    const controlTop: number | undefined = this.userformData[parentID][controlID].properties.Top
    this.top = `${e.offsetY + controlTop! + 30}px`
    this.left = `${e.offsetX + controlLeft!}px`
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
      if (val.id === 'ID_PASTE') {
        val.disabled = this.copyControl.targetId.length === 0
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
    }
    Vue.nextTick(() => (this.containerRef.$refs.contextmenu as HTMLElement).focus())
  }
}
</script>

<style scoped>
.inner-userform-window {
  display: flex;
  flex-direction: column;
  outline: 1px solid lightslategray;
  outline-style: auto;
  position: relative;
  border: 5px solid rgba(153,180,209);
  border-radius: 5px;
  overflow: hidden;
  top: -5px !important;
  left: -5px !important;
  user-select: none;
}
.inner-window-border {
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
.inner-userform-header {
  display: grid;
  grid-template-columns: 9fr 1fr;
  width: 100%;
  height: 30px;
  background-color: rgba(153,180,209);
}
.inner-window-content {
  flex: 1;
  left: 0px;
  overflow: hidden;
  background-position: 9px 9px;
}
.inner-window-content:focus {
  outline: none;
}

.ui-btn {
  margin: 2px;
  background: #7e7ea666;
  border: 1px solid #7e7ea666;
  height: 18px;
  width: 30px;
  border-radius: 2px;
}
.ui-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
.ui-btn.close {
  background: #c42a37;
}
.ui-btn svg path,
.ui-btn svg rect,
.ui-btn svg polygon {
  fill: white;
}
.ui-btn svg {
  width: 10px;
  height: 10px;
  stroke: white;
  stroke-width: 2px;
}
.closeButton {
  float: right;
}
.outer-window-button {
  padding-right: 10px;
}
.ui-titlecontrols {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
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
.mainDiv1 {
  position: absolute;
}

:focus {
  outline: none;
}
.container{
  width:100%;
  height: 100%;
}
</style>
