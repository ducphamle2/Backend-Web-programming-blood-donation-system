const db = require("../../database/index");
const generateId = require("../../utils/utils").generateId;
const constants = require("../../utils/constants");
const {validationResult} = require("express-validator/check");

module.exports = {
    getBloodForm: (req, res) => {
        //CHECK ERROR INPUT
        let errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({errors: errors.array()});

        //CHECK USER DATA
        console.log(
            "bloodFormController | getBloodForm | req user data: ",
            req.userData
        );
        if (req.userData.role !== constants.role.donor)
            return res
                .status(403)
                .json({
                    error: "Forbidden !! You are not allowed to call this function",
                });

        //EVERYTHING IS OK
        db.query(
            "select event.name, blood.event_id, donate_date, donor_id, blood_id, location, event_date, blood.status from blood inner join event on (blood.event_id = event.event_id) where donor_id = ?",
            [req.userData.id],
            function (err, result) {
                //CHECK SQL ERROR
                if (err) return res.status(500).json({error: err});

                //RETURN DATA
                return res.status(200).json({message: "success", data: result});
            }
        );
    },
    postBloodForm: (req, res) => {
        //CHECK ERROR INPUT
        let errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({errors: errors.array()});

        //CHECK USER DATA
        console.log(
            "bloodFormController | postBloodForm | req user data: ",
            req.userData
        );
        if (req.userData.role !== constants.role.donor)
            return res
                .status(403)
                .json({
                    error: "Forbidden !! You are not allowed to call this function",
                });

        //CHECK IF EVENT EXISTS
        db.query(
            "select * from event where event_id = ?",
            [[req.body.event_id]],
            function (err, result) {
                console.log(
                    "bloodFormController | postBloodForm | result query event: " +
                    JSON.stringify(result)
                );
                //CHECK SQL ERROR
                if (err) return res.status(500).json({error: err});
                if (result.length === 0)
                    return res.status(423).json({error: "event does not exists"});

                //SAVE EVENT_ID
                req.event_id = result[0].event_id;
                req.name = result[0].name;
                req.event_date = result[0].event_date;
                req.location = result[0].location;

                //CHECK IF ALREADY INSERTED REQUEST
                db.query(
                    "select event_id from blood where event_id = ? && donor_id = ?",
                    [[req.body.event_id], [req.userData.id]],
                    function (err, result) {
                        //CHECK SQL ERROR
                        if (err) return res.status(500).json({error: err});
                        if (result.length !== 0)
                            return res
                                .status(424)
                                .json({error: "request for this event already exist"});

                        //EVERYTHING IS OK, START INSERT DATA: CREATE DATA TO INSERT
                        let blood_id = generateId();
                        let event_id = req.event_id;
                        let donor_id = req.userData.id;
                        let donate_date = Date.now() / 1000;
                        let amount = constants.standard_blood_donation_amount;
                        let status = constants.pending;
                        let values = [
                            blood_id,
                            event_id,
                            donor_id,
                            null,   // ORDER ID NULL
                            null,   // RED_CROSS ID NULL
                            donate_date,
                            amount,
                            status
                        ];

                        //RUN SQL TO STORE BLOOD DONATION FORM INTO THE DATABASE
                        db.query(
                            "insert into blood(blood_id,event_id,donor_id,order_id,red_cross_id,donate_date,amount,status) values ?",
                            [[values]],
                            function (err, result) {
                                //CHECK SQL ERROR
                                if (err) return res.status(500).json({error: err});
                                return res.status(200).json({
                                    message: "success",
                                    event_id: event_id,
                                    blood_id: blood_id,
                                });
                            }
                        );
                    }
                );
            }
        );
    },
};
