/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue'
import { text, withKnobs } from '@storybook/addon-knobs'
import { mapState } from 'vuex'
import { sampleStore, updateVuexCallback, initUpdate } from '@/api/storybook/utilReactivity.js'

import FdResizeControl from '@/FormDesigner/components/organisms/FDResizeControl/index.vue'
// import FDOptionButton from '.'
import SpecNote from './index.spec.md'

const textBoxObj = {
  store: sampleStore,
  components: { FdResizeControl },
  props: {
  },
  template: `
  <div :style="styled">
  <fd-resize-control
    :controlId="ControlId"
    :userFormId="UserFormId"
    :containerId="UserFormId"
    />
</div>
    `,
  methods: {
  },
  created () {
    initUpdate(sampleStore, this)
  },
  data () {
    return {
      UserFormId: text('UserFormId', 'ID_USERFORM1'),
      ControlId: text('ControlId', 'ID_OptionButton1')
    }
  },
  computed: {
    styled () {
      return {
        width: `600px`,
        height: `600px`,
        backgroundColor: '#ffffe0'
      }
    }
  }
}
storiesOf('atoms|FdControl/FDOptionButton', module).addDecorator(withKnobs({
  callback: updateVuexCallback(sampleStore)
})).add(
  'optionButton',
  () => {
    return { ...textBoxObj }
  },
  {
    notes: { markdown: SpecNote },
    info: {}
  }
)
