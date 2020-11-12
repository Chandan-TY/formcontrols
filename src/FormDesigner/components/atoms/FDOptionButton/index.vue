<template>
  <div
    :title="properties.ControlTipText"
    class="outer-check"
    :style="cssStyleProperty"
    @click="selectedItem"
  >
    <label class="control"
      ><input
        @change="handleChange($event, optionBtnRef)"
        ref="optBtnInput"
        :name="properties.Name"
        :tabindex="properties.TabIndex"
        :disabled="getDisableValue"
        type="radio"
        class="control-input visually-hidden" />
      <span class="control-indicator" :style="controlIndicatorStyleObj"></span
    ></label>
    <div>
      <div ref="divAutoSize" :style="divcssStyleProperty">
        <span v-if="!syncIsEditMode || isRunMode" @click="makeChecked">
          <span>{{ computedCaption.afterbeginCaption }}</span>
          <span class="spanClass">{{
            computedCaption.acceleratorCaption
          }}</span>
          <span>{{ computedCaption.beforeendCaption }}</span>
        </span>
        <FDEditableText
          v-else
          class="editText"
          :editable="isRunMode === false && syncIsEditMode"
          :caption="properties.Caption"
          @updateCaption="updateCaption"
          @releaseEditMode="setContentEditable($event, false)"
        >
        </FDEditableText>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Mixins, Watch } from 'vue-property-decorator'
import FdControlVue from '@/api/abstract/FormDesigner/FdControlVue'
import FDEditableText from '@/FormDesigner/components/atoms/FDEditableText/index.vue'

@Component({
  name: 'FDOptionButton',
  components: {
    FDEditableText
  }
})
export default class FDOptionButton extends Mixins(FdControlVue) {
  @Ref('divAutoSize') readonly autoSizeOptionButton!: HTMLDivElement;
  @Ref('optBtnInput') optionBtnRef!: HTMLDivElement;

  get getDisableValue () {
    if (this.isRunMode) {
      return this.properties.Enabled === false || this.properties.Locked
    } else {
      return true
    }
  }

  makeChecked () {
    if (this.isRunMode) {
      const checkDiv = this.$refs.optBtnInput as HTMLInputElement
      checkDiv.checked = true
    }
  }
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
    let display = ''
    if (this.isRunMode) {
      display = controlProp.Visible ? 'grid' : 'none'
    } else {
      display = 'grid'
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
        controlProp.Enabled === true ? controlProp.ForeColor : this.getEnabled,
      cursor:
        controlProp.MousePointer !== 0 || controlProp.MouseIcon !== ''
          ? this.getMouseCursorData
          : 'default',
      // Fix Font.FontSize, Font.FontItalic ...
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
      //  position: 'relative',
      display: display,
      direction: controlProp.Alignment ? 'ltr' : 'rtl',
      overflow: 'hidden',
      gridTemplateColumns: '14px auto ',
      gap: '2px',
      alignItems: font.FontSize! > 17 ? 'center' : '',
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
   * @description style object is passed to :style attribute in span tag
   * dynamically changing the styles of the component based on properties
   * @function controlIndicatorStyleObj
   *
   */
  get controlIndicatorStyleObj () {
    const controlProp = this.properties
    return {
      boxShadow:
        controlProp.SpecialEffect === 0 ? '0px 0px gray' : '-1px -1px gray',
      border: controlProp.SpecialEffect === 0 ? '1px solid gray' : ''
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
      textAlign:
        controlProp.TextAlign === 0
          ? 'left'
          : controlProp.TextAlign === 1
            ? 'center'
            : 'right',
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
  updateAutoSize (newVal: boolean, oldVal: boolean) {
    if (this.properties.AutoSize) {
      this.$nextTick(() => {
        let divRef: HTMLDivElement = this.autoSizeOptionButton
        const offsetWidth = (divRef.childNodes[0] as HTMLSpanElement)
          .offsetWidth
        const offsetHeight = (divRef.childNodes[0] as HTMLSpanElement)
          .offsetHeight
        // Value 14 for OptionButton, 2 for Gap style value, and offsetHeight and offsetWidth + 3
        this.updateDataModel({
          propertyName: 'Width',
          value: 14 + 2 + offsetHeight + 1
        })
        this.updateDataModel({
          propertyName: 'Height',
          value: 14 + 2 + offsetWidth + 1
        })
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

.radio {
  background-color: rgb(238, 238, 238);
  box-shadow: 0.1px 0.1px 1px 1px gray;
  width: 150px;
  height: 23px;
}

.radio-input {
  margin: 0px 0px 0px 5px;
}

.radio-label {
  float: left;
  font-size: 11px;
  padding-top: 5px;
}

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

.spanClass {
  text-decoration: underline;
}
</style>
