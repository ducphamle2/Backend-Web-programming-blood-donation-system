const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator/check");

const db = require("../../database/index");
const constants = require("../../utils/constants");
const utils = require("../../utils/utils");

const generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

module.exports = {
    login: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array() });
        } else {
            if (!utils.checkRole(req.body.role)) {
                return res.status(400).json({ error: "Wrong role when login" });
            }
            let email = req.body.email;
            let role = req.body.role;
            // role is used to select from correct table. Client will send the role
            let sql = "SELECT * from ?? where email = ?";
            db.query(sql, [role, email], async function (err, user) {
                if (err) {
                    return res.status(500).json({
                        error: "Error querying" + err,
                    });
                } else if (user.length === 0) {
                    return res.status(404).json({
                        error: "Cannot find the correct user",
                    });
                } else {
                    let result = await bcrypt.compare(
                        req.body.password,
                        user[0].password
                    );
                    if (!result || result.length === 0) {
                        res.status(422).json({
                            error: "Auth failed!",
                        });
                    } else {
                        // generate a token for the account to use in other api
                        jwt.sign(
                            {
                                email: user[0].email,
                                // check id type based on role to sign the correct one
                                id:
                                    role === constants.role.donor
                                        ? user[0].donor_id
                                        : role === constants.role.red_cross
                                            ? user[0].red_cross_id
                                            : role === constants.role.organizer
                                                ? user[0].organizer_id
                                                : user[0].hospital_id,
                                role: role,
                                name: user[0].name,
                            },
                            process.env.SECRET_KEY,
                            { algorithm: "HS512" },
                            (err, token) => {
                                if (err) {
                                    return res.status(422).json({
                                        error: "Auth failed",
                                    });
                                } else {
                                    let returnedUser = utils.checkUserId(role, user[0]);
                                    return res.status(200).json({
                                        message: "Logged in successfully",
                                        token,
                                        returnedUser,
                                    });
                                }
                            }
                        );
                    }
                }
            });
        }
    },

    register: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array() });
        } else {
            // if it's not among four roles then return error
            if (!utils.checkRole(req.body.role)) {
                return res.status(400).json({ error: "Wrong role when registering" });
            }
            // hash the password for protection in case db is exposed
            let password = generateHash(req.body.password);
            let sql = "select email from ?? where email = ?";
            // check if name has been used or not, since this will be used to query in other api
            db.query(sql, [req.body.role, req.body.email], function (
                err,
                result
            ) {
                // if the name has been used then we return error
                console.log("result: ", result);
                if (err) {
                    return res.status(500).json({
                        error: "There is something wrong when querying: " + err,
                    });
                } else if (result.length > 0) {
                    return res.status(409).json({
                        error: "The email has already been used",
                    });
                } else {
                    let values = [
                        // insert into three values, id which is 32 characters, email and password
                        [utils.generateId(), req.body.email, password, req.body.name],
                    ];
                    // role id is used to distinguish from tables
                    let role_id = req.body.role + "_id";
                    let sql =
                        "insert into ?? (" + role_id + ", email, password, name) values ?";
                    db.query(sql, [req.body.role, values], function (err, user) {
                        if (err) {
                            return res.status(500).json({
                                error: "Error querying: " + err,
                            });
                        } else {
                            console.log("USER: ", user);
                            res.status(200).json({
                                message: "Registered successfully",
                            });
                        }
                    });
                }
            });
        }
    },

    getUser: (req, res) => {
        // VALIDATE TOKEN
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array() });
        } else {
            db.query(
                "select * from ?? where email = ?",
                [req.userData.role, req.userData.email],
                function (err, result) {
                    if (err) {
                        return res
                            .status(500)
                            .json({ error: "there is something wrong with the database" });
                    } else if (result.length === 0) {
                        return res.status(401).json({ error: "Cannot find correct user" });
                    } else {
                        let payload = utils.checkUserId(req.userData.role, result[0]);
                        result[0].role = req.userData.role;
                        return res.status(200).json({ message: "success", data: payload });
                    }
                }
            );
        }
    },

    updateUserProfile: (req, res) => {
        //CHECK ERROR INPUT
        let errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });

        //LOG USER DATA
        console.log(
            "authController | updateUserProfile | req user data: ",
            req.userData
        );

        // check if name has been used or not, since this will be used to query in other api
        let sql = "select name, email from ?? where name = ? or email = ?";
        db.query(sql, [req.userData.role, req.body.name, req.body.email], function (
            err,
            result
        ) {
            console.log("result: ", result);
            if (err) {
                return res.status(500).json({
                    error: err,
                });
            } else if (result !== undefined) {
                // IF THE USERNAME OR EMAIL HAS BEEN USED BY ANOTHER USER, RETURN ERROR
                if (result.length) {
                    for (let i = 0; i < result.length; i += 1) {
                        if (
                            result[i].email === req.userData.email &&
                            result[i].name === req.userData.name
                        )
                            continue;
                        else
                            return res.status(409).json({
                                error: "The name or email has already been used",
                            });
                    }
                }

                //EVERY THING IS OK, START UPDATE DATA ON THE DB
                switch (req.userData.role) {
                    case constants.role.donor:
                        //DEFINE DATA
                        let val = {
                            name: req.body.name,
                            email: req.body.email,
                        };

                        //ADDITIONAL ATTRIBUTE FOR DONATING BLOOD
                        let attributeArr = [
                            "tattoo_last_12_month",
                            "cholesterol",
                            "positive_test_HIV",
                            "infectious_disease",
                            "cancer"
                        ];
                        attributeArr.forEach((item) => { if (req.body[item] === 1 || req.body[item] === 0) val[item] = req.body[item] });

                        attributeArr = [
                            "height",
                            "weight",
                            "gender",
                            "address",
                            "dob"
                        ];
                        attributeArr.forEach((item) => { if (req.body[item] || req.body[item] === 0) val[item] = req.body[item] });

                        //UPDATE SQL
                        db.query(
                            "update donor set ? where email = ?",
                            [val, req.userData.email],
                            function (err, result) {
                                if (err) {
                                    return res.status(500).json({
                                        error: err,
                                    });
                                } else {
                                    return res.status(200).json({
                                        message: "Update successfully",
                                    });
                                }
                            }
                        );
                        break;
                    case constants.role.hospital:
                    case constants.role.organizer:
                    case constants.role.red_cross:
                    default:
                        //DEFINE DATA
                        let val2 = {
                            name: req.body.name,
                            email: req.body.email,
                        };

                        //UPDATE SQL
                        db.query(
                            "update ?? set ? where email = ?",
                            [req.userData.role, val2, req.userData.email],
                            function (err, result) {
                                if (err) {
                                    return res.status(500).json({
                                        error: err,
                                    });
                                } else {
                                    return res.status(200).json({
                                        message: "Update successfully",
                                    });
                                }
                            }
                        );
                        break;
                }
            } else {
                return res.status(500).json({
                    message: "SQL return undefined result",
                });
            }
        });
    },

    updatePassword: function (req, res) {
        //CHECK ERROR INPUT
        let errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

        //DATA SENT FROM CLIENT
        let password = req.body.password;
        let confirm_password = req.body.confirm_password;
        let new_password = req.body.new_password;

        //LOG USER DATA
        console.log("authController | updatePassword | req user data: ", req.userData);

        let sql = "select * from ?? where email = ?";
        db.query(sql, [req.userData.role, req.userData.email], async function (err, result) {
            console.log("authController | updatePassword | result: " + result);
            if (err) return res.status(500).json({
                "message": "SQL return undefined result",
                "error": err
            }); else {
                if (result[0]) {
                    //CHECK VALIDATION OF USER POST DATA
                    let resultPassword = await bcrypt.compare(password, result[0].password);
                    if (!resultPassword || resultPassword.length === 0) return res.status(401).json({ "password": "Wrong password" });
                    if (new_password !== confirm_password) return res.status(401).json({ "new_password": "Password does not match" });

                    //RUN SQL UPDATE
                    let val = { password: generateHash(new_password) };
                    db.query("update ?? set ? where email = ?", [req.userData.role, val, req.userData.email], function (err, result) {
                        if (err) return res.status(500).json({ error: err, });
                        else return res.status(200).json({ message: "Update successfully" });

                    });

                } else {
                    return res.status(426).json({ "error": "unexpected error" });
                }
            }
        });
    }
};
