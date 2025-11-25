FROM grafana/k6:0.52.0

# Copy k6 test script
COPY load.js /scripts/load.js

# Set working directory
WORKDIR /scripts

# Run k6 test
ENTRYPOINT ["k6", "run", "/scripts/load.js"]
