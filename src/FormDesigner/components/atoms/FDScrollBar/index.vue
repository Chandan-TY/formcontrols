<template>
<div @click.stop="selectedItem">
<div v-if="checkOtherOrientations()" class="outer-scroll-div" :style="styleOuterObj" :title="properties.ControlTipText">
  <button class="button-element-top" :style="styleButton" :disabled="properties.Enabled === false" @click="decreaseTheValue(isClicked = true)">
    <FdSvgImage name="top-arrow-scrollbar.svg" @hook:mounted="changeForeColor"/>
  </button>
  <div class="outer-scroll" :style="styleObj" :title="properties.ControlTipText" >
    <div class="inner-scroll" :style="styleScrollObj"></div>
  </div>
  <button class="button-element-bottom" :style="styleButton" :disabled="properties.Enabled === false" @click="increaseTheValue(isClicked = true)">
  <FdSvgImage name="bottom-arrow-scrollbar.svg" @hook:mounted="changeForeColor"/>
  </button>
  </div>
  <div v-else class="outer-scroll-div-oriented" :style="styleOuterObj" :title="properties.ControlTipText">
  <button class="button-element-top" :style="styleButton"  :disabled="properties.Enabled === false" @click="decreaseTheValue(isClicked = true)">
    <div :style="{ width:'5px',height:'5px' }">
  <FdSvgImage name="left-arrow.svg" @hook:mounted="changeForeColor" />
    </div>
  </button>
  <div class="outer-scroll-oriented" :style="styleObj" :title="properties.ControlTipText" >
    <div class="inner-scroll-oriented" :style="styleScrollObj"></div>
  </div>
  <button class="button-element-bottom" :style="styleButton" :disabled="properties.Enabled === false" @click="increaseTheValue(isClicked = true)">
    <div :style="{ width:'5px',height:'5px' }">
  <FdSvgImage name="right-arrow.svg" @hook:mounted="changeForeColor"/>
    </div>
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
  getForeColor: string = ''
  isClicked: boolean = false

  /**
  * @description changes ForeColor property and then updates the getForeColor variable which is given to fill attribute of the svg element
  * @function getForeColorValue
  *
  */
  @Watch('properties', { deep: true })
  changeForeColor (newVal:controlData, oldVal:controlData) {
    this.$el.querySelectorAll('.foreColor').forEach((e) => {
      (e as SVGGElement).style.fill = this.getForeColorValue
    })
  }

  /**
  * @description style object is passed to :style attribute in div tag
  * dynamically changing the styles of the component based on properties
  * @function styleObj
  *
  */
  protected get styleObj () :Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      //  position: 'relative',
      width: this.checkOtherOrientations() ? `${controlProp.Width! - 1}px` : `${controlProp.Width}px`,
      height: this.checkOtherOrientations() ? `${controlProp.Height}px` : `${controlProp.Height! - 1}px`,
      backgroundColor: controlProp.BackColor
    }
  }

  /**
  * @description style object is passed to :style attribute in div tag
  * dynamically changing the styles of the component based on properties
  * @function styleOuterObj
  *
  */
  protected get styleOuterObj () :Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      left: `${controlProp.Left}px`,
      top: `${controlProp.Top}px`,
      cursor:
        controlProp.MousePointer !== 0 || controlProp.MouseIcon !== ''
          ? this.getMouseCursorData
          : 'default',
      gridTemplateColumns: this.checkOtherOrientations() ? `${controlProp.Width! + 1}px` : '21px 1fr 21px',
      gridTemplateRows: this.checkOtherOrientations() === false ? `${controlProp.Height}px` : '21px 1fr 21px',
      display: controlProp.Visible ? 'grid' : 'none'
    }
  }

  /**
  * @description style object is passed to :style attribute in button tag
  * dynamically changing the styles of the component based on properties
  * @function styleButton
  *
  */
  protected get styleButton () :Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      overflow: 'hidden',
      backgroundColor: controlProp.BackColor,
      outline: controlProp.Enabled ? (this.isClicked ? '1px solid black' : 'none') : 'none',
      outlineOffset: this.isClicked ? '-5px' : '-5px',
      paddingLeft: controlProp.Width! < 20 ? '0px' : '',
      paddingRight: controlProp.Width! < 20 ? '0px' : '',
      paddingTop: controlProp.Height! < 20 ? '0px' : '',
      paddingBottom: controlProp.Height! < 20 ? '0px' : ''
    }
  }

  /**
  * @description style object is passed to :style attribute in div tag
  * dynamically changing the styles of the component based on properties
  * @function styleScrollObj
  *
  */
  protected get styleScrollObj () :Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      height: this.checkOtherOrientations() ? (controlProp.ProportionalThumb === false ? 'calc(100% + 100px)' : (controlProp.Max! < controlProp.LargeChange!) ? '0px' : (controlProp.LargeChange! > 100) ? 'calc(100% + ' + controlProp.LargeChange + 'px)' : 'calc(100% + 100px)') : 'calc(100% + 100px)',
      width: this.checkOtherOrientations() === false ? (controlProp.ProportionalThumb === false ? 'calc(100% + 100px)' : (controlProp.Max! < controlProp.LargeChange!) ? '0px' : (controlProp.LargeChange! > 100) ? 'calc(100% + ' + controlProp.LargeChange + 'px)' : 'calc(100% + 100px)') : 'calc(100% + 100px)'
    }
  }
  /**
     * @description checkOtherOrientations returns string value from
     * controlProperties.controlsOrientationProp
     * @function checkOtherOrientations
     * @returns boolean value
     * @override
     */
  checkOtherOrientations () : boolean {
    return controlProperties.controlsOrientationProp(this.data)
  }
}
</script>

<style scoped>
.outer-scroll-div{
  display: grid;
  grid-template-rows: 21px 1fr 21px;
  grid-template-columns: 22px;
  /* position:absolute; */
}
.outer-scroll-div-oriented{
  display: grid;
  grid-template-columns: 21px 1fr 21px;
  grid-template-rows: 22px;
  /* position:absolute; */
}
.outer-scroll {
  border: none;
  height: 100px;
  width: 22px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.outer-scroll-oriented {
  border: none;
  height: 22px;
  width: 100px;
  overflow-x: scroll;
  overflow-y: hidden;
}

.inner-scroll {
  width: fit-content;
  height: calc(100% + 100px);
}

.inner-scroll-oriented {
  width: calc(100% + 100px);
  height: fit-content;
}

.outer-scroll::-webkit-scrollbar {
  width: inherit;
  height: 1em;
  background-color: inherit;
}

.outer-scroll::-webkit-scrollbar-button {
  background: rgb(238, 238, 238);
  height: 20px;
  border: 1px solid lightgray;
  border-right-color: gray;
  border-bottom-color: gray;
}

.outer-scroll::-webkit-scrollbar-button:single-button:vertical:decrement {
  display: none;
}

.outer-scroll::-webkit-scrollbar-button:single-button:vertical:increment {
display: none;
}
.outer-scroll::-webkit-scrollbar-track-piece {
  content: '';
  background: inherit;
  --rgb:250,250,250;
  --alpha: 0.4;
  background-color: rgba(var(--rgb), var(--alpha));
}

.outer-scroll::-webkit-scrollbar-thumb {
  background: inherit;
  border: 1px solid lightgray;
  border-right-color: gray;
  border-bottom-color: gray;
}

.outer-scroll-oriented::-webkit-scrollbar {
  width: 1em;
  height: inherit;
  background-color: inherit;
}

.outer-scroll-oriented::-webkit-scrollbar-button {
  background: rgb(238, 238, 238);
  height: 20px;
  border: 1px solid lightgray;
  border-right-color: gray;
  border-bottom-color: gray;
}

.outer-scroll-oriented::-webkit-scrollbar-button:single-button:horizontal:decrement {
  display: none;
}

.outer-scroll-oriented::-webkit-scrollbar-button:single-button:horizontal:increment {
display: none;
}
.outer-scroll-oriented::-webkit-scrollbar-track-piece {
  content: '';
  background: inherit;
  --rgb:250,250,250;
  --alpha: 0.4;
  background-color: rgba(var(--rgb), var(--alpha));
}

.outer-scroll-oriented::-webkit-scrollbar-thumb {
  background: inherit;
  border: 1px solid lightgray;
  border-right-color: gray;
  border-bottom-color: gray;
}
.button-element-top {
  position:relative;
  left: -1px;
  background-size: 10px;
  background-position: center;
  background-repeat: no-repeat;
  border-color: lightgrey;
}

.button-element-bottom {
  position:relative;
  left: -1px;
  background-size: 10px;
  background-position: center;
  background-repeat: no-repeat;
  border-color: lightgrey;
}

:focus {
  outline: none;
}
</style>
