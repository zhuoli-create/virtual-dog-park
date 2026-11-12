const breeds = {
  beagle: 'Beagle',
  'golden-retriever': 'Golden Retriever',
  poodle: 'Poodle'
};

const storageKey = 'virtualDogParkPetV1';

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

const petGrowth = document.querySelector('#pet-growth');
const storageNotice = document.querySelector('#storage-notice');

let dog = loadDog();

function showStorageNotice(message) {
  storageNotice.textContent = message;
  storageNotice.hidden = !message;
}

function loadDog() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return null;

    const pet = JSON.parse(saved);
    // Check the saved values before using them to display a dog.
    if (pet && typeof pet.name === 'string' && pet.name.trim() &&
        pet.name.length <= 20 && Object.hasOwn(breeds, pet.breed) &&
        Number.isSafeInteger(pet.day) && pet.day >= 1 &&
        Number.isInteger(pet.happiness) && pet.happiness >= 0 && pet.happiness <= 100) {
      return pet;
    }
  } catch {
    showStorageNotice('Saved progress could not be opened. You can still adopt a dog.');
  }
  return null;
}

function saveDog() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(dog));
    showStorageNotice('');
  } catch {
    showStorageNotice('Progress could not be saved in this browser.');
  }
}

function stageFor(day) {
  if (day === 1) return { name: 'Puppy', progress: 1 };
  if (day <= 3) return { name: 'Young Dog', progress: 2 };
  return { name: 'Adult Dog', progress: 3 };
}

function renderDog() {
  form.hidden = Boolean(dog);
  petCard.hidden = !dog;
  if (!dog) return;

  petName.textContent = dog.name;
  petBreed.textContent = breeds[dog.breed];
  petDay.textContent = dog.day;
  const stage = stageFor(dog.day);
  petStage.textContent = stage.name;
  petGrowth.value = stage.progress;
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
  saveDog();
  renderDog();
  petName.focus();
}

function careForDog() {
  if (!dog) return;
  dog.happiness = Math.min(100, dog.happiness + 10);
  saveDog();
  renderDog();
}

function nextDay() {
  if (!dog) return;
  dog.day += 1;
  dog.happiness = Math.max(0, dog.happiness - 5);
  saveDog();
  renderDog();
}

function startOver() {
  if (!dog || !window.confirm('Start over and delete your saved dog?')) return;

  try {
    localStorage.removeItem(storageKey);
  } catch {
    showStorageNotice('Saved progress could not be deleted. Your dog is still here.');
    return;
  }

  dog = null;
  showStorageNotice('');
  renderDog();
  nameInput.focus();
}

form.addEventListener('submit', adoptDog);
nameInput.addEventListener('input', () => showNameError(''));
document.querySelector('#feed').addEventListener('click', careForDog);
document.querySelector('#play').addEventListener('click', careForDog);
document.querySelector('#next-day').addEventListener('click', nextDay);
document.querySelector('#start-over').addEventListener('click', startOver);
renderDog();
