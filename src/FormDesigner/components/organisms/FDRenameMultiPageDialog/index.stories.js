/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue'
import store from '@/store/index.ts'

import FDRenameMultiPageDialog from '.'
import SpecNote from './index.spec.md'

const wrapper = {
  store
}

storiesOf('dialogs|FDRenameMultiPageDialog', module).add(
  'renameMultiPageDialog',
  () => ({
    ...wrapper,
    components: { FDRenameMultiPageDialog },
    props: {
    },
    template: `
        <div :style="styled">
          <FDRenameMultiPageDialog>
          </FDRenameMultiPageDialog>
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
