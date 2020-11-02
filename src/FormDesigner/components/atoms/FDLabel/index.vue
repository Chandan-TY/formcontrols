<template>
 <label
    class="label"
    :style="cssStyleProperty"
    :name="properties.Name"
    :tabindex="properties.TabIndex"
    :title="properties.ControlTipText"
    @keydown.delete.exact="deleteItem"
    @keydown.enter="setContentEditable($event,true)"
    @click.stop="selectedItem"
    @dblclick="dragGroup"
  >
    <!-- ToDo: :accelerator="properties.Accelerator" -->
    <FDEditableText
      :editable="isRunMode === false && syncIsEditMode"
      :caption="properties.Caption"
      @updateCaption="updateCaption"
      @releaseEditMode="setContentEditable($event,false)">
    </FDEditableText>
  </label>
</template>

<script lang="ts">
import { Component, Watch, Mixins, Emit } from 'vue-property-decorator'
import FDEditableText from '@/FormDesigner/components/atoms/FDEditableText/index.vue'
import FdControlVue from '@/api/abstract/FormDesigner/FdControlVue'

@Component({
  name: 'FDLabel',
  components: {
    FDEditableText
  }
})
export default class FDLabel extends Mixins(FdControlVue) {
  $el!: HTMLLabelElement

  /**
  * @description style object is passed to :style attribute in label tag
  * dynamically changing the styles of the component based on propControlData
  * @function cssStyleProperty
  *
  */
  protected get cssStyleProperty () :Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    const font: font = controlProp.Font ? controlProp.Font : {
      FontName: 'Arial',
      FontSize: 10
    }
    return {
      ...!controlProp.AutoSize && this.renderSize,
      ...this.baseStyle,
      left: `${controlProp.Left}px`,
      width: `${controlProp.Width}px`,
      height: `${controlProp.Height}px`,
      top: `${controlProp.Top}px`,
      backgroundColor: controlProp.BackColor,
      borderColor: controlProp.BorderColor,
      textAlign: controlProp.TextAlign === 0 ? 'left' : controlProp.TextAlign === 1 ? 'center' : 'right',
      border: this.getBorderStyle,
      background: controlProp.BackStyle ? controlProp.BackColor : 'transparent',
      boxShadow: controlProp.SpecialEffect ? this.getSpecialEffectData : 'none',
      whiteSpace: controlProp.WordWrap ? 'pre' : 'pre-wrap',
      wordBreak: controlProp.WordWrap ? 'break-word' : 'normal',
      color: (controlProp.Enabled === true) ? controlProp.ForeColor : this.getEnabled,
      cursor: (controlProp.MousePointer !== 0 || controlProp.MouseIcon !== '') ? this.getMouseCursorData : 'default',
      // Fix Font.FontSize, Font.FontItalic ...
      fontFamily: font.FontStyle ? font.FontStyle : font.FontName,
      fontSize: `${font.FontSize}px`,
      fontStyle: font.FontItalic ? 'italic' : '',
      textDecoration: (font.FontStrikethrough === true && font.FontUnderline === true) ? 'underline line-through' : font.FontUnderline ? 'underline' : font.FontStrikethrough ? 'line-through' : '',
      fontWeight: font.FontBold ? 'bold' : '',
      //  position: 'relative',
      backgroundImage: `url(${controlProp.Picture})`,
      backgroundRepeat: this.getRepeat,
      backgroundPosition: this.getPosition,
      backgroundPositionX: this.getPositionX,
      backgroundPositionY: this.getPositionY
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
   * @description updateAutoSize calls Vuex Actions to update object
   * @function updateAutoSize
   * @override
   */
  updateAutoSize () {
    if (this.properties.AutoSize === true) {
      this.$nextTick(() => {
        this.updateDataModel({ propertyName: 'Height', value: (this.$el.childNodes[0] as HTMLSpanElement).offsetHeight })
        this.updateDataModel({ propertyName: 'Width', value: (this.$el.childNodes[0] as HTMLSpanElement).offsetWidth })
      })
    }
  }
}
</script>

<style scoped>
.label {
  float: left;
  padding-left: 2px;
  overflow: hidden;
  outline: none;
}
</style>
