FROM alpine:3.19

ARG PB_VERSION=0.36.7
ARG TARGETARCH

RUN apk add --no-cache wget unzip ca-certificates

RUN EXPECTED_AMD64="0e4f28b0447a964dc25d82af28e682097a80457f7bc89a83d29e243e17898ef8" \
    && EXPECTED_ARM64="81d2720aedf7493d589d02c79928984700f5742071f5ed8427860c7d9fb7a818" \
    && wget -q \
       "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${TARGETARCH}.zip" \
       -O /tmp/pb.zip \
    && if [ "${TARGETARCH}" = "amd64" ]; then EXPECTED="${EXPECTED_AMD64}"; else EXPECTED="${EXPECTED_ARM64}"; fi \
    && echo "${EXPECTED}  /tmp/pb.zip" | sha256sum -c - \
    && unzip /tmp/pb.zip -d /pb/ \
    && rm /tmp/pb.zip \
    && chmod +x /pb/pocketbase

WORKDIR /pb

EXPOSE 8090

CMD ["./pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data"]
