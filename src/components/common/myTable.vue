<template>
<q-dialog v-model="toShow" persistent>
  <q-card style="overflow: auto; width: 900px; max-width: 900px">
    <q-card-section>
    </q-card-section>
  </q-card>
</q-dialog>
</template>

<script>
    import {defineComponent} from 'vue'

    export default defineComponent({
        name: 'myTable',
        props:['formdata'],
        setup(props){

          const formdata = {
            
            fields: [
            { 
              name
            },
          ]}

            return {  

            }
        }

    })
</script>

<style>

</style>