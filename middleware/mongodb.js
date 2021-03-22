import mongoose from 'mongoose'

const connectDB = handler => async (req, res) => {
    if(mongoose.connection.readyState >= 1) return handler(req, res)
    
    mongoose.connect(`mongodb+srv://noteUser:${process.env.DB_PASS}@cluster0.bjqy0.mongodb.net/note?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'))
    db.once('open', function() {
      return handler(req, res)
    })
}

export default connectDB