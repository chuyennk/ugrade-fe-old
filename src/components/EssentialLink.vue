<template>
	<div>
		<!-- <q-scroll-area class="fit"> -->
		<q-list padding class="text-grey-8">
			<q-item class="GNL__drawer-item" v-ripple v-for="link in links1" :key="link.text" clickable>
				<q-item-section avatar>
					<q-icon :name="link.icon" />
				</q-item-section>
				<q-item-section>
					<q-item-label>{{ link.text }}</q-item-label>
				</q-item-section>
			</q-item>

			<q-separator inset class="q-my-sm" />

			<q-item class="GNL__drawer-item" v-ripple v-for="link in links2" :key="link.text" clickable>
				<q-item-section avatar>
					<q-icon :name="link.icon" />
				</q-item-section>
				<q-item-section>
					<q-item-label>{{ link.text }}</q-item-label>
				</q-item-section>
			</q-item>

			<q-separator inset class="q-my-sm" />

			<q-item class="GNL__drawer-item" v-ripple v-for="link in links3" :key="link.text" clickable>
				<q-item-section>
					<q-item-label>{{ link.text }} <q-icon v-if="link.icon" :name="link.icon" /></q-item-label>
				</q-item-section>
			</q-item>
		</q-list>
		<!-- </q-scroll-area> -->
	</div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
	name: 'EssentialLink',
	props: [],
	setup() {
		const links1 = ref([
			{ icon: 'home', text: 'Home Page' },
			{ icon: 'search', text: 'Search Customers' },
			{ icon: 'manage_accounts', text: 'Manage Users' },
		])

		const links2 = [{ icon: 'grading', text: 'View Rating Guidelines' }]

		const links3 = [
			{ icon: '', text: 'Support & Self-help' },
			{ icon: 'contact_support', text: 'Contact Support' },
			{ icon: 'help_outline', text: 'Help' },
		]

		return {
			links1,
			links2,
			links3,
		}
	},
})
</script>

<style lang='scss'>
.GNL {
	&__toolbar {
		height: 64px;
	}
	&__toolbar-input {
		width: 55%;
	}
	&__drawer-item {
		line-height: 24px;
		border-radius: 0 24px 24px 0;
		margin-right: 12px;
		.q-item__section--avatar {
			.q-icon {
				color: #5f6368;
			}
		}
		.q-item__label {
			color: #3c4043;
			letter-spacing: 0.01785714em;
			font-size: 0.875rem;
			font-weight: 500;
			line-height: 1.25rem;
		}
	}
	&__drawer-footer-link {
		color: inherit;
		text-decoration: none;
		font-weight: 500;
		font-size: 0.75rem;
		&:hover {
			color: #000;
		}
	}
}
</style>
