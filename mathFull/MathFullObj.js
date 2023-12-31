const mongoose = require("mongoose");
const {MathFull} = require("./mathFull.js");
// const checkNewQ = require('./fns/checkNewQ.js');
// const getQReg = require("./fns/getQReg.js");
const getQuestionData = require("./fns/getQuestionData.js");
// const getQSpecial = require("./fns/getQSpecial.js");


class MathFullObj{
//updateEqs
static async GetSyllabus() {
  try {
 const questions = await MathFull.find({}).select({
      classNo: 1,
      chapter: 1,
      board: 1,
      isSpecial: 1,
      partNo: 1,
      questionType: 1,
      status: 1,
      free: 1,
      filename: 1,
      filledBy:1
    });

    return { ok: true,questions };
  } catch (error) {
    return { ok: false, message: "failed to get syllabus" };
  }
}
//updateEqs
static async updateData(question) {
  try {
    const { _id, eqs } = question;

    // Create an update object to set the eqs field
    const update = { $set: { eqs } };

    // Find the question by _id and update only the eqs field
    await MathFull.findByIdAndUpdate(_id, update);

    return { ok: true };
  } catch (error) {
    return { ok: false, message: "failed to update eqs field" };
  }
}

//update
static async Update(question){
try{
      const options = { new: false, upsert: false };
      const r = await MathFull.findByIdAndUpdate(question._id, question, options);
      // console.log(r);
      return { ok: true };

  }catch(error){
        // return res.status(400).json({ok: false , message:"failed to update question" });
        return {ok: false,error}

  }
}
//Get Question
static async Get(id){
  try {
// debugger;
    const question = await MathFull.findById( id ).lean();;
      if (question !== null   ){
        return { question, message: "success" ,ok:true};
      }else {
        return { message: "Not found" ,ok:false};
      }      
  } catch(error) {
    return {message : 'unknown error!',ok:false  };
  }

}
//A special question may or may not have exercise. if it has exercise then it is special to that exercise but if it does not then it is special to the chapter.
// static async CreateQSpecial(questionType,board,classNo,chapter,name, exercise=""){
//  try{
//  //  debugger;
//     const qReg = getQSpecial(questionType,board,classNo,chapter,name,exercise);
//     const questionData = checkNewQ(qReg);
//     const existingQuestion = await MathFull.findOne(
//       { filename: questionData. question.filename });
//   if (existingQuestion) {
//       return { message: 'Duplicate filename', ok: false, errorCode: 'DUPLICATE_FILENAME' };
//     }
//     //--now actual insert    
//             let q = new MathFull(questionData.question);
//             const question = await q.save();
            
//       return { question , ok : true};
//  } catch (e) {
//     return {message: e.message , ok:false,errorCode : e.code}
//  }

// }
// static async CreateQReg(questionType,board,classNo,chapter,exercise,questionNo,part){
//  try{
// //  debugger;
//     const qReg = getQReg(questionType,board,classNo,chapter,exercise,questionNo,part);
//     const questionData = checkNewQ(qReg);
//         const existingQuestion = await MathFull.findOne(
//       { filename: questionData. question.filename });
//   if (existingQuestion) {
//       return { message: 'Duplicate filename', ok: false, errorCode: 'DUPLICATE_FILENAME' };
//     }        
//             let q = new MathFull(questionData.question);
//             const question = await q.save();
            
//       return { question ,ok:true};
//  } catch (e) {
//     return {message: e.message , ok:false,errorCode : e.code}
//  }

// }
static async CreateQuestion(qData){
 try{
//  debugger;
    const questionData = getQuestionData(qData);

    if(questionData.ok){
      let q = new MathFull(questionData.question);
      const question = await q.save();
      return {ok:true , question};
    }else {
        return {ok:false,message:questionData.message};
    }
    
 } catch (e) {
    if(e.code == 11000){
    return {message: 'Question already exists' , ok:false}
    }else{
    return {message: e.message , ok:false,errorCode : e.code}
    }
 }

}
///////////////////////////////
static async Where(query={}) {
   try {
   // Use Mongoose's "find" method with the provided query
   const questions = await MathFull.find(query);

   return { questions, ok: true };
   } catch (e) {
   return { message: e.message, ok: false, errorCode: e.code };
   }
}
//////////////////////////
static async Count(query={}) {
   try {
   const count = await MathFull.countDocuments(query);
   return { count, ok: true };
   } catch (e) {
   return { message: e.message, ok: false, errorCode: e.code };
   }
}
//////////////////////////
static async Delete(id){
try{
//  debugger;
     let objectId = new mongoose.Types.ObjectId(id);
     const question = await MathFull.findById(objectId );    
     if (!question){
            return {ok : false ,message : "question not found", status:404 };
     }
     if (question.slides.length > 0){
            return {ok : false ,message : "question has content", status:500 };
     }
     
     await MathFull.findByIdAndRemove(objectId );    
     return {ok : true ,message : "Question deleted", status:200 };

}catch(err){
    return {ok : false , message : "Failed to delete", };
}  
}

}//questions

module.exports = MathFullObj;

