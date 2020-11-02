<template>
  <fieldset class="fieldset" :style="cssStyleProperty"  :title="properties.ControlTipText" :tabindex="properties.TabIndex" @keydown.delete="deleteItem">
    <legend :style="legendCssStyleProperty">{{ properties.Caption }}</legend>
     <!-- <Container
        :contextMenuType="contextMenuType"
        :viewMenu="viewMenu"
        :userFormId="userFormId"
        :controlId="controlId"
        :containerId="controlId"
        :left="left"
        :top="top"
        ref="containerRef"
        @closeMenu="closeMenu"
        @openMenu="(e, parentID, controlID)=>openMenu(e, parentID, controlID)">
      </Container> -->
  </fieldset>
</template>

<script lang="ts">
import { Component, Prop, Model, Emit } from 'vue-property-decorator'
import FdControlVue from '@/api/abstract/FormDesigner/FdControlVue'
import {
  IupdateControl,
  IselectControl,
  IupdateUserform
} from '@/storeModules/fd/actions'
import { State, Action } from 'vuex-class'
import Vue from 'vue'
import FdContainerVue from '@/api/abstract/FormDesigner/FdContainerVue'
// import Container from '@/FormDesigner/components/organisms/FDContainer/index.vue'
import { controlProperties } from '@/FormDesigner/controls-properties'

@Component({
  name: 'FDFrame',
  components: {
    // Container
  }
})
export default class FDFrame extends FdContainerVue {
  get dragSelectorStyle () {
    return {
      height: `${this.data.properties.Height}px`,
      width: `${this.data.properties.Width}px`
    }
  }
  /**
  * @description style object is passed to :style attribute in fieldset tag
  * dynamically changing the styles of the component based on propControlData
  * @function cssStyleProperty
  *
  */
  protected get cssStyleProperty () :Partial<CSSStyleDeclaration> {
    const controlProp = this.data.properties
    const font: font = this.properties.Font ? this.properties.Font
      : {
        FontName: 'Arial',
        FontSize: 10
      }
    return {
      left: `${controlProp.Left}px`,
      width: `${controlProp!.Width!}px`,
      height: `${controlProp.Height}px`,
      cursor: controlProp.MousePointer !== 0 ||
        controlProp.MouseIcon !== '' ? `${this.getMouseCursorData} !important` : 'default !important',
      fontFamily: font.FontStyle ? font.FontStyle : font.FontName,
      fontSize: `${font.FontSize}px`,
      fontStyle: font.FontItalic ? 'italic' : '',
      textDecoration: font.FontStrikethrough === true && font.FontUnderline === true
        ? 'underline line-through' : font.FontUnderline ? 'underline'
          : font.FontStrikethrough ? 'line-through' : '',
      fontWeight: font.FontBold ? 'bold' : '',
      border: controlProp.BorderStyle ? `1px solid ${controlProp.BorderColor}` : '2px solid gray',
      backgroundImage: `url(${controlProp.Picture})`,
      backgroundSize: controlProp.Picture === '' ? '' : this.getSizeMode,
      backgroundColor: controlProp.BackColor,
      backgroundRepeat: this.getRepeatData,
      backgroundPosition: controlProp.Picture !== '' ? this.getPosition : '',
      overflowX: this.getScrollBarX,
      overflowY: this.getScrollBarY,
      top: `${controlProp.Top}px`,
      boxShadow: controlProp.SpecialEffect ? this.getSpecialEffectData : 'none',
      display: controlProp.Visible ? 'block' : 'none',
      zoom: `${controlProp.Zoom}%`
    }
  }
  /**
  * @description style object is passed to :style attribute in legend tag
  * dynamically changing the styles of the component based on propControlData
  * @function legendCssStyleProperty
  *
  */
  protected get legendCssStyleProperty () :Partial<CSSStyleDeclaration> {
    const controlProp = this.data.properties
    return {
      color: (controlProp.Enabled === true) ? controlProp.ForeColor : this.getEnabled
    }
  }
}
</script>

<style scoped>
.fieldset {
  background-size: 9px 10px;
  background-image: radial-gradient(
    circle,
    rgb(0, 0, 0) 0.5px,
    rgba(0, 0, 0, 0) 0.2px
  );
  user-select: none;
}
</style>
