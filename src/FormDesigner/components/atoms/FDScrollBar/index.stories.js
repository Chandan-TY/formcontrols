/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue'
import { text, withKnobs } from '@storybook/addon-knobs'
import { mapState } from 'vuex'

import { sampleStore, updateVuexCallback, initUpdate } from '@/api/storybook/utilReactivity.js'

import FdResizeControl from '@/FormDesigner/components/organisms/FDResizeControl/index.vue'
import SpecNote from './index.spec.md'

const scrollBarObj = {
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
      ControlId: text('ControlId', 'ID_ScrollBar1')
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

storiesOf('atoms|FdControl/FDScrollBar', module).addDecorator(withKnobs({
  callback: updateVuexCallback(sampleStore)
})).add(
  'scrollBar',
  () => {
    return { ...scrollBarObj }
  },
  {
    notes: { markdown: SpecNote },
    info: {}
  }
)
