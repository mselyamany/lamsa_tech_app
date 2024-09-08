import frappe
from frappe.model.docstatus import DocStatus
from erpnext.stock.get_item_details import get_item_price, get_price_list_rate_for
from erpnext.stock.utils import get_stock_balance
from frappe.query_builder.functions import Timestamp


def _get_item_set_price_lists(item_code, selling_or_buying='both'):
    """
        Returns the names of Price Lists which has a price set for the item.
        :param selling_or_buying:  'selling', 'buying', 'both'
    """
    pl = frappe.qb.DocType('Price List')
    ip = frappe.qb.DocType('Item Price')

    query = (frappe.qb.from_(pl)
             .select(pl.name)
             .inner_join(ip)
             .on((pl.name == ip.price_list))
             .where(ip.price_list_rate > 0)
             .where(ip.item_code == item_code)
             .groupby(pl.name))

    if selling_or_buying != 'both':
        query = query.where(
            ip.selling == 1) if selling_or_buying == 'selling' else query.where(ip.buying == 1)

    raw_result = query.run()

    lists = []
    for record in raw_result:
        lists.append(record[0])

    return lists


@frappe.whitelist()
def get_item_selling_rates(item_code, uom=None, customer=None, selling_price_list: str | list[str] = None, transaction_date=None):
    """
    Returns a list of paris with the format `{ key=Price List xxx : value=Price List xxx Item Rate }`
    """

    stock_uom = frappe.get_value('Item', item_code, 'stock_uom')
    uom_factor = 1
    if uom is not None:
        uom_factor = frappe.get_value('UOM Conversion Detail', {
            'parent': item_code, 'uom': uom}, 'conversion_factor')
    # uom = uom or frappe.get_value('Item', item_code, 'stock_uom')

    rates_map = {}
    if not selling_price_list:
        selling_price_list = _get_item_set_price_lists(
            item_code, selling_or_buying='selling')

    if type(selling_price_list) is not list:
        selling_price_list = [selling_price_list]

    for price_list in selling_price_list:

        docstr = """
        The weirdly un-documented behavior of this built-in ERPNext function
        and how UOMs' prices are handled...

        If no 'uom' argument is passed
            if exists 'Item Price' with nullish/empty
                return price
            else
                if 'stock_uom" argument is passed
                    return stock_uom price
                else
                    return null
        else
            if exists 'Item Price' with uom
                return price
            else
                if price_list_uom_dependant is True
                    if exits nullish/empty 'Item Price'
                        return val
                    else
                        if stock_uom arg passed
                            return stock_uom uom price
                        else
                            return null
                else
                    # assuming conversion factor is passed as well"
                    # if not passed same behavior of price_list_uom_dependant=True

                    if exits nullish/empty 'Item Price'
                        return val * conversion factor
                    else
                        if stock_uom arg passed
                            return stock_uom uom price * conversion factor
                        else
                            return null
        """

        rate = get_price_list_rate_for({
            'stock_uom': stock_uom,
            'uom': uom,
            'conversion_factor': uom_factor,
            'price_list_uom_dependant': False,

            'price_list': price_list,
            'customer': customer,
            'qty': 1,
            'transaction_date': transaction_date
        }, item_code)

        rates_map[price_list] = rate

    return rates_map


def get_warehouse_list(item_code):
    # TODO: maybe return zero-qty warehouses as well? check business decision.
    warehouse_list = frappe.db.get_list('Bin',
                                        filters={
                                            'item_code': item_code,
                                            'actual_qty': ['>', 0]
                                        },
                                        fields=['warehouse']
                                        )

    warehouse_array = []
    for el in warehouse_list:
        warehouse_array.append(el.warehouse)

    return warehouse_array


@frappe.whitelist()
def get_item_stock_records(item_code: str,
                           warehouse: str | list[str] = None,
                           transaction_date=None,
                           transaction_time=None,
                           with_valuation_rate=False,
                           ):
    """
    Returns a list of records of available item quantity in a given warehouse or warehouses list on , optionally, a given date and time
    valuation rate is returned if needed
    :param warehouse: warehouse(s) to account for, if not set returns all available warehouses records
    """

    if not item_code:
        return []

    if not warehouse:
        warehouse = get_warehouse_list(item_code)

    if type(warehouse) is str:
        warehouse = [warehouse]

    records = []
    for cur_warehouse in warehouse:
        qty = get_stock_balance(
            item_code, cur_warehouse, transaction_date, transaction_time, with_valuation_rate)

        if with_valuation_rate:
            qty, valuation_rate = qty
            records.append({
                'warehouse': cur_warehouse,
                'qty': qty,
                'valuation_rate': valuation_rate
            })
        else:
            records.append({
                'warehouse': cur_warehouse,
                'qty': qty,
            })

    return records


@frappe.whitelist()
def get_item_uoms_details(item_code):
    uom_table = frappe.qb.DocType('UOM Conversion Detail')
    query = (frappe.qb.from_(uom_table)
             .select(
        uom_table.uom,
        uom_table.conversion_factor
    )
        .where(uom_table.docstatus == 0)
        .where(uom_table.parent == item_code)
        .orderby(uom_table.idx)
    )

    result = query.run(as_dict=True)
    return result


@frappe.whitelist()
def get_item_sales_history(item_code, customer=None, selling_price_list=None, from_date=None):

    invoice_table = frappe.qb.DocType('Sales Invoice')
    item_table = frappe.qb.DocType('Sales Invoice Item')

    if selling_price_list and type(selling_price_list) is not list:
        selling_price_list = [selling_price_list]

    query = (frappe.qb.from_(item_table)
             .select(
        (invoice_table.name).as_('invoice'),
        (invoice_table.docstatus).as_('invoice_status'),
        invoice_table.customer,
        invoice_table.selling_price_list,
        item_table.item_code,
        item_table.uom,
        item_table.rate,
        item_table.qty,
        item_table.amount,
        item_table.warehouse,
        invoice_table.currency,
        Timestamp(invoice_table.posting_date,
                  invoice_table.posting_time, 'posting_datetime')
    )
        .inner_join(invoice_table)
        .on(invoice_table.name == item_table.parent)
        .where((item_table.item_code == item_code))
        .where((invoice_table.docstatus != 0))
        .where((invoice_table.docstatus != 2))
        .orderby(invoice_table.posting_date, invoice_table.posting_time, order=frappe.qb.desc)
        .limit(25)
    )

    if customer:
        query = query.where((invoice_table.customer == customer))

    if selling_price_list:
        query = query.where(
            (invoice_table.selling_price_list.isin(selling_price_list)))

    if from_date:
        query = query.where((invoice_table.posting_date >= from_date))

    return query.run(as_dict=1)
