/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue'
import { text, withKnobs } from '@storybook/addon-knobs'
import { mapState } from 'vuex'

import { sampleStore, updateVuexCallback, initUpdate } from '@/api/storybook/utilReactivity.js'

import FdResizeControl from '@/FormDesigner/components/organisms/FDResizeControl/index.vue'
import SpecNote from './index.spec.md'

const tabStripObj = {
  store: sampleStore,
  components: { FdResizeControl },
  props: {},
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
      ControlId: text('ControlId', 'ID_TabStrip1')
    }
  },
  computed: {
    ...mapState({
      userformData: state => state.fd.userformData
    }),
    controlData () {
      return this.userformData[this.UserFormId][this.ControlId]
    },
    styled () {
      return {
        width: `400px`,
        height: `400px`,
        backgroundColor: '#ffffe0'
      }
    }
  }
}

storiesOf('atoms|FdControl/FDTabStrip', module).addDecorator(withKnobs({
  callback: updateVuexCallback(sampleStore)
})).add(
  'tabStrip',
  () => {
    return { ...tabStripObj }
  },
  {
    notes: { markdown: SpecNote },
    info: {}
  }
)
