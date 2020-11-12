<template>
  <div @click="selectedItem">
    <div
      :class="classStyle"
      :style="styleObj"
      :title="properties.ControlTipText"
    >
      <div
        @click="
          !getDisableValue
            ? checkOtherOrientations()
              ? increaseTheValue((isClicked = true))
              : decreaseTheValue((isClicked = true))
            : ''
        "
      >
        <button
          class="button-element-top"
          :style="styleButton"
          :runmode="getDisableValue"
          @blur="isClicked = false"
        >
          <div v-if="checkOtherOrientations()" :style="svgTopBottomStyle">
            <FdSvgImage
              key="topArrow"
              name="top-arrow.svg"
              @hook:mounted="changeForeColor"
              class="svgTopBottomStyle"
            />
          </div>
          <div v-else :style="svgLeftRightStyle">
            <FdSvgImage
              key="leftArrow"
              name="left-arrow.svg"
              @hook:mounted="changeForeColor"
              class="svgLeftRightStyle"
            />
          </div>
        </button>
      </div>
      <div
        @click="
          !getDisableValue
            ? checkOtherOrientations()
              ? decreaseTheValue((isClicked = true))
              : increaseTheValue((isClicked = true))
            : ''
        "
      >
        <button
          class="button-element-bottom"
          :style="styleButton"
          :runmode="getDisableValue"
          @blur="isClicked = false"
        >
          <div v-if="checkOtherOrientations()" :style="svgTopBottomStyle">
            <FdSvgImage
              key="bottomArrow"
              name="bottom-arrow.svg"
              @hook:mounted="changeForeColor"
              class="svgTopBottomStyle"
            />
          </div>
          <div v-else :style="svgLeftRightStyle">
            <FdSvgImage
              key="rightArrow"
              name="right-arrow.svg"
              @hook:mounted="changeForeColor"
              class="svgLeftRightStyle"
            />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Emit, Mixins } from 'vue-property-decorator'
import FdControlVue from '@/api/abstract/FormDesigner/FdControlVue'
import FdSvgImage from '@/FormDesigner/components/atoms/FDSVGImage/index.vue'
import { controlProperties } from '@/FormDesigner/controls-properties'
export interface IOrientationvalues {
  orientation?: number;
  width?: number;
  height?: number;
}

@Component({
  name: 'FDSpinButton',
  components: {
    FdSvgImage
  }
})
export default class FDSpinButton extends Mixins(FdControlVue) {
  getForeColor: string = '';
  isClicked: boolean = false;
  classStyle: string = 'spin';
  orientedValue: boolean = true;

  /**
   * @description getDisableValue checks for the RunMode or the EditMode of the control and then returns after checking for the Enabled  property
   * @function getDisableValue
   */
  get getDisableValue () {
    if (this.isRunMode || this.isEditMode) {
      return this.properties.Enabled === false
    } else {
      return true
    }
  }

  /**
   * @description style object is passed to :style attribute in div tag
   * dynamically changing the styles of the component based on properties
   * @function svgTopBottomStyle
   *
   */
  protected get svgTopBottomStyle (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      width: controlProp.Width! < 10 ? '2px' : '40%',
      height: controlProp.Height! < 10 ? '2px' : '40%',
      margin: 'auto'
    }
  }

  /**
   * @description style object is passed to :style attribute in div tag
   * dynamically changing the styles of the component based on properties
   * @function svgLeftRightStyle
   *
   */
  protected get svgLeftRightStyle (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      width: controlProp.Width! < 50 ? '5%' : '10%',
      height: controlProp.Height! < 50 ? '5%' : '10%',
      margin: 'auto'
    }
  }

  /**
   * @description style object is passed to :style attribute in div tag
   * dynamically changing the styles of the component based on properties
   * @function styleObj
   *
   */
  protected get styleObj (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      ...this.baseStyle,
      left: `${controlProp.Left}px`,
      width: `${controlProp.Width}px`,
      height: `${controlProp.Height}px`,
      top: `${controlProp.Top}px`,
      backgroundColor: controlProp.BackColor,
      display:
        controlProp.Visible && this.isRunMode
          ? ''
          : controlProp.Visible === false && this.isRunMode
            ? 'none'
            : ''
    }
  }

  /**
   * @description style object is passed to :style attribute in button tag
   * dynamically changing the styles of the component based on properties
   * @function styleButton
   *
   */
  protected get styleButton (): Partial<CSSStyleDeclaration> {
    const controlProp = this.properties
    return {
      ...this.baseStyle,
      backgroundColor: controlProp.BackColor,
      overflow: 'hidden',
      cursor:
        controlProp.MousePointer !== 0 || controlProp.MouseIcon !== ''
          ? this.getMouseCursorData
          : 'default',
      display:
        controlProp.Visible && this.isRunMode
          ? 'block'
          : controlProp.Visible === false && this.isRunMode
            ? 'none'
            : 'block',
      outline: controlProp.Enabled
        ? this.isClicked
          ? '1px solid black'
          : 'none'
        : 'none',
      outlineOffset: this.isClicked ? '-5px' : '-5px',
      paddingLeft: controlProp.Width! < 46 ? '0px' : '',
      paddingRight: controlProp.Width! < 46 ? '0px' : '',
      paddingTop: controlProp.Height! < 46 ? '0px' : '',
      paddingBottom: controlProp.Height! < 46 ? '0px' : '',
      width: controlProp.Width! < 46 ? `${controlProp.Width! + 6}px` : '100%',
      height:
        controlProp.Height! < 46 ? `${controlProp.Height! + 6}px` : '100%'
    }
  }

  /**
   * @description changes ForeColor property and then updates the getForeColor variable which is given to fill attribute of the svg element
   * @function getForeColorValue
   *
   */
  @Watch('properties', { deep: true })
  changeForeColor (newVal: string, oldVal: string) {
    this.$el.querySelectorAll('.foreColor').forEach((e) => {
      (e as SVGGElement).style.fill = this.getForeColorValue
    })
  }

  /**
   * @description changes the syling of the SpinButton based on the values of the getter orientedValues
   * @function checkOrientation
   *
   */
  @Watch('orientationValues', { deep: true })
  checkOrientation (newVal: IOrientationvalues, oldVal: IOrientationvalues) {
    if (newVal.orientation === 0) {
      this.classStyle = 'spin'
    } else if (newVal.orientation === 1) {
      this.classStyle = 'spin-oriented'
    } else {
      this.orientedValue = this.checkOtherOrientations()
      if (this.orientedValue) {
        this.classStyle = 'spin'
      } else {
        this.classStyle = 'spin-oriented'
      }
    }
  }

  /**
   * @description checkOtherOrientations returns string value from
   * controlProperties.controlsOrientationProp
   * @function checkOtherOrientations
   * @returns boolean value
   * @override
   */
  checkOtherOrientations (): boolean {
    return controlProperties.controlsOrientationProp(this.data)
  }

  /**
   * @description orientationValues is the getter used for all the values that affect the Orientation property
   *  @function orientationValues
   */
  get orientationValues () {
    return {
      orientation: this.properties.Orientation,
      width: this.properties.Width,
      height: this.properties.Height
    }
  }
}
</script>

<style lang="scss" scoped>
.spin {
  display: grid;
  grid-template-columns: 1fr;
}
.spin-oriented {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.button-element-top {
  background-size: 40%;
  background-position: center;
  background-repeat: no-repeat;
  border-color: lightgrey;
}

.button-element-bottom {
  background-size: 40%;
  background-position: center;
  background-repeat: no-repeat;
  border-color: lightgrey;
}
:focus {
  outline: none;
}
.svgTopBottomStyle {
  position: relative;
  top: 33%;
}
.svgLeftRightStyle {
  position: relative;
  top: -33%;
}
.button-element-top[runmode]:active {
  border-style: outset !important;
}
.button-element-bottom[runmode]:active {
  border-style: outset !important;
}
</style>
