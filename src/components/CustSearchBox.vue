<template>
    <q-input class="GNL__toolbar-input" outlined rounded dense v-model="search" color="bg-grey-7 shadow-1" 
                placeholder="Search for your customers to start grading" @change="onFuzzySearch">
        <template v-slot:prepend>
        <q-icon v-if="search === ''" name="search" />
        <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''" />
        </template>
        <template v-slot:append>
        <q-btn flat dense round aria-label="Menu" icon="arrow_drop_down" >
            <q-menu anchor="bottom end" self="top end">
            <div class="q-pa-md" style="width: 400px">
                <div class="text-body2 text-grey q-mb-md">Narrow your search results</div>
                <div class="row items-center">
                <div class="col-3 fontsize-6 text-grey">Customer ID</div>
                <div class="col-9 q-pl-md"><q-input dense v-model="custID" /></div>

                <div class="col-3 fontsize-6 text-grey">Customer Name</div>
                <div class="col-9 q-pl-md"><q-input dense v-model="custName" /></div>

                <div class="col-3 fontsize-6 text-grey">RM Code</div>
                <div class="col-9 q-pl-md"><q-input dense v-model="rmCode" /></div>

                <div class="col-3 fontsize-6 text-grey">Team Code</div>
                <div class="col-9 q-pl-md"><q-input dense v-model="teamCode" /></div>

                <div class="col-12 q-pt-lg row justify-end">
                    <q-btn flat dense no-caps color="grey-7" size="md" style="min-width: 68px;" label="Search" v-close-popup @click="onSearchExact"/>
                    <q-btn flat dense no-caps color="grey-7" size="md" style="min-width: 68px;" @click="onClearExact" label="Clear" v-close-popup />
                </div>
                </div>
            </div>
            </q-menu>
        </q-btn>
        </template>
    </q-input> 
    <div class="row q-pa-xs">
        <span class="text-italic">powered by fuzzy search algorithm</span>
        <q-space/>
        <span class="text-italic">Not found your customer? <q-btn size="sm" color="primary" label="Create New Customer"/></span>
    </div>
</template>

<script lang='ts'>
    import {defineComponent, ref} from 'vue'
    import {useStore} from 'vuex'

    export default defineComponent({
        name: 'CustSearchBox',
        setup(){
            const search = ref('')
            const custID = ref('')
            const custName = ref('')
            const rmCode = ref('')
            const teamCode = ref('')

            const onClearExact = () => {
                custID.value = ''
                custName.value = ''
                rmCode.value = ''
                teamCode.value = ''
            }

            const store = useStore()

            const onSearchExact = () => {alert('This function is work-in-progress.')}
            const onFuzzySearch = async () => {
                await store.dispatch('uGradeModule/fuzzySearch',search.value)
            }

            return {
                search,
                custID,
                custName,
                rmCode,
                teamCode,

                onClearExact,
                onSearchExact,
                onFuzzySearch,
            }
        }
    })
</script>

<style>

</style>