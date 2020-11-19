<template>
  <div>
    <div class="firstrow">
      <div class="ui-titlebar">
        <div class="ui-titletext">Visual Basic for Applications - Book1</div>
        <div class="ui-titlecontrols">
          <!-- fixed svg issue -->
          <button class="ui-btn minimize">
            <FDSVGImage name="minimize.svg" />
          </button>
          <button class="ui-btn maximize">
            <FDSVGImage name="maximize.svg" />
          </button>
          <button class="ui-btn close">
            <FDSVGImage name="close-button.svg" />
          </button>
        </div>
      </div>
    </div>

    <div class="secondrow">
      <i class="material-icons material-float">&#xe5d4;</i>
      <div class="menu-bar">
        <ul>
          <li><u>F</u>ile</li>
          <li><u>E</u>dit</li>
          <li @click="subMenuDisplay">
            <u>V</u>iew
            <div class="sub-menu-1" v-if="displaySubMenu === true">
              <ul class="sub-menu-ul">
                <li class="sub-menu-li">
                  <CodeLogo class="fa padding" />
                  <span><u>C</u>ode</span>
                </li>
                <li class="sub-menu-li">
                  <ObjectLogo class="fa padding" />
                  <span>O<u>b</u>ject</span>
                </li>
                <hr />
                <li class="sub-menu-li">
                  <ObjBrowserLogo class="fa padding" />
                  <span><u>O</u>bject Browser</span>
                </li>
                <hr />
                <li class="sub-menu-li">
                  <UseSvgImage />
                  <span><u>I</u>mmediate Window</span>
                </li>
                <li class="sub-menu-li">
                  <UseSvgImage />
                  <span>Local<u>s</u> Window</span>
                </li>
                <hr />
                <li class="sub-menu-li">
                  <UseSvgImage />
                  <span>Watc<u>h</u> Window</span>
                </li>
                <li class="sub-menu-li">
                  <UseSvgImage />
                  <span>Call Stac<u>k</u></span>
                </li>
                <hr />
                <li class="sub-menu-li">
                  <PjExplorerLogo class="fa padding" />
                  <span><u>P</u>roject Explorer</span>
                </li>
                <li class="sub-menu-li">
                  <PjPropertyLogo class="fa padding" />
                  <span>Properties <u>W</u>indow</span>
                </li>
                <hr />
                <li class="sub-menu-li">
                  <ToolBoxLogo class="fa padding" />
                  <span>ToolBo<u>x</u></span>
                </li>
                <li class="sub-menu-li">
                  <UseSvgImage />
                  <span>T<u>a</u>b Order</span>
                </li>
                <hr />
                <li class="sub-menu-li">
                  <UseSvgImage />
                  <span>Microscoft Excel</span>
                </li>
              </ul>
            </div>
          </li>
          <li @click="subMenuDisplay">
            <u>I</u>nsert
            <div class="sub-menu-1" v-if="displaySubMenu === true">
              <ul class="sub-menu-ul">
                <li class="sub-menu-li">
                  <UseSvgImage />
                  <span><u>P</u>rocedure</span>
                </li>
                <li class="sub-menu-li" @click="insertUserForm()">
                  <UserFormLogo class="fa padding" />
                  <span><u>U</u>serform</span>
                </li>
                <li class="sub-menu-li">
                  <UseSvgImage />
                  <span><u>M</u>odule</span>
                </li>
                <li class="sub-menu-li">
                  <UseSvgImage />
                  <span><u>C</u>lass Module</span>
                </li>
                <hr />
                <li class="sub-menu-li">
                  <UseSvgImage />
                  <span>F<u>i</u>le</span>
                </li>
              </ul>
            </div>
          </li>
          <li><u>F</u>ormat</li>
          <li><u>D</u>ebug</li>
          <li @click="clickChangeMode"><u>R</u>un</li>
          <li><u>T</u>ools</li>
          <li><u>A</u>dd-Ins</li>
          <li><u>W</u>indow</li>
          <li><u>H</u>elp</li>
        </ul>
      </div>
    </div>

    <div class="thirdrow">
      <i class="material-icons">&#xe5d4;</i>
      <FileSaveLogo class="fa" />
      <CutLogo class="fa" />
      <CopyLogo class="fa" />
      <PasteLogo class="fa" />
      <FindLogo class="fa" />
      <UndoLogo class="fa" />
      <RedoLogo class="fa" />
      <DesignModeLogo class="fa" />
      <PjExplorerLogo class="fa" />
      <PjPropertyLogo class="fa" />
      <ObjBrowserLogo class="fa" />
      <ToolBoxLogo class="fa" />
      <HelpLogo class="fa" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import { IaddUserform } from '@/storeModules/fd/actions'
import { ControlPropertyData } from '@/FormDesigner/models/ControlsTableProperties/ControlPropertyData'
import CutLogo from '../../../../assets/cut.svg'
import FileSaveLogo from '../../../../assets/file-save.svg'
import CopyLogo from '../../../../assets/copy.svg'
import PasteLogo from '../../../../assets/paste.svg'
import FindLogo from '../../../../assets/find.svg'
import UndoLogo from '../../../../assets/undo.svg'
import RedoLogo from '../../../../assets/redo.svg'
import DesignModeLogo from '../../../../assets/design-mode.svg'
import PjExplorerLogo from '../../../../assets/pj-explorer.svg'
import PjPropertyLogo from '../../../../assets/pj-property.svg'
import ObjBrowserLogo from '../../../../assets/obj-browser.svg'
import ToolBoxLogo from '../../../../assets/tool-box.svg'
import UserFormLogo from '../../../../assets/user-from.svg'
import HelpLogo from '../../../../assets/help.svg'
import CodeLogo from '../../../../assets/view-code.svg'
import ObjectLogo from '../../../../assets/view-object.svg'
import FDSVGImage from '@/FormDesigner/components/atoms/FDSVGImage/index.vue'
@Component({
  name: 'Header',
  components: {
    FileSaveLogo,
    CutLogo,
    CopyLogo,
    PasteLogo,
    FindLogo,
    UndoLogo,
    RedoLogo,
    DesignModeLogo,
    PjExplorerLogo,
    PjPropertyLogo,
    ObjBrowserLogo,
    ToolBoxLogo,
    UserFormLogo,
    CodeLogo,
    ObjectLogo,
    HelpLogo,
    FDSVGImage
  }
})
export default class Header extends Vue {
  displaySubMenu: boolean = false;
  @Action('fd/addUserform') addControl!: (payload: IaddUserform) => void;
  @Action('fd/changeRunMode') changeRunMode!: (payload: boolean) => void;
  @State((state) => state.fd.userformData) usrFrmData!: userformData;
  @State((state) => state.fd.isRunMode) isRunMode!: boolean;
  propControlData = {};
  insertUserForm () {
    this.propControlData = this.usrFrmData
    const userform = new ControlPropertyData()
    const userFormId = `ID_USERFORM${Object.keys(this.usrFrmData).length + 1}`
    const Name = `UserForm${Object.keys(this.usrFrmData).length + 1}`
    const Caption = `UserForm${Object.keys(this.usrFrmData).length + 1}`
    const ID = Object.keys(this.usrFrmData).length + 1
    this.addControl({
      target: this,
      key: userFormId,
      value: {
        properties: {
          ...userform.data.UserForm,
          Name: Name,
          ID: ID,
          Caption: Caption
        },
        controls: [],
        extraDatas: { display: 'none' },
        type: 'Userform'
      }
    })
  }
  subMenuDisplay () {
    this.displaySubMenu = !this.displaySubMenu
  }
  clickChangeMode () {
    this.changeRunMode(!this.isRunMode)
  }
}
</script>

<style scoped>
.body {
  width: 100%;
  box-shadow: box-sizing;
}
.tablink {
  background-color: rgba(240, 234, 234, 0.877);
  color: rgb(17, 17, 17);
  padding: 5px;
  cursor: pointer;
  font-size: 12px;
  border: none;
  float: left;
}
.sub-menu-li {
  display: grid;
  grid-template-columns: 25px 1fr;
}
.thirdrow {
  margin-top: 5px;
}
.tablink:hover {
  background-color: #4dbce0;
}

.firstrow {
  font-size: 15px;
}
.secondrow {
  border: 1px transparent;
  padding: 5px;
  background-color: rgba(240, 234, 234, 0.877);
  height: 20px;
  display: flex;
}
.buttons {
  float: right;
  line-height: normal;
}
.min .max .close1 {
  width: 40px;
}
.close1:hover {
  background-color: red;
}
.fa {
  margin-left: 3px;
  margin-right: 3px;
}
.padding {
  padding-top: 3px;
}
.material-icons {
  size: 15px;
}
.material-float {
  float: left;
}
i:hover {
  background-color: #4dbce0;
  cursor: default;
}

.ui-titlebar {
  display: flex;
  width: 100%;
  height: 32px;
  background: #0072c6;
  user-select: none;
  cursor: default;
}
.ui-titleicon {
  flex-grow: 1;
  max-width: 32px;
  max-height: 32px;
}
.ui-titletext {
  flex-grow: 2;
  max-height: 32px;
  width: auto;
  font: 12px/32px "Segoe UI", Arial, sans-serif;
  color: #fff;
  text-indent: 10px;
}
.ui-titlecontrols {
  max-width: 144px;
  max-height: 32px;
  flex-grow: 1;
}
.ui-btn {
  margin: 0;
  width: 48px;
  height: 32px;
  border: 0;
  outline: 0;
  background: transparent;
}
.ui-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
.ui-btn.close:hover {
  background: #e81123;
}
hr {
  margin: 0px;
}
.ui-btn svg path,
.ui-btn svg rect,
.ui-btn svg polygon {
  fill: #fff;
}
.ui-btn svg {
  width: 10px;
  height: 10px;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #ddd;
}

.tablink:hover .dropdown-content {
  display: block;
}
.dropdown {
  position: relative;
  display: inline-block;
}

.commandbutton-element {
  border: 1px solid gray;
  border-radius: 3px;
  background-color: white;
  min-width: 50px;
  max-width: 112px;
  width: fit-content;
  height: fit-content;
  min-height: 20px;
  padding: 0px 5px 0px 5px;
  overflow: hidden;
}
.dialog-action-button {
  background-color: #f2eded;
  width: 79px;
  height: 35px;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 8px;
  padding-bottom: 8px;
  border: 1px solid gray;
  border-radius: 3px;
  overflow: hidden;
}
.btn-style {
  border: 1px solid gray;
  border-radius: 5px;
  background-color: white;
  min-width: 50px;
  max-width: 112px;
  width: fit-content;
  height: fit-content;
  min-height: 20px;
  padding: 0px 5px 0px 5px;
  overflow: hidden;
  top: -3px;
  position: relative;
}
:focus {
  outline: none;
}
.menu-bar {
  background: rgba(240, 234, 234);
  line-height: 24px;
  cursor: context-menu;
  margin-left: 3px;
}

.menu-bar ul {
  display: inline-flex;
  list-style: none;
  margin: 0px;
}

.menu-bar ul > li {
  list-style: none;
  text-align: center;
  padding: 0px 6px;
  font-size: 12px;
}

.menu-bar ul li a {
  text-decoration: none;
  margin-left: -15px;
}
.menu-bar ul li a:visited {
  color: black;
}
.menu-bar ul {
  background-color: rgba(240, 234, 234);
  padding: 0px;
}

.active,
.menu-bar ul li:hover {
  background-color: white;
  z-index: 10;
}

.sub-menu-1 {
  display: none;
  box-shadow: 2px 2px rgba(0, 0, 0, 0.2);
}

.menu-bar ul li:hover .sub-menu-1 {
  display: block;
  position: absolute;
}

.sub-menu-1 ul li {
  text-align: left;
  border: 0.1px solid white;
}

.sub-menu-1 ul {
  background-color: white;
  padding: 0px;
  margin-left: -6px;
}

.sub-menu-1 ul li:hover {
  background-color: rgb(155, 215, 255);
  border-color: rgb(0, 153, 255);
}
</style>
