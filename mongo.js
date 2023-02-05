const mongoose=require ("mongoose")
mongoose.connect ("mongodb://localhost:27017/rodio")
.then (()=>{
console.log ("mongodb connected");
})
.catch(()=>{
console.log ('failed');
})
const newSchema = new mongoose.Schema({ 
    email:{
    type:String, 
    required: true,
    unique: true
    }, password:{
    type:String, 
    reauired: true
    }
})
const collection = mongoose.model("collection" , newSchema)
module.exports   = collection