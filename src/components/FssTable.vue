<template>
	<div>
		<fss-header v-model="formHeaders"/>
		<vxe-table
			ref="xTable"
			keep-source
			size="mini"
			border="full"
			show-overflow
			height="500px"
			highlight-current-row
			:tooltip-config="{ showAll: true, contentMethod: showTooltipMethod }"
			:menu-config="contextMenu"
			@cell-menu="cellContextMenuEvent"
			@menu-click="contextMenuClickEvent"
			@edit-closed="cellChanged"
			:row-style="rowStyle"
			:cell-style="cellStyle"
			:cell-class-name="cellClassModifier"
			:data="fssData.FssItems.filter(item => item.FssType == fssType)"
			:mouse-config="{ selected: true }"
			@keydown="editMethod"
			:keyboard-config="{
				isArrow: true,
				isDel: true,
				isEnter: true,
				isTab: true,
				isEdit: true,
				isEsc: true,
			}"
			:edit-config="{
				trigger: 'dblclick',
				mode: 'cell',
				activeMethod: activeRowMethod,
			}"
		>
			<vxe-table-column type="seq" width="50" :visible="true" align="center"></vxe-table-column>
			<vxe-table-column field="CatCode" title="Cat" width="80" align="center" :visible="false"></vxe-table-column>
			<vxe-table-column field="Item" title="Item" width="300"></vxe-table-column>
			<vxe-table-column
				v-for="yr in fssHeaders"
				:key="yr.FssDate"
				:field="yr.AmtField"
				:title="date.formatDate(yr.FssDate, 'DD MMM YYYY')"
				:edit-render="{
					name: 'input',
					attrs: { type: 'number', style: ' &::-webkit-inner-spin-button{ display: none; }   -moz-appearance:textfield;' },
				}"
				:formatter="formatAmount"
				align="right"
				width="120px"
			></vxe-table-column>
		</vxe-table>

		<vxe-modal ref="xModal" v-model="formData.showEdit" :title="formData.title" width="500" min-width="500" min-height="300" destroy-on-close>
			<template #default>
				<vxe-form
					title-align="top"
					title-width="100"
					:data="formData.formData"
					:items="formData.formItems"
					:rules="formData.formRules"
					@submit="formData.submitForm"
				></vxe-form>
			</template>
		</vxe-modal>
	</div>
</template>

<script>
import { defineComponent, computed, ref, reactive } from 'vue'
import { VXETable } from 'vxe-table'
import { clone as XEclone, commafy as XEcommafy, groupBy as XEgroupBy, sum as XEsum } from 'xe-utils'
import FssHeader from './common/FssHeader.vue'
import { date } from 'quasar'
import * as math from 'mathjs'
import { useStore } from 'vuex'

export default defineComponent({
	name: 'FssTable',
	props: ['fssTitle', 'fssType'],
	components: {FssHeader},
	setup(props) {
		const CAT_LINES = ['CAT', 'ITEMCAT', 'CALC_CAT', 'CALC_ITEM', 'CONTROL']
		const ITEM_LINES = ['ITEM', 'ITEMCAT']
		const BOLD_LINES = ['CAT', 'DISPLAY_BOLD', 'CALC_CAT']

		//pull data from vuex store. Due to immutable issue with vuex array, need to deep clone
		const $store = useStore()
		const fssData = reactive(XEclone($store.getters['uGradeModule/getFssData'], true))

		// only select those lines with fssType props (i.e. BS, PL,...)
		// const fssItems = fssData.FssItems.filter(item => item.FssType == props.fssType)
		const fssHeaders = fssData.FssHeaders
		const FssType = ref(props.fssType)

		const CatAmtByYear = computed(() => {
			let objCatAmts = {}
			let catLines = XEgroupBy(
				fssData.FssItems.filter(line => CAT_LINES.includes(line.ItemType)),
				'CatCode'
			)

			fssHeaders.map(finYr => {
				let obj = {}
				for (let catCode in catLines) {
					obj[catCode] = XEsum(catLines[catCode], finYr.AmtField)
					//   if (catCode == 'MthCover' && finYr.AmtField == 'AmtYr1'){
					//     console.log(catLines[catCode][0][finYr.AmtField] + ' : ' + catCode + ': ' + obj[catCode])
					//   }
				}
				objCatAmts[finYr.AmtField] = obj
			})
			return objCatAmts
		})

		const getCatAmtCurrYr = amtYr => {
			let currYr = { H1: {}, Y0: {} }

			fssHeaders.forEach((yr, yrIdx) => {
				if (yr.AmtField == amtYr) {
					currYr.Y0 = CatAmtByYear.value[amtYr]
					if (yrIdx > 0) {
						currYr.H1 = CatAmtByYear.value[fssHeaders[yrIdx - 1]['AmtField']]
					} else {
						for (let key in currYr.Y0) currYr.H1[key] = 0
					}
				}
			})
			return currYr
		}

		const calc_CashflowRatioComp = amtYr => {
			let CatAmtCurrYr = getCatAmtCurrYr(amtYr)
			let catLines = fssData.FssItems.filter(line => ['CALC_ITEM', 'CALC_CAT', 'CONTROL'].includes(line.ItemType))
			catLines.map(line => {
				try {
					if (!['', 'NA'].includes(line.Formula)) {
						line[amtYr] = math.evaluate(line.Formula, CatAmtCurrYr)
						CatAmtCurrYr.Y0[line.CatCode] = line[amtYr]
					}
				} catch (e) {
					console.log('error:' + line.CatCode + ' : ' + line.Formula)
				}
			})

			// find the next financial year to recompute their cashflow & ratiocomp
			let currYrIdx = fssHeaders.findIndex(yr => yr.AmtField == amtYr)
			if (currYrIdx < fssHeaders.length - 1) calc_CashflowRatioComp(fssHeaders[currYrIdx + 1]['AmtField'])
		}

		const sumUp = (CatCode, amtYr) => {
			//if all sublines empty then the category should be empty
			let sublines = fssData.FssItems.filter(item => item.CatCode == CatCode && ['ITEM', 'ITEMCAT'].includes(item.ItemType))

			if (sublines.length == sublines.filter(item => item[amtYr] === null || String(item[amtYr]) === '').length) return ''

			return sublines.reduce((acc, curr) => acc + (isNaN(Number(curr[amtYr])) ? 0 : Number(curr[amtYr])), 0)
		}

		const fss_cellChanged = (row, amtYr) => {
			let CatAmtCurrYr = getCatAmtCurrYr(amtYr)
			try {
				if (row['DependentItems'] == 'RECALC') calc_CashflowRatioComp(amtYr)
				else if (row['DependentItems'] != '') {
					let catRecomputes = row['DependentItems']
						.split(',')
						.map(cat => fssData.FssItems.find(line => CAT_LINES.includes(line.ItemType) && line.CatCode == cat.substring(3)))
					catRecomputes.map(line => {
						// console.log(line.CatCode)
						if (line.Formula == 'SUMUP') line[amtYr] = sumUp(line.CatCode, amtYr)
						else line[amtYr] = math.evaluate(line.Formula, CatAmtCurrYr)

						fss_cellChanged(line, amtYr)
					})
				}
			} catch (e) {
				// console.log('error 2:' + e)
			}
		}

		// event trigger by the cell change, recompute those related categories
		const cellChanged = ({ row, column }) => {
			fss_cellChanged(row, column.property)
			// console.log(row[column.property])
		}

		const rowStyle = ({ row }) => {
			if (BOLD_LINES.includes(row.ItemType)) {
				return {
					backgroundColor: 'lightgrey',
					fontWeight: 'bold',
				}
			}
		}

		const cellStyle = ({ row, column }) => {
			if (ITEM_LINES.includes(row.ItemType) && column.property && column.property == 'Item') {
				return {
					paddingLeft: '15px',
				}
			}
		}

		const cellClassModifier = ({ row, column }) => {
			if (column.type == 'seq') return ''
			if (column.property.substring(0, 5) == 'AmtYr' && row['NoteYr' + column.property.substring(5)] != '') {
				return ['col--dirty--comment']
			}
		}

		const showTooltipMethod = ({ type, column, row, items, _columnIndex }) => {
			// row.FssYears
			if (!column || !row) return ''
			if (column.type == 'seq') return ''
			if (column.property.substring(0, 5) == 'AmtYr' && 'NoteYr' + column.property.substring(5)) {
				return row['NoteYr' + column.property.substring(5)]
			}
			return ''
		}

		const activeRowMethod = ({ row }) => {
			return ITEM_LINES.includes(row.ItemType)
		}

		const editMethod = e => {
			// xTable.value.setActiveCell(row, column.property)
			console.log(e)
		}

		const formatAmount = ({ cellValue, row }) => {
			let val = ''
			if (cellValue === '' || cellValue === null) {
				val = ''
			} else if (row['Format'] == '#') {
				val = XEcommafy(Number(cellValue), { digits: 0 })
			} else if (row['Format'] == '%') {
				val = XEcommafy(Number(cellValue) * 100, { digits: 1 }) + '%'
			} else if (row['Format'] == '$') {
				val = '$' + XEcommafy(Number(cellValue), { digits: 0 })
			} else {
				val = XEcommafy(Number(cellValue), { digits: 0 })
			}
			return val
		}

		const xTable = ref({})
		const xModal = ref({})

		const contextMenu = {
			header: {
				options: [
					[{ code: 'showFinHeaders', name: 'Show FSS Headers', visible: true, disabled: false }],
					[{ code: 'showCategory', name: 'Show/Hide Categories', visible: true, disabled: false }],
				],
			},
			body: {
				options: [
					[
						{ code: 'insertLineAbove', name: 'Insert an above line', prefixIcon: 'fa fa-link', visible: true, disabled: false },
						{ code: 'insertLineBelow', name: 'Insert a below line', prefixIcon: 'fa fa-link', visible: true, disabled: false },
						{ code: 'deleteLine', name: 'Delete this line', prefixIcon: 'fa fa-link', visible: true, disabled: false },
					],
					[{ code: 'changeItemDesc', name: 'Change this cell description', prefixIcon: 'fa fa-link', visible: true, disabled: false }],
					[{ code: 'addEditNote', name: 'Add/Edit Comment for this cell', prefixIcon: 'fa fa-link', visible: true, disabled: false }],
				],
			},
			visibleMethod({ options, row, column }) {
				if (!column) return false
				if (!row) return true
				if (!['BS', 'PL'].includes(row['FssType'])) {
					options.forEach(list => {
						list.forEach(item => {
							item.visible = false
						})
					})
					return true
				}

				options.forEach(list => {
					list.forEach(item => {
						item.visible = false
						if (['insertLineAbove', 'insertLineBelow', 'deleteLine'].includes(item.code)) {
							item.visible = column.type == 'seq'
							item.disabled = !ITEM_LINES.includes(row.ItemType)
						}
						if (item.code == 'changeItemDesc') {
							item.visible = typeof column.property != 'undefined' && column.property == 'Item' && ITEM_LINES.includes(row.ItemType)
						}
						if (item.code == 'addEditNote') {
							item.visible = typeof column.property != 'undefined' && column.property.substring(0, 5) == 'AmtYr'
						}
					})
				})
				return true
			},
		}

		const cellContextMenuEvent = async ({ row }) => {
			const $table = xTable.value
			await $table.setCurrentRow(row)
		}

		const contextMenuClickEvent = async ({ menu, row, column }) => {
			if (menu.code == 'showFinHeaders') {
				await VXETable.modal.alert({ message: 'This function will be done very soon.', status: 'info', confirmButtonText: 'OK' })
			}
			if (menu.code == 'showCategory') {
				let col = xTable.value.getColumnByField('CatCode')
				col.visible = !col.visible
				await xTable.value.refreshColumn()
			}
			if (menu.code == 'changeItemDesc') {
				formData.formItems = formData.changeItemDesc.formItems
				formData.formRules = formData.changeItemDesc.formRules
				formData.title = 'Change Item Description'
				formData.formData = { Item: row['Item'], FieldName: column.property }
				formData.selectRow = row
				formData.showEdit = true
			}
			if (menu.code == 'addEditNote') {
				formData.formItems = formData.addEditNote.formItems
				formData.formRules = formData.addEditNote.formRules
				formData.title = 'Add/Edit Note'
				let notefield = 'NoteYr' + column.property.substring(5) //if field AmtYrX then the notefile should be NoteYrX

				formData.formData = { Note: row[notefield], FieldName: notefield }
				formData.selectRow = row
				formData.showEdit = true
			}

			if (menu.code == 'insertLineAbove' || menu.code == 'insertLineBelow') {
				let curLineIdx = fssData.FssItems.indexOf(row)

				formData.formItems = formData.insertSubCat.formItems
				formData.formItems[0].title = 'Category: ' + row.CatCode + ' - ' + fssData.FssItems[curLineIdx]['Item']
				formData.formRules = formData.insertSubCat.formRules
				formData.title = 'Insert A New Financial Item'
				formData.formData = formData.insertSubCat.formData
				formData.formData.FssType = row.FssType
				formData.formData.CatCode = row.CatCode
				formData.formData.Item = ''
				formData.formData.ItemType = row.ItemType
				formData.formData.DependentItems = row.DependentItems
				formData.formData.rowIndex = menu.code == 'insertLineAbove' ? curLineIdx : curLineIdx + 1

				formData.selectRow = row
				formData.showEdit = true
			}
			if (menu.code == 'deleteLine') {
				if (fssData.FssItems.filter(line => ITEM_LINES.includes(line.ItemType) && line.CatCode == row.CatCode).length <= 1) {
					VXETable.modal.alert({
						message: 'This line is the only line in ' + row.CatCode + ' category. You cannot delete it!',
						status: 'info',
						confirmButtonText: 'OK',
					})
				} else {
					VXETable.modal.confirm({ message: 'Are you sure you want to delete this line?' }).then(type => {
						if (type == 'confirm') fssData.FssItems.splice(fssData.FssItems.indexOf(row), 1)
					})
				}
			}
		}

		const insertNewLine = fields => {
			const record = {
				FssType: fields.FssType,
				Seq: fields.curLineIndex + 1,
				CatCode: fields.CatCode,
				Item: fields.Item,
				ItemType: fields.ItemType,
				Formula: 'NA',
				DependentItems: fields.DependentItems,
				AmtYr1: null,
				AmtYr2: null,
				AmtYr3: null,
				AmtYr4: null,
				AmtYr5: null,
				NoteYr1: '',
				NoteYr2: '',
				NoteYr3: '',
				NoteYr4: '',
				NoteYr5: '',
			}
			fssData.FssItems.splice(fields.rowIndex, 0, record)
		}

		const formData = reactive({
			showEdit: false,
			selectRow: {},
			title: '',
			formData: {},
			formItems: [],
			formRules: {},
			submitForm: e => {
				let fieldname = e.data.FieldName

				if (fieldname == 'INSERT_LINE') {
					insertNewLine(e.data)
					formData.showEdit = false
				} else {
					let fieldval = ''
					if (fieldname == 'Item') fieldval = e.data.Item.trim()
					if (fieldname.substring(0, 6) == 'NoteYr') fieldval = e.data.Note.trim()

					formData.selectRow[fieldname] = fieldval
					formData.showEdit = false
				}
			},
			changeItemDesc: {
				formData: { Item: '', FieldName: '' },
				formItems: [
					{
						field: 'Item',
						title: 'Description',
						span: 24,
						itemRender: { name: '$input', props: { placeholder: 'Enter Item Description' } },
					},
					{
						align: 'center',
						span: 24,
						titleAlign: 'left',
						itemRender: {
							name: '$buttons',
							children: [
								{ props: { type: 'submit', content: 'Change', status: 'primary' } },
								{ props: { type: 'button', content: 'Cancel' }, events: { click: e => (formData.showEdit = false) } },
							],
						},
					},
				],
				formRules: {
					Item: [
						{ required: true, message: 'Item Description is mandatory!' },
						{ min: 3, max: 50, message: "Item Description's should be from 3 to 50 characters." },
					],
				},
			},
			addEditNote: {
				formData: { Note: '', FieldName: '' },
				formItems: [
					{ field: 'Note', title: 'Note', span: 24, itemRender: { name: '$textarea', props: { placeholder: 'Enter comment', rows: 4 } } },
					// { field: 'FieldName', title: 'FieldName', span: 24, visible: false, itemRender: { name: '$input'} },
					{
						align: 'center',
						span: 24,
						titleAlign: 'right',
						itemRender: {
							name: '$buttons',
							children: [
								{ props: { type: 'submit', content: 'Save', status: 'primary' } },
								{ props: { type: 'button', content: 'Clear' }, events: { click: e => (e.data.Note = '') } },
								{ props: { type: 'button', content: 'Cancel' }, events: { click: e => (formData.showEdit = false) } },
							],
						},
					},
				],
				formRules: {
					Note: [{ max: 200, message: 'A note should not be longer than 200 characters.' }],
				},
			},
			insertSubCat: {
				formData: {
					FieldName: 'INSERT_LINE',
					FssType: '',
					Seq: 999,
					CatCode: '',
					Item: '',
					ItemType: '',
					Formula: 'NA',
					DependentItems: '',
					AmtYr1: null,
					AmtYr2: null,
					AmtYr3: null,
					AmtYr4: null,
					AmtYr5: null,
					NoteYr1: '',
					NoteYr2: '',
					NoteYr3: '',
					NoteYr4: '',
					NoteYr5: '',
				},
				formItems: [
					{ title: 'Category: ', span: 24, titleAlign: 'left', titleWidth: 500, titlePrefix: { icon: 'fa fa-address-card-o' } },
					{
						field: 'Item',
						title: 'Description',
						span: 24,
						itemRender: { name: '$input', props: { placeholder: 'Enter Item Description' } },
					},
					{
						align: 'center',
						span: 24,
						titleAlign: 'right',
						itemRender: {
							name: '$buttons',
							children: [
								{ props: { type: 'submit', content: 'Insert', status: 'primary' } },
								{ props: { type: 'button', content: 'Cancel' }, events: { click: e => (formData.showEdit = false) } },
							],
						},
					},
				],
				formRules: {
					Item: [
						{ required: true, message: 'Item Description is mandatory!' },
						{ min: 3, max: 50, message: "Item Description's should be from 3 to 50 characters." },
					],
				},
			},
		})

		const formHeaders = ref(null)

		formHeaders.value = {
			params: {
				AuditType: ['Audited', 'Unaudited', 'Management', 'Draft'], 
				Denominator: ['Million', 'Thousand'],
				Ccy: ['USD', 'SGD', 'VND'],
			},
			columns: {labelwidth: 350},
			rows: [
				{label: "Customer Name",  type: 'input', values: [{value: "test customer"}]},
				{label: "Customer ID", type: 'input', values: [{value: "T1234567"}]},
				{label: 'Financial Date', type: 'display', values: [{value: '31 Dec 2016'}, {value: '31 Dec 2017'}, {value: '31 Dec 2018'}, {value: '31 Dec 2019'}, {value: '31 Dec 2020'}]},
				{label: 'Months Cover', type: 'input', align:'text-center', validate: 'checkMthCover', values: [{value: '12'}, {value: '12'}, {value: '12'}, {value: '12'}, {value: '12'}]},
				{label: 'Audit Type', type: 'select', param:'AuditType', values: [{value: 'Audited'}, {value: 'Audited'}, {value: 'Audited'}, {value: 'Unaudited'}, {value: 'Management'}]},
			]
		}

		// harcoding this to force FSS recalculate all the cashflow & ratioComp
		// calc_CashflowRatioComp('AmtYr1')

		return {
			FssType,
			fssData,
			fssHeaders,
			formHeaders,
			// fssItems,

			xTable,
			xModal,

			// CatAmtByYear,
			date,
			cellChanged,
			rowStyle,
			cellStyle,
			cellClassModifier,
			showTooltipMethod,
			activeRowMethod,
			editMethod,
			formatAmount,
			contextMenu,
			formData,
			cellContextMenuEvent,
			contextMenuClickEvent,
		}
	},
})
</script>