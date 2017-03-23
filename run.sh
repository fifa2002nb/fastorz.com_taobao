#!/bin/sh

ROOT_DIR="/Users/miles/dev/go_workspace/dev/frontend/fastorz.com_taobao"
DIST="${ROOT_DIR}/dist"
DIST_DIR="${ROOT_DIR}/dist/static"
SRC_DIR="${ROOT_DIR}/static"
GRUNT_BIN="/usr/local/bin/grunt"
TIMESTAMP=`date +%Y%m%d%H%M`

`$GRUNT_BIN --force 2>&1`

DIR_LIST=`find ${SRC_DIR} -type d -depth 1`


for i in `echo ${DIR_LIST}`;
do
    match=`echo $i | egrep -c "/js|/css"`
    if [ 0 -eq ${match} ]; then
        `cp -r "$i" "${DIST_DIR}"`
    fi
done

`sed -e "s/app.min.css/app.min.css?${TIMESTAMP}/g" ${DIST_DIR}/templates/index.html.online|sed -e "s/app.min.js/app.min.js?${TIMESTAMP}/g" > ${DIST_DIR}/templates/index.html && rm -rf ${DIST_DIR}/templates/index.html.online`
#`mv ${DIST_DIR}/templates/index.html.online ${DIST_DIR}/templates/index.html`
`cp ${DIST_DIR}/templates/index.html ${DIST_DIR}/templates/show/index.html`
