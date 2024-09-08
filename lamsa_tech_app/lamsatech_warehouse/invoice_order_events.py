import frappe
from erpnext.accounts.utils import get_balance_on


target_doctypes = {
    'Sales Order': {
        'party_type': 'Customer',
        'date_field': 'transaction_date'
    },
    'Sales Invoice': {
        'party_type': 'Customer',
        'date_field': 'posting_date'
    },
    'Delivery Note': {
        'party_type': 'Customer',
        'date_field': 'posting_date'
    },

    'Purchase Order': {
        'party_type': 'Supplier',
        'date_field': 'transaction_date'
    },
    'Purchase Invoice': {
        'party_type': 'Supplier',
        'date_field': 'posting_date'
    },
    'Purchase Receipt': {
        'party_type': 'Supplier',
        'date_field': 'posting_date'
    },
}


def compute_balance(doc, method=None):
    # this is called as a 'before_validate' method
    if doc.doctype in target_doctypes.keys():

        doctype_info = target_doctypes.get(doc.doctype)

        party_type = doctype_info['party_type']
        party = doc.customer if party_type == 'Customer' else doc.supplier

        balance = get_balance_on(
            date=getattr(doc, doctype_info['date_field']),
            party_type=party_type,
            party=party,
            company=doc.company)

        balance_field = 'customer_balance' if party_type == 'Customer' else 'supplier_balance'
        setattr(doc, balance_field, balance)
