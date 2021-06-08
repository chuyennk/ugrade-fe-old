import { boot } from 'quasar/wrappers';

import 'xe-utils'
import VXETable from 'vxe-table'
import {i18n} from './i18n.js'

export default boot(({ app }) => {
  // Set VXETable instance on app
  VXETable.setup({
    i18n: (key, args) => i18n.global.t(key, args)
  })

  app.use(VXETable);
});

export { VXETable };
