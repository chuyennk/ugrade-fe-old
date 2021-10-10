<template>
	<table class="table-header">
		<tr v-for="(row,rowidx) in formData.rows" :key="rowidx">
			<td style="width: 350px">{{row.label}}</td>
			<td style="width: 600px">
				<table class="fontsize-6 full-width" style="border-spacing: 0; table-layout: fixed;">
					<tr>
						<td v-for="field, idx in row.values" :key="idx" align="center">
							<div >
								<div v-if="row.type=='input'" class="inline-block full-width"><q-input v-model="field.value" dense outlined :input-class="row.align? row.align: 'text-left'"/></div>
								<div v-if="row.type=='select'" class="inline-block full-width">
									<q-select v-model="field.value" :options="formData.params[row.param]" outlined dense options-dense>
										<!-- <template v-slot:selected>
											<div class="text-center full-width">{{field.value}}</div>
										</template> -->
									</q-select>
								</div>
								<div v-if="row.type=='display'" class="inline-block full-width">
									<q-field dense outlined>
										<template v-slot:control>
											<div class="self-center full-width no-outline text-center" tabindex="0">{{field.value}}</div>
										</template>
									</q-field>
								</div>
							</div>
						</td>
					</tr>
				</table>
			</td>
			<td style="width: 100%"></td>
		</tr>
	</table>
</template>

<script>
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
.q-field--dense .q-field__control, .q-field--dense .q-field__marginal
	.q-field--auto-height {
    height: 30px;
}</style>
