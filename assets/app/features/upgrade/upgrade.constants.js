(function() {

    angular
        .module('crowbarApp.upgrade')
        .constant('PRODUCTS_REPO_CHECKS_MAP', {
            'os': ['SLES12-SP2-Pool', 'SLES12-SP2-Updates'],
            'ha': ['SLE12-SP2-HA-Pool', 'SLE12-SP2-HA-Updates'],
            'openstack': ['SUSE-OpenStack-Cloud-7-Pool', 'SUSE-OpenStack-Cloud-7-Updates'],
            'ceph': ['SUSE-Enterprise-Storage-4-Pool', 'SUSE-Enterprise-Storage-4-Updates']
        })
        .constant('ADDONS_PRECHECK_MAP', {
            'ha': ['clusters_healthy'],
            'ceph': ['ceph_healthy']
        })
        .constant('ADMIN_UPGRADE_TIMEOUT_INTERVAL', 1000);
})();
