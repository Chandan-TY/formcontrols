<template>
  <div
    :title="properties.ControlTipText"
    class="outer-check"
    :style="cssStyleProperty"
    @click="selectedItem"
  >
    <!-- <div :class="properties.Width>100 ? 'label-outer-div' : ''"> -->
      <label class="control"
        ><input
           @change="handleChange($event, optionBtnRef)"
           ref="optBtnInput"
          :name="properties.Name"
          :tabindex="properties.TabIndex"
          :disabled="properties.Locked || !properties.Enabled"
          type="checkbox"
          class="control-input visually-hidden"/>
        <span class="control-indicator"
         :style="{boxShadow: this.properties.SpecialEffect === 0 ? '0px 0px gray' : '-1px -1px gray', border: this.properties.SpecialEffect === 0 ? '1px solid gray' : ''}"
         ></span></label>
    <!-- </div> -->
    <div>
      <div ref="divAutoSize" :style="divcssStyleProperty">
        <span
          :style="spancssStyleProperty"
          v-if="properties.Accelerator === ''"
        >
         {{properties.Caption}}
        </span>
        <!-- <span :style="spancssStyleProperty" v-else v-html="getAccelerator"> </span> -->
        <span v-else :style="spancssStyleProperty">
    <span>{{computedCaption.afterbeginCaption}}</span>
    <span style="text-decoration:underline;">{{computedCaption.acceleratorCaption}}</span>
    <span>{{computedCaption.beforeendCaption}}</span>
    </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Mixins, Watch } from 'vue-property-decorator'
import FdControlVue from '@/api/abstract/FormDesigner/FdControlVue'
@Component({
  name: 'FDOptionButton'
})
export default class FDOptionButton extends Mixins(FdControlVue) {
   @Ref('divAutoSize') readonly autoSizeOptionButton! : HTMLDivElement
   @Ref('optBtnInput') optionBtnRef! : HTMLDivElement

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
       //  position: 'relative',
       display: controlProp.Visible ? 'grid' : 'none',
       direction: controlProp.Alignment ? 'ltr' : 'rtl',
       overflow: 'hidden',
       gridTemplateColumns: '14px auto ',
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
         let divRef:HTMLDivElement = this.autoSizeOptionButton
         const offsetWidth = (divRef.childNodes[0] as HTMLSpanElement).offsetWidth
         const offsetHeight = (divRef.childNodes[0] as HTMLSpanElement).offsetHeight
         // Value 14 for OptionButton, 2 for Gap style value, and offsetHeight and offsetWidth + 3
         this.updateDataModel({ propertyName: 'Width', value: 14 + 2 + offsetHeight + 1 })
         this.updateDataModel({ propertyName: 'Height', value: 14 + 2 + offsetWidth + 1 })
       })
     }
   }

  mounted () {
    this.controlSource()
  }
}
</script>

<style scoped>

.container {
  /* position: relative; */
  left: 100px;
  top: 100px;
}
.outer-check {
  /* position: relative; */
  height: 30px;
  width: 150px;
  min-width: 14px;
  min-height: 15px;
  background-color: rgb(238, 238, 238);
  box-shadow: -1px -1px gray;
  overflow: hidden;
  align-items: center;
}

/* .label-outer-div {
  position: relative;
  top: -13%;
} */

.radio {
  background-color: rgb(238, 238, 238);
  /* border: 0.2px solid gray; */
 box-shadow: 0.1px 0.1px 1px 1px gray;
  width: 150px;
  height: 23px;
}
.radio-input {
    /* float: left; */
    /* padding-top:5px; */
    margin: 0px 0px 0px 5px;
}
.radio-label{
    float: left;
    font-size: 11px;
    padding-top: 5px;
    /* font-weight: 550; */
}
/*  */
.outer-option {
  position: relative;
  height: 30px;
  width: 150px;
  background-color: rgb(238, 238, 238);
  box-shadow: -1px -1px gray;
  overflow: hidden;
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
  display: inline-flex;
  /* align-items: center; */
  /* position: absolute; */
  /* top: 20%; */
  /* left: 10px; */
}

.control-indicator {
  width: 10px;
  height: 10px;
  margin-left: 3px;
  border-radius: 14px;
  background-color: white;
}

.control-input:checked ~ .control-indicator {
  background-image: url(../../../../assets/optionmark-img.png);
  background-size: 5px;
  border-radius: 50%;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
