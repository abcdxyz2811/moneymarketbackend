const users = require("../Schema/Userschema")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
// const auth = require("../Middelwer/Middelwer")
const express = require("express")
const TOKEN_KEY = "tokenpassinusershowdataandshowmassage";
const route = express.Router()
const {OAuth2Client} = require('google-auth-library');


const client = new OAuth2Client("728916457886-1j3jf5e4rrsh0vktr6eudicca4tjm7pd.apps.googleusercontent.com", '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', 'http://localhost:3000/');

route.post('/signuser', async (req, res) => {
  try {
    let {username, email, password, cpassword,login_date} = req.body
    // console.log(req.body)
    const finduser = await users.findOne({ email });
    if (!finduser) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      cpassword = await bcrypt.hash(cpassword, salt);

      const d=new Date()
      login_date= d.toDateString();
      if (password == cpassword) {

        

        const adduser = await users.create({username, email, password, cpassword,login_date,img:"",logout_date:"",role:"users",online:true, token:"" });
        const usersave = await adduser.save();

        const token = jwt.sign(
            { email,id:usersave._id },
            TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );
          usersave.token=token

        const usertoken=await usersave.save();       
        if (usersave&&usertoken) {
          res.status(200).json({ massage: "successfull singup",token: adduser.token})
        }
      } else {
        res.status(401).json({ massage: "password not match" })
      }
    }
    else {
      res.status(400).json({ massage: "User alredy exits" })
    }
  }
  catch (err) {
    console.log(err)
  }
})


route.post("/googlelogin", async (req, res) => {
  try {

      const { token } = req.body
      console.log("token----------->", token)
      //  console.log("userObj----------->",userObj)
      console.log("client--------->", client)
      const ticket = await client.verifyIdToken({
        idtoken: token.id_token,
          audience: "728916457886-1j3jf5e4rrsh0vktr6eudicca4tjm7pd.apps.googleusercontent.com"
      });
      console.log("ticket-------->", ticket);
      // console.log("clieny id-------->", client._clientId);
      // const { name, email, picture } = ticket.getPayload();
    const payload=ticket.getPayload()
    console.log("payload",payload)
const adduser=await user.create({username,email,token})
      // const adduser = await users.create({username:name, email:email, password, cpassword,login_date,img:"",logout_date:"",role:"users",online:true, picture,token});

      // const { name, email, picture } = ticket.getPayload();
      // const user = await usersave.create({
      //     email, username: name, password: "", c_password: "", picture
      // })
      adduser.save()

      console.log("adduser-----------> ", adduser);
      // req.session.userId = user.id
      // res.status(201)
     return res.json()

  } catch (error) {
      console.log(error);
  }
})

route.post('/loginuser', async (req, res) => {
  let { email, password } = req.body
  const finduser = await users.findOne({ email });
  if (finduser) {
    const validPassword = await bcrypt.compare(password, finduser.password);
    const d=new Date()
   let login_date= d.toDateString();
    const token = jwt.sign(
      { email,id:finduser._id },
      TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    )

   finduser.token = token
   finduser.login_date=login_date
   finduser.online=true

  await finduser.save();
    // req.headers["x-access-token"]=finduser.token 
    if (validPassword) {
      res.status(200).json({ message: "successfull login" ,token:finduser.token}); 
    } else {
      res.status(401).json({ error: "Invalid Password and username" });
    }
  } else {
    res.status(400).json({ massage: "User not valid" })
  }
})

route.get("/welcome", (req, res) => {
const {token}=req.headers
  
 const decord= jwt.decode(token)
  res.json({massage:"welcome brother auth complete",decord:decord})
})

module.exports = route