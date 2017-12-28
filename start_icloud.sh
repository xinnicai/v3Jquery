#!/bin/bash

docker run -d --net=host   \
--restart=always    \
--log-opt max-file=10 --log-opt max-size=20k    \
-u root     \
-e DOCKBOX_HOST=dockboxqa.cmp.yw.zj.chinamobile.com  \
--add-host dockboxqa.cmp.yw.zj.chinamobile.com:20.26.33.123 \
--add-host edgeboxqa.cmp.yw.zj.chinamobile.com:20.26.33.123 \
--add-host icloudqa.cmp.yw.zj.chinamobile.com:20.26.33.123  \
registry.yw.zj.chinamobile.com/dcos/icloud:v3-1