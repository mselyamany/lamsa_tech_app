<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '../store'

const store = useStore()

const frappe = window.frappe

const uomFactorMap = computed(() => {
  // NOTE: not the best performance but does the job
  const result: Record<string, number> = {}
  store.itemRecords.uoms.forEach((record) => {
    result[record.uom] = record.conversion_factor
  })

  return result
})

</script>

<template>
  <VCard
    :title="__('Sales History')"
    variant="flat"
  >
    <VCardSubtitle>
      <span v-if="store.filters.customer">{{ __('Customer') }} {{ store.filters.customer }}</span>
      <span v-else>{{ __('All customers') }}</span>
    </VCardSubtitle>
    <VTable>
      <thead class="thead-light">
        <tr>
          <th v-text="__('Invoice No')" />
          <th 
            v-if="!store.filters.customer"
            v-text="__('Customer')"
          />
          <th 
            v-if="!store.filters.price_list"
            v-text="__('Price List')"
          />
          <th v-text="__('Posting Date')" />
          <th v-text="__('Unit')" />
          <th v-text="__('Qty')" />
          <th v-text="__('Qty (stock uom)')" />
          <th v-text="__('Rate')" />
          <th v-text="__('Amount')" />
          <th v-text="__('Warehouse')" />
        </tr>
      </thead>
      <tbody>
        <template v-if="store.itemRecords.salesHistory.length">
          <tr 
            v-for="record of store.itemRecords.salesHistory"
            :key="record.invoice"
          >
            <td>
              <a
                target="_blank"
                :href="frappe.utils.get_form_link('Sales Invoice', record.invoice)"
              > {{ record.invoice }}</a>
            </td>
            <td v-if="!store.filters.customer">
              <a
                target="_blank"
                :href="frappe.utils.get_form_link('Customer', record.customer)"
              > {{ record.customer }}</a>
            </td>
            <td v-if="!store.filters.price_list">
              {{ record.selling_price_list }}
            </td>
            <td> {{ frappe.format(record.posting_datetime, { fieldtype: 'Datetime'}) }}</td>
            <td> {{ record.uom }} </td>
            <td> {{ frappe.format(record.qty, { fieldtype: 'float'}) }} </td>
            <td> {{ format_number(record.qty * uomFactorMap[record.uom] ?? NaN) }} </td>
            <td> {{ format_currency(record.rate, record.currency) }} </td>
            <td> {{ format_currency(record.rate * record.qty, record.currency) }} </td>
            <td> {{ record.warehouse }}</td>
          </tr>
        </template>
        <tr v-else>
          <td>
            {{ __('No sales records match your criteria') }}
          </td>
        </tr>
      </tbody>
    </VTable>
  </VCard>
</template>