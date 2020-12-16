import SimpleService from './simple/simpleService';
import simpleSingleton from './simple/simpleSingleton';

const simpleService = new SimpleService();

(async () => {
  console.log(
    'Imported entity creation time: ',
    simpleSingleton.getCreationDate()
  );
  await new Promise((r) => setTimeout(r, 1000));
  console.log('Created instance creation time:', simpleService.created);
  await new Promise((r) => setTimeout(r, 1000));
  console.log(
    'Imported entity creation time: ',
    simpleSingleton.getCreationDate()
  );
  await new Promise((r) => setTimeout(r, 1000));
  console.log('Created instance creation time:', simpleService.created);
})();
