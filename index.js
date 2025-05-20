
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const Chat = require("./models/chats.js");
app.set("views",path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended : true}));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ExpressError = require("./ExpressError.js");

    main()
    .then(()=>
    {
    console.log("connection successfully");
    })
    .catch(err => console.log(err));    

    async function main() {
      await mongoose.connect('mongodb://127.0.0.1:27017/FAKEwhatsapp');   
}


let chat1 = new Chat({
    from : "neha",
    to : "priya",
    msg : "send me your exam sheets",
    created_at : new Date(),
  });

chat1.save().then((res)=>
{
console.log(res);    
}).catch((err)=>
{
console.log(err);    
});
 // 2nd step//
 
app.get("/chats", async (req,res) =>
{
let chats = await Chat.find();

res.render("index.ejs" , {chats});
});

//new route//
app.get("/chats/new",(req,res)=> 
{
 throw new ExpressError(404 ,"Page not Found");
  res.render("new.ejs");
});

app.post("/chats", async(req,res, next) =>
{
  try {

  
let {from , to ,msg } = req.body;
let newChat = new Chat(
  {
  from : from,
  to : to,
  msg : msg,
  created_at : new Date(),
  }
);
 await newChat
.save();
res.redirect("/chats");
} catch(err)
{
next(err );
}

});

//delete route//

app.delete("/chats/:id", async (req,res)=>
{
  try{
    let {id} = req.params;
    let deletedchat = await Chat.findByIdAndDelete(id);
  
  res.redirect("/chats");
}
catch(err)
{
next(err)  
}
});

//update route//

app.put("/chats/:id", async (req,res)=>
{
try{


let {id} = req.params;

let {msg : newMsg} = req.body;
let updatedChat = await Chat.findByIdAndUpdate(id, 
     {msg: newMsg },
    { runValidators : true , new: true }
);
console.log(updatedChat);
}
catch(err)
{
next(err);  
}
res.redirect("/chats");
});

function asyncWrap(fn) {
return function(req,res,next)
{
fn(req,res,next).catch((err) => next(err));  
};  
}

app.get("/chats/:id",asyncWrap (async (req,res,next)=>
{
  let {id} = req.params;
let chat = await Chat.findById(id);
if(!chat)
{ 
next(new ExpressError(500,"page not Found"));  
}
res.render("edit.ejs", {chat});
}));

app.get("/chats/:id/edit", asyncWrap (async (req,res)=>
  {
    try{
      let {id} = req.params;
      let chat = await Chat.findById(id);
      console.log(chat);
      res.render("edit.ejs", {chat});
    }
    
    catch(err)
    {
next(err)
    }
  
  }));

  //1 step //
app.get("/",(req,res)=>
{
res.send("requesting server");    
});


app.use((err, req, res, next)=>
{
let {status = 500, message ="Some error occured"} = err;
res.status(status).send(message);
})

app.listen(port,()=>
{
console.log(`${port} is listening to port`);    
})