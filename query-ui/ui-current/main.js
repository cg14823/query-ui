import angular from "/ui/web_modules/angular.js";
import app from "/ui/app/app.js";
import ace from '/ui/libs/ace/ace-wrapper.js';

import { NgModule } from '/ui/web_modules/@angular/core.js';
import { UIRouterUpgradeModule } from '/ui/web_modules/@uirouter/angular-hybrid.js';

angular
  .module(app)
  .config(function (mnPluggableUiRegistryProvider, mnPermissionsProvider) {
    ace.config.set('basePath','/ui/libs/ace');

    mnPluggableUiRegistryProvider.registerConfig({
      name: 'Documents',
      state: 'app.admin.doc_editor',
      includedByState: 'app.admin.doc_editor',
      plugIn: 'workbenchTab',
      ngShow: "rbac.cluster.bucket['.'].data.docs.read  && rbac.cluster.bucket['.'].data.xattr.read",
      index: 0
    });

    mnPluggableUiRegistryProvider.registerConfig({
      name: 'Query',
      state: 'app.admin.query.workbench',
      includedByState: 'app.admin.query',
      plugIn: 'workbenchTab',
      index: 1
    });

    mnPermissionsProvider.set("cluster.n1ql.meta!read"); // system catalogs

    mnPermissionsProvider.setBucketSpecific(function (name) {
      return [
        "cluster.bucket[" + name + "].n1ql.select!execute",
        "cluster.bucket[" + name + "].data.docs!upsert",
        "cluster.bucket[" + name + "].data.xattr!read"
      ]
    });
  });

class QueryUI {
  static get annotations() { return [
    new NgModule({
      imports: [
        UIRouterUpgradeModule.forRoot({
          states: [{
            name: "app.admin.doc_editor.**",
            url: "/doc_editor",
            lazyLoad: ($transition$) => {
              return import('/_p/ui/query/qw_query_doc_editor.js').then(m => {
                $transition$.injector().get('$ocLazyLoad').load({name: 'qwQueryDocEditor'});
              });
            }
          }, {
            name: "app.admin.query.**",
            url: "/query",
            lazyLoad: ($transition$) => {
              return import('/_p/ui/query/ui-current/query.js').then(m => {
                $transition$.injector().get('$ocLazyLoad').load({name: 'qwQuery'});
              });
            }
          }]
        })
      ]
    })
  ]}
}

export default QueryUI;
