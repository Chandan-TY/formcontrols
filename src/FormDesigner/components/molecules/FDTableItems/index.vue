<template>
  <div>
     <CustomInput
        v-on="$listeners"
        v-if="
          propertyType === 'String' ||
            propertyType === 'float' ||
            propertyType === 'number' ||  propertyType === 'file'
        "
        :propertyData="controlPropertyData"
        :propertyName="propertyName"
      />
      <CustomDropDown
        v-on="$listeners"
        v-if="propertyType === 'array' || propertyType === 'Boolean'"
        :propertyData="controlPropertyData"
        :propertyName="propertyName"
      />
      <CustomColorTabs
        v-on="$listeners"
        v-if="propertyType === 'color'"
        :propertyData="controlPropertyData"
        :propertyName="propertyName"
        @colorPaletteProp = "colorPaletteProp"
      />
      <CustomFontDialog
        v-on="$listeners"
        v-if="propertyType === 'font'"
        :propertyData="controlPropertyData"
        :propertyName="propertyName"
        @FontProp = "fontProp"
      />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import CustomDropDown from '../../atoms/FDCustomDropDown/index.vue'
import CustomInput from '../../atoms/FDCustomInput/index.vue'
import CustomColorTabs from '../../organisms/FDCustomColorTabs/index.vue'
import CustomFontDialog from '../../organisms/FDCustomFontDialog/index.vue'
import { tableData } from '../FDPropertyTableItem/index.vue'

@Component({
  name: 'FDLabelPropertyTableItems',
  components: {
    CustomDropDown,
    CustomInput,
    CustomColorTabs,
    CustomFontDialog
  }
})
export default class FDLabelPropertyTableItems extends Vue {
 @Prop({}) controlPropertyData! : tableData
  @Prop({ default: 'default' }) propertyName!: string

  get propertyType () {
    return this.controlPropertyData.type
  }

  @Emit('FontProp')
  fontProp (tempVal: font) {
    return tempVal
  }

  @Emit('colorPaletteProp')
  colorPaletteProp (selectedValue: ISelectedColoPaletteValue) {
    return selectedValue
  }
}

</script>

<style>

</style>
