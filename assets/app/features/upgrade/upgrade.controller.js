(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name crowbarApp.controller:UpgradeController
     * @description
     * # UpgradeController
     * This is the controller that will be used across the upgrade process.
     */
    angular.module('crowbarApp.upgrade')
        .controller('UpgradeController', UpgradeController);

    UpgradeController.$inject = ['$scope', '$translate', '$state', 'upgradeStepsFactory', 'upgradeFactory'];
    // @ngInject
    function UpgradeController($scope, $translate, $state, upgradeStepsFactory, upgradeFactory) {
        var vm = this;
        vm.steps = {
            list: [],
            nextStep: nextStep,
            isLastStep: isLastStep,
            isCurrentStepCompleted: upgradeStepsFactory.isCurrentStepCompleted
        };

        vm.cancelUpgrade = cancelUpgrade;

        // Get Steps list from provider
        vm.steps.list = upgradeStepsFactory.steps;
        upgradeStepsFactory.refeshStepsList();

        // Watch for view changes on the Step in order to update the steps list.
        $scope.$on('$viewContentLoaded', upgradeStepsFactory.refeshStepsList);

        /**
         * Move to the next available Step
         */
        function nextStep() {
            // Only move forward if active step isn't last step available
            if (vm.steps.isLastStep()) {
                return;
            }

            $state.go(vm.steps.list[upgradeStepsFactory.activeStep.id + 1].state);
        }

        /**
         * Validate if the active step is the last avilable step
         * @return boolean
         */
        function isLastStep() {
            return vm.steps.list[vm.steps.list.length - 1] === upgradeStepsFactory.activeStep;
        }

        /**
         * Trigger cancellation of the upgrade process and go back to landing page
         */
        function cancelUpgrade() {
            upgradeFactory.cancelUpgrade().then(function(/* response */) {
                // TODO(skazi): in final solution this should redirect to crowbar dashboard
                $state.go('upgrade-landing');
            });
        }
    }
})();
