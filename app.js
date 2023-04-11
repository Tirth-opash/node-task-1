const express=require("express")
const app=express();
const mongoose=require("mongoose");
const ragistartion=require("./routes/route")


const db="mongodb+srv://tirthghelani0701:tirth123@cluster0.dn0enmq.mongodb.net/userdata?retryWrites=true&w=majority"
mongoose.connect(db).then(()=>{
    console.log("database connected");
})

app.use(express.json());
app.use("/",ragistartion)

app.listen(4500,()=>{
    console.log("server started at the port 4500");
});