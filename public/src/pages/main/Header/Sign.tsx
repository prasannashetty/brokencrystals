import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getAdminStatus,
  getUserPhoto,
  putPhoto
} from '../../../api/httpClient';
import { RoutePath } from '../../../router/RoutePath';

export const Sign: FC = () => {
  const user = sessionStorage.getItem('email');
  const userName = sessionStorage.getItem('userName');
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [userImage, setUserImage] = useState<string | null>();

  useEffect(() => {
    getPhoto();
    checkIsAdmin();
  }, [isAdminUser]);

  const checkIsAdmin = () => {
    if (user) {
      getAdminStatus(user).then((data) => {
        setIsAdminUser(data.isAdmin);
      });
    }
  };

  const sendPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File = (e.target.files as FileList)[0];
    if (!file || !user) return null;

    putPhoto(file, user).then(() => getPhoto());
  };

  const getPhoto = () => {
    if (!user) return null;

    getUserPhoto(user).then((data) => {
      const base64 = new Buffer(data, 'binary').toString('base64');
      base64 && setUserImage(`data: image / png; base64, ${base64}`);
    });
  };

  const logout = () => {
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userName');
    window.location.reload();
  };

  return (
    <>
      {user ? (
        <>
          <label htmlFor="file-input" className="file-input-label">
            <img
              src={userImage || 'assets/img/profile.png'}
              alt=""
              className="profile-image"
            />
          </label>
          <a href={RoutePath.Userprofile} className="get-started-btn">
            Edit data
          </a>
          {isAdminUser && (
            <a href={RoutePath.Adminpage} className="get-started-btn">
              Adminpage
            </a>
          )}
          <Link
            to={RoutePath.Home}
            className="get-started-btn scrollto"
            onClick={logout}
          >
            Log out {userName}
          </Link>
          <input
            id="file-input"
            type="file"
            accept="image/x-png"
            style={{ display: 'none' }}
            onChange={sendPhoto}
          />
        </>
      ) : (
        <a href={RoutePath.Login} className="get-started-btn scrollto">
          Sign in
        </a>
      )}
    </>
  );
};

export default Sign;
