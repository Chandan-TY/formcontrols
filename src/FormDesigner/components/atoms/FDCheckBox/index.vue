<template>
  <div
    :title="properties.ControlTipText"
    class="outer-check"
    :style="cssStyleProperty"
    @click.stop="selectedItem"
  >
      <label class="control">
        <input
          @change="handleChange($event, checkboxRef)"
          ref="checkboxInput"
          :name="properties.Name"
          :tabindex="properties.TabIndex"
          :disabled="properties.Locked || !properties.Enabled"
          type="checkbox"
          class="control-input visually-hidden"/>
        <span class="control-indicator"
          :style="{boxShadow: this.properties.SpecialEffect === 0 ? '0px 0px gray' : '-1px -1px gray'}"
        ></span></label>
    <div>
      <div ref="divAutoSize" :style="divcssStyleProperty">
        <span
          :style="spancssStyleProperty"
          v-if="properties.Accelerator === ''"
        >
         {{properties.Caption}}
        </span>
        <span :style="spancssStyleProperty" v-else v-html="getAccelerator"> </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Mixins, Watch } from 'vue-property-decorator'
import FdControlVue from '@/api/abstract/FormDesigner/FdControlVue'

@Component({
  name: 'FDCheckBox'
})
export default class FDCheckBox extends Mixins(FdControlVue) {
  @Ref('checkboxInput') checkboxRef! : HTMLInputElement
  @Ref('divAutoSize') autoSizecheckbox! : HTMLDivElement

  /**
   * @description style object is passed to :style attribute in label tag
   * dynamically changing the styles of the component based on properties
   * @function cssStyleProperty
   *
   */
  get cssStyleProperty () {
    const controlProp = this.properties
    const font: font = controlProp.Font
      ? controlProp.Font
      : {
        FontName: 'Arial',
        FontSize: 10
      }
    return {
      left: `${controlProp.Left}px`,
      width: `${controlProp.Width}px`,
      height: `${controlProp.Height}px`,
      top: `${controlProp.Top}px`,
      backgroundColor: controlProp.BackColor,
      borderColor: controlProp.BorderColor,
      border: this.getBorderStyle,
      background: controlProp.BackStyle ? controlProp.BackColor : 'transparent',
      whiteSpace: controlProp.WordWrap ? 'normal' : 'nowrap',
      wordBreak: controlProp.WordWrap ? 'break-word' : 'normal',
      color:
        controlProp.Enabled === true
          ? controlProp.ForeColor
          : this.getEnabled,
      cursor:
        controlProp.MousePointer !== 0 || controlProp.MouseIcon !== ''
          ? this.getMouseCursorData
          : 'default',
      // Fix Font.FontSize, Font.FontItalic ...
      fontFamily: font.FontStyle ? font.FontStyle : font.FontName,
      fontSize: `${font.FontSize}px`,
      fontStyle: font.FontItalic ? 'italic' : '',
      fontWeight: font.FontBold ? 'bold' : '',
      // position: 'relative',
      display: controlProp.Visible ? 'grid' : 'none',
      direction: controlProp.Alignment ? 'ltr' : 'rtl',
      overflow: 'hidden',
      gridTemplateColumns: '12px auto ',
      gap: '2px',
      alignItems: (font.FontSize! > 17) ? 'center' : '',
      alignContent: 'center',
      boxShadow: 'none'
    }
  }

  /**
   * @description style object is passed to :style attribute in span tag
   * dynamically changing the styles of the component based on properties
   * @function spancssStyleProperty
   *
   */
  get spancssStyleProperty () {
    const controlProp = this.properties
    const font: font = controlProp.Font
      ? controlProp.Font
      : {
        FontName: 'Arial',
        FontSize: 10
      }
    return {
      cursor:
        controlProp.MousePointer !== 0 || controlProp.MouseIcon !== ''
          ? this.getMouseCursorData
          : 'default',
      textAlign:
        controlProp.TextAlign === 0
          ? 'left'
          : controlProp.TextAlign === 1
            ? 'center'
            : 'right',
      textDecoration:
        font.FontStrikethrough === true && font.FontUnderline === true
          ? 'underline line-through'
          : font.FontUnderline
            ? 'underline'
            : font.FontStrikethrough
              ? 'line-through'
              : ''
    }
  }

  /**
   * @description style object is passed to :style attribute in div tag
   * dynamically changing the styles of the component based on properties
   * @function divcssStyleProperty
   *
   */
  get divcssStyleProperty () {
    const controlProp = this.properties
    return {
      overflow: 'hidden',
      textAlign: controlProp.TextAlign === 0 ? 'left' : controlProp.TextAlign === 1 ? 'center' : 'right',
      backgroundImage: `url(${controlProp.Picture})`,
      backgroundRepeat: this.getRepeat,
      backgroundPosition: this.getPosition,
      backgroundPositionX: this.getPositionX,
      backgroundPositionY: this.getPositionY
    }
  }
  /**
   * @override
   */
  @Watch('properties.AutoSize', { deep: true })
  updateAutoSize (newVal:boolean, oldVal:boolean) {
    if (this.properties.AutoSize) {
      this.$nextTick(() => {
        let divRef:HTMLDivElement = this.autoSizecheckbox
        const offsetWidth = (divRef.childNodes[0] as HTMLSpanElement).offsetWidth
        const offsetHeight = (divRef.childNodes[0] as HTMLSpanElement).offsetHeight
        // Value 10 for checkbox, 4 for Gap style value, and offsetHeight and offsetWidth + 1
        this.updateDataModel({ propertyName: 'Width', value: 10 + 4 + offsetWidth + 1 })
        this.updateDataModel({ propertyName: 'Height', value: 10 + 4 + offsetHeight + 1 })
      })
    }
  }
  mounted () {
    this.controlSource()
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.outer-check {
  /* position: relative; */
  height: 30px;
  width: 150px;
  min-width: 12px;
  min-height: 13px;
  background-color: rgb(238, 238, 238);
  box-shadow: -1px -1px gray;
  overflow: hidden;
  align-items: center;
}
.visually-hidden {
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}
.control {
  /* position: absolute; */
  /* top: 20%;
  left: 10px; */
  display: inline-flex;
  /* align-items: center; */
}
.control-indicator {
  width: 10px;
  height: 10px;
  margin: 1px;
  /* margin-right: 6px; */
  background-color: white;
  border: 1px inset grey;
}

.control-input:checked ~ .control-indicator {
  background-image: url(../../../../assets/checkmark.png);
  background-size: 10px;
  background-position: center;
  background-repeat: no-repeat;
}
/* .checkbox {
   top: 1px;
   position: static;
}
.lable-text{
  overflow: hidden;
} */
/*  */
/* .flex-container {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
} */
/* asd */
.menu {
  width: 10%;
  margin: 0 auto
}

.main {
  width: 90%;
  margin: 0 auto
}
</style>
