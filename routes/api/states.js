const express = require('express');
const router = express.Router();
const stateController = require('../../controller/statesController');

//basic route
router.route('/')
    .get(stateController.getStates);

//gets the stateid
router.route('/:stateId')
    .get(stateController.getState);

//gets the fun fact for the state
router.route('/:stateId/funfact')
    .get(stateController.getFunFact)
    .post(stateController.createFunFact)
    .patch(stateController.updateFunFact)
    .delete(stateController.deleteFunFact);

//gets the capital
router.route('/:stateId/capital')
    .get(stateController.getCapital);

//gets the nickname
router.route('/:stateId/nickname')
    .get(stateController.getNickname);

//gets the population
router.route('/:stateId/population')
    .get(stateController.getPopulation);

//gets the admission requirements
router.route('/:stateId/admission')
    .get(stateController.getAdmission);

module.exports = router;

