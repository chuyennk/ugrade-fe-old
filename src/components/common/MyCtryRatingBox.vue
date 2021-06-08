<template>
	<div class="text-body2 text-center">
		<q-markup-table dense>
			<col style="width: 100px" />
			<col style="width: 150px" />
			<col style="width: 80px" />
			<thead>
				<tr>
					<th class="text-left" rowspan="2"></th>
					<th rowspan="2">Country</th>
					<th rowspan="2">Percentage of <br />exposure</th>
					<th colspan="4">External Ratings</th>
				</tr>
				<tr>
					<th>S&P</th>
					<th>Moody</th>
					<th>Fitch</th>
					<th>Combined <br />(median rating)</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="text-left">Primary Exposure</td>
					<td><q-select dense :clearable="true"
						v-model="priCtry" 
						:options="paramCtryRatings"
						option-label="ctryname"
						option-value="ctrycode"
					/></td>
					<td><q-input type="number" dense  v-model="compValues.priCtryPct"/></td>
					<td>{{ compValues.priSPRating }}</td>
					<td>{{ compValues.priMoodyRating }}</td>
					<td>{{ compValues.priFitchRating }}</td>
					<td>{{ compValues.priCombinedRating }}</td>
				</tr>
				<tr>
					<td class="text-left">Secondary Exposure</td>
					<td><q-select dense :clearable="true"
						v-model="secCtry" 
						:options="paramCtryRatings"
						option-label="ctryname"
						option-value="ctrycode"
					/></td>
					<td><q-input type="number" dense v-model="compValues.secCtryPct" /></td>
					<td>{{ compValues.secSPRating }}</td>
					<td>{{ compValues.secMoodyRating }}</td>
					<td>{{ compValues.secFitchRating }}</td>
					<td>{{ compValues.secCombinedRating }}</td>
				</tr>
				<tr>
					<td class="text-left">Weighted Ratings</td>
					<td></td>
					<td>{{ compValues.totalPct }}</td>
					<td></td>
					<td></td>
					<td></td>
					<td>{{ compValues.totalCombinedRating }}</td>
				</tr>
			</tbody>
		</q-markup-table>
	</div>
</template>

<script>
import { defineComponent, ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import * as mathjs from 'mathjs'

export default defineComponent({
	name: 'MyCtryRatingBox',
	props: ['values'],
	setup(props) {
		// initialise an empty component values
		const compValues = ref({
			boxtype: "MyCtryRatingBox",
			priCtryCode: "",
			priCtryPct: 0,
			priSPRating: "",
			priMoodyRating: "",
			priFitchRating: "",
			priCombinedRank: 0,
			priCombinedRating: "",
			secCtryCode: "",
			secCtryPct: 0,
			secSPRating: "",
			secMoodyRating: "",
			secFitchRating: "",
			secCombinedRank: 0,
			secCombinedRating: "",
			totalPct: 0,
			totalCombinedRank: 0,
			totalCombinedRating: "",
			ctryrisk: "",
		})

		//if exsited values, assign it to the component values
		const orgValues = ref(props.values)
		if (orgValues.value) {
			compValues.value = orgValues.value
		}

		// initialise priCtry & secCtry and assign values if existed
		const priCtry = ref(null)
		const secCtry = ref(null)

		const store = useStore()
		const getParams = async param => await store.dispatch('uGradeModule/getParams', param)
		const paramCtryRatings = ref(null)
		const paramRating2Rank = ref(null)

		onMounted( async () => {
			paramCtryRatings.value = (await getParams('param_ctryratings')).params
			paramRating2Rank.value = (await getParams('param_rating2rank_mapping')).params

			if (compValues.value.priCtryCode) {
				priCtry.value = paramCtryRatings.value.find(item => item.ctrycode == compValues.value.priCtryCode)
			}
			if (compValues.value.secCtryCode) {
				secCtry.value = paramCtryRatings.value.find(item => item.ctrycode == compValues.value.secCtryCode)
			}

		})



		// watch for change and compute totalCombinedRating
		const computeValues = () => {
			if (priCtry.value){
				compValues.value.priCtryCode = priCtry.value.ctrycode
				compValues.value.priSPRating = priCtry.value.SP
				compValues.value.priMoodyRating = priCtry.value.Moody
				compValues.value.priFitchRating = priCtry.value.Fitch
				compValues.value.priCombinedRank =priCtry.value.Combined_rank
				compValues.value.priCombinedRating = priCtry.value.Combined_rating
			}else{
				compValues.value.priCtryCode = ""
				compValues.value.priCtryPct = 0
				compValues.value.priSPRating = ""
				compValues.value.priMoodyRating = ""
				compValues.value.priFitchRating = ""
				compValues.value.priCombinedRank = 0
				compValues.value.priCombinedRating = ""
			}

			if (secCtry.value){
				compValues.value.secCtryCode = secCtry.value.ctrycode
				compValues.value.secSPRating = secCtry.value.SP
				compValues.value.secMoodyRating = secCtry.value.Moody
				compValues.value.secFitchRating = secCtry.value.Fitch
				compValues.value.secCombinedRank =secCtry.value.Combined_rank
				compValues.value.secCombinedRating = secCtry.value.Combined_rating
			}else{
				compValues.value.secCtryCode = ""
				compValues.value.secCtryPct = 0
				compValues.value.secSPRating = ""
				compValues.value.secMoodyRating = ""
				compValues.value.secFitchRating = ""
				compValues.value.secCombinedRank = 0
				compValues.value.secCombinedRating = ""
			}

			compValues.value.totalPct = mathjs.sum(compValues.value.priCtryPct, compValues.value.secCtryPct)
			compValues.value.totalCombinedRank = mathjs.round((
				compValues.value.priCtryPct*compValues.value.priCombinedRank +
				compValues.value.secCtryPct*compValues.value.secCombinedRank)
				/compValues.value.totalPct,0)

			const ranking2rating = paramRating2Rank.value.find(item => item.rating_rank == compValues.value.totalCombinedRank)
			if (ranking2rating){
				compValues.value.totalCombinedRating = ranking2rating['Combined']
				compValues.value.ctryrisk = ranking2rating['risk_level']
			}

			orgValues.value = compValues.value
		}

		watch(
			() => [priCtry, secCtry, compValues.value.priCtryPct, compValues.value.secCtryPct],
			() => {
				computeValues()
			},
			{ deep: true }
		)

		return {
			paramCtryRatings,
			compValues,
			priCtry,
			secCtry,
		}
	},
})
</script>

<style>
</style>