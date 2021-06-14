<template>
  <div>
    <table class="table-header">
      <tr v-for="(row,rowidx) in formData.rows" :key="rowidx">
		  <td style="width: 350px">{{row.label}}</td>
		  <td style="width: 600px">
			  <table style="width: 100%; border-spacing: 0; table-layout: fixed;">
				  <tr>
					  <td v-for="field, idx in row.values" :key="idx" align="center">
			  <div >
				  <div v-if="row.type=='input'" class="inline-block" style="border: 1px solid; color: red; width: 100%"><q-input v-model="field.value" dense outlined :input-class="row.align? row.align: 'text-left'"/></div>
				  <div v-if="row.type=='select'" class="inline-block" style="border: 1px solid; color: red; width: 100%">
						<q-select v-model="field.value" :options="formData.params[row.param]" dense options-dense>
							<template v-slot:selected>
								<div style="width: 100%" class="text-center">{{field.value}}</div>
							</template>
						</q-select>
					</div>
				  <div v-if="row.type=='display'" class="inline-block">{{ field.value }}</div>
			  </div>
					  </td>
				  </tr>
			  </table>
		  </td>
		  <td style="width: 100%"></td>
	  </tr>
    </table>
  </div>
</template>

<script lang="js">
import { defineComponent, computed } from 'vue'

export default defineComponent({
	name: 'FssHeader',
	props: ['modelValue'],
	emits: ['update:modelValue'],
	setup(props) {
		const formData = computed({
			get: () => props.modelValue,
			set: (val) => this.$emit('update:modelValue', val)
		})
		return {
			formData
		}
	},
})
</script>

<style>
	.table-header {width: 100%; table-layout: fixed; border-collapse: collapse}
	/* .table-header td {width: 350px}
	.table-header td:last-child {width: 100%} */
	.q-field--dense .q-field__control {height: 30px;}
</style>
