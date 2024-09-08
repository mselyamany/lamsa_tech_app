import targetDocTypes from "./target_doctypes";

for (const parentDocType of Object.keys(targetDocTypes)) {
  const docType = parentDocType + ' Item'

  frappe.ui.form.on(docType, {
    rate: function (frm, cdt, cdn) {
      cur_frm.fields_dict["items"].$wrapper.find('.grid-body .rows').find(".grid-row").each(function (i, item) {
        let d = locals[cur_frm.fields_dict["items"].grid.doctype][$(item).attr('data-name')];
        if (d["rate"] < d.base_price_list_rate) {
          $(item).find('.grid-static-col').css({ 'background-color': 'yellow' });
        }
        else {
          $(item).find('.grid-static-col').css({ 'background-color': 'transparent' });
        }
      });
    }
  });

  frappe.ui.form.on(docType, {
    rate: function (frm, cdt, cdn) {
      cur_frm.fields_dict["items"].$wrapper.find('.grid-body .rows').find(".grid-row").each(function (i, item) {
        let d = locals[cur_frm.fields_dict["items"].grid.doctype][$(item).attr('data-name')];
        if (d["rate"] < d.valuation_rate) {
          $(item).find('.grid-static-col').css({ 'background-color': 'red' });
        }
        else {
          $(item).find('.grid-static-col').css({ 'background-color': 'transparent' });
        }
      });
    }
  })
}