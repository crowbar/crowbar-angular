/*global bard $controller $httpBackend should assert openstackFactory $q $rootScope */
describe('openStack Services Controller', function() {
    var controller,
        passingOpenStackServices = {
            status: 200
        },
        failingOpenStackServices = {
            status: 500
        },
        passingOpenStackBackup = {
            status: 200
        },
        failingOpenStackBackup = {
            status: 500
        };

    beforeEach(function() {
        //Setup the module and dependencies to be used.
        bard.appModule('crowbarApp.upgrade');
        bard.inject('$controller', '$rootScope', 'openstackFactory', '$q', '$httpBackend');

        //Create the controller
        controller = $controller('UpgradeOpenStackServicesController');

        //Mock requests that are expected to be made
        $httpBackend.expectGET('app/features/upgrade/i18n/en.json').respond({});
        $httpBackend.flush();

    });

    // Verify no unexpected http call has been made
    bard.verifyNoOutstandingHttpRequests();

    it('should exist', function() {
        should.exist(controller);
    });

    describe('openStackServices Model', function () {
        it('should be defined', function () {
            should.exist(controller.openStackServices);
        });

        it('is not completed by default', function() {
            assert.isFalse(controller.openStackServices.completed);
        });

        it('is not valid by default', function() {
            assert.isFalse(controller.openStackServices.valid);
        });

        it('is not running by default', function() {
            assert.isFalse(controller.openStackServices.running);
        });

        describe('contains a collection of checks that', function () {

            it('should be defined', function () {
                should.exist(controller.openStackServices.checks);
            });

            it('should all be set to false', function () {
                assert.isObject(controller.openStackServices.checks);
                _.forEach(controller.openStackServices.checks, function(value) {
                    assert.isFalse(value.status);
                });
            });

            it('all should have a label set', function () {
                assert.isObject(controller.openStackServices.checks);
                _.forEach(controller.openStackServices.checks, function(key, value) {
                    expect(key.label).toEqual('upgrade.steps.openstack-services.codes.' + value);
                });
            });
        });

        describe('stopServices function', function () {
            it('should be defined', function () {
                should.exist(controller.openStackServices.stopServices);
            });

            describe('when services check and backup check pass successfully', function () {
                beforeEach(function () {
                    bard.mockService(openstackFactory, {
                        stopServices: $q.when(passingOpenStackServices),
                        createBackup: $q.when(passingOpenStackBackup)
                    });
                    controller.openStackServices.stopServices();
                    $rootScope.$digest();
                });

                it('should set openStackServices.completed status to true', function () {
                    assert.isTrue(controller.openStackServices.completed);
                });

                it('should update valid attribute of checks model to true', function () {
                    assert.isTrue(controller.openStackServices.valid);
                });

                it('should set running to false', function () {
                    assert.isFalse(controller.openStackServices.running);
                });

                it('should call stopOpenstack service', function () {
                    assert.isTrue(openstackFactory.stopServices.calledOnce);
                });

                it('should update services check value to true', function () {
                    assert.isTrue(controller.openStackServices.checks.services.status);
                });

                it('should call backup service', function () {
                    assert.isTrue(openstackFactory.createBackup.calledOnce);
                });

                it('should update backup check value to true', function () {
                    assert.isTrue(controller.openStackServices.checks.backup.status);
                });

            });

            describe('when services check pass successfully and backup service call fails', function () {
                beforeEach(function () {
                    bard.mockService(openstackFactory, {
                        stopServices: $q.when(passingOpenStackServices),
                        createBackup: $q.reject(failingOpenStackBackup)
                    });
                    controller.openStackServices.stopServices();
                    $rootScope.$digest();
                });

                it('should set openStackServices.completed status to true', function () {
                    assert.isTrue(controller.openStackServices.completed);
                });

                it('should update valid attribute of checks model to false', function () {
                    assert.isFalse(controller.openStackServices.valid);
                });

                it('should set running to false', function () {
                    assert.isFalse(controller.openStackServices.running);
                });

                it('should call stopOpenstack service', function () {
                    assert.isTrue(openstackFactory.stopServices.calledOnce);
                });

                it('should update services check value to true', function () {
                    assert.isTrue(controller.openStackServices.checks.services.status);
                });

                it('should call backup service', function () {
                    assert.isTrue(openstackFactory.createBackup.calledOnce);
                });

            });

            describe('when services check fails', function () {
                beforeEach(function () {
                    spyOn(openstackFactory, 'createBackup');

                    bard.mockService(openstackFactory, {
                        stopServices: $q.reject(failingOpenStackServices)
                    });
                    controller.openStackServices.stopServices();
                    $rootScope.$digest();

                });

                it('should set openStackServices.completed status to true', function () {
                    assert.isTrue(controller.openStackServices.completed);
                });

                it('should update valid attribute of checks model to false', function () {
                    assert.isFalse(controller.openStackServices.valid);
                });

                it('should set running to false', function () {
                    assert.isFalse(controller.openStackServices.running);
                });

                it('should call stopOpenstack service', function () {
                    assert.isTrue(openstackFactory.stopServices.calledOnce);
                });

                it('should update services checks values to false', function () {
                    assert.isFalse(controller.openStackServices.checks.services.status);
                });

                it('should not call backup service', function () {
                    expect(openstackFactory.createBackup).not.toHaveBeenCalled();
                });

            });
        });

    });
});
