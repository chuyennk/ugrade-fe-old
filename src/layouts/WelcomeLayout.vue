<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <q-icon name="auto_graph"></q-icon>
          <span class="q-ml-sm text-h4">uGrade</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>

export default {
  // name: 'LayoutName',

  setup () {

    return {

    }
  }
}
</script>
