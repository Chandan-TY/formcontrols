<template>
<div>
  <FDPropertyTableItem
    v-for="(value, propertyName) in tableData"
    :key="propertyName"
    :propertyData="value"
    :propertyName="propertyName"
    @updateProperty="updateProperty"
  />

  <!-- <div>{{tableData}}</div> -->
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import FDPropertyTableItem, { tableData } from '@/FormDesigner/components/molecules/FDPropertyTableItem/index.vue'
import { IupdateControl } from '@/storeModules/fd/actions'

export interface tableDatas {
  [propName: string]: tableData
}

@Component({
  name: 'PropertyTable',
  components: {
    FDPropertyTableItem
  }
})
export default class PropertyTable extends Vue {
  @Prop({ type: Object, required: true }) tableData! : tableData

  @Emit('updateProperty')
  updateProperty (arg: IupdateControl) {
    return arg
  }
}
</script>

<style scoped>
</style>
