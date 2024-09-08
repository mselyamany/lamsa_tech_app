import type { StockTableCallbackItem } from 'types/stock'
import { useStore } from './store'

export function initialize (): void {
  const store = useStore()

  /*
   * 1- once button clicked initiate Frappe's dialog
   * 2- inject/mount vue app into Frappe's dialog 
   * 
   * Updating frappes search fields
   *  causes api calls to update reactive stores of our vue application
   */
  
  let appDialog: null | frappe.ui.Dialog = null

  function showQueryDialog (frm: any): void {
    if (appDialog == null) {
      appDialog = new frappe.ui.Dialog({
        'title': 'Item List',
        'fields': [
          {
            'label': 'Filters',
            'fieldname': 'filters_sec',
            'fieldtype': 'Section Break',
          },
          {
            'label': 'Item',
            'fieldname': 'search_item_code',
            'fieldtype': 'Link',
            'options': 'Item',
            'change': () => {
              store.filters.item_code = appDialog!.get_value('search_item_code')
            },
          },
          {
            'fieldname': 'search_col_br',
            'fieldtype': 'Column Break',
          },
          {
            label: 'Customer',
            fieldname: 'customer',
            fieldtype: 'Link',
            options: 'Customer',
            read_only: true,
            change () {
              store.filters.customer = appDialog!.get_value('customer')
            },
          },
          {
            'fieldname': 'search_col_br_2',
            'fieldtype': 'Column Break',
          },
          {
            label: 'Price List',
            fieldname: 'price_list',
            fieldtype: 'Link',
            options: 'Price List',
            change () {
              store.filters.price_list = appDialog!.get_value('price_list')
            },
          },
          {
            'fieldname': 'search_col_br_3',
            'fieldtype': 'Column Break',
          },
          {
            'label': 'From Date',
            'fieldname': 'from_date',
            'fieldtype': 'Date',
            'change': () => {
              store.filters.from_date = appDialog!.get_value('from_date')
            },
          },
          {
            'fieldname': 'result_sec',
            'fieldtype': 'Section Break',
          },
          {
            'label': 'Vue App',
            'fieldname': 'vue_app',
            'fieldtype': 'HTML',
            'options': '<div id="query-dialog-app">Vue app should be visible here</div>',
          },
    
        ],
        primary_action () {
          appDialog!.hide()
        },
      })

      appDialog.get_primary_btn().html(__('Close'))

      window.document.__LAMSA__mountQueryDialogBody(appDialog.$wrapper.find('#query-dialog-app')[0])
    }


    appDialog.$wrapper.find('.modal-dialog').css('width', '90%')
    appDialog.$wrapper.find('.modal-dialog').css('max-width', 'none')
    appDialog.show()

  
    appDialog.set_value('customer', frm.doc.customer)
  }
  
  // ========================= //
  // ===== Sales Invoice ===== //
  // ========================= //
  function salesInvoiceCallback (frm: any, items: StockTableCallbackItem[]): void {
    for (const item of items) {  
      // CHECK IF FIRST ROW OF GRID IS EMPTY
      if (frm.doc.items.length == 1) {
        if (typeof (frm.doc.items[0].item_code) == 'undefined') {
          frm.doc.items = []
        }
      }

      let row: any = null
      frappe.run_serially([
        () => {
          row = frm.fields_dict.items.grid.add_new_row()
        },
        () => frappe.timeout(0.1),
        () => frappe.model.set_value(row.doctype, row.name, 'item_code', item.item_code),
        // () => frappe.model.set_value(row.doctype, row.name, 'description', val.description),
        () => frappe.model.set_value(row.doctype, row.name, 'qty', item.qty),
        () => frappe.timeout(0.5),
        () => frappe.model.set_value(row.doctype, row.name, 'uom', item.uom),
        () => frappe.timeout(0.5),
        () => frappe.model.set_value(row.doctype, row.name, 'rate', item.rate),
        () => frappe.model.set_value(row.doctype, row.name, 'warehouse', item.warehouse),
        () => frappe.show_alert(__('Added {0} {1} ({2})', [item.item_code, item.uom, item.qty])),
      ])  
    }

    appDialog?.hide()
  }

  frappe.ui.form.on('Sales Invoice', {
    setup () {
      // some setup goes here
    },
    
    onload: function (frm) {
      // some comment
    },
  
    refresh: function (frm) {
      frm.get_field('items')
        .grid
        .add_custom_button(__('Query Dialog'), () => {

          store.appOptions.editable = frm.doc.docstatus === 0
          showQueryDialog(frm)
        })
  
      $('button:contains(\'Query Query\')').addClass('btn-primary')


      store.appOptions.stockCallback = (items) => salesInvoiceCallback(frm, items)
    },
  })
}


