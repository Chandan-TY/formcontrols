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
import { Component, Vue, Prop, Emit, Ref } from 'vue-property-decorator'
import FDFontDialog from '@/FormDesigner/components/organisms/FDFontDialog/index.vue'

@Component({
  name: 'FDFontCustomInput',
  components: {
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
      height: '20px',
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

.font-input {
  border: none;
  outline: none;
  height: 14px;
  width: calc(100% - 20px);
}

.box {
  overflow: hidden;
  float: right;
  width: 100%;
  height: 14px;
}

</style>
