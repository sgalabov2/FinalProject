import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';

const auth = getAuth();

export const useAuthentication = () => {
  const [user, setUser] = useState<User>();

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(undefined);
        }
      }),
    []
  );

  return { user };
};
