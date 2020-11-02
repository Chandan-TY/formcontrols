/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue'
import { text, withKnobs } from '@storybook/addon-knobs'

import { sampleStore, updateVuexCallback, initUpdate } from '@/api/storybook/utilReactivity.js'

import FdResizeControl from '@/FormDesigner/components/organisms/FDResizeControl/index.vue'
import SpecNote from './index.spec.md'

const comboBoxObj = {
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
      ControlId: text('ControlId', 'ID_ComboBox1')
    }
  },
  computed: {
    styled () {
      return {
        width: `400px`,
        height: `400px`,
        backgroundColor: '#ffffe0'
      }
    }
  }
}

storiesOf('molecules|FdControl/FDComboBox', module).addDecorator(withKnobs({
  callback: updateVuexCallback(sampleStore)
})).add(
  'comboBox',
  () => {
    return { ...comboBoxObj }
  },
  {
    notes: { markdown: SpecNote },
    info: {}
  }
)
