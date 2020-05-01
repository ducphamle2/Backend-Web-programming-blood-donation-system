const db = require("../../database/index");
const generateId = require("../../utils/utils").generateId;
const constants = require("../../utils/constants");
const {validationResult} = require("express-validator/check");

module.exports = {
    getBloodForm: (req, res) => {
        //CHECK ERROR INPUT
        let errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({errors: errors.array()});

        //CHECK USER DATA
        console.log("bloodFormController | getBloodForm | req user data: ", req.userData);
        if (req.userData.role !== constants.role.donor) return res.status(403).json({ error: "Forbidden !! You are not allowed to call this function" });

        //EVERYTHING IS OK
        db.query("select * from blood where donor_id = ?",[req.userData.id], function (err, result) {
            //CHECK SQL ERROR
            if (err) return res.status(500).json({error: err})

            //RETURN DATA
            return res.status(200).json({message: "success", data: result})
        })

    },
    postBloodForm: (req, res) => {
        //CHECK ERROR INPUT
        let errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({errors: errors.array()});

        //CHECK USER DATA
        console.log("bloodFormController | postBloodForm | req user data: ", req.userData);
        if (req.userData.role !== constants.role.donor) return res.status(403).json({ error: "Forbidden !! You are not allowed to call this function" });

        //CHECK IF EVENT EXISTS
        db.query("select event_id from event where event_id = ?",[[req.body.event_id]], function (err, result) {
            console.log("bloodFormController | postBloodForm | result query event: " + JSON.stringify(result));
            //CHECK SQL ERROR
            if (err) return res.status(500).json({error: "there is something wrong with the database"});
            if (result.length === 0) return res.status(422).json({error: "event does not exists"});

            //SAVE EVENT_ID
            req.event_id = result[0].event_id;

            //EVERYTHING IS OK, START INSERT DATA: CREATE DATA TO INSERT
            let blood_id = generateId();
            let event_id = req.event_id;
            let donor_id = req.userData.id;
            let donate_date = Date.now();
            let amount = constants.standard_blood_donation_amount;
            let status = constants.pending;
            let values = [ blood_id, event_id, donor_id, donate_date, amount, status ];

            //RUN SQL TO STORE BLOOD DONATION FORM INTO THE DATABASE
            db.query("insert into blood values ?",[[values]], function (err, result) {
                //CHECK SQL ERROR
                if (err) return res.status(422).json({error: err});
                return res.status(200).json({message: "success"});
            })
        });


    }
};