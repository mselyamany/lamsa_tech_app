export interface ItemStockRecord {
  warehouse: string
  qty: number
  valuation_rate: number
}

export interface ItemSellingRateRecord {
  selling_price_list: string
  rate: number
}

export interface ItemSalesRecord {
  invoice: string
  invoice_status: number
  currency: string
  customer:string
  selling_price_list: string
  warehouse: string

  uom: string
  rate: number
  qty: number
  amount: number

  warehouse: string
  posting_datetime: string
}


export type StockTableCallbackItem = {
  item_code: string
  warehouse: ItemStockRecord['warehouse']
  uom: string
  qty: number
  rate: ItemSellingRateRecord['rate']
} 