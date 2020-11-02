/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue'
import store from '@/store/index.ts'

import FDUserformTabOrder from '.'
import SpecNote from './index.spec.md'

const wrapper = {
  store
}

storiesOf('dialogs|FDUserformTabOrder', module).add(
  'userformTabOrder',
  () => ({
    ...wrapper,
    components: { FDUserformTabOrder },
    props: {
    },
    template: `
        <div :style="styled">
          <FDUserformTabOrder :isOpen='isOpen'>
          </FDUserformTabOrder>
        </div>
      `,
    computed: {

      styled () {
        return {
          width: `400px`,
          height: `400px`,
          backgroundColor: '#ffffe0'
        }
      },
      isOpen () {
        return true
      }
    }
  }),
  {
    notes: { markdown: SpecNote },
    info: {}
  }
)
