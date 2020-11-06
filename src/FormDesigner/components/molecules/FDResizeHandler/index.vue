<template>
  <div>
    <div v-for="handlerName in handlers" :key="handlerName">
      <div
        v-if="controlType === 'control'"
        :class="[selectedControl.includes(controlId) || controlId === selectedControls[userFormId].container[0] ? `handle handle-${handlerName}`: null]"
        :style="handlerStyle"
        @mousedown.stop="handleMouseDown($event, handlerName, controlType)"
      ></div>

      <div
        v-else-if="controlType === 'userform'"
        :class="[`userFormHandle userFormHandle-${handlerName}`]"
        @mousedown.stop="handleMouseDown($event, handlerName, controlType)"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
@Component({
  name: 'Resizehandler',
  components: {}
})
export default class Resizehandler extends Vue {
  @State((state) => state.fd.selectedControls) selectedControls!: fdState['selectedControls'];
  @State((state) => state.fd.userformData) userformData!: userformData;

  @Prop({ required: true, type: String }) public controlId!: string;
  @Prop({ required: true, type: String }) public userFormId: string;
  @Prop({ required: true, type: String }) public controlType: string;

  positions: IMousePosition = {
    clientX: 0,
    clientY: 0,
    movementX: 0,
    movementY: 0
  };
  resizeDiv: string = '';

  handlers: Array<String> = ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'];

  isGroupActivated: number = -1
  @Emit('updateResize')
  private updateResize (value: IResizeValue) {
    return value
  }
  @Emit('muldragControl')
  private muldragControl (event: MouseEvent, handler: string) {
    return { event: event, handler: handler }
  }

  @Emit('updateUserFormResize')
  private updateUserFormResize (value: IResizeValue) {
    return value
  }
  @Emit('createGroup')
  createGroup (groupId: string) {
    return groupId
  }

  /**
   * @description Implementation  of Logic for resize and drag the control and userform, it preserve initial position of control/userform position
   * @function handleMouseDown
   * @param event it is type of  MouseEvent
   * @param handler specifies handlerName(for example topLeft, BottomRight etc)
   * @param controlType To differentiate between userform and control resize logic
   */
  handleMouseDown (event: MouseEvent, handler: string, controlType: string) {
    this.isGroupActivated = this.selectedControls[this.userFormId].selected.findIndex((val: string) => val.startsWith('group'))
    if (this.isGroupActivated === -1 || (this.userformData[this.userFormId][this.controlId].properties.GroupID !== '' && this.selectedControl.includes(this.controlId))) {
      this.resizeDiv = handler
      this.positions.clientX = event.clientX
      this.positions.clientY = event.clientY
      document.onmousemove =
      controlType === 'control' ? this.elementDrag : this.userFormResize
      document.onmouseup = this.closeDragElement
    } else {
      this.muldragControl(event, handler)
    }
  }
  /**
   * @description Implementation  of Logic for  resizing the userform
   * @function userFormResize
   * @param event it is type of  MouseEvent
   */
  userFormResize (event: MouseEvent): void {
    event.preventDefault()
    this.positions.movementX = this.positions.clientX - event.clientX
    this.positions.movementY = this.positions.clientY - event.clientY
    this.positions.clientX = event.clientX
    this.positions.clientY = event.clientY

    const decWidth: number =
      this.propControlData.properties.Width! - this.positions.movementX
    const decHeight: number =
      this.propControlData.properties.Height! - this.positions.movementY

    if (decWidth > 102 && decHeight > 29) {
      this.updateUserFormResize({
        x: decWidth,
        y: decHeight,
        handler: this.resizeDiv
      })
    }
  }

  /**
   * @description Implementation  of Logic for resize and drag the control and userform
   * @function elementDrag
   * @param event it is type of  MouseEvent
   */
  elementDrag (event: MouseEvent): void {
    event.preventDefault()
    this.positions.movementX = this.positions.clientX - event.clientX
    this.positions.movementY = this.positions.clientY - event.clientY
    const scale: number = (this.propControlData.properties.Zoom! * 1) / 100
    const scale1: number = (this.propControlData.properties.Zoom! * 10) / 100
    const grid: Array<number> = [scale1, scale1]
    const x: number =
      Math.round(this.positions.movementX / scale / grid[0]) * grid[0]
    const y: number =
      Math.round(this.positions.movementY / scale / grid[1]) * grid[1]

    const diffGridX: number = x - this.positions.movementX
    const diffGridY: number = y - this.positions.movementY

    this.positions.clientX = event.clientX - diffGridX
    this.positions.clientY = event.clientY - diffGridY
    // this.changeResize({ X: gapX, Y: gapY, type: this.resizeDiv })
    this.updateResize({ x: x, y: y, handler: this.resizeDiv })
  }

  /**
   * @description To destory the document event(mouseup,mousemove) attached while drag and resize implementation
   * @function closeDragElement
   */
  closeDragElement (): void {
    document.onmouseup = null
    document.onmousemove = null
    const groupId = this.userformData[this.userFormId][this.controlId]
      .properties.GroupID
    if (groupId !== '') {
      this.createGroup(groupId!)
    }
  }

  /**
   * @description  To get main and sub selected control details by passing
   * userFormId  which is taken as props from parent Component
   * @function selectedControl
   *
   */
  get selectedControl () {
    return this.selectedControls[this.userFormId].selected
  }

  /**
   * @description style object to dynamically changing the styles of  main and sub selected control in case of multiple selection  based on propControlData
   * @function handlerStyle
   *
   */
  get handlerStyle () {
    return {
      backgroundColor:
        this.selectedControl[0] === this.controlId ? 'white' : 'black',
      borderColor:
        this.selectedControl[0] === this.controlId ? 'black' : 'white'
    }
  }

  /**
   * @description propControlData is abstract class providing implementation to resize UserForm by passing
   * userFormId  which is taken as props from parent Component
   * @function propControlData
   *
   */
  get propControlData (): controlData {
    return this.userformData[this.userFormId][this.userFormId]
  }
}
</script>

<style  scoped>
.handle {
  box-sizing: border-box;
  position: absolute;
  width: 6px;
  height: 6px;

  background: white;
  border: 1px solid #333;
}
.handleActivate {
  box-sizing: border-box;
  position: absolute;
  width: 6px;
  height: 6px;

  background: black;
  border: 1px solid white;
}
.handle-tl {
  top: -5px;
  left: -5px;
  cursor: nw-resize;
}
.handle-tm {
  top: -5px;
  left: 50%;
  margin-left: -5px;
  cursor: n-resize;
}
.handle-tr {
  top: -5px;
  right: -5px;
  cursor: ne-resize;
}
.handle-ml {
  top: 50%;
  margin-top: -5px;
  left: -5px;
  cursor: w-resize;
}
.handle-mr {
  top: 50%;
  margin-top: -5px;
  right: -5px;
  cursor: e-resize;
}
.handle-bl {
  bottom: -5px;
  left: -5px;
  cursor: sw-resize;
}
.handle-bm {
  bottom: -5px;
  left: 50%;
  margin-left: -5px;
  cursor: s-resize;
}
.handle-br {
  bottom: -5px;
  right: -5px;
  cursor: se-resize;
}
.userFormHandle {
  box-sizing: border-box;
  position: absolute;
  width: 8px;
  height: 8px;
  background: white;
  border: 1px solid #333;
}
.userFormHandle-tl {
  top: -8px;
  left: -8px;
  cursor: nw-resize;
  background: black;
  border: 1px solid white;
  cursor: default;
}
.userFormHandle-tm {
  top: -9px;
  left: 50%;
  margin-left: -8px;
  cursor: n-resize;
  background: black;
  border: 1px solid white;
  cursor: default;
}
.userFormHandle-tr {
  top: -8px;
  right: -8px;
  cursor: ne-resize;
  background: black;
  border: 1px solid white;
  cursor: default;
}
.userFormHandle-ml {
  top: 50%;
  margin-top: -8px;
  left: -9px;
  background: black;
  border: 1px solid white;
  cursor: default;
}
.userFormHandle-mr {
  top: 50%;
  margin-top: -8px;
  right: -9px;
  cursor: e-resize;
}
.userFormHandle-bl {
  bottom: -8px;
  left: -8px;
  cursor: sw-resize;
  background: black;
  border: 1px solid white;
  cursor: default;
}
.userFormHandle-bm {
  bottom: -9px;
  left: 50%;
  margin-left: -8px;
  cursor: s-resize;
}
.userFormHandle-br {
  bottom: -8px;
  right: -8px;
  cursor: se-resize;
}
</style>
