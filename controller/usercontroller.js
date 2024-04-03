const collection =require('../models/mongodb')



const signup = (req,res) =>{
    if(req.session.user){
        res.redirect("/home")
    }
    else{
         res.render("user/signup",{status:false})
    }
   
}

const signuppost =async (req,res) =>{
    console.log(req.body,"here int he sign out");
    
    const data ={
        name : req.body.name,
        email : req.body.email,
        password :req.body.password
    }

    const existinUser = await collection.findOne({email:data.email})
    console.log(existinUser)
    if(existinUser){
        res.render("user/signup",{status:true,mes:"user all ready exists"})
    }
    else{
        await collection.insertMany(data);
        res.redirect('/login')
    }
    
}

const login =(req,res)=>{
    if(req.session.user){
        res.redirect("/home")
    }
    else{
        res.render("user/login")
    }
}

const loginpost = async(req,res)=>{
    try{
        const check =await collection.findOne({email:req.body.email})

        if(check.password === req.body.password){
            req.session.user = req.body.email;
            // res.redirect("/home")
            res.status(200).json({mes:"success"})
        }
        else{
            res.status(404).json({mes:"Wrong password"})
        }
    }
    catch(error){ 
        res.status(404).json({mes:"wrong details.."})
    }
}

const home =async (req,res)=>{
     try {
        // console.log("here in the ")
        const user = await collection.findOne({email:req.session.user})
        if(user){
            res.render("user/home", {user:req.session.user})
        }else if(req.session.user){
            req.session.user = false;
            res.render("user/login");
        }
        else{
        res.render("user/login")
        } 
     } catch (error) {
        console.log("error in the home",error.message)
     }
    // if(req.session.user){
    //     res.render("user/home", {user:req.session.user})
    // }
    // else{
    //     res.render("user/login")
    // }
}

const logout =(req,res)=>{
    console.log(req.session.user);
//     req.session.destroy((err)=>{
//         if(err){
//             console.error('Error destroying session:',err);
    
//         }
//         res.render("user/login")
//     })
// }
 req.session.user = false;

 res.render("user/login");
}
module.exports ={
    signup,login,home,signuppost,loginpost,logout
}
