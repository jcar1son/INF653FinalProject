const data = {};
data.states = require('../model/statesData.json');
const statesFunFacts = require('../model/statesFunFacts');


const getStateObj = (paramInfo) => {
    return data.states.find(sta => sta.code === paramInfo.toUpperCase());
}

const fixNum = (population) => { return population.toLocaleString('US-en'); }


//gets the state parameter
const getStates = async (req, res) => {
    let combinedData;
    try {

        const dataFacts = await statesFunFacts.find().exec();
        combinedData = data.states.map((state) => {
            const info = dataFacts.filter((fact) => fact.stateCode === state.code);

            if (info[0] && info[0].funfacts.length > 0) {

                state.funfacts = info[0].funfacts;

            }

            return state;

        });
    } 
    
    catch (err) {

        console.log(err);

    }


    if (req.query.contig === 'false') {

        return res.json(combinedData.filter((state) => state.code === "AK" || state.code === "HI"));

    }
    else if (req.query.contig === 'true') {

        return res.json(combinedData.filter((state) => state.code != "AK" && state.code != "HI"));

    }

    else {

        return res.json(combinedData);

    }
}


//gets the required state
const getState = async (req, res) => {

    const stateInfo = getStateObj(req.params.stateId);
    if (!stateInfo) {

        return res.status(400).json({ "message": `Invalid state abbreviation parameter, ex /KS` });

    }
    const dataFacts = await statesFunFacts.findOne({ stateCode: req.params.stateId }).exec();

    if (dataFacts && dataFacts.funfacts.length > 0) stateInfo.funfacts = dataFacts.funfacts;

    return res.json(stateInfo);
}

//gets a fun fact
const getFunFact = async (req, res) => {

    const stateInfo = getStateObj(req.params.stateId);

    if (stateInfo) {

        const dataFacts = await statesFunFacts.findOne({ stateCode: stateInfo.code }).exec();

        if (dataFacts && dataFacts.funfacts.length > 0) {

            const factNum = Math.floor(Math.random() * dataFacts.funfacts.length);

            return res.json({ "funfact": dataFacts.funfacts[factNum] });

        }
        else {

            return res.json({ "message": `There are no Fun Facts found for ${stateInfo.state}` });

        }
    } 
    
    else {
        
        return res.status(400).json({ "message": `Invalid state abbreviation parameter` });

    }
}


//creates a funfact
const createFunFact = async (req, res) => {

    if (!req.body.funfacts) {

        return res.status(400).json({ "message": `State fun facts value required as funfacts:[]` });

    } else {

        if (Array.isArray(req.body.funfacts)) {

            const stateInfo = getStateObj(req.params.stateId);

            if (stateInfo) {

                const dataFacts = await statesFunFacts.findOne({ stateCode: stateInfo.code }).exec();

                if (!dataFacts) {

                    try {

                        const result = await statesFunFacts.create({ stateCode: stateInfo.code, funfacts: req.body.funfacts });
                        return res.status(201).json(result);

                    } 
                    
                    catch (err) {

                        console.log(err);

                    }
                } 
                
                else {

                    try {
                        dataFacts.funfacts.push(...req.body.funfacts);
                        const results = await dataFacts.save();
                        return res.status(201).json(results);

                    } 
                    
                    catch (err) {

                        console.log(err);
                    }
                }
            } 
            
            else {

                return res.status(400).json({ "message": `Invalid state abbreviation parameter` });
            }
        }
        else {

            return res.status(400).json({ "message": `State fun facts value must be an array as funfacts: []` });

        }
    }
}


//updates a funfact
const updateFunFact = async (req, res) => {

    if (!req.body.index) {

        return res.status(400).json({ "message": `State fun fact index value required ex index: 1` });

    } 
    
    else {

        if (!req.body.funfact) {

            return res.status(400).json({ "message": `State fun fact value required as funfact:""` });

        } 
        else {

            const stateInfo = getStateObj(req.params.stateId);

            if (stateInfo) {

                const dataFacts = await statesFunFacts.findOne({ stateCode: stateInfo.code }).exec();

                if (dataFacts) {

                    if (req.body.index > 0 && req.body.index <= dataFacts.funfacts.length) {

                        try {

                            dataFacts.funfacts[req.body.index - 1] = req.body.funfact;
                            const results = await dataFacts.save();
                            return res.json(results);

                        } 
                        
                        catch (err) {

                            console.log(err);

                        }

                    } 
                    
                    else {

                        return res.status(400).json({ "message": `There are no Fun Fact found at that index for ${stateInfo.state}` });

                    }
                } 
                
                else {

                    return res.status(400).json({ "message": `There are no Fun Facts found for ${stateInfo.state}` });

                }

            } 
            
            else {

                return res.status(400).json({ "message": `Invalid state abbreviation parameter` });

            }
        }
    }
}

//deletes a funfact
const deleteFunFact = async (req, res) => {

    if (!req.body.index) {

        return res.status(400).json({ "message": `State fun fact index value required ex index: 1` });

    } 
    
    else {

        const stateInfo = getStateObj(req.params.stateId);

        if (stateInfo) {

            const dataFacts = await statesFunFacts.findOne({ stateCode: stateInfo.code }).exec();

            if (dataFacts) {

                if (req.body.index > 0 && req.body.index <= dataFacts.funfacts.length) {

                    try {

                        dataFacts.funfacts.splice(req.body.index - 1, 1);
                        const results = await dataFacts.save();
                        return res.json(results);

                    } 
                    
                    catch (err) {

                        console.log(err);

                    }

                } 
                
                else {

                    return res.status(400).json({ "message": `There are no Fun Fact found at that index for ${stateInfo.state}` });

                }
            } 
            
            else {

                return res.status(400).json({ "message": `There are no Fun Facts found for ${stateInfo.state}` });

            }
        } 
        
        else {

            return res.status(400).json({ "message": `Invalid state abbreviation parameter` });

        }
    }
}

//gets the capital
const getCapital = (req, res) => {

    const stateInfo = getStateObj(req.params.stateId);

    if (!stateInfo) {

        return res.status(400).json({ "message": `Invalid state abbreviation parameter` });
    }

    return res.json({ "state": stateInfo.state, "capital": stateInfo.capital_city });
}

//gets the nickname
const getNickname = (req, res) => {

    const stateInfo = getStateObj(req.params.stateId);

    if (!stateInfo) {

        return res.status(400).json({ "message": `Invalid state abbreviation parameter` });

    }
    
    return res.json({ "state": stateInfo.state, "nickname": stateInfo.nickname });

}

const getPopulation = (req, res) => {

    const stateInfo = getStateObj(req.params.stateId);

    if (!stateInfo) {

        return res.status(400).json({ "message": `Invalid state abbreviation parameter`});

    }

    return res.json({ "state": stateInfo.state, "population": fixNum(stateInfo.population) });

}

const getAdmission = (req, res) => {

    const stateInfo = getStateObj(req.params.stateId);

    if (!stateInfo) {

        return res.status(400).json({ "message": `Invalid state abbreviation parameter` });

    }

    return res.json({ "state": stateInfo.state, "admitted": stateInfo.admission_date });

}

module.exports = {
    getStates,
    getState,
    getFunFact,
    createFunFact,
    updateFunFact,
    deleteFunFact,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission
}