<template>
<div class="property-table-item"
  @focusout="updateValue"
  @keyup.enter="updateValue">
  <div>{{propertyName}}</div>
  <div v-if="propertyType==='String'">
    <input type="text" v-model="viewValue">
  </div>
  <div v-else-if="propertyType==='number'">
    <input type="number" v-model="viewValue">
  </div>
  <div v-else-if="propertyType==='array'">
    <select
        class="form-control"
        :value="viewValue"
        @change="updateSelect"
      >
      <option
        v-for="(value, index) in propertyValues"
        :key="index"
        :value="value"
      >
      <b>{{value}}</b>
      </option>
    </select>
  </div>
  <div v-else>
    {{viewValue}}
  </div>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'

export interface tableData {
    value: number | string | null | undefined | font,
    type: string,
    category: string,
    values?: Array<string>
  }

@Component({
  name: 'PropertyTableItem',
  components: {
  }
})
export default class PropertyTableItem extends Vue {
  @Prop({ }) propertyData! : tableData
  @Prop({ default: 'abcd' }) propertyName!: string
  currentValue : tableData['value'] = null
  viewValue : tableData['value'] = null
  mounted () {
    this.viewValue = this.propertyValue
    if (this.propertyName === 'Font') {
      this.viewValue = (this.propertyValue as font).FontName
    }
    if (this.propertyType === 'array') {
      this.viewValue = this.propertyValues && this.propertyValues.find((value) => {
        return parseInt(value.split('-')[0]) === this.propertyValue
      })
    }
  }
  get propertyType () {
    return this.propertyData.type
  }

  get propertyValue () {
    return this.propertyData.value
  }

  get propertyValues () {
    return this.propertyData.values
  }

  updateSelect (event: Event) {
    this.viewValue = (event.target as HTMLSelectElement).value

    this.updateValue(null)
  }

  @Emit('updateProperty')
  updateValue (event: Event | null) {
    if (this.propertyType === 'array') {
      this.currentValue = parseInt((this.viewValue as string).split('-')[0])
    } else if (this.propertyName === 'Font') {
      this.currentValue = this.viewValue
    } else {
      this.currentValue = this.viewValue
    }
    if (event instanceof FocusEvent === true && this.propertyType === 'array') {
      return
    }
    return {
      target: null,
      proprtyName: this.propertyName,
      value: this.currentValue
    }
  }
}
</script>

<style lang="scss" scoped>
.property-table-item {
  display: flex;
  > div:nth-child(1) {
    padding-right: 10px;
  }
}
</style>
