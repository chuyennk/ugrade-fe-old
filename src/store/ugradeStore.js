import { store } from 'quasar/wrappers'
import {defineStore} from 'pinia'

import state from 'src/store/ugrade-module/state'
import * as getters from 'src/store/ugrade-module/getters'

export default store(function (/* { ssrContext } */) {
    const Store = defineStore({
        id: 'ugradeStore',
        state,
        getters,
        actions: {
            test(){
                this.fssData
            }
        }

    })
  
    return Store
  })