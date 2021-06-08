<template>
  <q-page class="row flex flex-center">
    <!-- content -->
    <q-card class="column col-3">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Login</div>
      </q-card-section>

      <q-separator />
      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input
            filled
            v-model="email"
            type = "email"
            label="Email *"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please enter your email address']"
          />

          <q-input
            filled
            type="password"
            v-model="password"
            label="Password *"
            lazy-rules
            :rules="[val => val !== null && val !== '' || 'Please provide your password',]"
          />

          <div>
            <q-btn label="Login" type="submit" color="dark"/>
            <q-btn label="Reset" type="reset" color="grey-8" flat class="q-ml-sm" />
            <q-space/>
            <!-- <q-btn label="Back To Home" type="text"  @click="() => {router.push('/')}"/> -->
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
  import {defineComponent, ref, computed} from 'vue'
  // import { getModule } from 'vuex-module-decorators';
  // import UGradeModule from '../store/ugrade/ugradestores';
  import {useStore} from 'vuex'
  import {useRouter} from 'vue-router'

  export default defineComponent({
    name: 'Login',
    setup(){
      const email = ref('')
      const password = ref('')

      const store = useStore()
     
      const router = useRouter()

      // const ugradeData = getModule(UGradeModule);
      const isLoggedIn = computed(() => store.getters['uGradeModule/isLoggedIn'])


      const onSubmit = async () => {
        await store.dispatch('uGradeModule/loggingIn', {usr: email.value, pwd: password.value})
        if (isLoggedIn.value) {await router.push('/search')}
      }

      const onReset = () => {
        console.log('reset')
      }

      return {
        email,
        password,
        onSubmit,
        onReset,
      }
    }
  })
</script>
