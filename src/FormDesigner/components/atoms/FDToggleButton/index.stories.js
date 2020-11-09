/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue'
import { text, withKnobs } from '@storybook/addon-knobs'
import { mapState, mapActions } from 'vuex'

import { sampleStore, updateVuexCallback, initUpdate } from '@/api/storybook/utilReactivity.js'

import FdResizeControl from '@/FormDesigner/components/organisms/FDResizeControl/index.vue'
import SpecNote from './index.spec.md'

const toggleButtonObj = {
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
      <div style="position: absolute; bottom: 0;">
        isRunMode: {{isRunMode}}
        <button @click="clickChangeMode">
          changeRunMode
        </button>
      </div>
    </div>
      </div>
    `,
  methods: {
    ...mapActions({ changeMode: 'fd/changeRunMode' }),
    clickChangeMode () {
      this.changeMode(!this.isRunMode)
    }
  },
  created () {
    initUpdate(sampleStore, this)
  },
  data () {
    return {
      UserFormId: text('UserFormId', 'ID_USERFORM1'),
      ControlId: text('ControlId', 'ID_ToggleButton1')
    }
  },
  computed: {
    ...mapState({
      isRunMode: state => state.fd.isRunMode
    }),
    styled () {
      return {
        width: `400px`,
        height: `400px`,
        backgroundColor: '#ffffe0'
      }
    }
  }
}

storiesOf('atoms|FdControl/FDToggleButton', module).addDecorator(withKnobs({
  callback: updateVuexCallback(sampleStore)
})).add(
  'toggleButton',
  () => {
    return { ...toggleButtonObj }
  },
  {
    notes: { markdown: SpecNote },
    info: {}
  }
)
