<template>
	<q-page padding class="full-width row justify-center">
		<!-- To teleport the action buttons to the toolbar outside of this component -->
		<teleport to="#show-buttons" v-if="isMounted">
			<div v-for="btn in tbButtons" :key="btn.name">
				<q-btn :icon="btn.icon" @click="toolbarClick(btn.name)" class="q-mr-xs glossy" color="dark" round size="sm" dense>
					<q-tooltip transition-show="rotate" transition-hide="rotate">{{ btn.tooltip }}</q-tooltip>
				</q-btn>
			</div>
		</teleport>

		<div class="col-12" style="overflow: auto; border: 1px solid">
			<div class="row text-h5 justify-center text-bold">
				{{ scorecard.scModel.scModelInfo.scModelName }}
			</div>
			<div class="row text-body justify-center">{{ scorecard.scInfo.scID }} ({{ scorecard.scModel.scModelInfo.scModelID }})</div>
			<div class="row q-ma-sm">
				<div class="col-2 q-pa-sm">
					<div>Customer ID:</div>
					<div>Customer Name:</div>
					<div>Biz Reg Num:</div>
					<div>Biz Reg Date:</div>
					<div>Industry:</div>
				</div>
				<div class="col-8 q-pa-sm">
					<div>{{ scorecard.custInfo.custID }}</div>
					<div>{{ scorecard.custInfo.custName }}</div>
					<div>{{ scorecard.custInfo.bizRegNum }} what</div>
					<div>{{ formatDate({ cellValue: scorecard.custInfo.bizRegDate }, 'DD MMM YYYY') }}</div>
					<div>{{ scorecard.custInfo.industryInfo.desc }}</div>
				</div>
			</div>
			<q-separator />

			<div class="q-ma-sm">
				<div class="row text-bold">
					<div class="col-5"></div>
					<div class="col text-center">No. of Level</div>
					<div class="col text-center"><div>Prev Level</div></div>
					<div class="col text-center">Curr Level</div>
					<div class="col text-center">Prev Value</div>
					<div class="col text-center">Curr Value</div>
				</div>
				<div class="row">
					<div class="col-5 justify-center text-captionn"></div>
					<div class="col text-center text-caption"></div>
					<div class="col text-center text-caption">
						<div>
							{{formatDate({cellValue: scorecard.scInfo.scAprrovedDate_prev,},'DD MMM YYYY')}}
						</div>
					</div>
					<div class="col text-center text-caption"></div>
					<div class="col text-center text-caption">
						{{ formatDate({ cellValue: scorecard.scInfo.fssDate_prev }, 'MMM YYYY') }}
						({{ scorecard.scInfo.fssMthsCover_prev }})
					</div>
					<div class="col text-center text-caption">
						{{ formatDate({ cellValue: scorecard.scInfo.fssDate }, 'MMM YYYY') }}
						({{ scorecard.scInfo.fssMthsCover }})
					</div>
				</div>
				<div class="row text-caption">
					<div class="col-5 text-center"></div>
					<div class="col text-center"></div>
					<div class="col text-center"></div>
					<div class="col text-center"></div>
					<div class="col text-center">
						{{ scorecard.scInfo.fssAuditType_prev }}
					</div>
					<div class="col text-center">
						{{ scorecard.scInfo.fssAuditType }}
					</div>
				</div>
				<div v-for="grp in scorecard.scModel.scModelFactorGroups" :key="grp.grpID">
					<div class="row text-h7 text-bold">{{ grp.grpName }}</div>
					<div class="row q-pl-md q-py-xs items-center" v-for="factor in grp.factors" :key="factor.facID">
						<div class="col-5 text-body">{{ factor.facName }}</div>
						<div class="col text-body text-center">
							{{ factor.attrCnt }}
						</div>
						<div class="col text-body text-center">
							{{ factor.initValue.facLevel_prev }}
						</div>
						<div class="col text-body text-center">
							<sc-factor-attr :factorData="factor" />
							
							<div v-if="factor.finConfig" class="q-pa-sm inline-block absolute">
								<div v-if="factor.initValue.finValue.facValue_IsOvrd">
									(*)<q-tooltip
										>The imported financial value of
										{{ formatFactorValue(factor.initValue.finValue.facValue_import, factor.finConfig.facValue_prefix, factor.finConfig.facValue_suffix) }}
										has been overriden to
										{{ formatFactorValue(factor.initValue.finValue.facValue, factor.finConfig.facValue_prefix, factor.finConfig.facValue_suffix) }}
									</q-tooltip>
								</div>
							</div>
						</div>
						<div class="col text-body text-center">
							<div v-if="factor.finConfig">
							{{ formatFactorValue(factor.initValue.finValue.facValue_prev, factor.finConfig.facValue_prefix, factor.finConfig.facValue_suffix) }}
							</div>
						</div>
						<div class="col text-body text-center">
							<div v-if="factor.finConfig">
							{{ formatFactorValue(factor.initValue.finValue.facValue, factor.finConfig.facValue_prefix, factor.finConfig.facValue_suffix) }}
							</div>
						</div>
					</div>
					<div class="row text-bold q-ma-xs">
						<div class="col-12 text-body text-right" style="white-space: nowrap">
							<div class="q-pr-lg" style="display: inline-block">{{ grp.grpName }} Score</div>
							<div class="text-body text-center q-pa-xs score-box">
								{{ grp.initValue.grpScore }}
							</div>
						</div>
					</div>
				</div>
				<div class="row text-bold q-ma-xs">
					<div class="col text-right text-bold" style="white-space: nowrap">
						<div class="q-pr-lg" style="display: inline-block">Total Score</div>
						<div class="text-body text-center q-pa-xs score-box">
							{{ scorecard.scVariables.aggScore }}
						</div>
					</div>
				</div>
			</div>
			<q-separator />
			<p style="page-break-before: always">----------------------------------------------------------------</p>

			<div class="q-ma-sm">
				<div class="text-h6 text-bold">Special Treaments</div>
				<div v-for="trm in scorecard.scModel.scModelSpecialTreatments" :key="trm.seq" class="bg-grey-1">
					<div class="row q-ma-xs items-start">
						<div class="col-6 q-pa-xs">
							<div class="text-h7 text-bold inline-block">
								{{ trm.name }}
							</div>
							<div v-if="trm.outcomeBox" class="q-px-lg inline-block text-bold">
								{{ trm.initValue.outcomeBox }}
							</div>
							<div v-if="trm.optionBox" class="q-pl-lg">
								<q-option-group
									v-model="trm.initValue.optionBox"
									:options="trm.optionBox.options"
									color="primary"
									size="sm"
									dense
								/>
							</div>
						</div>
						<div class="col text-right text-bold" style="white-space: nowrap">
							<div class="q-px-sm" style="display: inline-block">
								<div style="display: inline-block" class="q-pr-md"> {{ trm.outcome }}</div>
								<div v-if="scorecard.scVariables_prev[trm.outcome] > 0" class="score-box-prev">
									({{ scorecard.scVariables_prev[trm.outcome] }})
								</div>
								<div v-else class="score-box-prev">(NA)</div>
							</div>
							<div class="text-body text-center q-pa-xs score-box">
								<div v-if="scorecard.scVariables[trm.outcome] > 0">
									{{ scorecard.scVariables[trm.outcome] }}
								</div>
								<div v-else>NA</div>
							</div>
						</div>
					</div>
					<div class="row" v-if="trm.inputBox">
						<div
							class="col-12 q-pa-xs"
							v-if="trm.inputBox.type == 'Input' && 
							!(trm.initValue.optionBox == '' || trm.initValue.optionBox == trm.inputBox.hideRule)"
						>
							<div class="row q-ma-xs">
								<div class="col text-left text-body" style="white-space: nowrap">
									<div class="q-px-lg" style="display: inline-block">
										{{ trm.inputBox.label }}
									</div>
									<div class="text-body q-pa-xs inline-block">
										<q-input outlined dense v-model="trm.initValue.inputBox.value" class="q-pa-xs" style="max-width: 60px" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="row q-ma-xs">
					<div class="col text-right text-body text-bold" style="white-space: nowrap">
						<div class="q-px-sm" style="display: inline-block">
								<div style="display: inline-block" class="q-pr-md"> Final Grade </div>
								<div v-if="scorecard.scVariables_prev.FOG > 0" class="score-box-prev">
									({{ scorecard.scVariables_prev.FOG }})
								</div>
								<div v-else class="score-box-prev">(NA)</div>

						</div>
						<div class="text-body text-center q-pa-xs score-box">
							<div v-if="scorecard.scVariables.FOG > 0">
								{{ scorecard.scVariables.FOG }}
							</div>
							<div v-else>NA</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<vxe-modal
			ref="xModal"
			v-model="isShowFssImport"
			title="Import Financial Indicators "
			width="600"
			min-width="600"
			min-height="300"
			destroy-on-close
		>
			<template #default>
				<q-card>
					<q-card-section>
						<vxe-table
							ref="xFssTable"
							:data="fssData.FssHeaders"
							size="mini"
							height="300px"
							highlight-current-row
							:keyboard-config="{ isArrow: true }"
							:sort-config="{
								defaultSort: {
									field: 'FssDate',
									order: 'desc',
								},
							}"
						>
							<vxe-table-column type="seq" width="60"></vxe-table-column>
							<vxe-table-column field="FssDate" title="Fss Date" :formatter="formatDate" sortable></vxe-table-column>
							<vxe-table-column field="FssMonthCover" title="Mths Cover"></vxe-table-column>
							<vxe-table-column field="FssCcy" title=" Ccy"></vxe-table-column>
							<vxe-table-column field="FssAuditType" title="Audit Type"></vxe-table-column>
							<vxe-table-column field="FssHasData" title="Has Data"></vxe-table-column>
						</vxe-table>
					</q-card-section>
					<q-card-actions align="right">
						<q-btn flat label="Cancel" @click="() => (isShowFssImport = false)" v-close-popup />
						<q-btn flat label="Import FSS" @click="fssImportClick" v-close-popup />
					</q-card-actions>
				</q-card>
			</template>
		</vxe-modal>
	</q-page>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { date, useQuasar } from 'quasar'
import * as mathjs from 'mathjs'
import { clone as XEclone } from 'xe-utils'
import { VXETable } from 'vxe-table'

import ScFactorAttr from 'src/components/ScFactorAttr.vue'

export default defineComponent({
	name: 'Scorecard',
	components: {
		ScFactorAttr,
	},
	setup() {
		const tbButtons = [
			{
				name: 'ImportFss',
				icon: 'far fa-file-excel',
				action: '',
				tooltip: 'Import Fss',
			},
			{
				name: 'Submit',
				icon: 'fas fa-check-double',
				action: '',
				tooltip: 'Done - Submit for approval',
			},
			{
				name: 'Save',
				icon: 'far fa-save',
				action: '',
				tooltip: 'Save scorecard',
			},
			{
				name: 'Close',
				icon: 'far fa-times-circle',
				action: 'close',
				tooltip: 'Close - back to customer info screen',
			},
		]

		const $q = useQuasar()

		const store = useStore()
		const router = useRouter()

		const toolbarClick = async name => {
			if (name == 'Close') {
				await router.push({ name: 'CustInfo' })
			} else if (name == 'ImportFss') {
				isShowFssImport.value = true
			} else if (name == 'Save') {
				await store.dispatch('uGradeModule/saveScorecard', scorecard)
				$q.notify({
					message: 'Save completed!',
					position: 'top',
					closeBtn: 'x',
				})
			} else {
				// PE: Pending, PA: Pending Approval, CL: Cancelled, AP: Approved,
				if (scorecard.scInfo.scStatus == 'PE') scorecard.scInfo.scStatus = 'PA'
				else if (scorecard.scInfo.scStatus == 'PA') scorecard.scInfo.scStatus = 'AP'
				await store.dispatch('uGradeModule/saveScorecard', scorecard)
				await router.push({ name: 'CustInfo' })
			}
		}

		const isShowFssImport = ref(false) //To show the dialog box that user select the financial to import

		const scorecard = store.getters['uGradeModule/getScData']
		// const s2g = score2grade

		const fssData = XEclone(store.getters['uGradeModule/getFssData'], true)

		const formatFactorValue = (num, prefix, suffix) => {
			if (num){
				if (suffix == '%') return prefix + ' ' + mathjs.round(num * 100, 2) + suffix
				else return prefix + ' ' + (num ? mathjs.round(num, 2) : '') + suffix
			}else{
				return ''
			}
		}

		const formatDate = ({ cellValue }, strFormat = '') =>
			strFormat ? date.formatDate(cellValue, strFormat) : date.formatDate(cellValue, 'DD MMM YYYY')

		const computeFOG = scData => {
			const BreakException = {} //to break the loop if any of the attribute is not rate yet
			scData.scVariables.aggScore = 0
			try {
				scData.scModel.scModelFactorGroups.forEach(grp => {
					// update ScVariables with the factor value in case user overwritten.
					if (grp.fssImportInd) grp.factors.forEach(fac => (scData.scVariables[fac.finConfig.fssImportCat] = fac.initValue.finValue.facValue))

					// compute the group score. If group score<0 (i.e. error), stop the calculation
					if (grp.factors.find(fac => fac.initValue.facLevel <= 0)){
						grp.initValue.grpScore = 0
					}else {
						grp.initValue.grpScore = mathjs.round(grp.factors.reduce((acc, cur) => acc + cur.initValue.facScore * cur.weight, 0),2)
					}

					if (grp.initValue.grpScore <= 0) {
						scData.scVariables.aggScore = 0
						scData.scVariables.grade = 0
						scData.scVariables.gradeAdj = 0
						scData.scVariables.FOG = 0
						throw BreakException
					}
					scData.scVariables.aggScore += grp.initValue.grpScore
				})

				scData.scVariables.aggScore = mathjs.round(scData.scVariables.aggScore, 2) //round AggScore to 2 decimal places

				// from AggScore, map to Grade. Add another GradeAdj for further special treatmant later.
				scData.scVariables.grade = scData.scModel.scScore2Grade.find(band => {
					const strEval = '((x ' + band.lboundSign + band.lbound + ') & (x ' + band.uboundSign + band.ubound + '))'
					return mathjs.evaluate(strEval, {x: scData.scVariables.aggScore})
				}).grade
				scData.scVariables.gradeAdj = scData.scVariables.grade

				// for each special treatment, read the condition rule & formula to adjust the Grade accordingly
				scData.scModel.scModelSpecialTreatments.forEach(trm => {
					let cond = {}

					if (trm.hasOwnProperty('inputBox') && trm.inputBox.type == 'Input') {
						if (trm.initValue.inputBox.value > 0) {
							scData.scVariables[trm.inputBox.output] = trm.initValue.inputBox.value
						} else {
							scData.scVariables[trm.inputBox.output] = null
						}
					}

					// if the treatment based on user select option, then search the rule for selected option
					if (!!trm.optionBox && trm.optionBox.options.length > 0) {
						cond = trm.adjustGrade.find(cond => cond.rule == trm.initValue.optionBox)
					}
					// else search the rule based on values in ScVariables
					else {
						cond = trm.adjustGrade.find(cond => mathjs.evaluate(cond.rule, scData.scVariables))
					}

					if (cond)
						try {
							scData.scVariables.gradeAdj = mathjs.evaluate(cond.gradeAdj, scData.scVariables)
						} catch (e) {
							scData.scVariables.gradeAdj = 0
						}
					else {
						// if no condition matched, i.e. use have not selected an option, then the GradeAdj should be 0 and end the loop
						scData.scVariables.gradeAdj = 0
						throw BreakException
					}

					//if there is ShowOutcome property in the treatment, then set the ShowOutcome accordingly.
					if (trm.outcomeBox) trm.outcomeBox.showOutcome = mathjs.evaluate(trm.outcomeBox.rule, scData.scVariables)

					// if user selected showNA option, the zerorise the treatment Grade (i.e. BOGA, BOGB,..)
					if (!!trm.optionBox & (trm.initValue.optionBox == trm.showNA)) scData.scVariables[trm.outcome] = 0
					else scData.scVariables[trm.outcome] = scData.scVariables.gradeAdj
				})

				// finally, after all the treatments, set FOG = GradeAdj
				scData.scVariables.FOG = scData.scVariables.gradeAdj
			} catch (e) {
				if (e !== BreakException) console.log(e.message)
				scData.scVariables.FOG = 0
			}
		}

		const watchList = [scorecard.scModel.scModelSpecialTreatments, scorecard.scModel.scModelFactorGroups]

		const xFssTable = ref(null)

		// ok to import fss
		const fssImportClick = () => {
			const row = xFssTable.value.getCurrentRecord()
			if (!row) {
				VXETable.modal.alert('Please select a financial year to import.', 'No financial selected')
				return false
			}

			//set the selected flag for those selected and get the field name for those not selected
			const idx = xFssTable.value.getRowIndex(row)
			const toDeleteFields = []
			fssData.FssHeaders.forEach((item, itemidx) => {
				if ((itemidx == idx) | (itemidx == idx - 1)) item['isSelected'] = true
				else {
					toDeleteFields.push(item.AmtField)
					toDeleteFields.push(item.NoteField)
				}
			})

			//copy those selected into scorecard.fssImported
			const fssImported = {
				FssInfo: {},
				FssHeaders: [],
				FssItems: [],
			}

			fssImported.FssInfo = fssData.FssInfo
			fssImported.FssHeaders = fssData.FssHeaders.filter(item => item.isSelected)
			fssImported.FssItems = XEclone(fssData.FssItems, true)
			fssImported.FssItems.forEach(item => {
				for (let key in item) {
					if (toDeleteFields.includes(key)) {
						delete item[key]
					}
				}
				// return item
			})

			scorecard.fssImported = fssImported
			//Import ScInfo
			scorecard.scInfo.fssDate = row.FssDate
			scorecard.scInfo.fssAuditType = row.FssAuditType
			scorecard.scInfo.fssMthsCover = row.FssMonthCover

			// Import ratiocomp into scorecard ScVariables
			fssImported.FssItems.forEach(item => {
				if ((item.FssType == 'RATIO') & ['CAT', 'CATITEM', 'CALC_ITEM', 'CALC_CAT'].includes(item.ItemType)) {
					if ((row.FssDenominator == 'T') & (item.Format == '$')) {
						// To-do: may need to do the ccy conversion
						scorecard.scVariables[item.CatCode] = mathjs.round(item[row.AmtField] / 1000, 3)
					} else if (item.Format == '%') {
						// To-do: may need to do the ccy conversion
						scorecard.scVariables[item.CatCode] = mathjs.round(item[row.AmtField], 4)
					} else {
						scorecard.scVariables[item.CatCode] = mathjs.round(item[row.AmtField], 2)
					}
				}
			})

			// re-compute those financial factors
			const fssFactors = scorecard.scModel.scModelFactorGroups.find(grp => grp.fssImportInd == true).factors

			fssFactors.forEach(factor => {
				factor.initValue.finValue.facValue_import = scorecard.scVariables[factor.finConfig.fssImportCat]
				factor.initValue.finValue.facValue = factor.initValue.finValue.facValue_import

				const attr = factor.attrs.find(attr =>
					mathjs.evaluate(attr.condition, {
						x: factor.initValue.finValue.facValue,
					})
				)
				factor.initValue.facLevel = attr.value
				factor.initValue.facScore = attr.score
				factor.initValue.finValue.facValue_IsOvrd = false
			})

			// close the import box
			isShowFssImport.value = false

			// console.log(row.AmtField)
		}

		watch(
			() => watchList,
			newvalue => {
				computeFOG(scorecard)
			},
			{ deep: true }
		)

		return {
			scorecard,
			// getFactorGroup,
			// getFactor,
			// getFactorValues,
			// getTreatmentValues,
			fssData,
			formatFactorValue,
			formatDate,

			tbButtons,
			isMounted: ref(false),
			toolbarClick,

			fssImportClick,
			xFssTable,
			isShowFssImport,
		}
	},
	mounted() {
		this.isMounted = true
	},
})
</script>

<style scoped>
.score-box {
	border: 1px solid;
	width: 150px;
	display: inline-block;
}
.score-box-prev {
	width: 30px;
	display: inline-block;
}
</style>
