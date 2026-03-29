import { firebaseSecrets } from './environment.secrets';

export const environment = {
  production: false,
  firebase: {
    apiKey: firebaseSecrets.apiKey,
    authDomain: firebaseSecrets.authDomain,
    projectId: firebaseSecrets.projectId,
    storageBucket: firebaseSecrets.storageBucket,
    messagingSenderId: firebaseSecrets.messagingSenderId,
    appId: firebaseSecrets.appId,
  },
};
