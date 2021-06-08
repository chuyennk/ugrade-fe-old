<template>
	<q-layout view="hHh LpR fFf">
		<q-header elevated>
			<q-toolbar>
				<q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

				<q-toolbar-title shrink> uGrade </q-toolbar-title>

				<div class="text-caption self-end">version 0.0.1</div>
				<q-space />
				<div id="show-buttons" class="row"></div>
			</q-toolbar>
		</q-header>

		<q-drawer v-model="leftDrawerOpen" bordered class="bg-grey-1">
			<essential-link />
		</q-drawer>

		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script>
import EssentialLink from '../components/EssentialLink.vue'
import { defineComponent, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
	name: 'MainLayout',

	components: {
		EssentialLink,
	},

	setup(context) {
		const leftDrawerOpen = ref(false)
		const toggleLeftDrawer = () => (leftDrawerOpen.value = !leftDrawerOpen.value)

		const route = useRoute()
		const router = useRouter()

		const toolbars = {
			Search: [],
			CustInfo: [{ name: 'Close', icon: 'far fa-times-circle', action: 'gotoRoute', tooltip: 'Close - back to customer search' }],
		}

		return {
			leftDrawerOpen,
			toggleLeftDrawer,
		}
	},
})
</script>
