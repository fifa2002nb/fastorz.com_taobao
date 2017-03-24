#!/bin/sh

USECDN=$1
if test -z "$USECDN" 
then
    echo USECDN is require. usage: sh run.sh cdn.
    exit 1
fi

ROOT_DIR="/Users/yexu/dev/front-backend/fastorz.com_taobao"
DIST="${ROOT_DIR}/dist"
DIST_DIR="${ROOT_DIR}/dist/static"
SRC_DIR="${ROOT_DIR}/static"
GRUNT_BIN="/usr/local/bin/grunt"
TIMESTAMP=`date +%Y%m%d%H%M`
CDNHOST=7fvbl4.com1.z0.glb.clouddn.com

`$GRUNT_BIN --force 2>&1`

DIR_LIST=`find ${SRC_DIR} -type d -depth 1`


for i in `echo ${DIR_LIST}`;
do
    match=`echo $i | egrep -c "/js|/css"`
    if [ 0 -eq ${match} ]; then
        `cp -r "$i" "${DIST_DIR}"`
    fi
done

if [ "cdn" = $USECDN ];then
    `mv ${DIST_DIR}/js/app.min.js ${DIST_DIR}/js/app.min.${TIMESTAMP}.js && mv ${DIST_DIR}/css/app.min.css ${DIST_DIR}/css/app.min.${TIMESTAMP}.css && sed -e "s/\/static\/css\/app.min.css/http:\/\/${CDNHOST}\/app.min.${TIMESTAMP}.css/g" ${DIST_DIR}/templates/index.html.online|sed -e "s/\/static\/js\/app.min.js/http:\/\/${CDNHOST}\/app.min.${TIMESTAMP}.js/g" > ${DIST_DIR}/templates/index.html && rm -rf ${DIST_DIR}/templates/index.html.online`
else
    `mv ${DIST_DIR}/js/app.min.js ${DIST_DIR}/js/app.min.${TIMESTAMP}.js && mv ${DIST_DIR}/css/app.min.css ${DIST_DIR}/css/app.min.${TIMESTAMP}.css && sed -e "s/app.min.css/app.min.${TIMESTAMP}.css/g" ${DIST_DIR}/templates/index.html.online|sed -e "s/app.min.js/app.min.${TIMESTAMP}.js/g" > ${DIST_DIR}/templates/index.html && rm -rf ${DIST_DIR}/templates/index.html.online`
fi
