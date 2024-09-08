from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in lamsa_tech_app/__init__.py
from lamsa_tech_app import __version__ as version

setup(
	name="lamsa_tech_app",
	version=version,
	description="LamsaTech\'s main app",
	author="LamsaTech",
	author_email="void",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
