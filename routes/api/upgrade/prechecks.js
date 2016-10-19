var express = require('express'),
    router = express.Router();

var errors = ['001', '002', '003'],
    checksPass = false;

/* GET users listing. */
router.get('/', function(req, res) {
    if('fail' in req.query && JSON.parse(req.query.fail) === true) {
        res.status(500).json({'errors': errors});
    } else {
        // fail some checks first, then succeed on second call
        res.status(200).json({
            'maintenance_updates_installed': { required: true, passed: true },
            'network_checks': { required: true, passed: checksPass },
            'clusters_healthy': { required: true, passed: true },
            'ceph_healthy': { required: true, passed: checksPass },
            'compute_resources_available': { required: false, passed: true }
        });
    }
    checksPass = true;
});

module.exports = router;
