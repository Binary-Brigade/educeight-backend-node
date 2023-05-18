import mongoose from 'mongoose';

const StudentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // To uncommented once we decide to have different schools on the platform
    // school:{
    //     type: String,
    //     required: true
    // },
    class:{
        type: String,
        required: true
    },
    courses:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ],
    assignments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Assignment',
    }
],
// meetings:[
//     {
//         type: mongoose.Schema.ObjectId,
//         ref: 'Meeting',
//     }
// ],
// notifications:[
//     {
//         message: String,
//         timeStamp: Date,
//         isRead: Boolean
//     }
// ]
}, {timeStamps: true})

const Student = mongoose.model('Student', StudentSchema)
export default Student;