from . import __version__ as app_version

app_name = "lamsa_tech_app"
app_title = "LamsaTech App"
app_publisher = "LamsaTech"
app_description = "LamsaTech\'s main app"
app_email = "void"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
app_include_css = [
    "/assets/lamsa_tech_app/css/erpnext_theme.css",
    'assets/lamsa_tech_app/node_modules/vuetify/dist/vuetify.min.css',
]

app_include_js = [
    "item-enhancement.bundle.js",
    "invoice-order-balance.bundle.js",
    "query-dialog.bundle.js"
]

# include js, css files in header of web template
# web_include_css = "/assets/lamsa_tech_app/css/lamsa_tech_app.css"
# web_include_js = "/assets/lamsa_tech_app/js/lamsa_tech_app.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "lamsa_tech_app/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {
# }

# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Fixtures
# ------------
fixtures = [
    {
        "dt": "Custom Field",
        "filters": [
            ['name', 'like', '%balance%']
        ]
    },
    {
        "dt": "Property Setter",
        "filters": [
            ["name", "in", (
                'Item-main-show_title_field_in_link'
            )]
        ]
    }
]

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# "Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# "methods": "lamsa_tech_app.utils.jinja_methods",
# "filters": "lamsa_tech_app.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "lamsa_tech_app.install.before_install"
# after_install = "lamsa_tech_app.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "lamsa_tech_app.uninstall.before_uninstall"
# after_uninstall = "lamsa_tech_app.uninstall.after_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "lamsa_tech_app.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# "Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# "Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# "ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

doc_events = {
    "*": {
        "before_validate": "lamsa_tech_app.lamsatech_warehouse.invoice_order_events.compute_balance"
    }
}


# Scheduled Tasks
# ---------------

# scheduler_events = {
# "all": [
# "lamsa_tech_app.tasks.all"
# ],
# "daily": [
# "lamsa_tech_app.tasks.daily"
# ],
# "hourly": [
# "lamsa_tech_app.tasks.hourly"
# ],
# "weekly": [
# "lamsa_tech_app.tasks.weekly"
# ],
# "monthly": [
# "lamsa_tech_app.tasks.monthly"
# ],
# }

# Testing
# -------

# before_tests = "lamsa_tech_app.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# "Task": "lamsa_tech_app.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["lamsa_tech_app.utils.before_request"]
# after_request = ["lamsa_tech_app.utils.after_request"]

# Job Events
# ----------
# before_job = ["lamsa_tech_app.utils.before_job"]
# after_job = ["lamsa_tech_app.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# {
# "doctype": "{doctype_1}",
# "filter_by": "{filter_by}",
# "redact_fields": ["{field_1}", "{field_2}"],
# "partial": 1,
# },
# {
# "doctype": "{doctype_2}",
# "filter_by": "{filter_by}",
# "partial": 1,
# },
# {
# "doctype": "{doctype_3}",
# "strict": False,
# },
# {
# "doctype": "{doctype_4}"
# }
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# "lamsa_tech_app.auth.validate"
# ]
