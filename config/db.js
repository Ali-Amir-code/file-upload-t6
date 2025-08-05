import {connect} from 'mongoose';

export default async function connectDB(){
    try{
        await connect(process.env.MONGO_URI);
        console.log('DataBase Connected');
    }catch(e){
        console.error('Error Connecting with DataBase.');
        console.error('Error: ', e);
        process.exit(1);
    }
}