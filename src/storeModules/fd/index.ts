
import actions from './actions'
import mutations from './mutations'
import { userDataNew } from '../../FormDesigner/models/dataModel_New'

const userformData: userformData = userDataNew
const copyControl: copyControl = {
  userFormId: '',
  parentId: '',
  targetId: [],
  targetObject: []
}
const state: fdState = {
  userformData: userformData,
  selectedControls: {
    // If add or delete userForm, it should be updated
    // temporary data, It must be deleted later
    'ID_USERFORM1': {
      container: [],
      selected: []
    },
    'ID_USERFORM2': {
      container: [],
      selected: []
    }
  },
  toolBoxSelect: '',
  copyControlList: copyControl,
  groupedControls: {
    'ID_USERFORM1': {
      groupArray: []
    },
    'ID_USERFORM2': {
      groupArray: []
    }
  },
  isRunMode: false
}
export default {
  state,
  actions,
  mutations
}
