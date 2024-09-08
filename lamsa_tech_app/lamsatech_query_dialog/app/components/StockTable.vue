<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { Ref } from 'vue'
import { useStore } from '../store'
import type { StockTableCallbackItem } from 'types/stock'

const store = useStore()

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function numericStringRef (initialVal: string, preventNegative=false) {
  const refObj = ref(initialVal)

  return computed({
    get () {
      return refObj.value
    },
    set (stringValue: string) {
      // Keep only digits and a decimal point
      let cleanValue = stringValue.replace(/[^\d.]/g, '')
      // Ensure there's only one decimal point
      cleanValue = cleanValue.replace(/(\..*)\./g, '$1')
      // Update the value in the input field
      if (preventNegative) {
        const parsedValue = parseFloat(cleanValue)
        if (parsedValue < 0) {
          return
        }
      }
      refObj.value = cleanValue
    },
  })
}

/*
 * A map of warehouse : warehouse-entry's user input fields
 * 
 * The fields and their must be generated ONCE & ONLY ONCE.
 * Don't generate input value Refs at the same time the records that 
 * used for display are generated.
 */
const warehousesFields: Record<string, {
  selectedUOM: Ref<{ uom: string, conversion_factor: number }>
  selectedRate: Ref<string>
  selectedQty: Ref<string>
}> = {}

// watching warehouse and rates entries 
// because these are the most important to reflect on user inputs
watch([() => store.itemRecords.stock, () => store.itemRecords.sellingRates], () => {
  for (const warehouseRecord of store.itemRecords.stock) {
    const selectedUOM = ref(store.itemRecords.uoms[0] ?? { uom: '', conversion_factor: 0 })

    const uomRatesDetail = store.itemRecords.sellingRates.find(uomRateRecord => uomRateRecord.uom = selectedUOM.value.uom)
    const selectedRate =  numericStringRef(
      uomRatesDetail 
        ? uomRatesDetail.rates[0]?.rate.toString(10) ?? ''
        : '', 
      true)

    warehousesFields[warehouseRecord.warehouse] = {
      selectedUOM,
      selectedRate,
      selectedQty: numericStringRef('0', true),
    }
  }

  // console.log('[StockTable.vue#warehouses fields]', warehousesFields)
}, { immediate: true })

const stockRecords = computed(() => {
  const records = []
  for (const warehouseRecord of store.itemRecords.stock) {
    const currentWarehouseFields = warehousesFields[warehouseRecord.warehouse]

    const selectedUOM = currentWarehouseFields.selectedUOM
    let selectedUOMRateRecord = store.itemRecords.sellingRates
      .find(uomRateRecord =>  uomRateRecord.uom == selectedUOM.value.uom)

    if (selectedUOMRateRecord == null) {
      // a supposedly-impossible scenario
      // only true when the item has no UOM even not a stock UOM
      break
    }

    records.push(reactive({
      ...warehouseRecord,
      ...currentWarehouseFields,
      rates: selectedUOMRateRecord.rates,
      uoms: store.itemRecords.uoms,
    }))
  }

  return records
})

// ===

const readOnlyMode = computed(() => !store.appOptions.editable)

function onAction (): void {
  const items: StockTableCallbackItem[] = []

  for (const stockRecord of stockRecords.value) {
    const parsedQty = Number.parseFloat(stockRecord.selectedQty)
    const parsedRate = Number.parseFloat(stockRecord.selectedRate)
    if (parsedQty !== 0 && !Number.isNaN(parsedQty) && Number.isFinite(parsedQty)
        && !Number.isNaN(parsedRate) && Number.isFinite(parsedRate)
    ) {
      items.push({
        item_code: store.filters.item_code as string,
        warehouse: stockRecord.warehouse,
        uom: stockRecord.selectedUOM.uom,
        rate: parsedRate,
        qty: parsedQty,
      })
    }
  }

  if (items.length) {
    store.appOptions.stockCallback(items)
  }
}

</script>

<template>
  <VCard
    :title="__('Stock Details')"
    variant="flat"
  >
    <VTable>
      <thead>
        <tr>
          <th v-text="__('Warehouse')" />
          <th v-text="__('Unit')" />
          <th v-text="__('Available Quantity')" />
          <th v-text="__('Valuation Rate')" />
          <th v-text="__('Price List')" />
          <th v-text="__('Base Rate')" />
          <th v-text="__('Selling Rate')" />
          <th v-text="__('Sold Quantity')" />
        </tr>
      </thead>
      <tbody>
        <template v-if="stockRecords?.length">
          <template
            v-for="mainRecord of stockRecords"
            :key="mainRecord.warehouse"
          >
            <tr
              v-for="(subRateRecord, index) of mainRecord.rates"
              :key="`${mainRecord.warehouse}-${subRateRecord.selling_price_list}`"
            >
              <th 
                v-if="index == 0"
                :rowspan="mainRecord.rates.length"
              >
                {{ mainRecord.warehouse }}
              </th>
              <td
                v-if="index == 0"
                :rowspan="mainRecord.rates.length"
              >
                <VSelect
                  v-model="mainRecord.selectedUOM"
                  :items="mainRecord.uoms"
                  :readonly="readOnlyMode"
                  return-object
                  item-value="uom"
                  item-title="uom"
                  hide-details
                />
              </td>
              <td
                v-if="index == 0"
                :rowspan="mainRecord.rates.length"
              >
                {{ format_number(mainRecord.qty / mainRecord.selectedUOM.conversion_factor) }}
              </td>
              <td
                v-if="index == 0"
                :rowspan="mainRecord.rates.length"
              >
                {{ format_currency(mainRecord.valuation_rate * mainRecord.selectedUOM.conversion_factor) }}
              </td>

              <td
                :class="isNaN(subRateRecord.rate) ? 'text-error' : ''"
              >
                {{ subRateRecord.selling_price_list }}
              </td>

              <!-- 
                the rate conversion is handled on the server
                it is not just a simple multiplication
               -->
              <td
                :class="isNaN(subRateRecord.rate) ? 'text-error' : ''"          
              >
                {{ format_currency(subRateRecord.rate) }}
              </td>

              <td
                v-if="index == 0"
                :rowspan="mainRecord.rates.length"
              >
                <VTextField
                  v-model="mainRecord.selectedRate"
                  :readonly="readOnlyMode"
                  hide-details
                />
              </td>
            
              <td
                v-if="index == 0"
                :rowspan="mainRecord.rates.length"
              >
                <VTextField
                  v-model="mainRecord.selectedQty"
                  :readonly="readOnlyMode"
                  hide-details
                />
              </td>
            </tr>
          </template>
        </template>
        <tr v-else>
          <td colspan="9">
            No Record
          </td>
        </tr>
      </tbody>
    </VTable>
    <VCardActions class="mt-2">
      <VBtn
        v-if="stockRecords.length && !readOnlyMode"
        color="primary"
        variant="elevated"
        block
        @click="onAction"
      >
        {{ store.appOptions.stockActionText }}
      </VBtn>
    </VCardActions>
  </VCard>
</template>