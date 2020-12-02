<template>
<div>
    <input
        name="page-group-1"
        type="radio"
        :checked="indexValue === data.properties.Value ? setValueEmit(indexValue) : false"
    />
    <label
        @click="!getDisableValue(pageData.properties.Enabled) && isChecked(indexValue,pageValue)"
            :class="[
                data.properties.Style === 1
                  ? data.properties.TabOrientation === 2
                    ? 'forLeft forButton'
                    : 'forButton'
                  : data.properties.Style === 0
                  ? data.properties.TabOrientation === 2
                    ? 'forLeft'
                    : 'forTab'
                  : '',
            ]"
            :for="pageData.properties.ID"
            :title="pageData.properties.ControlTipText"
            :style="[styleLabelObj, { color : setForeColor(pageData.properties.Enabled), display: setVisible(pageData.properties.Visible)}]">
          <span v-if="pageData.properties.Accelerator === ''">{{ pageData.properties.Caption }}</span>
              <span v-else
                ><span>{{
                  pageData.properties.Caption | afterbeginCaption(pageData.properties.Accelerator)
                }}</span>
                <span class="spanClass">{{
                  pageData.properties.Caption | acceleratorCaption(pageData.properties.Accelerator)
                }}</span>
                <span>{{
                  pageData.properties.Caption | beforeendCaption(pageData.properties.Accelerator)
                }}</span></span
    >
    </label>
</div>
</template>

<script lang="ts">
import FdControlVue from '@/api/abstract/FormDesigner/FdControlVue'
import { controlProperties } from '@/FormDesigner/controls-properties'
import { Component, Prop, Model, Vue, Emit } from 'vue-property-decorator'
import { State } from 'vuex-class'

@Component({ name: 'FDControlTabs',
  filters: {
    afterbeginCaption (value: string, acc: string = '') {
      if (acc !== '') {
        acc = acc[0]
      } else {
        return undefined
      }
      const data = controlProperties.acceleratorProp(value, acc)
      return data.afterbeginCaption
    },
    acceleratorCaption (value: string, acc: string = '') {
      if (acc !== '') {
        acc = acc[0]
      } else {
        return undefined
      }
      const data = controlProperties.acceleratorProp(value, acc)
      return data.acceleratorCaption
    },
    beforeendCaption (value: string, acc: string = '') {
      if (acc !== '') {
        acc = acc[0]
      } else {
        return undefined
      }
      const data = controlProperties.acceleratorProp(value, acc)
      return data.beforeendCaption
    }
  } })
export default class FDControlTabs extends Vue {
  @Prop() data: controlData;
  @Prop() pageValue: string;
  @Prop() indexValue: number;
  @Prop() pageData: controlData;
  @Prop() isRunMode: boolean;
  @Prop() isEditMode: boolean;
  @Prop() isItalic: boolean;
  @Prop() tempStretch:string;
  @Prop() tempWeight: string;
  @Prop() getMouseCursorData: string;
  @Prop() setFontStyle: string;

  getDisableValue (enabledValue: boolean) {
    if (this.isRunMode) {
      if (!this.data.properties.Enabled) {
        return true
      } else {
        return !enabledValue
      }
    } else if (this.isEditMode) {
      return false
    }
  }

  @Emit('setValue')
  setValueEmit (indexValue: number) {
    return indexValue
  }

  @Emit('isChecked')
  isChecked (indexValue: number, pageValue: string) {
    return {
      indexValue,
      pageValue }
  }

  setVisible (visibleValue: boolean) {
    if (this.isRunMode) {
      if (visibleValue) {
        return 'inline-block'
      } else {
        return 'none'
      }
    } else {
      return 'inline-block'
    }
  }

  setForeColor (enabledValue: boolean) {
    if (this.isRunMode) {
      if (this.data.properties.Enabled) {
        if (enabledValue) {
          return this.data.properties.ForeColor
        } else {
          return 'rgba(220, 220, 220, 1)'
        }
      } else {
        return 'rgba(220, 220, 220, 1)'
      }
    } else {
      if (enabledValue) {
        return this.data.properties.ForeColor
      } else {
        return 'rgba(220, 220, 220, 1)'
      }
    }
  }

  protected get styleLabelObj (): Partial<CSSStyleDeclaration> {
    const controlProp = this.data.properties
    const font: font = controlProp.Font
      ? controlProp.Font
      : {
        FontName: 'Arial',
        FontSize: 10,
        FontItalic: true,
        FontBold: true,
        FontUnderline: true,
        FontStrikethrough: true
      }
    return {
      height: controlProp.TabFixedHeight! > 0 ? controlProp.TabFixedHeight + 'px' : '',
      width: controlProp.TabFixedWidth! > 0 ? controlProp.TabFixedWidth + 'px' : '',
      top: controlProp.TabOrientation === 1 ? '10px' : '0px',
      fontFamily: (font.FontStyle! !== '') ? this.setFontStyle : font.FontName!,
      fontSize: `${font.FontSize}px`,
      fontStyle: font.FontItalic || this.isItalic ? 'italic' : '',
      textDecoration:
        font.FontStrikethrough === true && font.FontUnderline === true
          ? 'underline line-through'
          : font.FontUnderline
            ? 'underline'
            : font.FontStrikethrough
              ? 'line-through'
              : '',
      textUnderlinePosition: 'under',
      fontWeight: font.FontBold ? 'bold' : (font.FontStyle !== '') ? this.tempWeight : '',
      fontStretch: (font.FontStyle !== '') ? this.tempStretch : '',
      cursor:
        controlProp.MousePointer !== 0 || controlProp.MouseIcon !== ''
          ? this.getMouseCursorData
          : 'default'
    }
  }
}
</script>

<style>
.forButton {
  margin: 3px;
  border-radius: 3px;
  z-index: 2;
  border: 2px outset;
}
.page [type="radio"]:checked ~ label.forButton {
  margin: 3px;
  border-right: 2px solid gray;
  border-bottom: none;
  border-radius: 3px;
  z-index: 2;
  background-color: gray;
  border: 2px inset;
}
.forLeft {
  border-bottom: none;
  border-radius: 3px;
}
.page [type="radio"]:checked ~ label.forLeft {
  border-bottom: 2px solid gray;
  border-radius: 3px;
  z-index: 2;
}
.forTab {
  border-bottom: none;
  border-radius: 3px;
  overflow: hidden;
}
.page [type="radio"]:checked ~ label.forTab {
  border-right: 2px solid gray;
  border-bottom: none;
  border-radius: 3px;
  z-index: 2;
}
.page label {
  border: 0.1px solid white;
  background-color: rgb(238, 238, 238);
  display: inline-block;
  padding: 5px 5px 5px 5px;
  margin: 0;
  cursor: pointer;
  position: relative;
  top: 0px;
}
.page [type="radio"]:checked ~ label ~ .content {
  z-index: 1;
}
.page [type="radio"] {
  display: none;
}
</style>
