
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const dbUrl = process.env.DB_URL;

//'mongodb://localhost:27017/yelp-camp'
mongoose.connect("mongodb+srv://kxbj94:Ht8DAf5ESqA7D8ka@cluster0.qflrles.mongodb.net/?retryWrites=true&w=majority");

const db = mongoose.connection;
db.on('error', console.log.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 150; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '641dcfc45abce6d6f3c9388d',
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                
                type: "Point",
                coordinates: [cities[rand1000].longitude, cities[rand1000].latitude]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/djsd8fiac/image/upload/v1675824847/samples/animals/three-dogs.jpg',
                    filename: 'samples/animals/three-dogs',
                },
                {
                    url: 'https://res.cloudinary.com/djsd8fiac/image/upload/v1677106246/YelpCamp/mazjbtv3pzemvnmd9rhj.jpg',
                    filename: 'YelpCamp/mazjbtv3pzemvnmd9rhj.jpg',
                }
            ],
            description: 'lorem does not work on strings for some reason and I do not care enough to figure it out now',
            price: rand1000
        })
        await camp.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close();
});