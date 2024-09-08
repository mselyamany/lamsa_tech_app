declare namespace frappe {

  function provide(key: string): void

  /*
   *  frappe.call         
   */
  export interface FrappeCallOptions {
    type?: string
    method: string

    async?: boolean

    args?: Record<string, any>
    btn?: any


    freeze?: boolean
    freeze_message?: string

    headers?: Record<string, string>

    callback?: (r: any) => void

    error?: (r: any) => void
  }

  function call (options: FrappeCallOptions): void
  function call (method: string, args?: FrappeCallOptions['args']): void

  function format (value: any, docfield?: {fieldtype: string, [key: string]: any}, options?: Record<string, any>, doc?: any): string
  
  namespace ui {
    export class FieldGroup extends form.Layout {
      dirty: boolean
    
      no_submit_on_enter: boolean
    
      focus_on_first_input (): void
    
      catch_enter_as_submit (): void
    
      get_input (fieldname: string): any
    
      get_field (fieldname: string): any
    
      get_values (ignore_errors: boolean, check_invalid: boolean): object
    
      get_value (key: string): any
    
      set_value (key: string, val: any): void
    
    
      has_field (fieldname: string): boolean 
    
      set_input (key: string, val: any): void 
    
      set_values (dict: Record<string, any>): Promise<any>
    
      clear (): void 
    
      set_df_property (fieldname: string, prop: string, value: any): void 
    }

    export class Dialog extends FieldGroup {

      constructor (opts?: object)
    
      display: boolean
      is_dialog: true
    
      static: boolean
    
      size: any
    
      modal_body: any
    
      $wrapper: any
      wrapper: any
    
    
      $body: any
      body: any
    
    
      $message: any
      message: any
    
    
      header: any
      footer: any
      standard_actions: any
      custom_action:  any
    
      minimizable: boolean
    
    
      has_primary_action?: boolean
    
      get_primary_btn () 
    
      get_minimize_btn ()
    
      set_message (text)
    
      clear_message () 
    
    
      set_primary_action (label, click) 
    
      set_secondary_action (click)
    
      set_secondary_action_label (label)
      disable_primary_action () 
    
      enable_primary_action () 
    
      set_title (t) 
    
      set_indicator () 
    
      show (): this 
    
      hide (): void 
    
      get_close_btn (): any
    
      get_secondary_btn (): any 
    
      no_cancel (): void
    
      cancel (): void
    
      toggle_minimize (): void 
    
      hide_scrollbar (bool: boolean) 
    
      add_custom_action (label: string, action: () => void, css_class?: string):void 
    }  
  }

  namespace ui.form {
    export type FormEventHandler = (...args: any) => void
  
    export type FormDoctypeConfig = Record<string, FormEventHandler>
  
    function get_event_handler_list (doctype: string, fieldname: string): []
  
    const handlers: {
      [key: string]: Record<string, any>
    }
  
    function on (doctype: string, fieldname: string,  handler:  FormEventHandler): void
    function on (doctype: string, config: FormDoctypeConfig): void
  
    function off (doctype: string, fieldname: string, handler: FormEventHandler): void
  
    function trigger (doctype: string, fieldname: string): void

    export class Layout {  
      views: object
      pages: []
      tabs: []
      sections: []
      page_breaks: []
      sections_dict: object
      fields_list: []
      fields_dict: object
      section_count: number
      column_count: number
    
      wrapper: any
      parent: any
    
      message: any
      message_color: string
      page: any
    
      fields: []
    
      frm: any
    
      get_doctype_fields (): [] 
    
      get_new_name_field (): any
    
      get_fields_from_layout (): []
    
      show_message (html: string, color): void 
    
      refresh_fields (fields: []): void 
    
      add_fields (fields: []): void 
      
      set_focus (field: any): void 
    
    
      // account for missing fields types
      [key: string]: any
    }
  
    export class ScriptManager {
      constructor (opts?: object)
    }
  }

  /*
   *  frappe.utils         
   */
  type UtilsType = {
    [key: string]: any
  }
  const utils: UtilsType

  function show_alert (message: string): void

  function timeout (duration: number): void

  function run_serially (...any): void

  namespace model {
    const new_names: object
    const new_name_count: object

    function scrub (txt: string): string
    
    function unscrub (txt): string
  
    function can_create (doctype): boolean
  
    function can_select (doctype): boolean
  
    function can_read (doctype): boolean
  
    function can_write (doctype): boolean
  
    function can_get_report (doctype): boolean
  
    function can_delete (doctype): boolean
  
    function can_cancel (doctype): boolean
  
    function has_workflow (doctype) : boolean
  
    function is_submittable (doctype) : boolean
  
    function is_table (doctype) : boolean
  
    function is_single (doctype): boolean
    function is_tree (doctype) : boolean
  
    function is_fresh (doc): boolean

    function can_import (doctype, frm, meta = null): boolean 
  
    function can_export (doctype, frm): boolean
  
    function can_print (doctype, frm): boolean
  
    function can_email (doctype, frm): boolean
    function can_share (doctype, frm): boolean
  
    function has_value (dt, dn, fn): boolean
  
    function get_list (doctype, filters): any[]
  
    function get_value (doctype, filters, fieldname, callback): any
  
    function set_value  (
      doctype,
      docname,
      fieldname,
      value,
      fieldtype?,
      skip_dirty_trigger? = false
    ): void
  
    function on (doctype, fieldname, fn): void
  
    function trigger  (fieldname, value, doc, skip_dirty_trigger = false): any
  
    function get_doc  (doctype, name): any 
  
    function clear_table (doc, parentfield): void

    function get_new_doc (doctype, parent_doc, parentfield, with_mandatory_children) 
		
    function make_new_doc_and_get_name  (doctype, with_mandatory_children)

    function get_new_name  (doctype): string

    function set_default_values (doc, parent_doc): any
    function create_mandatory_children (doc):void 

    function get_default_value (df, doc, parent_doc): any 


    function add_child (parent_doc, doctype, parentfield, idx): any 

    function copy_doc (doc, from_amend, parent_doc, parentfield): object

    function remove_from_locals (doctype, name): void
  
    function clear_doc (doctype, name): void
  
    function get_no_copy_list (doctype): any[]
  
    function delete_doc (doctype, docname, callback) : any
  
    function rename_doc (doctype, docname, callback): void
  
    function round_floats_in (doc, fieldnames): any 
  
    function validate_missing (doc, fieldname): void
  
    function get_all_docs (doc): any
  
    function get_full_column_name (fieldname, doctype): string
  
    function is_numeric_field (fieldtype): boolean
  }
}

declare const locals: any
declare const cur_frm: any
declare const cur_dialog: any

declare const __: (s: string, args?: any[]) => string 

declare const format_number = (value: number | string, decimals: number) => string
declare const format_number = (value: number | string, format: string, decimals: number) => string
declare const format_currency = (value: number | string, currency: string, decimals: nubmer) => string