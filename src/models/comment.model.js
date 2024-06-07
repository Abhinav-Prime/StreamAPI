import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const commentSchema=new Schema({
   content:{
    type:String,
    required:true,
   },video:{
    type:Schema.Types.ObjectId,
    ref:"Video"
   },
   owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
   }

},
    {timestamps:true});


    commentSchema.plugin(mongooseAggregatePaginate)//it provides ability to take from where to where ;that is amount of data to be sent

    export const Comment=mongoose.model("Comment",commentSchema)