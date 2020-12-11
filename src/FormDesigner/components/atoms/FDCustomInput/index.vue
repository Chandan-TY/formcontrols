<template>
  <div class="custom-input-outer">
    <label class="custom-label-ele">{{propertyName}}</label>
    <input
      :name="propertyName"
      class="custom-input-ele"
      :value="(inputType)?null:propertyValue"
      :type="propertyType"
      v-on="$listeners"
    />
  </div>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'FDCustomInput',
  components: {}
})
export default class FDCustomInput extends Vue {
  @Prop() propertyData! : tableData

  @Prop({ default: 'default' }) propertyName!: string

  fileBasedProperties:Array<string>=['MouseIcon', 'Picture']

  get propertyType () {
    return this.propertyData.type
  }

  get propertyValue () {
    return this.propertyData.value
  }

  get propertyValues () {
    return this.propertyData.values
  }

  get inputType () {
    let isFile = false
    this.fileBasedProperties.forEach((word:string) => {
      if (word.includes(this.propertyName)) {
        isFile = true
      }
    })
    return isFile
  }
}
</script>

<style scoped>
.custom-input-outer {
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
.custom-input-ele {
  border: 0.1px solid lightgray;
  outline: none;
  font-size: 12px;
}
</style>
