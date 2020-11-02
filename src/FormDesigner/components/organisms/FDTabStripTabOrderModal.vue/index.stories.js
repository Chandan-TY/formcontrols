/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue'
import store from '@/store/index.ts'

import FDTabStripTabOrderModal from '.'
import SpecNote from './index.spec.md'

const wrapper = {
  store
}

storiesOf('dialogs|FDTabStripTabOrderModal', module).add(
  'tabStripTabOrderModal',
  () => ({
    ...wrapper,
    components: { FDTabStripTabOrderModal },
    props: {
    },
    template: `
        <div :style="styled">
          <FDTabStripTabOrderModal :isOpen='isOpen'>
          </FDTabStripTabOrderModal>
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
