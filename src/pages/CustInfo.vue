<template>
  <q-page class="q-pa-sm">
    <teleport to="#show-buttons" v-if="isMounted">
      <div v-for="btn in tbButtons" :key="btn.name">
        <q-btn
          :icon="btn.icon"
          @click="toolbarClick(btn.name)"
          class="q-mr-xs glossy"
          color="dark"
          round
          size="sm"
          dense
        >
          <q-tooltip transition-show="rotate" transition-hide="rotate">{{
            btn.tooltip
          }}</q-tooltip>
        </q-btn>
      </div>
    </teleport>

    <div class="q-pa-sm">
      <div class="q-gutter-y-sm" style="max-width: 1200px">
        <q-card>
          <q-tabs
            v-model="tab"
            dense
            class="bg-grey-3"
            align="left"
            active-color="primary"
            indicator-color="primary"
            narrow-indicator
          >
            <q-tab name="CustInfo" label="Customer Info" no-caps />
            <q-tab name="Fss" label="Financial Spreadsheets" no-caps />
            <q-tab name="Scard" label="Scorecards" no-caps />
            <q-space />
            <!-- <q-btn label="Close" @click="closeCustInfo" color="dark" size="sm" rounded/>           -->
          </q-tabs>

          <!-- <q-separator /> -->

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="CustInfo">
              <div style="height: 450px">
                <div class="row text-h6">
                  Customer Infomation
                  <q-space />
                  <q-btn icon="fas fa-pen" round size="sm"
                    ><q-tooltip>Edit customer information</q-tooltip></q-btn
                  >
                </div>
                <div class="row">
                  <div class="col-3">Cust ID:</div>
                  <div class="col-9">{{ custInfo.custID }}</div>
                </div>
                <div class="row">
                  <div class="col-3">Name:</div>
                  <div class="col-9">{{ custInfo.custName }}</div>
                </div>
                <div class="row">
                  <div class="col-3">Registration Number:</div>
                  <div class="col-9">
                    {{ custInfo.bizRegNum }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-3">Registration Date:</div>
                  <div class="col-9">
                    {{
                      formatDate(
                        { cellValue: custInfo.bizRegDate },
                        "DD MMM YYYY"
                      )
                    }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-3">RM Code:</div>
                  <div class="col-9">{{ custInfo.rmCode }}</div>
                </div>
                <div class="row">
                  <div class="col-3">Team Code:</div>
                  <div class="col-9">{{ custInfo.teamCode }}</div>
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="Fss">
              <div>
                <vxe-table
                  :data="fssData.FssHeaders"
                  size="mini"
                  height="400px"
                  highlight-current-row
                  :keyboard-config="{ isArrow: true }"
                  :sort-config="{
                    defaultSort: { field: 'FssDate', order: 'desc' },
                  }"
                >
                  <vxe-table-column type="seq" width="60"></vxe-table-column>
                  <vxe-table-column
                    field="FssDate"
                    title="FssDate"
                    :formatter="formatDate"
                    sortable
                  ></vxe-table-column>
                  <vxe-table-column
                    field="FssMonthCover"
                    title="FssMonthCover"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="FssCcy"
                    title="FssCcy"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="FssAuditType"
                    title="FssAuditType"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="FssHasData"
                    title="FssHasData"
                  ></vxe-table-column>
                </vxe-table>
                <q-separator />
                <div class="row q-ma-sm justify-end">
                  <q-btn
                    label="View Financial Spreadsheets"
                    type="button"
                    rounded
                    color="dark"
                    @click="viewFssModule"
                  />
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="Scard">
              <div>
                <vxe-table
                  :data="scList"
                  size="mini"
                  height="400px"
                  highlight-current-row
                  :keyboard-config="{ isArrow: true }"
                  :sort-config="{
                    defaultSort: { field: 'scID', order: 'desc' },
                  }"
                >
                  <vxe-table-column type="seq" width="40"></vxe-table-column>
                  <vxe-table-column field="scID" title="Scorecard ID" sortable width="200">
                    <template #default="{ row }">
                      <vxe-button
                        type="text"
                        :content="row.scID"
                        icon="fa fa-edit"
                        @click="viewScorecard(row.scID)"
                      ></vxe-button>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column
                    field="scModelID"
                    title="Model ID"
                  ></vxe-table-column>
                  <vxe-table-column field="FOG" title="FOG"></vxe-table-column>
                  <vxe-table-column
                    field="scStatus"
                    title="Status"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="scCreatedDate"
                    title="Created Date"
                    :formatter="formatDate"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="scAprrovedDate"
                    title="Aprroved Date"
                    :formatter="formatDate"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="scCreatedBy"
                    title="Created By"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="scApprovedBy"
                    title="Approved By"
                  ></vxe-table-column>
                </vxe-table>
                <q-separator />
              </div>
              <div class="row q-ma-sm justify-end">
                <q-btn
                  label="New Scorecard"
                  type="button"
                  rounded
                  color="dark"
                  @click="newScorecardDialog"
                />
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>

    <vxe-modal
      ref="xModal"
      v-model="isShowCreateNewScorecard"
      title="Create A New Scorecard"
      width="600"
      min-width="600"
      min-height="300"
      destroy-on-close
    >
      <template #default>
        <q-card>
          <q-card-section>
            <q-select
              filled
              v-model="actScModels.modelSelected"
              :options="actScModels.modelList"
              label="Choose a model to create a new scorecard"
              stack-label
              :dense="true"
              :options-dense="true"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              flat
              label="Cancel"
              @click="() => (isShowCreateNewScorecard = false)"
              v-close-popup
            />
            <q-btn
              flat
              label="Create New Scorecard"
              @click="createNewScorecard"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </template>
    </vxe-modal>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { date, format } from "quasar";
import { clone as XEclone } from "xe-utils";

export default defineComponent({
  name: "PageIndex",
  props: [],
  setup() {
    const store = useStore();
    const loginInfo = store.getters["uGradeModule/getLoginInfo"];
    const custInfo = ref(store.getters["uGradeModule/getCustInfo"]);
    const scList = computed(() => store.getters["uGradeModule/getScList"]);
    const fssData = XEclone(store.getters["uGradeModule/getFssData"], true); //due to vxe table will modify the table data, need to deep clone
    const fssCols = [
      {
        name: "FssDate",
        label: "Financial Date",
        field: "FssDate",
        sortable: true,
        format: (val) => date.formatDate({ cellValue: val }, "DD MMM YYYY"),
        style: "width: 150px",
        align: "center",
      },
      {
        name: "FssMonthCover",
        label: "Months Covered",
        field: "FssMonthCover",
        style: "width: 100px",
        align: "center",
      },
      {
        name: "FssCcy",
        label: "CCY",
        field: "FssCcy",
        style: "width: 80px",
        align: "center",
      },
      {
        name: "FssAuditType",
        label: "Report Type",
        field: "FssAuditType",
        style: "width: 150px",
        align: "center",
      },
      {
        name: "FssHasData",
        label: "With Data Indicator",
        field: "FssHasData",
        style: "width: 80px",
        align: "center",
      },
      { name: "" },
    ];

    const router = useRouter();
    const viewFssModule = async () => {
      await router.push("/fss");
    };

    const tab = ref("CustInfo");
    const formatDate = ({ cellValue }, strFormat = "") =>
      strFormat
        ? date.formatDate(cellValue, strFormat)
        : date.formatDate(cellValue, "DD MMM YYYY");

    const tbButtons = [
      {
        name: "Close",
        icon: "far fa-times-circle",
        action: "close",
        tooltip: "Close - back to customer info screen",
      },
    ];

    const toolbarClick = (name) => {
      if (name == "Close") {
        router.push({ name: "Search" });
      } else {
        alert("function to-be-done");
      }
    };

    const viewScorecard = async (scID) => {
      const scorecard = await store.dispatch("uGradeModule/getScorecard", scID);
      if (scorecard.message == "OK") {
        await router.push("/scorecard");
      } else {
        alert("No scorecard found");
      }
    };

    const actScModels = ref({
      modelSelected: "",
      modelList: [],
    });

    const newScorecardDialog = async () => {
      // TODO: check for pending PE/PA before allow create a new scorecard

      const res = await store.dispatch("uGradeModule/getActScModels");
      actScModels.value.modelList = res.params.map((model) => {
        return {
          label: model.scModelInfo.scModelName + " (" + model.scModelInfo.scModelID + ")",
          value: model._id,};
      });
      isShowCreateNewScorecard.value = true;
      // await router.push('/scorecard')
    };

    const createNewScorecard = async () => {
      if (actScModels.value.modelSelected == ""){
        alert("Please select a scorecard model for grading.")
        return
      }

      const newScData = {
        custInfo: custInfo.value,
        scModel: actScModels.value.modelSelected,
        createdBy: loginInfo.loginUser.UserName,
      };

      const res = await store.dispatch("uGradeModule/createNewScorecard",newScData)

      if (res.message=='OK'){
        const res = await store.dispatch("uGradeModule/getScorecardList", custInfo.value.custID);
        if (res.message=='OK'){
          // scList.value = res.params
          isShowCreateNewScorecard.value = false;
        }
      }else{
        alert(res.message)
      }
    };

    const isShowCreateNewScorecard = ref(false);

    return {
      custInfo,
      fssCols,
      fssData,
      scList,

      isShowCreateNewScorecard,
      actScModels,
      newScorecardDialog,
      createNewScorecard,

      isMounted: ref(false),
      tbButtons,
      toolbarClick,
      viewFssModule,
      viewScorecard,
      tab,
      formatDate,
    };
  },
  mounted() {
    this.isMounted = true;
  },
});
</script>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 400px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: $grey-3

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
