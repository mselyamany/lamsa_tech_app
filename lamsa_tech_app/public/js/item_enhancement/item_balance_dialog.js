import targetDocTypes from './target_doctypes'

frappe.ui.keys.add_shortcut({
  shortcut: 'ctrl+q',
  action: () => {
    const parentDocType = frappe.get_route()[1]
    if (!targetDocTypes.hasOwnProperty(parentDocType)) {
      return
    }

    const itemDocType = parentDocType + ' Item'
    const current_doc = $('.data-row.editable-row').parent().attr("data-name");
    const item_row = locals[itemDocType][current_doc];
    frappe.call({
      method: 'erpnext.stock.dashboard.item_dashboard.get_data',
      args: {

        item_code: item_row.item_code,
      },
      callback: function (r) {
        if (r.message.length > 0) {
          const d = new frappe.ui.Dialog({
            title: __('Item Balance'),
            width: 600
          });
          $(`<div class="modal-body ui-front">
                          <h2>${item_row.item_code}</h2>
                          <p>أختار المخزن:</p>
                          <table class="table table-bordered">
                          <thead>
                              <tr>
                              <th>اختيار</th>
                              <th>المخزن</th>
                              <th>الكمية</th>
                              <th>الوحدة</th>
                              </tr>
                          </thead>
                          <tbody>
                          </tbody>
                          </table>
                      </div>`).appendTo(d.body);
          r.message.forEach(element => {
            const tbody = $(d.body).find('tbody');
            const tr = $(`
                          <tr>
                              <td><input type="checkbox" class="check-warehouse" data-warehouse="${element.warehouse}"></td>
                              <td>${element.warehouse}</td>
                              <td>${element.actual_qty / item_row.conversion_factor}</td>
                              <td>${item_row.uom}</td>
                          </tr>
                          `).appendTo(tbody)
            tbody.find('.check-warehouse').on('change', function () {
              $('input.check-warehouse').not(this).prop('checked', false);
            });
          });
          d.set_primary_action("Select", function () {
            $(d.body).find('input:checked').each(function (i, input) {
              frappe.model.set_value(item_row.doctype, item_row.name, 'warehouse', $(input).attr('data-warehouse'));
            });
            cur_frm.rec_dialog.hide();
            cur_frm.refresh_fields();
          });
          cur_frm.rec_dialog = d;
          d.show();
        }
      }
    });
  },
  page: this.page,
  description: __('Get Item INFO'),
  ignore_inputs: true,

});
