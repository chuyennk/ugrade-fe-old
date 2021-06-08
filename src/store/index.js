import { store } from 'quasar/wrappers'
import { createStore, createLogger  } from 'vuex'

import uGradeModule from './ugrade-module'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      uGradeModule,
    },
    // plugins: [createLogger()],

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    // strict: process.env.DEBUGGING
    strict: false
  })

  return Store
})