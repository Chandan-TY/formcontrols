<template>
  <div class="custom-fontDialog-outer">
    <label class="custom-label-ele">{{propertyName}}</label>
    <div class="custom-div-ele">
      <FontDialog v-on="$listeners" :value="propertyValue" @Font="fontEmit"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import { tableData } from '../../molecules/FDPropertyTableItem/index.vue'
import FontDialog from '@/FormDesigner/components/organisms/FDFontDialog/index.vue'
@Component({
  name: 'FDCustomFontDialog',
  components: {
    FontDialog
  }
})
export default class FDCustomFontDialog extends Vue {
  @Prop({ }) propertyData! : tableData
  @Prop({ default: 'default' }) propertyName!: string

  get propertyValue () {
    return this.propertyData.value
  }

  @Emit('FontProp')
  fontEmit (tempVal: font) {
    return tempVal
  }
}
</script>

<style scoped>
.custom-fontDialog-outer {
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: 100px 1fr;
}
.custom-label-ele {
  outline: none;
  border: 0.1px solid lightgray;
  font-size: 12px;
  position: inherit;
}
.custom-div-ele {
  border: 0.1px solid lightgray;
  outline: none;
  font-size: 12px;
  width: calc(100%);
}
</style>
