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

    UpgradeController.$inject = ['$scope', '$translate', '$state', 'upgradeStepsFactory'];
    // @ngInject
    function UpgradeController($scope, $translate, $state, upgradeStepsFactory) {
        var vm = this;
        vm.steps = {
            list: [],
            nextStep: nextStep,
            isLastStep: isLastStep,
            stepFinished: upgradeStepsFactory.stepFinished
        };

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
    }
})();
