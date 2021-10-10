<template>
  <q-page  no-padding>
    <teleport to="#show-buttons" v-if="isMounted">
        <div v-for="btn in tbButtons" :key="btn.name">
          <q-btn :icon="btn.icon" @click="toolbarClick(btn.name)" class="q-mr-xs glossy" color="dark" round size="sm" dense>
            <q-tooltip transition-show="rotate" transition-hide="rotate">{{ btn.tooltip }}</q-tooltip>
          </q-btn>
        </div>
    </teleport>
  <div class="q-pa-none">
    <div class="q-gutter-y-xs">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="bg-grey-3"
          align="left"
          active-color="primary"
          indicator-color="primary"
          narrow-indicator
        >
          <q-tab name="BS" label="Balance Sheet" no-caps/>
          <q-tab name="PL" label="Income Statement" no-caps/>
          <q-tab name="RC" label="Reconciliation" no-caps/>
          <q-tab name="CF" label="Cashflow" no-caps/>
          <q-tab name="RATIO" label="Ratio Comparison" no-caps/>
        </q-tabs>

        <q-separator />

        <div class="q-pa-xs"><fss-table :fss-type="tab"/></div>
      </q-card>
    </div>
  </div>
  </q-page>
</template>

<script>
import {defineComponent, ref} from 'vue'
import FssTable from '../components/FssTable.vue'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
import { useQuasar } from 'quasar'


export default defineComponent({
  name: 'FssModule',
  components: {
    FssTable,
  },
  setup(){
    const tab = ref('BS')
    const router = useRouter()

    const store = useStore()
    const $q = useQuasar()

    const tbButtons = [
        {name: 'NewFssYr', icon: 'fas fa-file-import', tooltip: 'Add a new financial year'},
        {name: 'Save', icon: 'far fa-save', tooltip: 'Save Fss'},
        {name: 'Close', icon: 'far fa-times-circle', action: 'gotoRoute', tooltip: 'Close - back to customer info screen'},
    ]

    const toolbarClick = async name => {
      if (name =='Close') {
        router.push({name: 'CustInfo'})
      }else if (name == 'NewFssYr'){
        alert ('insert new fss year function to-be-done')
      }else if (name == 'Save'){
				await store.dispatch('uGradeModule/saveFssData', store.getters['uGradeModule/getFssData'])
				$q.notify({
					message: 'Save completed!',
					position: 'top',
					closeBtn: 'x',
				})
      }else{
        alert ('function to-be-done')
      }
    }

    return {
      tab,

      isMounted: ref(false),
      tbButtons,
      toolbarClick,
    }
  },
  mounted(){
    this.isMounted = true;
  }

})
</script>
