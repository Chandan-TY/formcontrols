import { Prop, Vue } from 'vue-property-decorator'
import { controlProperties } from '@/FormDesigner/controls-properties'
import FdControlVue from './FdControlVue'
import { Action, State } from 'vuex-class'
import { IaddControl, IchangeToolBoxSelect, IdeleteControl, IselectControl, IupdateCopyControlList, IupdateGroup } from '@/storeModules/fd/actions'

import { controlContextMenu } from '@/FormDesigner/models/controlContextMenuData'
import { userformContextMenu } from '@/FormDesigner/models/userformContextMenuData'
import { ControlPropertyData } from '@/FormDesigner/models/ControlsTableProperties/ControlPropertyData.ts'

export default abstract class FdContainerVue extends FdControlVue {
    @Prop({ required: true, type: String }) public readonly userFormId! : string
    @Prop({ required: true, type: String }) public readonly containerId! : string

    @State((state: rootState) => state.fd.toolBoxSelect) toolBoxSelect!: fdState['toolBoxSelect'];
    @State((state) => state.fd.copyControlList) copyControl!: copyControl;
    @State((state) => state.fd.userformData) userformData!: userformData;
    @State((state) => state.fd.selectedControls) selectedControls!: fdState['selectedControls'];
    @State(state => state.fd.groupedControls) groupedControls!: fdState['groupedControls']

    @Action('fd/changeToolBoxSelect') changeToolBoxSelect!: (payload: IchangeToolBoxSelect) => void;
    @Action('fd/selectControl') selectControl!: (payload: IselectControl) => void;
    @Action('fd/addControl') addControl!: (payload: IaddControl) => void;
    @Action('fd/updateCopyControlList') updateCopyControlList!: (payload: IupdateCopyControlList) => void
    @Action('fd/deleteControl') deleteControl!: (payload: IdeleteControl) => void
    @Action('fd/updateGroup') updateGroup!: (payload: IupdateGroup) => void

    contextMenuType: boolean = false;
    viewMenu?: boolean = false
    top: string= '0px'
    left: string ='0px'

    controlContextMenu: Array<IcontextMenu> = controlContextMenu;
    userformContextMenu: Array<IcontextMenu> = userformContextMenu;
    selectedControlArray: Array<string> = [];
    selectedAreaStyle: ISelectedArea | undefined

    /**
   * @description  close the contextMenu
   * @function closeMenu
   * @param this  - container Vue Component
   * @event click
   */
    closeMenu (this: this) {
      this.viewMenu = false
    }

    /**
   * @description  add the control to its respective  container
   * @function addControlObj
   * @param event  - it is of type MouseEvent
   * @param userFormId - selected Userform
   * @event click
   */
    addControlObj (e: MouseEvent) {
      const controlPropData = new ControlPropertyData()
      if (this.toolBoxSelect !== 'Select' && this.toolBoxSelect !== '') {
        let lastControlId = -1
        const userformControlIds = Object.keys(this.userformData[this.userFormId])
        const selectStringLen = this.toolBoxSelect.length
        for (let i = 0; i < userformControlIds.length; i++) {
          if (userformControlIds[i].indexOf(this.toolBoxSelect) !== -1) {
            const IdNum =
            userformControlIds[i].split(this.toolBoxSelect).pop() || '-1'
            const pasreId = parseInt(IdNum, 10)
            if (!isNaN(pasreId) && lastControlId < pasreId) {
              lastControlId = pasreId
            }
          }
        }
        let controlObj = controlPropData.data[this.toolBoxSelect]
        const item = JSON.parse(JSON.stringify(controlObj!))
        lastControlId += 1
        item.properties.ID = `ID_${this.toolBoxSelect}${lastControlId}`
        const sw = parseInt(this.selectedAreaStyle!.width!)
        const sh = parseInt(this.selectedAreaStyle!.height)

        item.properties.Left = sw! === 0 ? e.offsetX : parseInt(this.selectedAreaStyle!.left)
        item.properties.Top = sw! === 0 ? e.offsetY : parseInt(this.selectedAreaStyle!.top)
        item.properties.Width = sw! === 0 ? item.properties.Width : sw
        item.properties.Height = sw! === 0 ? item.properties.Height : sh

        this.addControl({
          userFormId: this.userFormId,
          controlId!: this.controlId,
          addId: item.properties.ID,
          item: item
        })
      }
      this.changeToolBoxSelect('Select')
    }

    /**
   * @description  deactivate the all control present in container
   * @function deActiveControl
   * @param this  - VueComponent of container
   * @event mousedown
   */
    deActiveControl (this: this) {
      this.selectControl({
        userFormId: this.userFormId,
        select: { container: [this.controlId], selected: [this.controlId] }
      })
    }
}
