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
                  <span></span>
                  <span><u>I</u>mmediate Window</span>
                </li>
                <li class="sub-menu-li">
                  <span></span>
                  <span>Local<u>s</u> Window</span>
                </li>
                <hr />
                <li class="sub-menu-li">
                  <span></span>
                  <span>Watc<u>h</u> Window</span>
                </li>
                <li class="sub-menu-li">
                  <span></span>
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
                  <span></span>
                  <span>T<u>a</u>b Order</span>
                </li>
                <hr />
                <li class="sub-menu-li">
                  <span></span>
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
                  <span></span>
                  <span><u>P</u>rocedure</span>
                </li>
                <li class="sub-menu-li" @click="insertUserForm()">
                  <UserFormLogo class="fa padding" />
                  <span><u>U</u>serform</span>
                </li>
                <li class="sub-menu-li">
                  <span></span>
                  <span><u>M</u>odule</span>
                </li>
                <li class="sub-menu-li">
                  <span></span>
                  <span><u>C</u>lass Module</span>
                </li>
                <hr />
                <li class="sub-menu-li">
                  <span></span>
                  <span>F<u>i</u>le</span>
                </li>
              </ul>
            </div>
          </li>
          <li @click="subMenuDisplay">
            <u>F</u>ormat
            <div class="sub-menu-1" v-if="displaySubMenu === true">
              <ul class="sub-menu-ul">
                <li class="sub-menu-li">
                  <span></span>
                  <span><u>A</u>lign</span>
                </li>
                <li class="sub-menu-li">
                  <UserFormLogo class="fa padding" />
                  <span><u>M</u>ake Same Size</span>
                </li>
                <hr />
                <li class="sub-menu-li">
                  <span></span>
                  <span><u>S</u>ize to Fit</span>
                </li>
                <li class="sub-menu-li">
                  <span></span>
                  <span><u>S</u>ize to Grid</span>
                </li>
                <hr />
                <li class="sub-menu-li">
                  <span></span>
                  <span><u>H</u>orizontal Spacing</span>
                </li>
                 <li class="sub-menu-li" @click="IncDecspacing('Left', 10)">
                  <span></span>
                  <span><u>I</u>ncrease</span>
                </li>
                 <li class="sub-menu-li" @click="IncDecspacing('Left', -10)">
                  <span></span>
                  <span><u>D</u>ecrease</span>
                </li>
                <li class="sub-menu-li" @click="removeSpace('Left')">
                  <span></span>
                  <span><u>R</u>emove</span>
                </li>
                <hr />
                <li class="sub-menu-li">
                  <span></span>
                  <span><u>V</u>ertical Spacing</span>
                </li>
                <li class="sub-menu-li" @click="IncDecspacing('Top', 10)">
                  <span></span>
                  <span><u>I</u>ncrease</span>
                </li>
                 <li class="sub-menu-li" @click="IncDecspacing('Top', -10)">
                  <span></span>
                  <span><u>D</u>ecrease</span>
                </li>
                <li class="sub-menu-li" @click="removeSpace('Top')">
                  <span></span>
                  <span><u>R</u>emove</span>
                </li>
                <hr />
                <li class="sub-menu-li">
                  <span></span>
                  <span><u>C</u>ertre in Form</span>
                </li>
                <li class="sub-menu-li" @click="centreInForm('horizontal')">
                  <span></span>
                  <span><u>H</u>orizontally</span>
                </li>
                <li class="sub-menu-li" @click="centreInForm('vertical')">
                  <span></span>
                  <span><u>V</u>ertically</span>
                </li>
                <hr />
                <li class="sub-menu-li">
                  <span></span>
                  <span>A<u>r</u>range Buttons</span>
                </li>
                <hr />
                <li class="sub-menu-li" @click="groupControl">
                  <span></span>
                  <span><u>G</u>roup</span>
                </li>
                <li class="sub-menu-li" @click="unGroupControl">
                  <span></span>
                  <span><u>U</u>nGroup</span>
                </li>
                <hr />
                <li class="sub-menu-li">
                  <span></span>
                  <span><u>O</u>rder</span>
                </li>
                <li class="sub-menu-li" @click="bringFront">
                  <span></span>
                  <span><u>B</u>ring to Front</span>
                </li>
                <li class="sub-menu-li" @click="sendBack">
                  <span></span>
                  <span><u>S</u>end to Back</span>
                </li>
              </ul>
            </div>
          </li>
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
import {
  IaddUserform,
  IupdateControlExtraData
} from '@/storeModules/fd/actions'
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
import { EventBus } from '@/FormDesigner/event-bus'
import FDCommonMethod from '@/api/abstract/FormDesigner/FDCommonMethod'

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
export default class Header extends FDCommonMethod {
  displaySubMenu: boolean = false;
  @Action('fd/addUserform') addControl!: (payload: IaddUserform) => void;
  @Action('fd/changeRunMode') changeRunMode!: (payload: boolean) => void;

  @State((state) => state.fd.selectedControls)
  selectedControls!: fdState['selectedControls'];
  @State((state) => state.fd.userformData) userformData!: userformData;
  @State((state) => state.fd.isRunMode) isRunMode!: boolean;
  @Action('fd/updateControlExtraData') updateControlExtraData!: (
    payload: IupdateControlExtraData
  ) => void;
  propControlData = {};
  userFormId = 'ID_USERFORM1';
  insertUserForm () {
    this.propControlData = this.userformData
    const userform = new ControlPropertyData()
    const userFormId = `ID_USERFORM${
      Object.keys(this.userformData).length + 1
    }`
    const Name = `UserForm${Object.keys(this.userformData).length + 1}`
    const Caption = `UserForm${Object.keys(this.userformData).length + 1}`
    const ID = Object.keys(this.userformData).length + 1
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
  bringFront () {
    const userData = this.userformData[this.userFormId]
    const selected = this.selectedControls[this.userFormId].selected[0]
    const container = this.selectedControls[this.userFormId].container[0]
    const tempZIndex = userData[selected].extraDatas!.zIndex!
    const containerControls = this.userformData[this.userFormId][container].controls
    const tempControls = []
    for (const index in containerControls) {
      const cntrlData = this.userformData[this.userFormId][containerControls[index]]
      if (cntrlData.type === 'MultiPage' || cntrlData.type === 'Frame') {
        tempControls.push(containerControls[index])
      }
    }
    const lastControlId = tempControls.length > 0 ? this.getLowestIndex(tempControls, userData[container].controls.length, true)
      : this.userformData[this.userFormId][container].controls.length + 1
    this.swapZIndex(lastControlId - 1)
  }
  sendBack () {
    this.swapZIndex(1)
  }
  groupControl () {
    EventBus.$emit('groupControl', 'group')
  }
  unGroupControl () {
    EventBus.$emit('groupControl', 'ungroup')
  }
  IncDecspacing (type: keyof controlProperties, value: number) {
    let divstyle: Array<IGroupStyle> = []
    const ctrlSel = this.selectedControls[this.userFormId].selected
    const usrFrmData = this.userformData[this.userFormId]
    const isGroup = ctrlSel[0].startsWith('group')
    const ctrlProp = !isGroup && usrFrmData[ctrlSel[0]].properties
    if (ctrlSel[0].startsWith('group')) {
      EventBus.$emit(
        'getGroupSize',
        (divstayleArray: Array<IGroupStyle>) => {
          divstyle = divstayleArray
        }
      )
    }
    const groupIndex: number = divstyle.findIndex(val => val.groupName === ctrlSel[0])
    const newObject = {
      Left: isGroup && groupIndex !== -1 ? parseInt(divstyle[groupIndex].left!) : ctrlProp ? ctrlProp.Left! : 0,
      Top: isGroup && groupIndex !== -1 ? parseInt(divstyle[groupIndex].top!) : ctrlProp ? ctrlProp.Top! : 0,
      Width: isGroup && groupIndex !== -1 ? parseInt(divstyle[groupIndex].width!) : ctrlProp ? ctrlProp.Width! : 0,
      Height: isGroup && groupIndex !== -1 ? parseInt(divstyle[groupIndex].height!) : ctrlProp ? ctrlProp.Height! : 0
    }
    let propValue = 0
    for (let index = 1; index < ctrlSel.length; index++) {
      if (!ctrlSel[index].startsWith('group')) {
        const ctrlProp = usrFrmData[ctrlSel[index]].properties
        if (type === 'Left') {
          if (ctrlProp.Left! <= newObject.Left!) {
            propValue = ctrlProp.Left! - value
          } else {
            propValue = ctrlProp.Left! + value
          }
          this.updateControlProperty(type, propValue, ctrlSel[index])
        } else if (type === 'Top') {
          if (ctrlProp.Top! <= newObject.Top!) {
            propValue = ctrlProp.Top! - value
          } else {
            propValue = ctrlProp.Top! + value
          }
          this.updateControlProperty(type, propValue, ctrlSel[index])
        }
      } else {
        EventBus.$emit('IncDecspacing', ctrlSel[index], type, value)
      }
    }
  }
  getGroupControl (groupName: string) {
    const ctrlContainer = this.selectedControls[this.userFormId].container[0]
    const usrFrmData = this.userformData[this.userFormId]
    const controls = []
    for (const control of usrFrmData[ctrlContainer].controls) {
      if (usrFrmData[control].properties.GroupID === groupName) {
        controls.push(control)
      }
    }
    return controls
  }
  removeSpace (type: keyof controlProperties) {
    const usrFrmData = this.userformData[this.userFormId]
    const ctrlSel = this.selectedControls[this.userFormId].selected
    const ctrlContainer = this.selectedControls[this.userFormId].container[0]
    const controls = usrFrmData[ctrlContainer].controls
    let divstyle: Array<IGroupStyle> = []
    let getGroupIndex = -1
    if (ctrlSel[0].startsWith('group')) {
      EventBus.$emit(
        'getGroupSize',
        (divstayleArray: Array<IGroupStyle>) => {
          divstyle = divstayleArray
        }
      )
      getGroupIndex = divstyle.findIndex(val => val.groupName === ctrlSel[0])
    }
    let propValue = 0
    const leftArray: string[] = []
    const rightArray: string[] = []
    for (let index = 1; index < ctrlSel.length; index++) {
      const selLeft = ctrlSel[0].startsWith('group') ? parseInt(divstyle[getGroupIndex].left!) : usrFrmData[ctrlSel[0]].properties.Left
      const selTop = ctrlSel[0].startsWith('group') ? parseInt(divstyle[getGroupIndex].top!) : usrFrmData[ctrlSel[0]].properties.Top
      if (!ctrlSel[index].startsWith('group')) {
        const ctrlProp = usrFrmData[ctrlSel[index]].properties
        if (type === 'Left') {
          if (ctrlProp.Left! <= selLeft!) {
            leftArray.push(ctrlSel[index])
          } else {
            rightArray.push(ctrlSel[index])
          }
        } else if (type === 'Top') {
          if (ctrlProp.Top! <= selTop!) {
            leftArray.push(ctrlSel[index])
          } else {
            rightArray.push(ctrlSel[index])
          }
        }
      } else {
        EventBus.$emit('getGroupSize', (divstayleArray: Array<IGroupStyle>) => {
          divstyle = divstayleArray
        })
        const getIndex = divstyle.findIndex(val => val.groupName === ctrlSel[index])
        const groupLeft = parseInt(divstyle[getIndex].left!)
        const groupTop = parseInt(divstyle[getIndex].top!)
        const groupConrol = this.getGroupControl(ctrlSel[index])
        if (type === 'Left') {
          if (groupLeft <= selLeft!) {
            for (let ctrl of groupConrol) {
              const prop = this.userformData[this.userFormId][ctrl].properties
              if (Math.floor(prop.Left!) === groupLeft) {
                leftArray.push(ctrl)
              }
            }
          } else {
            for (let ctrl of groupConrol) {
              const prop = this.userformData[this.userFormId][ctrl].properties
              if (Math.floor(prop.Left!) === groupLeft) {
                rightArray.push(ctrl)
              }
            }
          }
        }
      }
    }
    if (ctrlSel[0].startsWith('group')) {
      const getIndex = divstyle.findIndex(val => val.groupName === ctrlSel[0])
      const groupLeft = parseInt(divstyle[getIndex].left!)
      const groupTop = parseInt(divstyle[getIndex].top!)
      const groupConrol = this.getGroupControl(ctrlSel[0])
      if (type === 'Left') {
        for (let ctrl of groupConrol) {
          const prop = this.userformData[this.userFormId][ctrl].properties
          if (Math.floor(prop.Left!) === groupLeft) {
            leftArray.push(ctrl)
            rightArray.push(ctrl)
          }
        }
      }
    } else {
      leftArray.unshift(ctrlSel[0])
      rightArray.push(ctrlSel[0])
    }
    console.log(leftArray, '', rightArray)
    if (type === 'Left') {
      leftArray.sort((a, b) => {
        return usrFrmData[b].properties.Left! - usrFrmData[a].properties.Left!
      })
      rightArray.sort((a, b) => {
        return usrFrmData[a].properties.Left! - usrFrmData[b].properties.Left!
      })
    } else {
      leftArray.sort((a, b) => {
        return usrFrmData[b].properties.Top! - usrFrmData[a].properties.Top!
      })
      rightArray.sort((a, b) => {
        return usrFrmData[a].properties.Top! - usrFrmData[b].properties.Top!
      })
    }
    console.log(leftArray, rightArray)
    for (let index = 1; index < leftArray.length; index++) {
      const prevCtrlProp = usrFrmData[leftArray[index - 1]].properties
      const ctrlProp = usrFrmData[leftArray[index]].properties
      let prevIndex = -1
      let controlPropIndex = -1
      if (type === 'Left') {
        if (prevCtrlProp.GroupID === '' && ctrlProp.GroupID === '') {
          propValue = prevCtrlProp.Left! - ctrlProp.Width!
          this.updateControlProperty(type, propValue, leftArray[index])
        } else {
          if (prevCtrlProp.GroupID !== '') {
            if (ctrlProp.GroupID === '') {
              prevIndex = divstyle.findIndex(val => val.groupName === prevCtrlProp.GroupID)
              propValue = parseInt(divstyle[prevIndex].left!) - ctrlProp.Width!
              this.updateControlProperty(type, propValue, leftArray[index])
            }
          } if (ctrlProp.GroupID !== '') {
            controlPropIndex = divstyle.findIndex(val => val.groupName === ctrlProp.GroupID)
            if (prevCtrlProp.GroupID === '') {
              propValue = prevCtrlProp.Left! - parseInt(divstyle[controlPropIndex].width!)
            } else {
              prevIndex = divstyle.findIndex(val => val.groupName === prevCtrlProp.GroupID)
              propValue = parseInt(divstyle[prevIndex].left!) - parseInt(divstyle[controlPropIndex].width!)
            }
            EventBus.$emit('updasteGroupSize', type, propValue, controlPropIndex)
          }
        }
      }
      /* else {
        propValue = prevCtrlProp.Top! - ctrlProp.Height!
      } */
    }
    for (let index = 1; index < rightArray.length; index++) {
      debugger
      const prevCtrlProp = usrFrmData[rightArray[index - 1]].properties
      const ctrlProp = usrFrmData[rightArray[index]].properties
      let prevIndex = -1
      const controlPropIndex = -1
      if (type === 'Left') {
        if (prevCtrlProp.GroupID === '' && ctrlProp.GroupID === '') {
          propValue = prevCtrlProp.Left! + prevCtrlProp.Width!
          this.updateControlProperty(type, propValue, rightArray[index])
        } else {
          if (prevCtrlProp.GroupID !== '') {
            prevIndex = divstyle.findIndex(val => val.groupName === prevCtrlProp.GroupID)
            propValue = parseInt(divstyle[prevIndex].left!) + parseInt(divstyle[prevIndex].width!)
          } else {
            propValue = prevCtrlProp.Left! + prevCtrlProp.Width!
          }
          if (ctrlProp.GroupID !== '') {
            const getIndex = divstyle.findIndex(val => val.groupName === ctrlProp.GroupID)
            EventBus.$emit('updasteGroupSize', type, propValue, getIndex)
          } else {
            this.updateControlProperty(type, propValue, rightArray[index])
          }
        }
      }
      /* else {
        propValue = prevCtrlProp.Top! - ctrlProp.Height!
      } */
    }
  }
  updatePropVal (propName: string, propValue: number) {
    const ctrlSel = this.selectedControls[this.userFormId].selected
    const usrFrmData = this.userformData[this.userFormId]
    for (let index = 0; index < ctrlSel.length; index++) {
      if (!ctrlSel[index].startsWith('group')) {
        const curProp = usrFrmData[ctrlSel[index]].properties
        if (propName === 'selCenter') {
          const curCenter = curProp.Width! / 2
          const value = propValue - curCenter
          this.updateControlProperty('Left', value, ctrlSel[index])
        }
        if (propName === 'selMiddle') {
          const curMiddle = curProp.Height! / 2
          const value = propValue - curMiddle
          this.updateControlProperty('Top', value, ctrlSel[index])
        }
      } else {
        let divstyle: Array<IGroupStyle> = []
        EventBus.$emit(
          'getGroupSize',
          (divstayleArray: Array<IGroupStyle>) => {
            divstyle = divstayleArray
          }
        )
        const groupIndex = divstyle.findIndex(val => val.groupName === ctrlSel[index])
        const curProp = divstyle[groupIndex]
        const left = parseInt(curProp.left!)
        const top = parseInt(curProp.top!)
        const width = parseInt(curProp.width!)
        const height = parseInt(curProp.height!)
        let value = -1
        if (propName === 'selCenter') {
          value = propValue - (width! / 2)
          EventBus.$emit('updasteGroupSize', 'Left', value, groupIndex)
        }
        if (propName === 'selMiddle') {
          value = propValue - height! / 2
          EventBus.$emit('updasteGroupSize', 'Top', value, groupIndex)
        }
      }
    }
  }
  centreInForm (value: string) {
    let divstyle: Array<IGroupStyle> = []
    const mainContainer = this.selectedControls[this.userFormId].container[0]
    const usrFrmData = this.userformData[this.userFormId]
    const ctrlProp = usrFrmData[mainContainer].properties
    if (value === 'horizontal') {
      const selCenter = ctrlProp.Left! + ctrlProp.Width! / 2
      this.updatePropVal('selCenter', selCenter)
    } else if (value === 'vertical') {
      const selMiddle = ctrlProp.Top! + ctrlProp.Height! / 2
      this.updatePropVal('selMiddle', selMiddle)
    }
  }
  updateControlProperty (
    propertyName: keyof controlProperties,
    propertyValue: number | string,
    controlId: string
  ) {
    this.updateControl({
      userFormId: this.userFormId,
      controlId: controlId,
      propertyName: propertyName,
      value: propertyValue
    })
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
  display: grid;
  grid-template-columns: 30px 150px;
  word-wrap: none;
}

.sub-menu-1 ul {
  display: grid;
  grid-template-columns: 1fr;
  background-color: white;
  width: 200px;
  padding: 0px;
  margin-left: -6px;
}

.sub-menu-1 ul li:hover {
  background-color: rgb(155, 215, 255);
  border-color: rgb(0, 153, 255);
}
</style>
