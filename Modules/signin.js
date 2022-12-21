
const user = require("../Modals/user");

function createNewAccount(req, res) {
  const {uuid,name,email,profile} = req.user.data
  const username = generateFromEmail(email, 4);
  const userData = new user({
    uuid,
    username,
    name,
    email,
    profile,
    websites: null,
  });
  userData
    .save()
    .then(() => {
      return res.status(200).json({
        message: "User account created successfully",
        // data: userData,
        token:req.user.token,
        profile,
        newuser:true,
        status:200
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        message: "Something went wrong",
        error: err,
        status:500
      });
    });
}

function signin(req, res) {
  const {data,token,profile} = req.user
  user
    .findOne({
      uuid: data.uuid,
    })
    .then((data) => {
      if (!data) {
        return createNewAccount(req, res);
      } else {
        return res.status(200).json({
          message: "User Detail",
          data: {username:data.username},
          profile,
          token:token,
          status:200
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        message: "Something went wrong",
        error: err,
        status:500
      });
    });
}




module.exports = { createNewAccount, signin };
