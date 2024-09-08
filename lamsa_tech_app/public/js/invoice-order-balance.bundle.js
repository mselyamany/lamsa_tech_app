export { }


const targetDoctypes = {
  'Sales Order': {
    partyType: 'Customer',
    dateField: 'transaction_date'
  },
  'Sales Invoice': {
    partyType: 'Customer',
    dateField: 'posting_date'
  },
  'Delivery Note': {
    partyType: 'Customer',
    dateField: 'posting_date'
  },

  'Purchase Order': {
    partyType: 'Supplier',
    dateField: 'transaction_date'
  },
  'Purchase Invoice': {
    partyType: 'Supplier',
    dateField: 'posting_date'
  },
  'Purchase Receipt': {
    partyType: 'Supplier',
    dateField: 'posting_date'
  },
}

function getBalanceFieldForPartyType(partyType) {
  return partyType === 'Supplier' ? 'supplier_balance' : 'customer_balance'
}

for (let [doctype, partyDetails] of Object.entries(targetDoctypes)) {
  const { partyType, dateField } = partyDetails

  frappe.ui.form.on(doctype, {
    async before_load(frm) {
      if (typeof frm.doc[getBalanceFieldForPartyType(partyType)] != null) {
        return
      }

      if (frm.doc[partyType.toLowerCase()]) {
        await updatePartyBalance(frm, partyType, dateField)
      }
    },

    [partyType.toLowerCase()]: async (frm) => {
      await updatePartyBalance(frm, partyType, dateField)
    }
  })
}

/**
 * 
 * @param {*} doc 
 * @param { 'Customer' | 'Supplier'} partyType
 */
async function updatePartyBalance(frm, partyType, dateField) {
  const doc = frm.doc;

  if (doc.company) {
    const res = await frappe.call({
      method: "erpnext.accounts.utils.get_balance_on",
      args: {
        date: doc[dateField],
        party_type: partyType,
        party: doc[partyType.toLowerCase()],
        company: doc.company
      }
    })

    const balanceField = getBalanceFieldForPartyType(partyType)

    frm.set_value(balanceField, res.message)
    // doc[balance_field] = res.message;
    refresh_field(balanceField, 'accounts');
  }
}

