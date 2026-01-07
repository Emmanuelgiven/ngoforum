import pymysql

# Install PyMySQL as MySQLdb for Django
pymysql.install_as_MySQLdb()

# Bypass Django's version check for PyMySQL
pymysql.version_info = (2, 2, 1, "final", 0)
