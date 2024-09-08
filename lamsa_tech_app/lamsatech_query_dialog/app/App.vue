<script setup lang="ts">
import {  onMounted } from 'vue'
import StockTable from 'components/StockTable.vue'
import HistoryTable from './components/HistoryTable.vue'
import { VDivider } from 'vuetify/components'

onMounted(() => {
  console.log('Vue should be mounted now')
})
</script>

<template>
  <div>
    <StockTable />
    <VDivider inset />
    <HistoryTable />
  </div>
</template>