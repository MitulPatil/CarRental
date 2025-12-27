import Car from './models/Cars.js';
import connectDB from './configs/db.js';
import 'dotenv/config';

await connectDB();

try {
    const cars = await Car.find({ isAvailable: true });
    
    console.log('\n=== Cars in Database ===');
    cars.forEach(c => {
        console.log(`${c.brand} ${c.model} - Location: "${c.location}"`);
    });
    
    const locations = [...new Set(cars.map(c => c.location))];
    console.log('\n=== Unique Locations in Database ===');
    console.log(locations);
    
    console.log('\n=== Your cityList dropdown has ===');
    console.log(['Vadodara', 'Ahmedabad', 'Mumbai', 'Pune']);
    
    console.log('\n=== Do they match? ===');
    const cityList = ['Vadodara', 'Ahmedabad', 'Mumbai', 'Pune'];
    const hasMatch = locations.some(loc => cityList.includes(loc));
    console.log(hasMatch ? 'YES - Some locations match!' : 'NO - Locations do not match!');
    
} catch (error) {
    console.error('Error:', error.message);
} finally {
    process.exit();
}
