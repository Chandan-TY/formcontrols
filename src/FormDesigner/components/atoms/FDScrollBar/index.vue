<template>
  <div @click.stop="selectedItem" @mousedown="controlEditMode" :style="outerScrollBarDivObj" :title="properties.ControlTipText">
    <div class="slidecontainer" :style="cssVars">
      <button :style="scrollBarButtonStyleObj" @click="!getDisableValue?decreaseTheValue():''">
        <FdSvgImage
          key="leftArrow"
          name="left-arrow.svg"
          @hook:mounted="changeForeColor"
          class="svgLeftRightStyle"
        />
      </button>
      <input
        :disabled="getDisableValue"
        type="range"
        :min="properties.Min"
        :max="properties.Max"
        :value="properties.Value"
        class="slider"
        :style="inputStyleObj"
        @input="updateValueProperty"
        orient="vertical"
      />
      <button :style="scrollBarButtonStyleObj" @click="!getDisableValue?increaseTheValue():''">
        <FdSvgImage
          key="rightArrow"
          name="right-arrow.svg"
          @hook:mounted="changeForeColor"
          class="svgLeftRightStyle"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Watch } from 'vue-property-decorator'
import FdControlVue from '@/api/abstract/FormDesigner/FdControlVue'
import FdSvgImage from '@/FormDesigner/components/atoms/FDSVGImage/index.vue'
import { controlProperties } from '@/FormDesigner/controls-properties'

@Component({
  name: 'FDScrollBar',
  components: {
    FdSvgImage
  }
})
export default class FDScrollBar extends Mixins(FdControlVue) {
  updateValueProperty (e: Event) {
    if (e.target instanceof HTMLInputElement) {
      const targetValue = e.target!.value
      this.updateDataModel({ propertyName: 'Value', value: targetValue })
    }
  }

  get cssVars () {
    const controlProp = this.properties
    return {
      '--bg-color': this.properties.BackColor,
      '--height': `${this.properties.Height!}px`
    }
  }
  get getDisableValue () {
    if (this.isRunMode || this.isEditMode) {
      return this.properties.Enabled === false
    } else {
      return true
    }
  }
  /**
   * @description changes ForeColor property and then updates the getForeColor variable which is given to fill attribute of the svg element
   * @function getForeColorValue
   *
   */
  @Watch('properties.ForeColor', { deep: true })
  changeForeColor (newVal: string, oldVal: string) {
    this.$el.querySelectorAll('.foreColor').forEach((e) => {
      (e as SVGGElement).style.fill = this.getForeColorValue
    })
  }

  get outerScrollBarDivObj () {
    const controlProp = this.properties
    let display = ''
    if (this.isRunMode) {
      display = controlProp.Visible ? 'inline-block' : 'none'
    } else {
      display = 'inline-block'
    }
    return {
      width: `${controlProp.Width}px`,
      height: `${controlProp.Height}px`,
      left: `${controlProp.Left}px`,
      top: `${controlProp.Top}px`,
      display: display,
      overflow: 'hidden',
      cursor:
        controlProp.MousePointer !== 0 || controlProp.MouseIcon !== ''
          ? this.getMouseCursorData
          : 'default'
    }
  }

  get inputStyleObj () {
    const controlProp = this.properties
    let a = null
    let temprgba
    if (controlProp.BackColor!!.startsWith('rgb')) {
      a = controlProp.BackColor!.split('rgba(')[1].split(',')
    } else {
      temprgba = this.hexToRgbA(controlProp.BackColor!)
    }

    return {
      width: controlProp.Orientation === 1 ? this.cssVars['--height'] : `${controlProp.Width! - 44}px`,
      height: controlProp.Orientation === 1 ? `${controlProp.Width! - 44}px` : this.cssVars['--height'],
      cursor:
        controlProp.MousePointer !== 0 || controlProp.MouseIcon !== ''
          ? this.getMouseCursorData
          : 'default',
      backgroundColor: controlProp.BackColor!.startsWith('rgb') ? `rgba(${a![0]},${a![1]},${a![2]},0.4)` : temprgba,
      transform: controlProp.Orientation === 1 ? 'rotateZ(-90deg)' : 'rotate(0deg)'
      // transformOrigin: 'center center'
    }
  }
  hexToRgbA (hex: string) {
    let c: any
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('')
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]]
      }
      c = '0x' + c.join('')
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.4)'
    }
  }
  get scrollBarButtonStyleObj () {
    const controlProp = this.properties
    return {
      backgroundColor: this.cssVars['--bg-color'],
      overflow: 'hidden',
      cursor:
        controlProp.MousePointer !== 0 || controlProp.MouseIcon !== ''
          ? this.getMouseCursorData
          : 'default'
    }
  }
}
</script>

<style scoped>
.slidecontainer {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 20px auto 20px;
}

.slider {
  -webkit-appearance: none;
  content: '';
  --rgb:250,250,250;
  --alpha: 0.4;
  background-color: rgba(var(--rgb), var(--alpha));
  outline: none;
  overflow: hidden;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  background-color: var(--bg-color);
  height: var(--height);
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  --alpha: 1;
  cursor: inherit;
}

.slider::-moz-range-thumb {
  background: rgb(139, 138, 138);
  cursor: pointer;
}

</style>
