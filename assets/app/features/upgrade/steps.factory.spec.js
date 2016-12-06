/*global bard should assert expect upgradeStepsFactory module $state $q UPGRADE_LAST_STATE_KEY */
describe('Stepes Factory', function () {
    var mockedInitialSteps = [
        {
            id: 0,
            title: 'upgrade.steps-key.codes.backup',
            state: 'upgrade.backup',
            active: false,
            finished: false
        },
        {
            id: 1,
            title: 'upgrade.steps-key.codes.administration-repositories-checks',
            state: 'upgrade.administration-repository-checks',
            active: false,
            finished: false
        },
        {
            id: 2,
            title: 'upgrade.steps-key.codes.upgrade-administration-server',
            state: 'upgrade.upgrade-administration-server',
            active: false,
            finished: false
        },
        {
            id: 3,
            title: 'upgrade.steps-key.codes.database-configuration',
            state: 'upgrade.database-configuration',
            active: false,
            finished: false
        },
        {
            id: 4,
            title: 'upgrade.steps-key.codes.nodes-repositories-checks',
            state: 'upgrade.nodes-repositories-checks',
            active: false,
            finished: false
        },
        {
            id: 5,
            title: 'upgrade.steps-key.codes.openstack-services',
            state: 'upgrade.openstack-services',
            active: false,
            finished: false
        },
        {
            id: 6,
            title: 'upgrade.steps-key.codes.upgrade-nodes',
            state: 'upgrade.upgrade-nodes',
            active: false,
            finished: false
        }
        ],
        initialStatusData = {
            current_step: 'upgrade_prechecks',
            substep: null,
            current_node: null,
            steps: {
                upgrade_prechecks: {
                    status: 'pending',
                },
                upgrade_prepare: {
                    status: 'pending',
                },
                admin_backup: {
                    status: 'pending',
                },
                admin_repo_checks: {
                    status: 'pending',
                },
                admin_upgrade: {
                    status: 'pending',
                },
                database: {
                    status: 'pending',
                },
                nodes_repo_checks: {
                    status: 'pending',
                },
                nodes_services: {
                    status: 'pending',
                },
                nodes_db_dump: {
                    status: 'pending',
                },
                nodes_upgrade: {
                    status: 'pending',
                },
                finished: {
                    status: 'pending',
                }
            }
        },
        statusDataAfterPrechecks = {
            current_step: 'upgrade_prepare',
            substep: null,
            current_node: null,
            steps: {
                upgrade_prechecks: {
                    status: 'passed',
                },
                upgrade_prepare: {
                    status: 'pending',
                },
                admin_backup: {
                    status: 'pending',
                },
                admin_repo_checks: {
                    status: 'pending',
                },
                admin_upgrade: {
                    status: 'pending',
                },
                database: {
                    status: 'pending',
                },
                nodes_repo_checks: {
                    status: 'pending',
                },
                nodes_services: {
                    status: 'pending',
                },
                nodes_db_dump: {
                    status: 'pending',
                },
                nodes_upgrade: {
                    status: 'pending',
                },
                finished: {
                    status: 'pending',
                }
            }
        },
        statusDataDuringPrepare = {
            current_step: 'upgrade_prepare',
            substep: null,
            current_node: null,
            steps: {
                upgrade_prechecks: {
                    status: 'passed',
                },
                upgrade_prepare: {
                    status: 'running',
                },
                admin_backup: {
                    status: 'pending',
                },
                admin_repo_checks: {
                    status: 'pending',
                },
                admin_upgrade: {
                    status: 'pending',
                },
                database: {
                    status: 'pending',
                },
                nodes_repo_checks: {
                    status: 'pending',
                },
                nodes_services: {
                    status: 'pending',
                },
                nodes_db_dump: {
                    status: 'pending',
                },
                nodes_upgrade: {
                    status: 'pending',
                },
                finished: {
                    status: 'pending',
                }
            }
        },
        statusDataAfterPrepare = {
            current_step: 'admin_backup',
            substep: null,
            current_node: null,
            steps: {
                upgrade_prechecks: {
                    status: 'passed',
                },
                upgrade_prepare: {
                    status: 'passed',
                },
                admin_backup: {
                    status: 'pending',
                },
                admin_repo_checks: {
                    status: 'pending',
                },
                admin_upgrade: {
                    status: 'pending',
                },
                database: {
                    status: 'pending',
                },
                nodes_repo_checks: {
                    status: 'pending',
                },
                nodes_services: {
                    status: 'pending',
                },
                nodes_db_dump: {
                    status: 'pending',
                },
                nodes_upgrade: {
                    status: 'pending',
                },
                finished: {
                    status: 'pending',
                }
            }
        },
        statusDataDuringBackup = {
            current_step: 'admin_backup',
            substep: null,
            current_node: null,
            steps: {
                upgrade_prechecks: {
                    status: 'passed',
                },
                upgrade_prepare: {
                    status: 'passed',
                },
                admin_backup: {
                    status: 'running',
                },
                admin_repo_checks: {
                    status: 'pending',
                },
                admin_upgrade: {
                    status: 'pending',
                },
                database: {
                    status: 'pending',
                },
                nodes_repo_checks: {
                    status: 'pending',
                },
                nodes_services: {
                    status: 'pending',
                },
                nodes_db_dump: {
                    status: 'pending',
                },
                nodes_upgrade: {
                    status: 'pending',
                },
                finished: {
                    status: 'pending',
                }
            }
        },
        statusDataAfterBackup = {
            current_step: 'admin_repo_checks',
            substep: null,
            current_node: null,
            steps: {
                upgrade_prechecks: {
                    status: 'passed',
                },
                upgrade_prepare: {
                    status: 'passed',
                },
                admin_backup: {
                    status: 'passed',
                },
                admin_repo_checks: {
                    status: 'pending',
                },
                admin_upgrade: {
                    status: 'pending',
                },
                database: {
                    status: 'pending',
                },
                nodes_repo_checks: {
                    status: 'pending',
                },
                nodes_services: {
                    status: 'pending',
                },
                nodes_db_dump: {
                    status: 'pending',
                },
                nodes_upgrade: {
                    status: 'pending',
                },
                finished: {
                    status: 'pending',
                }
            }
        },
        statusDataAfterAdminRepoChecks = {
            current_step: 'admin_upgrade',
            substep: null,
            current_node: null,
            steps: {
                upgrade_prechecks: {
                    status: 'passed',
                },
                upgrade_prepare: {
                    status: 'passed',
                },
                admin_backup: {
                    status: 'passed',
                },
                admin_repo_checks: {
                    status: 'passed',
                },
                admin_upgrade: {
                    status: 'pending',
                },
                database: {
                    status: 'pending',
                },
                nodes_repo_checks: {
                    status: 'pending',
                },
                nodes_services: {
                    status: 'pending',
                },
                nodes_db_dump: {
                    status: 'pending',
                },
                nodes_upgrade: {
                    status: 'pending',
                },
                finished: {
                    status: 'pending',
                }
            },
        },
        statusDataAfterAdminUpgrade = {
            current_step: 'database',
            substep: null,
            current_node: null,
            steps: {
                upgrade_prechecks: {
                    status: 'passed',
                },
                upgrade_prepare: {
                    status: 'passed',
                },
                admin_backup: {
                    status: 'passed',
                },
                admin_repo_checks: {
                    status: 'passed',
                },
                admin_upgrade: {
                    status: 'passed',
                },
                database: {
                    status: 'pending',
                },
                nodes_repo_checks: {
                    status: 'pending',
                },
                nodes_services: {
                    status: 'pending',
                },
                nodes_db_dump: {
                    status: 'pending',
                },
                nodes_upgrade: {
                    status: 'pending',
                },
                finished: {
                    status: 'pending',
                }
            }
        },
        statusDataAfterDatabase = {
            current_step: 'nodes_repo_checks',
            substep: null,
            current_node: null,
            steps: {
                upgrade_prechecks: {
                    status: 'passed',
                },
                upgrade_prepare: {
                    status: 'passed',
                },
                admin_backup: {
                    status: 'passed',
                },
                admin_repo_checks: {
                    status: 'passed',
                },
                admin_upgrade: {
                    status: 'passed',
                },
                database: {
                    status: 'passed',
                },
                nodes_repo_checks: {
                    status: 'pending',
                },
                nodes_services: {
                    status: 'pending',
                },
                nodes_db_dump: {
                    status: 'pending',
                },
                nodes_upgrade: {
                    status: 'pending',
                },
                finished: {
                    status: 'pending',
                }
            }
        },
        statusDataAfterNodesRepoChecks = {
            current_step: 'nodes_services',
            substep: null,
            current_node: null,
            steps: {
                upgrade_prechecks: {
                    status: 'passed',
                },
                upgrade_prepare: {
                    status: 'passed',
                },
                admin_backup: {
                    status: 'passed',
                },
                admin_repo_checks: {
                    status: 'passed',
                },
                admin_upgrade: {
                    status: 'passed',
                },
                database: {
                    status: 'passed',
                },
                nodes_repo_checks: {
                    status: 'passed',
                },
                nodes_services: {
                    status: 'pending',
                },
                nodes_db_dump: {
                    status: 'pending',
                },
                nodes_upgrade: {
                    status: 'pending',
                },
                finished: {
                    status: 'pending',
                }
            }
        },
        statusDataAfterNodesServices = {
            current_step: 'nodes_db_dump',
            substep: null,
            current_node: null,
            steps: {
                upgrade_prechecks: {
                    status: 'passed',
                },
                upgrade_prepare: {
                    status: 'passed',
                },
                admin_backup: {
                    status: 'passed',
                },
                admin_repo_checks: {
                    status: 'passed',
                },
                admin_upgrade: {
                    status: 'passed',
                },
                database: {
                    status: 'passed',
                },
                nodes_repo_checks: {
                    status: 'passed',
                },
                nodes_services: {
                    status: 'passed',
                },
                nodes_db_dump: {
                    status: 'pending',
                },
                nodes_upgrade: {
                    status: 'pending',
                },
                finished: {
                    status: 'pending',
                }
            }
        },
        statusDataAfterNodesDBDump = {
            current_step: 'nodes_upgrade',
            substep: null,
            current_node: null,
            steps: {
                upgrade_prechecks: {
                    status: 'passed',
                },
                upgrade_prepare: {
                    status: 'passed',
                },
                admin_backup: {
                    status: 'passed',
                },
                admin_repo_checks: {
                    status: 'passed',
                },
                admin_upgrade: {
                    status: 'passed',
                },
                database: {
                    status: 'passed',
                },
                nodes_repo_checks: {
                    status: 'passed',
                },
                nodes_services: {
                    status: 'passed',
                },
                nodes_db_dump: {
                    status: 'passed',
                },
                nodes_upgrade: {
                    status: 'pending',
                },
                finished: {
                    status: 'pending',
                }
            }
        },
        statusDataAfterNodesUpgrade = {
            current_step: 'finished',
            substep: null,
            current_node: null,
            steps: {
                upgrade_prechecks: {
                    status: 'passed',
                },
                upgrade_prepare: {
                    status: 'passed',
                },
                admin_backup: {
                    status: 'passed',
                },
                admin_repo_checks: {
                    status: 'passed',
                },
                admin_upgrade: {
                    status: 'passed',
                },
                database: {
                    status: 'passed',
                },
                nodes_repo_checks: {
                    status: 'passed',
                },
                nodes_services: {
                    status: 'passed',
                },
                nodes_db_dump: {
                    status: 'passed',
                },
                nodes_upgrade: {
                    status: 'passed',
                },
                finished: {
                    status: 'pending',
                }
            }
        };

    beforeEach(function () {
        //Setup the module and dependencies to be used.
        module('crowbarApp.upgrade');
        bard.inject('upgradeStepsFactory', '$state', '$q', 'UPGRADE_LAST_STATE_KEY');

        //Mock the $state service
        bard.mockService($state, {
            go : $q.when()
        });
        spyOn($state, 'go');

        $state.current = {id: 0, name: 'upgrade.backup', state: 'upgrade.backup'};
        upgradeStepsFactory.activeStep = upgradeStepsFactory.steps[0];
    });

    describe('when executed', function () {
        it('returns an object', function () {
            should.exist(upgradeStepsFactory);
        });

        it('returns an object with steps array is defined', function () {
            assert.isArray(upgradeStepsFactory.steps);
        });

        it('returns an object with activeStep object is defined', function () {
            assert.isObject(upgradeStepsFactory.activeStep);
        });

        it('returns an object with refeshStepsList function is defined', function () {
            expect(upgradeStepsFactory.refeshStepsList).toEqual(jasmine.any(Function));
        });

        it('returns an object with stepByState function defined', function () {
            expect(upgradeStepsFactory.stepByState).toEqual(jasmine.any(Function));
        });

        it('returns an object with stepByID function defined', function () {
            expect(upgradeStepsFactory.stepByID).toEqual(jasmine.any(Function));
        });

        describe('steps array', function () {

            it('should contain the collection of Upgrade Steps', function () {
                expect(upgradeStepsFactory.steps).toEqual(mockedInitialSteps);
            });
        });

        describe('refeshStepsList function', function () {

            _.forEach(mockedInitialSteps, function (step, stepIndex) {
                it('should update the activeStep model with the current step: ' + step.state, function () {
                    // Given - Preconditions (set the current $state to "upgrade.backup".)
                    $state.current.name = step.state;

                    // When - Run the refeshStepsList() function
                    upgradeStepsFactory.refeshStepsList();

                    // Then - upgradeStepsFactory.activeStep is set to Backup
                    expect(upgradeStepsFactory.activeStep).toEqual(upgradeStepsFactory.steps[stepIndex]);
                });
            });

            _.forEach(mockedInitialSteps, function (mockedStep) {
                it('it should activate only the current step' + mockedStep.state + ' in the list', function () {
                    // Given - Preconditions
                    $state.current.name = mockedStep.state;

                    // When - Run the refeshStepsList() function
                    upgradeStepsFactory.refeshStepsList();

                    // Then - upgradeStepsFactory.steps is updated
                    _.forEach(upgradeStepsFactory.steps, function (step) {
                        if (step.state === mockedStep.state) {
                            assert.isTrue(step.active);
                        } else {
                            assert.isFalse(step.active);
                        }
                    });
                });
            });

        });

        describe('showNextStep function', function () {
            it('should exist', function () {
                should.exist(upgradeStepsFactory.showNextStep);
                expect(upgradeStepsFactory.showNextStep).toEqual(jasmine.any(Function));
            });

            it('when called it should move to the next step', function () {
                expect($state.current.id).toBe(0);
                // calculate the next step in the list
                var nextStep = (upgradeStepsFactory.steps[upgradeStepsFactory.activeStep.id + 1]).state;
                upgradeStepsFactory.showNextStep();
                expect($state.go).toHaveBeenCalledWith(nextStep);
            });

            it('when called in the last step it should not change steps', function () {
                // set the last step in the list as current
                $state.current = {id: 0, name: 'upgrade.upgrade-nodes', state: 'upgrade.upgrade-nodes'};
                // set last step as active
                upgradeStepsFactory.activeStep = upgradeStepsFactory.steps[upgradeStepsFactory.steps.length - 1];
                upgradeStepsFactory.showNextStep();
                // should have not called the state.go
                expect($state.go).not.toHaveBeenCalled();
            });
        });

        describe('isLastStep function', function () {
            it('should exist', function () {
                should.exist(upgradeStepsFactory.isLastStep);
                expect(upgradeStepsFactory.isLastStep).toEqual(jasmine.any(Function));
            });

            it('when called on the first step it should return false', function () {
                // set the first step in the list as current
                $state.current = {id: 0, name: 'upgrade.backup', state: 'upgrade.backup'};
                expect(upgradeStepsFactory.isLastStep()).toBe(false);
            });

            it('when called on the last step it should return true', function () {
                // set the last step in the list as current
                $state.current = {id: 0, name: 'upgrade.upgrade-nodes', state: 'upgrade.upgrade-nodes'};
                // set last step as active
                upgradeStepsFactory.activeStep = upgradeStepsFactory.steps[upgradeStepsFactory.steps.length - 1];
                expect(upgradeStepsFactory.isLastStep()).toBe(true);
            });
        });

        describe('stepByState function', function () {
            _.forEach(mockedInitialSteps, function (mockedStep) {
                it('should return step with state=' + mockedStep.state + ' when called', function () {
                    expect(upgradeStepsFactory.stepByState(mockedStep.state)).toEqual(mockedStep);
                });
            });

            it('should return undefined when called with nonexistent state', function () {
                expect(upgradeStepsFactory.stepByState('--dummy state--')).not.toBeDefined();
            });
        });

        describe('stepByID function', function () {
            _.forEach(mockedInitialSteps, function (mockedStep) {
                it('should return step with ID=' + mockedStep.id + ' when called', function () {
                    expect(upgradeStepsFactory.stepByID(mockedStep.id)).toEqual(mockedStep);
                });
            });

            it('should return undefined when called with nonexistent ID', function () {
                expect(upgradeStepsFactory.stepByID(-1)).not.toBeDefined();
                expect(upgradeStepsFactory.stepByID(9999)).not.toBeDefined();
            });
        });

        describe('lastStateForRestore function', function () {
            describe('when there is no stored last state', function () {
                beforeEach(function () {
                    localStorage.removeItem(UPGRADE_LAST_STATE_KEY);
                });
                it('should return "upgrade-landing" before any step', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(initialStatusData))
                        .toEqual('upgrade-landing');
                });
                it('should return "upgrade-landing" after prechecks', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(statusDataAfterPrechecks))
                        .toEqual('upgrade-landing');
                });
                it('should return "upgrade-landing" during prepare', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(statusDataDuringPrepare))
                        .toEqual('upgrade-landing');
                });
                it('should return "upgrade.backup" after prepare', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(statusDataAfterPrepare))
                        .toEqual('upgrade.backup');
                });
                it('should return "upgrade.backup" during backup', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(statusDataDuringBackup))
                        .toEqual('upgrade.backup');
                });
                it('should return "upgrade.backup" after backup', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(statusDataAfterBackup))
                        .toEqual('upgrade.backup');
                });
                it('should return "upgrade.administration-repository-checks" after admin repo checks', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(statusDataAfterAdminRepoChecks))
                        .toEqual('upgrade.administration-repository-checks');
                });

                it('should return "upgrade.upgrade-administration-server" after admin upgrade', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(statusDataAfterAdminUpgrade))
                        .toEqual('upgrade.upgrade-administration-server');
                });
                it('should return "upgrade.database-configuration" after database configuration', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(statusDataAfterDatabase))
                        .toEqual('upgrade.database-configuration');
                });
                it('should return "upgrade.nodes-repositories-checks" after nodes repo checks', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(statusDataAfterNodesRepoChecks))
                        .toEqual('upgrade.nodes-repositories-checks');
                });
                it('should return "upgrade.openstack-services" after stoping services', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(statusDataAfterNodesServices))
                        .toEqual('upgrade.openstack-services');
                });
                it('should return "upgrade.openstack-services" after nodes db dump', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(statusDataAfterNodesDBDump))
                        .toEqual('upgrade.openstack-services');
                });
                it('should return "upgrade.upgrade-nodes" after nodes upgrade', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(statusDataAfterNodesUpgrade))
                        .toEqual('upgrade.upgrade-nodes');
                });
            });
            describe('when stored state is invalid', function () {
                beforeEach(function () {
                    localStorage.setItem(UPGRADE_LAST_STATE_KEY, '--dummy--');
                });
                it('should return "upgrade.backup" after backup', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(statusDataAfterBackup))
                        .toEqual('upgrade.backup');
                });
            });
            describe('when stored state is invalid in current context', function () {
                beforeEach(function () {
                    localStorage.setItem(UPGRADE_LAST_STATE_KEY, 'upgrade-landing');
                });
                it('should return "upgrade.backup" after backup', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(statusDataAfterBackup))
                        .toEqual('upgrade.backup');
                });
            });
            describe('when stored state points to current, pending step', function () {
                beforeEach(function () {
                    localStorage.setItem(UPGRADE_LAST_STATE_KEY, 'upgrade.administration-repository-checks');
                });
                it('should return "upgrade.administration-repository-checks" after backup', function() {
                    expect(upgradeStepsFactory.lastStateForRestore(statusDataAfterBackup))
                        .toEqual('upgrade.administration-repository-checks');
                });
            });
        });

    });


});
