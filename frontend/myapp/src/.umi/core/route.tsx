// @ts-nocheck
// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
import React from 'react';

export async function getRoutes() {
  const routes = {"1":{"path":"/user","layout":false,"id":"1"},"2":{"name":"login","path":"/user/login","parentId":"1","id":"2"},"3":{"path":"/welcome","name":"welcome","icon":"smile","parentId":"ant-design-pro-layout","id":"3"},"4":{"path":"/New","name":"New","icon":"smile","parentId":"ant-design-pro-layout","id":"4"},"5":{"path":"/admin","name":"admin","icon":"crown","access":"canAdmin","parentId":"ant-design-pro-layout","id":"5"},"6":{"path":"/admin","redirect":"/admin/sub-page","parentId":"5","id":"6"},"7":{"path":"/admin/sub-page","name":"sub-page","parentId":"5","id":"7"},"8":{"name":"list.table-list","icon":"table","path":"/list","parentId":"ant-design-pro-layout","id":"8"},"9":{"name":"靶场列表","icon":"table","path":"/Targetlist","parentId":"ant-design-pro-layout","id":"9"},"10":{"path":"*","layout":false,"id":"10"},"ant-design-pro-layout":{"id":"ant-design-pro-layout","path":"/","isLayout":true},"umi/plugin/openapi":{"path":"/umi/plugin/openapi","id":"umi/plugin/openapi"}} as const;
  return {
    routes,
    routeComponents: {
'1': React.lazy(() => import('./EmptyRoute')),
'2': React.lazy(() => import(/* webpackChunkName: "p__User__Login__index" */'@/pages/User/Login/index.tsx')),
'3': React.lazy(() => import(/* webpackChunkName: "p__Welcome" */'@/pages/Welcome.tsx')),
'4': React.lazy(() => import(/* webpackChunkName: "p__NewPage" */'@/pages/NewPage.tsx')),
'5': React.lazy(() => import('./EmptyRoute')),
'6': React.lazy(() => import('./EmptyRoute')),
'7': React.lazy(() => import(/* webpackChunkName: "p__Admin" */'@/pages/Admin.tsx')),
'8': React.lazy(() => import(/* webpackChunkName: "p__TableList__index" */'@/pages/TableList/index.tsx')),
'9': React.lazy(() => import(/* webpackChunkName: "p__TargetList__index" */'@/pages/TargetList/index.tsx')),
'10': React.lazy(() => import(/* webpackChunkName: "p__404" */'@/pages/404.tsx')),
'ant-design-pro-layout': React.lazy(() => import(/* webpackChunkName: "umi__plugin-layout__Layout" */'/root/security-chat-bot/frontend/myapp/src/.umi/plugin-layout/Layout.tsx')),
'umi/plugin/openapi': React.lazy(() => import(/* webpackChunkName: "umi__plugin-openapi__openapi" */'/root/security-chat-bot/frontend/myapp/src/.umi/plugin-openapi/openapi.tsx')),
},
  };
}
