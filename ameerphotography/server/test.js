const mongoose = require('mongoose');
const Enquiry = require('./src/models/Enquiry');

mongoose.connect('mongodb://jaseervp:jaseer5162@ac-fswobly-shard-00-00.s9s7zsw.mongodb.net:27017,ac-fswobly-shard-00-01.s9s7zsw.mongodb.net:27017,ac-fswobly-shard-00-02.s9s7zsw.mongodb.net:27017/ameerphotography?ssl=true&replicaSet=atlas-n3j2pl-shard-0&authSource=admin&retryWrites=true&w=majority')
  .then(async () => { 
    const startOfMonth = new Date(); 
    startOfMonth.setDate(1); 
    startOfMonth.setHours(0,0,0,0); 
    
    const endOfMonth = new Date(startOfMonth); 
    endOfMonth.setMonth(endOfMonth.getMonth() + 1); 
    
    const count = await Enquiry.countDocuments({ status: 'confirmed', eventDate: { $gte: startOfMonth, $lt: endOfMonth } }); 
    console.log('Bookings in July (with eventDate filter):', count); 
    
    const totalCount = await Enquiry.countDocuments({ status: 'confirmed' }); 
    console.log('Total confirmed bookings (no date filter):', totalCount); 
    
    process.exit(0); 
  })
  .catch(console.error);
