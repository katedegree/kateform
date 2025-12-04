FROM node:24
WORKDIR /kateform
RUN apt-get update && \
  apt-get install -y rsync && \
  rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm install
RUN mv node_modules /opt/node_modules
COPY . .
RUN printf '#!/bin/bash\n\
  set -e\n\
  [ ! -d /kateform/node_modules ] || [ -z "$(ls -A /kateform/node_modules 2>/dev/null)" ] && \
  cp -r /opt/node_modules /kateform/node_modules || \
  rsync -au --quiet /opt/node_modules/ /kateform/node_modules/\n\
  exec "$@"\n' > /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["npm", "run", "storybook"]
EXPOSE 6006
