(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name crowbarApp.upgrade.controller:UpgradeLandingController
     * @description
     * # UpgradeLandingController
     * This is the controller used on the Upgrade landing page
     */
    angular.module('crowbarApp.upgrade')
        .controller('UpgradeLandingController', UpgradeLandingController);

    UpgradeLandingController.$inject = [
        '$translate',
        '$state',
        'upgradeFactory',
        'upgradeStatusFactory',
        'crowbarFactory',
        'ADDONS_PRECHECK_MAP',
        'PREPARE_TIMEOUT_INTERVAL',
        'UPGRADE_STEPS',
        'UPGRADE_MODES'
    ];
    // @ngInject
    function UpgradeLandingController(
        $translate,
        $state,
        upgradeFactory,
        upgradeStatusFactory,
        crowbarFactory,
        ADDONS_PRECHECK_MAP,
        PREPARE_TIMEOUT_INTERVAL,
        UPGRADE_STEPS,
        UPGRADE_MODES
    ) {
        var vm = this,
            optionalPrechecks = {
                ceph_healthy: {
                    status: false,
                    label: 'upgrade.steps.landing.prechecks.codes.storage'
                },
                clusters_healthy: {
                    status: false,
                    label: 'upgrade.steps.landing.prechecks.codes.high_availability'
                }
            };

        vm.beginUpgrade = beginUpgrade;
        vm.continueNormal = continueNormal;

        vm.prechecks = {
            running: false,
            completed: false,
            valid: false,
            spinnerVisible: false,
            checks: {
                maintenance_updates_installed: {
                    status: false,
                    label: 'upgrade.steps.landing.prechecks.codes.updates_installed'
                },
                network_checks: {
                    status: false,
                    label: 'upgrade.steps.landing.prechecks.codes.network_sanity'
                },
                compute_resources_available: {
                    status: false,
                    label: 'upgrade.steps.landing.prechecks.codes.free_node_available'
                }
            },
            runPrechecks: runPrechecks
        };

        vm.mode = {
            active: false,
            type: false,
            valid: false
        };

        vm.prepare = {
            running: false,
            spinnerVisible: false
        };

        activate();

        /**
         * Check installed add-ons on page load.
         */
        function activate() {
            crowbarFactory.getEntity().then(function (response) {
                _.forEach(response.data.addons, function (addon) {
                    _.forEach(ADDONS_PRECHECK_MAP[addon], function (precheck) {
                        vm.prechecks.checks[precheck] = optionalPrechecks[precheck];
                    });
                });
            });
        }

        /**
         * Move to the next available Step
         */
        function beginUpgrade() {
            // Only move forward if all prechecks has been executed and passed.
            if (!vm.prechecks.completed || !vm.prechecks.valid) {
                return;
            }

            upgradeFactory.prepareNodes().then(
                function (/* response */) {
                    vm.prepare.running = true;
                    upgradeStatusFactory.waitForStepToEnd(
                        UPGRADE_STEPS.upgrade_prepare,
                        function (/*response*/) {
                            vm.prepare.running = false;
                            $state.go('upgrade.backup');
                        },
                        function (errorResponse) {
                            vm.prepare.running = false;
                            // Expose the error list to prechecks object
                            vm.prechecks.errors = errorResponse.data.errors;
                        },
                        PREPARE_TIMEOUT_INTERVAL
                    );
                },
                function (errorResponse) {
                    // Expose the error list to prechecks object
                    vm.prechecks.errors = errorResponse.data.errors;
                }
            );
        }

        /**
         * Pre validation checks
         */
        function runPrechecks() {
            // Clean other checks in case we re-run the prechecks
            vm.mode.valid = false;
            vm.mode.type = false;
            vm.mode.active = false;
            vm.prechecks.running = true;

            upgradeFactory
                .getPreliminaryChecks()
                .then(
                    //Success handler. Al precheck passed successfully:
                    function(response) {

                        _.forEach(response.data.checks, function(value, key) {
                            // skip unknown checks returned from backend
                            if (key in vm.prechecks.checks) {
                                vm.prechecks.checks[key].status = value.passed;
                            }
                        });

                        // Update prechecks validity
                        var checks = [];
                        _.forEach(vm.prechecks.checks, function (check) {
                            checks.push(check.status)
                        });

                        vm.prechecks.valid = checks.every(function (check) {
                            return check === true
                        });
                        // If all prechecks are ok, move to the next step
                        if (vm.prechecks.valid) {
                            // Store the upgrade best method
                            vm.mode.type = response.data.best_method;
                            updateMode()
                        }
                    },
                    //Failure handler:
                    function(errorResponse) {
                        // Expose the error list to prechecks object
                        vm.prechecks.errors = errorResponse.data.errors;
                    }
                ).finally(
                    function() {
                        // Either on sucess or failure, the prechecks has been completed.
                        vm.prechecks.completed = true;
                        vm.prechecks.running = false;
                    }
                );

        }
        /**
        * Sets the type of mode depending on the api response
        */
        function updateMode() {
            vm.mode.active = true;
            if (vm.mode.type === UPGRADE_MODES.nondisruptive) {
                vm.mode.valid = true;
            }
        }

        /**
        * Sets the mode to valid when the continue button is clicked
        */
        function continueNormal() {
            vm.mode.valid = true;
        }
    }
})();
