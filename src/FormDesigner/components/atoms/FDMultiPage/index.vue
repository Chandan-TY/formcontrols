<template>
  <div>
    <div
      class="outer-page"
      :style="pageStyleObj"
      :title="properties.ControlTipText"
      @mousedown="multiPageMouseDown"
      @click.stop="!isEditMode ? selectedItem : addControlObj($event, selectedPageID)"
      @mouseup="dragSelectorControl($event)"
      @contextmenu.stop="handleContextMenu"
      @keydown.delete.stop.exact="deleteMultiPage"
    >
      <div
        class="pages"
        :style="styleTabsObj"
        :title="properties.ControlTipText"
        v-if="controls.length > 0"
      >
        <div
          class="move"
          ref="scrolling"
          :style="styleMoveObj"
        >
          <div
            class="page"
            v-for="(value, key) in controls"
            :key="key"
            :style="getTabStyle"
          >
            <FDControlTabs
              @setValue="setValue"
              @isChecked="isChecked"
              :getMouseCursorData="getMouseCursorData"
              :setFontStyle="setFontStyle"
              @tempStretch="tempStretch"
              :data="data"
              :pageValue="value"
              :indexValue="key"
              :pageData="pageData(value).properties"
              :isRunMode="isRunMode"
              :isEditMode="isEditMode"
              :isItalic="isItalic"
              :tempStretch="tempStretch"
              :tempWeight="tempWeight"
              :tempTabWidth="tempTabWidth"
            />
          </div>
        </div>
        <div
          class="content"
          :style="styleContentObj"
          ref="contentRef"
          :title="properties.ControlTipText"
        >
          <div
            v-if="controls.includes(selectedPageID)"
            :style="containerDivStyle"
            :title="properties.ControlTipText"
            :tabindex="properties.TabIndex"
            @keydown.ctrl.exact.stop="handleKeyDown"
            @keydown.enter.exact="setContentEditable($event, true)"
            @contextmenu.stop="showContextMenu($event, userFormId, controlId)"
          >
            <Container
              :contextMenuType="contextMenuType"
              :viewMenu="viewMenu"
              :userFormId="userFormId"
              :controlId="selectedPageID"
              :containerId="selectedPageID"
              :isEditMode="isEditMode"
              :title="properties.ControlTipText"
              :left="left"
              :top="top"
              :width="properties.Width"
              :height="properties.Height"
              ref="containerRef"
              @closeMenu="closeMenu"
              @openMenu="(e, parentID, controlID) =>showContextMenu(e, parentID, controlID)"
            />
          </div>
        </div>
        <div></div>
        <div :style="getScrollButtonStyleObj">
          <button class="left-button" @click="leftmove"></button>
          <button class="right-button" @click="rightmove"></button>
        </div>
      </div>
    </div>
    <div
      id="right-click-menu"
      ref="multipage"
      :tabindex="0"
      @blur.stop="closeContextMenu"
      :style="{ top: top, left: left, display: multiPageContextMenu ? 'block' : 'none' }"
    >
      <ContextMenu
        :values="contextMenuValue"
        :controlId="controlId"
        :selectedTab="updatedValue"
        :data="data"
        :userFormId="userFormId"
        @closeMenu="closeContextMenu"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Watch } from 'vue-property-decorator'
import FdControlVue from '@/api/abstract/FormDesigner/FdControlVue'
import { State, Action } from 'vuex-class'
import FdContainerVue from '@/api/abstract/FormDesigner/FdContainerVue'
import { controlProperties } from '@/FormDesigner/controls-properties'
import ContextMenu from '../FDContextMenu/index.vue'
import { tabsContextMenu } from '../../../models/tabsContextMenu'
import Vue from 'vue'
import {
  KeyValueProp,
  ScrollBarProp
} from '@/FormDesigner/controls-properties-types'
import FDControlTabs from '@/FormDesigner/components/atoms/FDControlTabs/index.vue'
import Container from '@/FormDesigner/components/organisms/FDContainer/index.vue'

@Component({
  name: 'FDMultiPage',
  components: {
    ContextMenu,
    FDControlTabs,
    Container: () =>
      import('@/FormDesigner/components/organisms/FDContainer/index.vue')
  }
})
export default class FDMultiPage extends FdContainerVue {
  @State((state) => state.fd.userformData) userformData!: userformData;
  @Prop() isEditMode: boolean;
  @Prop({ required: true, type: String }) public userFormId!: string;
  @Ref('scrolling') scrolling: HTMLDivElement;
  @Ref('contentRef') contentRef: HTMLDivElement;
  @Ref('containerRef') readonly containerRef!: Container;
  @Ref('multipage') multipage: HTMLDivElement

  viewMenu?: boolean = false;
  top: string = '0px';
  left: string = '0px';
  contextMenuValue: Array<IcontextMenu> = tabsContextMenu;
  updatedValue: number = 0;
  selectedPageID: string = '';
  tempTabWidth: number = 0;
  multiPageContextMenu: boolean = false
  selectedPageIndex: number = -1

  closeMenu () {
    this.viewMenu = false
  }

  closeContextMenu () {
    this.multiPageContextMenu = false
  }
  /**
   * @description takes a single page value based on the value of the control
   * @function pageData
   *
   */
  pageData (value: string): controlData {
    return this.userformData[this.userFormId][value]
  }

  /**
   * @description style object is passed to :style attribute in div tag
   * dynamically changing the styles of the component based on data
   * @function pageStyleObj
   *
   */
  get pageStyleObj () {
    const controlProp = this.properties
    let display = ''
    if (this.isRunMode) {
      display = controlProp.Visible ? 'inline-block' : 'none'
    } else {
      display = 'inline-block'
    }
    return {
      left: `${controlProp.Left}px`,
      width: `${controlProp.Width}px`,
      height: `${controlProp.Height}px`,
      top: `${controlProp.Top}px`,
      cursor:
        controlProp.MousePointer !== 0 || controlProp.MouseIcon !== ''
          ? this.getMouseCursorData
          : 'default',
      display: display
    }
  }

  /**
   * @description style object is passed to :style attribute in div tag
   * dynamically changing the styles of the component based on data
   * @function styleTabsObj
   *
   */
  protected get styleTabsObj (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      backgroundColor: controlProp.BackColor,
      cursor:
        controlProp.MousePointer !== 0 || controlProp.MouseIcon !== ''
          ? this.getMouseCursorData
          : 'default'
    }
  }

  /**
   * @description style object is passed to :style attribute in div tag
   * dynamically changing the styles of the component based on data
   * @function styleMoveObj
   *
   */
  protected get styleMoveObj (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    const a = ['bottom', 'top']
    let bottomTopStyle = {}
    if (controlProp.TabOrientation === 1) {
      bottomTopStyle = { [a[0]]: '0px' }
    } else if (controlProp.TabOrientation === 0) {
      bottomTopStyle = { [a[1]]: '0px' }
    }
    return {
      position:
        controlProp.TabOrientation === 1 || controlProp.TabOrientation === 3
          ? 'absolute'
          : 'inherit',
      ...bottomTopStyle,
      whiteSpace: controlProp.MultiRow === true ? 'break-spaces' : 'nowrap',
      zIndex: controlProp.MultiRow === true ? '100' : '',
      display: controlProp.Style === 2 ? 'none' : 'inline-block',
      height:
        controlProp.TabOrientation === 2 || controlProp.TabOrientation === 3
          ? '100%'
          : '',
      width:
        controlProp.TabOrientation === 2 || controlProp.TabOrientation === 3
          ? 'fit-content'
          : '100%',
      right: controlProp.TabOrientation === 3 ? '0px' : '',
      overflow: 'hidden'
    }
  }

  /**
   * @description style object is passed to :style attribute in div tag
   * dynamically changing the styles of the component based on data
   * @function containerDivStyle
   *
   */
  get containerDivStyle () {
    if (this.selectedPageData) {
      let zoomVal = this.selectedPageData
        ? this.selectedPageData.properties.Zoom! / 100
        : ''
      return {
        height: '100%',
        width: '100%',
        position: 'relative',
        backgroundImage: `url(${this.selectedPageData.properties.Picture})`,
        backgroundSize:
          this.selectedPageData.properties.Picture === ''
            ? ''
            : this.getSizeMode,
        backgroundRepeat: this.getRepeatData,
        backgroundPosition:
          this.selectedPageData.properties.Picture === ''
            ? ''
            : this.getPosition,
        zoom: zoomVal + ''
      }
    }
  }
  /**
   * @description style object is passed to :style attribute in button tags
   * dynamically changing the styles of the component based on data
   * @function getScrollButtonStyleObj
   *
   */
  protected get getScrollButtonStyleObj (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    const tabsLength =
      this.properties.TabFixedWidth! > 0
        ? this.controls.length * this.properties.TabFixedWidth! +
          10 * this.controls!.length
        : this.controls.length * 30 + 10 * this.controls!.length
    const tabsHeight =
      this.properties.TabFixedHeight! > 0
        ? this.controls.length * this.properties.TabFixedHeight! +
          10 * this.controls!.length
        : this.controls.length * 20 + 10 * this.controls!.length

    return {
      position: 'absolute',
      zIndex: '3',
      marginTop:
        controlProp.TabOrientation === 2 || controlProp.TabOrientation === 3
          ? `${controlProp.Height! - 30}px`
          : controlProp.TabOrientation === 1
            ? `${controlProp.Height! - 22}px`
            : '0px',
      transform:
        controlProp.TabOrientation === 2
          ? 'rotate(90deg)'
          : this.transformScrollButtonStyle,
      display:
        controlProp.TabOrientation === 0 || controlProp.TabOrientation === 1
          ? this.properties.Width! > 44
            ? tabsLength > this.properties.Width!
              ? 'block'
              : 'none'
            : 'none'
          : controlProp.TabOrientation === 2 || controlProp.TabOrientation === 3
            ? this.properties.Height! > 44
              ? tabsHeight > this.properties.Height!
                ? 'block'
                : 'none'
              : 'none'
            : 'none',
      right:
        controlProp.TabOrientation === 3
          ? '-14px'
          : controlProp.TabOrientation === 2
            ? `${controlProp.Width! - 40}px`
            : '-14px',
      top: '0px'
    }
  }

  /**
   * @description takes the index Value and pageValue and set the Value property
   * @function isChecked
   *
   */
  isChecked (value: selectedTab) {
    this.updatedValue = value.indexValue
    this.selectedPageID = value.pageValue
    this.updateDataModel({ propertyName: 'Value', value: value.indexValue })
    this.selectControl({
      userFormId: this.userFormId,
      select: {
        container: this.getContainerList(this.selectedPageID),
        selected: [this.selectedPageID]
      }
    })
  }

  /**
   * @description takes the ref of the div and determines the scrollLeft and scrollTop
   * @function leftmove
   *
   */
  leftmove () {
    const scrollRef = this.scrolling
    if (
      this.properties.TabOrientation === 0 ||
      this.properties.TabOrientation === 1
    ) {
      scrollRef.scrollLeft! -= 50
    } else {
      scrollRef.scrollTop! -= 50
    }
  }

  /**
   * @description takes the ref of the div and determines the scrollLeft and scrollTop
   * @function rightmove
   *
   */
  rightmove () {
    const scrollRef = this.scrolling
    let tempScrollTop = scrollRef.scrollTop!
    if (
      this.properties.TabOrientation === 0 ||
      this.properties.TabOrientation === 1
    ) {
      scrollRef.scrollLeft! += 50
    } else {
      tempScrollTop += 50
      scrollRef.scrollTop = tempScrollTop
    }
  }

  /**
   * @description takes the index Value and sets the Value property
   * @function setValue
   *
   */
  setValue (value: number) {
    this.updatedValue = value
    this.updateDataModel({ propertyName: 'Value', value: value })
    return true
  }
  /**
   * @description style object is passed to :style attribute in div tag
   * dynamically changing the styles of the component based on data
   * @function getTabStyle
   *
   */
  protected get getTabStyle (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      display:
        controlProp.TabOrientation === 0 || controlProp.TabOrientation === 1
          ? 'inline-block'
          : 'block',
      cursor:
        controlProp.MousePointer !== 0 || controlProp.MouseIcon !== ''
          ? this.getMouseCursorData
          : 'default'
    }
  }

  /**
   * @description getRepeat returns string value from
   * controlProperties.extraDataRepeatProp
   * @function getRepeat
   */
  protected get getRepeatData (): string {
    if (this.selectedPageData) {
      const picture = this.selectedPageData.properties.Picture!
      const pictureTiling = this.selectedPageData.properties.PictureTiling!
      const pictureSizeMode = this.selectedPageData.properties.PictureSizeMode!
      return controlProperties.getRepeatDataProp(
        picture,
        pictureTiling,
        pictureSizeMode
      )
    } else {
      return ''
    }
  }

  /**
   * @description style object is passed to :style attribute in div tag
   * dynamically changing the styles of the component based on data
   * @function styleContentObj
   *
   */
  protected get styleContentObj (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      position: 'absolute',
      display:
        controlProp.Height! < controlProp.TabFixedHeight!
          ? 'none'
          : controlProp.Width! < controlProp.TabFixedWidth!
            ? 'none'
            : controlProp.Style === 1 || controlProp.Style === 2
              ? 'none'
              : controlProp.Width! < 30 || controlProp.Height! < 30
                ? 'none'
                : 'block',
      top:
        controlProp.TabOrientation === 0
          ? controlProp.TabFixedHeight! > 0
            ? controlProp.TabFixedHeight! + 12 + 'px'
            : '33px'
          : '0px',
      height:
        controlProp.TabOrientation === 0 || controlProp.TabOrientation === 1
          ? controlProp.TabFixedHeight! > 0
            ? controlProp.Height! - controlProp.TabFixedHeight! - 5 + 'px'
            : controlProp.TabOrientation === 1
              ? `${controlProp.Height! - 21}px`
              : `${controlProp.Height! - 35}px`
          : `${controlProp.Height! - 2}px`,
      width:
        controlProp.TabOrientation === 0 || controlProp.TabOrientation === 1
          ? 'calc(100% - 3px)'
          : controlProp.TabFixedWidth! > 0
            ? controlProp.Width! - controlProp.TabFixedWidth! - 15 + 'px'
            : controlProp.TabFixedWidth! === 0
              ? controlProp.Width! - this.tempTabWidth - 15 + 'px'
              : 'calc(100% - 44px)',
      left:
        controlProp.TabOrientation === 2
          ? controlProp.TabFixedWidth! > 0
            ? controlProp.TabFixedWidth! + 12 + 'px'
            : controlProp.TabFixedWidth! === 0
              ? controlProp.Width! - this.tempTabWidth - 41 + 'px'
              : '40px'
          : '0px',
      cursor:
        controlProp.MousePointer !== 0 || controlProp.MouseIcon !== ''
          ? this.getMouseCursorData
          : 'default',
      padding: '0px',
      overflow: 'hidden',
      overflowX: this.getScrollBarPage ? this.getScrollBarPage.overflowX! : '',
      overflowY: this.getScrollBarPage ? this.getScrollBarPage.overflowY! : ''
    }
  }

  /**
   * @description getPosition returns string value from
   * controlProperties.picturePositionProp
   * @function getPosition
   * @returns string value
   */
  protected get getPosition () {
    if (this.selectedPageData) {
      const picture = this.selectedPageData.properties.Picture!
      const pictureAlignment = this.selectedPageData.properties.PictureAlignment!
      const pictureSizeMode = this.selectedPageData.properties.PictureSizeMode!
      return controlProperties.getPositionProp(
        picture,
        pictureAlignment,
        pictureSizeMode
      )
    } else {
      return ''
    }
  }

  /**
   * @description getSizeMode returns string value from
   * controlProperties.pictureSizeModeProp
   * @function getSizeMode
   * @returns string value
   */
  protected get getSizeMode (): string {
    if (this.selectedPageData) {
      const index: number = this.selectedPageData.properties.PictureSizeMode!
      return controlProperties.getSizeModeProp(index)
    } else {
      return ''
    }
  }

  /**
   * @description getScrollBarPage returns propData based on keepScrollBar and scrollBar values
   * @function getScrollBarPage
   */
  get getScrollBarPage () {
    if (this.selectedPageData) {
      const keepScrollBar: number = this.selectedPageData.properties
        .KeepScrollBarsVisible!
      const scrollBar: number = this.selectedPageData.properties.ScrollBars!
      return controlProperties.setScrollBarProp(keepScrollBar, scrollBar)
    } else {
      return ''
    }
  }

  /**
   * @description returns the selected page
   * dynamically based on the selectedPageID
   * @function selectedPageData
   *
   */
  get selectedPageData () {
    if (this.selectedPageID) {
      return this.userformData[this.userFormId][this.selectedPageID]
    } else {
      return ''
    }
  }

  mounted () {
    this.selectedPageID = this.controls[0]
    // Error while running test case
    // const divElement = this.scrolling.children
    // let width = 0
    // if (this.contentRef) {
    //   const scrollRef = this.contentRef
    //   scrollRef.scrollLeft! = 20
    // }
    // if (divElement && this.properties.TabFixedWidth === 0) {
    //   for (let i = 0; i < divElement.length; i++) {
    //     let offsetWidth = (divElement[i].children[0].children[1] as HTMLElement)
    //       .offsetWidth
    //     if (offsetWidth > width) {
    //       width = offsetWidth
    //       this.tempTabWidth = width
    //     }
    //   }
    // }
  }
  dragSelectorControl (event: MouseEvent) {
    this.selectedControlArray = []
    if (this.selectedPageData && this.controls.length > 0 && this.controls.includes(this.selectedPageID)) {
      this.selectedAreaStyle = this.containerRef.dragSelector.selectAreaStyle
      this.calSelectedAreaStyle(event, this.selectedPageData)
    }
  }

  multiPageMouseDown (e: MouseEvent) {
    this.selectedItem(e)
    const selContainer = this.selectedControls[this.userFormId].container[0]
    if (selContainer === this.controlId) {
      this.deActiveControl()
    }
  }
  showContextMenu (e: MouseEvent, parentID: string, controlID: string) {
    e.preventDefault()
    this.multiPageContextMenu = false
    this.openMenu(e, parentID, controlID)
    Vue.nextTick(() => this.containerRef.contextmenu.focus())
  }
  handleKeyDown (event: KeyboardEvent) {
    this.containerRef.refContextMenu.updateAction(event)
  }
  handleContextMenu (e: MouseEvent) {
    e.preventDefault()
    this.top = `${e.offsetY}px`
    this.left = `${e.offsetX}px`
    if (this.isEditMode) {
      this.multiPageContextMenu = true
      Vue.nextTick(() => this.multipage.focus())
      if (!this.controls.includes(this.selectedPageID)) {
        const updatedValue: number = this.updatedValue - 1 < 0 ? -1 : this.updatedValue - 1
        this.selectedPageID = this.controls.length > 0 ? updatedValue === -1 ? this.controls[0] : this.controls[updatedValue] : ''
      }
      if (this.data.controls.length >= 1) {
        this.selectControl({
          userFormId: this.userFormId,
          select: {
            container: this.getContainerList(this.selectedPageID),
            selected: [this.selectedPageID]
          }
        })
      }
      this.viewMenu = false
    }
  }
  deleteMultiPage (event: KeyboardEvent) {
    if (this.controlId === this.selectedControls[this.userFormId].selected[0]) {
      this.deleteItem(event)
    } else {
      this.handleKeyDown(event)
    }
  }
}
</script>

<style scoped>
.outer-page {
  background-color: rgb(238, 238, 238);
  overflow-y: hidden;
  overflow-x: hidden;
  box-sizing: border-box;
  width: 0px;
  height: 0px;
  left: 0px;
  top: 0px;
}
.pages {
  /* display: grid; */
  margin: 0;
  width: calc(100%);
  height: calc(100%);
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: hidden;
}
.left-button {
  position: relative;
  outline: none;
  background-image: url("../../../../assets/left-arrow-img.png");
  background-size: 30%;
  background-position: center;
  background-repeat: no-repeat;
  border: 2px solid white;
  border-right-color: gray;
  border-bottom-color: gray;
  top: 3px;
  right: 15px;
  width: 22px;
  height: 18px;
  padding: 0;
  margin: 0;
  overflow: hidden;
  z-index: 5;
}
.right-button {
  position: relative;
  outline: none;
  background-image: url("../../../../assets/right-arrow-img.png");
  background-size: 30%;
  background-position: center;
  background-repeat: no-repeat;
  border: 2px solid white;
  border-right-color: gray;
  border-bottom-color: gray;
  top: 3px;
  right: 15px;
  width: 22px;
  height: 18px;
  padding: 0;
  margin: 0;
  overflow: hidden;
  z-index: 5;
}
.move {
  width: 100%;
  display: grid;
  /* grid-template-columns: 1fr; */
}
.page {
  /* display: inline-block; */
  vertical-align: top;
  z-index: 1;
  overflow: hidden;
}
.scroll-page {
  z-index: 2;
}
.page label {
  border: 0.1px solid white;
  background-color: rgb(238, 238, 238);
  /* display: inline-block; */
  padding: 5px 5px 5px 5px;
  margin: 0;
  cursor: pointer;
  position: relative;
  top: 0px;
}
.page [type="radio"] {
  display: none;
}
::-webkit-scrollbar.move {
  display: none;
  width: 0;
  height: 1em;
  background-color: rgb(238, 238, 238);
}
::-webkit-scrollbar.content {
  width: 0;
  height: 1em;
  background-color: rgb(238, 238, 238);
}

::-webkit-scrollbar-button {
  background: rgb(238, 238, 238);
  height: 20px;
  border: 1px solid lightgray;
  border-right-color: gray;
  border-bottom-color: gray;
}

/* Up */
::-webkit-scrollbar-button:single-button:horizontal:decrement {
  background-image: url("../../../../assets/triangle-up-img.png");
  transform: rotate(90deg);
  background-size: 10px;
  background-position: center;
  background-repeat: no-repeat;
  /* border-color: lightgrey; */
}

/* Down */
::-webkit-scrollbar-button:single-button:horizontal:increment {
  background-image: url("../../../../assets/triangle-down-img.png");
  background-size: 10px;
  background-position: center;
  background-repeat: no-repeat;
  /* border-color: lightgrey; */
}

::-webkit-scrollbar-track-piece {
  width: 0px;
}

::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
  height: 5px;
}

.page .content {
  position: absolute;
  white-space: normal;
  top: 23px;
  left: 0px;
  /* background: rgb(238, 238, 238); */
  background-color: white;
  background-size: 9px 10px;
  background-image: radial-gradient(
    circle,
    rgb(0, 0, 0) 0.5px,
    rgba(0, 0, 0, 0) 0.2px
  );
  height: 100px;
  right: 0;
  bottom: 0;
  padding: 20px;
  padding-right: 10px;
  width: calc(100% - 35px);
  height: calc(100% - 89px);
  border: 0.1px solid white;
  box-shadow: 2px 1px gray;
}

.page [type="radio"]:checked ~ label ~ .content {
  z-index: 1;
}
.content {
  overflow: auto;
}
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

.spanClass {
  text-decoration: underline;
  text-underline-position: under;
}
:focus{
  outline: none;
}
</style>
