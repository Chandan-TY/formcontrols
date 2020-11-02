<template>
  <div class="outer-page" :style="outerArea">
    <div class="pages">
      <div id="container" class="move" ref="scrolling">
        <div class="page" v-for="(value,key) in values" :key="key" >
          <input name="page-group-1" :id="value.id" type="radio" ref="check1"/>
          <label :for="value.id">{{value.tabLabel}}</label>
          <div class="content"></div>
        </div>
      </div>
      <div></div>
      <div :style="{display:isScroll?'block':'none'}">
        <button class="left-button" ></button>
        <button class="right-button" ></button>
      </div>
    </div>
  </div>
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

@Component({
  name: 'FDMultiPage'
})
export default class FDMultiPage extends FdControlVue {
  propControlData: controlData;
  isScroll=true
    outerArea={ width: '285px',
      height: '140px' }
  values = [
    {
      id: 'page-1',
      tabLabel: 'Page One',
      tabContent: 'Label'
    },
    {
      id: 'page-2',
      tabLabel: 'Page Two',
      tabContent: 'ToggleButton'
    }
  ];
}
</script>

<style scoped>
.outer-page {
  background-color: rgb(238, 238, 238);
  overflow-y: hidden;
  overflow-x: hidden;
}
.pages {
  display: grid;
  grid-template-columns: 1fr 40px 30px;
  position: relative;
  clear: both;
  margin: 0;
  /* margin-left: 10px; */
  width: calc(100%);
  height: calc(100% + 22px);
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: hidden;
}
.left-button {
  position: relative;
  background-image: url("../../../../assets/left-arrow-img.png");
  background-size: 30%;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid gray;
  top: 3px;
  right: 19px;
  width: 22px;
  height: 18px;
  padding: 0;
  margin: 0;
  overflow: hidden;
  z-index: 5;
}
.right-button {
  position: relative;
  background-image: url("../../../../assets/right-arrow-img.png");
  background-size: 30%;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid gray;
  top: 3px;
  right: 19px;
  width: 22px;
  height: 18px;
  padding: 0;
  margin: 0;
  overflow: hidden;
  z-index: 5;
}
.move {
  height: -webkit-fill-available;
  width: 100%;
  display: inline-block;
  overflow-x: auto;
  overflow-y: hidden;
}
.page {
  display: inline-block;
  vertical-align: top;
  z-index: 1;
}
.scroll-page {
  z-index: 2;
}
.page label {
  border: 0.1px solid white;
  background-color: rgb(238, 238, 238);
  display: inline-block;
  padding: 5px 5px 1px 5px;
  margin: 0;
  cursor: pointer;
  position: relative;
}
.page [type="radio"] {
  display: none;
}
::-webkit-scrollbar {
  width: 0;
  height: 1em;
  background-color: rgb(238, 238, 238);
}

::-webkit-scrollbar-button {
  background: rgb(238, 238, 238);
  height: 20px;
  border: 1px solid lightgray;
  border-right-color: gray;
  border-bottom-color: gray;
}

/* Up */
::-webkit-scrollbar-button:single-button:horizontal:decrement {
  background-image: url("../../../../assets/triangle-up-img.png");
  transform: rotate(90deg);
  background-size: 10px;
  background-position: center;
  background-repeat: no-repeat;
  /* border-color: lightgrey; */
}

/* Down */
::-webkit-scrollbar-button:single-button:horizontal:increment {
  background-image: url("../../../../assets/triangle-down-img.png");
  background-size: 10px;
  background-position: center;
  background-repeat: no-repeat;
  /* border-color: lightgrey; */
}

::-webkit-scrollbar-track-piece {
  width: 0px;
}

/* ::-webkit-scrollbar-thumb {
        background: #eee;
        border: 1px solid lightgray;
        border-right-color: gray;
        border-bottom-color: gray;
    } */
.page .content {
  position: absolute;
  white-space: normal;
  top: 23px;
  left: 0px;
  /* background: rgb(238, 238, 238); */
  background-color: white;
  background-size: 9px 10px;
  background-image: radial-gradient(
    circle,
    rgb(0, 0, 0) 0.5px,
    rgba(0, 0, 0, 0) 0.2px
  );
  height: 100px;
  right: 0;
  bottom: 0;
  padding: 20px;
  padding-right: 10px;
  width: calc(100% - 35px);
  height: calc(100% - 89px);
  border: 0.1px solid white;
  box-shadow: 2px 1px gray;
}
.page [type="radio"]:checked ~ label {
  border-right: 2px solid gray;
  border-bottom: none;
  border-radius: 3px;
  z-index: 2;
}
.page [type="radio"]:checked ~ label ~ .content {
  z-index: 1;
}
.content {
  overflow: auto;
}
</style>
