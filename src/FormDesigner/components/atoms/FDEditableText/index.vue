<template>
  <textarea
    class='editText'
    :style="editStyle"
    :readonly="editable === false"
    v-on="eventStoppers()"
    v-model="currentValue">
  </textarea>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'FDEditableText'
})
export default class FDEditableText extends Vue {
  @Prop() private editable! : boolean
  @Prop() private caption! : string
  // @Prop() private accelerator! : string

  eventStoppers () {
    const eventStop = (event: Event) => event.stopPropagation()
    return this.editable === false ? null : {
      mousedown: eventStop,
      keydown: this.keydownHandle,
      click: eventStop
    }
  }

  keydownHandle (e: KeyboardEvent) {
    e.stopPropagation()
    if (e.key === 'Escape') {
      this.$emit('releaseEditMode')
    }
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }
  get editStyle () {
    return {
      cursor: this.editable ? 'text' : 'inherit'
    }
  }
  get currentValue () {
    return this.caption
  }
  set currentValue (value) {
    this.$emit('updateCaption', value)
  }
}
</script>

<style scoped>
  .editText {
    width: 100%;
    height: 100%;
    background: inherit;
    font: inherit;
    border: none;
    outline: none;
    padding: 0;
    resize: none;
    overflow: hidden;
    text-decoration: inherit;
    color: inherit;
    white-space: inherit;
    word-break: inherit;
  }
</style>
