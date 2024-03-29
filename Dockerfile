ARG grafana_version=latest

FROM grafana/grafana:${grafana_version}

# Make it as simple as possible to access the grafana instance for development purposes
# Do NOT enable these settings in a public facing / production grafana instance
ENV GF_AUTH_ANONYMOUS_ORG_ROLE "Admin"
ENV GF_AUTH_ANONYMOUS_ENABLED "true"
ENV GF_AUTH_BASIC_ENABLED "false"
# Set development mode so plugins can be loaded without need to sign
ENV GF_DEFAULT_APP_MODE "development"
# Load useful plugins to help with development
ENV GF_INSTALL_PLUGINS "marcusolsson-static-datasource"
