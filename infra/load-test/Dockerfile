FROM grafana/k6:1.4.2

# Install busybox for httpd server (lightweight)
USER root
RUN apk add --no-cache busybox-extras

# Copy k6 test script and entrypoint
COPY load.js /scripts/load.js
COPY entrypoint.sh /scripts/entrypoint.sh
RUN chmod +x /scripts/entrypoint.sh

# Set working directory
WORKDIR /scripts

# Enable web dashboard by default
ENV K6_WEB_DASHBOARD=true
ENV K6_WEB_DASHBOARD_PORT=5665
ENV K6_WEB_DASHBOARD_EXPORT=/tmp/report.html
# Disable open browser behavior to prevent k6 from waiting
ENV K6_WEB_DASHBOARD_OPEN=false

# Expose web dashboard port and report server port
EXPOSE 5665
EXPOSE 8080

# Run entrypoint script
ENTRYPOINT ["/scripts/entrypoint.sh"]
