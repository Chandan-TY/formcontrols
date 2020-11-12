<template>
  <div
    class="picture"
    :style="cssStyleProperty"
    :title="properties.ControlTipText"
    @keydown.delete="deleteItem"
    @click.stop="selectedItem"
  ></div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Model,
  Emit,
  Mixins,
  Ref,
  Watch
} from 'vue-property-decorator'
import FdControlVue from '@/api/abstract/FormDesigner/FdControlVue'
import { controlProperties } from '@/FormDesigner/controls-properties'

@Component({
  name: 'FDImage'
})
export default class FDImage extends Mixins(FdControlVue) {
  $el!: HTMLDivElement;
  /**
   * @description updating width and height of image control
   * @function updateAutoSize
   * @param oldVal previous AutoSize value
   * @param newVal  new/changed AutoSize value
   */
  @Watch('properties.AutoSize', { deep: true })
  updateAutoSize (newVal: boolean, oldVal: boolean) {
    if (newVal && this.properties.Picture) {
      const img = new Image()
      img.src = this.properties.Picture[0]
      this.updateDataModel({
        propertyName: 'Height',
        value: img.height
      })
      this.updateDataModel({
        propertyName: 'Width',
        value: img.width
      })
    }
  }
  /**
   * @description style object is passed to :style attribute in label tag
   * dynamically changing the styles of the component based on propControlData
   * @function cssStyleProperty
   *
   */
  protected get cssStyleProperty (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      ...this.baseStyle,
      left: `${controlProp.Left}px`,
      width: `${controlProp.Width}px`,
      height: `${controlProp.Height}px`,
      top: `${controlProp.Top}px`,
      backgroundColor: controlProp.BackStyle
        ? controlProp.BackColor
        : 'transparent',
      borderColor: controlProp.BorderColor,
      border: this.getBorderStyle,
      boxShadow: controlProp.SpecialEffect ? this.getSpecialEffectData : 'none',
      cursor:
        controlProp.MousePointer !== 0 || controlProp.MouseIcon !== ''
          ? this.getMouseCursorData
          : 'default',
      backgroundImage: `url(${controlProp.Picture})`,
      backgroundSize: controlProp.Picture === '' ? '' : this.getSizeMode,
      backgroundRepeat: this.getRepeatData,
      backgroundPosition: controlProp.Picture === '' ? '' : this.getPosition,
      display: controlProp.Visible ? 'block' : 'none'
    }
  }
}
</script>

<style scoped>
.picture {
  /* position: relative; */
  overflow: hidden;
}
</style>
