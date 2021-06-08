<template>
  <q-page class="flex flex-center">
    <q-card class="welcome column no-shadow" :class="{show: isShow}">
      <q-card-section>
        <div class="text-body1">Welcome To <q-icon name='auto_graph' class="fontsize-20"/></div>
        <div class="text-h3 text-blue">uGrade</div>
        <div class="text-body-thin">A Modern Grading System</div>
      </q-card-section>
      <q-card-section>
        <div class="text-center">
          <q-btn class="glossy" rounded color="dark" label="Start Now" @click="gotoLogin"/>
        </div>
      </q-card-section>
    </q-card>

  </q-page>
</template>

<script>
// import { Todo, Meta } from '../components/models';
// import ExampleComponent from '../components/CompositionComponent.vue';
import { defineComponent, ref, onMounted} from 'vue';
import {useRouter} from 'vue-router'

export default defineComponent({
  name: 'PageIndex',
  components: {  },
  setup() {

    const router = useRouter()
    const gotoLogin = async () => {
      await router.push({path: '/login'})
    }

    //Add in this animation for fun
    const isShow = ref(false)
    onMounted(() => {
      isShow.value = true
    })

    return { 
      isShow,
      gotoLogin
    };
  }
});
</script>

<style lang='scss'>
  .welcome {
    transform: translateY(-500%);
    transition: transform 1s;
    &.show {
      transform: translateY(0%);

    }
  }
</style>
