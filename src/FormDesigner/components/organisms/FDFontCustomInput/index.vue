<template>
  <div>
    <div class="box grid-design">
      <input type="text" name="Font" class="font-input" />
        <button
          :style="fontButtonStyle"
          @click="setFontDialogVisiblilty(true)"
        >
          ...
        </button>
    </div>
    <FDFontDialog v-if="isOpen" :isOpen="isOpen" @setFontDialogVisiblilty="setFontDialogVisiblilty"/>
  </div>
</template>

<script lang="ts">
import { newFont } from '../../../models/newFont'
import { Component, Vue, Prop, Emit, Ref } from 'vue-property-decorator'
import { tableData } from '../../molecules/FDPropertyTableItem/index.vue'
import FDSVGImage from '@/FormDesigner/components/atoms/FDSVGImage/index.vue'
import FDFontDialog from '@/FormDesigner/components/organisms/FDFontDialog/index.vue'

@Component({
  name: 'FDFontCustomInput',
  components: {
    FDSVGImage,
    FDFontDialog
  }
})
export default class FDFontCustomInput extends Vue {
  @Emit('Font')
  emitFont (tempVal: font) {
    return tempVal
  }
  get fontButtonStyle () {
    return {
      height: '17px',
      width: '17px',
      padding: '0px',
      paddingLeft: '1px',
      paddingRight: '2px',
      border: '1px solid white',
      borderRightColor: 'gray',
      borderBottomColor: 'gray',
      borderLeftColor: 'lightgray',
      borderTopColor: 'lightgray',
      outline: 'none',
      marginLeft: '-3px'
    }
  }
}
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-size: cover;
  height: 100vh;
}
.font-input {
  border: none;
  outline: none;
  height: 14px;
  width: calc(100% - 20px);
}
h1 {
  text-align: center;
  font-family: Tahoma, Arial, sans-serif;
  color: #06d85f;
  margin: 80px 0;
}

.span-style {
  position: absolute;
  left: 6px;
  top: 6px;
}

.box {
  overflow: hidden;
  float: right;
  width: 100%;
  height: 14px;
}

.button {
  font-size: 1em;
  padding: 10px;
  color: #fff;
  border: 2px solid #06d85f;
  border-radius: 20px/50px;
  text-decoration: none;
  cursor: pointer;
  /* transition: all 0.3s ease-out; */
}
.button:hover {
  background: #06d85f;
}

.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  /* transition: opacity 500ms; */
  visibility: hidden;
  opacity: 0;
  z-index: 110;
}
.overlay:target {
  visibility: visible;
  opacity: 1;
}

.popup {
  margin: 70px auto;
  /* padding: 20px; */
  background: #fff;
  border-radius: 5px;
  width: 30%;
  position: relative;
  /* transition: all 5s ease-in-out; */
}

.popup h2 {
  margin-top: 0;
  color: #333;
  font-family: Tahoma, Arial, sans-serif;
}
.popup .close {
  position: absolute;
  /* top: 20px; */
  right: 0px;
  /* transition: all 200ms; */
  /* font-size: 30px; */
  font-weight: bold;
  text-decoration: none;
  color: #333;
}
.popup .close:hover {
  color: #06d85f;
}
.popup .content {
  max-height: 30%;
  overflow: auto;
}

@media screen and (max-width: 700px) {
  .box {
    width: 70%;
  }
  .popup {
    width: 70%;
  }
}

.wrapper {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-gap: 1em;
  padding-left: 10px;
  padding-top: 20px;
}
.wrapper-1 {
  margin-left: 0px;
  grid-template-columns: 1fr;
  font-style: bold;
}
.wrapper2 {
  grid-template-columns: 1fr 1fr;
  display: grid;
  /* grid-template-columns: repeat(2, 1fr); */
}

.wrapper-3 {
  margin-right: 10px;
}
.wrapper-20 {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-gap: 1em;
}
.wrapper-21 {
  grid-row: 2/3;
  margin-top: 33px;
}
.nested {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 12px 29px;
  margin-right: 10px;
}
.nested > button {
  height: 25px;
}
.font-div {
  position: absolute;
  height: 360px;
  width: 480px;
  border: 1px solid gray;
  background: rgb(238, 238, 238);
}
.font-header {
  background-color: rgb(255, 255, 255);
  height: 25px;
}
.font-body {
  /* background-color:rgb(173, 170, 170); */
  font-size: 12px;
}
.font-input-1 {
  height: 13px;
  width: 147px;
  border: 1px solid white;
  box-shadow: -1px -1px grey;
  margin-left: 1px;
  margin-bottom: 3px;
}
.font-input-2 {
  width: 127px;
  height: 13px;
  border: 1px solid white;
  box-shadow: -1px -1px grey;
  margin-left: 1px;
  margin-bottom: 3px;
}
.font-input-3 {
  width: 57px;
  height: 13px;
  border: 1px solid white;
  box-shadow: -1px -1px grey;
  margin-left: 1px;
  margin-bottom: 3px;
}
.font-first-frame {
  width: 150px;
  border: 1px solid white;
  box-shadow: -1px -1px grey;
  background: white;
  height: 88px;
  overflow-y: scroll;
  margin-left: 1px;
}
.font-second-frame {
  width: 130px;
  border: 1px solid white;
  box-shadow: -1px -1px grey;
  background: white;
  height: 88px;
  overflow-y: scroll;
  margin-left: 1px;
}
.font-third-frame {
  width: 60px;
  border: 1px solid white;
  box-shadow: -1px -1px grey;
  background: white;
  height: 88px;
  overflow-y: scroll;
  margin-left: 1px;
}

/* fieldSet */
.fieldset {
  border: 0.5px groove threedface;
  border-top: none;
  padding: 0.5em;
  margin: 1em 2px;
}
.fieldset > h1 {
  font: 1em normal;
  margin: -1em -0.5em 0;
  grid-column: 2/4;
}
.fieldset > h1 > span {
  float: left;
  color: black;
}
.fieldset > h1:before {
  border-top: 2px groove threedface;
  content: " ";
  float: left;
  margin: 0.5em 2px 0 -1px;
  width: 0.75em;
}
.fieldset > h1:after {
  border-top: 2px groove threedface;
  content: " ";
  display: block;
  height: 1.5em;
  left: 2px;
  margin: 0 1px 0 0;
  overflow: hidden;
  position: relative;
  top: 0.5em;
}

.ui-btn {
  /* margin: 2px; */
  margin: 0;
  width: 33px;
  height: 25px;
  border: 0;
  outline: 0;
  background: transparent;
}
.ui-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
.ui-btn.close {
  background: white;
}
.ui-btn:hover {
  background: #e81123;
  color: white;
}
.ui-btn svg path,
.ui-btn svg rect,
.ui-btn svg polygon {
  fill: white;
}
.ui-btn svg {
  width: 10px;
  height: 10px;
  stroke: gray;
}
.ui-btn svg:hover {
  width: 10px;
  height: 10px;
  stroke: white;
}
.sampleStyle {
  overflow: hidden;
  cursor: context-menu;
}
</style>
