const breeds = {
  beagle: 'Beagle',
  'golden-retriever': 'Golden Retriever',
  poodle: 'Poodle'
};

const form = document.querySelector('#adopt-form');
const breedSelect = document.querySelector('#breed');
const nameInput = document.querySelector('#dog-name');
const nameError = document.querySelector('#name-error');
const petCard = document.querySelector('#pet-card');
const petImage = document.querySelector('#pet-image');
const petName = document.querySelector('#pet-name');
const petBreed = document.querySelector('#pet-breed');
const petDay = document.querySelector('#pet-day');
const petStage = document.querySelector('#pet-stage');
const petHappiness = document.querySelector('#pet-happiness');

let dog = null;

function renderDog() {
  form.hidden = Boolean(dog);
  petCard.hidden = !dog;
  if (!dog) return;

  petName.textContent = dog.name;
  petBreed.textContent = breeds[dog.breed];
  petDay.textContent = dog.day;
  petStage.textContent = 'Puppy';
  petHappiness.textContent = dog.happiness + ' / 100';
  petImage.src = 'assets/' + dog.breed + '.svg';
  petImage.alt = 'Illustration of a ' + breeds[dog.breed];
}

function showNameError(message) {
  nameError.textContent = message;
  if (message) {
    nameInput.setAttribute('aria-invalid', 'true');
    nameInput.focus();
  } else {
    nameInput.removeAttribute('aria-invalid');
  }
}

function adoptDog(event) {
  event.preventDefault();
  if (dog) return;

  const name = nameInput.value.trim();
  if (!name || name.length > 20) {
    showNameError('Enter a dog name with 1 to 20 characters.');
    return;
  }

  dog = { name, breed: breedSelect.value, day: 1, happiness: 50 };
  showNameError('');
  form.reset();
  renderDog();
  petName.focus();
}

function careForDog() {
  if (!dog) return;
  dog.happiness = Math.min(100, dog.happiness + 10);
  renderDog();
}

form.addEventListener('submit', adoptDog);
nameInput.addEventListener('input', () => showNameError(''));
document.querySelector('#feed').addEventListener('click', careForDog);
document.querySelector('#play').addEventListener('click', careForDog);
renderDog();
