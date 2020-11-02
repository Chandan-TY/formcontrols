<template>
  <div v-if="groupedControls[userFormId].groupArray.length!==0">
   <div
      v-for="groupName in groupedControls[userFormId].groupArray"
      :class="[getGroupEditStyle(groupName)? 'mainEditDiv' : 'mainDiv']"
      :key="groupName"
      :ref="groupName"
      :style="getGroupStyle(groupName)"
      @mousedown.stop="handleMouseDown($event,'drag')"
    >
    <div class="handle handle-tl" @mousedown.stop="handleMouseDown($event,'tl')"></div>
      <div class="handle handle-tr" @mousedown.stop="handleMouseDown($event,'tr')"></div>
      <div class="handle handle-tm" @mousedown.stop="handleMouseDown($event,'tm')"></div>
      <div class="handle handle-ml" @mousedown.stop="handleMouseDown($event,'ml')"></div>
      <div class="handle handle-mr" @mousedown.stop="handleMouseDown($event,'mr')"></div>
      <div class="handle handle-bl" @mousedown.stop="handleMouseDown($event,'bl')"></div>
      <div class="handle handle-br" @mousedown.stop="handleMouseDown($event,'br')"></div>
      <div class="handle handle-bm" @mousedown.stop="handleMouseDown($event,'bm')"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { IselectControl, IupdateControl, IupdateGroup } from '@/storeModules/fd/actions'
import { State, Action } from 'vuex-class'
@Component({
  name: 'GroupControl',
  components: {
  }
})
export default class GroupControl extends Vue {
  @State(state => state.fd.groupedControls) groupedControls!: groupedControls
  @State((state) => state.fd.selectedControls) selectedControls!: fdState['selectedControls'];
  @State((state) => state.fd.userformData) userformData!: userformData;

  @Prop({ required: true, type: Array }) public currentSelectedGroup!: string[]
  @Prop({ required: true, type: String }) public userFormId! : string
  @Prop() controlRef: any

  @Action('fd/updateControl') updateControl!: (payload: IupdateControl) => void;
  @Action('fd/updateGroup') updateGroup!: (payload: IupdateGroup) => void
  @Action('fd/selectControl') selectControl!: (payload: IselectControl) => void;

  divStyleArray: Array<IGroupStyle> = [];
  resizeDiv: string = '';

  positions: IMousePosition = {
    clientX: 0,
    clientY: 0,
    movementX: 0,
    movementY: 0
  };
  groupName: string=''
  count: number= 0

  createGroup (groupName: string) {
    this.groupStyle(groupName)
  }
  mounted () {
    // const initialGroup: string[] = []
    // for (const key in this.userformData[this.userFormId]) {
    //   const groupId = this.userformData[this.userFormId][key].properties.GroupID
    //   if (groupId && !initialGroup.includes(groupId)) {
    //     initialGroup.push(groupId)
    //   }
    // }
    // this.updateGroup({ userFormId: this.userFormId, groupArray: initialGroup })
    // for (const i of initialGroup) {
    //   this.groupStyle(i)
    // }
  }
  topArray: number[] = [];
  leftArray: number[] = [];

  percwidthArray: number[] = [];
  percheightArray: number[] = [];

  initialArray: Array<IGroupStyle> =[]

  updateControlAction (propertyName: keyof controlProperties, propertyValue: number, controlId: string) {
    this.updateControl({
      userFormId: this.userFormId,
      controlId: controlId,
      propertyName: propertyName,
      value: propertyValue
    })
  }
  groupStyle (groupName: string) {
    this.count += 1
    let index = this.divStyleArray.findIndex((p: IGroupStyle) => p.groupName === groupName)
    if (index === -1) {
      this.divStyleArray.push({
        left: '0px',
        top: '0px',
        width: '0px',
        height: '0px',
        display: 'none',
        groupName: groupName
      })
    }
    const styleLeft: number[] = []
    const styleWidth: number[] = []
    const styleTop: number[] = []
    const styleHeight: number[] = []
    for (const control of this.userformData[this.userFormId][this.userFormId].controls) {
      if (this.userformData[this.userFormId][control].properties.GroupID === groupName) {
        const controlprop = this.userformData[this.userFormId][control].properties
        styleLeft.push(controlprop.Left!)
        styleTop.push(controlprop.Top!)
        styleWidth.push(controlprop.Width! + controlprop.Left!)
        styleHeight.push(controlprop.Height! + controlprop.Top!)
      }
    }
    index = this.divStyleArray.findIndex((p: IGroupStyle) => p.groupName === groupName)
    this.divStyleArray[index].left = `${Math.min(...styleLeft)}px`
    this.divStyleArray[index].top = `${Math.min(...styleTop)}px`
    this.divStyleArray[index].width = `${Math.max(...styleWidth) - Math.min(...styleLeft)}px`
    this.divStyleArray[index].height = `${Math.max(...styleHeight) - Math.min(...styleTop)}px`

    this.topArray = []
    this.leftArray = []

    this.percwidthArray = []
    this.percheightArray = []

    for (const control of this.userformData[this.userFormId][this.userFormId].controls) {
      const controlProp = this.userformData[this.userFormId][control].properties
      if (controlProp.GroupID !== '') {
        for (const divStyle of this.divStyleArray) {
          if (controlProp.GroupID === divStyle.groupName) {
            this.topArray.push(controlProp.Top! - parseInt(divStyle.top!))

            this.leftArray.push(controlProp.Left! - parseInt(divStyle.left!))

            this.percheightArray.push(controlProp.Height! / parseInt(divStyle.height!))

            this.percwidthArray.push(controlProp.Width! / parseInt(divStyle.width!))
          }
        }
      } else {
        this.topArray.push(controlProp.Top!)

        this.leftArray.push(controlProp.Left!)

        this.percheightArray.push(controlProp.Height!)

        this.percwidthArray.push(controlProp.Width!)
      }
    }
    this.initialArray = []
    for (let k = 0; k < this.divStyleArray.length; k++) {
      this.initialArray.push(Object.assign({}, this.divStyleArray[k]))
    }
  }

  deActGroupControl () {
    const selControl = this.selectedControls[this.userFormId].selected
    if (this.currentSelectedGroup.length === 1 && selControl.length === 1 && !selControl[0].startsWith('group')) {
      const controlId = this.selectedControls[this.userFormId].selected[0]
      if (this.currentSelectedGroup[0] === this.userformData[this.userFormId][controlId].properties.GroupID!) {
        this.selectControl({
          userFormId: this.userFormId,
          select: { container: [this.userFormId], selected: [this.currentSelectedGroup[0]] }
        })
      }
    }
  }
  handleMouseDown (event: MouseEvent, handler: string) {
    this.deActGroupControl()
    this.resizeDiv = handler
    this.positions.clientX = event.clientX
    this.positions.clientY = event.clientY
    document.onmousemove = this.elementDrag
    document.onmouseup = this.closeDragElement
  }

  elementDrag (event: MouseEvent): void {
    event.preventDefault()
    this.positions.movementX = this.positions.clientX - event.clientX
    this.positions.movementY = this.positions.clientY - event.clientY
    const scale: number = 1
    const grid: Array<number> = [10, 10]
    const x: number = Math.round((this.positions.movementX / scale) / grid[0]) * grid[0]
    const y: number = Math.round((this.positions.movementY / scale) / grid[1]) * grid[1]

    const diffGridX: number = x - this.positions.movementX
    const diffGridY: number = y - this.positions.movementY

    this.positions.clientX = event.clientX - diffGridX
    this.positions.clientY = event.clientY - diffGridY

    let dragResizeRef: IdragResizeRefStyle = { offsetTop: 0, offsetLeft: 0 }
    let dragResizeControl: IGroupStyle = {}
    let dragResizeControl1: controlProperties = { ID: '' }

    for (let i = 0; i < this.divStyleArray.length; i++) {
      this.groupName = this.divStyleArray[i].groupName!
      dragResizeRef = (this.$refs as IdragResizeRef)[this.groupName][0 as number]
      dragResizeControl = this.divStyleArray[i]
      if (dragResizeControl.display === 'block') {
        let top: number = -1
        let left: number = -1
        let incWidth: number = -1
        let incHeight: number = -1
        let decWidth: number = -1
        let decHeight: number = -1
        top = parseInt(dragResizeControl.top!) - y
        left = parseInt(dragResizeControl.left!) - x
        incWidth = (parseInt(dragResizeControl.width!) + x) > 0 ? (parseInt(dragResizeControl.width!) + x) : 0
        incHeight = (parseInt(dragResizeControl.height!) + y) > 0 ? (parseInt(dragResizeControl.height!) + y) : 0
        decWidth = (parseInt(dragResizeControl.width!) - x) > 0 ? (parseInt(dragResizeControl.width!) - x) : 0
        decHeight = (parseInt(dragResizeControl.height!) - y) > 0 ? (parseInt(dragResizeControl.height!) - y) : 0

        if (this.resizeDiv === 'drag') {
          dragResizeControl.top = `${top}px`
          dragResizeControl.left = `${left}px`
        } else {
          if (this.resizeDiv.includes('t')) {
            if (incHeight > 0) {
              dragResizeControl.top = `${top}px`
            }
            dragResizeControl.height = `${incHeight}px`
          } else if (this.resizeDiv.includes('b')) {
            dragResizeControl.height = `${decHeight}px`
          }

          if (this.resizeDiv.includes('l')) {
            if (incWidth > 0) {
              dragResizeControl.left = `${left}px`
            }
            dragResizeControl.width = `${incWidth}px`
          } else if (this.resizeDiv.includes('r')) {
            dragResizeControl.width = `${decWidth}px`
          }
        }
        for (const j in this.userformData[this.userFormId][this.userFormId].controls) {
          const index = this.userformData[this.userFormId][this.userFormId].controls[j]
          const controlProp = this.userformData[this.userFormId][index].properties

          let top: number = (parseInt(dragResizeControl.height!) * this.topArray[j]) /
                parseInt(this.initialArray[i].height!) + parseInt(this.initialArray[i].top!)

          let height: number = parseInt(dragResizeControl.height!) * this.percheightArray[j]

          let left: number = (parseInt(dragResizeControl.width!) * this.leftArray[j]) /
                parseInt(this.initialArray[i].width!) + parseInt(this.initialArray[i].left!)

          let width: number = parseInt(dragResizeControl.width!) * this.percwidthArray[j]

          let right: number = (parseInt(dragResizeControl.width!) * this.leftArray[j]) /
                parseInt(this.initialArray[i].width!) + parseInt(dragResizeControl.left!)

          let bottom: number = (parseInt(dragResizeControl.height!) * this.topArray[j]) /
                parseInt(this.initialArray[i].height!) + parseInt(dragResizeControl.top!)
          if (controlProp.GroupID === this.divStyleArray[i].groupName &&
          this.divStyleArray[i].display === 'block'
          ) {
            dragResizeControl1 = controlProp
            if (this.resizeDiv === 'drag') {
              top = dragResizeControl1.Top! - y
              left = dragResizeControl1.Left! - x
              this.updateControlAction('Top', top, index)
              this.updateControlAction('Left', left, index)
            } else {
              if (this.resizeDiv.includes('t')) {
                this.updateControlAction('Top', bottom, index)
                this.updateControlAction('Height', height, index)
              } else if (this.resizeDiv.includes('b')) {
                this.updateControlAction('Top', top, index)
                this.updateControlAction('Height', height, index)
              }
              if (this.resizeDiv.includes('l')) {
                this.updateControlAction('Left', right, index)
                this.updateControlAction('Width', width, index)
              } else if (this.resizeDiv.includes('r')) {
                this.updateControlAction('Left', left, index)
                this.updateControlAction('Width', width, index)
              }
            }
          }
        }
      }
    }
    for (let k of this.selectedControls[this.userFormId].selected) {
      if (!k.startsWith('ID_USERFORM') && !k.startsWith('group')) {
        let dragResizeReffer: any = ''
        const control: controlProperties = this.userformData[this.userFormId][k].properties
        for (const key in this.controlRef.resizeControl) {
          if (this.controlRef.resizeControl[key].$refs['draRef'.concat(control.ID)] !== undefined) {
            dragResizeReffer = this.controlRef.resizeControl[key].$refs['draRef'.concat(control.ID)]
          }
        }
        console.log(dragResizeReffer)
        const top = (dragResizeReffer.offsetTop!) - y
        const left = (dragResizeReffer.offsetLeft!) - x
        const incWidth = (control.Width! + x) > 0 ? (control.Width! + x) : 0
        const incHeight = (control.Height! + y) > 0 ? (control.Height! + y) : 0
        const decWidth = (control.Width! - x) > 0 ? (control.Width! - x) : 0
        const decHeight = (control.Height! - y) > 0 ? (control.Height! - y) : 0

        if (this.resizeDiv === 'drag') {
          this.updateControlAction('Top', top, k)
          this.updateControlAction('Left', left, k)
        } else {
          if (this.resizeDiv.includes('t')) {
            if (incHeight > 0) {
              this.updateControlAction('Top', top, k)
            }
            this.updateControlAction('Height', incHeight, k)
          } else if (this.resizeDiv.includes('b')) {
            this.updateControlAction('Height', decHeight, k)
          }
          if (this.resizeDiv.includes('l')) {
            if (incWidth > 0) {
              this.updateControlAction('Left', left, k)
            }
            this.updateControlAction('Width', incWidth, k)
          } else if (this.resizeDiv.includes('r')) {
            this.updateControlAction('Width', decWidth, k)
          }
        }
      }
    }
  }

  closeDragElement (): void {
    document.onmouseup = null
    document.onmousemove = null
    this.groupStyle('group1')
  }
  getGroupEditStyle (groupName: string) {
    debugger
    const selected = this.selectedControls[this.userFormId].selected
    return selected.length === 1 && !selected[0].startsWith('group') && this.userformData[this.userFormId][selected[0]].properties.GroupID === groupName
  }
  getGroupStyle (groupName: string) {
    return this.divStyleArray[this.divStyleArray.findIndex(p => p.groupName === groupName)]
  }

  @Watch('selectedControls', { deep: true })
  updateGroupStyle () {
    for (const index in this.divStyleArray) {
      this.divStyleArray[index].display = 'none'
    }
    const selected = this.currentSelectedGroup
    const selControl = this.selectedControls[this.userFormId].selected
    if (selControl.length > 1) {
      for (const val of selControl) {
        if (val.startsWith('group') && selControl.includes(val)) {
          const index = this.divStyleArray.findIndex(p => p.groupName === val)
          this.divStyleArray[index].display = 'block'
        }
      }
    } else {
      if (selControl[0].startsWith('group') || (!selControl[0].startsWith('group') && selected.includes(this.userformData[this.userFormId][selControl[0]].properties.GroupID!))) {
        if (selControl[0].startsWith('group')) {
          const index = this.divStyleArray.findIndex(p => p.groupName === selControl[0])
          this.divStyleArray[index].display = 'block'
        } else {
          const index = this.divStyleArray.findIndex(p => p.groupName === this.userformData[this.userFormId][selControl[0]].properties.GroupID!)
          this.divStyleArray[index].display = 'block'
        }
      }
    }
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
.mainDiv {
 position: absolute;
  --border-width: 5;
  --stripe-distance: 2px;
  border: calc(var(--border-width) * 1px) solid transparent;
  border-image: repeating-linear-gradient( -110deg, black, transparent 1px, transparent var(--stripe-distance), black calc(var(--stripe-distance) + 0.2px) ) var(--border-width);
  padding: 5px;
  margin-top: -5px;
  margin-left: -5px;
  display: none;
}
.mainEditDiv
{
  position: absolute;
  --border-width: 5;
  --stripe-distance: 2px;
  border: calc(var(--border-width) * 1px) solid transparent;
  border-image: repeating-linear-gradient(
      -45deg,
      black,
      transparent 2px,
      transparent var(--stripe-distance),
      black calc(var(--stripe-distance) + 0.2px)
    )
    var(--border-width);
  padding: 5px;
  margin-top: -5px;
  margin-left: -5px;
  display: none;
}
.handle {
  box-sizing: border-box;
  position: absolute;
  width: 6px;
  height: 6px;
  background: white;
  border: 1px solid #333;
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

</style>
