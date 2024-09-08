import JQueryStatic from 'jquery'

declare const $: JQueryStatic

declare module 'vue' {
  interface ComponentCustomProperties {
    __: typeof __
    frappe: Window.frappe
    
    format_number: Window.format_number
    format_currency: Window.format_currency
  }
}
