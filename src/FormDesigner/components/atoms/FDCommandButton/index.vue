<template>
    <button
    class="commandbutton"
    :contenteditable="isContentEditable"
    :style="styleObj"
    :name="properties.Name"
    :tabindex="properties.TabIndex"
    :title="properties.ControlTipText"
    :disabled="properties.Enabled === false || properties.Locked === true"
    @click="commandButtonClick($event)"
    @input="updateCaption"
    @keydown.enter="setContentEditable($event,true)"
    @blur="() => {isClicked=false, setContentEditable($event,false)}"
    >
    <span v-if="properties.Accelerator ===''">
      {{properties.Caption}}
    </span>
    <span v-else>
    <span>{{computedCaption.afterbeginCaption}}</span>
    <span style="text-decoration:underline;">{{computedCaption.acceleratorCaption}}</span>
    <span>{{computedCaption.beforeendCaption}}</span>
    </span>
    </button>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import FdControlVue from '@/api/abstract/FormDesigner/FdControlVue'
import { Action } from 'vuex-class'

@Component({
  name: 'FDCommandButton'
})
export default class FDCommandButton extends Mixins(FdControlVue) {
  $el!: HTMLButtonElement
  isClicked: boolean = false
  isContentEditable : boolean = false
  /**
  * @description commandButtonClick is a method to check the check the clicked functionality of the button tag. Also It sets the variable isClicked based on the Locked property
  * @function commandButtonClick
  *
  */
  commandButtonClick (e: Event) {
    if (this.isActivated) {
      if (this.properties.Locked) {
        this.isClicked = false
      } else {
        this.isClicked = true
      }
    // this.isClicked = !this.properties.Locked
    } else {
      this.selectedItem(e)
    }
  }

  /**
  * @description changes width and height when autoSize is true by getting content offsetWidth
  *  and offsetHeight with the help of Ref attribute
  * @function updateAutoSize
  * @override
  */
  updateAutoSize () {
    if (this.properties.AutoSize === true) {
      this.$nextTick(() => {
        this.updateDataModel({ propertyName: 'Height', value: (this.$el.childNodes[0] as HTMLSpanElement).offsetHeight + 5 })
        this.updateDataModel({ propertyName: 'Width', value: (this.$el.childNodes[0] as HTMLSpanElement).offsetWidth + 5 })
      })
    }
  }

  /**
  * @description watches changes in propControlData to set autoset when true
  * @function autoSize
  * @param oldVal previous propControlData data
  * @param newVal  new/changed propControlData data
  */
  @Watch('properties.AutoSize', { deep: true })
  autoSize (newVal:boolean, oldVal:boolean) {
    // if autoSize is true then height and width value will not get updated
    this.updateAutoSize()
  }

  /**
   * @description mounted initializes the values which are required for the component
   */
  mounted () {
    this.updateAutoSize()
  }

  /**
  * @description style object is passed to :style attribute in button tag
  * dynamically changing the styles of the component based on properties
  * @function styleObj
  */
  protected get styleObj () :Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    const font: font = controlProp.Font ? controlProp.Font : {
      FontName: 'Arial',
      FontSize: 10
    }
    return {
      ...!controlProp.AutoSize && this.renderSize,
      ...this.baseStyle,
      // position: 'relative',
      left: `${controlProp.Left}px`,
      width: `${controlProp.Width}px`,
      height: `${controlProp.Height}px`,
      top: `${controlProp.Top}px`,
      backgroundColor: controlProp.BackColor,
      borderColor: controlProp.BorderColor,
      borderTopColor: (controlProp.Default ? 'black' : controlProp.BackColor),
      borderBottomColor: (controlProp.Default ? 'black' : controlProp.BackColor),
      borderLeftColor: (controlProp.Default ? 'black' : controlProp.BackColor),
      borderRightColor: (controlProp.Default ? 'black' : controlProp.BackColor),
      outline: controlProp.Enabled ? (controlProp.TakeFocusOnClick && this.isClicked ? '1px dotted black' : 'none') : 'none',
      outlineOffset: controlProp.TakeFocusOnClick && this.isClicked ? '-5px' : '0px',
      display: controlProp.Visible ? 'inline-block' : 'none',
      background: controlProp.BackStyle ? controlProp.BackColor : 'transparent',
      color: (controlProp.Enabled === true) ? controlProp.ForeColor : this.getEnabled,
      cursor: (controlProp.MousePointer !== 0 || controlProp.MouseIcon !== '') ? this.getMouseCursorData : 'default',
      fontFamily: font.FontStyle ? font.FontStyle : font.FontName,
      fontSize: `${font.FontSize}px`,
      fontStyle: font.FontItalic ? 'italic' : '',
      textDecoration: (font.FontStrikethrough === true && font.FontUnderline === true) ? 'underline line-through' : font.FontUnderline ? 'underline' : font.FontStrikethrough ? 'line-through' : '',
      fontWeight: font.FontBold ? 'bold' : '',
      whiteSpace: (controlProp.WordWrap ? 'normal' : 'nowrap'),
      wordBreak: (controlProp.WordWrap ? 'break-word' : 'normal'),
      paddingLeft: controlProp.AutoSize ? '0px' : '0px',
      paddingRight: controlProp.WordWrap ? '0px' : '6px',
      backgroundImage: `url(${controlProp.Picture})`,
      backgroundRepeat: this.getRepeat,
      backgroundPosition: this.getPosition,
      backgroundPositionX: this.getPositionX,
      backgroundPositionY: this.getPositionY
    }
  }
}
</script>

<style scoped>
.commandbutton {
  overflow: hidden;
  display:inline-block;
}
</style>
