<template>
  <div>
    <div
      class="outer"
      :style="styleOuterObj"
      @contextmenu="contextMenuVisible($event, -1)"
      @click.stop="selectedItem"
      @mousedown="controlEditMode"
    >
      <div class="tabs" :style="styleTabsObj">
        <div id="container" class="move" ref="scrolling" :style="styleMoveObj">
          <div
            class="tab"
            v-for="(value, key) in extraDatas.Tabs"
            :key="key"
            :style="getTabStyle"
          >
            <input
              v-if="properties.Value !== ''"
              name="properties.ID"
              :id="value.Name"
              type="radio"
              :checked="key === properties.Value ? setValue(key) : false"
              :disabled="getDisableValue"
              @click.right="rightClickSelect(key)"
            />
            <label
              @click="!getDisableValue?isChecked(key):''"
              @contextmenu.stop="contextMenuVisible($event, key)"
              :class="[
                properties.Style === 1
                  ? properties.TabOrientation === 2
                    ? 'forLeft forButton'
                    : 'forButton'
                  : properties.Style === 0
                  ? properties.TabOrientation === 2
                    ? 'forLeft'
                    : 'forTab'
                  : '',
              ]"
              :for="value.Name"
              :title="extraDatas.Tabs[key].ToolTip"
              :style="styleLabelObj"
            >
              <span v-if="value.Accelerator === ''">{{ value.Caption }}</span>
              <span v-else
                ><span>{{
                  value.Caption | afterbeginCaption(value.Accelerator)
                }}</span>
                <span style="text-decoration: underline">{{
                  value.Caption | acceleratorCaption(value.Accelerator)
                }}</span>
                <span>{{
                  value.Caption | beforeendCaption(value.Accelerator)
                }}</span></span
              >
            </label>
            <div
              class="content"
              :style="styleContentObj"
              :title="properties.ControlTipText"
            ></div>
          </div>
        </div>
        <div></div>
        <div
          :style="[
            getScrollButtonStyleObj
          ]"
        >
          <button class="left-button" @click="leftmove"></button>
          <button class="right-button" @click="rightmove"></button>
        </div>
      </div>
    </div>
    <div
      id="right-click-menu"
      tabindex="0"
      @blur.stop="closeMenu"
      :ref="'tabstrip'.concat(controlId)"
      :style="{ top: top, left: left, display: viewMenu ? 'block' : 'none' }"
    >
      <ContextMenu
        :values="contextMenuValue"
        :controlId="controlId"
        :selectedTab="updatedValue"
        :data="data"
        :userFormId="userFormId"
        @closeMenu="closeMenu"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Watch } from 'vue-property-decorator'
import FdControlVue from '@/api/abstract/FormDesigner/FdControlVue'
import { State, Action } from 'vuex-class'
import ContextMenu from '../FDContextMenu/index.vue'
import { tabsContextMenu } from '../../../models/tabsContextMenu'
import { controlProperties } from '@/FormDesigner/controls-properties'
import Vue from 'vue'
interface IcontextMenu {
  id: string;
  icon: string;
  text: string;
  values: Array<IcontextMenu>;
  disabled: boolean;
}
interface Iscrolling {
  [scrolling: string]: {
    offsetWidth?: number;
    offsetHeight?: number;
    scrollWidth?: number;
    scrollLeft?: number;
    scrollTop?: number;
  };
}
@Component({
  name: 'FDTabStrip',
  components: {
    ContextMenu
  },
  filters: {
    afterbeginCaption: (value: string, acc: string = '') => {
      if (acc !== '') {
        acc = acc[0]
      }
      const data = controlProperties.acceleratorProp(value, acc)
      return data.afterbeginCaption
    },
    acceleratorCaption: (value: string, acc: string = '') => {
      if (acc !== '') {
        acc = acc[0]
      }
      const data = controlProperties.acceleratorProp(value, acc)
      return data.acceleratorCaption
    },
    beforeendCaption: (value: string, acc: string = '') => {
      if (acc !== '') {
        acc = acc[0]
      }
      const data = controlProperties.acceleratorProp(value, acc)
      return data.beforeendCaption
    }
  }
})
export default class FDTabStrip extends FdControlVue {
  @State((state) => state.fd.userformData) userformData!: userformData;
  @Prop() isEditMode: boolean;
  @Prop({ required: true, type: String }) public userFormId!: string;
  isScroll = true;
  // values: Array<tabsItems> = []
  viewMenu?: boolean = false;
  top: string = '0px';
  left: string = '0px';
  contextMenuValue: Array<IcontextMenu> = tabsContextMenu;
  tempScrollWidth: number;
  tempScrollHeight: number;
  updatedValue: number = 0;

  get getDisableValue () {
    if (this.isRunMode || this.isEditMode) {
      return (
        this.properties.Enabled === false
      )
    } else {
      return true
    }
  }

  rightClickSelect (value: number) {
    this.updateDataModel({ propertyName: 'Value', value: value })
  }
  contextMenuVisible (e: MouseEvent, selected: number) {
    if (this.isEditMode) {
      if (selected !== -1) {
        this.top = `${e.offsetY}px`
        this.left = `${e.offsetX}px`
        this.isChecked(selected)
      } else {
        this.top = `${e.offsetY + 30}px`
        this.left = `${e.offsetX}px`
      }
      e.preventDefault()
      e.stopPropagation()
      const controlLeft: number = this.userformData['ID_USERFORM1'][this.controlId].properties.Left!
      const controlTop: number = this.userformData['ID_USERFORM1'][this.controlId].properties.Top!
      // this.top = `${e.offsetY + controlTop!}px`
      // this.left = `${e.offsetX + controlLeft!}px`
      this.viewMenu = true
      const dynamicRef = 'tabstrip'.concat(this.controlId)
      Vue.nextTick(() => (this as any).$refs[dynamicRef].focus())
    }
  }

  setValue (value: number) {
    this.updatedValue = value
    this.updateDataModel({ propertyName: 'Value', value: value })
    return true
  }

  leftmove () {
    const scrollRef = (this.$refs as Iscrolling).scrolling
    console.log('scrol;Ref', this.$refs)
    if (this.properties.TabOrientation === 0 || this.properties.TabOrientation === 1) {
    scrollRef.scrollLeft! -= 50
    } else {
    scrollRef.scrollTop! -= 50
    }
  }
  rightmove () {
    const scrollRef = (this.$refs as Iscrolling).scrolling
    debugger
    // scrollRef.scrollLeft! = scrollRef.scrollLeft! + 50
    console.log('Top;Ref', this.$refs)
    let tempScrollTop = scrollRef.scrollTop!
    if (this.properties.TabOrientation === 0 || this.properties.TabOrientation === 1) {
    scrollRef.scrollLeft! += 50
    } else {
      tempScrollTop += 50
      scrollRef.scrollTop = tempScrollTop
      console.log('tempscrollTop', scrollRef.scrollTop)
    }
    // console.log(scrollRef)
    // scrollRef.scrollLeft! += 20
  }

  isChecked (value: number) {
    this.updatedValue = value
    this.updateDataModel({ propertyName: 'Value', value: value })
  }
  /**
   * @description style object is passed to :style attribute in div tag
   * dynamically changing the styles of the component based on propControlData
   * @function styleOuterObj
   *
   */
  protected get styleOuterObj (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    let display = ''
    if (this.isRunMode) {
      display = controlProp.Visible ? 'inline-block' : 'none'
    } else {
      display = 'inline-block'
    }
    return {
      // position: 'relative',
      top: `${controlProp.Top}px`,
      left: `${controlProp.Left}px`,
      height: `${controlProp.Height}px`,
      width: `${controlProp.Width}px`,
      cursor:
        controlProp.MousePointer !== 0 || controlProp.MouseIcon !== ''
          ? this.getMouseCursorData
          : 'default',
      display: display
    }
  }

  /**
   * @description style object is passed to :style attribute in div tag
   * dynamically changing the styles of the component based on propControlData
   * @function styleMoveObj
   *
   */
  protected get styleMoveObj (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      whiteSpace: controlProp.MultiRow === true ? 'break-spaces' : 'nowrap',
      zIndex: controlProp.MultiRow === true ? '100' : '',
      display: controlProp.Style === 2 ? 'none' : 'inline-block',
      height: controlProp.TabOrientation === 2 || controlProp.TabOrientation === 3 ? '100%' : '',
      overflowX: 'auto',
      overflowY: 'auto'
    }
  }

  /**
   * @description style object is passed to :style attribute in button tags
   * dynamically changing the styles of the component based on propControlData
   * @function getScrollButtonStyleObj
   *
   */
  protected get getScrollButtonStyleObj (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    // console.log('extratablebngth', this.extraDatas.Tabs!.length * this.properties.TabFixedWidth!)
    // console.log('tabfixedwidth', this.properties.TabFixedWidth!)
    // console.log('width', this.properties.Width!)
    // this.scrollCheck()
    const tabsLength = this.extraDatas.Tabs!.length * this.properties.TabFixedWidth! + (10 * this.extraDatas.Tabs!.length)
    const tabsHeight = this.extraDatas.Tabs!.length * this.properties.TabFixedHeight! + (10 * this.extraDatas.Tabs!.length)
    console.log('height', this.properties.Height)
    console.log('tabfixedheight', tabsHeight)
    return {
      zIndex: '3',
      marginTop:
        controlProp.TabOrientation === 2 || controlProp.TabOrientation === 3
          ? `${controlProp.Height! - 225}px` : controlProp.TabOrientation === 1 ? `${controlProp.Height! - 22}px` : '0px',
      transform:
        controlProp.TabOrientation === 2
          ? 'rotate(90deg)'
          : this.transformScrollButtonStyle,
      // display: controlProp.Style === 2 ? 'none' : 'inline-block',
      display: controlProp.TabOrientation === 0 || controlProp.TabOrientation === 1 ? ((this.properties.Width! > 44) ? ((tabsLength > this.properties.Width!) ? 'block' : 'none') : 'none') : controlProp.TabOrientation === 2 || controlProp.TabOrientation === 3 ? ((this.properties.Height! > 44) ? ((tabsHeight > this.properties.Height!) ? 'block' : 'none') : 'none') : 'none',
      position: controlProp.TabOrientation === 0 || controlProp.TabOrientation === 1 ? 'absolute' : '',
      right: '-14px'
      // overflow: 'hidden'
      // right:
      //   controlProp.TabOrientation === 0 || controlProp.TabOrientation === 1
      //     ? this.tempScrollWidth - controlProp.Width! + 30 + 'px'
      //     : '0px'
      // bottom: controlProp.TabOrientation === 2 || controlProp.TabOrientation === 3 ? ((this.tempScrollHeight - controlProp.Height!) - 30 + 'px') : '0px'
    }
  }

  /**
   * @description style object is passed to :style attribute in div tag
   * dynamically changing the styles of the component based on propControlData
   * @function styleTabsObj
   *
   */
  protected get styleTabsObj (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      background: controlProp.BackColor,
      alignItems:
        controlProp.TabOrientation === 0 ||
        controlProp.TabOrientation === 3 ||
        controlProp.TabOrientation === 2
          ? 'baseline'
          : 'flex-end',
      justifyContent:
        controlProp.TabOrientation === 3 ? 'flex-end' : 'flex-start',
      gridTemplateColumns:
        controlProp.TabOrientation === 3 || controlProp.TabOrientation === 2
          ? ''
          : '1fr 0px 30px',
      cursor:
        controlProp.MousePointer !== 0 || controlProp.MouseIcon !== ''
          ? this.getMouseCursorData
          : 'default'
    }
  }

  /**
   * @description style object is passed to :style attribute in label tag
   * dynamically changing the styles of the component based on propControlData
   * @function styleLabelObj
   *
   */
  protected get styleLabelObj (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    const font: font = controlProp.Font
      ? controlProp.Font
      : {
        FontName: 'Arial',
        FontSize: 10
      }
    return {
      color: controlProp.Enabled ? controlProp.ForeColor : this.getEnabled,
      height: controlProp.TabFixedHeight + 'px',
      width: controlProp.TabFixedWidth + 'px',
      top: controlProp.TabOrientation === 1 ? '10px' : '0px',
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
      cursor:
        controlProp.MousePointer !== 0 || controlProp.MouseIcon !== ''
          ? this.getMouseCursorData
          : 'default'
    }
  }

  /**
   * @description style object is passed to :style attribute in div tag
   * dynamically changing the styles of the component based on propControlData
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
   * @description style object is passed to :style attribute in div tag
   * dynamically changing the styles of the component based on propControlData
   * @function styleContentObj
   *
   */
  protected get styleContentObj (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      zIndex: controlProp.MultiRow === true ? '-1' : '',
      display:
        controlProp.Style === 1
          ? 'none'
          : controlProp.Width! < 30 || controlProp.Height! < 30
            ? 'none'
            : 'inline-block',
      top: controlProp.TabOrientation === 0 ? '23px' : '0px',
      height:
        controlProp.TabOrientation === 0 || controlProp.TabOrientation === 1
          ? 'calc(100% - 25px)'
          : 'calc(100% - 2px)',
      width:
        controlProp.TabOrientation === 0 || controlProp.TabOrientation === 1
          ? 'calc(100% - 3px)'
          : 'calc(100% - 44px)',
      left: controlProp.TabOrientation === 2 ? '40px' : '0px',
      cursor:
        controlProp.MousePointer !== 0 || controlProp.MouseIcon !== ''
          ? this.getMouseCursorData
          : 'default',
      padding: '0px'
    }
  }

  scrollCheck () {
    // debugger
    const tabsLength = this.extraDatas.Tabs!.length * this.properties.TabFixedWidth! + (10 * this.extraDatas.Tabs!.length)
    console.log('WidthTabsd', this.properties.Width!)
    console.log('tabsLewngth', tabsLength)
    if (
      tabsLength > this.properties.Width!
    ) {
      this.isScroll = true
    } else {
      this.isScroll = false
    }
  }

  /**
   * @description watches changes in propControlData to set autoset when true
   * @function isScrollUsed
   * @param oldVal previous propControlData data
   * @param newVal  new/changed propControlData data
   */
  @Watch('properties.Width', { deep: true })
  isScrollUsed (newVal: controlData, oldVal: controlData) {
    this.tempScrollWidth = (this.$refs as Iscrolling).scrolling.offsetWidth!
    // this.tempScrollHeight = (this.$refs as Iscrolling).scrolling.offsetHeight!
    this.scrollCheck()
  }
  mounted () {
    this.tempScrollWidth = (this.$refs as Iscrolling).scrolling.offsetWidth!
    // this.tempScrollHeight = (this.$refs as Iscrolling).scrolling.offsetHeight!
    this.scrollCheck()
  }
  @Emit('updateModel')
  updateDataModel (updateData: IupdateDataModel) {
    return updateData
  }

  closeMenu () {
    this.viewMenu = false
  }
}
</script>

<style scoped>
.outer {
  background-color: rgb(238, 238, 238);
  overflow-y: hidden;
  overflow-x: hidden;
}
.tabs {
  display: grid;
  /* position: relative; */
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
  display: inline-block;
}

.tab {
  display: inline-block;
  vertical-align: top;
  z-index: 1;
  overflow: hidden;
}
.scroll-tab {
  z-index: 2;
}
.tab label {
  border: 0.1px solid white;
  background-color: rgb(238, 238, 238);
  display: inline-block;
  padding: 5px 5px 5px 5px;
  margin: 0;
  cursor: pointer;
  position: relative;
  top: 0px;
}
.tab [type="radio"] {
  display: none;
}
::-webkit-scrollbar {
  display: none;
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
}

/* Down */
::-webkit-scrollbar-button:single-button:horizontal:increment {
  background-image: url("../../../../assets/triangle-down-img.png");
  background-size: 10px;
  background-position: center;
  background-repeat: no-repeat;
}

::-webkit-scrollbar-track-piece {
  width: 0px;
}

.tab .content {
  position: absolute;
  white-space: normal;
  top: 23px;
  left: 0px;
  background: rgb(238, 238, 238);
  height: 100px;
  right: 0;
  bottom: 0;
  padding: 20px;
  padding-right: 10px;
  width: calc(100% - 35px);
  height: calc(100% - 65px);
  border: 0.1px solid white;
  box-shadow: 2px 1px gray;
}
.forButton {
  margin: 3px;
  border-radius: 3px;
  z-index: 2;
  border: 2px outset;
}
.tab [type="radio"]:checked ~ label.forButton {
  margin: 3px;
  border-right: 2px solid gray;
  border-bottom: none;
  border-radius: 3px;
  z-index: 2;
  background-color: gray;
  border: 2px inset;
}
.forTab {
  border-bottom: none;
  border-radius: 3px;
}
.tab [type="radio"]:checked ~ label.forTab {
  border-right: 2px solid gray;
  border-bottom: none;
  border-radius: 3px;
  z-index: 2;
}
.forLeft {
  border-bottom: none;
  border-radius: 3px;
}
.tab [type="radio"]:checked ~ label.forLeft {
  border-bottom: 2px solid gray;
  border-radius: 3px;
  z-index: 2;
}

.fmTabStyleButton {
  border: 1px inset !important;
}
.fmTabStyleButton [type="radio"]:checked {
  border: 1px outset !important;
  background-color: gray !important;
}
.tab [type="radio"]:checked ~ label ~ .content {
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
</style>
