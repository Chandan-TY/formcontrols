/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import { text, number, boolean, select, color } from '@storybook/addon-knobs'

// use vuex store
import store from '@/store/index.ts'
import { mapActions, mapState } from 'vuex'

import FDMultiPage from '.'
import SpecNote from './index.spec.md'

const style = {
  '0 - fmTabsStyleTabs': 0,
  '1 - fmTabsStyleButtons': 1,
  '2 - fmTabsStyleNone': 2
}

const tabOrientation = {
  '0 - fmTabOrientationTop': 0,
  '1 - fmTabOrientationBottom': 1,
  '2 - fmTabOrientationLeft': 2,
  '3 - fmTabOrientationRight': 3
}

const wrapper = {
  store
}

storiesOf('atoms|FdControl/FDMultiPage', module).add(
  'multiPage',
  () => ({
    ...wrapper,
    components: { FDMultiPage },
    props: {
    },
    template: `
        <div :style="styled">
          <FDMultiPage
            @mouseenter.native="ActionTest"
            @mouseleave="ActionTest2"
            >
            {{sampleData.Caption}}
          </FDMultiPage>
          <div style="position: absolute; bottom: 0;">
            isRunMode: {{isRunMode}}
            <button @click="clickChangeMode">
              changeRunMode
            </button>
            <button @click="releaseSelect">
              releaseSelect
            </button>
          </div>
        </div>
      `,
    methods: {
      ...mapActions({
        updateControl: 'fd/updateControl',
        changeMode: 'fd/changeRunMode',
        selectControl: 'fd/selectControl'
      }),
      clickChangeMode () {
        this.changeMode(!this.isRunMode)
      },
      releaseSelect () {
        this.selectControl({
          userFormId: this.UserFormId,
          select: { container: [], selected: [] }
        })
      },
      ActionTest: action('MouseEnter'),
      ActionTest2: action('MouseLeave')
    },
    data () {
      const sampleData = {
        // these function will be checked at Knobs tab
        BackColor: color('BackColor', '#ffffff'),
        ControlTipText: text('ControlTipText', 'helptext'),
        Enabled: boolean('Enabled', true),
        FontName: text('FontName', 'Arial'),
        FontSize: number('FontSize', 10),
        FontBold: boolean('FontBold', false),
        FontItalic: boolean('FontItalic', false),
        FontUnderline: boolean('FontUnderline', false),
        FontStrikethrough: boolean('FontStrikethrough', false),
        FontStyle: text('FontStyle', 'Arial Narrow Italic'),
        ForeColor: color('ForeColor', '#000000'),
        Height: number('Height', 18),
        HelpContextID: number('HelpContextID', 0),
        Left: number('HelpContextID', 0),
        MultiRow: boolean('MultiRow', false),
        Name: text('Name', 'MultiPage1'),
        ID: text('ID', 'none'),
        Style: select('Style', style, 0),
        TabFixedHeight: number('TabFixedHeight', 0),
        TabFixedWidth: number('TabFixedWidth', 0),
        TabIndex: number('TabIndex', 0),
        TabOrientation: select('TabOrientation', tabOrientation, 0),
        TabStop: boolean('TabStop', true),
        Tag: text('Tag', ''),
        Top: number('Top', 0),
        Value: number('Value', 0),
        Visible: boolean('Visible', true),
        Width: number('Width', 144)
      }
      return {
        // these function will be checked at Knobs tab
        sampleData: sampleData,
        UserFormId: text('UserFormId', 'ID_USERFORM1'),
        ControlId: text('ControlId', 'ID_MultiPage1')
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
  }),
  {
    notes: { markdown: SpecNote },
    info: {}
  }
)
