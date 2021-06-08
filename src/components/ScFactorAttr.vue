<template>
	<q-btn :label="facData.initValue.facLevel" @click="showFactorAttr" />
	<q-dialog v-model="toShow" persistent>
		<q-card style="overflow: auto; width: 900px; max-width: 900px">
			<q-card-section>
				<div class="row items-center text-bold">
					<div class="col-9">{{ facData.facName }}</div>
				</div>
				<div class="row items-center text-caption">
					<!-- {{ facData.facDesc }} -->
					<span style="white-space: pre-line">{{ facData.facDesc }}</span>
				</div>

				<div class="row items-center inline" v-if="facData.finConfig">
					<q-field label="Imported Fss Value" stack-label dense class="q-mx-sm" input-class="text-right" style="width: 100px">
						<template v-slot:control>
							<div class="self-center full-width no-outline" tabindex="0" v-if="facData.finConfig.facValue_suffix == '%'">
								{{ uNumToPct(facData.initValue.finValue.facValue_import, 2) }}%
							</div>
							<div class="self-center full-width no-outline" tabindex="0" v-else>
								{{ facData.initValue.finValue.facValue_import }}
							</div>
						</template>
					</q-field>
					<!--             <q-field dense type="number" v-model="facValue_import" :suffix="facData.facValue_suffix" label="Financial imported value"/> -->
					<q-input
						dense
						type="number"
						class="q-mx-sm"
						input-class="text-right"
						style="width: 100px"
						v-model="compFinValue"
						:suffix="facData.finConfig.facValue_suffix"
						label="Override Fss Value"
					/>
				</div>
				<div v-if="facData.inputBox">
					<my-ctry-rating-box v-if="facData.inputBox.boxtype == 'MyCtryRatingBox'" 
						:values="facData.initValue.inputBox"
					/>
				</div>
			</q-card-section>
			<q-separator />
			<q-card-section class="row items-center">
				<div v-if="facData.attrs" class="q-pl-lg">
					<q-option-group
						v-model="facData.initValue.facLevel"
						:options="facData.attrs"
						:disable="(!!facData.finConfig || !!facData.inputBox)"
						color="primary"
						size="sm"
						dense
					/>
				</div>
			</q-card-section>
			<q-card-actions align="right">
				<q-btn flat label="Cancel" @click="cancelClick" v-close-popup />
				<q-btn flat label="OK" @click="okClick" v-close-popup />
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue'
import MyCtryRatingBox from './common/MyCtryRatingBox.vue'
import {clone as XEclone} from 'xe-utils'
import * as mathjs from 'mathjs'

export default defineComponent({
	name: 'ScFactorAttr',
	props: ['factorData'],
	components: {
		MyCtryRatingBox,
	},
	setup(props) {
		const toShow = ref(false)

		let facValue_org = {}
		const showFactorAttr = () => {
			toShow.value = !toShow.value
			facValue_org = XEclone(facVals, true)
		}

		const facData = ref(props.factorData)
		const facVals = facData.value.initValue
		// const facData = ref(XEclone(props.propData))

		const uNumToPct = (num, fraction) => {
			return mathjs.round(num * 100, fraction)
		}

		const uPctToNum = (pct, fraction) => {
			return mathjs.round(pct / 100, fraction)
		}

		const compFinValue = computed({
			get() {
				//convert number to percentage with 2 decimal places
				if (facData.value.finConfig.facValue_suffix == '%') return uNumToPct(facVals.finValue.facValue, 2)
				return mathjs.round(facVals.finValue.facValue, 2)
			},
			set(newval) {
				// if (newval=="") {
				//   facData.value.facValue = null
				// }else
				try {
					if (facData.value.finConfig && facData.value.finConfig.facValue_suffix == '%') {
						facVals.finValue.facValue = uPctToNum(newval, 4) //convert percentage to rounded 4 decimal places
					} else {
						facVals.finValue.facValue = parseFloat(newval)
					}
					const attr = facData.value.attrs.find(attr => mathjs.evaluate(attr.condition, { x: facVals.finValue.facValue }))
					if (attr){
						facVals.facLevel = attr.value
						facVals.facScore = attr.score
					}
				} catch (e) {
					facVals.facLevel = 0
					facVals.facScore = 0
				}
			},
		})

		const cancelClick = () => {
			Object.assign(facVals, facValue_org)
		}

		const okClick = () => {
			try {
				const attr = facData.value.attrs.find(attr => attr.value == facVals.facLevel)
				facVals.facScore = attr.score
				if (facVals.finValue.facValue !== facVals.finValue.facValue_import) {
					facVals.finValue.facValue_IsOvrd = true
				} else {
					facVals.finValue.facValue_IsOvrd = false
				}
			} catch (e) {
				facVals.facScore = 0
			}
			// props.propData = facData.value
		}

		watch(
			() => facVals,
			(newVal) => {
				if (facVals.inputBox){
					try{ 
						const attr = facData.value.attrs.find(attr => mathjs.evaluate( attr.condition ,{ctryrisk: newVal.inputBox.ctryrisk}))
						if (attr){
							facVals.facLevel = attr.value
							facVals.facScore = attr.score
						}
					}catch (e) {
						console.log(e)
					}
				}else{
					try{ 
						const attr = facData.value.attrs.find(attr => facVals.facLevel == attr.value)
						if (attr){
							facVals.facScore = attr.score
						}
					}catch (e) {
						console.log(e)
					}
				}
		  },
		  {deep: true}
		)

		return {
			facData,
			compFinValue,
			uNumToPct,

			toShow,
			showFactorAttr,
			cancelClick,
			okClick,
		}
	},
})
</script>

<style>
</style>