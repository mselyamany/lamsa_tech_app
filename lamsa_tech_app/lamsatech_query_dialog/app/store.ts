import { reactive, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { frappeCallAsync } from './utils'
//  types
import {  type ItemStockRecord, type ItemSalesRecord, type ItemSellingRateRecord, type StockTableCallbackItem } from './types/stock'


type StockTableCallback = (items: StockTableCallbackItem[]) => void
interface ItemFilters {
  brand: string
  item_code: string 
  item_group: string

  customer: string 
  from_date: string 

  price_list: string
}

type UOMSellingRateRecord = { uom: string, rates: ItemSellingRateRecord[] }

export const useStore = defineStore('main', () => {

  // ==== App Options/Mode Behavior ====
  const appOptions = reactive({
    editable: false,

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    stockCallback: function () {} as StockTableCallback,
    stockActionText: __('Add Items'),
  })

  const filters = reactive<Partial<ItemFilters>>({
    brand: '',
    item_code: '',
    item_group: '',
    customer: '',

    price_list: '',
  })

  const itemRecords = reactive({
    stock: [] as ItemStockRecord[],
    sellingRates: [] as UOMSellingRateRecord[],
    salesHistory: [] as ItemSalesRecord[],
    uoms: [] as Array<{ uom: string, conversion_factor: number }>,
  })

  async function fetchItemStockRecords (): Promise<void> {
    try {
      const warehouseRecords = await frappeCallAsync({
        method:  'lamsa_tech_app.lamsatech_query_dialog.queries.get_item_stock_records',
        args: {
          item_code: filters.item_code,
          // transaction_date: new Date(),
          with_valuation_rate: true,
        },
      })
      
      itemRecords.stock = warehouseRecords.message
    } catch (error) {
      console.error('[store#fetchItemStockRecords]', error)
    }
  }

  async function fetchItemUOMsDetails (): Promise<void>{
    const uomResponse = await frappeCallAsync({
      method: 'lamsa_tech_app.lamsatech_query_dialog.queries.get_item_uoms_details',
      args: {
        item_code: filters.item_code,
      },
    })

    itemRecords.uoms = uomResponse.message
  }


  async function fetchItemSellingRateRecords (): Promise<void> {
    const uomRates: UOMSellingRateRecord[] = []
    for (const uomDetail of itemRecords.uoms) {
      const res = await frappeCallAsync({
        method:  'lamsa_tech_app.lamsatech_query_dialog.queries.get_item_selling_rates',
        args: {
          uom: uomDetail.uom,
          item_code: filters.item_code,
          customer: filters.customer,
          selling_price_list: filters.price_list,
          // transaction_date: Date.now(),
        },
      })
      
      const rates: ItemSellingRateRecord[] = []
      let ratesMap: Record<string, number> = res.message
      if (Object.keys(ratesMap).length == 0) {
        // there is no rating set for the item matching the criteria
        // could be a new item with no selling are or
        // no price is set for the item in the select price list(s)

        ratesMap = {
          [__('No Rate Set')]: NaN,
        }
      }
      for (const [list, rate] of Object.entries(ratesMap)) {
        rates.push({
          selling_price_list: list,
          rate: rate ?? NaN,
        })
      }

      uomRates.push({
        uom: uomDetail.uom,
        rates,
      })
    }


    itemRecords.sellingRates = uomRates
  }

  async function fetchItemSalesRecords (): Promise<void> {
    frappe.call({
      method: 'lamsa_tech_app.lamsatech_query_dialog.queries.get_item_sales_history',
      args: {
        item_code: filters.item_code,
        customer: filters.customer,
        selling_price_list: filters.price_list,
        from_date: filters.from_date,
      },
      async: false,
      callback (response) {
        itemRecords.salesHistory = response.message
      },
    })

   
    // frm.events.calc_uom_values(frm, d) // event on change of uom selectbox
  }

  watch(filters, async () => {
    await fetchItemStockRecords()
    await fetchItemUOMsDetails()
    await fetchItemSellingRateRecords()
    await fetchItemSalesRecords()
  }, { deep: true })

  return {
    appOptions,

    filters,
    itemRecords,
  }
})
 