const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://john:${password}@cluster0.xttjtmx.mongodb.net/noteApp?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

mongoose
  .connect(url)
  .then(() => {
    if (process.argv.length === 3) {
      Person.find({}).then((result) => {
        console.log('Phonebook:');
        result.forEach((person) => {
          console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
      });
    } else if (process.argv.length === 5) {
      const name = process.argv[3];
      const number = process.argv[4];

      const person = new Person({
        name: name,
        number: number,
      });

      person.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
      });
    }
  })
  .catch((err) => console.log(err));
